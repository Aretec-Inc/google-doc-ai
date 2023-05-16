require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const server = require('http').createServer(app)
const { configureBucketCors } = require('./config/storage')

const PORT = process.env.PORT || 8080

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './client/build')))
app.use(cors())

app.use('/api', require('./routes'))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

try {
  fs.rmSync('./uploads', { recursive: true })
}
catch (e) {

}

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}))

app.use(express.json())

server.listen(PORT, () => {
  console.log(`Server up and running on ${PORT}`)
  if (process.env.NODE_ENV === 'production') {
    configureBucketCors()
  }
})