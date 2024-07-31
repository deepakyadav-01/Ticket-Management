import mongoose from "mongoose";
import { TICKET_MESSAGES } from "../constants/messages.js";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, TICKET_MESSAGES.TITLE_REQUIRED],
    },
    description: {
      type: String,
      required: [true, TICKET_MESSAGES.DESCRIPTION_REQUIRED],
    },
    priority: {
      type: String,
      enum: {
        values: ["Low", "High"],
        message: TICKET_MESSAGES.INVALID_PRIORITY,
      },
      default: "Low",
    },
    status: {
      type: String,
      enum: {
        values: ["Open", "In Progress", "Closed"],
        message: TICKET_MESSAGES.INVALID_STATUS,
      },
      default: "Open",
    },
    dueDate: {
      type: Date,
      required: [true, TICKET_MESSAGES.DUE_DATE_REQUIRED],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
