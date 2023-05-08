const { service_key, projectId, schema, contextOltp } = require('../config')
const { getDocumentAIProcessorsList, runQuery, apiResponse, successFalse } = require('../helpers')

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
        let allSubmissions = await runQuery(contextOltp, sqlQuery)

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

module.exports = {
    getAllProcessors,
    getAllSubmmissions
}