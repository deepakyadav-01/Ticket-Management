import * as authService from "../services/authService.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { AppError } from "../middlewares/errorHandler.js";

/**
 * Handles user registration by invoking the register method from authService.
 * Responds with a success message and the newly created user if registration is successful.
 * Passes any errors to the error handler middleware, handling specific cases such as duplicate email.
 *
 * @param {Object} req - The request object containing user registration data.
 * @param {Object} res - The response object used to send a response back to the client.
 * @param {Function} next - The middleware function used to pass errors to the global error handler.
 */
export const register = async (req, res, next) => {
  try {
    // Attempt to register a new user using the provided request body data
    const user = await authService.register(req.body);

    // Send a success response with the newly created user and a status code of 201 (Created)
    res.status(201).json({ message: AUTH_MESSAGES.REGISTRATION_SUCCESS, user });
  } catch (error) {
    // Handle duplicate email error specifically (MongoDB duplicate key error code)
    if (error.code === 11000) {
      // Pass a custom error to the error handler middleware with a specific message and status code
      next(new AppError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS, 400));
    } else {
      // Pass any other errors to the error handler middleware
      next(error);
    }
  }
};

/**
 * Handles user login by invoking the login method from authService.
 * Responds with a success message, authentication token, and user details if login is successful.
 * Passes any errors encountered during login to the global error handler middleware.
 *
 * @param {Object} req - The request object containing user login credentials.
 * @param {Object} res - The response object used to send a response back to the client.
 * @param {Function} next - The middleware function used to pass errors to the global error handler.
 */
export const login = async (req, res, next) => {
  try {
    // Attempt to authenticate the user with the provided credentials
    const { token, user } = await authService.login(req.body);

    // Send a success response with the authentication token and user details
    res.json({ message: AUTH_MESSAGES.LOGIN_SUCCESS, token, user });
  } catch (error) {
    // Pass any errors encountered during authentication to the global error handler middleware
    next(error);
  }
};
