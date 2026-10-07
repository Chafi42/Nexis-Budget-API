const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Récupérer le token dans le header "Bearer <TOKEN>"
      token = req.headers.authorization.split(' ')[1]

      // Décoder et vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Injecter l'utilisateur dans req.user (sans le mot de passe)
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur introuvable.' })
      }

      next()
    } catch (error) {
      console.error('Erreur token :', error.message)
      return res.status(401).json({ message: 'Non autorisé, token invalide.' })
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, aucun token fourni.' })
  }
}

module.exports = { protect }