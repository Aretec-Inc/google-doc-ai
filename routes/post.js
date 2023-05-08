const router = require('express').Router()
const { createSubmmission, generateUploadSignedUrl, uploadDocuments } = require('../controllers/post')

router.post('/create-submission', createSubmmission)

router.post('/get-upload-signed-url', generateUploadSignedUrl)

router.post('/upload-documents', uploadDocuments)

module.exports = router