// app/api/device/activity/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DeviceService } from '@/services/deviceService';

const activitySchema = z.object({
  title: z.string().min(1),
  status: z.enum(['OPEN', 'CLOSED']),
  childId: z.string().cuid(), 
});

export async function POST(request: NextRequest) {
  try {
    // 1. Auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const deviceToken = await DeviceService.validateToken(token);
    if (!deviceToken) {
      return NextResponse.json({ error: 'Unauthorized device' }, { status: 401 });
    }

    // 2. Validation
    const body = await request.json();
    const validation = activitySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const { title, status, childId } = validation.data;

    // 3. Logic (Delegated to SDK)
    const book = await DeviceService.findOrCreateBook(childId, title);

    if (status === 'OPEN') {
      await DeviceService.startSession(childId, book.id);
      return NextResponse.json({ status: 'Timer started', book: book.title });
    }

    if (status === 'CLOSED') {
      const result:any = await DeviceService.stopSession(childId, book.id);
      
      if (result.error) {
        return NextResponse.json({ message: result.error });
      }

      return NextResponse.json({ 
        status: 'Timer stopped', 
        duration: result.durationMinutes,
        points: result.pointsEarned
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Device activity error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}