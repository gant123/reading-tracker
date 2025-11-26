import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AvatarService } from '@/services/avatarService';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const inventory = await AvatarService.getInventory(session.user.id);

    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}