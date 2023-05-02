const { sequelize } = require('virgin-helpers')
const config = require('./config')

const connectDB = (cloudConfig = config) => sequelize.init(cloudConfig)

const contextOltp = connectDB(process.env.NODE_ENV === 'production' ? config.production : process.env.NODE_ENV === 'cloudDB' ? config.cloudDB : config.development)

module.exports = {
    contextOltp
}