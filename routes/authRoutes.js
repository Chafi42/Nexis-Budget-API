const express = require('express')
const router = express.Router()
const { register, login, logout, updateUser, deleteUser } = require('../controllers/authController')
const { protect } = require('../middlewares/authMiddleware')
const validate = require('../middlewares/validateMiddleware')
const { registerSchema, loginSchema, updateUserSchema } = require('../schemas/authSchema')

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password]
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
 *         description: Erreur de validation ou email déjà existant
 */
router.post('/register', validate(registerSchema), register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
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

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         description: Non autorisé
 */
router.post('/logout', protect, logout)

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Modifier son profil
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       400:
 *         description: Erreur de validation ou email déjà utilisé
 *       401:
 *         description: Non autorisé
 */
router.put('/profile', protect, validate(updateUserSchema), updateUser)

/**
 * @swagger
 * /api/auth/profile:
 *   delete:
 *     summary: Supprimer son propre compte et toutes ses données
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Compte supprimé
 *       401:
 *         description: Non autorisé
 */
router.delete('/profile', protect, deleteUser)

/**
 * @swagger
 * /api/auth/user/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par son ID (admin ou lui-même)
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Utilisateur introuvable
 */
router.delete('/user/:id', protect, deleteUser)

module.exports = router