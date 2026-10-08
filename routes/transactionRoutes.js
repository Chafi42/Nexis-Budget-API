const express = require('express')
const router = express.Router()
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController')
const { protect } = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validateMiddleware')
const { transactionSchema, updateTransactionSchema } = require('../schemas/authSchema')

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Lister mes transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Liste des transactions
 *       401:
 *         description: Non autorisé
 *   post:
 *     summary: Créer une transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, amount, type]
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction créée
 *       400:
 *         description: Erreur de validation
 */
router.get('/', protect, getTransactions)
router.post('/', protect, validate(transactionSchema), createTransaction)

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Voir une transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction trouvée
 *       404:
 *         description: Introuvable
 *   put:
 *     summary: Modifier une transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction modifiée
 *   delete:
 *     summary: Supprimer une transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction supprimée
 */
router.get('/:id', protect, getTransactionById)
router.put('/:id', protect, validate(updateTransactionSchema), updateTransaction)
router.delete('/:id', protect, deleteTransaction)

module.exports = router