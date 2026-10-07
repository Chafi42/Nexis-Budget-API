const { z } = require('zod')

const setBudgetSchema = z.object({
  body: z.object({
    category: z.string().min(1, 'La catégorie est obligatoire'),
    limit: z.number().positive('Le budget doit être supérieur à 0'),
  }),
})

module.exports = { setBudgetSchema }