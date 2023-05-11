const router = require('express').Router()
const { getAllProcessors, getAllSubmmissions, getDocumentsById, getPdfData, getDashboardData } = require('../controllers/get')

router.get('/get-all-processors', getAllProcessors)

router.get('/get-all-submissions', getAllSubmmissions)

router.get('/get-documents-by-id', getDocumentsById)

router.get('/get-pdf-data', getPdfData)

router.get('/get-dashboard-data', getDashboardData)

module.exports = router