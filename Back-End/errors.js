// peut être levée quand la validation des données (par exemple dans un formulaire) échoue.
class ValidationError extends Error {
    constructor(message, details = []) {
      super(message);
      this.name = 'ValidationError';
      this.code = 'ERR_VALIDATION';
      this.details = details;
      this.statusCode = 400;
    }
  }

  //peut être levée quand une ressource (ex. un utilisateur, un produit) n’est pas trouvée en base de données.
  class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.code = 'ERR_NOT_FOUND';
      this.statusCode = 401;
    }
  }

  // erreur générique utilisée pour les erreurs inattendues côté serveur
  class InternalServerError extends Error {
    constructor(message) {
      super(message);
      this.name = 'InternalServerError';
      this.code = 'ERR_INTERNAL';
      this.statusCode = 500;
    }
  }

  module.exports = { ValidationError, NotFoundError, InternalServerError };
