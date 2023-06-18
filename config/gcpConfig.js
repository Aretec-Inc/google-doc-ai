const { Storage } = require('@google-cloud/storage')
const DLP = require('@google-cloud/dlp')
const language = require('@google-cloud/language')
const { GoogleAuth } = require('google-auth-library')
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1beta3

// let service_key = JSON.parse(process.env.service_key || "{}")

// try {
//   if (process.env.NODE_ENV === 'production' && require('../service_key.json')) {
//     service_key = require('../service_key.json')
//   }
// }
// catch (e) {
//   console.log('service_key not found!')
// }

// Instantiates a client

const storage = new Storage()
const languageClient = new language.LanguageServiceClient()
const dlpClient = new DLP.DlpServiceClient()
const docAiClient = new DocumentProcessorServiceClient()
const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
})

async function listBuckets() {
  try {
    // Lists all buckets in the current project
    const [buckets] = await storage.getBuckets();

    console.log('Buckets:');
    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
  } catch (error) {
    console.error('ERROR:', error);
  }
}

listBuckets()

module.exports = {
  storage,
  languageClient,
  dlpClient,
  docAiClient,
  auth
}