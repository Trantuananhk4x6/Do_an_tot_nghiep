import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  vector,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const QuestionAnswer = pgTable("questionAnswer", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  interviewSetId: integer("interviewSetId")
    .notNull()
    .references(() => InterviewSet.id, { onDelete: "cascade" }),
});
export const Resume = pgTable("resume", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  jsonResume: text("jsonResume").notNull(),
  userEmail: text("userEmail").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
export const InterviewSet = pgTable("interviewSet", {
  id: serial("id").primaryKey(),
  userEmail: text("userEmail").notNull(),
  jobDescription: text("jobDescription").notNull(),
  companyName: text("companyName").notNull(),
  position: text("position").notNull(),
  resumeName: text("resumeName").notNull(),
  resumeId: integer("resumeId")
    .notNull()
    .references(() => Resume.id, { onDelete: "cascade" }),
  language: text("language").default("en"), // vi, en, ja, zh, ko
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const InterviewSetEmbeddings = pgTable(
  "interviewSetEmbeddings",
  {
    id: serial("id").primaryKey(),
    interviewSetId: integer("interviewSetId")
      .notNull()
      .references(() => InterviewSet.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    userEmail: text("userEmail").notNull(),
    embedding: vector("embedding", { dimensions: 768 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
);

export const WaitingList = pgTable("waitingList", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  jobTitle: text("job_title").notNull(),
  phoneNumber: text("phone_number").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const Rating = pgTable("rating", {
  id: serial("id").primaryKey(),
  userEmail: text("userEmail").notNull(),
  userName: text("userName").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

// User Profile for Consulting & Connection
export const UserProfile = pgTable("userProfile", {
  id: serial("id").primaryKey(),
  userEmail: text("userEmail").notNull().unique(),
  fullName: text("fullName").notNull(),
  currentPosition: text("currentPosition"),
  desiredPosition: text("desiredPosition"),
  industry: text("industry"), // software, ai, data, etc.
  yearsOfExperience: integer("yearsOfExperience"),
  cv: text("cv"), // CV file path or URL
  portfolio: text("portfolio"), // Portfolio URL
  bio: text("bio"),
  skills: jsonb("skills").$type<string[]>(),
  linkedIn: text("linkedIn"),
  github: text("github"),
  avatar: text("avatar"),
  location: text("location"), // User's city/location
  isMentor: boolean("isMentor").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

// Mentor Courses
export const MentorCourse = pgTable("mentorCourse", {
  id: serial("id").primaryKey(),
  mentorEmail: text("mentorEmail").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  maxParticipants: integer("maxParticipants").notNull(),
  currentParticipants: integer("currentParticipants").default(0),
  price: integer("price").notNull(), // Price in USD or local currency
  scheduledDate: timestamp("scheduledDate").notNull(),
  duration: integer("duration").notNull(), // Duration in minutes
  industry: text("industry").notNull(),
  meetingLink: text("meetingLink"), // Google Meet link
  status: text("status").default("scheduled"), // scheduled, ongoing, completed, cancelled
  portfolio: text("portfolio"), // Mentor's portfolio for this course
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

// Course Registrations
export const CourseRegistration = pgTable("courseRegistration", {
  id: serial("id").primaryKey(),
  courseId: integer("courseId")
    .notNull()
    .references(() => MentorCourse.id, { onDelete: "cascade" }),
  userEmail: text("userEmail").notNull(),
  userName: text("userName").notNull(),
  registeredAt: timestamp("registeredAt").notNull().defaultNow(),
  paymentStatus: text("paymentStatus").default("pending"), // pending, paid, refunded
  attended: boolean("attended").default(false),
  feedback: text("feedback"),
  rating: integer("rating"), // 1-5 stars
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

// Connections/Network
export const Connection = pgTable("connection", {
  id: serial("id").primaryKey(),
  fromUserEmail: text("fromUserEmail").notNull(),
  toUserEmail: text("toUserEmail").notNull(),
  status: text("status").default("pending"), // pending, accepted, rejected, blocked
  message: text("message"), // Connection request message
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

// Messages between users
export const Message = pgTable("message", {
  id: serial("id").primaryKey(),
  fromUserEmail: text("fromUserEmail").notNull(),
  toUserEmail: text("toUserEmail").notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

// Posts for social networking
export const Post = pgTable("post", {
  id: serial("id").primaryKey(),
  userEmail: text("userEmail").notNull(),
  userName: text("userName").notNull(),
  content: text("content").notNull(),
  industry: text("industry"),
  tags: jsonb("tags").$type<string[]>(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

// Comments on posts
export const Comment = pgTable("comment", {
  id: serial("id").primaryKey(),
  postId: integer("postId")
    .notNull()
    .references(() => Post.id, { onDelete: "cascade" }),
  userEmail: text("userEmail").notNull(),
  userName: text("userName").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
