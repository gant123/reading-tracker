import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For children: get their own redeemed rewards
    // For parents: get all children's redeemed rewards
    let userIds: string[] = [session.user.id];

    if (session.user.role === 'PARENT') {
      const children = await prisma.user.findMany({
        where: { parentId: session.user.id },
        select: { id: true },
      });
      userIds = children.map(child => child.id);
    }

    const rewards = await prisma.userReward.findMany({
      where: { 
        userId: { in: userIds },
        status: { in: ['REDEEMED', 'COMPLETED'] },
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
      orderBy: [
        { status: 'asc' }, // REDEEMED comes before COMPLETED alphabetically
        { redeemedAt: 'desc' },
      ],
    });

    return NextResponse.json(rewards);
  } catch (error) {
    console.error('Get redeemed rewards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redeemed rewards' },
      { status: 500 }
    );
  }
}