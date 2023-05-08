const { service_key, storage, projectId, languageClient, dlpClient } = require('./gcpConfig')
const { postgresDB, schema } = require('./db')

module.exports = {
    postgresDB,
    schema,
    service_key,
    projectId,
    storage,
    languageClient,
    dlpClient
}