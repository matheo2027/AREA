// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('Error Handler:', err);

  // You might have custom error classes
  if (err.name === 'NotFoundError') {
    return res.status(404).json({ message: err.message });
  }

  // Otherwise, it's some server error:
  return res.status(500).json({ message: 'Internal server error' });
};
