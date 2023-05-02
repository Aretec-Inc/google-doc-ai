const { Storage } = require('@google-cloud/storage')
const DLP = require('@google-cloud/dlp')
const language = require('@google-cloud/language');
const automl = require('@google-cloud/automl')
const aiplatform = require('@google-cloud/aiplatform')
const {
  DocumentProcessorServiceClient
} = require('@google-cloud/documentai').v1beta3
const {PredictionServiceClient} = aiplatform.v1;


const service_key = JSON.parse(process.env.service_key || "{}")

const projectId = service_key?.project_id

 // Specifies the location of the api endpoint
 const clientOptions = {
    apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    projectId, 
    credentials: service_key
  }

  // Instantiates a client
  const predictionServiceClient = new PredictionServiceClient(clientOptions);

const storage = new Storage({ projectId, credentials: service_key })
const languageClient = new language.LanguageServiceClient({ projectId, credentials: service_key });
const dlpClient = new DLP.DlpServiceClient({ projectId, credentials: service_key });
const docAiClient = new DocumentProcessorServiceClient({ projectId, credentials: service_key })


module.exports = {
    storage,
    projectId,
    languageClient,
    service_key,
    dlpClient,
    predictionServiceClient,
    aiplatform,
    docAiClient
}