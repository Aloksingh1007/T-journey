import { z } from 'zod';

/**
 * Schema for dashboard stats query parameters
 */
export const DashboardQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type DashboardQuery = z.infer<typeof DashboardQuerySchema>;
