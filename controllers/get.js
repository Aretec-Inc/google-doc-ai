const _ = require('lodash')
const pdfparser = require('./pdf')
const { service_key, projectId, schema, postgresDB, storage } = require('../config')
const { getDocumentAIProcessorsList, runQuery, apiResponse, successFalse, getAuthUrl, isNull, calculateOffset } = require('../helpers')

const getAllProcessors = async (req, res) => {
    try {
        let allProcessors = await getDocumentAIProcessorsList(service_key, projectId)

        let obj = { success: true, allProcessors }

        return apiResponse(res, 200, obj)
    }
    catch (e) {
        return successFalse(res, e?.message)
    }
}

const getAllSubmmissions = async (req, res) => {
    try {
        let { submissionName, processorId, dateRange, pageNo, pageSize } = req?.body
        let whereClause = ``
        pageSize = pageSize || 10
        let offset = calculateOffset(pageNo, pageSize)

        if (submissionName) {
            whereClause += ` s.submission_name ILIKE '%${submissionName}%' AND`
        }

        if (processorId) {
            whereClause += ` s.processor_id='${processorId}' AND`
        }

        if (dateRange?.start && dateRange?.end) {
            whereClause += `s.created_at BETWEEN '${dateRange?.start}' AND '${dateRange?.end}' AND`
        }

        if (whereClause?.length > 5) {
            whereClause = `WHERE ${whereClause?.slice(0, -3)}`
        }

        let sqlQuery = `SELECT s.*, CAST(COUNT(DISTINCT d.file_name) as INT) AS total_forms, ARRAY_AGG(CAST(k.confidence AS FLOAT)) AS average_confidence FROM ${schema}.submissions s
        LEFT JOIN ${schema}.documents d ON s.id = d.submission_id 
        LEFT JOIN google_doc_ai.schema_form_key_pairs AS k ON d.file_name = k.file_name
        ${whereClause}
        GROUP BY s.id order by s.created_at desc LIMIT ${pageSize} OFFSET ${offset};`

        // Run the query
        let allSubmissions = await runQuery(postgresDB, sqlQuery)

        for (var i in allSubmissions) {
            allSubmissions[i].average_confidence = _.round(_.mean(allSubmissions[i].average_confidence) * 100)
        }

        sqlQuery = `SELECT CAST(COUNT(DISTINCT s.id) as INT) AS total_submissions FROM ${schema}.submissions s
        LEFT JOIN ${schema}.documents d ON s.id = d.submission_id 
        LEFT JOIN google_doc_ai.schema_form_key_pairs AS k ON d.file_name = k.file_name
        ${whereClause}`

        let totalSubmissions = await runQuery(postgresDB, sqlQuery)

        let obj = {
            success: true,
            allSubmissions,
            totalSubmissions: totalSubmissions[0]?.total_submissions
        }

        apiResponse(res, 200, obj)
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message || e)
    }
}

const getFilesById = async (req, res) => {
    try {
        const { submission_id } = req?.query
        const { fileName, dateRange, pageNo, pageSize } = req?.body

        if (!submission_id) {
            throw 'Submission Id is Required!'
        }

        let whereClause = ``
        let offset = calculateOffset(pageNo, pageSize)

        if (fileName) {
            whereClause += `AND d.file_name ILIKE '%${fileName}%' `
        }

        if (dateRange?.start && dateRange?.end) {
            whereClause += `AND d.created_at BETWEEN '${dateRange?.start}' AND '${dateRange?.end}'`
        }

        whereClause = `WHERE d.submission_id='${submission_id}' ${whereClause}`

        let sqlQuery = `SELECT d.*, ARRAY_AGG(CAST(s.confidence AS FLOAT)) AS average_confidence FROM ${schema}.documents d
        LEFT JOIN ${schema}.schema_form_key_pairs AS s
        ON d.file_name = s.file_name
        ${whereClause}
        GROUP BY d.id order by created_at desc LIMIT ${pageSize} OFFSET ${offset};`

        let documents = await runQuery(postgresDB, sqlQuery)

        sqlQuery = `SELECT CAST(COUNT(DISTINCT d.file_name) as INT) AS total_files FROM ${schema}.documents d
        LEFT JOIN ${schema}.schema_form_key_pairs AS s
        ON d.file_name = s.file_name
        ${whereClause}
        GROUP BY d.submission_id;`

        let totalFiles = await runQuery(postgresDB, sqlQuery)

        for (var i in documents) {
            documents[i].file_address = await getAuthUrl(documents?.[i]?.file_address, storage)
            documents[i].min_confidence = _.round(_.min(documents[i].average_confidence) * 100)
            documents[i].average_confidence = _.round(_.mean(documents[i].average_confidence) * 100)
        }

        let obj = {
            success: true,
            documents,
            totalFiles: totalFiles[0]?.total_files
        }

        apiResponse(res, 200, obj)
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message || e)
    }
}

const getDashboardData = async (req, res) => {
    try {
        let promises = []
        let sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.documents`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.submissions`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.schema_form_key_pairs`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.schema_form_key_pairs WHERE validated_field_value IS NOT NULL`

        promises.push(runQuery(postgresDB, sqlQuery))

        let [documents, submissions, totalFields, totalFixes] = await Promise.allSettled(promises)

        console.log('totalFields', totalFields, totalFixes)
        totalFields = totalFields?.value[0]?.count
        totalFixes = totalFixes?.value[0]?.count

        let accuracy = 100 - ((totalFixes / totalFields) * 100).toFixed(1)

        let obj = {
            success: true,
            documents: documents?.value[0]?.count,
            submissions: submissions?.value[0]?.count,
            accuracy
        }

        apiResponse(res, 200, obj)
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message || e)
    }
}

const manageAndResolvePDFData = async (req, res, fileData) => {

    let isCompleted = Boolean(fileData?.is_completed)

    let { parsedPages, key_pairs } = await pdfparser.generateDataFromBigQuery(req, res)
    let hasKeyPairs = Boolean(Array.isArray(key_pairs) && key_pairs.length)
    let hasParsedPages = Boolean(Array.isArray(parsedPages) && parsedPages?.length)

    if (hasParsedPages || hasKeyPairs) {

        res.send({
            //isSchemaGenerated,
            success: true,
            //raw_data: document || {},
            parsed_data: parsedPages,
            key_pairs: key_pairs || [],
            fileData: {
                is_completed: isCompleted
            }
        })
    }
    else {
        res.send({ success: false, message: 'File still in process!', developerInfo: { message: "Did not receive data from database, looks like the A.I hasn't been applied to the file yet.", body: req?.body, query: req?.query } })
    }
}

const getPdfData = async (req, res) => {
    const file_name = req?.query?.file_name || req?.query?.file_name || req?.body?.file_name
    let [fileData] = await pdfparser.getDocumentData(file_name)
    let error = !isNull(fileData?.error) ? fileData?.error : null
    let hasError = Boolean(error)

    try {
        if (fileData?.is_completed) {
            if (!hasError) {
                manageAndResolvePDFData(req, res, fileData)
            }
            else {

                throw new Error(fileData?.error)
            }
        }
        else {
            res.send({
                success: false,
                message: "We're still processing this form, Please wait.",
                code: 'AI_FAILED'
            })
        }
    }
    catch (e) {
        console.log(e, "==> error In PDF API")
        res.send({ success: false, error: e, message: e?.message || "Something wen't wrong!" })
    }
}

const invoiceColumns = ['amount_paid_since_last_invoice', 'carrier', 'currency', 'currency_exchange_rate', 'delivery_date', 'due_date', 'freight_amount', 'invoice_date', 'invoice_id', 'line_item', 'line_item/amount', 'line_item/description', 'line_item/product_code', 'line_item/purchase_order', 'line_item/quantity', 'line_item/unit', 'line_item/unit_price', 'net_amount', 'payment_terms', 'purchase_order', 'receiver_address', 'receiver_email', 'receiver_name', 'receiver_phone', 'receiver_tax_id', 'receiver_website', 'remit_to_address', 'remit_to_name', 'ship_from_address', 'ship_from_name', 'ship_to_address', 'ship_to_name', 'supplier_address', 'supplier_email', 'supplier_iban', 'supplier_name', 'supplier_payment_ref', 'supplier_phone', 'supplier_registration', 'supplier_tax_id', 'supplier_website', 'total_amount', 'total_tax_amount', 'vat', 'vat/amount', 'vat/category_code', 'vat/tax_amount', 'vat/tax_rate']

const exportData = async (req, res) => {
    try {
        let sqlQuery = `SELECT d.file_name, json_agg(s.*) AS key_value FROM google_doc_ai.documents d
        LEFT JOIN google_doc_ai.schema_form_key_pairs s ON d.file_name = s.file_name
        WHERE d.submission_id='45bf1ef8-8edc-4611-8829-9d09c988314b' AND s.field_name IN (${invoiceColumns?.map(v => ` '${v}'`)})
        GROUP BY d.file_name;`

        let allData = await runQuery(postgresDB, sqlQuery)

        for (var v of allData) {
            var key_value = v?.key_value
            console.log('key_value', key_value?.map(v => v?.field_name))
            console.log(v?.file_name)
            // for (var k of key_value) {
            //     console.log('k', k)
            //     break
            // }
            // break
        }

        // apiResponse(res, 200, obj)
    }
    catch (e) {
        console.log('e', e)
        // return successFalse(res, e?.message || e)
    }
}

// exportData()

module.exports = {
    getAllProcessors,
    getAllSubmmissions,
    getFilesById,
    getPdfData,
    getDashboardData,
}