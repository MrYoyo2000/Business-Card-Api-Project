# 📇 Business Card API

A professional, production-ready REST API built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**. This project allows users to create, manage, and share digital business cards.

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- [npm](https://npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation
```bash
npm install
```

### Running the Application
The project supports three distinct environments:

| Command | Environment | DB Target | Description |
| :--- | :--- | :--- | :--- |
| `npm run dev` | **Development** | Local MongoDB | Auto-restarts on changes (Nodemon) |
| `npm start` | **Production** | Cloud MongoDB Atlas | Optimized for deployment |
| `npm run test` | **Testing** | Test MongoDB | Used for automated testing |

---

## 🏗️ Project Architecture (Folder Structure)

To ensure a clean separation of concerns, the project follows a modular service-based architecture:

```text
src/
├── @types/         # Global TypeScript definitions (e.g., Express Request extensions)
├── config/         # Environment variables and configuration management
├── database/       # Database connection and Mongoose schemas/models
│   └── schemas/    # Detailed DB definitions for Users, Cards, etc.
├── error/          # Custom Error classes (e.g., HttpError, NotFoundError)
├── logger/         # Pino logger configuration for professional logging
├── middleware/     # Express middlewares (Auth, Validation, Error Handling)
├── routes/         # API Route definitions (Endpoints)
├── services/       # Business logic (The "brain" of the app)
└── validations/    # Zod schemas for strict input validation
```

### How data flows:
`Request` $\rightarrow$ `Route` $\rightarrow$ `Middleware (Auth/Validate)` $\rightarrow$ `Service` $\rightarrow$ `Database` $\rightarrow$ `Response`

---

## 🛠️ Tech Stack

- **Runtime**: Node.js / TypeScript
- **Framework**: Express.js
- **Database**: MongoDB / Mongoose
- **Validation**: Zod (Strict schema validation)
- **Security**: JWT (JSON Web Tokens) via `jose` & `bcrypt` for password hashing
- **Logging**: Pino (High-performance logging)
- **Environment**: Dotenvx

## 📖 API Documentation
Detailed request examples and endpoint tests can be found in the `/rest` directory:
- `rest/users.rest`: All user-related endpoints.
- `rest/cards.rest`: All business card-related endpoints.

---

## 📝 License
ISC
