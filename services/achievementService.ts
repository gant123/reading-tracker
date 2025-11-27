import { prisma } from '@/lib/prisma';

export class AchievementService {
  /**
   * Get all available achievements
   */
  static async getAllAchievements() {
    return prisma.achievement.findMany({
      orderBy: { requirement: 'asc' },
    });
  }

  /**
   * Get user's earned achievements
   */
  static async getUserAchievements(userId: string) {
    return prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: 'desc' },
    });
  }

  /**
   * Check and award new achievements for a user.
   * Added 'currentSessionDuration' to check for "Marathon" style achievements.
   */
  static async checkAndAwardAchievements(userId: string, currentSessionDuration: number = 0) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: {
          include: { achievement: true },
        },
        books: {
          where: { status: 'APPROVED' },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get IDs of already earned achievements
    const earnedAchievementIds = user.achievements.map(ua => ua.achievementId);

    // Get all achievements
    const allAchievements = await prisma.achievement.findMany();

    const newlyEarnedAchievements = [];

    // Check each achievement
    for (const achievement of allAchievements) {
      // Skip if already earned
      if (earnedAchievementIds.includes(achievement.id)) {
        continue;
      }

      let earned = false;

      // Check based on achievement type (Supports both old and new seed types)
      switch (achievement.type) {
        case 'MINUTES':
        case 'TOTAL_MINUTES':
          earned = user.totalMinutes >= achievement.requirement;
          break;
        
        case 'STREAK':
          earned = user.streakDays >= achievement.requirement;
          break;
        
        case 'BOOKS':
        case 'BOOKS_READ':
          earned = user.books.length >= achievement.requirement;
          break;

        case 'SESSION_DURATION':
          // Only checks if the session that just finished meets the requirement
          if (currentSessionDuration > 0) {
            earned = currentSessionDuration >= achievement.requirement;
          }
          break;
        
        default:
          console.warn(`Unknown achievement type: ${achievement.type}`);
      }

      // Award achievement if earned
      if (earned) {
        await prisma.userAchievement.create({
          data: {
            userId: user.id,
            achievementId: achievement.id,
          },
        });
        newlyEarnedAchievements.push(achievement);
      }
    }

    return newlyEarnedAchievements;
  }

  /**
   * Get achievement progress for a user
   */
  static async getUserProgress(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: {
          include: { achievement: true },
        },
        books: {
          where: { status: 'APPROVED' },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // To calculate progress for "Session Duration" badges, we need the user's best session
    const bestSession = await prisma.readingSession.aggregate({
      where: { userId },
      _max: { durationMinutes: true }
    });
    const maxSessionDuration = bestSession._max.durationMinutes || 0;

    const allAchievements = await prisma.achievement.findMany();

    return allAchievements.map(achievement => {
      const isEarned = user.achievements.some(
        ua => ua.achievementId === achievement.id
      );

      let progress = 0;
      let current = 0;
      let target = achievement.requirement;

      switch (achievement.type) {
        case 'MINUTES':
        case 'TOTAL_MINUTES':
          current = user.totalMinutes;
          progress = Math.min((current / target) * 100, 100);
          break;
        
        case 'STREAK':
          current = user.streakDays;
          progress = Math.min((current / target) * 100, 100);
          break;
        
        case 'BOOKS':
        case 'BOOKS_READ':
          current = user.books.length;
          progress = Math.min((current / target) * 100, 100);
          break;

        case 'SESSION_DURATION':
          current = maxSessionDuration;
          progress = Math.min((current / target) * 100, 100);
          break;
      }

      return {
        ...achievement,
        isEarned,
        progress: Math.round(progress),
        current,
        target,
        earnedAt: isEarned 
          ? user.achievements.find(ua => ua.achievementId === achievement.id)?.earnedAt 
          : null,
      };
    });
  }

  /**
   * Create a new achievement (admin function)
   */
  static async createAchievement(data: {
    name: string;
    description: string;
    icon: string;
    requirement: number;
    type: string; // Changed from literal to string to support all types
  }) {
    return prisma.achievement.create({
      data,
    });
  }

  /**
   * Get achievement statistics
   */
  static async getAchievementStats(achievementId: string) {
    const totalUsers = await prisma.user.count({
      where: { role: 'CHILD' },
    });

    const usersEarned = await prisma.userAchievement.count({
      where: { achievementId },
    });

    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    return {
      achievement,
      totalUsers,
      usersEarned,
      percentageEarned: totalUsers > 0 ? (usersEarned / totalUsers) * 100 : 0,
    };
  }

  /**
   * Get recent achievement unlocks (for feed/notifications)
   */
  static async getRecentUnlocks(userId: string, limit: number = 5) {
    return prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Check if user has specific achievement
   */
  static async hasAchievement(userId: string, achievementId: string) {
    const userAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    });

    return !!userAchievement;
  }
}