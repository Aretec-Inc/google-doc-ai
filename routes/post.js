const router = require('express').Router()
const Multer = require('multer')
const { createSubmmission, generateUploadSignedUrl, uploadDocuments, updateKeyPairs, validateServiceKeyGCS, getBucketData, downloadAndUploadFiles } = require('../controllers/post')

const multer = Multer({
    dest: 'uploads/'
})

router.post('/create-submission', createSubmmission)

router.post('/get-upload-signed-url', generateUploadSignedUrl)

router.post('/upload-documents', uploadDocuments)

router.post('/update-key-pairs', updateKeyPairs)

router.post('/validate-service-key-gcs', multer.single('file'), validateServiceKeyGCS)

router.post('/get-bucket-data', getBucketData)

router.post('/download-and-upload-files', downloadAndUploadFiles)

module.exports = router