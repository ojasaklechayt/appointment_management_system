# Appointment Management System

The **Appointment Management System** is a web application designed to facilitate scheduling, managing, and tracking appointments. The system provides a user-friendly interface for users to easily book, view, update, and cancel appointments. The backend is built with **Node.js**, and the data is stored in a **PostgreSQL** database managed via **Sequelize ORM**.

## Features

- **User Registration and Authentication**: Allows users to sign up, log in, and securely manage their sessions.
- **Appointment Management**: Users can create, view, update, and cancel appointments.
- **User Profiles**: Each user can manage their profile and view their scheduled appointments.
- **Secure Data Handling**: The system uses **JWT-based authentication** to ensure secure communication and data integrity.
- **Database Integration**: Data is stored in a **PostgreSQL** database with seamless integration using **Sequelize** ORM.

## Tech Stack

- **Frontend**: HTML, CSS (pure CSS for styling)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM for data management
- **Authentication**: JWT (JSON Web Tokens)
- **Version Control**: Git, GitHub

## Project Structure

The project follows the **MVC (Model-View-Controller)** architecture and is organized into the following key directories:

- **config**: Configuration files, including database and JWT setup.
- **controllers**: Business logic for managing requests (e.g., handling appointments and user data).
- **middleware**: Functions for request validation, authentication checks, and other middleware logic.
- **models**: Sequelize models for defining the database schema (e.g., User, Appointment).
- **routes**: API routes for interacting with controllers (e.g., `/appointments`, `/users`).
- **tests**: Unit tests to ensure that all features are working as expected.
- **views**: Front-end files (HTML, CSS) to render the UI.

### Important Files:

- **app.js**: The main entry point of the application, where the server is initialized.
- **package.json**: Contains project metadata, dependencies, and scripts.
- **.gitignore**: Specifies files and directories that should be ignored by Git.
- **.eslintrc.json**: Linting configuration to maintain consistent code quality.
- **.prettierrc**: Code formatting configuration to ensure consistent style throughout the project.

## Installation

Follow these steps to set up the project on your local machine:

### Prerequisites

Before getting started, make sure you have the following installed:

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **PostgreSQL**: [Install PostgreSQL](https://www.postgresql.org/download/)
- **Sequelize CLI**: Install it globally using:
  ```bash
  npm install -g sequelize-cli
  ```

### Steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ojasaklechayt/appointment_management_system.git
   cd appointment_management_system
   ```

2. **Install dependencies**:

   Run the following command to install the required Node.js packages:

   ```bash
   npm install
   ```

3. **Configure the database**:
   - Create a `.env` file in the root directory with the following content:

     ```plaintext
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=<your_username>
     DB_PASSWORD=<your_password>
     DB_NAME=appointments
     JWT_SECRET=<your_jwt_secret>
     ```

   Replace `<your_username>`, `<your_password>`, and `<your_jwt_secret>` with your actual PostgreSQL username, password, and a secret string for JWT signing.

   Example:

   ```plaintext
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=mysecretpassword
   DB_NAME=appointments
   JWT_SECRET=supersecretkey123
   ```

4. **Run the database migrations**:

   Set up the database tables by running the following command:

   ```bash
   sequelize db:migrate
   ```

5. **Start the application**:

   Start the server with:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000` by default.

## Usage

Once the server is up and running:

1. **Sign Up / Log In**: Create a new account or log in if you already have one.
2. **Manage Appointments**: After logging in, you can create new appointments, view existing ones, update them, or cancel them.
3. **User Profile**: View and manage your user profile and the appointments linked to it.

## Testing

To run the tests for this project, use the following command:

```bash
npm test
```

Ensure that you have the correct environment variables set up for the test environment.

## Contributing

We welcome contributions to improve the system! Here's how you can contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Submit a pull request.

Please ensure that your code follows the project's style guide and includes appropriate tests.

## License

This project is open-source and available under the MIT License.
