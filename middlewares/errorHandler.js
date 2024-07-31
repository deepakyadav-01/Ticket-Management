import { ERROR_MESSAGES } from "../constants/messages.js";

/**
 * Custom error class for handling application-specific errors.
 * Extends the built-in Error class to include additional properties.
 */
export class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code associated with the error.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Indicates if the error is operational (expected) or programming (unexpected)

    // Captures the stack trace for the error
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware function to handle errors.
 * Differentiates between development and production environments to provide appropriate error responses.
 *
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const errorMiddleware = (err, req, res, next) => {
  // Set default status code and status if not provided
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Handle errors differently based on the environment
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // Create a copy of the error object for manipulation
    let error = { ...err };
    error.message = err.message;

    // Handle specific types of errors
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

/**
 * Sends error response in development environment.
 *
 * @param {Object} err - The error object.
 * @param {Object} res - The response object.
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack, // Includes stack trace in development for debugging
  });
};

/**
 * Sends error response in production environment.
 *
 * @param {Object} err - The error object.
 * @param {Object} res - The response object.
 */
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // For operational errors, send a response with the error message
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // For programming errors, log the error and send a generic message
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Handles CastError for invalid MongoDB object IDs.
 *
 * @param {Object} err - The CastError object.
 * @returns {AppError} A custom AppError instance.
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * Handles duplicate field errors for MongoDB.
 *
 * @param {Object} err - The error object containing duplicate field details.
 * @returns {AppError} A custom AppError instance.
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `${ERROR_MESSAGES.DUPLICATE_KEY} ${field}`;
  return new AppError(message, 400);
};

/**
 * Handles validation errors for MongoDB.
 *
 * @param {Object} err - The ValidationError object.
 * @returns {AppError} A custom AppError instance.
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `${ERROR_MESSAGES.INVALID_INPUT} ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/**
 * Handles JWT authentication errors.
 *
 * @returns {AppError} A custom AppError instance for invalid tokens.
 */
const handleJWTError = () => new AppError(ERROR_MESSAGES.INVALID_TOKEN, 401);

/**
 * Handles JWT token expiration errors.
 *
 * @returns {AppError} A custom AppError instance for expired tokens.
 */
const handleJWTExpiredError = () =>
  new AppError(ERROR_MESSAGES.EXPIRED_TOKEN, 401);
