require('dotenv').config()
const { Storage } = require('@google-cloud/storage')
const DLP = require('@google-cloud/dlp')
const language = require('@google-cloud/language')
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1beta3
// process.env[`GOOGLE_APPLICATION_CREDENTIALS`] = './service_key.json'

// let service_key = JSON.parse(process.env.service_key || '{}')

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
const projectId = process?.env?.projectId

const createProcessor = async (displayName, processorType) => {
  try {
    const location = 'us'

    const parent = `projects/${projectId}/locations/${location}`

    const processor = {
      displayName: displayName,
      type: processorType
    }

    const request = {
      parent,
      processor
    }

    const [response] = await docAiClient.createProcessor(request)

    console.log(`Processor name: ${response.name}`)
    console.log(`Processor display name: ${response.displayName}`)
    console.log(`Processor type: ${response.type}`)
  }
  catch (e) {
    console.log('e', e?.message)
  }

}

const createProcessors = () => {
  try {
    const processors = ['EXPENSE_PROCESSOR', 'INVOICE_PROCESSOR', 'OCR_PROCESSOR', 'FORM_PARSER_PROCESSOR']
    const processorsNames = ['Expense model', 'Invoice model', 'OCR model', 'Document AI']

    for (let i = 0; i < processors.length; i++) {
      createProcessor(processorsNames[i], processors[i])
    }
  }
  catch (e) {
    console.log('error', e)
  }
}

createProcessors()

module.exports = {
  storage,
  languageClient,
  dlpClient,
  docAiClient,
  projectId
}