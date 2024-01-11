


This is a Node.js API  It uses Express.js, TypeORM, bcrypt, JWT (JSON Web Tokens), and nodemailer for sending emails.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

This section provides an overview of how to get started with the project.

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- PostgreSQL or your preferred database system set up
- SMTP email server or service (e.g., Gmail) for sending emails

### Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/yourusername/user-authentication-api.git
   ```

2. Install dependencies:

   ```shell
   cd user-authentication-api
   npm install
   ```

3. Configure your environment variables (see [Configuration](#configuration) section).

4. Run the application:

   ```shell
   npm start
   ```

5. The API should now be running at `http://localhost:3001` (or the specified port).

   # User Authentication and Email Verification API

## Usage

To use the API, you can make HTTP requests to the provided endpoints. Below are the available endpoints and their functionalities.

## Endpoints

### 1. Register a New User

- **Endpoint:** `POST /api/users/register`
- **Description:** Register a new user with email verification.
- **Request Body:**

```json
{
  "fullname": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123"
}
```

- **Response:** Success message and user data.

### 2. Verify Email

- **Endpoint:** `GET /api/users/verify-email?token=<verificationToken>`
- **Description:** Verify a user's email address using the verification token sent to their email.
- **Response:** Success message.

### 3. Login

- **Endpoint:** `POST /api/users/login`
- **Description:** Authenticate a user and generate a JWT token for authorization.
- **Request Body:**

```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

- **Response:** JWT token.

### 4. Request Password Reset

- **Endpoint:** `POST /api/users/request-password-resettoken=<resetToken>`
- **Description:** Request a password reset for a user's account.
- **Request Body:**

```json
{
  "email": "johndoe@example.com"
}
```

- **Response:** Success message.

### 5. Reset Password

- **Endpoint:** `POST /api/users/reset-password`
- **Description:** Reset a user's password using a reset token.
- **Request Body:**

```json
{
  "token": "<resetToken>",
  "newPassword": "newpassword123"
}
```

- **Response:** Success message.

## Configuration

To configure the application, create a `.env` file in the project root directory and add the following environment variables:

```env
# Database
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# JWT Secret
JWT_SECRET=your_jwt_secret

# SMTP Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=your_smtp_sender_email
SMTP_SERVICE=your_smtp_service
```

Replace the placeholders with your actual configuration values.

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
```

You can customize this README template to match your specific project details and add more information as needed. Once you've created the README.md file, you can commit it to your GitHub repository to provide documentation for your code.
