const { z } = require('zod')

// Schema Authentification
const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom est obligatoire'),
  lastName: z.string().trim().min(1, 'Le nom est obligatoire'),
  email: z.string().trim().email('Format d’email invalide'),
  password: z.string().min(2, 'Le mot de passe doit contenir au moins 2 caractères'),
})

const loginSchema = z.object({
  email: z.string().trim().email('Format d’email invalide'),
  password: z.string().min(2, 'Le mot de passe doit contenir au moins 2 caractères'),
})

// Schema Transaction
const transactionSchema = z.object({
  title: z.string().trim().min(1, 'Le titre est obligatoire'),
  amount: z.number({ error : 'Le montant doit être un nombre' }).positive('Le montant doit être supérieur à 0'),
  type: z.enum(['income', 'expense'], {
    error: () => ({ message: 'Le type doit être "income" ou "expense"' }),
  }),
  category: z.string().trim().optional().default('Divers'),
})

// Schema Budget
const budgetSchema = z.object({
  category: z.string().trim().min(1, 'La catégorie est obligatoire'),
  limit: z.number({ error : 'La limite doit être un nombre' }).min(1, 'Le budget doit être d’au moins 1€'),
})

const updateUserSchema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom ne peut pas être vide').optional(),
  lastName: z.string().trim().min(1, 'Le nom ne peut pas être vide').optional(),
  email: z.string().trim().email('Format d’email invalide').optional(),
})

module.exports = {
  registerSchema,
  loginSchema,
  transactionSchema,
  budgetSchema,
  updateUserSchema,
  budgetSchema,
}