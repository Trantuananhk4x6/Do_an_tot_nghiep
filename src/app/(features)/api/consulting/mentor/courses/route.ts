import { db } from '../../../../../../../db';
import { MentorCourse, UserProfile } from '../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';

// Get mentor's courses
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

    const courses = await db
      .select()
      .from(MentorCourse)
      .where(eq(MentorCourse.mentorEmail, userEmail));

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error('Error fetching mentor courses:', error);
    return NextResponse.json(
      { message: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// Create new course
export async function POST(request: NextRequest) {
  try {
    console.log('[CREATE COURSE] Starting...');
    
    const user = await currentUser();
    if (!user) {
      console.log('[CREATE COURSE] No user found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      console.log('[CREATE COURSE] No email found');
      return NextResponse.json({ message: 'Email not found' }, { status: 400 });
    }

    console.log('[CREATE COURSE] User email:', userEmail);

    // Check if user is a mentor, auto-create profile if not exists
    const profiles = await db
      .select()
      .from(UserProfile)
      .where(eq(UserProfile.userEmail, userEmail))
      .limit(1);
    
    let profile = profiles[0];
    console.log('[CREATE COURSE] Existing profile:', profile);

    if (!profile) {
      console.log('[CREATE COURSE] Creating new mentor profile...');
      // Auto-create mentor profile
      const [newProfile] = await db
        .insert(UserProfile)
        .values({
          userEmail,
          fullName: user.fullName || 'Mentor',
          isMentor: true,
        } as any)
        .returning();
      profile = newProfile;
      console.log('[CREATE COURSE] New profile created:', profile);
    } else if (!profile.isMentor) {
      console.log('[CREATE COURSE] Updating user to mentor...');
      // Update existing profile to mentor
      const [updatedProfile] = await db
        .update(UserProfile)
        .set({ isMentor: true } as any)
        .where(eq(UserProfile.userEmail, userEmail))
        .returning();
      profile = updatedProfile;
      console.log('[CREATE COURSE] Profile updated:', profile);
    }

    let body;
    try {
      body = await request.json();
      console.log('[CREATE COURSE] Request body:', body);
    } catch (parseError) {
      console.error('[CREATE COURSE] JSON parse error:', parseError);
      return NextResponse.json(
        { message: 'Invalid request body', error: 'Failed to parse JSON' },
        { status: 400 }
      );
    }
    
    const {
      title,
      description,
      maxParticipants,
      price,
      scheduledDate,
      duration,
      industry,
      portfolio,
      tags,
    } = body;

    // Validate required fields
    if (!title || !description || !industry || !scheduledDate) {
      return NextResponse.json(
        { message: 'Missing required fields: title, description, industry, and scheduledDate are required' },
        { status: 400 }
      );
    }

    if (!maxParticipants || maxParticipants < 1) {
      return NextResponse.json(
        { message: 'maxParticipants must be at least 1' },
        { status: 400 }
      );
    }

    if (price === undefined || price < 0) {
      return NextResponse.json(
        { message: 'price must be a non-negative number' },
        { status: 400 }
      );
    }

    if (!duration || duration < 30) {
      return NextResponse.json(
        { message: 'duration must be at least 30 minutes' },
        { status: 400 }
      );
    }

    console.log('[CREATE COURSE] Inserting course into database...');

    // First insert to get the course ID, then update with meeting link
    const courseResult = await db
      .insert(MentorCourse)
      .values({
        mentorEmail: userEmail,
        title,
        description,
        maxParticipants,
        currentParticipants: 0,
        price,
        scheduledDate: new Date(scheduledDate),
        duration,
        industry,
        meetingLink: '', // Will be updated after getting ID
        status: 'scheduled',
        portfolio,
        tags,
      } as any)
      .returning();

    // Update with internal meeting link using the course ID
    const courseId = courseResult[0].id;
    const meetingLink = `/consulting/meeting/${courseId}`;
    
    const course = await db
      .update(MentorCourse)
      .set({ meetingLink } as any)
      .where(eq(MentorCourse.id, courseId))
      .returning();

    console.log('[CREATE COURSE] Course created successfully:', course[0]);

    return NextResponse.json({ course: course[0] }, { status: 201 });
  } catch (error) {
    console.error('[CREATE COURSE] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error('[CREATE COURSE] Error details:', errorDetails);
    return NextResponse.json(
      { 
        message: 'Failed to create course', 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
