# Consulting & Connection Feature Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI Interview Platform                         │
│                   Consulting & Connection                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼──────┐    ┌──────▼────────┐
            │  Mentorship  │    │   Networking  │
            │  & Courses   │    │  & Messages   │
            └───────┬──────┘    └──────┬────────┘
                    │                  │
        ┌───────────┴───────┐    ┌────┴──────────┐
        │                   │    │               │
    ┌───▼────┐        ┌────▼───┐ ┌──▼──────┐  ┌──▼──────┐
    │ Mentor │        │ Student│ │ Discover│  │Messages │
    │  Mode  │        │  Mode  │ │ People  │  │  Chat   │
    └───┬────┘        └────┬───┘ └────┬────┘  └────┬────┘
        │                  │          │            │
        │                  │          │            │
    ┌───▼─────────────────▼──────────▼────────────▼───┐
    │              Database Layer                      │
    │  - UserProfile    - Connection                   │
    │  - MentorCourse   - Message                      │
    │  - CourseRegistration                            │
    └──────────────────────────────────────────────────┘
```

## Page Structure

```
/consulting (Main Hub)
│
├── /profile (Setup Profile)
│   └── CV Upload, Portfolio, Professional Info
│
├── Mentorship Branch
│   ├── /mentor (Mentor Dashboard)
│   │   ├── Create Course
│   │   ├── Manage Courses
│   │   ├── View Participants
│   │   └── Start Google Meet
│   │
│   └── /courses (Student View)
│       ├── Browse Courses
│       ├── Filter by Industry
│       ├── View Details
│       └── Register
│
└── Networking Branch
    ├── /network/discover (Find People)
    │   ├── Filter by Industry
    │   ├── Filter by Experience
    │   ├── Search
    │   └── Send Connection Request
    │
    ├── /network/connections (Manage Connections)
    │   ├── View Pending Requests
    │   ├── Accept/Reject
    │   └── View Connected People
    │
    └── /network/messages (Direct Messages)
        ├── Conversation List
        ├── Chat Interface
        └── Send/Receive Messages
```

## User Flows

### Mentor Flow
```
1. User Login
   ↓
2. Setup Profile (/consulting/profile)
   ↓ (Check "I want to become a mentor")
3. Go to Mentor Dashboard (/consulting/mentor)
   ↓
4. Click "Create Course"
   ↓ (Fill course details)
5. Course Created with Google Meet Link
   ↓
6. Students Register
   ↓
7. View Participants List
   ↓
8. At Scheduled Time: Click "Start Meeting"
   ↓
9. Google Meet Opens
```

### Student Flow
```
1. User Login
   ↓
2. Setup Profile (/consulting/profile)
   ↓
3. Browse Courses (/consulting/courses)
   ↓
4. Filter/Search Courses
   ↓
5. View Course Details
   ↓
6. Click "Register Now"
   ↓
7. Registration Confirmed
   ↓
8. At Scheduled Time: Get Google Meet Link
   ↓
9. Join Meeting
```

### Networking Flow
```
1. User Login
   ↓
2. Setup Profile (/consulting/profile)
   ↓
3. Discover People (/consulting/network/discover)
   ↓
4. Filter by Industry/Experience
   ↓
5. View Professional Profiles
   ↓
6. Click "Connect"
   ↓ (Connection request sent)
7. Other User Accepts
   ↓
8. Now Connected
   ↓
9. Send Messages (/consulting/network/messages)
```

## Database Schema Relationships

```
UserProfile (1) ──────────── (∞) MentorCourse
    │                             │
    │                             │
    │                         (∞) CourseRegistration
    │                             
    ├────────── (∞) Connection (∞) ──────────┤
    │                                         │
    └────────── (∞) Message (∞) ──────────────┘
```

### UserProfile Table
```
- id (PK)
- userEmail (unique)
- fullName
- currentPosition
- desiredPosition
- industry
- yearsOfExperience
- cv
- portfolio
- bio
- skills (jsonb array)
- linkedIn
- github
- avatar
- isMentor (boolean)
- timestamps
```

### MentorCourse Table
```
- id (PK)
- mentorEmail (FK → UserProfile)
- title
- description
- maxParticipants
- currentParticipants
- price
- scheduledDate
- duration
- industry
- meetingLink (Google Meet)
- status (scheduled/ongoing/completed/cancelled)
- portfolio
- tags (jsonb array)
- timestamps
```

### CourseRegistration Table
```
- id (PK)
- courseId (FK → MentorCourse)
- userEmail
- userName
- registeredAt
- paymentStatus (pending/paid/refunded)
- attended (boolean)
- feedback
- rating
- timestamps
```

### Connection Table
```
- id (PK)
- fromUserEmail
- toUserEmail
- status (pending/accepted/rejected/blocked)
- message
- timestamps
```

### Message Table
```
- id (PK)
- fromUserEmail
- toUserEmail
- content
- isRead (boolean)
- timestamps
```

## API Architecture

```
┌─────────────────────────────────────────────┐
│         Frontend (Next.js Pages)            │
└─────────────────┬───────────────────────────┘
                  │
                  │ HTTP Requests
                  │
┌─────────────────▼───────────────────────────┐
│          API Routes (/api/consulting)        │
│                                              │
│  ┌──────────────┐    ┌──────────────┐      │
│  │   Profile    │    │   Courses    │      │
│  │   - GET      │    │   - GET      │      │
│  │   - POST     │    │   - POST     │      │
│  └──────────────┘    └──────────────┘      │
│                                              │
│  ┌──────────────┐    ┌──────────────┐      │
│  │   Network    │    │   Messages   │      │
│  │   - Discover │    │   - GET      │      │
│  │   - Connect  │    │   - POST     │      │
│  │   - Manage   │    │   - List     │      │
│  └──────────────┘    └──────────────┘      │
└─────────────────┬───────────────────────────┘
                  │
                  │ Drizzle ORM
                  │
┌─────────────────▼───────────────────────────┐
│           PostgreSQL Database                │
│  (Tables: UserProfile, MentorCourse,         │
│   CourseRegistration, Connection, Message)   │
└──────────────────────────────────────────────┘
```

## Security Flow

```
User Request
    ↓
Clerk Authentication
    ↓
[Valid Token?] ──No──→ Return 401 Unauthorized
    ↓ Yes
Extract User Email
    ↓
Verify User Permissions
    ↓
[Authorized?] ──No──→ Return 403 Forbidden
    ↓ Yes
Process Request
    ↓
Database Operation
    ↓
Return Response
```

## Component Hierarchy

```
App Layout
│
├── Sidebar (with "Consulting & Network" menu)
│
└── /consulting (Main Page)
    │
    ├── Tabs Component
    │   ├── Mentorship Tab
    │   │   ├── Mentor Card
    │   │   └── Student Card
    │   │
    │   └── Networking Tab
    │       ├── Discover Card
    │       ├── Connections Card
    │       └── Messages Card
    │
    ├── /mentor (Mentor Dashboard)
    │   ├── Stats Cards
    │   ├── Tabs (Scheduled/Completed/All)
    │   ├── CourseCard Component
    │   ├── CreateCourseDialog
    │   └── ParticipantsDialog
    │
    ├── /courses (Browse Courses)
    │   ├── Filter Card
    │   ├── Search Input
    │   ├── CourseCard Grid
    │   └── RegisterCourseDialog
    │
    ├── /network/discover
    │   ├── Filter Card
    │   ├── Profile Cards Grid
    │   └── Connect Button
    │
    ├── /network/connections
    │   ├── Tabs (Connected/Pending)
    │   └── Connection Cards
    │
    └── /network/messages
        ├── Conversation List (Sidebar)
        └── Chat Interface (Main)
            ├── Messages List
            └── Message Input
```

## Technology Stack

```
┌────────────────────────────────────────────┐
│           Frontend Layer                    │
│  - Next.js 15 (App Router)                 │
│  - React 18                                 │
│  - TypeScript                               │
│  - Tailwind CSS                             │
│  - Radix UI Components                      │
│  - Lucide Icons                             │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│        Authentication Layer                 │
│  - Clerk (User Management)                 │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│           API Layer                         │
│  - Next.js API Routes                      │
│  - RESTful endpoints                        │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│          Database Layer                     │
│  - PostgreSQL (Neon)                       │
│  - Drizzle ORM                             │
└─────────────────────────────────────────────┘
```

## Integration Points

### Google Meet Integration
```
Course Creation
    ↓
Generate Meeting Link
    ↓
Store in Database
    ↓
Display to Mentor & Students
    ↓
At Scheduled Time
    ↓
Open Google Meet
```

**Note**: Current implementation generates random links.
For production, integrate with Google Calendar API.

### Payment Integration (Future)
```
Student Registers
    ↓
Redirect to Payment Gateway
    ↓
Process Payment
    ↓
Update paymentStatus
    ↓
Send Confirmation
```

## Deployment Checklist

- [ ] Install dependencies: `npm install date-fns @radix-ui/react-avatar`
- [ ] Run migrations: `npm run db:push`
- [ ] Configure environment variables
- [ ] Test all user flows
- [ ] Setup Google Calendar API (production)
- [ ] Integrate payment gateway (production)
- [ ] Configure email notifications
- [ ] Setup monitoring and logging
- [ ] Security audit
- [ ] Performance optimization
