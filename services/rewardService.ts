import { prisma } from '@/lib/prisma';
import { RewardInput } from '@/types';
import { PointsService } from './pointsService';

export class RewardService {
  static async createReward(parentId: string, data: RewardInput) {
    return prisma.reward.create({
      data: {
        ...data,
        parentId,
      },
    });
  }

  static async getRewards(parentId: string) {
    return prisma.reward.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getAvailableRewards(childId: string) {
    const user = await prisma.user.findUnique({
      where: { id: childId },
    });

    if (!user || !user.parentId) {
      throw new Error('User not found or has no parent');
    }

    const rewards = await prisma.reward.findMany({
      where: { parentId: user.parentId },
      orderBy: { pointsCost: 'asc' },
    });

    return rewards.map(reward => ({
      ...reward,
      canAfford: user.points >= reward.pointsCost,
    }));
  }

  static async redeemReward(childId: string, rewardId: string) {
    const user = await prisma.user.findUnique({
      where: { id: childId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward) {
      throw new Error('Reward not found');
    }

    if (reward.parentId !== user.parentId) {
      throw new Error('Reward does not belong to your family');
    }

    if (user.points < reward.pointsCost) {
      throw new Error('Insufficient points');
    }

    // Deduct points
    await PointsService.deductPoints(childId, reward.pointsCost);

    // Create user reward
    return prisma.userReward.create({
      data: {
        userId: childId,
        rewardId,
        status: 'REDEEMED',
        redeemedAt: new Date(),
      },
      include: {
        reward: true,
      },
    });
  }

  static async getRedeemedRewards(childId: string) {
    return prisma.userReward.findMany({
      where: { userId: childId },
      include: {
        reward: true,
      },
      orderBy: { redeemedAt: 'desc' },
    });
  }

  static async getPendingCompletions(parentId: string) {
    const children = await prisma.user.findMany({
      where: { parentId },
      select: { id: true },
    });

    const childIds = children.map(child => child.id);

    return prisma.userReward.findMany({
      where: {
        userId: { in: childIds },
        status: 'REDEEMED',
      },
      include: {
        reward: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { redeemedAt: 'desc' },
    });
  }

  static async completeReward(userRewardId: string) {
    return prisma.userReward.update({
      where: { id: userRewardId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  static async updateReward(rewardId: string, data: Partial<RewardInput>) {
    return prisma.reward.update({
      where: { id: rewardId },
      data,
    });
  }

  static async deleteReward(rewardId: string) {
    return prisma.reward.delete({
      where: { id: rewardId },
    });
  }
}