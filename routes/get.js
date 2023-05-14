const router = require('express').Router()
const { getAllProcessors, getAllSubmmissions, getFilesById, getPdfData, getDashboardData } = require('../controllers/get')

router.get('/get-all-processors', getAllProcessors)

router.post('/get-all-submissions', getAllSubmmissions)

router.post('/get-files-by-id', getFilesById)

router.get('/get-pdf-data', getPdfData)

router.get('/get-dashboard-data', getDashboardData)

module.exports = router