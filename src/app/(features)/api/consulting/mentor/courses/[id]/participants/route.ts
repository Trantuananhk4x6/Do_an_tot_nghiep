import { db } from '../../../../../../../../../db';
import { CourseRegistration } from '../../../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    const { id } = await params;
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const courseId = parseInt(id);

    const participants = await db.query.CourseRegistration.findMany({
      where: eq(CourseRegistration.courseId, courseId),
    });

    return NextResponse.json({ participants }, { status: 200 });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { message: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}
