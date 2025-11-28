import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/children
// Get all children for the current parent
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const children = await prisma.user.findMany({
      where: { parentId: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarStyle: true,
        avatarSeed: true,
        avatarColor: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(children);
  } catch (error) {
    console.error('Get children error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch children' },
      { status: 500 }
    );
  }
}