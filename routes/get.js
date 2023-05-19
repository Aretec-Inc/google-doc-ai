const router = require('express').Router()
const { getAllProcessors, getAllSubmmissions, getFilesById, getPdfData, getDashboardData, exportData, exportDataToCSV, getAllSubmissionsNConfidence } = require('../controllers/get')

router.get('/get-all-processors', getAllProcessors)

router.post('/get-all-submissions', getAllSubmmissions)

router.post('/get-files-by-id', getFilesById)

router.get('/get-pdf-data', getPdfData)

router.get('/get-dashboard-data', getDashboardData)

router.post('/get-export-data', exportData)

router.get('/get-submissions-and-confidence', getAllSubmissionsNConfidence)

router.post('/export-data-csv', exportDataToCSV)

module.exports = router