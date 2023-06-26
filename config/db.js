const { Sequelize } = require('sequelize')
const addModels = require('../models')
const config = require('./config')

const schema = process?.env?.schema || `google_doc_ai`

const init = (cloudConfig = config) => {
    try {
        let db = new Sequelize({ ...cloudConfig, ssl: true, pool: { maxConnections: 50, maxIdleTime: 30 }, language: 'en' })

        console.log('connecting...')
        db.authenticate()
        db.sync({ alter: true })

        console.log('Connection has been established successfully...')

        db.createSchema(schema)
            .then(() => console.log('****'))
            .catch((e) => console.log('error'))

        addModels(db, schema)

        return db
    }
    catch (error) {
        console.log('Unable to connect to the database:', error)

        return null
    }
}

const connectDB = (cloudConfig = config) => init(cloudConfig)

const postgresDB = connectDB(process.env.NODE_ENV === 'production' ? config.production : process.env.NODE_ENV === 'cloudDB' ? config.cloudDB : config.development)

module.exports = {
    postgresDB,
    schema
}