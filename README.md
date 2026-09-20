# 📇 Business Card API - Professional Technical Documentation

## 📖 1. Project Overview
The **Business Card API** is a high-performance backend system designed to digitize professional networking. It allows users to create, manage, and share digital business cards. The system is built with a "Security-First" and "Type-Safe" approach, ensuring that data integrity is maintained from the moment a request hits the server until it is stored in the database.

---

## 🛠️ 2. The Technical Arsenal (Why these tools?)

### 🏗️ Core Framework
- **Node.js & TypeScript**: We use TypeScript to eliminate an entire class of runtime errors. By defining strict interfaces for Users and Cards, we ensure the code is self-documenting and robust.
- **Express.js**: Chosen for its minimalism and massive ecosystem of middlewares.

### 💾 Data & Validation
- **MongoDB & Mongoose**: A NoSQL approach was chosen to allow flexibility in business card fields. Mongoose provides the structure needed to prevent "data chaos".
- **Zod**: Unlike standard validation, Zod provides **Runtime Type Safety**. It guarantees that if a request passes the validation layer, the TypeScript types are 100% accurate in the services.

### 🔐 Security Layer
- **JOSE (JSON Object Signing and Encryption)**: Used instead of older libraries for JWT. It is lightweight, modern, and highly secure.
- **Bcrypt**: Implements salted password hashing to ensure that even in case of a database leak, user passwords remain encrypted.
- **CORS**: Configured to prevent unauthorized domains from accessing the API.

### 📊 Observability
- **Pino & pino-http**: We use the fastest logger in the Node.js ecosystem. It supports structured logging (JSON) for production and "Pretty Printing" for developers.
- **dotenvx**: Manages environment variables across different stages (Dev, Test, Prod) without risking secret leaks.

---

## 🧬 3. Architecture Deep-Dive (A to Z)

### The Request Lifecycle (The Journey of a Packet)
When a client sends a request, it travels through these stages:

1. **Entry**: `src/index.ts` receives the request.
2. **Security Gate**: `middleware/cors.ts` checks if the origin is allowed.
3. **Logging**: `httpLogger` records the request start time and metadata.
4. **Authentication**: `middleware/validate-token.ts` verifies the JWT. If valid, it attaches the `User` object to `req.user`.
5. **Authorization**: `middleware/is-admin.ts` or `is-business.ts` checks if the user has the required role.
6. **Validation**: `middleware/validate.ts` uses a **Zod Schema** to check the `req.body`. If a field is missing or wrong, it throws a `400 Bad Request` immediately.
7. **Business Logic**: The `Service` (e.g., `card-service.ts`) processes the data, applies business rules (like unique business numbers), and talks to the database.
8. **Persistence**: `database/models.ts` saves/retrieves data from MongoDB.
9. **Response**: The result is sent back. If any error occurred at any stage, the `error-handler.ts` catches it and formats it into a professional JSON response.

---

## 📂 4. Folder Dictionary

| Folder | Purpose | Key Component |
| :--- | :--- | :--- |
| `src/@types` | Extends native types (e.g., adding `.user` to Express Request). | `express.d.ts` |
| `src/config` | Validates and exports environment variables. | `index.ts` |
| `src/database` | Manages DB connection and data structure. | `connect.ts`, `schemas/` |
| `src/error` | Defines custom error classes for consistent API responses. | `custom-error.ts` |
| `src/logger` | Configures the Pino logging system. | `logger.ts` |
| `src/middleware` | Logic that runs *between* the request and the route. | `validate.ts`, `validate-token.ts` |
| `src/routes` | Maps URLs to the correct service logic. | `users.ts`, `cards.ts` |
| `src/services` | The "Brain". Pure business logic, independent of Express. | `user-service.ts`, `card-service.ts` |
| `src/validations` | Zod blueprints for every single input. | `user.ts`, `card.ts` |

---

## 🚀 5. Command Center (Execution Guide)

The project uses `dotenvx` to switch environments instantly.

### 💻 Development Mode
**Command**: `pnpm dev`
- **Environment**: `src/config/.env.development`
- **Behavior**: Uses `nodemon` $\rightarrow$ Server restarts automatically when you save a file.
- **Logs**: Colorized and human-readable.

### 🧪 Testing Mode
**Command**: `pnpm test`
- **Environment**: `src/config/.env.test`
- **Behavior**: Connects to a dedicated test database to avoid corrupting real data.

### 📦 Production Mode
**Command**: `pnpm prod`
- **Environment**: `src/config/.env.production`
- **Behavior**: Optimized for speed, logs are structured as JSON for ingestion by tools like ELK or Datadog.

---

## 🛠️ 6. Installation & First-Run

1. **Clone the repo**
2. **Install**: `npm install`
3. **Environment**: Setup your `.env` file with `DB_CONNECTION_STRING`, `JWT_SECRET`, and `PORT`.
4. **Launch**: `npm run dev`

---

## 🚦 API Summary

### User Endpoints
- `POST /api/v1/users` $\rightarrow$ Register.
- `POST /api/v1/users/login` $\rightarrow$ Login $\rightarrow$ Get JWT.
- `GET /api/v1/users/:id` $\rightarrow$ View Profile (User/Admin).

### Card Endpoints
- `POST /api/v1/cards` $\rightarrow$ Create Card (Business Users Only).
- `GET /api/v1/cards` $\rightarrow$ Explore all cards.
- `PATCH /api/v1/cards/:id` $\rightarrow$ Like/Unlike.
- `DELETE /api/v1/cards/:id` $\rightarrow$ Delete (Owner/Admin).
