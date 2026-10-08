const express = require('express')
const router = express.Router()
const { getLogs } = require('../controllers/auditController')
const { protect } = require('../middlewares/authMiddleware')

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Historique de mes actions
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: Liste des logs
 */
router.get('/', protect, getLogs)

module.exports = router