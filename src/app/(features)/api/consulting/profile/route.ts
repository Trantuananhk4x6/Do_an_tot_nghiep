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
    console.log('Create profile: incoming body', JSON.stringify(body));
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
      location,
    } = body;

    // Sanitize fields
    const yearsNum = typeof yearsOfExperience === 'number' ? yearsOfExperience : parseInt(yearsOfExperience as any) || null;
    const skillsArr = Array.isArray(skills)
      ? skills.map((s) => String(s).trim()).filter(Boolean)
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const isMentorBool = Boolean(isMentor);

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ message: 'Email not found' }, { status: 400 });
    }

    console.log('Creating/updating profile for user:', user.id, user.emailAddresses?.[0]?.emailAddress);
    // Validate required fields
    if (!fullName || !String(fullName).trim()) {
      return NextResponse.json({ message: 'Full name is required' }, { status: 400 });
    }

    // Check if profile already exists
    const existingProfile = await db.query.UserProfile.findFirst({
      where: eq(UserProfile.userEmail, userEmail),
    });

    let profile;
    try {
      if (existingProfile) {
      // Update existing profile
      profile = await db
        .update(UserProfile)
        .set({
          fullName,
          currentPosition,
          desiredPosition,
          industry,
          yearsOfExperience: yearsNum,
          bio,
          skills: skillsArr,
          linkedIn,
          github,
          portfolio,
          cv: undefined,
          avatar: undefined,
          isMentor: isMentorBool,
          location: location || null,
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
            yearsOfExperience: yearsNum,
            bio,
            skills: skillsArr,
            linkedIn,
            github,
            portfolio,
            cv: null,
            avatar: null,
            isMentor: isMentorBool || false,
            location: location || null,
          } as any)
          .returning();
      }
    } catch (dbError) {
      console.error('Database error creating/updating profile:', dbError);
      // Try minimal fallback insert to ensure profile exists
      try {
        console.log('Attempting fallback minimal insert');
        const fallback = await db
          .insert(UserProfile)
          .values({
            userEmail,
            fullName,
            industry: industry || null,
          } as any)
          .returning();
        console.log('Fallback insert success for', userEmail, fallback[0]);
        return NextResponse.json({ profile: fallback[0], message: 'Profile created (fallback)' }, { status: 200 });
      } catch (fallbackError) {
        console.error('Fallback insert failed:', fallbackError);
        const message = dbError?.message || 'DB error creating or updating profile';
        const details = process.env.NODE_ENV !== 'production' ? dbError?.stack || null : null;
        return NextResponse.json({ message, details }, { status: 500 });
      }
    }

    return NextResponse.json({ profile: profile[0], message: existingProfile ? 'Profile updated' : 'Profile created' }, { status: 200 });
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    const message = (error as any)?.message || 'Failed to create/update profile';
    const details = process.env.NODE_ENV !== 'production' ? (error as any)?.stack || null : null;
    return NextResponse.json({ message, details }, { status: 500 });
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
