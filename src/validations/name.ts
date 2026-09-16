import { z } from "zod";

export const nameSchema = z.object({
    first: z.string().min(2, "First name must be at least 2 characters long").max(100, "First name must be at most 100 characters long"),
    middleName: z.string().max(100, "Middle name must be at most 100 characters long").nullish().or(z.literal("")),
    last: z.string().min(2, "Last name must be at least 2 characters long").max(100, "Last name must be at most 100 characters long")
});

export type Name = z.infer<typeof nameSchema>;