const User = require('../models/User')
const AuditLog = require('../models/AuditLog')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    await AuditLog.create({
      user: user._id,
      action: 'USER_REGISTER',
      details: `Création du compte : ${user.email}`,
    })

    const token = generateToken(user._id, user.email)

    res.status(201).json({
      message: 'Compte créé avec succès !',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du compte.' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe obligatoires.' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Identifiants incorrects.' })
    }

    await AuditLog.create({
      user: user._id,
      action: 'USER_LOGIN',
      details: 'Connexion réussie',
    })

    const token = generateToken(user._id, user.email)

    res.status(200).json({
      message: 'Connexion réussie !',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion.' })
  }
}

const logout = async (req, res) => {
  try {
    if (req.user) {
      await AuditLog.create({
        user: req.user._id,
        action: 'USER_LOGOUT',
        details: 'Déconnexion de l’utilisateur',
      })
    }
    res.status(200).json({ message: 'Déconnexion réussie.' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la déconnexion.' })
  }
}
// Modifier son profil utilisateur
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' })
    }

    if (firstName) user.firstName = firstName.trim()
    if (lastName) user.lastName = lastName.trim()
    if (email) user.email = email.toLowerCase().trim()

    const updatedUser = await user.save()

    res.status(200).json({
      message: 'Profil mis à jour avec succès !',
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.' })
  }
}

// Supprimer un utilisateur (par son ID)
const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id || req.user._id

    const user = await User.findById(userIdToDelete)
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' })
    }

    await User.findByIdAndDelete(userIdToDelete)

    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l’utilisateur.' })
  }
}

// Exporter les nouvelles fonctions avec les anciennes
module.exports = {
  register,
  login,
  logout,
  updateUser,
  deleteUser,
}