import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.string(),
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
