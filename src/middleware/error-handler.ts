import { type ErrorRequestHandler } from "express";
import { MongoServerError } from "mongodb";
import { ZodError } from "zod";
import env from "../config/index.ts";
import fs from "fs";
import path from "path";

const logErrorToFile = (status: number, message: string, url: string) => {
    try {
        const logsDir = path.join(process.cwd(), "logs");
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }

        const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
        const logFilePath = path.join(logsDir, `${today}.log`);
        const logEntry = `[${new Date().toISOString()}] Status: ${status} | Route: ${url} | Message: ${message}\n`;

        fs.appendFileSync(logFilePath, logEntry, "utf8");
    } catch (fsError) {
        console.error("⚠️ Failed to write log to file:", fsError);
    }
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);

    let status = err.statusCode || err.status || 500;
    let message = err.message || "Internal server error";

    // 1. Invalid JSON Body
    if (err instanceof SyntaxError && "body" in err) {
        status = 400;
        logErrorToFile(status, err.message, req.originalUrl);
        return res.status(status).json({
            error: err.name,
            message: "⚠️ Invalid JSON format. Please verify your request syntax.",
            description: err.message,
        });
    }

    // 2. Zod Validation Error
    if (err instanceof ZodError) {
        status = 400;
        logErrorToFile(status, "Validation failed", req.originalUrl);
        return res.status(status).json({
            message: "⚠️ Validation failed. Please check the provided fields.",
            issues: err.issues,
        });
    }

    // 3. MongoDB Error
    if (err instanceof MongoServerError) {
        status = 400;
        logErrorToFile(status, err.message, req.originalUrl);
        return res.status(status).json({
            message: "⚠️ Database operation failed. Duplicate or invalid data constraint.",
            code: err.errorResponse?.code ?? "no-code",
            name: err.name,
            keyValue: err.keyValue,
            stack: env.LOG_LEVEL === "debug" ? err.stack : undefined,
        });
    }

    // 4. Custom HttpError 
    status = status >= 400 ? status : 500;
    logErrorToFile(status, message, req.originalUrl);

    return res.status(status).json({
        message: message || "💥 Internal server error. Something went wrong on our end.",
        ...(env.LOG_LEVEL === "debug" && { error: err }),
    });
};

export { errorHandler };