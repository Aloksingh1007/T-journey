import prisma from '../utils/prisma';
import { NotFoundError, AuthorizationError } from '../utils/errors.util';
import { 
  UserProfile, 
  Badge, 
  Milestones, 
  PrivacySettings, 
  UpdateProfileDTO, 
  UpdatePrivacySettingsDTO,
  ProfileVisibility,
  TradingStyle,
  ExperienceLevel
} from '../types';

export class ProfileService {
  /**
   * Get user profile by ID
   * Respects privacy settings - only returns public data if viewer is not the owner
   */
  static async getUserProfile(
    userId: string,
    viewerId?: string
  ): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        tradingStyle: true,
        experienceLevel: true,
        profileVisibility: true,
        shareStats: true,
        shareTrades: true,
        shareEmotions: true,
        sharePatterns: true,
        totalTrades: true,
        winRate: true,
        totalPnL: true,
        currentStreak: true,
        longestWinStreak: true,
        bestTradeDate: true,
        badges: true,
        milestones: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isOwner = viewerId === userId;

    // Check privacy settings
    if (!isOwner && user.profileVisibility === 'PRIVATE') {
      throw new AuthorizationError('This profile is private');
    }

    // Build privacy settings object
    const privacySettings: PrivacySettings = {
      profileVisibility: user.profileVisibility as unknown as ProfileVisibility,
      shareStats: user.shareStats,
      shareTrades: user.shareTrades,
      shareEmotions: user.shareEmotions,
      sharePatterns: user.sharePatterns,
    };

    // Build profile response
    const profile: UserProfile = {
      id: user.id,
      email: isOwner ? user.email : '', // Only show email to owner
      name: user.name || undefined,
      bio: user.bio || undefined,
      avatar: user.avatar || undefined,
      tradingStyle: user.tradingStyle as unknown as TradingStyle | undefined,
      experienceLevel: user.experienceLevel as unknown as ExperienceLevel | undefined,
      privacySettings,
      stats: {
        totalTrades: user.totalTrades,
        winRate: Number(user.winRate),
        totalPnL: Number(user.totalPnL),
        currentStreak: user.currentStreak,
        longestWinStreak: user.longestWinStreak,
        bestTradeDate: user.bestTradeDate || undefined,
      },
      badges: (user.badges as unknown as Badge[]) || [],
      milestones: (user.milestones as unknown as Milestones) || {},
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Filter data based on privacy settings if not owner
    if (!isOwner) {
      // Hide stats if not shared
      if (!user.shareStats) {
        profile.stats = {
          totalTrades: 0,
          winRate: 0,
          totalPnL: 0,
          currentStreak: 0,
          longestWinStreak: 0,
        };
      }

      // Hide badges if stats not shared
      if (!user.shareStats) {
        profile.badges = [];
        profile.milestones = {};
      }

      // Don't expose privacy settings to non-owners
      profile.privacySettings = {
        profileVisibility: user.profileVisibility as unknown as ProfileVisibility,
        shareStats: user.shareStats,
        shareTrades: user.shareTrades,
        shareEmotions: user.shareEmotions,
        sharePatterns: user.sharePatterns,
      };
    }

    return profile;
  }

  /**
   * Update user profile
   * Only the owner can update their profile
   */
  static async updateProfile(
    userId: string,
    data: UpdateProfileDTO
  ): Promise<UserProfile> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        bio: data.bio,
        avatar: data.avatar,
        tradingStyle: data.tradingStyle,
        experienceLevel: data.experienceLevel,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        tradingStyle: true,
        experienceLevel: true,
        profileVisibility: true,
        shareStats: true,
        shareTrades: true,
        shareEmotions: true,
        sharePatterns: true,
        totalTrades: true,
        winRate: true,
        totalPnL: true,
        currentStreak: true,
        longestWinStreak: true,
        bestTradeDate: true,
        badges: true,
        milestones: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Build privacy settings object
    const privacySettings: PrivacySettings = {
      profileVisibility: updatedUser.profileVisibility as unknown as ProfileVisibility,
      shareStats: updatedUser.shareStats,
      shareTrades: updatedUser.shareTrades,
      shareEmotions: updatedUser.shareEmotions,
      sharePatterns: updatedUser.sharePatterns,
    };

    // Build and return profile
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name || undefined,
      bio: updatedUser.bio || undefined,
      avatar: updatedUser.avatar || undefined,
      tradingStyle: updatedUser.tradingStyle as unknown as TradingStyle | undefined,
      experienceLevel: updatedUser.experienceLevel as unknown as ExperienceLevel | undefined,
      privacySettings,
      stats: {
        totalTrades: updatedUser.totalTrades,
        winRate: Number(updatedUser.winRate),
        totalPnL: Number(updatedUser.totalPnL),
        currentStreak: updatedUser.currentStreak,
        longestWinStreak: updatedUser.longestWinStreak,
        bestTradeDate: updatedUser.bestTradeDate || undefined,
      },
      badges: (updatedUser.badges as unknown as Badge[]) || [],
      milestones: (updatedUser.milestones as unknown as Milestones) || {},
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  /**
   * Get shareable profile statistics
   * Returns public stats if user has enabled sharing
   */
  static async getShareableStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        avatar: true,
        tradingStyle: true,
        experienceLevel: true,
        totalTrades: true,
        winRate: true,
        totalPnL: true,
        currentStreak: true,
        longestWinStreak: true,
        bestTradeDate: true,
        badges: true,
        shareStats: true,
        profileVisibility: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if stats are shareable
    if (!user.shareStats && user.profileVisibility === 'PRIVATE') {
      throw new AuthorizationError('User has not enabled stats sharing');
    }

    return {
      name: user.name,
      avatar: user.avatar,
      tradingStyle: user.tradingStyle,
      experienceLevel: user.experienceLevel,
      totalTrades: user.totalTrades,
      winRate: Number(user.winRate),
      totalPnL: Number(user.totalPnL),
      currentStreak: user.currentStreak,
      longestWinStreak: user.longestWinStreak,
      bestTradeDate: user.bestTradeDate,
      badges: (user.badges as unknown as Badge[]) || [],
    };
  }

  /**
   * Update user privacy settings
   * Only the owner can update their privacy settings
   */
  static async updatePrivacySettings(
    userId: string,
    data: UpdatePrivacySettingsDTO
  ): Promise<PrivacySettings> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Update privacy settings
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profileVisibility: data.profileVisibility,
        shareStats: data.shareStats,
        shareTrades: data.shareTrades,
        shareEmotions: data.shareEmotions,
        sharePatterns: data.sharePatterns,
      },
      select: {
        profileVisibility: true,
        shareStats: true,
        shareTrades: true,
        shareEmotions: true,
        sharePatterns: true,
      },
    });

    // Return updated privacy settings
    return {
      profileVisibility: updatedUser.profileVisibility as unknown as ProfileVisibility,
      shareStats: updatedUser.shareStats,
      shareTrades: updatedUser.shareTrades,
      shareEmotions: updatedUser.shareEmotions,
      sharePatterns: updatedUser.sharePatterns,
    };
  }

  /**
   * Upload user avatar
   * Only the owner can upload their avatar
   */
  static async uploadAvatar(
    userId: string,
    file: Express.Multer.File
  ): Promise<UserProfile> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Generate avatar URL (relative path for now, can be updated to use CDN later)
    const avatarUrl = `/uploads/${file.filename}`;

    // Update user avatar
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: avatarUrl,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        tradingStyle: true,
        experienceLevel: true,
        profileVisibility: true,
        shareStats: true,
        shareTrades: true,
        shareEmotions: true,
        sharePatterns: true,
        totalTrades: true,
        winRate: true,
        totalPnL: true,
        currentStreak: true,
        longestWinStreak: true,
        bestTradeDate: true,
        badges: true,
        milestones: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Build privacy settings object
    const privacySettings: PrivacySettings = {
      profileVisibility: updatedUser.profileVisibility as unknown as ProfileVisibility,
      shareStats: updatedUser.shareStats,
      shareTrades: updatedUser.shareTrades,
      shareEmotions: updatedUser.shareEmotions,
      sharePatterns: updatedUser.sharePatterns,
    };

    // Build and return profile
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name || undefined,
      bio: updatedUser.bio || undefined,
      avatar: updatedUser.avatar || undefined,
      tradingStyle: updatedUser.tradingStyle as unknown as TradingStyle | undefined,
      experienceLevel: updatedUser.experienceLevel as unknown as ExperienceLevel | undefined,
      privacySettings,
      stats: {
        totalTrades: updatedUser.totalTrades,
        winRate: Number(updatedUser.winRate),
        totalPnL: Number(updatedUser.totalPnL),
        currentStreak: updatedUser.currentStreak,
        longestWinStreak: updatedUser.longestWinStreak,
        bestTradeDate: updatedUser.bestTradeDate || undefined,
      },
      badges: (updatedUser.badges as unknown as Badge[]) || [],
      milestones: (updatedUser.milestones as unknown as Milestones) || {},
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

}
