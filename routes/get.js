const router = require('express').Router()
const { getAllProcessors, getAllSubmmissions } = require('../controllers/get')

router.get('/get-all-processors', getAllProcessors)

router.get('/get-all-submissions', getAllSubmmissions)

module.exports = router