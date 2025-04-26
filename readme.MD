# Full Stack Auth App

## Features Checklist

### Frontend

- Built with React (Vite)
- Styled using shadcn/ui (TailwindCSS based)
- Sign Up page with:

  - Email, Name, Password fields
  - Password strength validation (letter, number, special character, min 8 characters)

- Sign In page with:
  - Email and Password fields
- Application page:
  - Displays a welcome message
- Logout functionality
- JWT auto-refresh when expired
- Protected routes based on authentication state
- React context for auth state management
- Dockerized frontend build included in backend image

### Backend

- Built with NestJS
- Database: MongoDB (with Mongoose)
- Endpoints for:
  - User Registration
  - User Login
  - JWT Token Refresh
  - Fetch authenticated user profile
- Password hashing (bcryptjs)
- JWT authentication with access and refresh tokens
- `@nestjs/serve-static` for serving frontend
- Environment variables managed for secret configuration
- Full TypeScript across backend and frontend
- Dockerized backend with multi-stage builds

### Extras

- ZOD Form validation on both frontend and backend
- Clean modular code structure
- Minimal and responsive UI/UX
- Security best practices applied (token expiry, password hashing)
- Logging via NestJS built-in logger

## Tech Stack

- React (Vite)
- NestJS
- MongoDB
- TypeScript
- Docker
- TailwindCSS (shadcn/ui)
