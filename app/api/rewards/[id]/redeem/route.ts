import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { RewardService } from '@/services/rewardService';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'CHILD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await props.params;
    const userReward = await RewardService.redeemReward(
      session.user.id,
      id
    );

    return NextResponse.json(userReward);
  } catch (error: any) {
    console.error('Redeem reward error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to redeem reward' },
      { status: 500 }
    );
  }
}