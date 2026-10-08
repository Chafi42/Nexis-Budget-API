const mongoose = require('mongoose')
const Budget = require('../models/Budget')
const AuditLog = require('../models/AuditLog')

const createBudget = async (req, res) => {
  try {
    const budget = await Budget.create({ ...req.body, user: req.user._id })

    await AuditLog.create({
      user: req.user._id,
      action: 'BUDGET_CREATE',
      details: `Budget ${budget.category} : ${budget.limit}`,
    })

    res.status(201).json(budget)
  } catch (error) {
    console.error('Erreur createBudget :', error)
    res.status(500).json({ message: 'Erreur lors de la création du budget.' })
  }
}

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json(budgets)
  } catch (error) {
    console.error('Erreur getBudgets :', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des budgets.' })
  }
}

const updateBudget = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant invalide.' })
    }
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
     { returnDocument: 'after', runValidators: true }
    )
    if (!budget) {
      return res.status(404).json({ message: 'Budget introuvable.' })
    }
    res.status(200).json(budget)
  } catch (error) {
    console.error('Erreur updateBudget :', error)
    res.status(500).json({ message: 'Erreur lors de la modification du budget.' })
  }
}

const deleteBudget = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant invalide.' })
    }
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!budget) {
      return res.status(404).json({ message: 'Budget introuvable.' })
    }
    res.status(200).json({ message: 'Budget supprimé.' })
  } catch (error) {
    console.error('Erreur deleteBudget :', error)
    res.status(500).json({ message: 'Erreur lors de la suppression du budget.' })
  }
}

module.exports = { createBudget, getBudgets, updateBudget, deleteBudget }