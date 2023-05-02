const express = require('express')
const app = express()
const path = require('path')

require('dotenv').config()

app.use(express.static(path.join(__dirname, './build')))

//set a static folder
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'))
})

// set port, listen for requests
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})