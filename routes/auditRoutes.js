const express = require('express')
const router = express.Router()
const { getLogs } = require('../controllers/auditController')
const { protect } = require('../middlewares/authMiddleware')

router.get('/', protect, getLogs)

module.exports = router