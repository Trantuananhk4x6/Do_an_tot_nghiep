import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db";
import { Rating } from "../../../../../db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    console.log("GET /api/ratings - Fetching ratings...");
    
    const ratings = await db
      .select()
      .from(Rating)
      .orderBy(desc(Rating.createdAt));

    console.log("Ratings fetched:", ratings.length);

    // Calculate average rating
    let averageRating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      averageRating = parseFloat((sum / ratings.length).toFixed(1));
    }

    console.log("Average rating:", averageRating);

    const response = {
      ratings,
      averageRating,
      totalRatings: ratings.length,
    };

    console.log("Sending response with", ratings.length, "ratings");
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching ratings:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to fetch ratings: " + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, userName, rating, comment } = body;

    console.log("Received rating submission:", { userEmail, userName, rating, comment });

    if (!userEmail || !userName || !rating) {
      console.error("Missing required fields:", { userEmail, userName, rating });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      console.error("Invalid rating value:", rating);
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if user already rated
    console.log("Checking for existing rating...");
    const existingRating = await db
      .select()
      .from(Rating)
      .where(sql`${Rating.userEmail} = ${userEmail}`);

    console.log("Existing rating:", existingRating);

    if (existingRating.length > 0) {
      // Update existing rating
      console.log("Updating existing rating...");
      const updateData: any = {
        rating,
        updatedAt: new Date(),
      };
      if (comment) {
        updateData.comment = comment;
      }
      await db
        .update(Rating)
        .set(updateData)
        .where(sql`${Rating.userEmail} = ${userEmail}`);
      console.log("Rating updated successfully");
    } else {
      // Create new rating
      console.log("Creating new rating...");
      const insertData: any = {
        userEmail,
        userName,
        rating,
      };
      if (comment) {
        insertData.comment = comment;
      }
      console.log("Insert data:", insertData);
      const result = await db.insert(Rating).values(insertData);
      console.log("Rating created successfully:", result);
    }

    return NextResponse.json({ success: true, message: "Rating saved successfully" });
  } catch (error: any) {
    console.error("Error creating rating:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to create rating: " + error.message },
      { status: 500 }
    );
  }
}
