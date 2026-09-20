import env from "../config/index.ts";
import mongoose from "mongoose";
import initDB from "./init-db.ts";
import { logger } from "../logger/logger.ts";

const connectDB = async (overrideUri?: string) => {
try {
    const connectionString = overrideUri || env.DB_CONNECTION_STRING;

    if (!connectionString) {
        throw new Error("DB_CONNECTION_STRING is missing or undefined!");
    }

    const connectionHost = connectionString.includes("mongodb+srv")
        ? "Cloud MongoDB Atlas"
        : "Local MongoDB";

    logger.info(
        `Connecting to database [${env.NODE_ENV}] at ${connectionHost}...`
    );

    // Masque le mot de passe pour le log de sécurité
    const maskedURI = connectionString.replace(/:([^@]+)@/, ":*****@");
    console.log(`📌 TARGET MONGO URI: ${maskedURI}`);

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
    const message =
        seedError instanceof Error ? seedError.message : String(seedError);
    logger.warn(`⚠️ Warning: Database initialization failed: ${message}`);
}
};

export default connectDB;