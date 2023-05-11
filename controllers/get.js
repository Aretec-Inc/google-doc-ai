const _ = require('lodash')
const pdfparser = require('./pdf')
const { service_key, projectId, schema, postgresDB, storage } = require('../config')
const { getDocumentAIProcessorsList, runQuery, apiResponse, successFalse, getAuthUrl, isNull } = require('../helpers')

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
        let sqlQuery = `SELECT s.*, CAST(COUNT(d.submission_id) as INT) AS total_forms FROM ${schema}.submissions s
        LEFT JOIN ${schema}.documents d ON s.id = d.submission_id GROUP BY 
        s.id order by s.created_at desc;`

        // Run the query
        let allSubmissions = await runQuery(postgresDB, sqlQuery)

        let obj = {
            success: true,
            allSubmissions
        }

        apiResponse(res, 201, obj)
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message || e)
    }
}

const getDocumentsById = async (req, res) => {
    try {
        const { submission_id } = req?.query

        if (!submission_id) {
            throw 'Submission Id is Required!'
        }
        let sqlQuery = `SELECT d.*, ARRAY_AGG(CAST(s.confidence AS FLOAT)) AS average_confidence FROM ${schema}.documents d
        LEFT JOIN ${schema}.schema_form_key_pairs AS s
        ON d.file_name = s.file_name
        WHERE d.submission_id='${submission_id}'
        GROUP BY d.id order by created_at desc;`

        // Run the query
        let documents = await runQuery(postgresDB, sqlQuery)

        for (var i in documents) {
            documents[i].file_address = await getAuthUrl(documents?.[i]?.file_address, storage)
            documents[i].average_confidence = _.round(_.mean(documents[i].average_confidence) * 100)
        }

        let obj = {
            success: true,
            documents
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

        let [documents, submissions] = await Promise.allSettled(promises)

        let obj = {
            success: true,
            documents: documents?.value[0]?.count,
            submissions: submissions?.value[0]?.count
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

module.exports = {
    getAllProcessors,
    getAllSubmmissions,
    getDocumentsById,
    getPdfData,
    getDashboardData
}