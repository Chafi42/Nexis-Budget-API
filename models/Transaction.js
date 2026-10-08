const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: [true, 'Le titre est obligatoire'], trim: true },
    amount: { type: Number, required: [true, 'Le montant est obligatoire'] },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Le type est obligatoire'],
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      default: 'Divers',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Transaction', transactionSchema)