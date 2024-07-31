import mongoose from "mongoose";
import { CONSTANT_STRINGS } from "../constants/messages.js";

/**
 * Connects to the MongoDB database using the URI specified in environment variables.
 * Logs a success message if the connection is successful or an error message if it fails.
 * Exits the process with a status code of 1 if the connection fails.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is established, or rejects if an error occurs.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI, {});

    // Log a success message if the connection is established
    console.log(CONSTANT_STRINGS.DB_CONEECTION_SUCCESSFULL);
  } catch (error) {
    // Log an error message and the error details if the connection fails
    console.error("CONSTANT_STRINGS.DB_CONNECTION_ERROR", error.message);

    // Exit the process with a status code of 1 to indicate an error
    process.exit(1);
  }
};

export default connectDB;
