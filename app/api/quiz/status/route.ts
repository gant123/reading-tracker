import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/quiz/status?bookId=xxx
// Check quiz status for a specific book
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'CHILD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json(
        { error: 'Missing bookId parameter' },
        { status: 400 }
      );
    }

    // Get all attempts for this user and book
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId: session.user.id,
        bookId,
      },
      orderBy: { attemptedAt: 'desc' },
    });

    // Check if passed (quiz locked)
    const passedAttempt = attempts.find(a => a.passed);
    if (passedAttempt) {
      return NextResponse.json({
        status: 'PASSED',
        locked: true,
        canTakeQuiz: false,
        attempt: passedAttempt,
        message: 'Quiz completed! Great job!',
      });
    }

    // Check for cooldown
    const now = new Date();
    const cooldownAttempt = attempts.find(
      a => a.canRetryAt && new Date(a.canRetryAt) > now
    );

    if (cooldownAttempt) {
      const canRetryAt = new Date(cooldownAttempt.canRetryAt!);
      const timeRemaining = canRetryAt.getTime() - now.getTime();
      
      return NextResponse.json({
        status: 'COOLDOWN',
        locked: false,
        canTakeQuiz: false,
        canRetryAt: cooldownAttempt.canRetryAt,
        timeRemaining, // milliseconds
        lastAttempt: cooldownAttempt,
        message: 'Quiz on cooldown. Try again later!',
      });
    }

    // Quiz available
    const lastAttempt = attempts[0] || null;
    return NextResponse.json({
      status: 'AVAILABLE',
      locked: false,
      canTakeQuiz: true,
      attemptCount: attempts.length,
      lastAttempt,
      message: attempts.length > 0 
        ? 'Ready to try again!'
        : 'Take the quiz to earn 50 points!',
    });
  } catch (error) {
    console.error('Quiz status error:', error);
    return NextResponse.json(
      { error: 'Failed to check quiz status' },
      { status: 500 }
    );
  }
}