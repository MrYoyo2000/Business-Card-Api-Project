import { type RequestHandler } from "express";
import { type ZodType} from "zod";
import { userSchema } from "../validations/user"
import { loginSchema } from "../validations/login";
import { cardSchema } from "../validations/card";

export function validateSchema<T>(
    schema: ZodType<T>,
): RequestHandler<any, any, T> {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            next(error);
        }
    };
}

export const validateUser = validateSchema(userSchema);
export const validateLogin = validateSchema(loginSchema);
export const validateUserUpdate = validateSchema(userSchema.partial());
export const validateCard = validateSchema(cardSchema);