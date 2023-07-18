const fs = require('fs')
const moment = require('moment')
const axios = require('axios')
const path = require('path')
const codes = require('./codes.json')
const { postgresDB, schema, storage, projectId } = require('../config')
const { runQuery } = require('./postgresQueries')
const { getDocumentAIProcessorsList } = require('./gcpHelpers')

const docAIBucket = storage.bucket(process.env?.storage_bucket || `doc_ai_form`)
const BUFFER_SIZE = 8192
const buffer = Buffer.alloc(BUFFER_SIZE)

const addZero = (num) => `${num}`.padStart(2, '0')
const getDate = (date) => {
    if (date) {
        let timestamp = new Date(date)
        let day = timestamp.getDate()
        let month = timestamp.getMonth() + 1
        let year = timestamp.getFullYear()
        let formattedDate = `${addZero(year)}-${addZero(month)}-${addZero(day)}`
        return formattedDate
    }
}

const uploadFileToStorage = (filepath, originalname, file_id, storage) => {
    return new Promise(async (resolve, reject) => {

        try {
            let filename = 'form-' + file_id + '-' + originalname
            let bucketName = 'elaborate-howl-285701_context_primary'
            let dest = `Forms/NotProcessed/${filename}`
            const options = {
                destination: dest
            }

            await storage.bucket(bucketName).upload(filepath, options);
            console.log(`${filename} uploaded to ${bucketName}`);

            if (fs.existsSync(filepath)) {
                try {

                    fs.unlinkSync(filepath)

                }
                catch (err) {
                    console.error("Error", err)
                }
            }

            let fileUrl = `gs://${bucketName}/${dest}`
            resolve({ fileUrl, file_id })
        }
        catch (e) {
            console.error("error When Uploading Fiile ", e)
            reject(e)
        }
    })
}

const downloadFile = (uri, storage) => {//Here file name is actually the path of this file in bucket.
    return new Promise(async (resolve, reject) => {

        try {
            var match = uri?.match(/gs:\/\/(.+?)\/(.+)/i)
            const fileName = match?.[2]
            const bucketName = match?.[1]

            const bucket = storage.bucket(bucketName)
            const file = bucket.file(fileName)

            await file.download().then(data => {
                if (data) {
                    resolve(data)
                }
                else {
                    throw new Error(`Something went wrong when downloading file!`)
                }
            })
        }
        catch (e) {
            console.error("error When Downloading Fiile ", e)
            reject(e)
        }
    })
}

const apiResponse = (res, code, obj = {}, message = null) => res?.status(code)?.send({ ...obj, message: obj?.message || message || codes[code] || codes[500] })

const successFalse = (res, message, code = 500) => {
    let obj = {
        success: false,
        message
    }

    return apiResponse(res, code || 500, obj)
}

const validateData = (data) => data ? "'" + data?.replace?.(/'|"/gi, '') + "'" : null

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

const getAuthUrl = async (uri, storage) => {
    if (uri && uri.length) {
        try {
            const expires = moment(moment(), 'MM-DD-YYYY').add(2, 'days')
            const bucketName = uri.split('/')[2]
            console.log('bucketName', bucketName)
            const myBucket = storage.bucket(bucketName)

            const config = {
                action: 'read',
                expires: expires,
                accessibleAt: expires
            }

            let file = myBucket.file(uri.replace(`gs://${bucketName}/`, ''))
            let [url] = await file.getSignedUrl(config)
            return url
        }
        catch (e) {
            console.log('e', e)
            return uri
        }
    }
    return undefined
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

const calculateOffset = (pageNo = 1, pageSize = 10) => {
    if (pageNo <= 1) {
        return 0
    }

    return (pageNo - 1) * pageSize
}

const showTableHeaderByColumn = (columns) => {
    let allColumns = Object.entries(columns)?.map(([k, v]) => {
        if (typeof v === 'object' && v !== null) {
            return Object.keys(v)?.map(l => `${k}_${l}`)
        }
        else {
            return k
        }
    })

    return allColumns?.flat()?.map(v => v?.replace(/_/g, ' '))
}

const showTableBodyByColumn = (columns) => {
    let allColumns = Object.values(columns)?.map((v) => {
        if (typeof v === 'object' && v !== null) {
            return Object.values(v)
        }
        else {
            return v
        }
    })

    return allColumns?.flat()
}

const convertTitle = (val) => {
    val = String(val)
    return val.charAt(0).toUpperCase() + val.slice(1)
}

const downloadPublicFile = async (url, path) => {
    console.log('url, path', url, path)
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    })

    const writer = fs.createWriteStream(path)

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

const uploadFile = (filePath, destinationPath, folder) => {
    try {
        let bytesRead = fs.readFileSync(destinationPath, buffer)
        const blob = docAIBucket.file(filePath)

        let blobStream = blob.createWriteStream()

        blobStream.on('finish', async () => {
            console.log('done')
        })
        blobStream.on('error', async (e) => {
            console.log('erro')
        })
        blobStream.end(bytesRead)
    }
    catch (e) {
        console.log('error')
    }
}

const insertData = async (query) => {
    let sqlQuery = query.slice(0, -2)

    await runQuery(postgresDB, sqlQuery)
}

const replaceQuotation = (txt) => txt?.replace(/'/g, "''")

const addDataInDatabase = async (k, submission, model) => {
    return new Promise(async (resolve, reject) => {
        try {
            let folderPath = path.resolve(__dirname, '../data', k)
            let filesPath = path.resolve(folderPath, 'files')
            let filesList = fs.readdirSync(filesPath)
            let documentData = require(path.resolve(folderPath, 'data.json'))
            let schemaData = require(path.resolve(folderPath, 'key_form.json'))
            let exportTable = require(path.resolve(folderPath, 'export_table.json'))
            let pdfDocuments = require(path.resolve(folderPath, 'pdf_documents.json'))
            let pdfPages = require(path.resolve(folderPath, 'pdf_pages.json'))

            let sqlQuery = `INSERT INTO ${schema}.submissions(
                id, submission_name, processor_id, processor_name, user_id, threshold, created_at, is_deleted, status)
                VALUES (${validateData(submission?.id)}, 'Default ${convertTitle(k)}', ${validateData(model?.id)}, ${validateData(model?.displayName)}, ${validateData(submission?.id)}, ${20}, NOW(), ${false}, 'Processing');`

            try {
                await runQuery(postgresDB, sqlQuery)

                for (var f of filesList) {
                    let filePath = `${k}/${f}`
                    let destinationPath = path.resolve(filesPath, f)
                    uploadFile(filePath, destinationPath, k)
                }

                sqlQuery = `INSERT INTO ${schema}.pdf_documents (file_name, pages_count, entities_count, text, schema_id) VALUES `

                for (var p of pdfDocuments) {
                    sqlQuery += `('${p?.file_name}', ${p?.pages_count}, ${p?.entities_count}, '${replaceQuotation(p?.text)}', '${p?.schema_id}'), `
                }

                await insertData(sqlQuery)

                sqlQuery = `INSERT INTO ${schema}.pdf_pages (id, file_name, dimensions, "pageNumber", paragraphs) VALUES `

                for (var p of pdfPages) {
                    sqlQuery += `('${p?.id}', '${p?.file_name}', '${p?.dimensions}', ${p?.pageNumber}, '${replaceQuotation(p?.paragraphs)}'), `
                }

                await insertData(sqlQuery)

                sqlQuery = `INSERT INTO ${schema}.documents(id, submission_id, file_name, user_id, file_type, file_address, original_file_name, file_size, is_completed, original_file_address, created_at, updated_at) VALUES `

                for (var d of documentData) {
                    let filePath = `${k}/${d?.file_name}`
                    let fileUrl = `gs://${docAIBucket.name}/${filePath}`
                    sqlQuery += `('${d?.id}', '${d?.submission_id}', '${d?.file_name}', ${validateData(d?.user_id)}, '${d?.file_type}', '${fileUrl}', '${d?.original_file_name}', '${d?.file_size}', ${d?.is_completed}, ${validateData(fileUrl)}, NOW(), NOW()), `
                }

                await insertData(sqlQuery)

                sqlQuery = `INSERT INTO ${schema}.schema_form_key_pairs(file_name, field_name, field_value, time_stamp, validated_field_name, validated_field_value, updated_date, confidence, key_x1, key_x2, key_y1, key_y2, value_x1, value_x2, value_y1, value_y2, page_number, id, type, field_name_confidence, field_value_confidence, column_name) VALUES `

                for (var s of schemaData) {
                    sqlQuery += `('${s?.file_name}', '${s?.field_name}', '${s?.field_value}', '${s?.time_stamp}', ${null}, ${null}, '${s?.updated_date}', '${s?.confidence}', ${s?.key_x1}, ${s?.key_x2}, ${s?.key_y1}, ${s?.key_y2}, ${s?.value_x1}, ${s?.value_x2}, ${s?.value_y1}, ${s?.value_y2}, ${s?.page_number}, '${s?.id}', '${s?.type}', ${s?.field_name_confidence}, ${s?.field_value_confidence}, '${s?.column_name}'), `
                }

                await insertData(sqlQuery)

                sqlQuery = `INSERT INTO ${schema}.export_table (file_name, processor_name, processor_id, all_fields, created_at) VALUES `

                for (var e of exportTable) {
                    sqlQuery += `('${e?.file_name}', '${model?.displayName}', '${model?.id}', '${JSON.stringify(e?.all_fields)}'::jsonb, NOW()), `
                }

                await insertData(sqlQuery)

                resolve()
            }
            catch (e) {
                console.log('Alreaedy Added', k)
                resolve()
            }
        }
        catch (e) {
            console.log('e', k, e?.message || e)
            resolve()
        }
    })
}

const addDefaultData = async () => {
    const submissions = {
        expenses: {
            id: '9603b87d-3c8d-4d2b-aebf-976f77ad735b',
            name: 'expense model'
        },
        health: {
            id: '6a5f730f-bd49-4f34-84d0-a4a668020375',
            name: 'health benefit model'
        },
        invoices: {
            id: '8bad8a6f-732f-42a4-97a3-0febc7093351',
            name: 'invoice model'
        }
    }

    let allProcessors = await getDocumentAIProcessorsList(projectId)

    for (var [k, v] of Object?.entries(submissions)) {
        let model = allProcessors?.filter(v => v?.displayName?.toLowerCase() === submissions?.[k]?.name?.toLowerCase())?.[0]
        await addDataInDatabase(k, v, model)
    }
}

module.exports = {
    ...require('./gcpHelpers'),
    ...require('./postgresQueries'),
    getDate,
    downloadFile,
    uploadFileToStorage,
    apiResponse,
    successFalse,
    validateData,
    getUniqueArrayOfObjects,
    getAuthUrl,
    isNull,
    calculateOffset,
    showTableHeaderByColumn,
    showTableBodyByColumn,
    convertTitle,
    downloadPublicFile,
    addDefaultData
}