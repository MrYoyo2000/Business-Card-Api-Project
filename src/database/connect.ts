import env from "../config/index.ts";
import mongoose from "mongoose";
import initDB from "./init-db.ts";
import { logger } from "../logger/logger.ts";

const connectDB = async (
connectionString: string = env.DB_CONNECTION_STRING
) => {
try {
    const connectionHost = connectionString.includes("mongodb+srv") ? "Cloud MongoDB Atlas" : "Local MongoDB";
    logger.info(`Connecting to database [${env.NODE_ENV}] at ${connectionHost}...`);

    await mongoose.connect(connectionString);
    logger.info("✅ Connected to MongoDB");
} catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Error connecting to MongoDB: ${message}`);
    process.exit(1);
}

try {
    await initDB();
} catch (seedError) {
    const message = seedError instanceof Error ? seedError.message : String(seedError);
    logger.warn(`⚠️ Warning: Database initialization failed: ${message}`);
}
};

export default connectDB;