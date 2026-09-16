import {z} from "zod";
import {addressSchema} from "./address.ts";
import { phoneRegex } from "./patterns.ts";
import { imageSchema } from "./image.ts";

export const cardSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long").max(100, "Title must be at most 100 characters long"),
    subtitle: z.string().min(2, "Subtitle must be at least 2 characters long").max(100, "Subtitle must be at most 100 characters long"),
    description: z.string().min(2, "Description must be at least 2 characters long").max(200, "Description must be at most 200 characters long"),
    phone: z.string().min(2, "Phone must be at least 2 characters long").max(50, "Phone must be at most 50 characters long").regex(phoneRegex),
    email: z.string().email().min(5, "Email must be at least 5 characters long").max(255, "Email must be at most 255 characters long"),
    web: z.string().url().min(5, "Website URL must be at least 5 characters long").max(255, "Website URL must be at most 255 characters long"),
    image: imageSchema,
    address: addressSchema,
})

export type Card = z.infer<typeof cardSchema>;