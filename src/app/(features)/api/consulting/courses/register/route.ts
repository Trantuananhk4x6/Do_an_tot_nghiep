import { db } from '../../../../../../../db';
import { CourseRegistration, MentorCourse } from '../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';

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
    const { courseId, userName } = body;

    // Check if course exists
    const course = await db.query.MentorCourse.findFirst({
      where: eq(MentorCourse.id, courseId),
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Check if course is full
    if (course.currentParticipants >= course.maxParticipants) {
      return NextResponse.json({ message: 'Course is full' }, { status: 400 });
    }

    // Check if already registered
    const existingRegistration = await db.query.CourseRegistration.findFirst({
      where: and(
        eq(CourseRegistration.courseId, courseId),
        eq(CourseRegistration.userEmail, userEmail)
      ),
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: 'Already registered for this course' },
        { status: 400 }
      );
    }

    // Register for course
    const registration = await db
      .insert(CourseRegistration)
      .values({
        courseId,
        userEmail,
        userName,
      })
      .returning();

    // Update course participant count
    await db
      .update(MentorCourse)
      .set({
        currentParticipants: course.currentParticipants + 1,
        updatedAt: new Date(),
      } as any)
      .where(eq(MentorCourse.id, courseId));

    return NextResponse.json({ registration: registration[0] }, { status: 201 });
  } catch (error) {
    console.error('Error registering for course:', error);
    return NextResponse.json(
      { message: 'Failed to register for course' },
      { status: 500 }
    );
  }
}
