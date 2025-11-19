# Consulting & Connection Feature

A comprehensive mentorship and professional networking platform integrated into the AI Interview application.

## Features

### 1. **Mentorship & Consulting**
- **Mentor Dashboard**: Create and manage courses
- **Course Creation**: Set up mentorship sessions with:
  - Title, description, and industry
  - Max participants and pricing
  - Schedule with Google Meet integration
  - Portfolio sharing
  - Tags for better discoverability
- **Student Portal**: Browse and register for courses
- **Automatic Meeting Links**: Google Meet links generated for each course

### 2. **Professional Networking**
- **Discover People**: Find professionals by:
  - Industry (Software, AI, Data Science, etc.)
  - Years of experience
  - Skills and expertise
  - Search by name or keywords
- **Connections**: Send and manage connection requests
- **Messaging**: Direct messaging with your connections
- **Profile Management**: Complete professional profile with CV, portfolio, and social links

## Installation

1. Install required dependencies:
```bash
npm install date-fns @radix-ui/react-avatar
```

2. Run database migrations to create new tables:
```bash
npm run db:push
```

3. The following tables will be created:
   - `userProfile` - User profiles with CV and professional info
   - `mentorCourse` - Courses created by mentors
   - `courseRegistration` - Student registrations for courses
   - `connection` - Professional connections between users
   - `message` - Direct messages between users
   - `post` - Social networking posts (future feature)
   - `comment` - Comments on posts (future feature)

## Usage

### For Mentors

1. **Setup Profile**: Navigate to `/consulting/profile` and complete your profile
2. **Enable Mentor Mode**: Check "I want to become a mentor" during profile setup
3. **Create Course**: Go to `/consulting/mentor` and click "Create Course"
4. **Manage Courses**: View participants, meeting links, and course status
5. **Start Sessions**: When it's time, click "Start Meeting" to open Google Meet

### For Students

1. **Browse Courses**: Visit `/consulting/courses` to see available courses
2. **Filter Courses**: Search by industry, keywords, or mentor name
3. **Register**: Click "Register Now" on any available course
4. **Join Session**: Meeting link will be available when the course starts

### For Networking

1. **Complete Profile**: Setup your professional profile at `/consulting/profile`
2. **Discover People**: Browse professionals at `/consulting/network/discover`
3. **Send Connection Requests**: Click "Connect" on any profile
4. **Accept/Reject Requests**: Manage pending requests in `/consulting/network/connections`
5. **Send Messages**: Chat with connections at `/consulting/network/messages`

## API Routes

All API routes are located under `/api/consulting/`:

### Profile
- `POST /api/consulting/profile` - Create/update profile
- `GET /api/consulting/profile` - Get user profile

### Mentor Courses
- `GET /api/consulting/mentor/courses` - Get mentor's courses
- `POST /api/consulting/mentor/courses` - Create new course
- `DELETE /api/consulting/mentor/courses/[id]` - Delete course
- `GET /api/consulting/mentor/courses/[id]/participants` - Get course participants

### Student Courses
- `GET /api/consulting/courses` - Browse all available courses
- `POST /api/consulting/courses/register` - Register for a course

### Networking
- `GET /api/consulting/network/discover` - Discover professionals
- `POST /api/consulting/network/connect` - Send connection request
- `GET /api/consulting/network/connections` - Get user's connections
- `PATCH /api/consulting/network/connections/[id]` - Accept/reject connection

### Messaging
- `GET /api/consulting/network/messages` - Get messages with a user
- `POST /api/consulting/network/messages` - Send a message
- `GET /api/consulting/network/messages/conversations` - Get all conversations

## Database Schema

### UserProfile
- User information, CV, portfolio, professional links
- Mentor status flag
- Skills array

### MentorCourse
- Course details (title, description, price)
- Schedule and duration
- Google Meet link
- Participant tracking
- Status (scheduled, ongoing, completed, cancelled)

### CourseRegistration
- Links students to courses
- Payment status tracking
- Attendance tracking
- Feedback and ratings

### Connection
- Professional connections between users
- Status (pending, accepted, rejected, blocked)
- Connection request message

### Message
- Direct messages between connected users
- Read status
- Timestamp

## UI Components

New components created:
- `Badge` - Display tags and status
- `Avatar` - User profile pictures
- Course cards with mentor info
- Connection request cards
- Message threads

## Navigation

New menu item added to sidebar:
- "Consulting & Network" - Access to all consulting and networking features

## Google Meet Integration

The system generates Google Meet links automatically when courses are created. In production, you should integrate with the Google Calendar API to:
1. Create calendar events
2. Generate proper Google Meet links
3. Send invitations to participants
4. Handle meeting reminders

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Video call recording
- Course ratings and reviews
- Social networking posts and comments
- Skill endorsements
- Job postings integration
- Certificate generation
- Email notifications
- Real-time messaging with WebSocket
- Advanced search filters
- Recommendation system

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **UI Components**: Radix UI + Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Notes

- All pages are client-side rendered for real-time updates
- Authentication is required for all features
- Email addresses are used as user identifiers
- Google Meet links are currently generated randomly (integrate with Google Calendar API for production)
- Payment processing is marked as "pending" (implement payment gateway for production)

## Security Considerations

- User authentication via Clerk
- API routes verify user identity
- Users can only modify their own content
- Connection requests require approval
- Messages only between connected users (currently no restriction - add in production)

## Support

For issues or questions, contact the development team.
