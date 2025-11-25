// Custom error classes for different error types

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message, errors = null) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  BadRequestError
};
