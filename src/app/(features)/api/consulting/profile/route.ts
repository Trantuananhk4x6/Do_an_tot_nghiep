import { db } from '../../../../../../db';
import { UserProfile } from '../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      fullName,
      currentPosition,
      desiredPosition,
      industry,
      yearsOfExperience,
      bio,
      skills,
      linkedIn,
      github,
      portfolio,
      isMentor,
    } = body;

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ message: 'Email not found' }, { status: 400 });
    }

    // Check if profile already exists
    const existingProfile = await db.query.UserProfile.findFirst({
      where: eq(UserProfile.userEmail, userEmail),
    });

    let profile;
    if (existingProfile) {
      // Update existing profile
      profile = await db
        .update(UserProfile)
        .set({
          fullName,
          currentPosition,
          desiredPosition,
          industry,
          yearsOfExperience,
          bio,
          skills,
          linkedIn,
          github,
          portfolio,
          cv: undefined,
          avatar: undefined,
          isMentor,
          updatedAt: new Date(),
        } as any)
        .where(eq(UserProfile.userEmail, userEmail))
        .returning();
    } else {
      // Create new profile
      profile = await db
        .insert(UserProfile)
        .values({
          userEmail,
          fullName,
          currentPosition: currentPosition || null,
          desiredPosition,
          industry,
          yearsOfExperience,
          bio,
          skills,
          linkedIn,
          github,
          portfolio,
          cv: null,
          avatar: null,
          isMentor: isMentor || false,
        } as any)
        .returning();
    }

    return NextResponse.json({ profile: profile[0] }, { status: 200 });
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    return NextResponse.json(
      { message: 'Failed to create/update profile' },
      { status: 500 }
    );
  }
}

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

    const profile = await db.query.UserProfile.findFirst({
      where: eq(UserProfile.userEmail, userEmail),
    });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
