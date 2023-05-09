const { service_key, projectId, schema, postgresDB, storage } = require('../config')
const { getDocumentAIProcessorsList, runQuery, apiResponse, successFalse, getAuthUrl } = require('../helpers')

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

module.exports = {
    getAllProcessors,
    getAllSubmmissions,
    getDocumentsById
}