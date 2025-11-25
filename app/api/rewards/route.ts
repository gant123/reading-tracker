import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { RewardService } from '@/services/rewardService';
import { rewardSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let rewards;

    if (session.user.role === 'PARENT') {
      rewards = await RewardService.getRewards(session.user.id);
    } else {
      rewards = await RewardService.getAvailableRewards(session.user.id);
    }

    return NextResponse.json(rewards);
  } catch (error) {
    console.error('Get rewards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = rewardSchema.parse(body);

    const reward = await RewardService.createReward(
      session.user.id,
      validatedData
    );

    return NextResponse.json(reward, { status: 201 });
  } catch (error: any) {
    console.error('Create reward error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create reward' },
      { status: 500 }
    );
  }
}