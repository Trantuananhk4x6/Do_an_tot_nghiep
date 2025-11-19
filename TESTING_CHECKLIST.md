# ✅ Testing Checklist - Consulting & Connection Feature

## Pre-Testing Setup

- [ ] Dependencies installed: `npm install date-fns @radix-ui/react-avatar`
- [ ] Database migrated: `npm run db:push`
- [ ] Development server running: `npm run dev`
- [ ] Logged into the application with Clerk

## 🎯 Profile Testing

### Profile Creation
- [ ] Navigate to `/consulting/profile`
- [ ] Page loads without errors
- [ ] All form fields are visible
- [ ] Can enter full name
- [ ] Can select industry from dropdown (10 options)
- [ ] Can enter years of experience (number)
- [ ] Can enter current and desired position
- [ ] Can enter bio (textarea)
- [ ] Can enter skills (comma-separated)
- [ ] Can enter LinkedIn URL
- [ ] Can enter GitHub URL
- [ ] Can enter Portfolio URL
- [ ] Can check "I want to become a mentor"
- [ ] Click "Create Profile" - success toast appears
- [ ] Redirected back to `/consulting`

### Profile Update
- [ ] Return to `/consulting/profile`
- [ ] Previous data is loaded in form
- [ ] Can modify any field
- [ ] Click "Create Profile" again - updates successfully
- [ ] Success toast appears

## 🎓 Mentorship Testing

### Mentor Dashboard Access
- [ ] Check "I want to become a mentor" in profile
- [ ] Navigate to `/consulting/mentor`
- [ ] Page loads without errors
- [ ] Stats cards show 0 for new account
- [ ] "Create Course" button is visible
- [ ] Three tabs visible: Scheduled, Completed, All

### Course Creation
- [ ] Click "Create Course" button
- [ ] Dialog opens
- [ ] All form fields are present:
  - [ ] Title input
  - [ ] Description textarea
  - [ ] Industry dropdown (10 options)
  - [ ] Max Participants number input
  - [ ] Date picker (today or future)
  - [ ] Time picker
  - [ ] Duration in minutes
  - [ ] Price input (USD)
  - [ ] Portfolio URL (optional)
  - [ ] Tags input (optional)
- [ ] Fill all required fields
- [ ] Click "Create Course"
- [ ] Success toast appears
- [ ] Dialog closes
- [ ] New course appears in dashboard
- [ ] Course shows in "Scheduled" tab
- [ ] Course shows in "All Courses" tab
- [ ] Stats updated (Total Courses = 1)

### Course Management
- [ ] Course card displays:
  - [ ] Title
  - [ ] Description (truncated)
  - [ ] Status badge
  - [ ] Date and time
  - [ ] Duration
  - [ ] Participants (0/max)
  - [ ] Price
  - [ ] Industry badge
  - [ ] Tags (if provided)
  - [ ] Portfolio link (if provided)
- [ ] "View Participants" button visible
- [ ] "Start Meeting" button visible (if time is right)
- [ ] Delete button (trash icon) visible

### View Participants
- [ ] Click "View Participants"
- [ ] Dialog opens
- [ ] Shows "No participants yet" (for new course)
- [ ] Meeting link section visible (if generated)
- [ ] Can copy meeting link
- [ ] Can open meeting link in new tab
- [ ] Close dialog works

### Delete Course
- [ ] Click delete button (trash icon)
- [ ] Confirmation prompt appears
- [ ] Click "OK" to confirm
- [ ] Success toast appears
- [ ] Course removed from list
- [ ] Stats updated

## 📚 Student/Course Browsing Testing

### Browse Courses
- [ ] Navigate to `/consulting/courses`
- [ ] Page loads without errors
- [ ] Filter card is visible
- [ ] Search input present
- [ ] Industry dropdown present (with "All" option)
- [ ] If courses exist, they display in grid
- [ ] If no courses, shows "No courses found"

### Filter Courses
- [ ] Enter text in search box
- [ ] Results filter in real-time
- [ ] Select an industry from dropdown
- [ ] Results filter to that industry
- [ ] Clear filters works

### Course Registration
- [ ] Create a course as mentor (or use existing)
- [ ] Login as different user (or use incognito)
- [ ] Browse courses
- [ ] Find the course
- [ ] Course card shows:
  - [ ] Mentor name
  - [ ] Mentor avatar (if available)
  - [ ] All course details
  - [ ] "Register Now" button
- [ ] Click "Register Now"
- [ ] Dialog opens with course details
- [ ] Review all information
- [ ] Click "Confirm Registration"
- [ ] Success toast appears
- [ ] Dialog closes

### Full Course Indicator
- [ ] Register max number of participants
- [ ] View course as new user
- [ ] Button shows "Course Full"
- [ ] Button is disabled

## 🤝 Networking Testing

### Discover People
- [ ] Navigate to `/consulting/network/discover`
- [ ] Page loads without errors
- [ ] Filter card visible with:
  - [ ] Search input
  - [ ] Industry dropdown
  - [ ] Min years of experience input
- [ ] Profiles display in grid (if any exist)
- [ ] Each profile card shows:
  - [ ] Avatar (or fallback)
  - [ ] Full name
  - [ ] Current position
  - [ ] Bio (truncated)
  - [ ] Years of experience
  - [ ] Industry badge
  - [ ] Skills (first 3)
  - [ ] Social links (if available)
  - [ ] "Connect" button

### Filter People
- [ ] Enter text in search
- [ ] Results filter by name/bio/skills
- [ ] Select industry
- [ ] Results filter to that industry
- [ ] Set min years of experience
- [ ] Results filter accordingly
- [ ] Clear filters works

### Send Connection Request
- [ ] Create profile for second test user
- [ ] From first user, click "Connect" on second user's profile
- [ ] Success toast appears
- [ ] Button shows "Connection request sent" (or remains "Connect")

### Manage Connections
- [ ] Login as second user (received connection request)
- [ ] Navigate to `/consulting/network/connections`
- [ ] Page loads
- [ ] Two tabs: "Connections" and "Pending"
- [ ] Click "Pending" tab
- [ ] Connection request appears
- [ ] Shows sender's email
- [ ] Shows message (if provided)
- [ ] "Accept" button visible
- [ ] "Reject" button visible

### Accept Connection
- [ ] Click "Accept" button
- [ ] Success toast appears
- [ ] Request moves to "Connections" tab
- [ ] Shows "Connected" badge
- [ ] "Message" button visible

### Reject Connection
- [ ] Send another connection request
- [ ] As recipient, click "Reject"
- [ ] Request disappears
- [ ] Success toast appears

## 💬 Messaging Testing

### View Conversations
- [ ] Navigate to `/consulting/network/messages`
- [ ] Page loads
- [ ] Two-column layout
- [ ] Left: Conversations list
- [ ] Right: Chat interface
- [ ] If no conversations: shows "No conversations yet"

### Start Conversation
- [ ] Have at least one accepted connection
- [ ] Go to Connections page
- [ ] Click "Message" button on a connection
- [ ] Redirects to messages page with that user selected
- [ ] OR: Navigate to messages and select conversation

### Send Message
- [ ] Select a conversation
- [ ] Message input visible at bottom
- [ ] Type a message
- [ ] Click send button (or press Enter)
- [ ] Message appears in chat
- [ ] Message shows on right side (own messages)
- [ ] Timestamp visible

### Receive Message
- [ ] Login as other user
- [ ] Navigate to messages
- [ ] See the conversation in list
- [ ] Click on it
- [ ] Message appears on left side
- [ ] Timestamp visible

### Conversation Flow
- [ ] Send multiple messages back and forth
- [ ] Messages appear in correct order
- [ ] Scroll works
- [ ] Auto-scrolls to bottom on new message
- [ ] Can switch between conversations
- [ ] Message history persists

## 🧭 Navigation Testing

### Sidebar Menu
- [ ] "Consulting & Network" menu item visible
- [ ] GraduationCap icon displays
- [ ] Click navigates to `/consulting`
- [ ] Active state highlights when on consulting pages
- [ ] Hover effect works

### Main Hub Navigation
- [ ] From `/consulting`, can navigate to:
  - [ ] Profile setup
  - [ ] Mentor dashboard
  - [ ] Browse courses
  - [ ] Discover people
  - [ ] Connections
  - [ ] Messages
- [ ] All navigation links work
- [ ] Back button works
- [ ] Browser navigation (back/forward) works

## 🎨 UI/UX Testing

### Responsive Design
- [ ] Desktop view (1920x1080)
  - [ ] All layouts look good
  - [ ] No overflow
  - [ ] Proper spacing
- [ ] Tablet view (768px)
  - [ ] Cards stack properly
  - [ ] Filters work
  - [ ] Navigation accessible
- [ ] Mobile view (375px)
  - [ ] Single column layout
  - [ ] Buttons accessible
  - [ ] Text readable
  - [ ] Sidebar works

### Visual Elements
- [ ] Gradient effects visible
- [ ] Hover states work on all interactive elements
- [ ] Loading states show when appropriate
- [ ] Success toasts appear and disappear
- [ ] Error toasts appear when errors occur
- [ ] Badges display with correct colors
- [ ] Icons render properly
- [ ] Avatars show (or fallback letters)
- [ ] Cards have proper shadows and borders
- [ ] Dialogs/modals center properly
- [ ] Tabs switch smoothly

### Accessibility
- [ ] Can navigate with keyboard
- [ ] Tab order is logical
- [ ] Focus states visible
- [ ] Labels on all inputs
- [ ] Alt text on images (if any)
- [ ] Proper heading hierarchy

## 🔒 Security Testing

### Authentication
- [ ] Cannot access pages when logged out
- [ ] Redirects to login when not authenticated
- [ ] Can access after login

### Authorization
- [ ] Non-mentors cannot create courses
- [ ] Can only delete own courses
- [ ] Can only view own course participants
- [ ] Cannot connect with self
- [ ] Can only message connected users (or anyone - check implementation)

### Data Validation
- [ ] Required fields show error if empty
- [ ] Email format validated
- [ ] URL format validated
- [ ] Number inputs only accept numbers
- [ ] Date picker only allows future dates
- [ ] Price cannot be negative

## 🐛 Error Handling

### Network Errors
- [ ] If API fails, error toast shows
- [ ] User-friendly error message
- [ ] Can retry action

### Invalid Data
- [ ] Form validation prevents submission
- [ ] Clear error messages
- [ ] Points to problematic field

### Empty States
- [ ] No courses: Shows helpful message
- [ ] No connections: Shows call-to-action
- [ ] No messages: Shows instruction
- [ ] No participants: Shows appropriate text

## ⚡ Performance Testing

- [ ] Pages load quickly (< 2 seconds)
- [ ] No console errors
- [ ] No console warnings (or expected ones only)
- [ ] Images load properly
- [ ] Smooth scrolling
- [ ] No lag when typing
- [ ] Filters respond instantly
- [ ] No memory leaks (check DevTools)

## 📊 Data Consistency

### After Course Registration
- [ ] Course participant count increases
- [ ] Registration appears in mentor's participants list
- [ ] Student can see their registration

### After Connection Accept
- [ ] Both users see each other in connections
- [ ] Can message each other
- [ ] Connection status is "accepted"

### After Message Send
- [ ] Sender sees message immediately
- [ ] Recipient sees message when they check
- [ ] Conversation appears in both users' lists

## 🚀 Final Checks

- [ ] All documentation files present:
  - [ ] CONSULTING_FEATURE_README.md
  - [ ] CONSULTING_FEATURE_VI.md
  - [ ] ARCHITECTURE_DIAGRAM.md
  - [ ] IMPLEMENTATION_SUMMARY.md
  - [ ] QUICK_START.md
  - [ ] This file (TESTING_CHECKLIST.md)
- [ ] Setup scripts present:
  - [ ] setup-consulting-feature.bat
  - [ ] setup-consulting-feature.sh
- [ ] No TypeScript errors
- [ ] No ESLint errors (or acceptable ones)
- [ ] Build succeeds: `npm run build`
- [ ] Production build runs: `npm start`

## 📝 Test Results

### Summary
- Total Tests: ~150
- Passed: ___
- Failed: ___
- Skipped: ___

### Issues Found
1. 
2. 
3. 

### Notes
- 
- 
- 

---

**Testing Date**: _______________
**Tested By**: _______________
**Environment**: Development / Production
**Status**: ✅ Passed / ❌ Failed / ⚠️ Needs Attention
