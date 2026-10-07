require('dotenv').config()
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
const PORT = process.env.PORT ||

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/logs', auditRoutes)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`)
    console.log(`Documentation Swagger disponible sur http://localhost:${PORT}/api-docs`)
  })
}

module.exports = app