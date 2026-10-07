const express = require('express')
const router = express.Router()
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController')
const { protect } = require('../middlewares/authMiddleware')

// Application de `protect` sur toutes les routes de transactions
router.use(protect)

router.get('/', getTransactions)
router.post('/', addTransaction)
router.put('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)

module.exports = router