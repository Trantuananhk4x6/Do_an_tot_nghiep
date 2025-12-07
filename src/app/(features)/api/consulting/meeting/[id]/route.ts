import { db } from '../../../../../../../db';
import { MentorCourse, CourseRegistration } from '../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// GET: Get meeting info
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await currentUser();

    // Try to find course with this meeting ID
    const courses = await db
      .select()
      .from(MentorCourse)
      .where(eq(MentorCourse.id, parseInt(id) || 0));

    const course = courses[0];

    if (!course) {
      // Return generic meeting info for direct room access
      return NextResponse.json({
        meeting: {
          id,
          title: 'Meeting Room',
          hostName: 'Host',
          hostEmail: '',
          scheduledDate: new Date().toISOString(),
          duration: 60,
          participantCount: 1,
        },
        isHost: false,
      });
    }

    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const isHost = userEmail === course.mentorEmail;

    // Get participant count
    const registrations = await db
      .select()
      .from(CourseRegistration)
      .where(eq(CourseRegistration.courseId, course.id));

    return NextResponse.json({
      meeting: {
        id: course.id.toString(),
        title: course.title,
        hostName: course.mentorEmail.split('@')[0],
        hostEmail: course.mentorEmail,
        scheduledDate: course.scheduledDate,
        duration: course.duration,
        participantCount: registrations.length + 1, // +1 for host
      },
      isHost,
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json(
      { message: 'Failed to fetch meeting info' },
      { status: 500 }
    );
  }
}
