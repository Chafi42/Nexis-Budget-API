const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    next()
  } catch (error) {
    return res.status(400).json({
      message: 'Erreur de validation des données',
      errors: error.errors || error.issues || error,
    })
  }
}

module.exports = validate