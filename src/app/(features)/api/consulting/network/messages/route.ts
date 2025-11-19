import { db } from '../../../../../../../db';
import { Message } from '../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq, or, and, desc } from 'drizzle-orm';

// Get messages with a specific user
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ message: 'Email not found' }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const otherUserEmail = searchParams.get('otherUserEmail');

    if (!otherUserEmail) {
      return NextResponse.json({ message: 'otherUserEmail is required' }, { status: 400 });
    }

    // Get all messages between the two users
    const messages = await db.query.Message.findMany({
      where: or(
        and(
          eq(Message.fromUserEmail, userEmail),
          eq(Message.toUserEmail, otherUserEmail)
        ),
        and(
          eq(Message.fromUserEmail, otherUserEmail),
          eq(Message.toUserEmail, userEmail)
        )
      ),
      orderBy: [Message.createdAt],
    });

    // Mark messages as read
    await db
      .update(Message)
      .set({ isRead: true, updatedAt: new Date() } as any)
      .where(
        and(
          eq(Message.toUserEmail, userEmail),
          eq(Message.fromUserEmail, otherUserEmail),
          eq(Message.isRead, false)
        )
      );

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { message: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Send a message
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ message: 'Email not found' }, { status: 400 });
    }

    const body = await request.json();
    const { toUserEmail, content } = body;

    const message = await db
      .insert(Message)
      .values({
        fromUserEmail: userEmail,
        toUserEmail,
        content,
        isRead: false,
      } as any)
      .returning();

    return NextResponse.json({ message: message[0] }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    );
  }
}
