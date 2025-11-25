import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PointsService } from '@/services/pointsService';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const achievements = await PointsService.getUserAchievements(session.user.id);

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}