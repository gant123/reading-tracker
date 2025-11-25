import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { SessionService } from '@/services/sessionService';
import { sessionSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    const sessions = await SessionService.getUserSessions(
      session.user.id,
      limit ? parseInt(limit) : undefined
    );

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = sessionSchema.parse(body);

    const readingSession = await SessionService.createSession(
      session.user.id,
      validatedData
    );

    return NextResponse.json(readingSession, { status: 201 });
  } catch (error: any) {
    console.error('Create session error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create session' },
      { status: 500 }
    );
  }
}