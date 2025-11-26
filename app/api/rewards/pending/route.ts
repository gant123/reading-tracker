import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { RewardService } from '@/services/rewardService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pending = await RewardService.getPendingCompletions(session.user.id);

    return NextResponse.json(pending);
  } catch (error) {
    console.error('Get pending rewards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending rewards' },
      { status: 500 }
    );
  }
}