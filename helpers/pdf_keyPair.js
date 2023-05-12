const { schema } = require('../config')

const runQuery = async (db, query) => {
    let queryType = query?.split(' ')[0]?.toUpperCase()
    let Type = (db?.QueryTypes?.[queryType]) ? (db?.QueryTypes?.[queryType]) : (db?.QueryTypes?.["SELECT"]) 
    const data = await db.query(query, { type: Type })
    return Array.isArray(data) ? data?.flat() : data
}

const isNull = (value) => { //work for strings/numbers/arrays/objects/boolean
    if (typeof value == 'number' || typeof value == 'boolean' || value == 'true') { //if any number let it be 0 or any boolean, it will return false
        return false
    }
    else if (Array.isArray(value)) { //if its empty array it will return true
        return Boolean(value?.length)
    }
    else if (value && typeof value == 'object') { //if empty object, returns true
        return Boolean(Object.keys(value)?.length)
    }
    else { //now lets check for string
        return !value || value == undefined || value == null || value?.trim()?.toLowerCase() == 'null' || value?.trim()?.toLowerCase() == 'undefined' || value?.trim()?.toLowerCase() == 'false'
    }
}

const str_validated_field_name = 'validated_field_name'
const str_validated_field_value = 'validated_field_value'

exports.shouldFieldUpdate = async (req, db) => {
    return new Promise(async (resolve, reject) => {
        let body = req?.body
        let id = body?.id
        let validated_field_name = body?.[str_validated_field_name]
        let validated_field_value = body?.[str_validated_field_value]

        const hasFieldName = !isNull(validated_field_name)
        const hasFieldValue = !isNull(validated_field_value)
        const sqlQuery = `SELECT * FROM ${schema}.schema_form_key_pairs WHERE id='${id}'`
        console.log(`body => `, body, `query `, sqlQuery)

        if (id) {
            let queryResults = await runQuery(db, sqlQuery)
            let key_pair = queryResults?.flat()?.[0]

            let previousFieldName = key_pair?.[str_validated_field_name]
            let previousFieldValue = key_pair?.[str_validated_field_value]

            if (hasFieldName && isNull(previousFieldName)) {
                resolve(true)
            }
            else if (hasFieldValue && isNull(previousFieldValue)) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        }
        else {
            reject({ message: 'Unknown error occurred', developerInfo: { message: 'Missing params', body: body, query: sqlQuery } })
        }
    })
}

exports.updateField = async (req, db)  => {
    let body = req?.body
    let id = body?.id
    let validated_field_name = body?.validated_field_name
    let validated_field_value = body?.validated_field_value

    const hasFieldName = !isNull(validated_field_name)
    const hasFieldValue = !isNull(validated_field_value)

    const sqlQuery = `UPDATE ${schema}.schema_form_key_pairs SET ${hasFieldName ? `${str_validated_field_name}='${validated_field_name}'` : ''} ${(hasFieldName && hasFieldValue) ? ',' : ''} ${hasFieldValue ? ` ${str_validated_field_value}='${validated_field_value}'` : ''} WHERE id='${id}'`
    console.log(`body => `, body, `query `, sqlQuery)
    // console.log(sqlQuery)
    const option = {
        location: 'US',
        query: sqlQuery
    }

    return await runQuery(db, sqlQuery)
}