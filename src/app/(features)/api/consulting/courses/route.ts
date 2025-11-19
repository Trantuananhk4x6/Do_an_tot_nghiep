import { db } from '../../../../../../db';
import { MentorCourse, UserProfile } from '../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get all scheduled courses
    const courses = await db.query.MentorCourse.findMany({
      where: eq(MentorCourse.status, 'scheduled'),
    });

    // Enrich with mentor info
    const enrichedCourses = await Promise.all(
      courses.map(async (course) => {
        const mentorProfile = await db.query.UserProfile.findFirst({
          where: eq(UserProfile.userEmail, course.mentorEmail),
        });

        return {
          ...course,
          mentorName: mentorProfile?.fullName,
          mentorAvatar: mentorProfile?.avatar,
        };
      })
    );

    return NextResponse.json({ courses: enrichedCourses }, { status: 200 });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
