class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    if (`${statusCode}`.startsWith(4)) this.status = "fail";
    else if (`${statusCode}`.startsWith(5)) this.status = "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
