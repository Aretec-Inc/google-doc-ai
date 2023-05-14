const { schema } = require('../config')
const docAIv3 = require('./docAiHelpers')
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

const formLoop = async (arr) => {
    let opt

    console.log('arr', arr?.length)

    let myPromises = arr.map(v => {
        v.gcs_input_uri = v?.fileUrl

        return docAIv3(v)
    })

    console.log('myPromises', myPromises)

    let response = await Promise.allSettled(myPromises)

    let secondPromise = []

    for (var v of response) {
        opt = v?.value?.data

        if (!opt?.success) {
            console.log('second try', opt)
            // secondPromise.push(Promise.resolve(axios.post(opt?.template_id ?
            //     `https://context-api-2my7afm7yq-ue.a.run.app/api/form_matching` :
            //     `https://context-api-2my7afm7yq-ue.a.run.app/api/offline_doc_ai`,
            //     opt?.body
            // )))
            // secondPromise.push(Promise.resolve(axios.post(`https://context-api-2my7afm7yq-ue.a.run.app/api/form_matching`, opt?.body)))
        }
    }

    console.log('after Loop***', response)

    // await Promise.allSettled(secondPromise)
    //     .then((r) => console.log('r', r))
    //     .catch((e) => console.log('e', e))

    // console.log('secondPromise')

    // let ids = arr.map(d => `'${d?.fileId}'`)

    // let sqlQuery = `UPDATE ${schema}.documents SET is_completed = ${true} WHERE id IN (${ids})`
    // await runQuery(postgresDB, sqlQuery)
    //     .then((res) => console.log('res complete', res))
    //     .catch((e) => console.log('e', e))

    // console.log('done****')
}

module.exports = {
    getDocumentAIProcessorsList,
    formLoop
}