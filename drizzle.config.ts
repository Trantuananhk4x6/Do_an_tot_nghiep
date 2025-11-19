import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "postgresql",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL || "",
  },
});
