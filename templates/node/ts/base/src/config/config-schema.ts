import { z } from 'zod';

export const configSchema = z.object({
  application: z.object({
    port: z.coerce.number().positive().default(3000),
  }),
});
