import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all children of this parent
    const children = await prisma.user.findMany({
      where: { parentId: session.user.id },
      select: { id: true },
    });

    const childIds = children.map(child => child.id);

    // Get pending redemptions with user info
    const pending = await prisma.userReward.findMany({
      where: {
        userId: { in: childIds },
        status: 'REDEEMED',
      },
      include: {
        reward: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { redeemedAt: 'desc' },
    });

    return NextResponse.json(pending);
  } catch (error) {
    console.error('Get pending rewards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending rewards' },
      { status: 500 }
    );
  }
}