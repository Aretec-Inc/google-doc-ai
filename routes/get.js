const router = require('express').Router()
const { getAllProcessors, getAllSubmmissions, getDocumentsById } = require('../controllers/get')

router.get('/get-all-processors', getAllProcessors)

router.get('/get-all-submissions', getAllSubmmissions)

router.get('/get-documents-by-id', getDocumentsById)

module.exports = router