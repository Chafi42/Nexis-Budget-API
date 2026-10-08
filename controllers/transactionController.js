const mongoose = require('mongoose')
const Transaction = require('../models/Transaction')
const AuditLog = require('../models/AuditLog')

const createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({ ...req.body, user: req.user._id })

    await AuditLog.create({
      user: req.user._id,
      action: 'TRANSACTION_CREATE',
      details: `${transaction.type} : ${transaction.title} (${transaction.amount})`,
    })

    res.status(201).json(transaction)
  } catch (error) {
    console.error('Erreur createTransaction :', error)
    res.status(500).json({ message: 'Erreur lors de la création de la transaction.' })
  }
}

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json(transactions)
  } catch (error) {
    console.error('Erreur getTransactions :', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions.' })
  }
}

const getTransactionById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant invalide.' })
    }
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id })
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction introuvable.' })
    }
    res.status(200).json(transaction)
  } catch (error) {
    console.error('Erreur getTransactionById :', error)
    res.status(500).json({ message: 'Erreur lors de la récupération de la transaction.' })
  }
}

const updateTransaction = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant invalide.' })
    }
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { returnDocument: 'after', runValidators: true }
    )
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction introuvable.' })
    }

    await AuditLog.create({
      user: req.user._id,
      action: 'TRANSACTION_UPDATE',
      details: `Modification de : ${transaction.title}`,
    })

    res.status(200).json(transaction)
  } catch (error) {
    console.error('Erreur updateTransaction :', error)
    res.status(500).json({ message: 'Erreur lors de la modification de la transaction.' })
  }
}

const deleteTransaction = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant invalide.' })
    }
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction introuvable.' })
    }

    await AuditLog.create({
      user: req.user._id,
      action: 'TRANSACTION_DELETE',
      details: `Suppression de : ${transaction.title}`,
    })

    res.status(200).json({ message: 'Transaction supprimée.' })
  } catch (error) {
    console.error('Erreur deleteTransaction :', error)
    res.status(500).json({ message: 'Erreur lors de la suppression de la transaction.' })
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
}