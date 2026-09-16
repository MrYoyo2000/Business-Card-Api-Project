import { type Request, type RequestHandler } from "express";
import { HttpError } from "../error/custom-error.ts";
import authService from "../services/auth-service.ts";
import { UserModel } from "../database/models.ts";

const extractToken = (req: Request): string => {
    const authToken = req.header("Authorization");

    if (
        authToken &&
        authToken.length > 7 &&
        authToken.toLowerCase().startsWith("bearer ")
    ) {
        return authToken.substring(7).trim();
    }
    
    throw new HttpError(
        "🔑 Access denied. Missing or malformed Authorization header.",
        401
    );
};

const validateToken: RequestHandler = async (req, res, next) => {
    try {
        const token = extractToken(req);
        
        const { email } = await authService.verifyJWT(token);
        
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            throw new HttpError("👤 Authentication failed. User no longer exists.", 401);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default validateToken;
