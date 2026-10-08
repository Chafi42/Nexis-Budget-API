require('dotenv').config({ quiet: true })
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')
const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const budgetRoutes = require('./routes/budgetRoutes')
const auditRoutes = require('./routes/auditRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// En test, c'est le fichier de test qui ouvre la connexion
if (process.env.NODE_ENV !== 'test') {
  connectDB()
}

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/logs', auditRoutes)

app.get('/', (req, res) => {
  res.send('API NexisBudget opérationnelle 🚀')
})

// JSON invalide dans le body
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON invalide dans le body de la requête.' })
  }
  console.error(err)
  res.status(500).json({ message: 'Erreur serveur.' })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`)
    console.log(`Swagger : http://localhost:${PORT}/api-docs`)
  })
}

module.exports = app