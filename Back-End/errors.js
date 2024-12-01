class ValidationError extends Error {
    constructor(message, details = []) {
      super(message);
      this.name = 'ValidationError';
      this.code = 'ERR_VALIDATION';
      this.details = details;
      this.statusCode = 400;
    }
  }

  class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.code = 'ERR_NOT_FOUND';
      this.statusCode = 401;
    }
  }

  class InternalServerError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InternalServerError';
      this.code = 'ERR_INTERNAL';
      this.statusCode = 500;
    }
  }

  module.exports = { ValidationError, NotFoundError, InternalServerError };
