# Ticket Management System

## Overview
The Ticket Management System is a web-based application designed to help teams manage tickets efficiently. It includes features for user registration, authentication, and ticket management. Users can create, view, edit, and delete tickets, as well as sort and filter them based on various criteria.

## Features
- **User Authentication**: Users can register and log in securely.
- **Ticket Management**:
  - Create new tickets with details like title, description, priority, due date, and status.
  - View a list of all tickets with pagination.
  - Sort tickets by priority, due date, or title.
  - Filter tickets based on priority, status, or due date range.
  - Edit existing tickets.
  - Delete tickets with a confirmation step.

## Getting Started

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/deepakyadav-01/Ticket-Management-Backend.git
   cd Ticket-Management-Backend
2. **Install Dependencies**

   ```bash
   npm install
3. **Environment Variables**

   ```bash
   NODE_ENV=development
   PORT=
   MONGODB_URI=
   JWT_SECRET=
4. **Start the Server**

   ```bash
   npm start
## API Endpoints

### Authentication
- **POST** `/api/v1/auth/register` - Register a new user.
- **POST** `/api/v1/auth/login` - Log in a user.

### Tickets
- **GET** `/api/v1/tickets` - Get a list of tickets with optional sorting and filtering.
- **POST** `/api/v1/tickets` - Create a new ticket.
- **GET** `/api/v1/tickets/:id` - Get a specific ticket by ID.
- **PATCH** `/api/v1/tickets/:id` - Update a specific ticket.
- **DELETE** `/api/v1/tickets/:id` - Delete a specific ticket.
