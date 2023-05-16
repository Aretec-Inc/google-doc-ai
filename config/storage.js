require('dotenv').config()

const { storage } = require('../config/gcpConfig')

const bucketName = process.env?.storage_bucket
const maxAgeSeconds = 3600
const method = ['GET', 'POST', 'PUT', 'DELETE']
const origin = ['http://localhost:3000', 'http://localhost:3001', process.env.ALLOWED_ORIGIN]

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