import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['PARENT', 'CHILD']),
  parentEmail: z.string().email().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  coverUrl: z.string().url().optional().or(z.literal('')),
  googleBooksId: z.string().optional(),
  pageCount: z.number().int().positive().optional(),
  description: z.string().optional(),
});

export const sessionSchema = z.object({
  bookId: z.string().cuid('Invalid book ID'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  durationMinutes: z.number().int().min(1).max(1440),
  notes: z.string().max(500).optional(),
});

export const rewardSchema = z.object({
  title: z.string().min(1).max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1).max(500, 'Description must be less than 500 characters'),
  pointsCost: z.number().int().min(1, 'Points cost must be at least 1'),
  icon: z.string().min(1, 'Icon is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookInput = z.infer<typeof bookSchema>;
export type SessionInput = z.infer<typeof sessionSchema>;
export type RewardInput = z.infer<typeof rewardSchema>;