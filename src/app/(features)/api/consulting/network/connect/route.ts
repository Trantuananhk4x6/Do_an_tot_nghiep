import { db } from '../../../../../../../db';
import { Connection } from '../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq, or } from 'drizzle-orm';

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
    const { toUserEmail, message } = body;

    // Check if connection already exists
    const existingConnection = await db.query.Connection.findFirst({
      where: or(
        and(
          eq(Connection.fromUserEmail, userEmail),
          eq(Connection.toUserEmail, toUserEmail)
        ),
        and(
          eq(Connection.fromUserEmail, toUserEmail),
          eq(Connection.toUserEmail, userEmail)
        )
      ),
    });

    if (existingConnection) {
      return NextResponse.json(
        { message: 'Connection already exists' },
        { status: 400 }
      );
    }

    // Create connection request
    const connection = await db
      .insert(Connection)
      .values({
        fromUserEmail: userEmail,
        toUserEmail,
        status: 'pending',
        message,
      } as any)
      .returning();

    return NextResponse.json({ connection: connection[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating connection:', error);
    return NextResponse.json(
      { message: 'Failed to create connection' },
      { status: 500 }
    );
  }
}
