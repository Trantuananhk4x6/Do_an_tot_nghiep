import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../../../db';
import { Connection } from '../../../../../../db/schema';
import { eq, and } from 'drizzle-orm';

// POST: Tạo match/connection
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetUserEmail, type } = body; // type: 'like', 'call', 'message'

    if (!targetUserEmail || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if connection already exists
    const existingConnection = await db.query.Connection.findFirst({
      where: and(
        eq(Connection.fromUserEmail, userId),
        eq(Connection.toUserEmail, targetUserEmail)
      ),
    });

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Connection already exists' },
        { status: 409 }
      );
    }

    // Create new connection
    const [newConnection] = await db
      .insert(Connection)
      .values({
        fromUserEmail: userId,
        toUserEmail: targetUserEmail,
        status: (type === 'like' ? 'pending' : 'accepted'),
        message: type === 'call' ? 'Wants to call you' : type === 'message' ? 'Wants to message you' : 'Sent you a connection request',
      } as any)
      .returning();

    // Check for mutual match
    const mutualConnection = await db.query.Connection.findFirst({
      where: and(
        eq(Connection.fromUserEmail, targetUserEmail),
        eq(Connection.toUserEmail, userId)
      ),
    });

    let isMatch = false;
    if (mutualConnection) {
      // Update both connections to accepted
      await db
        .update(Connection)
        .set({ status: 'accepted' } as any)
        .where(
          and(
            eq(Connection.fromUserEmail, userId),
            eq(Connection.toUserEmail, targetUserEmail)
          )
        );

      await db
        .update(Connection)
        .set({ status: 'accepted' } as any)
        .where(
          and(
            eq(Connection.fromUserEmail, targetUserEmail),
            eq(Connection.toUserEmail, userId)
          )
        );

      isMatch = true;
    }

    return NextResponse.json({
      success: true,
      connection: newConnection,
      isMatch,
      message: isMatch ? "It's a match! 🎉" : 'Connection request sent',
    });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Lấy danh sách connections
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status'); // pending, accepted, rejected

    let connections;
    if (status) {
      connections = await db.query.Connection.findMany({
        where: and(
          eq(Connection.fromUserEmail, userId),
          eq(Connection.status, status)
        ),
      });
    } else {
      connections = await db.query.Connection.findMany({
        where: eq(Connection.fromUserEmail, userId),
      });
    }

    return NextResponse.json({
      success: true,
      connections,
    });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
