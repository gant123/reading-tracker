// services/deviceService.ts
import { prisma } from '@/lib/prisma';
import { AchievementService } from './achievementService';
export class DeviceService {
  /**
   * 1. Authenticate the Device
   */
  static async validateToken(token: string) {
    const deviceToken = await prisma.deviceToken.findUnique({
      where: { token },
      include: { user: true },
    });
    return deviceToken;
  }

  /**
   * 2. Find or Create the Book (Auto-Add Logic)
   */
  static async findOrCreateBook(childId: string, rawTitle: string) {
    // Clean title: "Harry Potter.epub" -> "Harry Potter"
    const cleanTitle = rawTitle.replace(/\.(epub|pdf|txt|kepub)$/i, '').trim();

    // Try to find existing book for THIS child
    let book = await prisma.book.findFirst({
      where: {
        userId: childId,
        title: {
          contains: cleanTitle,
          mode: 'insensitive',
        },
      },
    });

    // Auto-create if missing
    if (!book) {
      console.log(`[SDK] Book "${cleanTitle}" missing for child ${childId}. Auto-creating...`);
      book = await prisma.book.create({
        data: {
          title: cleanTitle,
          author: "Unknown Author",
          userId: childId,
          status: "APPROVED",
          pageCount: 0,
        },
      });
    }

    return book;
  }

  /**
   * 3. Handle "OPEN" (Start Timer)
   */
  static async startSession(childId: string, bookId: string) {
    // Check for any existing session first
    const existingSession = await prisma.activeReadingSession.findUnique({
      where: { userId: childId },
    });

    // If they switched books instantly, close the old one
    if (existingSession) {
      await this.closeSession(childId, existingSession);
    }

    // Start the new timer
    return prisma.activeReadingSession.create({
      data: {
        userId: childId,
        bookId: bookId,
        startTime: new Date(),
      },
    });
  }

 

  static async stopSession(childId: string, bookId: string) {
    const activeSession = await prisma.activeReadingSession.findUnique({
      where: { userId: childId },
    });

    if (!activeSession) return { error: 'No active session' };
    
    // Optional: match bookId check
    if (activeSession.bookId !== bookId) return { error: 'Mismatching book' };

    const result = await this.closeSession(childId, activeSession);
    return { success: true, ...result };
  }

  private static async closeSession(userId: string, activeSession: any) {
    const endTime = new Date();
    const startTime = new Date(activeSession.startTime);
    
    // Logic: 1 minute = 1 point
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.max(1, Math.round(durationMs / 1000 / 60));
    const pointsEarned = durationMinutes; 

    // 1. Save the session & update user stats
    await prisma.$transaction([
      prisma.readingSession.create({
        data: {
          userId,
          bookId: activeSession.bookId,
          startTime,
          endTime,
          durationMinutes,
          pointsEarned,
          verified: true, 
        },
      }),
      prisma.activeReadingSession.delete({
        where: { userId },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          totalMinutes: { increment: durationMinutes },
          points: { increment: pointsEarned },
        },
      }),
    ]);

    // 2. CHECK FOR ACHIEVEMENTS (New Step)
    // We pass the session duration so it can check for "Marathon" badges too
    await AchievementService.checkAndAwardAchievements(userId, durationMinutes);

    return { durationMinutes, pointsEarned };
  }
}