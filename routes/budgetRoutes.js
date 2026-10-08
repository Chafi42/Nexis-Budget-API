const express = require('express')
const router = express.Router()
const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController')
const { protect } = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validateMiddleware')
const { budgetSchema, updateBudgetSchema } = require('../schemas/authSchema')

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Lister mes budgets
 *     tags: [Budgets]
 *     responses:
 *       200:
 *         description: Liste des budgets
 *   post:
 *     summary: Créer un budget
 *     tags: [Budgets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category, limit]
 *             properties:
 *               category:
 *                 type: string
 *               limit:
 *                 type: number
 *     responses:
 *       201:
 *         description: Budget créé
 *       400:
 *         description: Erreur de validation
 */
router.get('/', protect, getBudgets)
router.post('/', protect, validate(budgetSchema), createBudget)

/**
 * @swagger
 * /api/budgets/{id}:
 *   put:
 *     summary: Modifier un budget
 *     tags: [Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget modifié
 *   delete:
 *     summary: Supprimer un budget
 *     tags: [Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget supprimé
 */
router.put('/:id', protect, validate(updateBudgetSchema), updateBudget)
router.delete('/:id', protect, deleteBudget)

module.exports = router