import { z } from "zod";

export const addressSchema = z.object({
    country: z.string().min(2 , "Country must be at least 2 characters long").max(50, "Country must be at most 50 characters long"),
    city: z.string().min(2, "City must be at least 2 characters long").max(100, "City must be at most 100 characters long"),
    street: z.string().min(2, "Street must be at least 2 characters long").max(250, "Street must be at most 250 characters long"),
    state: z.string().min(2, "State must be at least 2 characters long").max(100, "State must be at most 100 characters long").optional().default(""),
    zip: z.string().max(30, "ZIP code must be at most 30 characters long").optional().default(""),
    houseNumber: z.number().min(1, "House number must be a positive integer").max(999999, "House number is too large"),
});

export type Address = z.infer<typeof addressSchema>;