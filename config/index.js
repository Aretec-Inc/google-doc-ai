const { service_key, storage, projectId ,languageClient, dlpClient} = require('./gcpConfig')
const { contextOltp } = require('./db')

module.exports = {
    contextOltp,
    service_key,
    projectId,
    storage,
    languageClient,
    dlpClient
}