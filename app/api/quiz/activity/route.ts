import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/quiz/activity?childIds=id1,id2&limit=10
// Get quiz attempts for specified children (for parent dashboard)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const childIdsParam = searchParams.get('childIds');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!childIdsParam) {
      return NextResponse.json(
        { error: 'Missing childIds parameter' },
        { status: 400 }
      );
    }

    const childIds = childIdsParam.split(',');

    // Verify these children belong to this parent
    const validChildren = await prisma.user.findMany({
      where: {
        id: { in: childIds },
        parentId: session.user.id,
      },
      select: { id: true },
    });

    const validChildIds = validChildren.map(c => c.id);

    if (validChildIds.length === 0) {
      return NextResponse.json({ attempts: [] });
    }

    // Get quiz attempts
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId: { in: validChildIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarSeed: true,
            avatarStyle: true,
            avatarColor: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { attemptedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ attempts });
  } catch (error) {
    console.error('Quiz activity error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz activity' },
      { status: 500 }
    );
  }
}