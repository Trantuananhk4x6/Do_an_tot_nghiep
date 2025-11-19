import { db } from '../../../../../../../db';
import { UserProfile } from '../../../../../../../db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { eq, ne, gte, like, or } from 'drizzle-orm';

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

    const searchParams = request.nextUrl.searchParams;
    const industry = searchParams.get('industry');
    const yearsOfExperience = searchParams.get('yearsOfExperience');
    const search = searchParams.get('search');

    // Build query
    let query = db.select().from(UserProfile).where(ne(UserProfile.userEmail, userEmail));

    // Apply filters (simplified - in production use proper query building)
    const profiles = await db.query.UserProfile.findMany({
      where: ne(UserProfile.userEmail, userEmail),
    });

    let filteredProfiles = profiles;

    if (industry) {
      filteredProfiles = filteredProfiles.filter(p => p.industry === industry);
    }

    if (yearsOfExperience) {
      const minYears = parseInt(yearsOfExperience);
      filteredProfiles = filteredProfiles.filter(
        p => (p.yearsOfExperience || 0) >= minYears
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredProfiles = filteredProfiles.filter(
        p =>
          p.fullName.toLowerCase().includes(searchLower) ||
          p.bio?.toLowerCase().includes(searchLower) ||
          p.skills?.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({ profiles: filteredProfiles }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}
