const router = require('express').Router()
const { getAllProcessors } = require('../controllers/get')

router.get('/get-all-processors', getAllProcessors)

module.exports = router