const { projectId, storage } = require('../config/gcpConfig')

const bucketName = `test_sent`
const maxAgeSeconds = 3600
const method = ['GET', 'POST', 'PUT', 'DELETE']
const origin = ['http://localhost:3000', 'http://localhost:3001','https://sentiment-analysis-2my7afm7yq-ue.a.run.app']

const configureBucketCors = async () => {
    await storage.bucket(bucketName).setCorsConfiguration([
        {
            maxAgeSeconds,
            method,
            origin,
            responseHeader: ['content-type']
        }
    ])
        .then((t) => console.log('*****'))
        .catch((e) => console.log('e', e))

}

module.exports = { configureBucketCors }