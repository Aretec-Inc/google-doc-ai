const { service_key, storage, projectId, languageClient, dlpClient } = require('./gcpConfig')
const { contextOltp, schema } = require('./db')

module.exports = {
    contextOltp,
    schema,
    service_key,
    projectId,
    storage,
    languageClient,
    dlpClient
}