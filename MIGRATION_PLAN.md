# 🚀 LỘ TRÌNH DI TẢN HỆ THỐNG (MIGRATION PLAN)

Chào bạn! Để đảm bảo dự án **Sonify** hoạt động ổn định và **MIỄN PHÍ VĨNH VIỄN** sau khi Railway hết hạn, chúng ta sẽ thực hiện quy trình di tản sang MongoDB Atlas.

---

## 📋 DANH SÁCH CÔNG VIỆC (CHECKLIST)

| Giai đoạn | Nhiệm vụ | Trạng thái | Người thực hiện |
| :--- | :--- | :---: | :---: |
| **Giai đoạn 1** | Khởi tạo MongoDB Atlas Cluster (Gói M0) | ✅ | Bạn |
| **Giai đoạn 2** | Cấu hình Quyền truy cập & Lấy Connection String | ✅ | Bạn |
| **Giai đoạn 3** | Cập nhật Biến môi trường (Local & Vercel) | ✅ | Antigravity & Bạn |
| **Giai đoạn 4** | Kiểm tra tính nhất quán dữ liệu & Assets | ✅ | Antigravity |
| **Giai đoạn 5** | Triển khai cuối cùng (Final Deploy) | ✅ | Bạn |

---

## 🛠️ HƯỚNG DẪN CHI TIẾT

### Bước 1: Thiết lập MongoDB Atlas (Cơ sở dữ liệu mới)
> [!IMPORTANT]
> Tôi không thể truy cập trình duyệt của bạn, vì vậy bạn cần thực hiện các bước này trên web.

1.  **Đăng ký/Đăng nhập:** Truy cập [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register).
2.  **Tạo Deployment:** 
    *   Chọn gói **M0 FREE**.
    *   Provider: **AWS**.
    *   Region: **Singapore (ap-southeast-1)** để có tốc độ tốt nhất về Việt Nam.
3.  **Tạo Database User:**
    *   Username: `admin` (hoặc tùy ý).
    *   Password: Nhấn **Autogenerate Secure Password** và **COPY LẠI**.
4.  **Network Access:**
    *   Nhấn **Add IP Address**.
    *   Chọn **Allow Access from Anywhere** (0.0.0.0/0) để Vercel có thể kết nối.

### Bước 2: Lấy chuỗi kết nối (Connection String)
1.  Tại tab **Overview**, nhấn nút **Connect**.
2.  Chọn **Drivers** (Node.js).
3.  Copy chuỗi có dạng: `mongodb+srv://admin:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`.

### Bước 3: Cập nhật Môi trường

#### 3.1. Tại máy tính của bạn (Local)
*   Mở file `.env.local`.
*   Thay thế giá trị `MONGODB_URI` bằng chuỗi bạn vừa copy.
*   **QUAN TRỌNG:** Thay `<password>` bằng mật khẩu thực tế bạn đã lưu ở Bước 1.

#### 3.2. Tại Vercel Dashboard
1.  Truy cập [Vercel](https://vercel.com/dashboard) -> Dự án `Sonify`.
2.  **Settings** -> **Environment Variables**.
3.  Chỉnh sửa `MONGODB_URI` với giá trị mới.
4.  Vào tab **Deployments** -> Chọn bản mới nhất -> **Redeploy**.

### Bước 4: Chạy Script chuẩn hóa (Antigravity hỗ trợ)
Sau khi bạn đã đổi URI ở file `.env.local`, hãy báo cho tôi. Tôi sẽ chạy script:
```bash
node scripts/standardize-assets.mjs
```
Script này sẽ giúp:
- Đảm bảo tên file ảnh/nhạc không có dấu, không có khoảng trắng.
- Cập nhật lại đường dẫn chính xác vào Database mới của bạn.

---

## 🆘 NẾU GẶP LỖI?

> [!TIP]
> Nếu bạn thấy thông báo lỗi liên quan đến `Authentication Failed` hoặc `IP Not Allowed`, hãy chụp màn hình hoặc copy lỗi gửi vào đây. Tôi sẽ hỗ trợ bạn fix ngay lập tức!

---

**Bạn đã sẵn sàng chưa? Hãy bắt đầu với Bước 1 và gửi cho tôi chuỗi kết nối (đã thay mật khẩu) nếu bạn muốn tôi giúp kiểm tra kết nối nhé!**
