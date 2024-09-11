
# Admin Panel API

This project is a backend system for managing users, roles, projects, and audit logs within an admin panel environment. The API provides full CRUD operations for users and projects, role management, and tracks user activities through audit logs. The system is built using Node.js, Express, Sequelize, and PostgreSQL.

The API is deployed and live at:  
**Base URL:** [https://admin-panel-api-w96c.onrender.com](https://admin-panel-api-w96c.onrender.com)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [User Management Routes](#user-management-routes)
  - [Role Management Routes](#role-management-routes)
  - [Project Management Routes](#project-management-routes)
  - [Audit Logs Routes](#audit-logs-routes)
- [Testing the API](#testing-the-api)
- [License](#license)

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (hosted on Neon Tech)
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Token)
- **Deployment**: [Render](https://render.com)
- **Postman Collection**: [Test the API on Postman](https://www.postman.com/sha-if/admin-panel-api)

## Features

- **User Management**: Create, update, delete, and manage users.
- **Role Management**: Assign and revoke roles for users.
- **Project Management**: Manage projects with full CRUD functionality.
- **Audit Logging**: Track important actions performed within the system.
- **Authentication**: JWT-based authentication for securing API routes.
- **Permission-Based Access Control**: Different roles (Admin, Manager, Employee) have specific access levels.

## Setup and Installation

### Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- PostgreSQL (Neon Tech is used in production)
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/admin-panel-api.git
cd admin-panel-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database using PostgreSQL. If you are using a local PostgreSQL setup, create a database and use the URL in the `DATABASE_URL` environment variable.

4. Set up environment variables:

Create a `.env` file in the root directory and configure the following variables:

```bash
PORT=<PORT>
DATABASE_URL=<postgressql-url>
JWT_SECRET=<secretKey>
```

Example:

```bash
PORT=5000
DATABASE_URL=postgres://user:password@neon.server.url/dbname
JWT_SECRET=yourjwtsecret
```

5. Run migrations and seed the database:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

6. Start the server:

```bash
npm start
```

Your server should now be running on the specified port.

## Environment Variables

- `PORT`: The port on which the server will run.
- `DATABASE_URL`: The PostgreSQL connection string. You can use Neon Tech as your cloud provider for PostgreSQL.
- `JWT_SECRET`: The secret key used for signing JWT tokens.

## API Documentation

### User Management Routes

- **POST** `/users`: Create a new user.
- **GET** `/users`: Get a list of all users.
- **GET** `/users/:id`: Get a specific user by ID.
- **PUT** `/users/:id`: Update a user by ID.
- **DELETE** `/users/:id`: Soft delete a user.
- **PATCH** `/users/restore/:id`: Restore a soft-deleted user.
- **DELETE** `/users/permanent/:id`: Permanently delete a user.

### Role Management Routes

- **POST** `/users/:id/assign-role`: Assign a role to a user.
- **POST** `/users/:id/revoke-role`: Revoke a role from a user.

### Project Management Routes

- **POST** `/project`: Create a new project (Admin only).
- **GET** `/project`: Retrieve all projects (accessible by all roles).
- **GET** `/project/:id`: Retrieve a specific project by ID (accessible by all roles).
- **PUT** `/project/:id`: Update a project by ID (Admin only).
- **DELETE** `/project/:id`: Soft delete a project (Admin only).
- **DELETE** `/project/permanent/:id`: Permanently delete a project (Admin only, optional).
- **PATCH** `/project/restore/:id`: Restore a soft-deleted project (Admin only).

### Audit Logs Routes

- **GET** `/audit-logs`: Retrieve a list of audit logs (Admin only).

## Testing the API

You can test all the available API routes via Postman.  
Use this Postman workspace to explore and test the API routes:  
[Postman Workspace - Admin Panel API](https://www.postman.com/sha-if/admin-panel-api)

Make sure to include JWT tokens where required for authentication and authorization when testing the API.

## License

This project is licensed under the MIT License.
