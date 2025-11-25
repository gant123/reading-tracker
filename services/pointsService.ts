import { prisma } from '@/lib/prisma';
import { calculateStreakBonus, getStreakStatus } from '@/lib/utils';

export class PointsService {
  static async awardPoints(userId: string, durationMinutes: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreakDays = user.streakDays;
    
    if (user.lastReadDate) {
      const lastRead = new Date(user.lastReadDate);
      lastRead.setHours(0, 0, 0, 0);
      
      const diffTime = today.getTime() - lastRead.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreakDays += 1;
      } else if (diffDays > 1) {
        newStreakDays = 1;
      }
    } else {
      newStreakDays = 1;
    }

    // Calculate points with streak bonus
    const basePoints = durationMinutes;
    const streakMultiplier = calculateStreakBonus(newStreakDays);
    const pointsEarned = Math.floor(basePoints * streakMultiplier);

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: pointsEarned },
        totalMinutes: { increment: durationMinutes },
        streakDays: newStreakDays,
        lastReadDate: new Date(),
      },
    });

    return { pointsEarned, newStreakDays };
  }

  static async deductPoints(userId: string, amount: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.points < amount) {
      throw new Error('Insufficient points');
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        points: { decrement: amount },
      },
    });
  }

  static async checkAchievements(userId: string) {
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

    if (!user) return [];

    const earnedAchievementIds = user.achievements.map(ua => ua.achievementId);

    // Get all achievements
    const allAchievements = await prisma.achievement.findMany();

    const newAchievements = [];

    for (const achievement of allAchievements) {
      if (earnedAchievementIds.includes(achievement.id)) continue;

      let earned = false;

      if (achievement.type === 'MINUTES') {
        earned = user.totalMinutes >= achievement.requirement;
      } else if (achievement.type === 'STREAK') {
        earned = user.streakDays >= achievement.requirement;
      } else if (achievement.type === 'BOOKS') {
        earned = user.books.length >= achievement.requirement;
      }

      if (earned) {
        await prisma.userAchievement.create({
          data: {
            userId: user.id,
            achievementId: achievement.id,
          },
        });
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  static async getUserAchievements(userId: string) {
    return prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: 'desc' },
    });
  }
}