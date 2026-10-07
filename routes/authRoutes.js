const express = require('express')
const router = express.Router()
const { register, login, logout, updateUser, deleteUser } = require('../controllers/authController')
const { protect } = require('../middlewares/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', protect, logout)
router.put('/profile', protect, updateUser)
router.delete('/user/:id', protect, deleteUser) // Supprime l'utilisateur par son ID
router.delete('/profile', protect, deleteUser)  // Supprime son propre compte

module.exports = router