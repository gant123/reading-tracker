import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AvatarService } from '@/services/avatarService';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const avatar = await AvatarService.getUserAvatar(session.user.id);
    const styles = await AvatarService.getAvailableStyles(session.user.id);
    const backgrounds = await AvatarService.getAvailableBackgrounds(session.user.id);

    return NextResponse.json({
      avatar,
      styles,
      backgrounds,
    });
  } catch (error) {
    console.error('Get avatar error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch avatar data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { style, seed, backgroundColor } = body;

    const updatedUser = await AvatarService.updateAvatar(session.user.id, {
      style,
      seed,
      backgroundColor,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Update avatar error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update avatar' },
      { status: 500 }
    );
  }
}