const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../server')

const User = require('../models/User')
const Transaction = require('../models/Transaction')
const Budget = require('../models/Budget')
const AuditLog = require('../models/AuditLog')

describe('Suite de tests d’intégration globale - NexisBudget API', () => {
  let token
  let userId
  let transactionId

  const testUser = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont.test@example.com',
    password: 'Password123!',
  }

  // Nettoyage avant tous les tests
  beforeAll(async () => {
    await User.deleteMany({ email: testUser.email })
  })

  // Nettoyage et fermeture de la connexion après tous les tests
  afterAll(async () => {
    await User.deleteMany({ email: testUser.email })
    await mongoose.connection.close()
  })

  // ==========================================
  // 1. AUTHENTIFICATION & SÉCURITÉ
  // ==========================================
  describe('--- Routes Auth (/api/auth) ---', () => {
    it('1.1 Rejeter l’inscription avec un mot de passe trop court (Zod)', async () => {
      const res = await request(app).post('/api/auth/register').send({
        ...testUser,
        password: '123',
      })

      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('errors')
    })

    it('1.2 Inscrire un nouvel utilisateur avec succès', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser)

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user).toHaveProperty('email', testUser.email)

      userId = res.body.user.id
    })

    it('1.3 Connecter l’utilisateur et récupérer le jeton JWT', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      })

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('token')

      token = res.body.token
    })
  })

  // ==========================================
  // 2. TRANSACTIONS
  // ==========================================
  describe('--- Routes Transactions (/api/transactions) ---', () => {
    it('2.1 Refuser l’accès sans token Bearer', async () => {
      const res = await request(app).get('/api/transactions')
      expect(res.statusCode).toEqual(401)
    })

    it('2.2 Rejeter une transaction invalide (Zod : montant non numérique)', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Courses',
          amount: 'cinquante',
          type: 'expense',
        })

      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('errors')
    })

    it('2.3 Créer une transaction valide', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Salaire',
          amount: 2500,
          type: 'income',
          category: 'Revenu',
        })

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('_id')
      expect(res.body.title).toBe('Salaire')

      transactionId = res.body._id
    })

    it('2.4 Récupérer la liste des transactions de l’utilisateur', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeGreaterThan(0)
    })

    it('2.5 Mettre à jour une transaction', async () => {
      const res = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 2600,
        })

      expect(res.statusCode).toEqual(200)
      expect(res.body.amount).toBe(2600)
    })

    it('2.6 Supprimer une transaction', async () => {
      const res = await request(app)
        .delete(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body.message).toMatch(/supprimée/i)
    })
  })

  // ==========================================
  // 3. BUDGETS
  // ==========================================
  describe('--- Routes Budgets (/api/budgets) ---', () => {
    it('3.1 Rejeter un budget avec une limite <= 0 (Zod)', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'Alimentation',
          limit: -50,
        })

      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('errors')
    })

    it('3.2 Créer ou mettre à jour un budget valide', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          category: 'Alimentation',
          limit: 400,
        })

      expect(res.statusCode).toEqual(200)
      expect(res.body.category).toBe('Alimentation')
      expect(res.body.limit).toBe(400)
    })

    it('3.3 Récupérer les budgets de l’utilisateur', async () => {
      const res = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeGreaterThan(0)
    })
  })

  // ==========================================
  // 4. LOGS D'AUDIT
  // ==========================================
  describe('--- Routes AuditLogs (/api/logs) ---', () => {
    it('4.1 Récupérer l’historique des actions de l’utilisateur', async () => {
      const res = await request(app)
        .get('/api/logs')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeGreaterThan(0)
    })
  })

  // ==========================================
  // 5. DELETION EN CASCADE
  // ==========================================
  describe('--- Suppression de compte (/api/auth/user/:id) ---', () => {
    it('5.1 Supprimer l’utilisateur et vérifier la suppression en cascade', async () => {
      const res = await request(app)
        .delete(`/api/auth/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)

      // Vérification en base de données que tout a été nettoyé
      const userCount = await User.countDocuments({ _id: userId })
      const txCount = await Transaction.countDocuments({ user: userId })
      const budgetCount = await Budget.countDocuments({ user: userId })
      const logCount = await AuditLog.countDocuments({ user: userId })

      expect(userCount).toBe(0)
      expect(txCount).toBe(0)
      expect(budgetCount).toBe(0)
      expect(logCount).toBe(0)
    })
  })
})