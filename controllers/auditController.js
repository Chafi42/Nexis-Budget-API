const AuditLog = require('../models/AuditLog')

const getLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json(logs)
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des journaux d audit.' })
  }
}

module.exports = { getLogs }