import { z } from "zod";

export const imageSchema = z.object({
    alt: z.string().max(100, "Alt text must be at most 100 characters long").nullish().or(z.literal("")),
    url: z.string().url().min(5, "URL must be at least 5 characters long").max(250, "URL must be at most 250 characters long"),
});

export type Image = z.infer<typeof imageSchema>;