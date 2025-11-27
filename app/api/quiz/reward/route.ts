import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Add 50 points for passing the quiz
  await prisma.user.update({
    where: { id: session.user.id },
    data: { points: { increment: 50 } }
  });

  return NextResponse.json({ success: true, pointsAdded: 50 });
}