const { v4: uuidv4 } = require('uuid')
const download_pdf = require('./downloadFileFromStorage')
const insertToDB = require('./insertToDB')
const get_form_field_values = require('./getFormFieldValues')
const { default: axios } = require('axios')
const { runQuery } = require('./postgresQueries')
const { postgresDB, schema, docAiClient, auth } = require('../config')

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

const getUniqueArrayOfObjects = (ary, objectPropertName) => {
    let cleanProperty = (property) => typeof property == 'string' ? property?.trim().toLowerCase() : property
    return ary.filter((elem, index) => {
        let filteredByProperty = ary?.findIndex(obj => {
            let obj1V = obj?.[objectPropertName]
            let obj2V = elem?.[objectPropertName]
            let value1 = cleanProperty(obj1V)
            let value2 = cleanProperty(obj2V)
            return value1 == value2
        })
        return filteredByProperty == index
    })
}

const docAI = ({ location, processorId, bucket_name, file_name, given_json, isTesting, formKeyPairTableName, processorName }) => {

    // const gcs_input_uri = 'gs://' + bucket_name + '/' + file_name
    return new Promise(async (resolve, reject) => {
        try {
            const file_names = file_name?.split('/')
            const exact_file_name_with_ext = file_names?.[file_names?.length - 1]

            let isObject = (value) => {
                let jsonAfterParse = value

                if (typeof value == 'string') { //check if the object is stringified.
                    try {
                        jsonAfterParse = JSON.parse(value)
                    } catch (e) {
                        jsonAfterParse = value
                        console.log('Not an stringified object.')
                    }
                }
                return (typeof jsonAfterParse == 'object' && !Array.isArray(jsonAfterParse) && Object.keys(jsonAfterParse)?.length)
            }
            let jsonIsObject = isObject(given_json)
            const extract_from_json = (given_json && typeof given_json == 'string' && given_json.length > 5) || jsonIsObject

            // The full resource name of the processor, e.g.:
            // projects/project-id/locations/location/processor/processor-id
            // You must create new processors in the Cloud Console first
            const projectId = await auth.getProjectId()
            const name = `projects/${projectId}/locations/${location}/processors/${processorId}`

            // Read the file into memory.

            let document = {}
            if (extract_from_json) {
                console.log('JSON IS GIVEN !!!! ')
                if (!jsonIsObject) {
                    let url = await getAuthUrl(given_json, storage)

                    // console.log('url', url)

                    let { data } = await axios.get(url)
                    let isDataObj = isObject(data)

                    // console.log('isDataObj', isDataObj)
                    if (!isDataObj) {
                        throw new Error(`Invalid Json.`)
                    }
                    document = data
                }
                else {
                    console.log('IS OBJECT = TRUE')
                    document = given_json
                    console.log('LOADING AI FROM NODEJS')
                }
            }
            if (!extract_from_json) {
                console.log('JSON IS NOT GIVENNN !!!!')
                if (!bucket_name) {
                    throw new Error(`Bucket Name Is Required.`)
                }

                // console.log(`Downloading File!`)

                // Convert the image data to a Buffer and base64 encode it.
                const encodedImage = await download_pdf(bucket_name, file_name)
                console.log('Download Finish.')
                // console.log('Encoding', encodedImage)
                const request = {
                    name,
                    document: {
                        content: encodedImage,
                        mimeType: 'application/pdf'
                    }
                }

                console.log(`AI Process started with Processor ID ${processorId} and file: gs://${bucket_name}/${file_name} .`)

                // Recognizes text entities in the PDF document

                const [result] = await docAiClient.processDocument(request);
                document = result?.document;
                let obj = {}
                for (var e of document?.entities) {
                    if (e?.properties?.length) {
                        if (!obj[e?.type]) {
                            obj[e?.type] = []
                        }
                        let objChild = {}
                        for (var p of e?.properties) {
                            var field_name = p?.type?.split('/')?.slice(-1,)?.[0]
                            objChild[field_name] = p?.mentionText
                        }
                        obj[e?.type]?.push(objChild)
                    }
                    else {
                        obj[e?.type] = e?.mentionText
                    }
                }
                let sqlQuery = `INSERT INTO ${schema}.export_table (file_name, processor_name, processor_id, all_fields, created_at) VALUES ('${file_name}', '${processorName}', '${processorId}', '${JSON.stringify(obj)}'::jsonb, NOW());`
                await runQuery(postgresDB, sqlQuery)
                console.log('AI Process end.')
            }

            // return document
            // Get all of the document text as one big string
            const { text } = document

            // Read the text recognition output from the processor
            console.log('The document contains the following paragraphs:')
            const pages = document.pages || []
            let entities = document.entities || []
            // const [page1] = pages;
            // const { paragraphs } = page1;

            try {
                if (!isTesting && text) {
                    console.log('pdf_document start')
                    insertToDB.pdf_document({ file_name: exact_file_name_with_ext || '', pages_count: pages?.length || 0, entities_count: entities?.length || 0, text })

                    console.log('pdf_document end')
                }
            }
            catch (e) {
                console.log('e', e)
            }

            let pagesArray = []

            for (const page of pages) {
                try {
                    if (!isTesting) {
                        console.log('pdf_pages start')
                        pagesArray.push(insertToDB.pdf_pages({ file_name: exact_file_name_with_ext, dimensions: page.dimension, pageNumber: page.pageNumber, paragraphs: page.paragraphs }))
                        console.log('pdf_pages end')
                    }
                }
                catch (e) {
                    console.error(e)
                }
            }

            await Promise.all(pagesArray)

            let pageFormFieldsArray = []
            console.log('**************************************')
            for (let i = 0; i < pages.length; i++) {
                let page = pages?.[i]
                let pageNumber = page?.pageNumber

                console.log('pageNumber', pageNumber)

                const formFields = page?.formFields
                if (Array.isArray(formFields)) {
                    for (const formField of formFields) {
                        let formfieldValues = get_form_field_values(formField, { text, pageNumber, exact_file_name_with_ext }, isTesting)
                        pageFormFieldsArray.push(formfieldValues)
                    }
                }
            }

            let entitiesArray = []
            let extraProperties = entities?.map(d => d?.properties)?.filter(d => Array.isArray(d) && d?.length) || []
            let hasExtraProperties = Array.isArray(extraProperties) && extraProperties.length
            if (hasExtraProperties) {
                extraProperties = extraProperties.flat()
            }
            else {
                extraProperties = []
            }

            // if (Array.isArray(entities) && entities?.length) {
            //     if (hasExtraProperties) {
            //         entities = [...entities, ...extraProperties]
            //     }
            //     for (const entity of entities) {
            //         entitiesArray.push(get_form_field_values(entity, { type: typeEntities, text, exact_file_name_with_ext, isEntity: true }, isTesting))
            //     }
            // }

            let trim = (v) => typeof v == 'string' ? v?.trim() : v

            const arrayToString = (arryy) => arryy?.map(d => trim(d))?.filter(Boolean)?.toString()
            let formFieldsValues = arrayToString(pageFormFieldsArray)
            // let formEntities = arrayToString(entitiesArray)

            console.log('insert_form_key_pair_with_values start')
            let insert_form_fields = (!isTesting && formFieldsValues?.length) ? insertToDB.insert_form_key_pair_with_values({ formKeyPairTableName, VALUES: formFieldsValues }) : null

            console.log('insert_form_key_pair_with_values end')

            console.log('insert_form_key_pair_with_values start')

            // let insert_form_entities = (!isTesting && formEntities?.length) ? insertToDB.insert_form_key_pair_with_values({ formKeyPairTableName, VALUES: formEntities }) : null

            console.log('insert_form_key_pair_with_values end')

            let finalResult = null
            let failedRequests = []
            try {
                if (!isTesting) {
                    finalResult = await Promise.allSettled([...pagesArray, insert_form_fields])
                    failedRequests = finalResult?.filter(res => res.status !== 'fulfilled')
                }
            }
            catch (e) {
                console.error(e)
            }

            console.log('FUNCTION COMPLTES ~!!')

            // return document

            // console.log('entituesss ', entitiesArray)
            let schemaForJSON = entitiesArray.map(d => ({ name: cleanFieldName(d?.field_name), type: 'STRING', mode: 'NULLABLE' }))
            const bigquerySchema = getUniqueArrayOfObjects(schemaForJSON, 'name')
            // console.log('bigquerySchema', JSON.stringify(bigquerySchema))
            resolve({
                original_entities: document?.entities?.length || 0,
                extracted_entities: entitiesArray?.length,
                key_pair_counts: pageFormFieldsArray?.length,
                failureCount: failedRequests?.length,
                failedRequests, formKeyPairTableName,
                schemaJSON: bigquerySchema
            })
        }
        catch (e) {
            console.log('error from doc_ai.js', JSON.stringify(e))
            reject(e)
        }
    })
}

const isFalsyValue = (value) => {
    // console.log(value)
    if (typeof value == 'number') { //returns boolean form of number, 0 will be false, all others true.
        return Boolean(value)
    }
    else if (typeof value == 'boolean') { //if its boolean return opposite boolean, means if boolean true, it will return false, if boolean is false, returns true.
        return !value
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

const docAIv3 = async (obj) => {
    // console.log(req,'====>request')
    const id = uuidv4()
    const documentTable = `${schema}.documents`
    const should_update = true

    // let queryLocation = req?.query?.location
    let bodyLocation = obj?.location
    let defaultLocation = 'us'

    // let queryProcessorId = req?.query?.processorId
    let bodyProcessorId = obj?.processorId
    let defaultProcessorId = 'aebf936ce61ab3b1'

    const location = !isFalsyValue(bodyLocation) ? bodyLocation : defaultLocation
    const processorId = !isFalsyValue(bodyProcessorId) ? bodyProcessorId : defaultProcessorId// Create processor in Cloud Console
    const processorName = obj?.processorName
    const formKeyPairTableName = `${schema}.schema_form_key_pairs` // table to save keypairs data.

    var gcs_input_uri = obj?.gcs_input_uri
    var match = gcs_input_uri?.match(/gs:\/\/(.+?)\/(.+)/i)

    const file_name = match?.[2]
    const bucket_name = match?.[1]

    console.log('BUCKEt', bucket_name, 'f', file_name, gcs_input_uri, 'body', obj)

    const given_json = {}
    // const isTesting = true
    const isTesting = !isFalsyValue(obj?.isTesting)

    let removeQuotes = (txt) => typeof txt?.replace == 'function' ? txt?.replace(/[''`]+/g, '') : txt

    let updateAttempts = async (error) => {
        try {
            if (!isTesting) {
                let justFileName = file_name?.slice(file_name.lastIndexOf('/') + 1, file_name.length)

                let query = `SELECT * FROM ${documentTable} where file_name='${justFileName}'`
                // let artifactData = await runBigQuery(query)
                let artifactData = await runQuery(postgresDB, query)
                let numberOfAttempt = parseInt(artifactData[0]?.number_of_attempts) || 0
                let hasError = Boolean(error)
                let errorStr = hasError ? `'${removeQuotes(error)}'` : null

                let updateQuery = `UPDATE ${documentTable} SET number_of_attempts=${numberOfAttempt + 1}, error=${errorStr} where file_name='${justFileName}' `
                console.log('qury1', query, 'query2', updateQuery)
                // await runBigQuery(updateQuery)
                await runQuery(postgresDB, updateQuery)
                console.log('hasError', hasError)
                console.log(hasError ? 'Operation Failed' : `ALL DONE SUCCESFULLY`)
            }
        }
        catch (e) {
            console.log('attempts error', e)
        }
    }

    try {
        if (!given_json) {
            throw new Error('Missing JSON')
        }
        // if (!isTesting) {
        //     axios.post(`https://context-api-2my7afm7yq-ue.a.run.app/api/image_crop_vision_ai`, { gcs_input_uri })
        //         .then((d) => {
        //             console.log('Succesfully Added Custom Fields using Vision AI', d?.data)
        //         })
        //         .catch(e => {
        //             console.error(`Custom fields from vision A.I failed`, e)
        //         })
        // }

        let result = await docAI({ location, processorId, file_name, bucket_name, id, given_json, isTesting, formKeyPairTableName, processorName })

        console.log('result', result)

        await updateAttempts()

        if (should_update) {
            let justFileName = file_name?.slice(file_name.lastIndexOf('/') + 1, file_name.length)
            let query = `UPDATE ${schema}.documents SET is_completed=${true} WHERE file_name='${justFileName}'`
            await runQuery(postgresDB, query)
        }
        let obj = {
            success: true,
            result
        }
        return obj
    }
    catch (e) {
        console.log('eeee', e)
        let error = e?.message ? e.message : e.toString()
        console.error('docAI index.js error', error)

        await updateAttempts(error)

        let obj = {
            message: error, error: e.toString()
        }
        return obj
    }
}

module.exports = docAIv3