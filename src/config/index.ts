import z from "zod";

const envSchema = z.object({
    DB_CONNECTION_STRING: z.string().min(1, "DB_CONNECTION_STRING Is required"),
    PORT: z.coerce.number().int().min(10).max(65535),
    CLIENT_URL: z.string().url("CLIENT_URL must contain valid URL"),
    NODE_ENV: z.enum(["production", "test", "development", "default"]),
    LOG_LEVEL: z.enum(["silent", "error", "warn", "info", "debug"]).default("info"),
    APP_NAME: z.string().min(1, "APP_NAME is required"),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error("❌ Error in .env file:");

    result.error.issues.forEach((iss) => {
        const fieldPath = iss.path.join(".") || "root";
        console.error(`- Field [${fieldPath}]: ${iss.message} (code: ${iss.code})`);
    });

    process.exit(1);
}

export default result.data;
