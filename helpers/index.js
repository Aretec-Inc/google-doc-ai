const fs = require('fs')
const axios = require('axios')
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

                } catch (err) {
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

module.exports = {
    ...require('./gcpHelpers'),
    ...require('./postgresQueries'),
    getDate,
    downloadFile,
    uploadFileToStorage,
    checkDocumentQuality,
    apiResponse,
    successFalse,
    validateData
}