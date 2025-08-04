# Employee Absence Management System (EAMS)

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

A backend application for managing employee absence requests, built with NestJS. It includes user authentication (registration, login), absence request management, and role-based access control.

## Features

*   **User Management**: Register and authenticate users.
    *   `User` entity: `id`, `name`, `email`, `role` (EMPLOYEE, ADMIN)
*   **Absence Request Management**: Employees can create absence requests; Admins can approve or reject them.
    *   `AbsenceRequest` entity: `id`, `employeeId` (FK to User), `startDate`, `endDate`, `reason`, `status` (PENDING, APPROVED, REJECTED), `createdAt`
*   **Authentication**: JWT-based authentication using `@nestjs/jwt` and password hashing with `bcrypt`.
*   **Authorization**: Role-based access control using NestJS Guards and custom decorators.
*   **Pagination**: Retrieve absence requests with pagination for efficient data loading.
*   **Rate Limiting**: Protect API endpoints from abuse using `@nestjs/throttler`.
*   **Unit Tests**: Comprehensive unit tests for core services using `@nestjs/testing`.
*   **Database**: Uses SQLite for data storage with TypeORM.

## Tech Stack

*   [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
*   [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript (ES7, ES6, ES5). Supports MySQL, PostgreSQL, Microsoft SQL Server, Oracle, SAP Hana, SQLite, MariaDB, CockroachDB, Mongo, Amazon Aurora, React Native, NativeScript, Expo, and more.
*   [SQLite](https://www.sqlite.org/index.html) - A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.
*   [JWT (JSON Web Tokens)](https://jwt.io/) - For secure authentication.
*   [Bcrypt](https://www.npmjs.com/package/bcrypt) - For password hashing.
*   [@nestjs/throttler](https://docs.nestjs.com/security/rate-limiting) - For implementing rate limiting.
*   [@nestjs/testing](https://docs.nestjs.com/fundamentals/testing) - For unit testing NestJS applications.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

*   [Node.js](https://nodejs.org/): Version 18 or higher.
*   [npm](https://www.npmjs.com/) (Node Package Manager): Comes with Node.js.
*   [Postman](https://www.postman.com/downloads/) (or a similar API client) for testing the API endpoints.

## Local Setup

Follow these steps to get the project up and running on your local machine:

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd eams
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    This will install all the required packages, including `@nestjs/throttler`.

3.  **Database Setup (SQLite):**
    This project uses SQLite, which is a file-based database. TypeORM will automatically create the `eams.db` file in your project root when the application starts for the first time if it doesn't exist.

## Running the Application

### Development Mode

To run the application in development mode with live reloading (watches for changes and recompiles):

```bash
npm run start:dev
```
The application will usually run on `http://localhost:3000`.

### Production Mode

To build the application for production and then run it:

```bash
npm run build
npm run start:prod
```

## Running Tests

### Unit Tests

To run the unit tests for services (AuthService, AppService, AbsenceService):

```bash
npm run test
```

### Test Coverage

To run tests and generate a coverage report:

```bash
npm run test:cov
```

## API Endpoints with Postman

You can test the API endpoints using Postman.

### 1. Authentication Endpoints

#### **Register User**
*   **URL:** `http://localhost:3000/auth/register`
*   **Method:** `POST`
*   **Headers:** `Content-Type: application/json`
*   **Body (raw JSON):**
    ```json
    {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "strongpassword",
        "role": "EMPLOYEE"
    }
    ```
    (You can change `role` to `ADMIN` for an administrator user)

#### **Login User**
*   **URL:** `http://localhost:3000/auth/login`
*   **Method:** `POST`
*   **Headers:** `Content-Type: application/json`
*   **Body (raw JSON):**
    ```json
    {
        "email": "john.doe@example.com",
        "password": "strongpassword"
    }
    ```
*   **Postman Test Script (in the 'Tests' tab):** This script automatically saves the received JWT token as an environment variable named `jwt_token`.
    ```javascript
    var jsonData = pm.response.json();
    pm.environment.set("jwt_token", jsonData.token);
    ```

### 2. Absence Requests Endpoints (Protected)

These endpoints require a valid JWT token in the `Authorization` header. Make sure to log in first to obtain the `jwt_token`.

*   **Header to add for all protected APIs:**
    *   Key: `Authorization`
    *   Value: `Bearer {{jwt_token}}` (Use the Postman environment variable)

#### **Get All Absence Requests**
*   **URL:** `http://localhost:3000/absences`
*   **Method:** `GET`
*   **Query Parameters (for pagination - Optional):**
    *   `page`: (e.g., `1`)
    *   `limit`: (e.g., `10`)
    *   Example URL with pagination: `http://localhost:3000/absences?page=1&limit=5`

#### **Create New Absence Request (Employee Only)**
*   **URL:** `http://localhost:3000/absences`
*   **Method:** `POST`
*   **Headers:** `Content-Type: application/json`, `Authorization: Bearer {{jwt_token}}`
*   **Body (raw JSON):**
    ```json
    {
        "startDate": "2025-04-01",
        "endDate": "2025-04-05",
        "reason": "Family vacation"
    }
    ```

#### **Approve Absence Request (Admin Only)**
*   **URL:** `http://localhost:3000/absences/:id/approve` (Replace `:id` with the actual Absence Request ID)
*   **Method:** `PATCH`
*   **Headers:** `Authorization: Bearer {{jwt_token}}`
    *   **Example URL:** `http://localhost:3000/absences/a1b2c3d4-e5f6-7890-1234-567890abcdef/approve`
*   **Note:** This action requires a user with the `ADMIN` role.

#### **Reject Absence Request (Admin Only)**
*   **URL:** `http://localhost:3000/absences/:id/reject` (Replace `:id` with the actual Absence Request ID)
*   **Method:** `PATCH`
*   **Headers:** `Authorization: Bearer {{jwt_token}}`
    *   **Example URL:** `http://localhost:3000/absences/a1b2c3d4-e5f6-7890-1234-567890abcdef/reject`
*   **Note:** This action requires a user with the `ADMIN` role.

## Rate Limiting

The application has a global rate limit configured:
*   **Limit:** 10 requests
*   **Time Window (TTL):** 60 seconds (60000 milliseconds)

If you exceed this limit within the given time window, the API will respond with a `429 Too Many Requests` status code.

---
