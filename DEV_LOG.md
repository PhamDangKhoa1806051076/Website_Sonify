# NHẬT KÝ PHÁT TRIỂN DỰ ÁN SONIFY (DEV LOG)

> **Mục tiêu lớn:** Bổ sung 2 danh mục mới theo phong cách các nền tảng lớn:
> 1. **Podcast** (Nằm dưới tab "Khám phá" trong Sidebar và xuất hiện như 1 thể loại trên giao diện)
> 2. **Audio / Sách nói (Audio Books)** (Thực hiện từng phần, hoàn chỉnh frontend, backend, admin, player và push GitHub đều đặn)

---

## 📌 TIẾN ĐỘ TỔNG QUAN

| Hạng mục | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| **Phần 1: Podcast** | ✅ **HOÀN THÀNH** | Đã hoàn thiện Model, API CRUD, Giao diện `/podcast`, Admin Panel, Tích hợp Player (tua 15s) & Build thành công 100%. |
| **Phần 2: Audio Books (Sách nói)** | ⏳ **CHUẨN BỊ TRIỂN KHAI** | Bước tiếp theo: Triển khai Model, API, UI, Admin và Player cho Sách nói theo từng phần nhỏ. |

---

## 📝 CHI TIẾT PHẦN 1: PODCAST (ĐÃ HOÀN THÀNH)

### 1. File mới tạo:
- `models/Podcast.ts`: Mongoose schema lưu trữ podcast (customId, title, host, showName, episodeNumber, category, duration, description, cover, src, isOnline).
- `app/api/podcasts/route.ts`: API GET (lọc theo category, show, tìm kiếm q) và API POST (tạo mới podcast, kiểm tra auth admin, sanitize dữ liệu).
- `app/api/podcasts/[id]/route.ts`: API PUT (cập nhật) và DELETE (xóa theo customId hoặc _id, kiểm tra auth admin).
- `components/PodcastCard.tsx`: Card hiển thị podcast theo phong cách ngang hiện đại, badge tập, duration, thông tin host/show, nút play đồng bộ với player.
- `app/podcast/page.tsx`: Trang danh mục Podcast với hero banner chủ đề, chips lọc theo kênh/show và theo chủ đề (Tâm lý, Kinh doanh, Công nghệ...).
- `components/admin/AdminPodcast.tsx`: Module quản lý podcast trong Admin Panel: thống kê, form thêm/sửa, chọn file local qua FilePickerModal hoặc link online, bảng quản lý với nút sửa/xóa.

### 2. File đã chỉnh sửa & cập nhật:
- `data/constants.ts`:
  - Mở rộng `Song` interface thêm `isPodcast?: boolean` và `podcastMeta?: { host, showName, episodeNumber, description, duration }`.
  - Bổ sung từ khóa ngôn ngữ đa ngữ (vi/en) cho Podcast (`nav-podcast`, `podcast-title`, `podcast-all-shows`, `podcast-episode`, `podcast-count`...).
- `components/Sidebar.tsx`:
  - Thêm tab `podcast` ngay dưới tab `explore` (Khám phá) với icon `fa-microphone`.
  - Thêm tab `admin-podcast` cho tài khoản có quyền Admin.
- `components/AppShell.tsx`:
  - Cập nhật ánh xạ router pathname: `/podcast` -> active tab `podcast`.
  - Bổ sung điều hướng tab: click vào podcast chuyển trang `/podcast`, click admin-podcast chuyển `/admin?view=podcast`.
- `components/AdminPanel.tsx`:
  - Tích hợp `AdminPodcast` vào danh sách các view quản trị (`view === 'podcast'`).
  - Cập nhật tiêu đề trang tương ứng "Quản lý Podcast".
- `app/admin/page.tsx`:
  - Cập nhật danh sách view hợp lệ gồm cả `podcast`.
- `app/page.tsx`:
  - Thêm chip thể loại nổi bật **Podcast** (icon microphone) ngay cạnh danh mục nhạc để người dùng truy cập nhanh.
- `context/PlayerContext.tsx`:
  - Cải tiến hàm `playSong`: Phân biệt thông minh giữa YouTube online search với link audio trực tiếp / podcast. Podcast và file audio direct được phát thẳng qua thẻ audio không bị query nhầm sang YouTube.
- `components/PlayerBar.tsx`:
  - Hiển thị badge **PODCAST** nổi bật và tên Show khi đang nghe podcast.
  - Khi phát podcast, thay thế các nút không cần thiết bằng **2 nút tua chuyên dụng: Lùi 15s và Tiến 15s** giúp nghe nói thuận tiện.
- `app/globals.css`:
  - Bổ sung toàn bộ style CSS cho Hero Podcast, thẻ PodcastCard, Grid layout, Empty state, responsive mobile, light/dark mode.

### 3. Kết quả kiểm tra:
- `npm run build`: Thành công 100% không có cảnh báo hay lỗi kiểu dữ liệu.

---

## 🚀 KẾ HOẠCH PHẦN 2: AUDIO / SÁCH NÓI (AUDIO BOOKS)

Sau khi push commit Phần 1 lên GitHub, chúng ta sẽ bắt đầu Phần 2 theo từng bước nhỏ:

1. **Bước 2.1: Backend Audio Books** ✅ (HOÀN THÀNH)
   - Đã tạo Model Mongoose `models/AudioBook.ts` (quản lý sách nói: tác giả, người đọc/voice, thể loại, số chương, tóm tắt sách, cover, audio).
   - Đã tạo API `app/api/audiobooks/route.ts` (GET có bộ lọc search/category/author + POST có kiểm tra admin).
   - Đã tạo API `app/api/audiobooks/[id]/route.ts` (PUT cập nhật + DELETE xóa có kiểm tra admin).
   - *Đã commit & push GitHub.*

2. **Bước 2.2: Frontend & Navigation** ✅ (HOÀN THÀNH)
   - Đã mở rộng `Song` interface với `isAudioBook` và `audioBookMeta` (`author`, `narrator`, `chaptersCount`, `description`, `duration`).
   - Đã bổ sung bộ từ khóa đa ngữ vi/en cho Audio Books vào `constants.ts`.
   - Đã thêm tab `audiobooks` vào `Sidebar.tsx` ngay dưới tab Podcast và thêm mục `admin-audio` cho Admin.
   - Đã cập nhật `AppShell.tsx` định tuyến `/audiobooks` và `/admin?view=audio`.
   - Đã thêm chip thể loại "Sách nói" nổi bật trên Trang chủ (`app/page.tsx`).
   - *Đã commit & push GitHub.*

3. **Bước 2.3: Giao diện Sách nói & Player chuyên dụng** ✅ (HOÀN THÀNH)
   - Đã tạo `components/AudioBookCard.tsx` (thiết kế theo tỉ lệ bìa sách 3:4 chân thực, hiệu ứng đổ bóng, badge số chương, hiển thị tác giả và giọng đọc).
   - Đã tạo trang `app/audiobooks/page.tsx` (hero banner, tìm kiếm sách, lọc theo thể loại & tác giả, grid danh sách sách nói).
   - Đã bổ sung bộ CSS hoàn chỉnh cho Sách nói trong `app/globals.css`.
   - Đã tích hợp tính năng đổi tốc độ đọc (0.75x, 1.0x, 1.25x, 1.5x, 2.0x) và badge "Sách nói" cùng 2 nút tua 15s trong `PlayerBar.tsx` & `PlayerContext.tsx`.
   - *Đã commit & push GitHub.*

4. **Bước 2.4: Admin Panel Sách nói & Tổng kết nghiệm thu**
   - Tạo `components/admin/AdminAudioBooks.tsx`.
   - Tích hợp vào `AdminPanel.tsx` và `app/admin/page.tsx`.
   - Chạy `npm run build` xác thực toàn diện.
   - *Commit + Push GitHub.*
