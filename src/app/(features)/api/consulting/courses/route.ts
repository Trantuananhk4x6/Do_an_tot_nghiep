import { db } from '../../../../../../db';
import { MentorCourse, UserProfile } from '../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get all scheduled courses using SQL builder API
    const courses = await db
      .select()
      .from(MentorCourse)
      .where(eq(MentorCourse.status, 'scheduled'));

    // Enrich with mentor info
    const enrichedCourses = await Promise.all(
      courses.map(async (course) => {
        const mentorProfiles = await db
          .select()
          .from(UserProfile)
          .where(eq(UserProfile.userEmail, course.mentorEmail))
          .limit(1);
        
        const mentorProfile = mentorProfiles[0];

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
      { message: 'Failed to fetch courses', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
