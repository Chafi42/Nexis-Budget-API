const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire'],
      trim: true,
    },
    limit: {
      type: Number,
      required: [true, 'La limite est obligatoire'],
      min: [1, 'Le budget doit être supérieur à 0'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Budget', budgetSchema)