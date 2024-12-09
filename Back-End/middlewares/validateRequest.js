module.exports = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Le corps de la requête ne peut pas être vide.' });
    }
    next();
  };
