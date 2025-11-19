# Tính năng Tư vấn & Kết nối (Consulting & Connection)

## Tổng quan

Đây là một hệ thống hoàn chỉnh cho phép người dùng:
1. **Tư vấn với Mentor**: Mentor tạo khóa học, học viên đăng ký và tham gia
2. **Kết nối chuyên nghiệp**: Kết nối với các chuyên gia trong ngành, nhắn tin và mở rộng mạng lưới

## Tính năng chi tiết

### 1. Tư vấn với Mentor (Mentorship)

#### Dành cho Mentor (Người hướng dẫn):
- ✅ **Tạo hồ sơ chuyên nghiệp**: Upload CV, portfolio, thêm link LinkedIn, GitHub
- ✅ **Tạo khóa học**: 
  - Đặt tiêu đề và mô tả buổi hướng dẫn
  - Chọn số lượng người tham dự tối đa
  - Chọn thời gian và ngày diễn ra
  - Đặt giá cho khóa học
  - Upload portfolio riêng cho khóa học
  - Thêm tags để dễ tìm kiếm
- ✅ **Quản lý khóa học**:
  - Xem danh sách người đăng ký
  - Xem trạng thái thanh toán
  - Link Google Meet tự động tạo
  - Khi đến giờ, có thể bắt đầu meeting ngay
- ✅ **Dashboard**: Thống kê tổng số khóa học, học viên, doanh thu

#### Dành cho Học viên (Students):
- ✅ **Xem danh sách khóa học**: Tất cả khóa học đang mở đăng ký
- ✅ **Lọc khóa học**: 
  - Theo ngành nghề (Software, AI, Data Science, etc.)
  - Tìm kiếm theo tên khóa học, mentor
- ✅ **Đăng ký khóa học**:
  - Xem chi tiết: thời gian, giá, số người, portfolio mentor
  - Đăng ký nếu còn chỗ
  - Nhận link Google Meet khi đến giờ
- ✅ **Trạng thái hiển thị**:
  - Nếu đầy: Nút hiển thị "Course Full"
  - Nếu đã đóng đăng ký: "Registration Closed"

### 2. Kết nối chuyên nghiệp (Professional Network)

#### Tìm kiếm và kết nối:
- ✅ **Discover People** (Tìm kiếm người):
  - Lọc theo ngành nghề (Software Engineering, AI, Data Science, Cloud Computing, DevOps, Cybersecurity, Mobile/Web Development, UI/UX Design, Product Management)
  - Lọc theo số năm kinh nghiệm
  - Tìm kiếm theo tên, kỹ năng
- ✅ **Gửi lời mời kết nối**: 
  - Click "Connect" trên profile người muốn kết nối
  - Có thể kèm theo lời nhắn
- ✅ **Quản lý kết nối**:
  - Xem lời mời đang chờ (Pending)
  - Chấp nhận hoặc từ chối
  - Xem danh sách đã kết nối

#### Nhắn tin:
- ✅ **Direct Messages**: 
  - Nhắn tin trực tiếp với những người đã kết nối
  - Giao diện chat realtime
  - Lịch sử tin nhắn được lưu
  - Hiển thị trạng thái đã đọc

## Cấu trúc trang

### Trang chính
- `/consulting` - Trang tổng quan, chọn Mentorship hoặc Networking

### Mentorship
- `/consulting/profile` - Tạo/cập nhật hồ sơ chuyên nghiệp
- `/consulting/mentor` - Dashboard cho mentor (tạo và quản lý khóa học)
- `/consulting/courses` - Danh sách khóa học cho học viên

### Networking
- `/consulting/network/discover` - Tìm kiếm chuyên gia
- `/consulting/network/connections` - Quản lý kết nối
- `/consulting/network/messages` - Nhắn tin

## Cơ sở dữ liệu

### Bảng mới được tạo:
1. **userProfile** - Hồ sơ người dùng
2. **mentorCourse** - Khóa học của mentor
3. **courseRegistration** - Đăng ký khóa học
4. **connection** - Kết nối giữa người dùng
5. **message** - Tin nhắn
6. **post** - Bài viết (dự trữ cho tương lai)
7. **comment** - Bình luận (dự trữ cho tương lai)

## Tích hợp Google Meet

- ✅ Tự động tạo link Google Meet khi tạo khóa học
- ✅ Link hiển thị cho cả mentor và học viên đã đăng ký
- ✅ Có thể copy link hoặc mở trực tiếp
- 📝 **Lưu ý**: Hiện tại link được tạo ngẫu nhiên. Trong production nên tích hợp Google Calendar API để:
  - Tạo sự kiện trên calendar
  - Gửi lời mời tự động
  - Tạo link Google Meet chính thức

## Cài đặt

### Bước 1: Cài đặt dependencies
```bash
npm install date-fns @radix-ui/react-avatar
```

### Bước 2: Chạy migration database
```bash
npm run db:push
```

### Bước 3: Hoặc chạy script tự động (Windows)
```bash
setup-consulting-feature.bat
```

## Luồng sử dụng

### Đối với Mentor:
1. Truy cập `/consulting/profile` để tạo hồ sơ
2. Chọn "I want to become a mentor"
3. Vào `/consulting/mentor` để tạo khóa học
4. Khi đến giờ, bấm "Start Meeting" để mở Google Meet
5. Xem danh sách học viên đã đăng ký

### Đối với Học viên:
1. Tạo hồ sơ tại `/consulting/profile`
2. Vào `/consulting/courses` để xem khóa học
3. Lọc và tìm khóa học phù hợp
4. Đăng ký khóa học
5. Khi đến giờ, vào lại để lấy link Google Meet

### Đối với Networking:
1. Hoàn thiện hồ sơ tại `/consulting/profile`
2. Vào `/consulting/network/discover` để tìm người
3. Gửi lời mời kết nối
4. Người kia chấp nhận ở `/consulting/network/connections`
5. Nhắn tin tại `/consulting/network/messages`

## API Endpoints

Tất cả API nằm dưới `/api/consulting/`:

### Profile
- `POST /api/consulting/profile` - Tạo/cập nhật profile
- `GET /api/consulting/profile` - Lấy profile

### Mentor
- `GET /api/consulting/mentor/courses` - Lấy khóa học của mentor
- `POST /api/consulting/mentor/courses` - Tạo khóa học mới
- `DELETE /api/consulting/mentor/courses/[id]` - Xóa khóa học
- `GET /api/consulting/mentor/courses/[id]/participants` - Xem học viên

### Courses
- `GET /api/consulting/courses` - Danh sách khóa học
- `POST /api/consulting/courses/register` - Đăng ký khóa học

### Network
- `GET /api/consulting/network/discover` - Tìm người
- `POST /api/consulting/network/connect` - Gửi lời mời
- `GET /api/consulting/network/connections` - Danh sách kết nối
- `PATCH /api/consulting/network/connections/[id]` - Chấp nhận/từ chối

### Messages
- `GET /api/consulting/network/messages` - Lấy tin nhắn
- `POST /api/consulting/network/messages` - Gửi tin nhắn
- `GET /api/consulting/network/messages/conversations` - Danh sách cuộc trò chuyện

## Giao diện

### Components mới:
- ✅ Badge - Hiển thị tags và trạng thái
- ✅ Avatar - Ảnh đại diện người dùng
- ✅ Course cards - Thẻ khóa học
- ✅ Connection cards - Thẻ kết nối
- ✅ Message threads - Luồng tin nhắn

### Sidebar:
- ✅ Thêm menu "Consulting & Network" với icon GraduationCap

## Tính năng tương lai có thể mở rộng

- 💳 Tích hợp thanh toán (Stripe/PayPal)
- 📹 Ghi hình buổi học
- ⭐ Đánh giá và review khóa học
- 📱 Social networking posts và comments
- 🎓 Tạo chứng chỉ hoàn thành
- 📧 Email thông báo
- 💬 Realtime messaging với WebSocket
- 🔍 Tìm kiếm nâng cao
- 🤖 Hệ thống gợi ý khóa học/người kết nối
- 💼 Đăng tin tuyển dụng

## Công nghệ sử dụng

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Clerk
- **UI**: Radix UI + Tailwind CSS
- **Icons**: Lucide React
- **Date**: date-fns

## Lưu ý khi deploy production

1. ✅ Tích hợp Google Calendar API cho Google Meet
2. ✅ Thêm payment gateway (Stripe/PayPal)
3. ✅ Thêm email notifications
4. ✅ Implement realtime messaging (WebSocket)
5. ✅ Thêm image upload cho avatar và portfolio
6. ✅ Rate limiting cho API
7. ✅ Validation và security enhancements
8. ✅ Backup và recovery plan

## Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team phát triển.

---

**Tất cả hiển thị đều bằng tiếng Anh như yêu cầu** ✅
