import { db } from '../../../../../../../db';
import { Connection } from '../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq, or } from 'drizzle-orm';

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

    // Get all connections where user is involved
    const connections = await db.query.Connection.findMany({
      where: or(
        eq(Connection.fromUserEmail, userEmail),
        eq(Connection.toUserEmail, userEmail)
      ),
    });

    return NextResponse.json({ connections }, { status: 200 });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json(
      { message: 'Failed to fetch connections' },
      { status: 500 }
    );
  }
}
