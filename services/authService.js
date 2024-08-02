import User from "../models/User.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { comparePassword } from "../helpers/passwordHelper.js";
import { generateToken } from "../helpers/jwtHelper.js";
import { AppError } from "../middlewares/errorHandler.js";

/**
 * Registers a new user by creating a new User document and saving it to the database.
 * @param {Object} userData - The user data to register.
 * @returns {Object} - An object containing the name and email of the registered user.
 * @throws {Error} - Throws an error if registration fails.
 */
export const register = async (userData) => {
  // Create a new User instance with the provided user data
  const user = new User(userData);

  // Save the new user to the database
  await user.save();

  // Return user details excluding sensitive information
  return { firstname: user.firstname, lastname: user.lastname, email: user.email };
};

/**
 * Logs in a user by verifying their credentials and generating a token.
 * @param {Object} credentials - The login credentials containing email and password.
 * @param {string} credentials.email - The email of the user.
 * @param {string} credentials.password - The password of the user.
 * @returns {Object} - An object containing the generated token and user details.
 * @throws {AppError} - Throws an AppError if user is not found or credentials are invalid.
 */
export const login = async ({ email, password }) => {
  // Find the user by email
  const user = await User.findOne({ email });

  // If the user is not found, throw a 404 error
  if (!user) {
    throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, 404);
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await comparePassword(password, user.password);

  // If the password does not match, throw a 401 error
  if (!isMatch) {
    throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  // Generate a JWT token for the user
  const token = generateToken({ userId: user._id });

  // Return the token and user details excluding sensitive information
  return { token, user: { firstname: user.firstname, lastname: user.lastname, email: user.email } };
};
