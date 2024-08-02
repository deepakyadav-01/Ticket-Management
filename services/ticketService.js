import Ticket from "../models/Ticket.js";
import { TICKET_MESSAGES } from "../constants/messages.js";
import { AppError } from "../middlewares/errorHandler.js";

/**
 * Creates a new ticket and associates it with the given user.
 * @param {Object} ticketData - The data for the new ticket.
 * @param {string} userId - The ID of the user creating the ticket.
 * @returns {Object} - The newly created ticket.
 * @throws {Error} - Throws an error if ticket creation fails.
 */
export const createTicket = async (ticketData, userId) => {
  const ticket = new Ticket({ ...ticketData, createdBy: userId });
  await ticket.save();

  return ticket;
};

/**
 * Retrieves a list of tickets based on query parameters.
 * Supports pagination, sorting, and filtering.
 * @param {Object} query - Query parameters for pagination, sorting, and filtering.
 * @param {number} query.page - The current page number for pagination.
 * @param {number} query.limit - The number of tickets per page.
 * @param {string} query.sort - The sorting criteria in the format 'field:order'.
 * @param {string} query.filter - JSON string for filtering tickets.
 * @returns {Object} - An object containing the list of tickets, total pages, current page, and page size.
 * @throws {Error} - Throws an error if ticket retrieval fails.
 */
export const getTickets = async (query) => {
  const { page = 1, limit = 10, sort, filter } = query;
  const skip = (page - 1) * limit;

  // Prepare sorting options
  let sortOption = {};
  if (sort) {
    const [field, order] = sort.split(":");
    sortOption[field] = order === "desc" ? -1 : 1;
  }

  // Prepare filtering options
  let filterOption = {};
  if (filter) {
    filterOption = JSON.parse(filter);
  }

  // Retrieve tickets based on filter, sort, and pagination options
  const tickets = await Ticket.find(filterOption)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .populate("createdBy", "firstname lastname email");

  // Count total documents matching the filter criteria
  const total = await Ticket.countDocuments(filterOption);
  const totalPages = Math.ceil(total / limit);

  // Return the list of tickets along with pagination details
  return {
    tickets,
    totalPages,
    currentPage: Number(page),
    pageSize: Number(limit),
  };
};

/**
 * Retrieves a specific ticket by its ID.
 * @param {string} id - The ID of the ticket to retrieve.
 * @returns {Object} - The ticket with the specified ID.
 * @throws {AppError} - Throws a 404 error if the ticket is not found.
 */
export const getTicket = async (id) => {
  const ticket = await Ticket.findById(id).populate("createdBy", "firstname lastname email");

  if (!ticket) {
    throw new AppError(TICKET_MESSAGES.TICKET_NOT_FOUND, 404);
  }

  return ticket;
};

/**
 * Updates a specific ticket by its ID.
 * @param {string} id - The ID of the ticket to update.
 * @param {Object} updateData - The data to update the ticket with.
 * @returns {Object} - The updated ticket.
 * @throws {AppError} - Throws a 404 error if the ticket is not found.
 */
export const updateTicket = async (id, updateData) => {
  const ticket = await Ticket.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!ticket) {
    throw new AppError(TICKET_MESSAGES.TICKET_NOT_FOUND, 404);
  }

  return ticket;
};

/**
 * Deletes a specific ticket by its ID.
 * @param {string} id - The ID of the ticket to delete.
 * @throws {AppError} - Throws a 404 error if the ticket is not found.
 */
export const deleteTicket = async (id) => {
  const ticket = await Ticket.findByIdAndDelete(id);
  if (!ticket) {
    throw new AppError(TICKET_MESSAGES.TICKET_NOT_FOUND, 404);
  }
};
