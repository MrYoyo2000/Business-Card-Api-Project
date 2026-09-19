import env from "../config/index.ts";
import pino, { Level } from "pino";
import pinoHttpModule from "pino-http";

export const logger = pino({
    level: (env?.LOG_LEVEL as Level) ?? "info",
});

// En ES Module, la fonction est portée par la propriété .default ou l'import direct
const pinoHttp = (pinoHttpModule as any).default || pinoHttpModule;

export const httpLogger = pinoHttp({
    logger,
        customLogLevel(_req: any, res: any, err: any) {
            if (res.statusCode >= 500 || err) return "error";
            if (res.statusCode >= 400) return "warn";
            return "info";
        },
});