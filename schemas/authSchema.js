const { z } = require('zod')

const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'Le prénom est obligatoire'),
    lastName: z.string().min(1, 'Le nom est obligatoire'),
    email: z.string().email('Format d’email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  }),
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Format d’email invalide'),
    password: z.string().min(1, 'Le mot de passe est obligatoire'),
  }),
})

module.exports = { registerSchema, loginSchema }