-- Copy toàn bộ file này và chạy trong PostgreSQL database của bạn

-- Tạo bảng rating
CREATE TABLE IF NOT EXISTS "rating" (
  "id" serial PRIMARY KEY NOT NULL,
  "userEmail" text NOT NULL,
  "userName" text NOT NULL,
  "rating" integer NOT NULL,
  "comment" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Tạo index để query nhanh hơn
CREATE INDEX IF NOT EXISTS "rating_userEmail_idx" ON "rating" ("userEmail");
CREATE INDEX IF NOT EXISTS "rating_rating_idx" ON "rating" ("rating");

-- Verify: Xem cấu trúc bảng
-- \d rating

-- Test: Insert một record thử
-- INSERT INTO rating (userEmail, userName, rating, comment) 
-- VALUES ('test@example.com', 'Test User', 5, 'Great platform!');

-- Test: Xem tất cả ratings
-- SELECT * FROM rating;
