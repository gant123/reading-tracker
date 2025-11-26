import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AvatarService } from '@/services/avatarService';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'CHILD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, itemId } = body;

    let result;

    if (type === 'style') {
      result = await AvatarService.purchaseStyle(session.user.id, itemId);
    } else if (type === 'background') {
      result = await AvatarService.purchaseBackground(session.user.id, itemId);
    } else {
      return NextResponse.json({ error: 'Invalid item type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Purchase avatar item error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to purchase item' },
      { status: 500 }
    );
  }
}