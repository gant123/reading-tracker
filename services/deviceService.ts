// services/deviceService.ts
import { prisma } from '@/lib/prisma';
import { AchievementService } from './achievementService';

export class DeviceService {
  /**
   * Validate a device token and return the associated data
   */
  static async validateToken(token: string) {
    const deviceToken = await prisma.deviceToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            parentId: true,
          },
        },
      },
    });
    return deviceToken;
  }

  /**
   * Update the last used timestamp for a token
   */
  static async updateTokenLastUsed(token: string) {
    return prisma.deviceToken.update({
      where: { token },
      data: { lastUsedAt: new Date()},
    });
  }

  /**
   * Find an existing book or auto-create one for the child
   */
  static async findOrCreateBook(childId: string, rawTitle: string) {
    // Clean title: Remove file extensions and trim
    const cleanTitle = rawTitle
      .replace(/\.(epub|pdf|txt|kepub|mobi|azw3?)$/i, '')
      .trim();

    // Try to find existing book for THIS child (case-insensitive)
    let book = await prisma.book.findFirst({
      where: {
        userId: childId,
        title: {
          equals: cleanTitle,
          mode: 'insensitive',
        },
      },
    });

    // Auto-create if not found
    if (!book) {
      console.log(`[DeviceService] Auto-creating book "${cleanTitle}" for child ${childId}`);
      book = await prisma.book.create({
        data: {
          title: cleanTitle,
          author: 'Unknown Author', // Can be updated later
          userId: childId,
          status: 'APPROVED', // Auto-approve device-added books
          pageCount: 0,
          description: 'Added automatically from reMarkable',
        },
      });
    }

    return book;
  }

  /**
   * Start a new reading session (handles existing sessions)
   */
  static async startSession(childId: string, bookId: string) {
    // Check for existing active session
    const existingSession = await prisma.activeReadingSession.findUnique({
      where: { userId: childId },
    });

    // If switching books, close the previous session first
    if (existingSession && existingSession.bookId !== bookId) {
      console.log(`[DeviceService] Switching books - closing previous session`);
      await this.closeSession(childId, existingSession);
    }

    // If already reading the same book, just return (idempotent)
    if (existingSession && existingSession.bookId === bookId) {
      console.log(`[DeviceService] Already reading this book - no action needed`);
      return existingSession;
    }

    // Start new session
    return prisma.activeReadingSession.create({
      data: {
        userId: childId,
        bookId: bookId,
        startTime: new Date(),
      },
    });
  }

  /**
   * Stop the current reading session
   */
  static async stopSession(childId: string, bookId: string) {
    const activeSession = await prisma.activeReadingSession.findUnique({
      where: { userId: childId },
      include: { book: true },
    });

    if (!activeSession) {
      return { error: 'No active reading session found' };
    }

    // Optional: Validate it's the same book (or allow any close)
    // For reMarkable, we'll be lenient and close whatever is active
    if (activeSession.bookId !== bookId) {
      console.log(`[DeviceService] Warning: Closing session for different book than requested`);
    }

    const result = await this.closeSession(childId, activeSession);
    return { success: true, ...result };
  }

  /**
   * Internal: Close a session and award points
   */
  private static async closeSession(
    userId: string,
    activeSession: { id: string; bookId: string; startTime: Date }
  ) {
    const endTime = new Date();
    const startTime = new Date(activeSession.startTime);

    // Calculate duration
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.max(1, Math.round(durationMs / 1000 / 60));

    // Simple point calculation: 1 point per minute
    // Could enhance with streak bonuses later
    const pointsEarned = durationMinutes;

    // Transaction: Save session, delete active, update user stats
    await prisma.$transaction([
      // Create completed session record
      prisma.readingSession.create({
        data: {
          userId,
          bookId: activeSession.bookId,
          startTime,
          endTime,
          durationMinutes,
          pointsEarned,
          verified: true, // Device-tracked sessions are auto-verified
        },
      }),
      // Remove active session
      prisma.activeReadingSession.delete({
        where: { userId },
      }),
      // Update user stats
      prisma.user.update({
        where: { id: userId },
        data: {
          totalMinutes: { increment: durationMinutes },
          points: { increment: pointsEarned },
          lastReadDate: new Date(),
        },
      }),
    ]);

    // Check for achievements (async, don't block response)
    AchievementService.checkAndAwardAchievements(userId, durationMinutes).catch(
      (err) => console.error('[DeviceService] Achievement check failed:', err)
    );

    return { durationMinutes, pointsEarned };
  }

  /**
   * Get the current active session for a user
   */
  static async getActiveSession(userId: string) {
    return prisma.activeReadingSession.findUnique({
      where: { userId },
      include: {
        book: {
          select: { id: true, title: true, author: true },
        },
      },
    });
  }

  /**
   * Force-close any stale sessions (e.g., older than 24 hours)
   * Can be run as a cron job
   */
  static async cleanupStaleSessions() {
    const staleThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    const staleSessions = await prisma.activeReadingSession.findMany({
      where: {
        startTime: { lt: staleThreshold },
      },
    });

    console.log(`[DeviceService] Found ${staleSessions.length} stale sessions to clean up`);

    for (const session of staleSessions) {
      try {
        await this.closeSession(session.userId, session);
        console.log(`[DeviceService] Closed stale session for user ${session.userId}`);
      } catch (err) {
        console.error(`[DeviceService] Failed to close stale session:`, err);
      }
    }

    return { cleaned: staleSessions.length };
  }
}