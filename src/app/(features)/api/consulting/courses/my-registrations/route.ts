import { db } from '../../../../../../../db';
import { CourseRegistration, MentorCourse } from '../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// GET: Get current user's course registrations
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

    // Get registrations with course details
    const registrations = await db
      .select({
        id: CourseRegistration.id,
        courseId: CourseRegistration.courseId,
        registeredAt: CourseRegistration.registeredAt,
        paymentStatus: CourseRegistration.paymentStatus,
        attended: CourseRegistration.attended,
        feedback: CourseRegistration.feedback,
        rating: CourseRegistration.rating,
        course: {
          id: MentorCourse.id,
          title: MentorCourse.title,
          description: MentorCourse.description,
          mentorEmail: MentorCourse.mentorEmail,
          scheduledDate: MentorCourse.scheduledDate,
          duration: MentorCourse.duration,
          price: MentorCourse.price,
          industry: MentorCourse.industry,
          meetingLink: MentorCourse.meetingLink,
          status: MentorCourse.status,
        },
      })
      .from(CourseRegistration)
      .innerJoin(MentorCourse, eq(CourseRegistration.courseId, MentorCourse.id))
      .where(eq(CourseRegistration.userEmail, userEmail));

    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { message: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
