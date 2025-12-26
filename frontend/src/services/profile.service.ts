import api from './api';
import type { UpdateProfileDTO, UpdatePrivacySettingsDTO, PrivacySettings } from '../types';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  tradingStyle?: string;
  experienceLevel?: string;
  privacySettings: PrivacySettings;
  stats: {
    totalTrades: number;
    winRate: number;
    totalPnL: number;
    currentStreak: number;
    longestWinStreak: number;
    bestTradeDate?: string;
  };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
    category: string;
  }>;
  milestones: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface ShareableStats {
  name: string | null;
  avatar: string | null;
  tradingStyle: string | null;
  experienceLevel: string | null;
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  currentStreak: number;
  longestWinStreak: number;
  bestTradeDate: string | null;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
    category: string;
  }>;
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const response = await api.get(`/profile/${userId}`);
  return response.data.data;
}

/**
 * Update own profile
 */
export async function updateProfile(data: UpdateProfileDTO): Promise<UserProfile> {
  const response = await api.put('/profile', data);
  return response.data.data;
}

/**
 * Get shareable profile statistics
 */
export async function getShareableStats(userId: string): Promise<ShareableStats> {
  const response = await api.get(`/profile/stats/${userId}`);
  return response.data.data;
}

/**
 * Update privacy settings
 */
export async function updatePrivacySettings(data: UpdatePrivacySettingsDTO): Promise<PrivacySettings> {
  const response = await api.put('/profile/privacy', data);
  return response.data.data;
}

/**
 * Upload profile avatar
 */
export async function uploadAvatar(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post('/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
}

/**
 * Recalculate profile statistics
 */
export async function recalculateStats(): Promise<void> {
  await api.post('/profile/recalculate-stats');
}
