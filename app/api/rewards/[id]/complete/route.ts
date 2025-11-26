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

    if (!session?.user || session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await props.params; // This captures the UserReward ID
    const result = await RewardService.completeReward(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Complete reward error:', error);
    return NextResponse.json(
      { error: 'Failed to complete reward' },
      { status: 500 }
    );
  }
}