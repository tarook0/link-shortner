// server/src/utils/validation.ts
import { z } from 'zod';

export const createUrlSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  customCode: z.string().regex(/^[a-zA-Z0-9-_]+$/, {
    message: "Custom code can only contain letters, numbers, hyphens, and underscores"
  }).min(3).max(50).optional(),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;