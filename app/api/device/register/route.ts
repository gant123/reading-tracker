import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// POST /api/device/register
// Parent registers a device token for their child
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Unauthorized - Parents only' }, { status: 401 });
    }

    const { childId, name } = await request.json();

    if (!childId || !name) {
      return NextResponse.json(
        { error: 'Missing childId or deviceName' },
        { status: 400 }
      );
    }

    // Verify this child belongs to this parent
    const child = await prisma.user.findFirst({
      where: {
        id: childId,
        parentId: session.user.id,
      },
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found or does not belong to you' },
        { status: 404 }
      );
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Create the device token
    const deviceToken = await prisma.deviceToken.create({
      data: {
        token,
        name,
        userId: childId,
      },
    });

    return NextResponse.json({
      success: true,
      token: deviceToken.token,
      deviceName: deviceToken.name,
      childName: child.name,
      message: 'Device registered successfully. Use this token in your reMarkable script.',
    });
  } catch (error) {
    console.error('Device registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register device' },
      { status: 500 }
    );
  }
}

// GET /api/device/register
// List all registered devices for parent's children
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all children
    const children = await prisma.user.findMany({
      where: { parentId: session.user.id },
      select: { id: true, name: true },
    });

    const childIds = children.map(c => c.id);

    // Get all device tokens for these children
    const devices = await prisma.deviceToken.findMany({
      where: {
        userId: { in: childIds },
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      devices: devices.map(d => ({
        id: d.id,
        deviceName: d.name,
        childId: d.user.id,
        childName: d.user.name,
        lastUsed: d.lastUsedAt,
        createdAt: d.createdAt,
        // Don't expose the full token, just a preview
        tokenPreview: `${d.token.slice(0, 8)}...${d.token.slice(-4)}`,
      })),
    });
  } catch (error) {
    console.error('Get devices error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}

// DELETE /api/device/register?id=xxx
// Revoke a device token
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('id');

    if (!deviceId) {
      return NextResponse.json({ error: 'Missing device id' }, { status: 400 });
    }

    // Verify this device belongs to one of the parent's children
    const device = await prisma.deviceToken.findUnique({
      where: { id: deviceId },
      include: { user: true },
    });

    if (!device || device.user.parentId !== session.user.id) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    await prisma.deviceToken.delete({
      where: { id: deviceId },
    });

    return NextResponse.json({ success: true, message: 'Device revoked' });
  } catch (error) {
    console.error('Delete device error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke device' },
      { status: 500 }
    );
  }
}