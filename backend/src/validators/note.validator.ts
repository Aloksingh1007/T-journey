import { z } from 'zod';

export const createNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'Note content is required')
    .max(2000, 'Note content cannot exceed 2000 characters'),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
