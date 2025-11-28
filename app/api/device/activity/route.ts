import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for the incoming JSON from reMarkable
const activitySchema = z.object({
  title: z.string().min(1),
  status: z.enum(['OPEN', 'CLOSED']),
  childId: z.string().cuid(), 
});

export async function POST(request: NextRequest) {
  try {
    // ---------------------------------------------------------
    // 1. Device Authentication
    // ---------------------------------------------------------
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Find the device token owner
    const deviceToken = await prisma.deviceToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!deviceToken) {
      return NextResponse.json({ error: 'Unauthorized device' }, { status: 401 });
    }

    // ---------------------------------------------------------
    // 2. Input Validation
    // ---------------------------------------------------------
    const body = await request.json();
    const validation = activitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid payload', details: validation.error }, { status: 400 });
    }

    const { title, status, childId } = validation.data;

    // Use the childId from the payload as the target User
    // (Optional: You could add a check here to ensure deviceToken.userId is the parent of childId)
    const targetUserId = childId; 

    // ---------------------------------------------------------
    // 3. Match OR Create Book
    // ---------------------------------------------------------
    // Clean up the filename (e.g., remove ".epub", ".pdf")
    const cleanTitle = title.replace(/\.(epub|pdf)$/i, '').trim();

    // Try to find the book in the child's library
    let book = await prisma.book.findFirst({
      where: {
        userId: targetUserId,
        title: {
          contains: cleanTitle,
          mode: 'insensitive',
        },
      },
    });

    // FIX: Auto-create the book if it doesn't exist so tracking never fails
    if (!book) {
      console.log(`Book "${cleanTitle}" missing for child ${targetUserId}. Auto-creating...`);
      book = await prisma.book.create({
        data: {
          title: cleanTitle,
          author: "Unknown Author", // We don't have author data from the device
          userId: targetUserId,
          status: "APPROVED", // Auto-approve since they are already reading it
          pageCount: 0, 
        },
      });
    }

    // ---------------------------------------------------------
    // 4. Handle Activity Logic
    // ---------------------------------------------------------

    // CASE A: User OPENED a book -> Start Timer
    if (status === 'OPEN') {
      // Check if there is already an active session for this child
      const existingSession = await prisma.activeReadingSession.findUnique({
        where: { userId: targetUserId },
      });

      // If they switched books instantly, close the old one first
      if (existingSession) {
        await closeSession(targetUserId, existingSession);
      }

      // Create new active session
      await prisma.activeReadingSession.create({
        data: {
          userId: targetUserId,
          bookId: book.id,
          startTime: new Date(),
        },
      });

      return NextResponse.json({ status: 'Timer started', book: book.title });
    }

    // CASE B: User CLOSED a book -> Stop Timer & Save
    if (status === 'CLOSED') {
      const activeSession = await prisma.activeReadingSession.findUnique({
        where: { userId: targetUserId },
        include: { book: true },
      });

      if (!activeSession) {
        return NextResponse.json({ message: 'No active session to close' });
      }

      // Only close if it matches the book reporting the close
      if (activeSession.bookId !== book.id) {
        return NextResponse.json({ message: 'Mismatching book close event' });
      }

      // Finalize the session
      const savedSession = await closeSession(targetUserId, activeSession);

      return NextResponse.json({ 
        status: 'Timer stopped', 
        duration: savedSession.durationMinutes,
        points: savedSession.pointsEarned
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Device activity error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ---------------------------------------------------------
// Helper: Close Session Logic
// ---------------------------------------------------------
async function closeSession(userId: string, activeSession: any) {
  const endTime = new Date();
  const startTime = new Date(activeSession.startTime);
  
  // Calculate duration in minutes
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationMinutes = Math.max(1, Math.round(durationMs / 1000 / 60));

  // Calculate Points (Example: 1 minute = 1 point)
  const pointsEarned = durationMinutes; 

  const [readingSession] = await prisma.$transaction([
    // Create the permanent history log
    prisma.readingSession.create({
      data: {
        userId,
        bookId: activeSession.bookId,
        startTime: startTime,
        endTime: endTime,
        durationMinutes: durationMinutes,
        pointsEarned: pointsEarned,
        verified: true, 
      },
    }),
    // Remove the temporary "timer"
    prisma.activeReadingSession.delete({
      where: { userId },
    }),
    // Update User aggregates
    prisma.user.update({
      where: { id: userId },
      data: {
        totalMinutes: { increment: durationMinutes },
        points: { increment: pointsEarned },
      },
    }),
  ]);

  return readingSession;
}