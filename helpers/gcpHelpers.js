const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1beta3

const getDocumentAIProcessorsList = (service_key, projectId) => {
    //https://googleapis.dev/nodejs/documentai/latest/v1beta3.DocumentProcessorServiceClient.html#listProcessors
    return new Promise(async (resolve, reject) => {
        try {
            const docAIParent = `projects/${projectId}/locations/us`
            const DocAIclient = new DocumentProcessorServiceClient({
                projectId,
                credentials: service_key
            })
            let d = await DocAIclient.listProcessors({ parent: docAIParent })
            let noNulls = d?.filter(Boolean)?.flat()

            let allProcessors = noNulls?.map((d) => {
                let processorName = d?.name
                let processorID = processorName?.slice(processorName?.lastIndexOf('/') + 1, processorName?.length)
                let displayName = d?.displayName
                return { id: processorID, displayName, type: d?.type, state: d?.state }
            })?.filter(d => Boolean(d?.id && d?.state == 'ENABLED'))
            resolve(allProcessors)
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getDocumentAIProcessorsList
}