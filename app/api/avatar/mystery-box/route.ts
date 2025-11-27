import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AvatarService } from '@/services/avatarService';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Calling the updated service method
    const result = await AvatarService.openMysteryBox(session.user.id, 100); 
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}