const jwt = require('jsonwebtoken')

const generateToken = (id, email) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET manquant dans le .env')
  }
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

module.exports = generateToken