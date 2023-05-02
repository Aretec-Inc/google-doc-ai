const { reject } = require("lodash");
const path = require("path");
const fs = require('fs');
const { getAuthUrl } = require("virgin-helpers")

const axios = require('axios')
const { predictionServiceClient, projectId, aiplatform, docAiClient } = require('../config/gcpConfig')


const categoryClassify = async (gcs_uri) => {
    try {

        const { instance, params, prediction } =
            aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;
        let endpoint = `projects/${projectId}/locations/us-central1/endpoints/4254428302283898880}`;
        endpoint = predictionServiceClient.endpointPath(projectId, 'us-central1', '4254428302283898880')
        console.log(endpoint, '<== endpoint path')
        let scoreThreshold = 0.5
        let url = 'https://pdf-to-image-2my7afm7yq-ue.a.run.app/api/pdf_to_image'
        result = await axios.post(url, { gcs_input_uri: gcs_uri })
        let image_buffer = result?.data?.data[0]?.buffer
        let base64_buffer = Buffer.from(image_buffer).toString('base64')

        console.log(base64_buffer, '<== image data')
        const instanceObj = new instance.ImageClassificationPredictionInstance({
            content: base64_buffer,
        })

        const parametersObj = new params.ImageClassificationPredictionParams({
            confidenceThreshold: 0.5,
            maxPredictions: 1,
        });
        const parameters = parametersObj.toValue();

        const instanceValue = instanceObj.toValue();

        const instances = [instanceValue];
        const request = {
            endpoint,
            instances,
            parameters,
        };

        // Predict request
        const [response] = await predictionServiceClient.predict(request);
        // console.log(JSON.stringify(response), '<== response category')

        let output = response?.predictions[0]?.structValue?.fields?.confidences?.listValue?.values?.map((confidence, i) => {
            let label = response?.predictions[0]?.structValue?.fields?.displayNames?.listValue?.values?.[i]?.stringValue
            if (label == 'medical') {
                label = 'MAP Application'
            }
            else if (label == 'family_assistance') {
                label = 'Other'
            }
            else if (label == 'birth') {
                label = 'Birth Application'
            }
            else if (label == 'death') {
                label = 'Death Application'
            }
            else {
                label = 'Other'
            }
            return { confidence: confidence?.numberValue, label }
        })
        if (output?.length) {
            return output[0]
        }
        else {
            return { label: 'Other', confidence: 0.8 }
        }
    } catch (error) {
        console.log('error in case category ai ==>', error)
    }
}
const typeTextClassify = async (text) => {
    try {

        const { instance, params, prediction } =
            aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;
        let endpoint = `projects/${projectId}/locations/us-central1/endpoints/3951842702319943680}`;
        endpoint = predictionServiceClient.endpointPath(projectId, 'us-central1', '3951842702319943680')
        console.log(endpoint, '<== endpoint path')
        // let scoreThreshold = 0.5
        // let url = 'https://pdf-to-image-2my7afm7yq-ue.a.run.app/api/pdf_to_image'
        // result = await axios.post(url, { gcs_input_uri: gcs_uri })
        // let image_buffer = result?.data?.data[0]?.buffer
        // let base64_buffer = Buffer.from(image_buffer).toString('base64')

        // console.log(base64_buffer,'<== image data')
        const instanceObj = new instance.ImageClassificationPredictionInstance({
            mimeType: "text/plain",
            content: text
        })

        const parametersObj = new params.ImageClassificationPredictionParams({
            confidenceThreshold: 0.5,
            maxPredictions: 1,
        });
        const parameters = parametersObj.toValue();

        const instanceValue = instanceObj.toValue();

        const instances = [instanceValue];
        const request = {
            endpoint,
            instances,
            parameters,
        }
        console.log(request, '<== request')
        // Predict request
        const [response] = await predictionServiceClient.predict(request);
        // console.log(JSON.stringify(response), '<== response category')
        let allConfidence = []
        output = response?.predictions[0]?.structValue?.fields?.confidences?.listValue?.values?.map((confidence, i) => {
            allConfidence.push(confidence?.numberValue)
        })
        // console.log(allConfidence,'max_confidence')
        const max_confidence = Math.max(...allConfidence);

        const index = allConfidence.indexOf(max_confidence);
        let label 
        let display_label = response?.predictions[0]?.structValue?.fields?.displayNames?.listValue?.values?.[index]?.stringValue
        if(max_confidence>0.7)
        {
            if(display_label=='SNAP_Application')
            {
                label = 'SNAP Application'
            }
            else if(display_label=='MAP_application')
            {
                label = 'MAP Application'
            }
            else{
                label = 'Other'
            }
            return { confidence: max_confidence, label } 
        }
        else
        {
            return { confidence: 0.9, label:'Other' } 
        }
     
    } catch (error) {
        console.log('error in case category ai ==>', error)
    }
}

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

const addZero = (num) => `${num}`.padStart(2, '0');
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
                destination: dest,
            };

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
                    // console.log("res", res, JSON.stringify(res))
                    // var text = JSON.parse(data)

                    resolve(data)
                } else {
                    throw new Error(`Something went wrong when downloading file!`)
                }
            })
            // console.log("RESPONSE ==>",res)
            //  const readfile = await fs.promises.readFile(destination, console.error); //file buffer




        } catch (e) {
            console.error("error When Downloading Fiile ", e)
            reject(e)
        }

    })

}

module.exports =
{
    getDate,
    downloadFile,
    uploadFileToStorage,
    categoryClassify,
    checkDocumentQuality,
    typeTextClassify
}