import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '../../../../../../db';
import { UserProfile } from '../../../../../../db/schema';
import { eq, ne, and, sql } from 'drizzle-orm';

// GET: Lấy danh sách users để match
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('mode') || 'industry'; // industry, location, random
    const limit = parseInt(searchParams.get('limit') || '10');

    // Lấy thông tin user hiện tại
    const currentUser = await db.query.UserProfile.findFirst({
      where: eq(UserProfile.userEmail, userId),
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    let users;

    switch (mode) {
      case 'industry':
        // Match theo ngành nghề
        users = await db.query.UserProfile.findMany({
          where: and(
            ne(UserProfile.userEmail, userId),
            eq(UserProfile.industry, currentUser.industry || '')
          ),
          limit,
        });
        break;

      case 'location':
        // Match theo location (cần thêm trường location vào schema)
        users = await db.query.UserProfile.findMany({
          where: ne(UserProfile.userEmail, userId),
          limit,
        });
        break;

      case 'random':
      default:
        // Random match
        users = await db
          .select()
          .from(UserProfile)
          .where(ne(UserProfile.userEmail, userId))
          .orderBy(sql`RANDOM()`)
          .limit(limit);
        break;
    }

    // Calculate match score based on common skills, industry, etc.
    const usersWithScore = users.map((user) => {
      let matchScore = 50; // Base score

      // Same industry bonus
      if (user.industry === currentUser.industry) {
        matchScore += 30;
      }

      // Common skills bonus
      const currentSkills = currentUser.skills as string[] || [];
      const userSkills = user.skills as string[] || [];
      const commonSkills = currentSkills.filter((skill) =>
        userSkills.includes(skill)
      );
      matchScore += Math.min(commonSkills.length * 5, 20);

      return {
        ...user,
        matchScore: Math.min(matchScore, 100),
      };
    });

    return NextResponse.json({
      success: true,
      users: usersWithScore,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
