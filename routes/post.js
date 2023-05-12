const router = require('express').Router()
const { createSubmmission, generateUploadSignedUrl, uploadDocuments, updateKeyPairs } = require('../controllers/post')

router.post('/create-submission', createSubmmission)

router.post('/get-upload-signed-url', generateUploadSignedUrl)

router.post('/upload-documents', uploadDocuments)

router.post('/update-key-pairs', updateKeyPairs)

module.exports = router