import * as ticketService from "../services/ticketService.js";
import { TICKET_MESSAGES } from "../constants/messages.js";

/**
 * Handles the creation of a new ticket.
 * Invokes the createTicket method from ticketService with the ticket data and user ID.
 * Responds with a success message and the newly created ticket if successful.
 * Passes any errors encountered to the global error handler middleware.
 *
 * @param {Object} req - The request object containing ticket data and user information.
 * @param {Object} res - The response object used to send a response back to the client.
 * @param {Function} next - The middleware function used to pass errors to the global error handler.
 */
export const createTicket = async (req, res, next) => {
  try {
    // Create a new ticket with the provided data and the ID of the currently authenticated user
    const ticket = await ticketService.createTicket(req.body, req.user._id);

    // Send a success response with the newly created ticket and a status code of 201 (Created)
    res.status(201).json({ message: TICKET_MESSAGES.TICKET_CREATED, ticket });
  } catch (error) {
    // Pass any errors to the global error handler middleware
    next(error);
  }
};

/**
 * Retrieves a list of tickets based on query parameters.
 * Calls the getTickets method from ticketService to fetch tickets, total pages, current page, and page size.
 * Responds with the tickets, pagination information, and a status code of 200 (OK).
 * Passes any errors encountered to the global error handler middleware.
 *
 * @param {Object} req - The request object containing query parameters for pagination and filtering.
 * @param {Object} res - The response object used to send a response back to the client.
 * @param {Function} next - The middleware function used to pass errors to the global error handler.
 */
export const getTickets = async (req, res, next) => {
  try {
    // Fetch tickets along with pagination details based on the query parameters
    const { tickets, totalPages, currentPage, pageSize } =
      await ticketService.getTickets(req.query);

    // Send a success response with the list of tickets and pagination information
    res.json({ tickets, totalPages, currentPage, pageSize });
  } catch (error) {
    // Pass any errors to the global error handler middleware
    next(error);
  }
};

/**
 * Retrieves a specific ticket by its ID.
 * Invokes the getTicket method from ticketService with the ticket ID.
 * Responds with the ticket details and a status code of 200 (OK).
 * Passes any errors encountered to the global error handler middleware.
 *
 * @param {Object} req - The request object containing the ticket ID as a route parameter.
 * @param {Object} res - The response object used to send a response back to the client.
 * @param {Function} next - The middleware function used to pass errors to the global error handler.
 */
export const getTicket = async (req, res, next) => {
  try {
    // Fetch the specific ticket using its ID from the route parameters
    const ticket = await ticketService.getTicket(req.params.id);

    // Send a success response with the ticket details
    res.json(ticket);
  } catch (error) {
    // Pass any errors to the global error handler middleware
    next(error);
  }
};

/**
 * Updates a specific ticket by its ID.
 * Calls the updateTicket method from ticketService with the ticket ID and updated data.
 * Responds with a success message and the updated ticket if successful.
 * Passes any errors encountered to the global error handler middleware.
 *
 * @param {Object} req - The request object containing the ticket ID and updated data.
 * @param {Object} res - The response object used to send a response back to the client.
 * @param {Function} next - The middleware function used to pass errors to the global error handler.
 */
export const updateTicket = async (req, res, next) => {
  try {
    // Update the ticket with the specified ID using the provided data
    const ticket = await ticketService.updateTicket(req.params.id, req.body);

    // Send a success response with the updated ticket and a message
    res.json({ message: TICKET_MESSAGES.TICKET_UPDATED, ticket });
  } catch (error) {
    // Pass any errors to the global error handler middleware
    next(error);
  }
};

/**
 * Deletes a specific ticket by its ID.
 * Invokes the deleteTicket method from ticketService with the ticket ID.
 * Responds with a success message indicating that the ticket has been deleted.
 * Passes any errors encountered to the global error handler middleware.
 *
 * @param {Object} req - The request object containing the ticket ID as a route parameter.
 * @param {Object} res - The response object used to send a response back to the client.
 * @param {Function} next - The middleware function used to pass errors to the global error handler.
 */
export const deleteTicket = async (req, res, next) => {
  try {
    // Delete the ticket with the specified ID
    await ticketService.deleteTicket(req.params.id);

    // Send a success response with a message indicating that the ticket has been deleted
    res.json({ message: TICKET_MESSAGES.TICKET_DELETED });
  } catch (error) {
    // Pass any errors to the global error handler middleware
    next(error);
  }
};
