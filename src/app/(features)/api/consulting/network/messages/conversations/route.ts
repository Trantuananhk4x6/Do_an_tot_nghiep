import { db } from '../../../../../../../../db';
import { Message } from '../../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq, or, and, desc } from 'drizzle-orm';

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

    // Get all unique conversation partners
    const messages = await db.query.Message.findMany({
      where: or(
        eq(Message.fromUserEmail, userEmail),
        eq(Message.toUserEmail, userEmail)
      ),
    });

    // Extract unique email addresses
    const conversationEmails = new Set<string>();
    messages.forEach(msg => {
      if (msg.fromUserEmail !== userEmail) {
        conversationEmails.add(msg.fromUserEmail);
      }
      if (msg.toUserEmail !== userEmail) {
        conversationEmails.add(msg.toUserEmail);
      }
    });

    return NextResponse.json(
      { conversations: Array.from(conversationEmails) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { message: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
