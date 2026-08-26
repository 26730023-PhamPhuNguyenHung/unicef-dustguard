# DustGuard VN — Nền Tảng Giám Sát & Đối Chứng Bụi Môi Trường Cho Cộng Đồng (CivicTech)

> **Giải pháp CivicTech thực tế** trao quyền cho Thanh niên, Học sinh - Sinh viên và Người dân ghi nhận bụi công trình quanh trường học/khu dân cư, theo dõi đối chứng Trước - Sau (Before/After) và tạo biên bản chứng cứ minh bạch thúc đẩy các bên liên quan dọn dẹp, che chắn.  
> **Kiến trúc**: 100% Cloudflare Native Serverless (Hono + Cloudflare Worker + Cloudflare D1 SQLite + Cloudflare R2 Storage + React 19).

---

## 1. VÒNG LẶP SẢN PHẨM 3 BƯỚC TINH GỌN (CORE LOOP)

```text
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│  1. GHI NHẬN (30 Giây)   │ ──> │  2. THEO DÕI & ĐỐI CHỨNG │ ──> │  3. BIÊN BẢN CHỨNG CỨ   │
│  Ảnh + GPS + Loại bụi   │     │  Before / After (24-48h)│     │  Gửi BQL / Phường/Trường│
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

1. 📸 **Ghi nhận nhanh (30 giây)**: Chụp ảnh hiện trường, tự động ghim vị trí GPS, chọn nhanh hiện trạng (bụi công trình không che chắn, xe tải làm rơi vãi đất cát, bãi vật liệu không tưới nước, đốt rác lộ thiên). Không bắt buộc tạo tài khoản.
2. 🔄 **Theo dõi & Đối chứng (Before/After)**: Quay lại kiểm tra sau 24h - 48h để đối chiếu xem đơn vị thi công đã khắc phục chưa (Đã cải thiện / Chưa đổi / Xấu hơn).
3. 📄 **Biên bản Chứng cứ Minh bạch (Civic Dossier)**: Tự động xuất trang tóm tắt kèm ảnh đối chứng, mốc thời gian và mã băm SHA-256 chống sửa đổi để gửi Ban Quản lý Công trình hoặc UBND Phường cùng phối hợp giải quyết.

---

## 2. VAI TRÒ TRONG HỆ THỐNG DEMO (DEMO ACCOUNTS)

| Vai Trò | Email Đăng Nhập | Mật Khẩu | Trải Nghiệm Thực Tế |
|---|---|---|---|
| **Người Dân / Học Sinh - Sinh Viên** (`citizen`) | *Không cần tài khoản* | *Không cần* | Mở web là xem được ngay bản đồ điểm bụi, báo bụi nhanh trong 30s, nhận mã tra cứu |
| **Đội Tình Nguyện / CLB Môi Trường** (`community`) | `staff@dustguard.vn` | `DustGuard@2026` | Nhận nhiệm vụ khảo sát, kiểm tra lại hiện trường Before/After, tích lũy giờ tình nguyện |
| **Ban Quản Lý / Nhà Thầu Thi Công** (`contractor`) | `contractor@dustguard.vn` | `DustGuard@2026` | Mở liên kết nhanh, xem phản ánh cụ thể và nộp ảnh chụp khắc phục (che bạt/rửa đường) |
| **Đơn Vị Tiếp Nhận / Cán Bộ Cơ Sở** (`staff`) | `staff@dustguard.vn` | `DustGuard@2026` | Xem danh sách điểm nóng cần xử lý, tải biên bản chứng cứ A4 tổng hợp để nhắc nhở |
| **Quản Trị Kỹ Thuật** (`admin`) | `admin@dustguard.vn` | `DustGuard@2026` | Cấu hình trạm đo, quản lý danh mục địa bàn, seed dữ liệu mẫu |

---

## 3. NGUYÊN TẮC THIẾT KẾ CỐT LÕI (DESIGN PRINCIPLES)

1. **Civic Tech Chân Thực — Không Ảo Tưởng Quyền Lực**:
   - DustGuard **không phải là tòa án hay cơ quan xử phạt**, không thay thế cơ quan nhà nước.
   - DustGuard đóng vai trò **cuốn nhật ký bằng chứng số có toạ độ và thời gian** giúp cộng đồng đối thoại xây dựng và có căn cứ rõ ràng với các bên liên quan.
2. **Zero-IoT Resilience (Cảm biến là tùy chọn)**:
   - Hệ thống hoạt động **100% bằng mắt thường và ảnh chụp** khi không có cảm biến.
   - Cảm biến bụi IoT (ESP32 + PM2.5) là module mở rộng giá rẻ (< $25) dành cho các CLB STEM học đường tự chế để theo dõi xu hướng vi khí hậu.
3. **Giao Diện Sáng — Độ Tương Phản Cao — Tuyệt Đối Không Glassmorphism**:
   - Nền kem `#FDFBF7` trang nhã, chữ mực in `#231B14` sắc nét, dấu mộc đỏ `#9F241F` và xanh ngọc `#0D6F64`.
   - Nền sáng chữ đậm, nền đậm chữ sáng. Nút bấm tối thiểu **44px x 44px**, dùng tốt ngoài trời nắng trên màn hình điện thoại 360px - 430px.
4. **Bảo Mật Quyền Riêng Tư & Chống Spam**:
   - Tự động xóa sạch metadata nhạy cảm trong EXIF ảnh trên thiết bị trước khi tải lên.
   - Tùy chọn ẩn danh 1-chạm khi chụp ảnh, chống spam bằng mã băm thiết bị không lưu số định danh cá nhân.

---

## 4. HƯỚNG DẪN KHỞI CHẠY (QUICK START)

```powershell
# 1. Cài đặt dependencies
npm --prefix app install

# 2. Khởi chạy môi trường phát triển (Web + Cloudflare Worker API)
npm run dev

# 3. Chạy kiểm thử tự động nhanh (Quick Gate < 5s)
npm run verify:quick

# 4. Chạy kiểm thử toàn diện hệ thống (Full Test Suites)
npm run verify:dustguard

# 5. Khởi chạy Sensor Simulator nạp dữ liệu đo đạc thử nghiệm
npm run sensor:simulate

# 6. Khôi phục lại dữ liệu Demo chuẩn
npm run demo:reset
```
