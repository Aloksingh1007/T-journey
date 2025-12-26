import { z } from 'zod';
import { TradingStyle, ExperienceLevel, ProfileVisibility } from '../types';

/**
 * Schema for updating user profile
 */
export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  tradingStyle: z.nativeEnum(TradingStyle).optional(),
  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Schema for updating privacy settings
 */
export const updatePrivacySettingsSchema = z.object({
  profileVisibility: z.nativeEnum(ProfileVisibility).optional(),
  shareStats: z.boolean().optional(),
  shareTrades: z.boolean().optional(),
  shareEmotions: z.boolean().optional(),
  sharePatterns: z.boolean().optional(),
});

export type UpdatePrivacySettingsInput = z.infer<typeof updatePrivacySettingsSchema>;
