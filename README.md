# Tharinxdu-Code94Labs Backend

This is the backend for the Tharinxdu-Code94Labs project, built using Node.js, Express, and MongoDB. The backend handles user authentication, product management, and other core functionalities of the application.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)

## Getting Started

Follow these instructions to set up and run the backend server on your local machine.

### Prerequisites

Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v12 or later)
- [npm](https://www.npmjs.com/) (v6 or later) or [yarn](https://yarnpkg.com/) (v1.22 or later)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- A code editor like [Visual Studio Code](https://code.visualstudio.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Tharinxdu/Tharinxdu-Code94Labs-backend.git
   ```
   

2. **Navigate to the project directory:**

    ```bash
    cd Tharinxdu-Code94Labs-backend
    ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

### Environment Variables

To run this project, you will need to set up the following environment variables in a .env file at the root of the project:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=1h
    


### Running the Project

To start the development server:
```bash
   npm run dev

   ```

This uses `nodemon` for automatic restarts on code changes.

## Project Structure

- **config/**: Configuration files
- **controllers/**: Route handlers
- **helpers/**: Utility functions
- **middlewares/**: Custom middleware
- **models/**: Mongoose schemas
- **routes/**: API routes
- **uploads/**: Uploaded images
- **.env**: Environment variables
- **server.js**: Entry point

## Available Commands

- `npm run dev`: Start the server in development mode
- `npm start`: Start the server in production mode

## API Endpoints

- **Auth**
  - POST `/api/auth/signup`: Register a new user
  - POST `/api/auth/login`: Authenticate and obtain a JWT
- **Products**
  - GET `/api/products`: Retrieve all products
  - POST `/api/products`: Add a new product (protected)
  - GET `/api/products/:id`: Get a product by ID
  - PUT `/api/products/:id`: Update a product by ID (protected)
  - DELETE `/api/products/:id`: Delete a product by ID (protected)

