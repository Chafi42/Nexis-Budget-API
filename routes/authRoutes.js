const express = require('express')
const router = express.Router()
const { register, login, logout, deleteUser } = require('../controllers/authController')
const { protect } = require('../middlewares/authMiddleware') // Assure-toi que le fichier s'appelle exactement authMiddleware.js
const validate = require('../middlewares/validateMiddleware')
const { registerSchema, loginSchema } = require('../schemas/authSchema')

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation Zod ou email déjà existant
 */
router.post('/register', validate(registerSchema), register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentification réussie (retourne le token JWT)
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', validate(loginSchema), login)

module.exports = router