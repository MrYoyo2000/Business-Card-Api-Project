import env from "./config/index.ts";
import express from "express";
import notFound from "./middleware/not-found.ts";
import usersRouter from "./routes/users.ts";
import cardsRouter from "./routes/cards.ts";
import connectDB from "./database/connect.ts";
import { errorHandler } from "./middleware/error-handler.ts";
import { httpLogger, logger } from "./logger/logger.ts";
import { cors } from "./middleware/cors.ts";

async function startServer() {
    try {
        await connectDB();

        const app = express();

        app.use(express.json());
        app.use(cors);
        app.use(httpLogger);

        app.use("/api/v1/users", usersRouter);
        app.use("/api/v1/cards", cardsRouter);

        app.use(notFound);
        app.use(errorHandler);

        const PORT = env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`🚀 Server runs on: http://localhost:${PORT}`);
            logger.info(`Server runs on: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        logger.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
}

startServer();