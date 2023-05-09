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
        let sqlQuery = `SELECT * FROM ${schema}.submissions order by created_at desc;`

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
        const { template_id } = req?.query

        if (!template_id) {
            throw 'Template Id is Required!'
        }
        let sqlQuery = `SELECT * FROM ${schema}.documents WHERE template_id='${template_id}' order by created_at desc;`

        // Run the query
        let documents = await runQuery(postgresDB, sqlQuery)

        for (var i in documents) {
            documents[i].file_address = await getAuthUrl(documents?.[i]?.file_address, storage)
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

const manageAndResolvePDFData = async (req, res, artifactData) => {

    let isCompleted = Boolean(artifactData?.is_completed)
    let redacted_file_address = await getAuthUrl(artifactData?.redacted_file_address, storage)

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
            artifactData: { //artifact data which needs reload.
                is_completed: isCompleted,
                redacted_file_address
            }
        })
    }
    else {
        res.send({ success: false, message: "File still in process!", developerInfo: { message: "Did not receive data from database, looks like the A.I hasn't been applied to the file yet.", body: req?.body, query: req?.query } })
    }
}

const getPdfData = async (req, res) => {
    const file_name = req?.query?.file_name || req?.query?.file_name || req?.body?.file_name
    let [documentData] = await pdfparser.getDocumentData(file_name)
    let error = !isNull(documentData?.error) ? documentData?.error : null
    let hasError = Boolean(error)

    try {
        if (documentData?.is_completed) {
            if (!hasError) {
                manageAndResolvePDFData(req, res, documentData)
            }
            else {

                throw new Error(documentData?.error)
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
    getPdfData
}