import env from "../config/index"
import pino from "pino"
import pinoHttp from "pino-http"

export const logger = pino({level: "info"})

export const httpLogger = pinoHttp({
    logger,
    customLogLevel(req, res, error){
        if (res.statusCode >= 500) return "error"
        if (res.statusCode >= 400) return "warn"
        return "info"
    },
});