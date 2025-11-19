CREATE TABLE "comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"postId" integer NOT NULL,
	"userEmail" text NOT NULL,
	"userName" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connection" (
	"id" serial PRIMARY KEY NOT NULL,
	"fromUserEmail" text NOT NULL,
	"toUserEmail" text NOT NULL,
	"status" text DEFAULT 'pending',
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courseRegistration" (
	"id" serial PRIMARY KEY NOT NULL,
	"courseId" integer NOT NULL,
	"userEmail" text NOT NULL,
	"userName" text NOT NULL,
	"registeredAt" timestamp DEFAULT now() NOT NULL,
	"paymentStatus" text DEFAULT 'pending',
	"attended" boolean DEFAULT false,
	"feedback" text,
	"rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mentorCourse" (
	"id" serial PRIMARY KEY NOT NULL,
	"mentorEmail" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"maxParticipants" integer NOT NULL,
	"currentParticipants" integer DEFAULT 0,
	"price" integer NOT NULL,
	"scheduledDate" timestamp NOT NULL,
	"duration" integer NOT NULL,
	"industry" text NOT NULL,
	"meetingLink" text,
	"status" text DEFAULT 'scheduled',
	"portfolio" text,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" serial PRIMARY KEY NOT NULL,
	"fromUserEmail" text NOT NULL,
	"toUserEmail" text NOT NULL,
	"content" text NOT NULL,
	"isRead" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"userEmail" text NOT NULL,
	"userName" text NOT NULL,
	"content" text NOT NULL,
	"industry" text,
	"tags" jsonb,
	"likes" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rating" (
	"id" serial PRIMARY KEY NOT NULL,
	"userEmail" text NOT NULL,
	"userName" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userProfile" (
	"id" serial PRIMARY KEY NOT NULL,
	"userEmail" text NOT NULL,
	"fullName" text NOT NULL,
	"currentPosition" text,
	"desiredPosition" text,
	"industry" text,
	"yearsOfExperience" integer,
	"cv" text,
	"portfolio" text,
	"bio" text,
	"skills" jsonb,
	"linkedIn" text,
	"github" text,
	"avatar" text,
	"isMentor" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "userProfile_userEmail_unique" UNIQUE("userEmail")
);
--> statement-breakpoint
CREATE TABLE "waitingList" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"job_title" text NOT NULL,
	"phone_number" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "interviewSetEmbeddings" ALTER COLUMN "embedding" SET DATA TYPE vector(768);--> statement-breakpoint
ALTER TABLE "interviewSet" ADD COLUMN "position" text NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_postId_post_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courseRegistration" ADD CONSTRAINT "courseRegistration_courseId_mentorCourse_id_fk" FOREIGN KEY ("courseId") REFERENCES "public"."mentorCourse"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionAnswer" DROP COLUMN "userEmail";