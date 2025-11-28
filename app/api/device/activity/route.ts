// app/api/device/activity/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DeviceService } from '@/services/deviceService';

const activitySchema = z.object({
  title: z.string().min(1, 'Book title is required'),
  status: z.enum(['OPEN', 'CLOSED']),
  childId: z.string().cuid().optional(), // Optional - can be derived from token
});

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate via Bearer Token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header. Use: Bearer <token>' },
        { status: 401 }
      );
    }
    const token = authHeader.split(' ')[1];

    // 2. Validate the device token
    const deviceToken = await DeviceService.validateToken(token);
    if (!deviceToken) {
      return NextResponse.json(
        { error: 'Invalid or expired device token' },
        { status: 401 }
      );
    }

    // Update last used timestamp
    await DeviceService.updateTokenLastUsed(token);

    // 3. Parse and validate the request body
    const body = await request.json();
    const validation = activitySchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { title, status } = validation.data;
    // Use childId from token (more secure than accepting it in body)
    const childId = deviceToken.userId;

    // 4. Process the activity
    const book = await DeviceService.findOrCreateBook(childId, title);

    if (status === 'OPEN') {
      await DeviceService.startSession(childId, book.id);
      
      return NextResponse.json({
        success: true,
        action: 'TIMER_STARTED',
        book: {
          id: book.id,
          title: book.title,
        },
        message: `Started reading timer for "${book.title}"`,
      });
    }

    if (status === 'CLOSED') {
      const result = await DeviceService.stopSession(childId, book.id);

      if ('error' in result) {
        return NextResponse.json({
          success: false,
          action: 'NO_SESSION',
          message: result.error,
        });
      }

      return NextResponse.json({
        success: true,
        action: 'TIMER_STOPPED',
        book: {
          id: book.id,
          title: book.title,
        },
        session: {
          durationMinutes: result.durationMinutes,
          pointsEarned: result.pointsEarned,
        },
        message: `Finished reading! Earned ${result.pointsEarned} points for ${result.durationMinutes} minutes.`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Device activity error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check current reading status
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const deviceToken = await DeviceService.validateToken(token);
    if (!deviceToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const activeSession = await DeviceService.getActiveSession(deviceToken.userId);

    if (activeSession) {
      const elapsedMinutes = Math.floor(
        (Date.now() - activeSession.startTime.getTime()) / (1000 * 60)
      );

      return NextResponse.json({
        reading: true,
        session: {
          bookId: activeSession.bookId,
          bookTitle: activeSession.book?.title,
          startTime: activeSession.startTime,
          elapsedMinutes,
        },
      });
    }

    return NextResponse.json({
      reading: false,
      session: null,
    });
  } catch (error) {
    console.error('Get status error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}