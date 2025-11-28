import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/quiz/submit
// Submit quiz results, award points if passed, set retry timer if failed
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'CHILD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookId, score, totalQuestions = 3 } = await request.json();

    if (!bookId || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: bookId, score' },
        { status: 400 }
      );
    }

    // Validate score
    if (score < 0 || score > totalQuestions) {
      return NextResponse.json(
        { error: 'Invalid score' },
        { status: 400 }
      );
    }

    // Check if quiz is already passed for this book (locked)
    const existingPass = await prisma.quizAttempt.findFirst({
      where: {
        userId: session.user.id,
        bookId,
        passed: true,
      },
    });

    if (existingPass) {
      return NextResponse.json(
        { error: 'Quiz already completed for this book', alreadyPassed: true },
        { status: 400 }
      );
    }

    // Check if there's a cooldown in effect
    const recentFailedAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId: session.user.id,
        bookId,
        passed: false,
        canRetryAt: {
          gt: new Date(),
        },
      },
      orderBy: { attemptedAt: 'desc' },
    });

    if (recentFailedAttempt) {
      return NextResponse.json(
        { 
          error: 'Quiz is on cooldown',
          canRetryAt: recentFailedAttempt.canRetryAt,
          onCooldown: true,
        },
        { status: 400 }
      );
    }

    // Determine if passed (perfect score only)
    const passed = score === totalQuestions;
    const pointsEarned = passed ? 50 : 0;
    
    // Set retry time: 12 hours from now if failed, null if passed
    const canRetryAt = passed ? null : new Date(Date.now() + 12 * 60 * 60 * 1000);

    // Get book info for notification
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { title: true, userId: true },
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Get user info for notification
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, parentId: true },
    });

    // Create quiz attempt and update points in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create quiz attempt
      const attempt = await tx.quizAttempt.create({
        data: {
          userId: session.user.id,
          bookId,
          score,
          totalQuestions,
          passed,
          pointsEarned,
          canRetryAt,
        },
      });

      // Award points if passed
      if (passed) {
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            points: { increment: pointsEarned },
          },
        });
      }

      // Create notification for parent
      if (user?.parentId) {
        await tx.notification.create({
          data: {
            userId: user.parentId,
            type: passed ? 'QUIZ_PASSED' : 'QUIZ_FAILED',
            title: passed ? '🏆 Quiz Passed!' : '📚 Quiz Attempted',
            message: passed
              ? `${user.name} got a perfect score on the "${book.title}" quiz and earned ${pointsEarned} points!`
              : `${user.name} scored ${score}/${totalQuestions} on the "${book.title}" quiz. They can try again in 12 hours.`,
            data: {
              childId: session.user.id,
              childName: user.name,
              bookId,
              bookTitle: book.title,
              score,
              totalQuestions,
              passed,
              pointsEarned,
            },
          },
        });
      }

      return attempt;
    });

    return NextResponse.json({
      success: true,
      attempt: result,
      passed,
      pointsEarned,
      canRetryAt,
      message: passed
        ? `Congratulations! You earned ${pointsEarned} points!`
        : `You scored ${score}/${totalQuestions}. Try again in 12 hours!`,
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}