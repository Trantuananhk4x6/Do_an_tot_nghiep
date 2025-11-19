-- Create rating table if not exists
CREATE TABLE IF NOT EXISTS "rating" (
  "id" serial PRIMARY KEY NOT NULL,
  "userEmail" text NOT NULL,
  "userName" text NOT NULL,
  "rating" integer NOT NULL,
  "comment" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "rating_userEmail_idx" ON "rating" ("userEmail");
CREATE INDEX IF NOT EXISTS "rating_rating_idx" ON "rating" ("rating");
CREATE INDEX IF NOT EXISTS "rating_created_at_idx" ON "rating" ("created_at");
