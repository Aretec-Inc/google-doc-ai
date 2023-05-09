const { runQuery } = require('./postgresQueries')
const { postgresDB, schema } = require('../config')

const { v4: uuidv4 } = require('uuid')
const types = require('../constants')

const applyRegex = (value) => value ? value?.replace(/\n|\r/g, "")?.replace(/\'/gi, "\\'") : null
const cleanFieldName = (name, dontTrim) => {
    /**
     *  A column name must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_), and it must start with a letter or underscore. The maximum column name length is 300 characters. A column name cannot use any of the following prefixes:

     */
    let removeExtraSpacesOrUnderScore = (txt) => txt?.replace(/ |\/|\\/gi, '_')?.replace(/__/gi, '_')

    let cleanedWord = removeExtraSpacesOrUnderScore((dontTrim ? name : name?.trim())?.replace(/[^a-z0-9_/\\ ]/gi, ""))
    if (cleanedWord?.startsWith("_")) {
        cleanedWord = cleanedWord?.slice(1, cleanedWord?.length)
        cleanedWord = removeExtraSpacesOrUnderScore(cleanedWord)
    }

    if (!isNaN(cleanedWord?.[0])) {
        cleanedWord = "a_" + cleanedWord?.slice(0, cleanedWord?.length)
        cleanedWord = removeExtraSpacesOrUnderScore(cleanedWord)
    }
    return cleanedWord
}

exports.gen_form_key_pair_values = ({ file_name, field_name, field_value, time_stamp, confidence, updated_by, key_x1, key_x2, key_y1, key_y2, value_x1, value_x2, value_y1, value_y2, pageNumber, type, field_name_confidence, field_value_confidence }) => {


    const f_name = `'${file_name}'`
    const field_n = `'${applyRegex(field_name)}'`
    const field_v = `'${applyRegex(field_value)}'`
    const t_stamp = `'${new Date().getUTCMilliseconds()}'`
    const v_field_n = null //`'${applyRegex(validated_field_name)}'`
    const v_field_v = null //`'${applyRegex(validated_field_value)}'`

    const u_date = `NOW()`
    const confi = `'${confidence}'`
    const updated_b = `'${updated_by || null}'`
    const k_x1 = parseFloat(key_x1) || 0
    const k_x2 = parseFloat(key_x2) || 0
    const k_y1 = parseFloat(key_y1) || 0
    const k_y2 = parseFloat(key_y2) || 0

    const v_x1 = parseFloat(value_x1) || 0
    const v_x2 = parseFloat(value_x2) || 0
    const v_y1 = parseFloat(value_y1) || 0
    const v_y2 = parseFloat(value_y2) || 0
    const pageN = parseInt(pageNumber) || 0

    const id = `'${uuidv4()}'`
    let isEntity = type == types.typeEntities
    const typ = `'${type || types.typeFormFields}'`

    const f_n_c = `'${field_name_confidence}'`
    const f_v_c = `'${field_value_confidence}'`

    const column_name = `'${cleanFieldName(field_n)}'`
    let finalValues = `(${f_name}, ${field_n}, ${field_v}, ${t_stamp}, ${isEntity ? column_name : v_field_n},${v_field_v}, ${u_date},${confi},${null},${k_x1},${k_x2},${k_y1},${k_y2},${v_x1},${v_x2},${v_y1},${v_y2},${pageN},${id},${typ},${f_n_c},${f_v_c},${column_name})`

    return finalValues
}

exports.insert_form_key_pair_with_values = async ({ VALUES, formKeyPairTableName }) => {
    try {
        if (VALUES) {
            VALUES = VALUES?.replace(/\\'/gi, "''")

            const sqlQuery = `INSERT INTO ${formKeyPairTableName} (file_name, field_name, field_value, time_stamp, validated_field_name, validated_field_value, updated_date, confidence, updated_by, key_x1, key_x2, key_y1, key_y2, value_x1, value_x2, value_y1, value_y2, page_number, id, type, field_name_confidence, field_value_confidence, column_name) VALUES${VALUES}`
            // console.log("KEYPAIR ************ **** * * ** * * * * * ** * \n\n\n\n", sqlQuery, "\n\n\n\n")

            // Run the query
            return runQuery(postgresDB, sqlQuery)
            // return this.runBigQuery(sqlQuery)
        }
        else {
            throw new Error({ code: "MISSING_VALUES", message: `Opps..! something wen't wrong`, developerInfo: { VALUES, message: 'VALUES param missing' } })
        }
    }
    catch (e) {
        console.error(e)
        throw e
    }
}

exports.pdf_document = ({ file_name, pages_count, entities_count, text }) => {

    const f_name = `'${file_name}'`
    const p_count = parseInt(pages_count)
    const e_count = parseInt(entities_count)
    // const txt = `'${JSON.stringify(text)?.replace(/\'/gi, "\\'")}'`

    let txt = `'${JSON.stringify(text)?.replace(/\'/gi, "''")}'`

    const sqlQuery = `INSERT INTO ${schema}.pdf_documents VALUES(${f_name},${p_count},${e_count},${txt},null)`
    return runQuery(postgresDB, sqlQuery)
    // return this.runBigQuery(sqlQuery)
}

exports.pdf_pages = ({ file_name, dimensions, pageNumber, paragraphs }) => {

    const f_name = `'${file_name}'`
    const dim = `'${JSON.stringify(dimensions)}'`
    const pageN = parseInt(pageNumber) || 0
    const id = `'${uuidv4()}'`
    // const para = `'${JSON.stringify(paragraphs)?.replace(/\'/gi, "\\'")}'`

    let para = `'${JSON.stringify(paragraphs)?.replace(/\'/gi, "''")}'`

    const sqlQuery = `INSERT INTO ${schema}.pdf_pages VALUES(${id}, ${f_name}, ${dim}, ${pageN}, ${para})`;
    // console.log("pdf_pages SQLQUERY=> ", sqlQuery)

    return runQuery(postgresDB, sqlQuery)
    // return this.runBigQuery(sqlQuery)
}