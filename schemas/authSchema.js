const { z } = require('zod')

const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom est obligatoire'),
  lastName: z.string().trim().min(1, 'Le nom est obligatoire'),
  email: z.string().trim().email('Format d’email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

const loginSchema = z.object({
  email: z.string().trim().email('Format d’email invalide'),
  password: z.string().min(1, 'Le mot de passe est obligatoire'),
})

const updateUserSchema = z.object({
  firstName: z.string().trim().min(1, 'Le prénom ne peut pas être vide').optional(),
  lastName: z.string().trim().min(1, 'Le nom ne peut pas être vide').optional(),
  email: z.string().trim().email('Format d’email invalide').optional(),
})

const transactionSchema = z.object({
  title: z.string().trim().min(1, 'Le titre est obligatoire'),
  amount: z.number({ error: 'Le montant doit être un nombre' }).positive('Le montant doit être supérieur à 0'),
  type: z.enum(['income', 'expense'], { error: 'Le type doit être "income" ou "expense"' }),
  category: z.string().trim().min(1).optional().default('Divers'),
})

// Pour les modifications : tous les champs optionnels, sans valeur par défaut
const updateTransactionSchema = z.object({
  title: z.string().trim().min(1, 'Le titre ne peut pas être vide').optional(),
  amount: z.number({ error: 'Le montant doit être un nombre' }).positive('Le montant doit être supérieur à 0').optional(),
  type: z.enum(['income', 'expense'], { error: 'Le type doit être "income" ou "expense"' }).optional(),
  category: z.string().trim().min(1, 'La catégorie ne peut pas être vide').optional(),
})

const budgetSchema = z.object({
  category: z.string().trim().min(1, 'La catégorie est obligatoire'),
  limit: z.number({ error: 'La limite doit être un nombre' }).min(1, 'Le budget doit être d’au moins 1€'),
})

const updateBudgetSchema = z.object({
  category: z.string().trim().min(1, 'La catégorie ne peut pas être vide').optional(),
  limit: z.number({ error: 'La limite doit être un nombre' }).min(1, 'Le budget doit être d’au moins 1€').optional(),
})

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  transactionSchema,
  updateTransactionSchema,
  budgetSchema,
  updateBudgetSchema,
}