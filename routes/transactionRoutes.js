const express = require('express')
const router = express.Router()
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController')
const { protect } = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validateMiddleware')
const { createTransactionSchema } = require('../schemas/transactionSchema')

router.use(protect)

router.get('/', getTransactions)
router.post('/', validate(createTransactionSchema), addTransaction)
router.put('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)

module.exports = router