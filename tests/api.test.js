const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../server')
const connectDB = require('../config/db')
const User = require('../models/User')
const Transaction = require('../models/Transaction')
const Budget = require('../models/Budget')
const AuditLog = require('../models/AuditLog')

jest.setTimeout(30000)

let token = ''
let userId = ''
let transactionId = ''
let budgetId = ''

const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'jest.test@example.com',
  password: 'Password123!',
}

const cleanUser = async (id) => {
  await Transaction.deleteMany({ user: id })
  await Budget.deleteMany({ user: id })
  await AuditLog.deleteMany({ user: id })
  await User.deleteOne({ _id: id })
}

describe('NexisBudget API', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB()
    }
    const existing = await User.findOne({ email: testUser.email })
    if (existing) await cleanUser(existing._id)
  })

  afterAll(async () => {
    if (userId) await cleanUser(userId)
    await mongoose.connection.close()
  })

  describe('Auth', () => {
    it('1.1 rejette un mot de passe trop court', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, password: '123' })
      expect(res.statusCode).toBe(400)
    })

    it('1.2 inscrit un utilisateur', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser)
      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user).toHaveProperty('email', testUser.email)
      userId = res.body.user.id
      token = res.body.token
    })

    it('1.3 refuse un email déjà utilisé', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser)
      expect(res.statusCode).toBe(400)
    })

    it('1.4 connecte l’utilisateur', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('token')
      token = res.body.token
    })

    it('1.5 refuse un mauvais mot de passe', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'mauvais' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('Transactions', () => {
    it('2.1 refuse l’accès sans token', async () => {
      const res = await request(app).get('/api/transactions')
      expect(res.statusCode).toBe(401)
    })

    it('2.2 rejette un montant non numérique', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Achat Test', amount: 'cinquante', type: 'expense', category: 'Autre' })
      expect(res.statusCode).toBe(400)
    })

    it('2.3 crée une transaction', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Achat de cours', amount: 50, type: 'expense', category: 'Éducation' })
      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('_id')
      transactionId = res.body._id
    })

    it('2.4 liste les transactions', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeGreaterThan(0)
    })

    it('2.5 modifie une transaction', async () => {
      const res = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Achat de cours modifié', amount: 60 })
      expect(res.statusCode).toBe(200)
      expect(res.body.title).toBe('Achat de cours modifié')
      expect(res.body.category).toBe('Éducation')
    })

    it('2.6 supprime une transaction', async () => {
      const res = await request(app)
        .delete(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toBe(200)
    })
  })

  describe('Budgets', () => {
    it('3.1 rejette une limite négative', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({ category: 'Éducation', limit: -100 })
      expect(res.statusCode).toBe(400)
    })

    it('3.2 crée un budget', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({ category: 'Éducation', limit: 300 })
      expect(res.statusCode).toBe(201)
      budgetId = res.body._id
    })

    it('3.3 liste les budgets', async () => {
      const res = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeGreaterThan(0)
    })

    it('3.4 modifie un budget', async () => {
      const res = await request(app)
        .put(`/api/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ limit: 350 })
      expect(res.statusCode).toBe(200)
      expect(res.body.limit).toBe(350)
    })
  })

  describe('Logs', () => {
    it('4.1 renvoie l’historique', async () => {
      const res = await request(app).get('/api/logs').set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeGreaterThan(0)
    })
  })

  describe('Suppression de compte', () => {
    it('5.1 supprime l’utilisateur et toutes ses données', async () => {
      const res = await request(app)
        .delete('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toBe(200)

      expect(await User.findById(userId)).toBeNull()
      expect(await Transaction.countDocuments({ user: userId })).toBe(0)
      expect(await Budget.countDocuments({ user: userId })).toBe(0)
      expect(await AuditLog.countDocuments({ user: userId })).toBe(0)

      userId = null
    })
  })
})