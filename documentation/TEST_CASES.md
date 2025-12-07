

## 4.2 Testcase Đăng nhập

| STT | Thông tin | Chi tiết |
|-----|-----------|----------|
| 1 | TestcaseID | TCDN |
| 2 | Mức độ ưu tiên Testcase | Rất cao |
| 3 | Người thiết kế Testcase | Trần Tuấn Anh |
| 4 | Ngày thiết kế Testcase | 04/12/2024 |
| 5 | Người thực hiện Test | Trần Tuấn Anh |
| 6 | Ngày thực hiện Test | 04/12/2024 |
| 7 | Tên Testcase | Đăng nhập tài khoản |
| 8 | Mô tả | Người dùng thực hiện đăng nhập vào hệ thống với email và mật khẩu đã đăng ký. Hệ thống sử dụng Clerk Authentication. |
| 9 | Tiền điều kiện | Người dùng đã có tài khoản và truy cập vào trang đăng nhập. |
| 10 | Các bước thực hiện | Xem bảng chi tiết bên dưới |

### Các bước thực hiện - Đăng nhập

| STT | Bước thực hiện | Dữ liệu Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái (Pass/Fail) |
|-----|----------------|--------------|------------------|-----------------|------------------------|
| TCDN_01 | Đăng nhập với thông tin hợp lệ | Email: tuananh@gmail.com<br>Mật khẩu: Password123! | Hệ thống chuyển hướng đến trang chủ và hiển thị thông tin người dùng | Hệ thống đăng nhập thành công và chuyển đến trang chủ | Pass |
| TCDN_02 | Đăng nhập với email sai | Email: wrongemail@gmail.com<br>Mật khẩu: Password123! | Hệ thống hiển thị thông báo: "Email hoặc mật khẩu không đúng" | Hệ thống hiển thị: "Tài khoản không tồn tại" | Pass |
| TCDN_03 | Đăng nhập với mật khẩu sai | Email: tuananh@gmail.com<br>Mật khẩu: WrongPassword | Hệ thống hiển thị thông báo: "Email hoặc mật khẩu không đúng" | Hệ thống hiển thị: "Mật khẩu không chính xác" | Pass |
| TCDN_04 | Để trống email | Email: (trống)<br>Mật khẩu: Password123! | Hệ thống hiển thị thông báo: "Vui lòng nhập email" | Hệ thống hiển thị lỗi: "Email là bắt buộc" | Pass |
| TCDN_05 | Để trống mật khẩu | Email: tuananh@gmail.com<br>Mật khẩu: (trống) | Hệ thống hiển thị thông báo: "Vui lòng nhập mật khẩu" | Hệ thống hiển thị lỗi: "Mật khẩu là bắt buộc" | Pass |

---

## 4.3 Testcase Live Interview

| STT | Thông tin | Chi tiết |
|-----|-----------|----------|
| 1 | TestcaseID | TCLI |
| 2 | Mức độ ưu tiên Testcase | Cao |
| 3 | Người thiết kế Testcase | Trần Tuấn Anh |
| 4 | Ngày thiết kế Testcase | 04/12/2024 |
| 5 | Người thực hiện Test | Trần Tuấn Anh |
| 6 | Ngày thực hiện Test | 04/12/2024 |
| 7 | Tên Testcase | Phỏng vấn trực tiếp (Live Interview) |
| 8 | Mô tả | Người dùng sử dụng tính năng Live Interview để chia sẻ màn hình cuộc phỏng vấn thực tế, hệ thống sử dụng Deepgram để nhận diện giọng nói và AI (Gemini) để hỗ trợ trả lời câu hỏi theo thời gian thực. Có 2 chế độ: Auto (tự động phát hiện câu hỏi) và Manual (chọn text thủ công). |
| 9 | Tiền điều kiện | Người dùng đã đăng nhập và có microphone, có màn hình để chia sẻ, có kết nối internet ổn định. |
| 10 | Các bước thực hiện | Xem bảng chi tiết bên dưới |

### Các bước thực hiện - Live Interview

| STT | Bước thực hiện | Dữ liệu Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái (Pass/Fail) |
|-----|----------------|--------------|------------------|-----------------|------------------------|
| TCLI_01 | Truy cập trang Live Interview và nhấn nút "Start" | Cho phép quyền chia sẻ màn hình và microphone | Hệ thống hiển thị video màn hình được chia sẻ, bắt đầu đếm thời gian, kết nối WebSocket đến Deepgram thành công | Hệ thống hiển thị video chia sẻ màn hình, timer bắt đầu đếm, transcript bắt đầu ghi nhận | Pass |
| TCLI_02 | Chia sẻ màn hình không có audio | Chọn tab/window không có âm thanh | Hệ thống hiển thị cảnh báo: "No audio detected! Please check 'Share audio' checkbox" | Hệ thống hiển thị alert yêu cầu bật chia sẻ audio | Pass |
| TCLI_03 | Sử dụng chế độ Auto Mode và nói câu hỏi có dấu "?" | Nói: "What is your experience with React?" | Hệ thống tự động phát hiện câu hỏi (có dấu ?), gửi đến AI sau 0.2 giây và hiển thị câu trả lời | AI tự động nhận câu hỏi và trả lời trong phần "Interview with AI" | Pass |
| TCLI_04 | Sử dụng chế độ Manual Mode và chọn text | Chọn đoạn text: "Tell me about yourself" từ transcript | Hiển thị nút "Ask AI", người dùng click và AI trả lời | Nút "Ask AI" xuất hiện, click và nhận được câu trả lời từ AI | Pass |
| TCLI_05 | Nhấn nút "Stop" để dừng chia sẻ | Nhấn nút Stop | Hệ thống dừng recording, đóng WebSocket, dừng chia sẻ màn hình, hiển thị thông báo "Transcription ended" | Hệ thống dừng mọi hoạt động và hiển thị alert "Transcription ended" | Pass |
| TCLI_06 | Nhấn nút "Delete" để xóa transcript | Nhấn nút Delete | Hệ thống xóa toàn bộ transcript đã ghi nhận | Transcript được xóa sạch, reset lastProcessedLength và lastQuestionSent | Pass |
| TCLI_07 | Chuyển đổi giữa Auto Mode và Manual Mode | Click vào nút "Manual" khi đang ở Auto Mode | Hệ thống chuyển sang Manual Mode, reset selectedText | Chế độ được chuyển đổi thành công, hiển thị hướng dẫn tương ứng | Pass |
| TCLI_08 | Sử dụng nút Copy để sao chép câu trả lời AI | Click nút "Copy" trên câu trả lời của AI | Nội dung câu trả lời được copy vào clipboard, hiển thị thông báo "Đã copy câu trả lời của AI!" | Nội dung được copy thành công | Pass |
| TCLI_09 | Từ chối quyền chia sẻ màn hình | Từ chối permission khi browser yêu cầu | Hệ thống hiển thị thông báo: "Permission Denied!" và hướng dẫn cho phép quyền | Hiển thị alert hướng dẫn người dùng cho phép quyền | Pass |
| TCLI_10 | Không có microphone | Thiết bị không có microphone | Hệ thống hiển thị thông báo: "No microphone found!" | Hiển thị alert yêu cầu kết nối microphone | Pass |

---

## 4.4 Testcase Mock Interview

| STT | Thông tin | Chi tiết |
|-----|-----------|----------|
| 1 | TestcaseID | TCMI |
| 2 | Mức độ ưu tiên Testcase | Cao |
| 3 | Người thiết kế Testcase | Trần Tuấn Anh |
| 4 | Ngày thiết kế Testcase | 04/12/2024 |
| 5 | Người thực hiện Test | Trần Tuấn Anh |
| 6 | Ngày thực hiện Test | 04/12/2024 |
| 7 | Tên Testcase | Phỏng vấn thử với AI (Mock Interview) |
| 8 | Mô tả | Người dùng luyện tập phỏng vấn với AI Interviewer. Hệ thống sử dụng Web Speech API để nhận diện giọng nói (hỗ trợ: VI, EN, JA, ZH, KO), D-ID Talking Head để hiển thị avatar AI, và Gemini AI để đánh giá câu trả lời. Cuối buổi phỏng vấn, AI tạo báo cáo đánh giá chi tiết. |
| 9 | Tiền điều kiện | Người dùng đã đăng nhập, đã tạo Interview Set trong Preparation Hub, có microphone và camera (tùy chọn). |
| 10 | Các bước thực hiện | Xem bảng chi tiết bên dưới |

### Các bước thực hiện - Mock Interview

| STT | Bước thực hiện | Dữ liệu Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái (Pass/Fail) |
|-----|----------------|--------------|------------------|-----------------|------------------------|
| TCMI_01 | Truy cập trang Mock Interview và chọn Interview Set | Chọn một Interview Set có sẵn từ Preparation Hub | Hệ thống hiển thị modal chọn ngôn ngữ và AI Interviewer (HR, Tech Lead, Manager...) | Modal hiển thị với các tùy chọn ngôn ngữ và AI Interviewer | Pass |
| TCMI_02 | Chọn AI Interviewer và bắt đầu phỏng vấn | Chọn AI Interviewer: "Tech Lead"<br>Ngôn ngữ: English | Hệ thống bắt đầu phỏng vấn, AI đọc câu hỏi đầu tiên, D-ID avatar hiển thị và nói, timer bắt đầu đếm | Avatar AI hiển thị và phát âm câu hỏi đầu tiên bằng tiếng Anh | Pass |
| TCMI_03 | Bật camera để hiển thị webcam | Click vào nút bật camera | Hệ thống yêu cầu quyền truy cập camera, hiển thị video stream từ webcam | Webcam stream hiển thị trong giao diện | Pass |
| TCMI_04 | Nhấn nút microphone để ghi âm câu trả lời | Click nút microphone và nói câu trả lời: "I have 3 years of experience with React and Node.js" | Web Speech API nhận diện giọng nói, hiển thị text trong ô input, sau khi hoàn thành tự động submit | Text hiển thị trong input, sau đó được gửi đi và AI chuyển sang câu hỏi tiếp theo | Pass |
| TCMI_05 | Trả lời bằng tiếng Việt với ngôn ngữ đã chọn là tiếng Việt | Chọn ngôn ngữ: Vietnamese<br>Nói: "Tôi có 3 năm kinh nghiệm làm việc với React" | Hệ thống nhận diện chính xác tiếng Việt, AI phản hồi bằng tiếng Việt | Speech recognition nhận diện đúng tiếng Việt, AI trả lời bằng tiếng Việt | Pass |
| TCMI_06 | Hoàn thành tất cả câu hỏi trong Interview Set | Trả lời hết tất cả các câu hỏi | Hệ thống hiển thị thông báo kết thúc: "Thank you for your time. That concludes our interview.", sau đó chuyển đến trang Assessment Report | AI nói lời kết thúc, sau 2 giây chuyển đến /assessment-report | Pass |
| TCMI_07 | Kiểm tra báo cáo đánh giá (Assessment Report) | Sau khi hoàn thành phỏng vấn | Hệ thống hiển thị báo cáo với: Overall Score (0-100), điểm theo 5 tiêu chí (Technical, Problem-Solving, Communication, Experience, Professionalism), Strengths, Weaknesses, Recommendations | Báo cáo hiển thị đầy đủ các tiêu chí đánh giá | Pass |
| TCMI_08 | Không trả lời câu hỏi (bỏ trống) | Không nói gì trong 30 giây hoặc trả lời < 20 ký tự | AI ghi nhận câu trả lời trống, đánh giá 0 điểm cho câu đó | Câu trả lời được ghi nhận là không có nội dung | Pass |
| TCMI_09 | Trình duyệt không hỗ trợ Web Speech API | Sử dụng trình duyệt không hỗ trợ (Safari phiên bản cũ) | Hệ thống hiển thị thông báo: "Speech recognition is not supported in your browser." | Thông báo lỗi hiển thị cho người dùng | Pass |
| TCMI_10 | Mất kết nối microphone giữa chừng | Rút microphone trong khi đang ghi âm | Hệ thống hiển thị thông báo lỗi và dừng ghi âm | Hiển thị micError và dừng recording | Pass |

---

## 4.5 Testcase Preparation Hub

| STT | Thông tin | Chi tiết |
|-----|-----------|----------|
| 1 | TestcaseID | TCPH |
| 2 | Mức độ ưu tiên Testcase | Cao |
| 3 | Người thiết kế Testcase | Trần Tuấn Anh |
| 4 | Ngày thiết kế Testcase | 04/12/2024 |
| 5 | Người thực hiện Test | Trần Tuấn Anh |
| 6 | Ngày thực hiện Test | 04/12/2024 |
| 7 | Tên Testcase | Trung tâm chuẩn bị phỏng vấn (Preparation Hub) |
| 8 | Mô tả | Người dùng tạo Interview Set (bộ câu hỏi phỏng vấn) dựa trên CV đã upload, job description, tên công ty và vị trí ứng tuyển. AI Gemini sẽ tự động tạo câu hỏi và câu trả lời mẫu. Hỗ trợ đa ngôn ngữ (VI, EN, JA, ZH, KO). |
| 9 | Tiền điều kiện | Người dùng đã đăng nhập và đã upload ít nhất 1 CV trong phần User Documents. |
| 10 | Các bước thực hiện | Xem bảng chi tiết bên dưới |

### Các bước thực hiện - Preparation Hub

| STT | Bước thực hiện | Dữ liệu Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái (Pass/Fail) |
|-----|----------------|--------------|------------------|-----------------|------------------------|
| TCPH_01 | Truy cập trang Preparation Hub | Đăng nhập thành công | Hệ thống hiển thị danh sách Interview Set đã tạo (nếu có) và nút "Prepare Interview" | Trang hiển thị đúng với nút tạo Interview Set mới | Pass |
| TCPH_02 | Nhấn nút "Prepare Interview" để mở dialog | Click nút "Prepare Interview" | Dialog hiển thị với các trường: Output Language, Resume (dropdown), Company Name, Position, Job Description | Dialog mở với đầy đủ các trường input | Pass |
| TCPH_03 | Tạo Interview Set với đầy đủ thông tin | Output Language: English<br>Resume: (chọn từ dropdown)<br>Company Name: ABC Technology<br>Position: Frontend Developer<br>Job Description: "We are looking for a React developer..." | Hệ thống xử lý và tạo Interview Set, hiển thị thông báo "Questions generated successfully", dialog đóng và Interview Set mới xuất hiện trong danh sách | Toast "Questions generated successfully" hiển thị, Interview Set mới được thêm | Pass |
| TCPH_04 | Tạo Interview Set không chọn Resume | Output Language: Vietnamese<br>Resume: (không chọn)<br>Company Name: XYZ Corp<br>Position: Backend Developer | Nút "Save" bị disable, không thể submit | Nút Save bị disabled khi chưa chọn Resume | Pass |
| TCPH_05 | Tạo Interview Set với ngôn ngữ tiếng Việt | Output Language: Vietnamese<br>Resume: (chọn CV)<br>Company Name: Công ty ABC<br>Position: Lập trình viên | Hệ thống tạo câu hỏi và câu trả lời bằng tiếng Việt | Interview Set được tạo với nội dung tiếng Việt | Pass |
| TCPH_06 | Xem chi tiết Interview Set đã tạo | Click vào một Interview Set card | Chuyển đến trang chi tiết hiển thị danh sách câu hỏi và câu trả lời mẫu | Trang chi tiết hiển thị với đầy đủ câu hỏi/câu trả lời | Pass |
| TCPH_07 | Xóa Interview Set | Click nút Delete trên Interview Set card | Hệ thống hiển thị xác nhận, sau khi xác nhận thì xóa và hiển thị thông báo "Interview deleted successfully" | Interview Set bị xóa và toast thành công hiển thị | Pass |
| TCPH_08 | Xử lý lỗi khi API tạo câu hỏi thất bại | Server trả về lỗi 500 | Hệ thống hiển thị thông báo lỗi: "Error generating questions. Please try again" | Toast lỗi đỏ hiển thị với message tương ứng | Pass |
| TCPH_09 | Kiểm tra trạng thái loading khi tạo Interview Set | Submit form tạo Interview Set | Hiển thị Loading component trong nút Save, các input bị disable | Loading spinner hiển thị, không thể thao tác | Pass |
| TCPH_10 | Nhấn Cancel để đóng dialog | Click nút "Cancel" | Dialog đóng lại, không có thay đổi nào được thực hiện | Dialog đóng, form được reset | Pass |

---

## 4.6 Testcase User Documents

| STT | Thông tin | Chi tiết |
|-----|-----------|----------|
| 1 | TestcaseID | TCUD |
| 2 | Mức độ ưu tiên Testcase | Cao |
| 3 | Người thiết kế Testcase | Trần Tuấn Anh |
| 4 | Ngày thiết kế Testcase | 04/12/2024 |
| 5 | Người thực hiện Test | Trần Tuấn Anh |
| 6 | Ngày thực hiện Test | 04/12/2024 |
| 7 | Tên Testcase | Quản lý tài liệu người dùng (User Documents/Resume) |
| 8 | Mô tả | Người dùng upload, xem và xóa CV/Resume. Hệ thống hỗ trợ AI-Powered Analysis để trích xuất nội dung từ CV phục vụ cho các tính năng khác như Mock Interview, Quiz. Hỗ trợ định dạng PDF, DOCX. |
| 9 | Tiền điều kiện | Người dùng đã đăng nhập vào hệ thống. |
| 10 | Các bước thực hiện | Xem bảng chi tiết bên dưới |

### Các bước thực hiện - User Documents

| STT | Bước thực hiện | Dữ liệu Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái (Pass/Fail) |
|-----|----------------|--------------|------------------|-----------------|------------------------|
| TCUD_01 | Truy cập trang User Resume | Đăng nhập thành công | Hệ thống hiển thị header "User Resume" với mô tả, các badge (AI-Powered Analysis, Instant Processing, Secure Storage), và danh sách Resume đã upload | Trang hiển thị đúng giao diện với animation | Pass |
| TCUD_02 | Upload CV mới với định dạng PDF hợp lệ | File: CV_TranTuanAnh.pdf (< 5MB) | Hệ thống upload thành công, hiển thị toast thông báo thành công, CV mới xuất hiện trong bảng danh sách | Toast thành công, CV hiển thị trong ResumeTable | Pass |
| TCUD_03 | Upload CV với định dạng DOCX | File: CV_TranTuanAnh.docx | Hệ thống upload thành công, CV mới xuất hiện trong danh sách | Upload thành công, CV hiển thị trong danh sách | Pass |
| TCUD_04 | Upload file có định dạng không hỗ trợ | File: CV_TranTuanAnh.txt hoặc .jpg | Hệ thống hiển thị thông báo lỗi: "Định dạng file không được hỗ trợ" | Toast lỗi đỏ hiển thị với message tương ứng | Pass |
| TCUD_05 | Upload file vượt quá giới hạn dung lượng | File: LargeCV.pdf (> 10MB) | Hệ thống hiển thị thông báo lỗi về giới hạn dung lượng | Toast lỗi hiển thị yêu cầu file nhỏ hơn | Pass |
| TCUD_06 | Xem danh sách Resume đã upload | Có ít nhất 1 Resume trong hệ thống | Hệ thống hiển thị bảng ResumeTable với thông tin: tên file, ngày upload, actions | Bảng hiển thị đầy đủ thông tin Resume | Pass |
| TCUD_07 | Xóa Resume | Click nút Delete trên một Resume | Hệ thống xóa Resume, hiển thị toast thành công, danh sách được cập nhật | Resume bị xóa, toast thành công hiển thị | Pass |
| TCUD_08 | Xử lý lỗi khi xóa Resume thất bại | Server trả về lỗi 500 khi xóa | Hệ thống hiển thị toast lỗi với thông báo từ server | Toast lỗi đỏ hiển thị | Pass |
| TCUD_09 | Hiển thị trạng thái Loading khi upload | Đang trong quá trình upload file | Nút upload hiển thị Loading spinner, không cho phép thao tác khác | Loading hiển thị, các action bị disable | Pass |
| TCUD_10 | Hiển thị giao diện trống khi chưa có Resume | Người dùng mới, chưa upload Resume | Hệ thống hiển thị giao diện empty state với hướng dẫn upload | Empty state hiển thị với animation | Pass |

---

## 4.7 Testcase Find Job

| STT | Thông tin | Chi tiết |
|-----|-----------|----------|
| 1 | TestcaseID | TCFJ |
| 2 | Mức độ ưu tiên Testcase | Trung bình |
| 3 | Người thiết kế Testcase | Trần Tuấn Anh |
| 4 | Ngày thiết kế Testcase | 04/12/2024 |
| 5 | Người thực hiện Test | Trần Tuấn Anh |
| 6 | Ngày thực hiện Test | 04/12/2024 |
| 7 | Tên Testcase | Tìm việc làm (Find Job) |
| 8 | Mô tả | Hệ thống phân tích CV để xác định lĩnh vực và level phù hợp, gợi ý vị trí công việc, cung cấp thông tin thị trường (xu hướng, mức lương), và tạo link tìm việc trên các nền tảng tuyển dụng (ITviec, TopDev, VietnamWorks, LinkedIn...). Quy trình 5 bước: Upload CV → Chọn lĩnh vực → Chọn Level → Thiết lập preferences → Xem kết quả. |
| 9 | Tiền điều kiện | Người dùng đã đăng nhập vào hệ thống. |
| 10 | Các bước thực hiện | Xem bảng chi tiết bên dưới |

### Các bước thực hiện - Find Job

| STT | Bước thực hiện | Dữ liệu Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái (Pass/Fail) |
|-----|----------------|--------------|------------------|-----------------|------------------------|
| TCFJ_01 | Truy cập trang Find Job | Đăng nhập thành công | Hệ thống hiển thị trang với header, Language Switcher, Progress Indicator (5 bước), và form upload CV | Giao diện hiển thị đúng với Animated3DBackground | Pass |
| TCFJ_02 | Upload CV và phân tích | Upload file: CV_Frontend.pdf | Hệ thống phân tích CV (isAnalyzing = true), trích xuất skills, xác định lĩnh vực gợi ý, xác định location từ CV, chuyển sang bước "Chọn lĩnh vực" | Loading hiển thị, sau đó chuyển sang step "field" với suggestions | Pass |
| TCFJ_03 | Chọn lĩnh vực từ danh sách gợi ý | Chọn: "Frontend Developer" từ các gợi ý dựa trên CV | Hệ thống ghi nhận lĩnh vực đã chọn, chuyển sang bước "Chọn Level" | selectedField được set, chuyển sang step "level" | Pass |
| TCFJ_04 | Chọn Level kinh nghiệm | Chọn: "Junior" (1-3 năm) | Hệ thống ghi nhận level đã chọn, chuyển sang bước "Preferences" | selectedLevel được set, chuyển sang step "preferences" | Pass |
| TCFJ_05 | Thiết lập Job Preferences | Địa điểm: Hồ Chí Minh<br>Loại hình: Full-time | Hệ thống ghi nhận preferences, xây dựng search keyword (Field + Level), chuẩn hóa location, chuyển sang bước "Results" | searchKeyword và searchLocation được set, chuyển sang step "results" | Pass |
| TCFJ_06 | Xem kết quả tìm việc | Hoàn thành các bước trước | Hệ thống hiển thị JobResults với links đến các platform (ITviec, TopDev, VietnamWorks, LinkedIn), hiển thị Market Insights | Links đến các job platforms hiển thị, market insights card hiển thị | Pass |
| TCFJ_07 | Xem Market Insights | Click nút "Xem thông tin thị trường" | Hệ thống hiển thị MarketInsightsCard với: Demand Level, Salary Range, Hot Skills, Growth Trend | MarketInsightsCard hiển thị với đầy đủ thông tin | Pass |
| TCFJ_08 | Nhấn nút Back để quay lại bước trước | Đang ở bước "Results", nhấn nút "Quay lại" | Hệ thống quay về bước "Preferences", reset searchKeyword và searchLocation | Chuyển về step "preferences", các state được reset | Pass |
| TCFJ_09 | Chuyển đổi ngôn ngữ | Click Language Switcher, chọn "English" | Tất cả text trên trang chuyển sang tiếng Anh (Title, Subtitle, Step labels, Button labels) | Toàn bộ UI chuyển sang tiếng Anh | Pass |
| TCFJ_10 | Xử lý lỗi khi phân tích CV thất bại | Upload file CV bị lỗi hoặc không đọc được | Hệ thống hiển thị alert: "Đã xảy ra lỗi khi phân tích CV. Vui lòng thử lại." | Alert hiển thị với message lỗi tương ứng | Pass |

---

## 4.8 Testcase Support CV

| STT | Thông tin | Chi tiết |
|-----|-----------|----------|
| 1 | TestcaseID | TCSC |
| 2 | Mức độ ưu tiên Testcase | Cao |
| 3 | Người thiết kế Testcase | Trần Tuấn Anh |
| 4 | Ngày thiết kế Testcase | 04/12/2024 |
| 5 | Người thực hiện Test | Trần Tuấn Anh |
| 6 | Ngày thực hiện Test | 04/12/2024 |
| 7 | Tên Testcase | Hỗ trợ tối ưu CV (Support CV) |
| 8 | Mô tả | Hệ thống phân tích và đánh giá chất lượng CV (Overall Score, ATS Score, Impact Score, Clarity Score), tự động tối ưu CV với AI sử dụng phương pháp STAR, đảm bảo CV ATS-friendly, cung cấp template chuyên nghiệp và xuất file PDF. Quy trình 5 bước: Upload → Review → Edit (Auto/Manual) → Preview → Export. |
| 9 | Tiền điều kiện | Người dùng đã đăng nhập vào hệ thống. |
| 10 | Các bước thực hiện | Xem bảng chi tiết bên dưới |

### Các bước thực hiện - Support CV

| STT | Bước thực hiện | Dữ liệu Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái (Pass/Fail) |
|-----|----------------|--------------|------------------|-----------------|------------------------|
| TCSC_01 | Truy cập trang Support CV | Đăng nhập thành công | Hệ thống hiển thị landing page với header, QuotaStatusBanner, và CVUploader component | Giao diện hiển thị với Animated3DBackground | Pass |
| TCSC_02 | Upload CV để phân tích | Upload file: CV_NeedImprovement.pdf | Hệ thống parse CV, trích xuất thông tin vào CVData (personalInfo, experiences, education, skills...), chuyển sang bước "Review" | CV được parse, state.cvData được set, chuyển sang step "review" | Pass |
| TCSC_03 | Xem đánh giá CV (Review) | Sau khi upload CV | Hệ thống hiển thị CVReviewPanel với: Overall Score (0-100), ATS Score, Impact Score, Clarity Score, Strengths, Weaknesses, Suggestions | Review panel hiển thị với đầy đủ điểm số và gợi ý | Pass |
| TCSC_04 | Sử dụng Auto-Edit để tối ưu CV | Click nút "Auto-Edit" | Hệ thống hiển thị AutoEditLoadingDialog với progress bar, AI phân tích và tạo suggestions, chuyển sang bước "auto-edit-comparison" để review changes | Loading dialog hiển thị tiến trình, sau đó hiển thị so sánh trước/sau | Pass |
| TCSC_05 | Review và chấp nhận các thay đổi Auto-Edit | Chọn các changes muốn áp dụng, click "Accept" | Hệ thống áp dụng các selected suggestions vào CV, chuyển sang bước "Edit" với CV đã được cải thiện | selectedIds được apply, cvData được update, chuyển sang step "edit" | Pass |
| TCSC_06 | Từ chối tất cả thay đổi Auto-Edit | Click nút "Reject All" | Hệ thống quay lại bước "Review" mà không apply bất kỳ thay đổi nào | Chuyển về step "review", CV giữ nguyên | Pass |
| TCSC_07 | Sử dụng Manual Edit | Click nút "Manual Edit" từ Review | Hệ thống chuyển sang bước "Edit" với CVEditor component cho phép chỉnh sửa thủ công | CVEditor hiển thị với đầy đủ các section để edit | Pass |
| TCSC_08 | Preview CV đã chỉnh sửa | Sau khi edit, click nút "Preview" | Hệ thống chuyển sang bước "Preview" với CVPreview_NEW component hiển thị CV theo template đã chọn | CV preview hiển thị theo selectedTemplate | Pass |
| TCSC_09 | Export CV sang PDF | Click nút "Export" từ Preview | Hệ thống chuyển sang bước "Export" với ExportPanel, cho phép tải CV dạng PDF | ExportPanel hiển thị với các tùy chọn export | Pass |
| TCSC_10 | Xử lý lỗi khi API Quota vượt giới hạn | Gemini API trả về EMERGENCY_BLOCK | Hệ thống hiển thị alert: "API Quota Exceeded... Please try again in 30 minutes, or use the Manual Edit option instead." | Alert hiển thị với hướng dẫn sử dụng Manual Edit | Pass |
| TCSC_11 | Thay đổi Template CV | Chọn template khác từ dropdown | Hệ thống cập nhật selectedTemplate, Preview hiển thị CV với template mới | Template được cập nhật, preview thay đổi tương ứng | Pass |
| TCSC_12 | Quay lại bước Review từ Edit | Click nút "Back to Review" | Hệ thống quay lại bước "Review" | Chuyển về step "review" | Pass |

---

## 4.9 Testcase Quiz

| STT | Thông tin | Chi tiết |
|-----|-----------|----------|
| 1 | TestcaseID | TCQZ |
| 2 | Mức độ ưu tiên Testcase | Cao |
| 3 | Người thiết kế Testcase | Trần Tuấn Anh |
| 4 | Ngày thiết kế Testcase | 04/12/2024 |
| 5 | Người thực hiện Test | Trần Tuấn Anh |
| 6 | Ngày thực hiện Test | 04/12/2024 |
| 7 | Tên Testcase | Đánh giá kỹ năng bằng Quiz |
| 8 | Mô tả | Hệ thống đánh giá năng lực kỹ thuật của ứng viên qua bài quiz. AI Gemini tạo câu hỏi tùy chỉnh theo CV và lĩnh vực. Quy trình 7 bước: Upload CV (tùy chọn) → Chọn lĩnh vực → Chọn cấp bậc → Chọn độ khó → Chọn số câu hỏi → Làm Quiz → Xem kết quả. Hỗ trợ đa ngôn ngữ (VI, EN, JA, ZH, KO). |
| 9 | Tiền điều kiện | Người dùng đã đăng nhập vào hệ thống. |
| 10 | Các bước thực hiện | Xem bảng chi tiết bên dưới |

### Các bước thực hiện - Quiz

| STT | Bước thực hiện | Dữ liệu Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái (Pass/Fail) |
|-----|----------------|--------------|------------------|-----------------|------------------------|
| TCQZ_01 | Truy cập trang Quiz | Đăng nhập thành công | Hệ thống hiển thị trang với header "Quiz Đánh Giá Kỹ Năng", Language Selector, Progress bar (7 bước), và bước đầu tiên Upload CV | Giao diện hiển thị với Animated3DBackground | Pass |
| TCQZ_02 | Upload CV (tùy chọn) | Upload file: CV_Developer.pdf | Hệ thống phân tích CV, trích xuất skills, gợi ý level từ kinh nghiệm, chuyển sang bước "Chọn lĩnh vực" | CVAnalysisResult được tạo, suggestedLevel được set | Pass |
| TCQZ_03 | Bỏ qua Upload CV | Click nút "Bỏ qua" hoặc "Tiếp tục không cần CV" | Hệ thống chuyển sang bước tiếp theo mà không có CV analysis | Chuyển sang step "field" với cvAnalysis = null | Pass |
| TCQZ_04 | Chọn lĩnh vực làm việc | Chọn: "Frontend Development" từ FieldSelectionStep | Hệ thống ghi nhận selectedField với requiredSkills và niceToHaveSkills, chuyển sang bước "Chọn level" | selectedField được set, chuyển sang step "level" | Pass |
| TCQZ_05 | Chọn cấp bậc kinh nghiệm | Chọn: "Junior" (1-3 năm) | Hệ thống ghi nhận selectedLevel, chuyển sang bước "Chọn độ khó" | selectedLevel được set, chuyển sang step "difficulty" | Pass |
| TCQZ_06 | Chọn độ khó câu hỏi | Chọn: "Medium" | Hệ thống ghi nhận selectedDifficulty, chuyển sang bước "Chọn số câu hỏi" | selectedDifficulty được set, chuyển sang step "count" | Pass |
| TCQZ_07 | Chọn số lượng câu hỏi | Chọn: 20 câu hỏi | Hệ thống ghi nhận questionCount, hiển thị nút "Bắt đầu Quiz" | questionCount = 20, nút Start Quiz hiển thị | Pass |
| TCQZ_08 | Bắt đầu làm Quiz | Click nút "Bắt đầu Quiz" | Hệ thống gọi generateQuestionsWithAI, hiển thị loading "Đang tạo câu hỏi...", sau đó chuyển sang bước "Quiz" với danh sách câu hỏi | isProcessing = true, sau đó questions được set, chuyển sang step "quiz" | Pass |
| TCQZ_09 | Trả lời câu hỏi trong Quiz | Chọn đáp án A cho câu hỏi 1 | Hệ thống ghi nhận answer vào mảng answers, cho phép chuyển sang câu tiếp theo | answers[0] = 0, có thể next question | Pass |
| TCQZ_10 | Đánh dấu câu hỏi (Flag) | Click nút Flag trên câu hỏi 5 | Hệ thống thêm index vào flaggedQuestions để review sau | flaggedQuestions.includes(4) = true | Pass |
| TCQZ_11 | Hoàn thành Quiz và xem kết quả | Trả lời hết tất cả câu hỏi, click Submit | Hệ thống tính điểm, gọi generateComprehensiveFeedback, chuyển sang bước "Result" với EnhancedFeedbackStep | feedback được generate, chuyển sang step "result" | Pass |
| TCQZ_12 | Xem kết quả chi tiết | Sau khi hoàn thành Quiz | Hệ thống hiển thị: Overall Score (%), Skill Performance, Recommendations (High/Medium/Low priority), Study Plan, Career Insights | EnhancedFeedbackStep hiển thị đầy đủ thông tin | Pass |
| TCQZ_13 | Chuyển đổi ngôn ngữ Quiz | Chọn ngôn ngữ: "日本語" (Japanese) | Tất cả labels, buttons, câu hỏi được hiển thị bằng tiếng Nhật | UI chuyển sang tiếng Nhật theo translations.ja | Pass |
| TCQZ_14 | Xử lý lỗi khi tạo câu hỏi thất bại | AI API trả về lỗi | Hệ thống hiển thị thông báo lỗi và nút "Thử lại" | error được set, hiển thị message và nút retry | Pass |
| TCQZ_15 | Nhấn Back để quay lại bước trước | Đang ở bước "difficulty", click Back | Hệ thống quay về bước "level" | currentStep = "level" | Pass |

---

## 4.10 Testcase Summarize

| STT | Thông tin | Chi tiết |
|-----|-----------|----------|
| 1 | TestcaseID | TCSM |
| 2 | Mức độ ưu tiên Testcase | Trung bình |
| 3 | Người thiết kế Testcase | Trần Tuấn Anh |
| 4 | Ngày thiết kế Testcase | 04/12/2024 |
| 5 | Người thực hiện Test | Trần Tuấn Anh |
| 6 | Ngày thực hiện Test | 04/12/2024 |
| 7 | Tên Testcase | Phân tích CV chuyên sâu (Summarize) |
| 8 | Mô tả | Hệ thống phân tích toàn diện CV của ứng viên, đánh giá kỹ năng chi tiết theo category (Technical, Soft Skills, Language, Tools), gợi ý nghề nghiệp phù hợp với match score, cung cấp action items để cải thiện. Hỗ trợ định dạng: PDF, DOCX, TXT, MP3, WAV, OGG (audio transcription). Đa ngôn ngữ (VI, EN, JA, ZH, KO). |
| 9 | Tiền điều kiện | Người dùng đã đăng nhập vào hệ thống. |
| 10 | Các bước thực hiện | Xem bảng chi tiết bên dưới |

### Các bước thực hiện - Summarize

| STT | Bước thực hiện | Dữ liệu Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái (Pass/Fail) |
|-----|----------------|--------------|------------------|-----------------|------------------------|
| TCSM_01 | Truy cập trang Summarize | Đăng nhập thành công | Hệ thống hiển thị trang với header "Phân tích CV chuyên sâu", Language Selector, mô tả, và FileUpload component | Giao diện hiển thị với Animated3DBackground | Pass |
| TCSM_02 | Chọn ngôn ngữ output | Chọn: "English" từ Language Selector | Hệ thống cập nhật language state, tất cả labels chuyển sang tiếng Anh | language = "en", UI hiển thị bằng tiếng Anh | Pass |
| TCSM_03 | Upload file CV định dạng PDF | Upload file: CV_FullStack.pdf | Hệ thống hiển thị file đã upload, enable nút "Phân tích CV" | uploadedFile được set, nút Generate được enable | Pass |
| TCSM_04 | Upload file audio (transcription) | Upload file: Interview_Recording.mp3 | Hệ thống chấp nhận file audio, chuẩn bị transcribe khi phân tích | uploadedFile được set với audio file | Pass |
| TCSM_05 | Nhấn nút "Phân tích CV" để bắt đầu | Click nút "Phân tích CV" | Hệ thống hiển thị loading "Đang phân tích CV...", gọi generateSummary service | isLoading = true, loading UI hiển thị | Pass |
| TCSM_06 | Xem kết quả phân tích - Overall Rating | Sau khi phân tích hoàn thành | Hệ thống hiển thị overallRating (0-10) với visual indicator | summary.overallRating hiển thị | Pass |
| TCSM_07 | Xem kết quả - CV Completeness | Phân tích thành công | Hệ thống hiển thị độ hoàn thiện CV (overallScore %), chi tiết từng section (Complete ✅, Partial ⚠️, Missing ❌) | cvCompleteness.sections hiển thị với status icons | Pass |
| TCSM_08 | Xem kết quả - Skills Analysis | Phân tích thành công | Hệ thống hiển thị phân tích kỹ năng theo category: Technical, Soft Skills, Language, Tools với rating 1-5 và level | skillsAnalysis array hiển thị với đầy đủ thông tin | Pass |
| TCSM_09 | Xem kết quả - Career Recommendations | Phân tích thành công | Hệ thống hiển thị gợi ý nghề nghiệp với: Title, Match Score (%), Description, Salary Range, Required Skills | careerRecommendations hiển thị với đầy đủ details | Pass |
| TCSM_10 | Xem kết quả - Action Items | Phân tích thành công | Hệ thống hiển thị việc cần làm với priority (High/Medium/Low) và impact | actionItems hiển thị với priority badges | Pass |
| TCSM_11 | Xem kết quả - Experience Highlights | Phân tích thành công | Hệ thống hiển thị điểm nhấn kinh nghiệm từ CV | experienceHighlights array hiển thị | Pass |
| TCSM_12 | Xem kết quả - Weaknesses | Phân tích thành công | Hệ thống hiển thị điểm yếu và gợi ý cải thiện | weaknesses array hiển thị với suggestions | Pass |
| TCSM_13 | Xem Word Count và Reading Time | Phân tích thành công | Hệ thống hiển thị số từ và thời gian đọc ước tính | wordCount và readingTime hiển thị | Pass |
| TCSM_14 | Xử lý lỗi - Không upload file | Click "Phân tích CV" mà không upload file | Hệ thống hiển thị alert: "Vui lòng tải lên tài liệu hoặc file âm thanh trước khi tạo tóm tắt" | error alert hiển thị | Pass |
| TCSM_15 | Xử lý lỗi - API thất bại | Server trả về lỗi | Hệ thống hiển thị thông báo: "Không thể tạo tóm tắt. Vui lòng thử lại." với icon AlertCircle | error state được set, error UI hiển thị | Pass |
