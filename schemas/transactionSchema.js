const { z } = require('zod')

const createTransactionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Le titre est obligatoire'),
    amount: z.number({ error : 'Le montant doit être un nombre' }),
    type: z.enum(['income', 'expense'], {
      error: () => ({ message: 'Le type doit être income ou expense' }),
    }),
    category: z.string().optional(),
  }),
})

module.exports = { createTransactionSchema }