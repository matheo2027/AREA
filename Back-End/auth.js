const jwt = require('jsonwebtoken'); // Assurez-vous que le package jwt est installé : npm install jsonwebtoken

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // ID de l'utilisateur extrait du token
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};

module.exports = checkAuth;
