# Full Stack Test Task - Authentication Solution

## How to Install

To easily set up and run the application with Docker, you can use the following `docker-compose.yml` configuration.

### 1. Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/ouss4m4/easygen.git
cd easygen
```

### 2. Build and run the application:

```bash
docker-compose up --build -d
```

This will start the **App (front-end)**, **MongoDB** and **Redis** services.

Visit `http://localhost:3003` to see the app

---

## Solution - Authentication Implementation

### Overview of the Auth Implementation

This solution implements user authentication using the **NestJS** framework on the back-end and **React-Vite** on the front-end.

### Key Features:

1. **Sign Up**:

   - The user can sign up by providing their **email**, **name**, and **password**.
   - Password must meet the following requirements: (zod validation)
     - Minimum length of 8 characters
     - Contains at least 1 letter
     - Contains at least 1 number
     - Contains at least 1 special character

2. **Sign In (passport-local)**:

   - Passport Local Strategy (email/password)
   - The user can sign in using their **email** and **password**.
   - Login has a **5 retries** attempts before it gets locked for **1 minute**

3. **JWT Authentication (passport-jwt)**:

   - The system uses **JWT tokens** for authentication, where the back-end issues a JWT access token upon successful login.
   - The front-end stores the JWT access token and sends it with each request to protected routes.

4. **Refresh Tokens (redis cache)**:
   - Refresh tokens are used to extend the session. When the access token expires, the user can refresh it using the refresh token without needing to log in again.
   - Refresh tokens are stored securely using **httpOnly cookies** to prevent client-side access.

### Back-end Implementation:

- **NestJS** framework is used to handle authentication and JWT generation. The back-end also uses **MongoDB** as the database and **Redis** for storing refresh tokens.
- The API exposes the following endpoints:
  - **POST /auth/signup**: Registers a new user.
  - **POST /auth/login**: Authenticates the user and issues an access token and refresh token.
  - **POST /auth/refresh**: Refreshes the access token using the refresh token.
  - **GET /auth/me**: Retrieves the authenticated user's profile.
  - **GET /auth/logout**: clear the cookie and cached token.

---

## Tech Stack

- **Front-end**:

  - React-Vite
  - Zod for valdation
  - react-hook-forms
  - tailwind + shadcn for styling

- **Back-end**:

  - NestJS (for building the RESTful API)
  - Zod for DTOs and validation
  - Passport for auth
  - MongoDB (for user data storage)
  - Redis (for storing and managing refresh tokens)
  - Swagger for API documentation
  - Winston for log (and rotation)
