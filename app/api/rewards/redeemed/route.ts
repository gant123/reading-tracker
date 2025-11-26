import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { RewardService } from '@/services/rewardService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rewards = await RewardService.getRedeemedRewards(session.user.id);

    return NextResponse.json(rewards);
  } catch (error) {
    console.error('Get redeemed rewards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redeemed rewards' },
      { status: 500 }
    );
  }
}