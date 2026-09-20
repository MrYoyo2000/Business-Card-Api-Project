import dotenv from "dotenv";
import path from "path";
import z from "zod";


const isProduction =
    process.env.NODE_ENV === "production" ||
    process.argv.includes("--prod") ||
    process.env.DB_CONNECTION_STRING?.includes("mongodb.net");

const envFile = isProduction ? ".env.production" : ".env.development";

dotenv.config({ path: path.resolve(process.cwd(), `src/config/${envFile}`) });


dotenv.config({ path: path.resolve(process.cwd(), "src/config/.env") });

const envSchema = z.object({
    DB_CONNECTION_STRING: z.string().min(1, "DB_CONNECTION_STRING is required"),
    PORT: z.coerce.number().int().default(3000),
    CLIENT_URL: z.string().url(),
    NODE_ENV: z
    .enum(["production", "test", "development", "default"])
    .default("development"),
    LOG_LEVEL: z
    .enum(["silent", "error", "warn", "info", "debug"])
    .default("info"),
    APP_NAME: z.string().min(1),
    JWT_SECRET: z.string().min(1),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    process.exit(1);
}

export default result.data;