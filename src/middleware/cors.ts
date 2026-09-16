import corsMiddleware, { CorsOptions } from "cors";
import env from "../config/index.ts";

const allowedOrigins = [
    env.CLIENT_URL,
    "http://localhost:5137",
    "http://localhost:3000",
    "http://localhost:8081",
    "http://127.0.0.1:5137",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8081"
];

const corsOptions: CorsOptions = {
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "x-auth-token"],
    credentials: true,
    origin: (origin, callback) => {
        
        if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === "test") {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

export const cors = corsMiddleware(corsOptions);