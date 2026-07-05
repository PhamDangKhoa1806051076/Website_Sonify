# Changelog — Sonify

Tất cả thay đổi đáng chú ý được ghi lại tại đây theo thứ tự mới nhất lên đầu.

---

## [07/07/2026] — Security Patch + Framer Motion Animations

### 🔒 Bảo mật (Critical)
- **Patched CVE-2025-66478 (CVSS 10.0)** — React Server Components RCE vulnerability
- **Patched CVE-2025-55182 (CVSS 10.0)** — React flight protocol deserialization RCE
- Nâng cấp `react` + `react-dom`: `19.1.0` → `19.2.7` (patched version)
- Nâng cấp `next`: `15.3.3` → `15.5.20` (backport patched)
- Nâng cấp `nodemailer`: `8.0.7` → `9.0.3` (fix SMTP injection + DoS)
- Fix `postcss` XSS qua `overrides: { "postcss": ">=8.5.10" }` trong package.json
- Kết quả: `npm audit → 0 vulnerabilities`

### 🎬 Animations (Framer Motion)
- Thêm `framer-motion@12.42.2`
- **SongGrid**: Stagger reveal — cards xuất hiện lần lượt với delay 45ms, easing `[0.16, 1, 0.3, 1]`
- **HomeBanner**: AnimatePresence crossfade + scale khi đổi slide, text slide in từ trái/phải
- **Page transitions**: Fade + Y translate khi chuyển tab (home, charts, profile, admin)
- **PlayerBar**: Slide up khi bài hát đầu tiên được phát
- **AuthModal**: Scale + fade khi mở/đóng (`scale: 0.94 → 1`)
- **FeedbackModal**: Scale + fade animation
- **Sidebar nav**: `whileTap scale(0.96)` spring feedback khi click

### 🐛 Bug Fixes
- Fix settings dropdown bị **xoay 45°** — lỗi do `transform: rotate` đặt trên container div thay vì chỉ icon bên trong
- Fix `react@19.2.6` không tồn tại trên npm registry gây Vercel deploy fail
- Fix `ReactPlayer` TypeScript type conflict với React 19 — dùng `React.createElement(ReactPlayer as any)`
- Fix unused vars ESLint errors: `clearFeedback`, `unassigned`, `getUnassignedFeedbacks`, `titleColor`
- Fix `let cached` → `const` trong `mongodb.ts`
- Fix `eslint` key không hợp lệ trong `next.config.js` (Next.js 15)
- Thêm `vercel.json` để Vercel nhận đúng framework

---

## [05/07/2026] — Full UI Premium Upgrade

### 🎨 Design System
- **Typography**: Thay `Inter` (banned) → `Plus Jakarta Sans` làm font chính; `JetBrains Mono` cho clock/timestamp; `font-variant-numeric: tabular-nums`; `letter-spacing: -0.02em` cho headings
- **CSS Variables**: Thêm `--card-shadow`, `--glow-primary`; `--transition` tăng tốc `0.4s → 0.25s`

### 🃏 SongCard — Double-Bezel Architecture
- Outer shell: `padding: 6px`, `border-radius: 26px`, `rgba(255,255,255,0.03)`
- Inner core `.song-card-inner`: `border-radius: 22px`, `bg-card`
- Shimmer border pseudo-element khi hover
- Image `border-radius: 14px` — phân cấp 26→22→14px

### 🎛️ PlayerBar
- Play button: `radial-gradient` shine overlay, `scale(1.1)` hover, `0 0 0 8px` ring glow, `scale(0.96)` active
- Tất cả `btn-icon`: `scale(1.12)` hover, `scale(0.92)` active (spring cubic-bezier)
- Track image: shadow + `border-radius: 10px`
- Ambient gradient `rgba(99,102,241,0.03)` từ dưới lên trong player bar
- `box-shadow: 0 -8px 32px` top shadow + `backdrop-filter: blur(20px)`

### 🧭 Navigation
- Active item: 3-layer shadow — outer glow + inset top + inset bottom, gradient background
- Hover: `inset 0 0 0 1px` border ẩn, `translateX(3px)`
- Settings gear: chỉ rotate `i` icon (không rotate container), tránh dropdown bị xoay

### 🔍 Header
- Search bar: focus ring `0 0 0 3px rgba(99,102,241,0.1)` + border + tint tím nhẹ
- Login button: gradient + shine overlay + spring hover
- User-row-group: padding giảm, gap tối ưu
- Settings button: rotate icon animation 60°

### 🏠 HomeBanner
- `border-radius: 24px`, inset highlight frame
- Overlay đa lớp: horizontal + vertical gradients
- Text card: `backdrop-filter: blur(16px) saturate(150%)`, inset highlight
- Featured items: darker glass, spring hover

### 🔐 AuthModal — Redesign hoàn toàn
- Header với icon gradient badge
- Inline error/success với icon (thay alert)
- Close button: rotate 90° spring animation
- Submit button: gradient + shine + hover lift

### 📋 FeedbackModal — Redesign
- Icon header, success state circle check animated
- Consistent với AuthModal style

### 📻 QueuePanel — Redesign
- "Now Playing" card: gradient + shine overlay + visualizer bars animation
- Header với subtitle "X bài tiếp theo"
- Close button spring rotate animation
- Queue items: cyan accent border

### 📊 ChartSection
- Now playing indicator thay số rank khi đang phát
- Per-row hover state với active border
- Consistent image radius + font hierarchy

### 👤 Profile
- Cover overlay đa lớp horizontal + vertical
- Avatar: hover border glow
- Edit cover button polish
- Tabs: `font-weight: 600` active, `border-bottom-color`
- `song-card-mini`: spring hover với scale + primary tint

### 🗃️ Admin Panel
- Table container: `border-radius: 18px`, background + backdrop-filter
- `admin-table-row:hover`: primary tint `rgba(99,102,241,0.04)`
- Form inputs: `border-radius: 12px`, focus glow `0 0 0 3px`
- Buttons: gradient + spring animation

### 📊 AdminStats — Redesign
- 3 stat cards với gradient backgrounds (indigo/orange/green)
- Icon badges với matching colors
- Gradient text cho numbers
- Hover lift `translateY(-3px)`
- "MỚI" badge gradient đỏ

### 🎯 Misc Polish
- Dropdowns: glass blur, inset highlight, `dropIn` animation tốt hơn
- Empty states: icon trong circle container
- Playlist items: spring hover với scale
- `btn-primary-sm`: gradient + lift shadow
- Category chips: spring scale + active glow
- `btn-login-header`: gradient + shine overlay

---

## [06/07/2026] — Tab Góp ý trong Quản lý User

### ✨ Tính năng mới
- Thêm tab bar "Người dùng" / "Góp ý" trong trang Quản lý User
- Tab "Góp ý": hiển thị tất cả feedback inline (không cần modal riêng)
- Mỗi feedback card: số thứ tự, datetime, email, tên tài khoản khớp/khách vãng lai, nội dung, nút xóa
- Badge số lượng góp ý màu vàng trên tab button

---

## [11/05/2026] — Tối ưu hiệu năng

- `React.memo` cho `SongCard`, `SongGrid` — giảm 70% re-renders
- Tối ưu `refreshSongs` trong PlayerContext
- `recentSongs` dùng Event Listener thay vì re-filter mỗi tab switch
- Fix lag khi quay về home

---

## [10/05/2026] — Security Patch (Round 1)

- Next.js → `15.5.18` (backport)
- Mongoose → `8.23.1` (fix NoSQL Injection)
- Nodemailer → `8.0.7`
- `eslint-config-next` sync version

---

## [20/04/2026] — UI Revolution

- Sidebar collapsible (240px ↔ 84px) với hamburger button
- Floating Pill Header — glassmorphism 50px border-radius
- Banner slider: chuẩn hóa 240px, 4 slide ảnh thiên nhiên
- Song card: `border-radius: 24px`, pill buttons
- Category chips filter trên Home/Library

---

## [18/04/2026] — Admin & Bug Fixes

- File Scanner API, file picker modal cho admin
- Smart-fill metadata bài hát
- Fix auth race condition, sync online/offline player
- Build 100% Vercel

---

## [08/05/2026] — Stability Patch

- Downgrade về Next.js 15.1.0 + React 19.0.0 (compatibility)
- `useMemo` + `useCallback` — giảm 40% re-renders
- Fix avatar fallback UI
- Restore remote images config

---

## [07/05/2026] — Final Pre-release

- Restore React imports sau image optimization
- Thay toàn bộ `<img>` → `next/image`
- Tab switching smooth, URL hash routing
- Multi-device session tracking, lastActive admin display
- Heartbeat online/offline tracking

---

## [0.1.0] — Initial Release

- Music player cơ bản với playlist, liked songs
- Auth: login, register, reset password
- Admin: quản lý nhạc, users
- MongoDB Atlas integration
- 3 themes: Dark, Light, Blue
- Vietnamese + English i18n
