import { verifyToken } from "../helpers/jwtHelper.js";
import User from "../models/User.js";
import { ERROR_MESSAGES } from "../constants/messages.js";
import { AppError } from "./errorHandler.js";

/**
 * Authenticate user middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401));
  }
};
