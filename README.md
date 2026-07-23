# 🎵 Sonify — Premium Music Experience

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.20-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-EE4B6A?style=for-the-badge&logo=framer" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel" />
  <img src="https://img.shields.io/badge/Security-0_Vulnerabilities-brightgreen?style=for-the-badge&logo=shield" />
</div>

<br/>

> **Sonify** là ứng dụng nghe nhạc trực tuyến cao cấp, được thiết kế với phong cách **Glassmorphism** hiện đại và hiệu năng tối ưu. Dự án tập trung vào trải nghiệm mượt mà, tính cá nhân hóa cao và khả năng quản lý chuyên nghiệp.

## 🔗 Live Demo

**[▶ Trải nghiệm Sonify trực tuyến](https://sonify.vercel.app)**

---

## ✨ Tính năng nổi bật

| Tính năng | Mô tả |
|---|---|
| 🎵 **Advanced Player** | Play/pause, skip, shuffle, repeat, queue panel, progress bar gradient |
| 💎 **Premium UI** | Glassmorphism, double-bezel card architecture, nested design system |
| 🎬 **Framer Motion** | Stagger reveal cho song cards, page transition, banner crossfade, modal scale |
| 🌈 **Multi-Theme** | Dark / Light / Blue — chuyển đổi mượt qua CSS variables |
| 📱 **Responsive** | Desktop sidebar, tablet, mobile bottom nav |
| 🔐 **Auth System** | Đăng nhập, đăng ký, đổi mật khẩu, phân quyền admin/user |
| 📊 **Admin Dashboard** | Quản lý nhạc, users, thể loại, góp ý — tab UI đầy đủ |
| 📟 **Session Tracking** | Heartbeat online/offline, last active, multi-device |
| 🔍 **Search** | Tìm kiếm local + online (iTunes API) |
| 📈 **Charts** | Bảng xếp hạng: Trending, Việt Nam, Chinese, US/UK |
| 🎙️ **Feedback** | Góp ý người dùng — lưu DB + email, admin xem theo tab |
| 🔒 **Security** | Patched CVE-2025-66478 (CVSS 10.0), 0 npm vulnerabilities |

---

## 🛠️ Tech Stack

### Frontend
| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| **Next.js** | 15.5.20 | Framework — App Router, SSR, API Routes |
| **React** | 19.2.7 | UI Library |
| **TypeScript** | 5 | Type safety |
| **Framer Motion** | 12.42.2 | Animations — stagger, spring, page transitions |
| **CSS thuần** | — | Styling — glassmorphism, CSS variables, multi-theme |

### Backend & Database
| Công nghệ | Version | Vai trò |
|-----------|---------|---------|
| **MongoDB Atlas** | — | Cloud database |
| **Mongoose** | 8.23.1 | ODM — models, connection pooling |
| **bcryptjs** | 3.x | Hash mật khẩu |
| **Nodemailer** | 9.x | Gửi email |

### Services & Libraries
| Service | Vai trò |
|---------|---------|
| **Font Awesome 6.5** | Icons |
| **Plus Jakarta Sans** | Font chính (via next/font) |
| **JetBrains Mono** | Font đồng hồ & timestamp |
| **iTunes Search API** | Tìm nhạc online |
| **ui-avatars.com** | Avatar tự động |
| **FormSubmit.co** | Relay email feedback |
| **Vercel** | Hosting & CI/CD |

### Architecture
- **Context API** — AuthContext, PlayerContext, ThemeContext, LanguageContext
- **REST API** — `/api/auth/*`, `/api/songs`, `/api/users`, `/api/feedback`, `/api/categories`
- **Glassmorphism** — `backdrop-filter`, translucent cards, inset shadows
- **Double-bezel cards** — outer shell + inner core nested architecture

---

## 🔒 Bảo mật

| CVE | Mức độ | Trạng thái |
|-----|--------|------------|
| CVE-2025-66478 | CVSS 10.0 Critical | ✅ Patched — react@19.2.7 |
| CVE-2025-55182 | CVSS 10.0 Critical | ✅ Patched — next@15.5.20 |
| PostCSS XSS | Moderate | ✅ Fixed — overrides >=8.5.10 |
| nodemailer DoS | High | ✅ Fixed — nodemailer@9.0.3 |

```
npm audit → found 0 vulnerabilities
```

---
## 🌐 Deploy lên Vercel

1. Push code lên GitHub
2. Import repo vào [vercel.com](https://vercel.com)
3. Thêm `MONGODB_URI` trong **Settings → Environment Variables**
4. Deploy 🚀

---

## 📁 Cấu trúc thư mục

```text
Sonify/
├── app/
│   ├── api/               # API Routes (auth, songs, users, feedback, categories)
│   ├── globals.css        # Global styles — CSS variables, glassmorphism, themes
│   ├── layout.tsx         # Root layout — fonts, providers
│   └── page.tsx           # Main page — tab routing, search, charts
├── components/
│   ├── admin/             # AdminMusic, AdminUsers, AdminStats, AdminCategories
│   ├── AdminPanel.tsx
│   ├── AuthModal.tsx
│   ├── ChartSection.tsx
│   ├── FeedbackModal.tsx
│   ├── Header.tsx
│   ├── HomeBanner.tsx
│   ├── PlayerBar.tsx
│   ├── Profile.tsx
│   ├── QueuePanel.tsx
│   ├── Sidebar.tsx
│   ├── SongCard.tsx
│   └── SongGrid.tsx
├── context/               # AuthContext, PlayerContext, ThemeContext, LanguageContext
├── data/                  # constants.ts, file-list.json
├── lib/                   # mongodb.ts — connection pooling
├── models/                # User, Song, Feedback, Category (Mongoose schemas)
├── scripts/               # generate-file-list.mjs
└── public/                # img/, sound/, icons
```

---

## 🗺️ Roadmap & Future Tasks

### 🎨 Styling Migration — Tailwind CSS
> **Trạng thái:** Chưa bắt đầu — ghi nhận để làm sau

**Bối cảnh:**
- Hiện tại toàn bộ styling dùng **CSS thuần** (`globals.css` ~2600 dòng)
- Thư mục `giao dien sua/` (prototype tool) đang dùng **Tailwind v4** + Vite
- Các component mới trong prototype có thể copy sang nếu đã có Tailwind

**Hướng đi đề xuất:**
- **Không migrate toàn bộ** — rủi ro cao, dễ vỡ giao diện đang chạy production
- **Dùng song song**: giữ CSS cũ, component mới viết bằng Tailwind
- Dần dần thay thế từng module: SongCard → Sidebar → PlayerBar → ...
- Ưu tiên dùng `dark:` prefix thay thế hàng chục `[data-theme='light']` trong CSS

**Lợi ích sau khi hoàn thành:**
- Responsive dễ hơn (`md:grid-cols-3` thay vì `@media` thủ công)
- Component từ `giao dien sua/` copy thẳng vào không cần convert
- Code ngắn hơn, dễ maintain hơn

**Cách cài:**
```bash
npm install tailwindcss @tailwindcss/postcss
ti
