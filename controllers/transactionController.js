const Transaction = require('../models/Transaction')

// GET /api/transactions - Récupérer les transactions de l'utilisateur
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json(transactions)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions.' })
  }
}

// POST /api/transactions - Ajouter une transaction
const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category } = req.body

    if (!title || !amount || !type) {
      return res.status(400).json({ message: 'Titre, montant et type sont obligatoires.' })
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category: category || 'Divers',
    })

    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la transaction.' })
  }
}

// PUT /api/transactions/:id - Modifier une transaction
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction introuvable.' })
    }

    // Vérifier que la transaction appartient bien à l'utilisateur connecté
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Non autorisé à modifier cette transaction.' })
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Renvoie le document mis à jour
    )

    res.status(200).json(updatedTransaction)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification.' })
  }
}

// DELETE /api/transactions/:id - Supprimer une transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction introuvable.' })
    }

    // Vérifier l'appartenance
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Non autorisé à supprimer cette transaction.' })
    }

    await transaction.deleteOne()

    res.status(200).json({ message: 'Transaction supprimée avec succès.' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression.' })
  }
}

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
}