# 🚀 Quick Start Guide - Consulting & Connection Feature

## Setup (5 minutes)

### Option 1: Automatic Setup (Recommended for Windows)
```bash
setup-consulting-feature.bat
```

### Option 2: Manual Setup
```bash
# Step 1: Install dependencies
npm install date-fns @radix-ui/react-avatar

# Step 2: Push database changes
npm run db:push

# Step 3: Start dev server
npm run dev
```

## First Time Use

### 1️⃣ Create Your Profile (2 minutes)
1. Navigate to `/consulting`
2. Click "Setup Profile"
3. Fill in your information:
   - Full Name
   - Industry (Software, AI, Data Science, etc.)
   - Years of Experience
   - Current Position
   - Skills (comma-separated)
   - Optional: LinkedIn, GitHub, Portfolio
4. Check "I want to become a mentor" if you want to teach
5. Click "Create Profile"

### 2️⃣ For Mentors: Create Your First Course (3 minutes)
1. Go to `/consulting/mentor`
2. Click "Create Course"
3. Fill in course details:
   - **Title**: e.g., "Introduction to React Development"
   - **Description**: What students will learn
   - **Industry**: Select from dropdown
   - **Max Participants**: e.g., 10
   - **Date & Time**: When it will happen
   - **Duration**: e.g., 60 minutes
   - **Price**: e.g., $50
   - **Portfolio**: (optional) Link to your work
   - **Tags**: e.g., "react, javascript, frontend"
4. Click "Create Course"
5. ✅ Course created with automatic Google Meet link!

### 3️⃣ For Students: Register for a Course (2 minutes)
1. Go to `/consulting/courses`
2. Browse available courses
3. Use filters:
   - Search by keyword
   - Filter by industry
4. Click on a course to see details
5. Click "Register Now"
6. Confirm registration
7. ✅ You're registered! Meeting link available at scheduled time

### 4️⃣ For Networking: Connect with Professionals (3 minutes)
1. Go to `/consulting/network/discover`
2. Filter people:
   - Select industry
   - Set minimum years of experience
   - Search by skills
3. Browse profiles
4. Click "Connect" on someone's profile
5. Wait for them to accept
6. Once accepted, go to `/consulting/network/messages`
7. Start chatting!

## Feature Walkthrough

### 🎓 Mentorship Features

#### As a Mentor:
```
Dashboard → View Stats → Create Course → Set Details → 
Google Meet Link Generated → Students Register → 
View Participants → At Scheduled Time → Start Meeting
```

**Key Actions:**
- View your revenue and student count
- See scheduled vs completed courses
- Delete courses if needed
- Copy/share meeting links
- View who registered

#### As a Student:
```
Browse Courses → Filter by Interest → View Details → 
Check Price & Schedule → Register → 
Wait for Scheduled Time → Get Meeting Link → Join
```

**Key Actions:**
- Search courses by keyword
- Filter by industry
- See if course is full
- View mentor portfolio
- Register instantly

### 🤝 Networking Features

```
Setup Profile → Discover People → Filter by Industry/Experience → 
View Profiles → Send Connection → Accept Requests → 
Message Connections
```

**Key Actions:**
- Find people in your industry
- Filter by experience level
- View skills and portfolios
- Send personalized connection requests
- Accept/reject requests
- Direct message your connections

## Tips & Tricks

### For Mentors 💡
1. **Complete your profile** with portfolio links to attract more students
2. **Set competitive pricing** - check what others are charging
3. **Add relevant tags** to make your course discoverable
4. **Schedule in advance** to give students time to register
5. **Check participants list** before the session starts
6. **Keep the meeting link handy** - copy it before starting

### For Students 💡
1. **Create a profile first** - required for registration
2. **Register early** - courses can fill up quickly
3. **Check the schedule** - note the time zone
4. **Review mentor portfolio** before registering
5. **Join a few minutes early** when the meeting link appears

### For Networking 💡
1. **Fill out your profile completely** - more connections!
2. **Add skills** - helps people find you
3. **Write a good bio** - first impression matters
4. **Be specific in connection requests** - personalize your message
5. **Respond promptly** to connection requests
6. **Stay active** in messaging

## Common Scenarios

### Scenario 1: I'm a mentor and want to create a weekly series
1. Create your first course
2. After it's completed, create another with next week's date
3. Students can see your past courses (builds credibility)
4. Consider offering a discount for returning students

### Scenario 2: I'm looking for a mentor in AI/ML
1. Go to Discover People
2. Filter: Industry = "AI & Machine Learning"
3. Set minimum experience (e.g., 5 years)
4. Browse profiles
5. Connect with potential mentors
6. Check if they have courses available

### Scenario 3: I want to network with my peers
1. Setup profile with your current level
2. Discover people in same industry
3. Filter by similar experience (±2 years)
4. Connect with several people
5. Start conversations about your field
6. Share knowledge and opportunities

## Troubleshooting

### Issue: Can't see meeting link
**Solution**: Meeting link appears closer to the scheduled time. Refresh the page.

### Issue: Course shows as "Full"
**Solution**: The course has reached max participants. Try another course or connect with the mentor directly.

### Issue: Connection request not going through
**Solution**: Make sure you have a complete profile. Try again or contact support.

### Issue: Messages not showing
**Solution**: You can only message people you're connected with. Send a connection request first.

### Issue: Can't create a course
**Solution**: Make sure you checked "I want to become a mentor" in your profile.

## Navigation Quick Reference

| Feature | URL | Purpose |
|---------|-----|---------|
| Main Hub | `/consulting` | Overview and choose path |
| Profile | `/consulting/profile` | Setup professional info |
| Mentor Dashboard | `/consulting/mentor` | Create & manage courses |
| Browse Courses | `/consulting/courses` | Find courses to join |
| Discover People | `/consulting/network/discover` | Find professionals |
| Connections | `/consulting/network/connections` | Manage connections |
| Messages | `/consulting/network/messages` | Chat with connections |

## Keyboard Shortcuts

- `Ctrl + K` (future): Quick search
- `Enter` in search: Submit search
- `Esc`: Close dialogs/modals

## Best Practices

### Creating Good Courses
✅ Clear, descriptive title
✅ Detailed description of what's covered
✅ Realistic time duration
✅ Fair pricing (research market rates)
✅ Portfolio link to showcase expertise
✅ Relevant tags for discoverability

### Building Your Network
✅ Complete profile with real information
✅ Professional bio
✅ Links to LinkedIn, GitHub, Portfolio
✅ List relevant skills
✅ Personalized connection messages
✅ Active engagement

### Professional Communication
✅ Be respectful
✅ Respond in a timely manner
✅ Clear and concise messages
✅ Professional language
✅ Share valuable insights

## Next Steps

After setup:
1. ✅ Create your profile
2. ✅ Decide: Mentor or Student or Both
3. ✅ If Mentor: Create your first course
4. ✅ If Student: Browse and register
5. ✅ Network: Connect with 3-5 people
6. ✅ Start messaging

## Need Help?

- 📖 Read **CONSULTING_FEATURE_README.md** for detailed documentation
- 🇻🇳 Read **CONSULTING_FEATURE_VI.md** for Vietnamese guide
- 🏗️ Check **ARCHITECTURE_DIAGRAM.md** for technical details
- 📝 Review **IMPLEMENTATION_SUMMARY.md** for complete feature list

## Support

For technical issues or questions:
- Check documentation files
- Review error messages
- Contact development team

---

**You're all set!** 🎉 Start using the Consulting & Connection features now!
