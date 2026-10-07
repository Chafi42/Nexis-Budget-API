const express = require('express')
const router = express.Router()
const { getBudgets, setBudget } = require('../controllers/budgetController')
const { protect } = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validateMiddleware')
const { setBudgetSchema } = require('../schemas/budgetSchema')

router.use(protect)

router.get('/', getBudgets)
router.post('/', validate(setBudgetSchema), setBudget)

module.exports = router