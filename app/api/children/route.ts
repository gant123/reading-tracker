import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
     const session = await auth();
    // Fetch all children from the database
   const children = await prisma.user.findMany({
    where: { parentId: session?.user.id },
    include: {
      books: {
        where: { status: 'APPROVED' },
      },
      sessions: {
        orderBy: { startTime: 'desc' },
        take: 5,
        include: { book: true },
      },
      achievements: {
        include: { achievement: true },
      },
    },
  });


    return NextResponse.json(children);
  } catch (error) {
    console.error("Error fetching children:", error);
    return NextResponse.json(
      { error: 'Failed to retrieve children' },
      { status: 500 }
    );
  }
}