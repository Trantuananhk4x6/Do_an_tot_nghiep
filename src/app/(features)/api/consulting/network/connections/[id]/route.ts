import { db } from '../../../../../../../../db';
import { Connection } from '../../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    const { id } = await params;
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ message: 'Email not found' }, { status: 400 });
    }

    const connectionId = parseInt(id);
    const body = await request.json();
    const { status } = body;

    // Update connection status
    const connection = await db
      .update(Connection)
      .set({
        status,
        updatedAt: new Date(),
      } as any)
      .where(eq(Connection.id, connectionId))
      .returning();

    return NextResponse.json({ connection: connection[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating connection:', error);
    return NextResponse.json(
      { message: 'Failed to update connection' },
      { status: 500 }
    );
  }
}
