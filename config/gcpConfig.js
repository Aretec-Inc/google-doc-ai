const { Storage } = require('@google-cloud/storage')
const DLP = require('@google-cloud/dlp')
const language = require('@google-cloud/language')
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1beta3

let service_key = JSON.parse(process.env.service_key || "{}")

try {
  if (process.env.NODE_ENV === 'production' && require('../service_key.json')) {
    service_key = require('../service_key.json')
  }
}
catch (e) {
  console.log('service_key not found!')
}

const projectId = service_key?.project_id

// Instantiates a client

const storage = new Storage({ projectId, credentials: service_key })
const languageClient = new language.LanguageServiceClient({ projectId, credentials: service_key })
const dlpClient = new DLP.DlpServiceClient({ projectId, credentials: service_key })
const docAiClient = new DocumentProcessorServiceClient({ projectId, credentials: service_key })

module.exports = {
  storage,
  projectId,
  languageClient,
  service_key,
  dlpClient,
  docAiClient
}