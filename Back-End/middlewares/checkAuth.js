// middlewares/checkAuth.js
function checkAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated (no user ID)' });
  }
  req.userId = userId;
  next();
}

module.exports = { checkAuth };
