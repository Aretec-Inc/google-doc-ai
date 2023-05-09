const { postgresDB, schema } = require('./db')

module.exports = {
    ...require('./gcpConfig'),
    postgresDB,
    schema
}