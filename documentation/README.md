# Use Case Diagram & Documentation

This folder contains a Use Case Diagram and overview documentation describing actors and use cases for the AI Interview project.

## Files

### Use Case Diagram
- `use-case-diagram.puml` — Sơ đồ Use Case tổng quan hệ thống

### Live Interview
- `activity-diagram-live-interview.puml` — Sơ đồ Activity cho Live Interview
- `sequence-diagram-live-interview.puml` — Sơ đồ Sequence cho Live Interview

### Mock Interview
- `activity-diagram-mock-interview.puml` — Sơ đồ Activity cho Mock Interview
- `sequence-diagram-mock-interview.puml` — Sơ đồ Sequence cho Mock Interview

### Quiz
- `activity-diagram-quiz.puml` — Sơ đồ Activity cho Quiz
- `sequence-diagram-quiz.puml` — Sơ đồ Sequence cho Quiz

### Find Job
- `activity-diagram-find-job.puml` — Sơ đồ Activity cho Find Job
- `sequence-diagram-find-job.puml` — Sơ đồ Sequence cho Find Job

### Summarize
- `activity-diagram-summarize.puml` — Sơ đồ Activity cho Summarize
- `sequence-diagram-summarize.puml` — Sơ đồ Sequence cho Summarize

### Support CV
- `activity-diagram-support-cv.puml` — Sơ đồ Activity cho Support CV
- `sequence-diagram-support-cv.puml` — Sơ đồ Sequence cho Support CV

### Prepare Hub
- `activity-diagram-prepare-hub.puml` — Sơ đồ Activity cho Prepare Hub
- `sequence-diagram-prepare-hub.puml` — Sơ đồ Sequence cho Prepare Hub

---

# BẢNG ĐẶC TẢ USE CASE

> **Hướng dẫn copy vào Word**: Chọn toàn bộ bảng markdown → Copy → Paste vào Word → Word sẽ tự động chuyển thành bảng. Hoặc dùng công cụ online như [Tables Generator](https://www.tablesgenerator.com/markdown_tables) để convert sang Word format.

---

## UC001 - Live Interview

| Thuộc tính | Mô tả |
|------------|-------|
| Tên use case | UC001 - Live Interview |
| Mô tả sơ lược | Người dùng sử dụng tính năng Live Interview để chia sẻ màn hình phỏng vấn thực tế, hệ thống sẽ lắng nghe và chuyển đổi giọng nói thành text, sau đó AI sẽ hỗ trợ trả lời các câu hỏi phỏng vấn |
| Actor chính | Người dùng đã đăng nhập |
| Actor phụ | Dịch vụ Transcription (Deepgram), AI Backend |
| Tiền điều kiện | 1. Người dùng đã đăng nhập vào hệ thống. 2. Người dùng có thiết bị hỗ trợ chia sẻ màn hình và microphone |
| Hậu điều kiện | Người dùng nhận được câu trả lời hỗ trợ từ AI cho các câu hỏi phỏng vấn |

### Luồng sự kiện chính (Main flow)

| STT | Actor | System |
|-----|-------|--------|
| 1 | Người dùng chọn "Live Interview" trên menu |  |
| 2 |  | Hệ thống hiển thị giao diện Live Interview |
| 3 | Người dùng nhấn nút "Start" |  |
| 4 |  | Hệ thống yêu cầu quyền truy cập màn hình và microphone |
| 5 | Người dùng cấp quyền và chọn tab/cửa sổ để chia sẻ |  |
| 6 |  | Hệ thống hiển thị màn hình đang được chia sẻ |
| 7 |  | Hệ thống bắt đầu lắng nghe và chuyển giọng nói thành text |
| 8 |  | Hệ thống hiển thị transcript lên giao diện |
| 9 | Người dùng chọn AI Response Mode (Auto/Manual) |  |
| 10 | [Auto Mode] |  Hệ thống tự động nhận diện câu hỏi và gửi đến AI |
| 11 | [Manual Mode] Người dùng tô đậm phần text muốn hỏi |  |
| 12 | Người dùng nhấn nút "Ask AI" |  |
| 13 |  | Hệ thống gửi câu hỏi đến AI Backend |
| 14 |  | Hệ thống nhận và hiển thị câu trả lời từ AI |
| 15 | Người dùng có thể tiếp tục hỏi hoặc nhấn "Stop" |  |
| 16 | Người dùng nhấn nút "Stop" |  |
| 17 |  | Hệ thống dừng recording và đóng kết nối |
| 18 |  | Hệ thống thông báo "Transcription ended" |

### Luồng sự kiện thay thế (Alternate flow)

| STT | Điều kiện | Hành động |
|-----|-----------|-----------|
| 4a | Người dùng từ chối quyền truy cập | Hệ thống hiển thị thông báo lỗi và yêu cầu cấp quyền. Quay lại bước 3 |
| 7a | Kết nối WebSocket bị lỗi | Hệ thống hiển thị thông báo lỗi. Thử kết nối lại hoặc yêu cầu người dùng khởi động lại |
| 13a | AI Backend không phản hồi | Hệ thống hiển thị thông báo lỗi. Người dùng có thể thử lại hoặc tiếp tục với câu hỏi khác |

---

## UC002 - Mock Interview

| Thuộc tính | Mô tả |
|------------|-------|
| Tên use case | UC002 - Mock Interview |
| Mô tả sơ lược | Người dùng thực hiện phỏng vấn giả lập với AI. Hệ thống sẽ đặt câu hỏi phỏng vấn, ghi nhận câu trả lời của người dùng và đánh giá kết quả cuối cùng |
| Actor chính | Người dùng đã đăng nhập |
| Actor phụ | AI Backend, Speech Synthesis Service, D-ID Avatar Service |
| Tiền điều kiện | 1. Người dùng đã đăng nhập vào hệ thống. 2. Người dùng đã tạo bộ câu hỏi phỏng vấn từ Prepare Hub |
| Hậu điều kiện | Người dùng nhận được báo cáo đánh giá chi tiết về buổi phỏng vấn |

### Luồng sự kiện chính (Main flow)

| STT | Actor | System |
|-----|-------|--------|
| 1 | Người dùng chọn "Mock Interview" trên menu |  |
| 2 |  | Hệ thống hiển thị giao diện Mock Interview với Modal chọn Interview Set |
| 3 | Người dùng chọn một Interview Set đã tạo từ Prepare Hub |  |
| 4 |  | Hệ thống tải danh sách câu hỏi và thông tin người phỏng vấn ảo |
| 5 | Người dùng nhấn nút "Start Interview" |  |
| 6 |  | Hệ thống bật camera (nếu được phép) và bắt đầu đếm thời gian |
| 7 |  | Hệ thống hiển thị avatar AI và đọc câu hỏi đầu tiên bằng giọng nói |
| 8 | Người dùng trả lời câu hỏi bằng giọng nói hoặc nhập text |  |
| 9 |  | Hệ thống ghi nhận câu trả lời và hiển thị trong transcript |
| 10 |  | Hệ thống đọc câu chuyển tiếp và câu hỏi tiếp theo |
| 11 | Người dùng tiếp tục trả lời các câu hỏi còn lại |  |
| 12 |  | Khi hết câu hỏi, hệ thống đọc lời kết thúc phỏng vấn |
| 13 |  | Hệ thống gọi API đánh giá phỏng vấn |
| 14 |  | Hệ thống chuyển đến trang Assessment Report |
| 15 |  | Hệ thống hiển thị kết quả đánh giá chi tiết |

### Luồng sự kiện thay thế (Alternate flow)

| STT | Điều kiện | Hành động |
|-----|-----------|-----------|
| 5a | Người dùng từ chối quyền camera | Hệ thống tiếp tục phỏng vấn không có camera |
| 8a | Microphone không hoạt động | Người dùng có thể nhập câu trả lời bằng text |
| 11a | Người dùng nhấn "Leave Interview" | Hệ thống dừng phỏng vấn, gọi API đánh giá và chuyển đến Assessment Report |
| 7a | Speech Synthesis không hoạt động | Hệ thống hiển thị text câu hỏi thay vì đọc |

---

## UC003 - Quiz (Đánh giá kỹ năng)

| Thuộc tính | Mô tả |
|------------|-------|
| Tên use case | UC003 - Quiz |
| Mô tả sơ lược | Người dùng làm bài quiz đánh giá kỹ năng dựa trên CV và ngành nghề. Hệ thống tạo câu hỏi phù hợp với trình độ và đưa ra phản hồi chi tiết |
| Actor chính | Người dùng đã đăng nhập |
| Actor phụ | AI Backend (Gemini API) |
| Tiền điều kiện | Người dùng đã đăng nhập vào hệ thống |
| Hậu điều kiện | Người dùng nhận được kết quả đánh giá với điểm số, phân tích chi tiết và tài liệu học tập gợi ý |

### Luồng sự kiện chính (Main flow)

| STT | Actor | System |
|-----|-------|--------|
| 1 | Người dùng chọn "Quiz" trên menu |  |
| 2 |  | Hệ thống hiển thị giao diện Quiz với bước Upload CV |
| 3 | Người dùng tải lên CV (hoặc bỏ qua) |  |
| 4 |  | Hệ thống phân tích CV và gợi ý ngành nghề phù hợp |
| 5 | Người dùng chọn ngành nghề (Field) |  |
| 6 |  | Hệ thống hiển thị danh sách ngành nghề |
| 7 | Người dùng chọn cấp bậc (Intern/Fresher/Junior/Middle/Senior) |  |
| 8 |  | Hệ thống hiển thị các cấp độ khó |
| 9 | Người dùng chọn độ khó (Easy/Medium/Hard/Expert) |  |
| 10 |  | Hệ thống hiển thị tùy chọn số lượng câu hỏi |
| 11 | Người dùng chọn số câu hỏi (5/10/15/20) |  |
| 12 |  | Hệ thống gọi AI tạo câu hỏi phù hợp |
| 13 |  | Hệ thống hiển thị câu hỏi đầu tiên |
| 14 | Người dùng chọn đáp án |  |
| 15 |  | Hệ thống ghi nhận và chuyển câu hỏi tiếp theo |
| 16 | Người dùng hoàn thành tất cả câu hỏi |  |
| 17 |  | Hệ thống tính điểm và gọi AI tạo feedback chi tiết |
| 18 |  | Hệ thống hiển thị kết quả với điểm số, phân tích từng câu, và tài liệu học tập gợi ý |

### Luồng sự kiện thay thế (Alternate flow)

| STT | Điều kiện | Hành động |
|-----|-----------|-----------|
| 3a | Người dùng bỏ qua upload CV | Hệ thống cho phép chọn ngành nghề thủ công |
| 12a | AI không thể tạo câu hỏi | Hệ thống hiển thị thông báo lỗi và cho phép thử lại |
| 14a | Hết thời gian làm câu hỏi | Hệ thống tự động chuyển sang câu tiếp theo |

---

## UC004 - Find Job (Tìm việc làm)

| Thuộc tính | Mô tả |
|------------|-------|
| Tên use case | UC004 - Find Job |
| Mô tả sơ lược | Người dùng tìm kiếm việc làm phù hợp dựa trên CV và sở thích. Hệ thống phân tích CV, gợi ý ngành nghề và tạo link tìm việc trên các nền tảng tuyển dụng |
| Actor chính | Người dùng đã đăng nhập |
| Actor phụ | AI Backend, Job Platform APIs |
| Tiền điều kiện | Người dùng đã đăng nhập vào hệ thống |
| Hậu điều kiện | Người dùng nhận được danh sách công việc phù hợp với link đến các trang tuyển dụng |

### Luồng sự kiện chính (Main flow)

| STT | Actor | System |
|-----|-------|--------|
| 1 | Người dùng chọn "Find Job" trên menu |  |
| 2 |  | Hệ thống hiển thị giao diện Find Job với bước Upload CV |
| 3 | Người dùng tải lên CV |  |
| 4 |  | Hệ thống phân tích CV và trích xuất thông tin (kỹ năng, kinh nghiệm, vị trí) |
| 5 |  | Hệ thống tự động nhận diện vị trí địa lý từ CV |
| 6 |  | Hệ thống hiển thị danh sách ngành nghề gợi ý |
| 7 | Người dùng chọn ngành nghề mong muốn |  |
| 8 |  | Hệ thống hiển thị các cấp bậc công việc |
| 9 | Người dùng chọn cấp bậc (Intern/Fresher/Junior/Middle/Senior/Lead) |  |
| 10 |  | Hệ thống hiển thị form tùy chọn Job Preferences |
| 11 | Người dùng nhập sở thích (remote/hybrid, mức lương, địa điểm) |  |
| 12 |  | Hệ thống tạo từ khóa tìm kiếm phù hợp |
| 13 |  | Hệ thống hiển thị Market Insights (xu hướng thị trường) |
| 14 |  | Hệ thống tạo link tìm việc đến các nền tảng (LinkedIn, VietnamWorks, TopCV, ITviec...) |
| 15 | Người dùng nhấn vào link để xem việc làm |  |
| 16 |  | Hệ thống mở trang tuyển dụng với từ khóa và địa điểm đã được điền sẵn |

### Luồng sự kiện thay thế (Alternate flow)

| STT | Điều kiện | Hành động |
|-----|-----------|-----------|
| 4a | Không thể phân tích CV | Hệ thống hiển thị lỗi và yêu cầu upload lại |
| 5a | Không nhận diện được vị trí | Người dùng nhập địa điểm thủ công trong bước Preferences |
| 11a | Người dùng muốn xem Market Insights | Hệ thống hiển thị thông tin xu hướng lương, nhu cầu tuyển dụng |

---

## UC005 - Summarize (Phân tích CV chuyên sâu)

| Thuộc tính | Mô tả |
|------------|-------|
| Tên use case | UC005 - Summarize |
| Mô tả sơ lược | Người dùng tải lên CV để nhận phân tích chuyên sâu từ AI. Hệ thống đánh giá điểm CV, phân tích kỹ năng, gợi ý nghề nghiệp và lộ trình cải thiện |
| Actor chính | Người dùng đã đăng nhập |
| Actor phụ | AI Backend (Gemini API) |
| Tiền điều kiện | Người dùng đã đăng nhập vào hệ thống |
| Hậu điều kiện | Người dùng nhận được báo cáo phân tích CV chi tiết với điểm số và gợi ý cải thiện |

### Luồng sự kiện chính (Main flow)

| STT | Actor | System |
|-----|-------|--------|
| 1 | Người dùng chọn "Summarize" trên menu |  |
| 2 |  | Hệ thống hiển thị giao diện Summarize với khu vực upload file |
| 3 | Người dùng chọn ngôn ngữ phân tích (VI/EN/JA/ZH/KO) |  |
| 4 | Người dùng tải lên file CV (PDF/DOCX/TXT) hoặc file audio |  |
| 5 |  | Hệ thống hiển thị file đã upload |
| 6 | Người dùng nhấn nút "Phân tích CV" |  |
| 7 |  | Hệ thống gửi file đến AI Backend để phân tích |
| 8 |  | Hệ thống hiển thị loading "Đang phân tích CV..." |
| 9 |  | Hệ thống nhận kết quả phân tích từ AI |
| 10 |  | Hệ thống hiển thị điểm CV tổng thể (0-100) |
| 11 |  | Hệ thống hiển thị tóm tắt tổng quan |
| 12 |  | Hệ thống hiển thị phân tích kỹ năng (Technical, Soft Skills, Languages, Tools) |
| 13 |  | Hệ thống hiển thị các điểm chính và điểm yếu cần cải thiện |
| 14 |  | Hệ thống hiển thị gợi ý nghề nghiệp phù hợp |
| 15 |  | Hệ thống hiển thị các việc cần làm để cải thiện CV |

### Luồng sự kiện thay thế (Alternate flow)

| STT | Điều kiện | Hành động |
|-----|-----------|-----------|
| 4a | File không đúng định dạng | Hệ thống hiển thị thông báo lỗi định dạng |
| 7a | AI Backend bị quá tải (rate limit) | Hệ thống hiển thị thông báo và yêu cầu thử lại sau |
| 9a | Không thể phân tích nội dung | Hệ thống hiển thị thông báo lỗi và gợi ý upload file khác |

---

## UC006 - Support CV (Quản lý và Tối ưu CV)

| Thuộc tính | Mô tả |
|------------|-------|
| Tên use case | UC006 - Support CV |
| Mô tả sơ lược | Người dùng upload CV để được AI review, tự động chỉnh sửa và xuất ra file CV mới đã được tối ưu hóa |
| Actor chính | Người dùng đã đăng nhập |
| Actor phụ | AI Backend (Editor Service) |
| Tiền điều kiện | Người dùng đã đăng nhập vào hệ thống |
| Hậu điều kiện | Người dùng có CV đã được tối ưu hóa và có thể xuất ra file PDF/DOCX |

### Luồng sự kiện chính (Main flow)

| STT | Actor | System |
|-----|-------|--------|
| 1 | Người dùng chọn "Support CV" trên menu |  |
| 2 |  | Hệ thống hiển thị trang Landing của Support CV |
| 3 | Người dùng tải lên file CV (PDF/DOCX) |  |
| 4 |  | Hệ thống parse CV và trích xuất thông tin (Personal Info, Experiences, Education, Skills, Projects) |
| 5 |  | Hệ thống gọi AI để review CV |
| 6 |  | Hệ thống hiển thị Review Panel với điểm số (Overall, ATS, Impact, Clarity) |
| 7 |  | Hệ thống hiển thị Strengths và Weaknesses |
| 8 | Người dùng xem review và nhấn "Auto Edit" |  |
| 9 |  | Hệ thống hiển thị dialog loading với tiến trình |
| 10 |  | AI tự động chỉnh sửa các phần cần cải thiện |
| 11 |  | Hệ thống hiển thị Comparison View (Before/After) |
| 12 | Người dùng xem và chấp nhận/từ chối từng thay đổi |  |
| 13 | Người dùng nhấn "Apply Changes" |  |
| 14 |  | Hệ thống áp dụng các thay đổi đã chấp nhận |
| 15 |  | Hệ thống chuyển sang bước Editor để chỉnh sửa thủ công |
| 16 | Người dùng chỉnh sửa thêm nếu cần |  |
| 17 | Người dùng chọn template CV |  |
| 18 |  | Hệ thống hiển thị Preview CV với template đã chọn |
| 19 | Người dùng nhấn "Export" |  |
| 20 |  | Hệ thống xuất file CV (PDF/DOCX) |

### Luồng sự kiện thay thế (Alternate flow)

| STT | Điều kiện | Hành động |
|-----|-----------|-----------|
| 4a | Không thể parse CV | Hệ thống hiển thị form nhập thông tin thủ công |
| 5a | AI review không thành công | Hệ thống tạo review mặc định với điểm cơ bản |
| 10a | Auto Edit thất bại | Hệ thống thông báo lỗi và cho phép chỉnh sửa thủ công |
| 12a | Người dùng từ chối tất cả thay đổi | Hệ thống giữ nguyên CV gốc và chuyển sang Editor |

---

## UC007 - Prepare Hub (Chuẩn bị phỏng vấn)

| Thuộc tính | Mô tả |
|------------|-------|
| Tên use case | UC007 - Prepare Hub |
| Mô tả sơ lược | Người dùng tạo bộ câu hỏi phỏng vấn dựa trên CV và Job Description. Hệ thống AI sẽ sinh ra các câu hỏi và câu trả lời mẫu phù hợp |
| Actor chính | Người dùng đã đăng nhập |
| Actor phụ | AI Backend |
| Tiền điều kiện | 1. Người dùng đã đăng nhập vào hệ thống. 2. Người dùng đã upload ít nhất một CV trong hệ thống |
| Hậu điều kiện | Người dùng có bộ câu hỏi phỏng vấn để sử dụng trong Mock Interview |

### Luồng sự kiện chính (Main flow)

| STT | Actor | System |
|-----|-------|--------|
| 1 | Người dùng chọn "Prepare Hub" trên menu |  |
| 2 |  | Hệ thống hiển thị danh sách Interview Sets đã tạo (nếu có) |
| 3 | Người dùng nhấn nút "Prepare Interview" |  |
| 4 |  | Hệ thống hiển thị Dialog tạo Interview Set mới |
| 5 |  | Hệ thống load danh sách CV của người dùng |
| 6 | Người dùng chọn CV muốn sử dụng |  |
| 7 | Người dùng nhập thông tin công ty (Company Name) |  |
| 8 | Người dùng nhập vị trí ứng tuyển (Position) |  |
| 9 | Người dùng nhập Job Description |  |
| 10 | Người dùng chọn ngôn ngữ phỏng vấn |  |
| 11 | Người dùng nhấn "Save" |  |
| 12 |  | Hệ thống gửi thông tin đến AI Backend |
| 13 |  | AI sinh ra bộ câu hỏi và câu trả lời mẫu |
| 14 |  | Hệ thống lưu Interview Set vào database |
| 15 |  | Hệ thống hiển thị thông báo thành công |
| 16 |  | Hệ thống cập nhật danh sách Interview Sets |
| 17 | Người dùng có thể xem, chỉnh sửa hoặc xóa Interview Set |  |
| 18 | Người dùng nhấn "Start Mock Interview" trên một Interview Set |  |
| 19 |  | Hệ thống chuyển đến trang Mock Interview với Interview Set đã chọn |

### Luồng sự kiện thay thế (Alternate flow)

| STT | Điều kiện | Hành động |
|-----|-----------|-----------|
| 5a | Người dùng chưa có CV nào | Hệ thống hiển thị thông báo và link đến trang Upload CV |
| 12a | AI không thể sinh câu hỏi | Hệ thống hiển thị thông báo lỗi và yêu cầu thử lại |
| 17a | Người dùng xóa Interview Set | Hệ thống xác nhận và xóa Interview Set |

---

## Sơ đồ Activity - Live Interview

Sơ đồ activity mô tả luồng hoạt động của tính năng Live Interview với 2 swimlane: **User** và **System**.

Xem file: `activity-diagram-live-interview.puml`

---

## Sơ đồ Sequence - Live Interview

Sơ đồ sequence mô tả luồng tương tác giữa các thành phần: Người dùng, Giao diện, Deepgram, AI Backend.

Xem file: `sequence-diagram-live-interview.puml`

---

## Sơ đồ Activity - Mock Interview

Sơ đồ activity mô tả luồng phỏng vấn giả lập với AI, từ chọn Interview Set đến nhận đánh giá.

Xem file: `activity-diagram-mock-interview.puml`

---

## Sơ đồ Sequence - Mock Interview

Sơ đồ sequence mô tả tương tác giữa: Người dùng, UI, Speech Services, D-ID Avatar, API Backend.

Xem file: `sequence-diagram-mock-interview.puml`

---

## Sơ đồ Activity - Quiz

Sơ đồ activity mô tả luồng làm quiz đánh giá kỹ năng, từ upload CV đến nhận feedback.

Xem file: `activity-diagram-quiz.puml`

---

## Sơ đồ Sequence - Quiz

Sơ đồ sequence mô tả tương tác giữa: Người dùng, UI, CV Analysis, Question Service, Feedback Service, AI.

Xem file: `sequence-diagram-quiz.puml`

---

## Sơ đồ Activity - Find Job

Sơ đồ activity mô tả luồng tìm việc làm dựa trên CV và sở thích.

Xem file: `activity-diagram-find-job.puml`

---

## Sơ đồ Sequence - Find Job

Sơ đồ sequence mô tả tương tác giữa: Người dùng, UI, CV Analyzer, Job Platforms, Market Insights.

Xem file: `sequence-diagram-find-job.puml`

---

## Sơ đồ Activity - Summarize

Sơ đồ activity mô tả luồng phân tích CV chuyên sâu với AI.

Xem file: `activity-diagram-summarize.puml`

---

## Sơ đồ Sequence - Summarize

Sơ đồ sequence mô tả tương tác giữa: Người dùng, UI, Summary Service, File Parser, Gemini AI.

Xem file: `sequence-diagram-summarize.puml`

---

## Sơ đồ Activity - Support CV

Sơ đồ activity mô tả luồng quản lý và tối ưu CV với AI auto-edit.

Xem file: `activity-diagram-support-cv.puml`

---

## Sơ đồ Sequence - Support CV

Sơ đồ sequence mô tả tương tác giữa: Người dùng, UI, Parser, Review, Editor, Export Services.

Xem file: `sequence-diagram-support-cv.puml`

---

## Sơ đồ Activity - Prepare Hub

Sơ đồ activity mô tả luồng tạo bộ câu hỏi phỏng vấn từ CV và Job Description.

Xem file: `activity-diagram-prepare-hub.puml`

---

## Sơ đồ Sequence - Prepare Hub

Sơ đồ sequence mô tả tương tác giữa: Người dùng, UI, API Prepare Hub, API Resume, AI, Database.

Xem file: `sequence-diagram-prepare-hub.puml`

---

## Actors & Roles

- **Guest / Visitor**
  - Browse features and public pages
  - Sign up / Sign in
  - View voice samples

- **Registered User**
  - Upload and manage resume (support-cv)
  - Optimize resume (AI-powered)
  - Start mock interview (AI simulation)
  - Start live interview
  - Use Prepare Hub (prepare interview context based on resume & job)
  - Take quizzes and test features
  - Book consulting and networking services
  - Generate and view assessment reports
  - Find jobs (job matching)
  - Give ratings and reviews
  - Use voice settings or TTS

- **Admin**
  - Manage users
  - Manage ratings and reviews
  - View reports and analytics

- **AI Service / Backend** (external system)
  - Provides AI operations: resume optimization, interview simulation, summarization, assessment report generation, and job matching/tagging

---

## How to render

1. Install PlantUML extension in Visual Studio Code: `PlantUML` (by jebbs), or use the PlantUML CLI.

2. Open `.puml` files and preview with PlantUML extension (right-click -> `Preview PlantUML`) or render from CLI.

CLI example (Windows):

```cmd
REM Render tất cả sơ đồ
plantuml documentation/*.puml

REM Hoặc render từng file
plantuml documentation/use-case-diagram.puml
plantuml documentation/activity-diagram-live-interview.puml
plantuml documentation/sequence-diagram-live-interview.puml
plantuml documentation/activity-diagram-mock-interview.puml
plantuml documentation/sequence-diagram-mock-interview.puml
plantuml documentation/activity-diagram-quiz.puml
plantuml documentation/sequence-diagram-quiz.puml
plantuml documentation/activity-diagram-find-job.puml
plantuml documentation/sequence-diagram-find-job.puml
plantuml documentation/activity-diagram-summarize.puml
plantuml documentation/sequence-diagram-summarize.puml
plantuml documentation/activity-diagram-support-cv.puml
plantuml documentation/sequence-diagram-support-cv.puml
plantuml documentation/activity-diagram-prepare-hub.puml
plantuml documentation/sequence-diagram-prepare-hub.puml
```

---

## Hướng dẫn Copy Bảng vào Word

### Cách 1: Copy trực tiếp
1. Chọn toàn bộ bảng markdown (từ header đến hết)
2. Copy (Ctrl+C)
3. Paste vào Word (Ctrl+V)
4. Word sẽ tự động nhận dạng và tạo bảng

### Cách 2: Sử dụng công cụ online
1. Truy cập [Tables Generator](https://www.tablesgenerator.com/markdown_tables)
2. Chọn "File" → "Paste table data"
3. Paste nội dung bảng
4. Chọn "Generate" → Copy sang Word

### Cách 3: Convert Markdown to Word
1. Cài đặt Pandoc: https://pandoc.org/
2. Chạy lệnh:
```cmd
pandoc README.md -o UseCase_Documentation.docx
```

---

## Notes
- Use cases were derived from the feature pages under `src/app/(features)` such as: `mock-interview`, `live-interview`, `prepare-hub`, `support-cv`, `quiz`, `find-job`, `summarize`, and the `ratings` API.
- The diagram groups features into logical areas: **Resume & CV**, **Interview**, **Learning & Testing**, **Community & Support**, and **Admin**.
- Some features use external AI services; those are represented as a separate actor.
