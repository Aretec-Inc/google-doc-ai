const { storage } = require('../config/gcpConfig')

const bucketName = `doc_ai_form`
const maxAgeSeconds = 3600
const method = ['GET', 'POST', 'PUT', 'DELETE']
const origin = ['http://localhost:3000', 'http://localhost:3001', 'https://doc-ai-znp7f527ca-uc.a.run.app']

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