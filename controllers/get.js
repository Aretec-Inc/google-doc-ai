const { runQuery, validateData, imageTextDetection, isNull, apiResponse, successFalse, getAuthUrl } = require('virgin-helpers')
const { service_key, projectId } = require('../config')
const { getDocumentAIProcessorsList } = require('../helpers')

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


module.exports = {
    getAllProcessors
}