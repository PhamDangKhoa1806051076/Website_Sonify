# NHẬT KÝ PHÁT TRIỂN DỰ ÁN SONIFY (DEV LOG)

> **Mục tiêu lớn:** Bổ sung 2 danh mục mới theo phong cách các nền tảng lớn:
> 1. **Podcast** (Nằm dưới tab "Khám phá" trong Sidebar và xuất hiện như 1 thể loại trên giao diện)
> 2. **Audio / Sách nói (Audio Books)** (Thực hiện từng phần, hoàn chỉnh frontend, backend, admin, player và push GitHub đều đặn)

---

## 📌 TIẾN ĐỘ TỔNG QUAN

| Hạng mục | Trạng thái | Ghi chú |
| :--- | :--- | :--- |
| **Phần 1: Podcast** | ✅ **HOÀN THÀNH** | Đã hoàn thiện Model, API CRUD, Giao diện `/podcast`, Admin Panel, Tích hợp Player (tua 15s) & Build thành công 100%. |
| **Phần 2: Audio Books (Sách nói)** | ✅ **HOÀN THÀNH** | Đã hoàn thiện Model, API CRUD, Giao diện `/audiobooks`, Admin Panel, Player tốc độ đọc (0.75x-2x) & Build thành công 100%. |
| **Phần 3: Mobile Next-Gen Ecosystem** | ✅ **HOÀN THÀNH** | Nâng cấp toàn diện Mobile: Dual Floating Island (Dock + Mini-Player), Vibes & Scenes Bar, Cụm 4 Ecosystem Widgets & Build 100%. |

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

4. **Bước 2.4: Admin Panel Sách nói & Tổng kết nghiệm thu** ✅ (HOÀN THÀNH)
   - Đã tạo `components/admin/AdminAudioBooks.tsx` (thống kê sách & tác giả, form thêm/sửa sách nói, FilePicker, bảng quản lý với nút sửa/xóa).
   - Đã tích hợp `AdminAudioBooks` vào `AdminPanel.tsx` (`view === 'audio'`) và `app/admin/page.tsx`.
   - Đã chạy `npm run build` xác thực toàn diện: Biên dịch thành công 27 trang/tuyến với 0 lỗi.
   - *Đã commit & push GitHub.*

---

## 📱 CHI TIẾT PHẦN 3: GIAO DIỆN MOBILE NEXT-GEN ECOSYSTEM (ĐANG THỰC HIỆN)

> **Triết lý thiết kế:** "Modern Audio OS / Living Ecosystem" (lấy cảm hứng từ Sonos S2 / Spotify Modern Mobile / iOS Dynamic Island). Mang lại trải nghiệm cao cấp, chuyên nghiệp với không gian phân cấp hiện đại, điều hướng con nhộng nổi và cụm widget hệ sinh thái.

### 1. Mục tiêu kiến trúc & trải nghiệm người dùng:
- **Dual Floating Island (Bộ đôi đảo nổi):**
  - **Mini-Player Island:** Nổi lơ lửng dạng viên thuốc kính mờ satin phía trên thanh điều hướng, bo cong hoàn toàn, thanh tiến độ xanh neon phát quang và nút Play/Pause tròn sang trọng.
  - **Floating Navigation Capsule Dock:** Thanh dock nổi giữa đáy màn hình (`border-radius: 9999px`), hiệu ứng kính đen mờ `backdrop-blur-2xl`. Tab Active hiển thị viên nang trượt mượt mà (fluid slide) với màu xanh ngọc / tím đặc trưng.
- **Vibes & Scenes Bar (Không gian nghe theo tâm trạng):**
  - Thanh chọn cảm xúc nhanh ở đầu trang chủ: *Coffee & Chill*, *Deep Focus*, *Night Relax*, *Workout Energy*, *Healing Books*.
- **Ecosystem Widgets Grid (Cụm 4 ô vuông truy cập nhanh):**
  - Lưới 4 card bo góc mềm mại: Bài hát yêu thích (Liked Songs tím hồng), Podcast Hub (cam coral), Sách nói (Audiobooks xanh ngọc), Top 50 Charts (vàng kim).
- **Made For You (Snap Carousel):**
  - Băng chuyền các bài hát/album nổi bật vuốt chạm mượt mà trên di động.

### 2. Danh sách file thay đổi & chức năng cụ thể:
1. `components/MobileNav.tsx`:
   - Chuyển đổi thành **Floating Capsule Dock** 4 tab chính: `Trang chủ (Home)`, `Tìm kiếm (Search)`, `Thư viện (Library)`, `Hệ thống (System)`.
   - Sử dụng `framer-motion` `layoutId="mobile-nav-pill"` tạo hiệu ứng viên nang phát sáng trượt mượt giữa các tab.
2. `components/MobileVibesBar.tsx` (Tạo mới):
   - Thanh viên thuốc trượt ngang chọn tâm trạng nghe (Scenes & Moods), lọc bài hát theo vibe.
3. `components/MobileEcosystemWidgets.tsx` (Tạo mới):
   - Cụm 4 widget card vuông cao cấp dẫn nhanh tới: Bài hát yêu thích, Podcast, Sách nói, Bảng xếp hạng.
4. `components/PlayerBar.tsx`:
   - Thiết kế lại hiển thị mobile thành **Floating Mini-Player Island** nổi đồng bộ ngay phía trên Dock.
   - Bổ sung thanh tiến độ phát sáng neon chạy ngầm và nút điều khiển tối giản.
5. `app/page.tsx`:
   - Tích hợp `MobileVibesBar` và `MobileEcosystemWidgets` hiển thị tự nhiên trên mobile.
6. `app/globals.css`:
   - Bổ sung toàn bộ style CSS cho: `.mobile-floating-dock`, `.mobile-mini-player-island`, `.mobile-vibes-bar`, `.mobile-ecosystem-widgets`, hiệu ứng kính mờ satin glass, safe area inset đáy màn hình.

### 3. Kết quả triển khai & Tinh chỉnh sửa lỗi toàn diện:
- **Xóa bỏ các khối widget/vibe thừa & trùng lặp:**
  - Loại bỏ hoàn toàn `MobileVibesBar` và `MobileEcosystemWidgets` độc lập để tránh trùng lặp với danh mục và tránh chiếm không gian màn hình.
  - Hợp nhất toàn bộ vào thanh Chips Filter ngang duy nhất trên trang chủ: **Tất cả**, **Bảng xếp hạng (Charts)**, **Podcast**, **Sách nói (Audiobooks)**, **Yêu thích (Liked)** cùng toàn bộ thể loại nhạc (`V-Pop`, `US-UK`, `K-Pop`, `C-Pop`...).
- **Khắc phục triệt để lỗi thẻ nhạc bị kéo giãn trên Mobile (Explore page & SongGrid):**
  - Khóa tỷ lệ khung ảnh vuông 1:1 qua kỹ thuật `paddingBottom: '100%'` trong `components/SongCard.tsx`, ngăn chặn mọi hiện tượng ảnh bị giãn cao bất thường trên Safari/Chromium mobile.
  - Cấu hình `.song-grid` chuẩn xác: `grid-template-columns: repeat(2, minmax(0, 1fr)) !important` và gán `style={{ width: '100%', minWidth: 0 }}` cho từng `motion.div` trong `SongGrid.tsx` để luôn đảm bảo đúng 2 cột đều tăm tắp, không bao giờ bị dạt 1 cột.
- **Xử lý dứt điểm lỗi tràn viền ngang (Horizontal Overflow & Purple Scrollbar):**
  - Đã loại bỏ hoàn toàn các đoạn CSS mobile legacy cũ trong `app/globals.css` (từng định nghĩa `width: 100vw; height: 100vh; overflow: hidden;` xung đột).
  - Khóa chặt `html, body, .app-container` ở `width: 100% !important; max-width: 100vw !important; overflow-x: hidden !important`.
- **Hoàn thiện Floating Capsule Dock Navigation & Mini-Player Island:**
  - Sắp xếp chuẩn 4 tab: **Home** (`fa-house`) -> **Library** (`fa-layer-group`) -> **Search** (`fa-magnifying-glass`) -> **System** (`fa-sliders`).
  - Viên nang nổi bo tròn 9999px canh giữa chính xác với chiều rộng co giãn `width: min(380px, calc(100vw - 28px))`, icon & nhãn xanh ngọc Neon rực rỡ khi active.
  - Mini-Player Island đặt nổi lơ lửng ngay phía trên dock với thanh tiến độ xanh phát quang và nút Play tròn xúc giác.
- **Nghiệm thu toàn diện:**
  - `npx next lint`: **0 warning, 0 error**.
  - `npm run build`: **Thành công 100% (27/27 pages & API routes)**.



