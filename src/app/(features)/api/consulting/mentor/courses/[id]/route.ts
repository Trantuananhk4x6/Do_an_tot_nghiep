import { db } from '../../../../../../../../db';
import { MentorCourse } from '../../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
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

    const courseId = parseInt(id);

    // Delete course (only if it belongs to the mentor)
    await db
      .delete(MentorCourse)
      .where(
        and(
          eq(MentorCourse.id, courseId),
          eq(MentorCourse.mentorEmail, userEmail)
        )
      );

    return NextResponse.json({ message: 'Course deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { message: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
