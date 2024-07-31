import jwt from "jsonwebtoken";

/**
 * Generate a JWT token
 * @param {Object} payload - Data to be encoded in the token
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
