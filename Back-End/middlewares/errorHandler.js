const { ValidationError, NotFoundError, InternalServerError } = require('../errors');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError || err instanceof NotFoundError || err instanceof InternalServerError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details || []
    });
  }

  return res.status(500).json({
    code: 'ERR_INTERNAL',
    message: 'An unexpected error occurred',
    details: []
  });
};

module.exports = errorHandler;