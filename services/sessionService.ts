import { prisma } from '@/lib/prisma';
import { SessionInput } from '@/types';
import { PointsService } from './pointsService';

export class SessionService {
  static async createSession(userId: string, data: SessionInput) {
    // Validate book ownership and approval
    const book = await prisma.book.findFirst({
      where: {
        id: data.bookId,
        userId,
      },
    });

    if (!book) {
      throw new Error('Book not found or does not belong to user');
    }

    if (book.status !== 'APPROVED') {
      throw new Error('Book must be approved before reading');
    }

    // Validate times
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const now = new Date();

    if (startTime >= endTime) {
      throw new Error('Start time must be before end time');
    }

    if (endTime > now) {
      throw new Error('End time cannot be in the future');
    }

    // Calculate duration
    const calculatedMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    
    if (Math.abs(calculatedMinutes - data.durationMinutes) > 1) {
      throw new Error('Duration does not match calculated time');
    }

    if (data.durationMinutes > 1440) {
      throw new Error('Session cannot be longer than 24 hours');
    }

    // Award points
    const { pointsEarned } = await PointsService.awardPoints(userId, data.durationMinutes);

    // Create session
    const session = await prisma.readingSession.create({
      data: {
        userId,
        bookId: data.bookId,
        startTime,
        endTime,
        durationMinutes: data.durationMinutes,
        notes: data.notes,
        pointsEarned,
      },
      include: {
        book: true,
      },
    });

    // Check for new achievements
    await PointsService.checkAchievements(userId);

    return session;
  }

  static async getUserSessions(userId: string, limit?: number) {
    return prisma.readingSession.findMany({
      where: { userId },
      include: {
        book: true,
      },
      orderBy: { startTime: 'desc' },
      ...(limit && { take: limit }),
    });
  }

  static async getChildSessions(parentId: string, childId: string) {
    // Verify parent-child relationship
    const child = await prisma.user.findFirst({
      where: {
        id: childId,
        parentId,
      },
    });

    if (!child) {
      throw new Error('Child not found or does not belong to parent');
    }

    return this.getUserSessions(childId);
  }

  static async verifySession(sessionId: string) {
    return prisma.readingSession.update({
      where: { id: sessionId },
      data: { verified: true },
    });
  }

  static async getReadingStats(userId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sessions = await prisma.readingSession.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
        },
      },
      orderBy: { startTime: 'asc' },
    });

    // Group by date
    const statsByDate = new Map<string, number>();

    sessions.forEach(session => {
      const date = session.startTime.toISOString().split('T')[0];
      const current = statsByDate.get(date) || 0;
      statsByDate.set(date, current + session.durationMinutes);
    });

    return Array.from(statsByDate.entries()).map(([date, minutes]) => ({
      date,
      minutes,
    }));
  }

  static async deleteSession(sessionId: string) {
    const session = await prisma.readingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Refund points and minutes
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        points: { decrement: session.pointsEarned },
        totalMinutes: { decrement: session.durationMinutes },
      },
    });

    return prisma.readingSession.delete({
      where: { id: sessionId },
    });
  }
}