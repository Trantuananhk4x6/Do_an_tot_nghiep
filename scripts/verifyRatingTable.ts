import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const verifyRatingTable = async () => {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  console.log("🔗 Connecting to database...");
  const sql = neon(databaseUrl);

  try {
    // Check if rating table exists
    console.log("🔍 Checking if rating table exists...");
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'rating'
    `;
    
    if (tableCheck.length === 0) {
      console.log("❌ Rating table does NOT exist!");
      console.log("🔧 Creating rating table now...");
      
      // Create the table
      await sql`
        CREATE TABLE IF NOT EXISTS "rating" (
          "id" serial PRIMARY KEY NOT NULL,
          "userEmail" text NOT NULL,
          "userName" text NOT NULL,
          "rating" integer NOT NULL,
          "comment" text,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL
        )
      `;
      
      console.log("✅ Rating table created!");
      
      // Create indexes
      await sql`CREATE INDEX IF NOT EXISTS "rating_userEmail_idx" ON "rating" ("userEmail")`;
      await sql`CREATE INDEX IF NOT EXISTS "rating_rating_idx" ON "rating" ("rating")`;
      
      console.log("✅ Indexes created!");
    } else {
      console.log("✅ Rating table exists!");
    }

    // Get table structure
    console.log("\n📊 Table structure:");
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'rating'
      ORDER BY ordinal_position
    `;
    
    console.table(columns);

    // Check if there's any data
    console.log("\n📝 Checking data...");
    const count = await sql`SELECT COUNT(*) as count FROM rating`;
    console.log(`Total records: ${count[0].count}`);
    
    if (count[0].count > 0) {
      const records = await sql`SELECT * FROM rating LIMIT 5`;
      console.log("\n📋 Sample records:");
      console.table(records);
    }

    console.log("\n🎉 Verification complete!");
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

verifyRatingTable();
