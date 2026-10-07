const express = require('express')
const router = express.Router()
const { getBudgets, setBudget } = require('../controllers/budgetController')
const { protect } = require('../middlewares/authMiddleware')

router.use(protect)

router.get('/', getBudgets)
router.post('/', setBudget)

module.exports = router