# Consulting & Professional Network - Hướng dẫn sử dụng

## Tổng quan

Tính năng **Consulting & Network** là một mạng xã hội chuyên nghiệp được thiết kế giống LitMatch, cho phép người dùng:
- 🎯 Match với professionals cùng ngành nghề
- 📍 Tìm kiếm người cùng thành phố/khu vực
- 🎲 Match ngẫu nhiên để mở rộng network
- 📞 Gọi điện trực tiếp
- 💬 Nhắn tin trực tiếp
- 👨‍🏫 Trở thành mentor hoặc học viên

## Cấu trúc Project

```
src/
├── app/(features)/consulting/
│   ├── page.tsx                    # Main page - Full screen layout
│   ├── api/
│   │   ├── profile/route.ts        # API: User profile CRUD
│   │   ├── match/route.ts          # API: Matching & connections
│   │   └── users/route.ts          # API: Get users for matching
│   ├── mentor/                     # Mentor pages
│   ├── courses/                    # Course browsing
│   ├── network/                    # Network features
│   └── profile/                    # User profile management
│
├── components/ui/
│   ├── ProfileDropdown.tsx         # Profile dropdown (góc phải màn hình)
│   ├── MatchingCard.tsx            # Card hiển thị user để match
│   └── MatchModal.tsx              # Modal thông báo khi match thành công
│
└── db/
    └── schema.ts                   # Database schema (đã có sẵn)
```

## Database Schema

### UserProfile Table
```typescript
{
  id: number
  userEmail: string (unique)
  fullName: string
  currentPosition: string
  desiredPosition: string
  industry: string                  // Software, AI, Data Science, etc.
  yearsOfExperience: number
  location: string                  // NEW: Thành phố/khu vực
  cv: string                       // CV URL
  portfolio: string                // Portfolio URL
  bio: string
  skills: string[]                 // Array of skills
  linkedIn: string
  github: string
  avatar: string
  isMentor: boolean
}
```

### Connection Table
```typescript
{
  id: number
  fromUserEmail: string
  toUserEmail: string
  status: 'pending' | 'accepted' | 'rejected' | 'blocked'
  message: string
}
```

## Tính năng chính

### 1. Full Screen Layout
- Header cố định với logo và Profile Dropdown
- Tab navigation: Professional Network | Mentorship
- Layout tối ưu cho trải nghiệm toàn màn hình

### 2. Profile Dropdown (giống Google)
Vị trí: Góc phải màn hình
Tính năng:
- ✅ Hiển thị avatar và thông tin user
- ✅ Menu dropdown với animation mượt mà
- ✅ Links: My Profile, Edit Profile, My Courses, Settings
- ✅ Sign Out button

### 3. Professional Network (giống LitMatch)

#### Matching Modes:
1. **Same Industry** (Cùng ngành nghề)
   - Ưu tiên match người cùng industry
   - Match score dựa trên: industry (30%), common skills (20%), base (50%)

2. **Same Location** (Cùng thành phố)
   - Match với người ở cùng khu vực
   - Thuận tiện cho offline networking

3. **Random Match** (Ngẫu nhiên)
   - Random matching để khám phá connections mới
   - Mở rộng network đa dạng

#### Matching Actions:
- ❌ **Skip**: Bỏ qua profile này
- 📞 **Call**: Gửi yêu cầu gọi điện trực tiếp
- ❤️ **Like/Match**: Gửi connection request
- 💬 **Message**: Gửi tin nhắn trực tiếp

### 4. Match Modal
Khi cả 2 người đều like nhau:
- ✅ Hiển thị modal "It's a Match!" với animation đẹp
- ✅ Thông tin của người được match
- ✅ Options: Send Message hoặc Keep Swiping

## API Endpoints

### 1. GET `/api/consulting/users`
Lấy danh sách users để match

**Query Parameters:**
- `mode`: `industry` | `location` | `random`
- `limit`: number (default: 10)

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "...",
      "fullName": "...",
      "avatar": "...",
      "currentPosition": "...",
      "industry": "...",
      "location": "...",
      "yearsOfExperience": 5,
      "skills": ["React", "Node.js"],
      "bio": "...",
      "matchScore": 95
    }
  ]
}
```

### 2. POST `/api/consulting/match`
Tạo connection/match

**Body:**
```json
{
  "targetUserEmail": "user@example.com",
  "type": "like" | "call" | "message"
}
```

**Response:**
```json
{
  "success": true,
  "connection": {...},
  "isMatch": true,
  "message": "It's a match! 🎉"
}
```

### 3. GET/POST `/api/consulting/profile`
Quản lý user profile

## Migration Database

Để thêm trường `location` vào database:

```bash
# Chạy migration
npm run db:push
# hoặc
npx drizzle-kit push:pg
```

File migration: `db/migrations/0003_add_location_to_user_profile.sql`

## Cách sử dụng

### 1. Setup Profile
```typescript
// User cần setup profile trước khi sử dụng
POST /api/consulting/profile
{
  fullName: "Nguyen Van A",
  currentPosition: "Software Engineer",
  industry: "Software Engineering",
  location: "Ho Chi Minh City",
  yearsOfExperience: 5,
  skills: ["React", "Node.js", "TypeScript"],
  bio: "Passionate developer...",
  // ... other fields
}
```

### 2. Start Matching
1. Vào `/consulting`
2. Chọn tab "Professional Network"
3. Chọn matching mode: Same Industry / Same Location / Random
4. Swipe through profiles:
   - Skip: Nếu không quan tâm
   - Call: Nếu muốn gọi điện
   - Like: Nếu muốn connect
   - Message: Nếu muốn nhắn tin

### 3. View Matches
- Khi có mutual like → Modal "It's a Match!" xuất hiện
- Có thể send message ngay hoặc continue swiping

## Components Usage

### ProfileDropdown
```tsx
import ProfileDropdown from '@/components/ui/ProfileDropdown';

<ProfileDropdown />
```

### MatchingCard
```tsx
import MatchingCard from '@/components/ui/MatchingCard';

<MatchingCard
  user={userProfile}
  onMatch={(userId, type) => handleMatch(userId, type)}
  onSkip={(userId) => handleSkip(userId)}
/>
```

### MatchModal
```tsx
import MatchModal from '@/components/ui/MatchModal';

<MatchModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  matchedUser={matchedUserData}
/>
```

## Styling

Toàn bộ UI sử dụng:
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animations mượt mà
- **Gradient Colors**: Purple/Pink/Blue theme
- **Backdrop Blur**: Glass morphism effect
- **Dark Theme**: Tối ưu cho mắt

## Next Steps

### Tính năng cần phát triển thêm:
- [ ] Real-time chat với WebSocket
- [ ] Video call integration
- [ ] Location-based search với map
- [ ] Advanced filters (age, experience, skills)
- [ ] Notifications system
- [ ] Profile verification
- [ ] Report & block users
- [ ] Analytics dashboard

## Troubleshooting

### Lỗi: "User profile not found"
→ User chưa setup profile, redirect đến `/consulting/profile`

### Lỗi: "Failed to load users"
→ Check database connection và migrations

### Lỗi: "Unauthorized"
→ User chưa login, redirect đến sign-in page

## Performance Tips

1. **Lazy load images**: Sử dụng Next.js Image component
2. **Pagination**: Limit users per request
3. **Caching**: Cache user profiles locally
4. **Debounce**: Debounce API calls khi user swipe nhanh
5. **Optimize queries**: Add indexes cho industry, location fields

## Security

- ✅ Authentication với Clerk
- ✅ API route protection
- ✅ Input validation
- ✅ SQL injection prevention (Drizzle ORM)
- ⚠️ TODO: Rate limiting cho API calls
- ⚠️ TODO: Image upload validation

---

**Made with ❤️ for Professional Networking**
