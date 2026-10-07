const Budget = require('../models/Budget')
const AuditLog = require('../models/AuditLog')

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id })
    res.status(200).json(budgets)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des budgets.' })
  }
}

const setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body

    if (!category || !limit) {
      return res.status(400).json({ message: 'Catégorie et limite obligatoires.' })
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category: category.trim() },
      { limit: Number(limit) },
      { new: true, upsert: true }
    )

    await AuditLog.create({
      user: req.user._id,
      action: 'SET_BUDGET',
      details: `Budget pour ${category} défini à ${limit}€`,
    })

    res.status(200).json(budget)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du budget.' })
  }
}

module.exports = { getBudgets, setBudget }