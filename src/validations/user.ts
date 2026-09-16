import { z } from "zod";
import { addressSchema } from "./address.ts";
import { nameSchema } from "./name.ts";
import { passwordRegex, phoneRegex } from "./patterns.ts";
import { imageSchema } from "./image.ts";

export const userSchema = z.object({
    address: addressSchema,
    email: z.string().email().min(5).max(250, "Email must be between 5 and 250 characters long"),
    name: nameSchema,
    password: z.string().min(6).max(30, "Password must be between 6 and 30 characters long").regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
    phone: z.string().min(8).max(12, "Phone must be between 8 and 12 characters long").regex(phoneRegex, "Phone must be a valid phone number"),
    image: imageSchema,
    isBusiness: z.boolean(),
    isAdmin: z.boolean().optional().default(false),
})

export type User = z.infer<typeof userSchema>;