import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorMiddleware, AppError } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import connectDB from "./config/database.js";
import { ERROR_MESSAGES } from "./constants/messages.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tickets", ticketRoutes);

// Handle unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(ERROR_MESSAGES.ROUTE_NOT_FOUND, 404));
});

// Global error handling middleware
app.use(errorMiddleware);

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
