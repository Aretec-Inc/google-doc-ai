const fs = require('fs')
const moment = require('moment')
const axios = require('axios')
const codes = require('./codes.json')
const { projectId, docAiClient } = require('../config/gcpConfig')

const checkDocumentQuality = async (filePath) => {
    let processorId = '19fe7c3bad567f9b'
    const name = `projects/${projectId}/locations/us/processors/${processorId}`
    const fs = require('fs').promises;
    const imageFile = await fs.readFile(filePath);

    // Convert the image data to a Buffer and base64 encode it.
    const encodedImage = Buffer.from(imageFile).toString('base64');
    const request = {
        name,
        document: {
            content: encodedImage,
            mimeType: 'application/pdf'
        }
    }
    const [result] = await docAiClient.processDocument(request);
    const { document } = result;
    // console.log(JSON.stringify(document),'<== docai')
    let reason = document?.entities[0]?.properties
    let sorted = reason.sort((a, b) => b.confidence - a.confidence)
    console.log(sorted, 'sorted')
    return { confidence: document?.entities[0]?.confidence, text: document?.text, reason: sorted[0]?.type }
}

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

module.exports = {
    ...require('./gcpHelpers'),
    ...require('./postgresQueries'),
    getDate,
    downloadFile,
    uploadFileToStorage,
    checkDocumentQuality,
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
    downloadPublicFile
}