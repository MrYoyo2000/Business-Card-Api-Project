# 📇 Business Card API - Engineering Documentation

## 📖 1. Executive Summary
The **Business Card API** is a professional-grade backend system engineered to provide a secure and scalable platform for digital business card management. The project implements a **Service-Oriented Architecture (SOA)**, emphasizing strict separation of concerns, runtime type safety, and comprehensive observability.

The primary goal is to bridge the gap between flexible NoSQL storage and strict TypeScript typing, ensuring that the API is both agile and bulletproof.

---

## 🛠️ 2. The Technical Ecosystem (Deep Dive)

### 🏗️ Core Infrastructure
- **Node.js & TypeScript (v7.0+)**: Utilized to create a compile-time safety net. TypeScript interfaces are used across the entire project to ensure that a `User` object in the database is the same `User` object in the service and the route.
- **Express.js**: Handles the HTTP layer. It is configured as a lean pipeline of middlewares.

### 💾 Data Strategy
- **MongoDB & Mongoose**: We use a document-oriented approach to support the naturally nested structure of business cards (Address $\rightarrow$ Card $\rightarrow$ User).
- **Mongoose Model Methods**: We implement custom instance methods (e.g., `setPassword`, `comparePassword`) directly on the `userDbSchema` to encapsulate security logic within the data layer.
- **Zod**: Implements **Runtime Schema Validation**. While TypeScript protects us during development, Zod protects the server during execution by validating `req.body` before it reaches any business logic.

### 🔐 Security Implementation
- **Stateless Auth (JWT)**: Implemented via the `jose` library. Tokens are signed with a secret key and include claims (`isAdmin`, `isBusiness`) to minimize database lookups.
- **Password Security**: Uses `bcrypt` with a salt factor of 12, ensuring passwords are never stored in plain text.
- **RBAC (Role-Based Access Control)**: Custom middlewares (`is-admin.ts`, `is-business.ts`) act as guards, checking the JWT claims before granting access to protected routes.

### 📊 Observability & DevOps
- **Pino Ecosystem**: We use `pino` for high-performance logging.
    - **Development**: `pino-pretty` provides color-coded, readable logs.
    - **Production**: JSON-structured logs for seamless integration with log aggregators.
- **dotenvx**: Advanced environment management that allows the API to switch between `.env.development`, `.env.test`, and `.env.production` seamlessly.

---

## 🧬 3. The Architecture: Flow of a Request

The project is structured as a pipeline. A request to create a card (`POST /api/v1/cards`) follows this exact path:

1.  **`src/index.ts`**: The request enters. `express.json()` parses the raw body.
2.  **`middleware/cors.ts`**: Validates that the request comes from an authorized origin.
3.  **`middleware/validate-token.ts`**: Verifies the JWT in the `Authorization` header. It fetches the user from MongoDB and attaches it to `req.user`.
4.  **`middleware/is-business.ts`**: Checks if `req.user.isBusiness === true`.
5.  **`middleware/validate.ts`**: Passes `req.body` through the `cardSchema` (Zod). If a field like `email` is invalid, it throws a `400` error immediately.
6.  **`routes/cards.ts`**: The route simply calls the service: `cardService.createCard(req.body, userId)`.
7.  **`services/card-service.ts`**: The "Brain". It generates a unique `bizNumber`, handles the Mongoose `create` call, and returns the result.
8.  **`database/models.ts`**: The data is persisted in MongoDB.
9.  **`middleware/error-handler.ts`**: If any of the above steps failed, this final middleware catches the error and sends a professional JSON response.

---

## 📂 4. Folder Mapping (The A-Z Dictionary)

| Path | Component | Technical Role |
| :--- | :--- | :--- |
| `src/@types` | **Global Types** | Extends `Express.Request` to include the `user` property globally. |
| `src/config` | **Environment** | Uses Zod to validate `.env` variables on startup. |
| `src/database` | **Persistence** | `connect.ts` (Connection), `init-db.ts` (Seeding), `schemas/` (DB Structure). |
| `src/error` | **Exception Mgmt** | Custom classes like `HttpError` and `NotFoundError`. |
| `src/logger` | **Observability** | Centralized Pino configuration for console and file logs. |
| `src/middleware` | **Interceptors** | Authentication, Authorization, and Zod Validation. |
| `src/routes` | **API Surface** | Maps HTTP verbs and paths to Service functions. |
| `src/services` | **Business Logic** | Pure logic. Handles hashing, JWTs, and DB queries. |
| `src/validations` | **Contract** | Zod schemas defining the "legal" shape of every request. |

---

## 🚀 5. Operational Commands

The project uses `tsx` for instant execution without a separate build step.

### 💻 Development
`npm run dev / pnpm dev`
- **Env**: `.env.development`
- **Feature**: Nodemon auto-restart + Colorized logs.

### 🧪 Testing
`npm run test / pnpm test`
- **Env**: `.env.test`
- **Feature**: Isolated test database for QA.

### 📦 Production
`npm run prod / pnpm prod `
- **Env**: `.env.production`
- **Feature**: Optimized performance + JSON structured logs.

---

## 🛠️ 6. First-Time Setup

1. **Clone & Install**:
   ```bash
   git clone <repo-url>
   npm install
   ```
2. **Environment Config**:
   Create a `.env` file with:
   - `DB_CONNECTION_STRING` (MongoDB URI)
   - `JWT_SECRET` (Strong random key)
   - `PORT` (Default: 3000)
   - `NODE_ENV` (development/production)
3. **Launch**:
   ```bash
   npm run dev
   ```

---

## 🚦 Endpoint Matrix

### Users
- `POST /api/v1/users` $\rightarrow$ Register (Public)
- `POST /api/v1/users/login` $\rightarrow$ Login $\rightarrow$ Returns JWT (Public)
- `GET /api/v1/users/:id` $\rightarrow$ Profile (Owner/Admin)
- `PUT /api/v1/users/:id` $\rightarrow$ Update (Owner)

### Business Cards
- `POST /api/v1/cards` $\rightarrow$ Create (Business User)
- `GET /api/v1/cards` $\rightarrow$ List all (Public)
- `GET /api/v1/cards/my-cards` $\rightarrow$ My cards (User)
- `PATCH /api/v1/cards/:id` $\rightarrow$ Like/Unlike (User)
- `DELETE /api/v1/cards/:id` $\rightarrow$ Delete (Owner/Admin)
