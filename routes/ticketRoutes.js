import express from "express";
import {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// Middleware to authenticate requests
router.use(authenticate);

// Route to create a new ticket
router.post("/", createTicket);

// Route to get a list of all tickets
router.get("/", getTickets);

// Route to get details of a specific ticket by ID
router.get("/:id", getTicket);

// Route to update a specific ticket by ID
router.patch("/:id", updateTicket);

// Route to delete a specific ticket by ID
router.delete("/:id", deleteTicket);

export default router;
