import { sql } from 'drizzle-orm';
import { db } from '../db/index';

async function createRatingTable() {
  console.log('Creating rating table...');
  
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "rating" (
        "id" serial PRIMARY KEY NOT NULL,
        "userEmail" text NOT NULL,
        "userName" text NOT NULL,
        "rating" integer NOT NULL,
        "comment" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `);
    
    console.log('✅ Rating table created successfully!');
    
    // Create indexes
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "rating_userEmail_idx" ON "rating" ("userEmail")
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "rating_rating_idx" ON "rating" ("rating")
    `);
    
    console.log('✅ Indexes created successfully!');
    console.log('✅ All done! You can now use the rating feature.');
    
  } catch (error) {
    console.error('❌ Error creating rating table:', error);
  }
  
  process.exit(0);
}

createRatingTable();
