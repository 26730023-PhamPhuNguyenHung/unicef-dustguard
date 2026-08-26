# DustGuard VN — Nền Tảng CivicTech Giám Sát & Đối Chứng Môi Trường Cộng Đồng

> **DustGuard là nền tảng CivicTech giúp cộng đồng ghi nhận, đối chứng và theo dõi các vấn đề môi trường bằng dữ liệu có cấu trúc, đồng thời hỗ trợ chuyển những trường hợp phù hợp tới các kênh xử lý hiện hữu.**  
> *(Bụi công trình và chất lượng không khí quanh trường học/khu dân cư là bài toán đầu tiên để kiểm chứng mô hình, trước khi mở rộng thành nền tảng hành động xanh cho thanh thiếu niên).*
>
> **Kiến trúc**: 100% Cloudflare Native Serverless Monolith (Hono + Cloudflare Worker + Cloudflare D1 SQLite + Cloudflare R2 Storage + React 19).

---

## 1. BẢN ELEVATOR PITCH 30 GIÂY (UNICEF HACKATHON)

> *"Khi một bạn trẻ nhìn thấy bụi từ một công trình gần trường học, vấn đề không chỉ là làm sao gửi một phản ánh. Điều khó hơn là ghi nhận đủ bằng chứng, theo dõi xem tình trạng có thay đổi và biết bước tiếp theo nên làm gì.*
>
> *DustGuard là nền tảng CivicTech giúp cộng đồng ghi nhận vấn đề môi trường bằng ảnh, vị trí và dữ liệu đối chứng trước–sau; hỗ trợ hiểu vấn đề, duy trì lịch sử theo dõi và tạo một hồ sơ có cấu trúc.*
>
> *Khi cần sự can thiệp chính thức, DustGuard không thay thế các hệ thống hiện hữu mà hỗ trợ kết nối case tới những kênh như 1022, iHanoi hoặc đơn vị phù hợp. Bụi công trình là bài toán đầu tiên để chúng em kiểm chứng mô hình, trước khi mở rộng thành một nền tảng hành động xanh cho thanh thiếu niên và cộng đồng."*

---

## 2. BỘ 7 NĂNG LỰC NỀN TẢNG (CAPABILITY STACK)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DUSTGUARD VN PLATFORM                                │
├──────────────────────────┬───────────────────────────┬─────────────────────────────────┤
│ 1. Community Action      │ 2. Spatial Data           │ 3. Evidence Management          │
│    • Zero-Login 30s      │    • Tọa độ WGS84 chuẩn   │    • Ảnh đối chứng Before/After │
│    • Chiến dịch CLB      │    • Phân vùng Phường/Xã  │    • Mã hash SHA-256 chống sửa  │
│    • Phân công nhiệm vụ  │    • Heatmap & Geofence   │    • Dossier A4 & QR tra cứu    │
├──────────────────────────┼───────────────────────────┼─────────────────────────────────┤
│ 4. Environmental Knowledge│ 5. Case Tracking          │ 6. Green Credits                │
│    • Cẩm nang giảm ô nhiễm│    • Tách Observation!=Case│   • Giờ tình nguyện thực tế     │
│    • Quy chuẩn kỹ thuật  │    • Follow-up 24h - 48h  │    • Chứng nhận có QR truy vết  │
│    • AI trợ lý tóm tắt   │    • Giám sát tiến độ     │    • Quy đổi theo trường quyết định│
├──────────────────────────┴───────────────────────────┴─────────────────────────────────┤
│ 7. Integration & Civic Handoff: Kết nối hồ sơ có cấu trúc sang 1022 / iHanoi / BQLDA   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. LUỒNG DỮ LIỆU & QUYẾT ĐỊNH XỬ LÝ (ARCHITECTURE DECISION TREE)

```text
                   DUSTGUARD CIVIC TECH PLATFORM
                                 │
                   COMMUNITY & YOUTH PARTICIPATION
                    Observe / Act / Follow-up
                                 │
                        ENVIRONMENTAL SIGNAL
                     Evidence + Location + Time
                                 │
                        DUSTGUARD RECORD
         ┌───────────────────────┼───────────────────────┐
    [Understand]           [Follow-up]             [Green Action]
  Legal / Edu info        Before / After         Verified Hours
  Map & Context          Timeline (24-48h)       Certificates (QR)
                                 │
                   IS EXTERNAL ACTION REQUIRED?
                                 │
               ┌─────────────────┴─────────────────┐
              NO                                  YES
               │                                   │
      [Community Follow-up]               [Prepare Structured Case]
   (CLB tự xử lý / dọn dẹp)               (Gom bằng chứng + Dossier A4)
               │                                   │
      [Mark Resolved & Impact]            [Handoff to 1022 / iHanoi]
                                          (Kênh chính thức tiếp nhận)
                                                   │
                                          [Track Public Outcome]
                                          (Theo dõi kết quả công khai)
                                                   │
                                          [Community Follow-up]
                                          (Thanh niên kiểm tra lại)
```

---

## 4. VAI TRÒ TRONG HỆ THỐNG DEMO (DEMO ACCOUNTS)

| Vai Trò | Tài Khoản Demo | Mật Khẩu | Bản Chất Nghiệp Vụ |
|---|---|---|---|
| **Người Dân / Bạn Trẻ** (`citizen`) | *Không cần đăng nhập* | *Không cần* | Mở web là xem ngay bản đồ điểm bụi, chụp ảnh báo bụi 30s (Zero-Login), nhận mã tra cứu |
| **CLB Môi Trường / Đội Xung Kích** (`community`) | `staff@dustguard.vn` | `DustGuard@2026` | Nhận nhiệm vụ khảo sát, kiểm tra lại hiện trường 24-48h, tích lũy giờ tình nguyện |
| **Ban Quản Lý / Nhà Thầu Thi Công** (`contractor`) | `contractor@dustguard.vn` | `DustGuard@2026` | Tiếp nhận thông tin phản ánh cụ thể, nộp ảnh chụp khắc phục (che bạt/rửa đường) |
| **Điều Phối Viên / Cán Bộ Cơ Sở** (`staff`) | `staff@dustguard.vn` | `DustGuard@2026` | Workspace quản lý hàng đợi, chuẩn bị hồ sơ bàn giao (Dossier A4) chuyển tiếp 1022/iHanoi |
| **Quản Trị Kỹ Thuật** (`admin`) | `admin@dustguard.vn` | `DustGuard@2026` | Cấu hình dữ liệu nền, quản trị danh mục địa bàn, seed dữ liệu mẫu |

---

## 5. NGUYÊN TẮC CỐT LÕI (CORE INVARIANTS)

1. **Ranh Giới Rõ Ràng (Clear Boundaries)**:
   - DustGuard hỗ trợ cộng đồng ghi nhận, đối chứng, hiểu vấn đề và kết nối với các kênh xử lý hiện hữu, **không đóng vai cơ quan nhà nước hay ra quyết định xử phạt**.
   - 1022 / iHanoi là **điểm tích hợp**, không phải định vị mới.
   - Staff Dashboard là **workspace điều phối**, không phải định vị.
2. **Theo Dõi Tiến Trình (Outcome Tracking - Before/After)**:
   - Giá trị cốt lõi nằm ở chuỗi kiểm tra lại xem hiện trạng đã cải thiện hay chưa (Better / Unchanged / Worse).
   - Mục tiêu 24h - 48h là **Community Follow-up Target** (tỷ lệ điểm được cộng đồng quay lại đối chứng), thời gian xử lý của cơ quan phụ thuộc quy trình chính thức.
3. **Zero-IoT Resilience (IoT là nguồn dữ liệu bổ sung)**:
   - Hệ thống vận hành 100% bằng quan sát thực địa và ảnh chụp khi có 0 cảm biến.
   - Cảm biến bụi IoT (ESP32 + PMS7003 < $25) là module mở rộng hỗ trợ CLB STEM học đường thu thập tín hiệu vi khí hậu bổ trợ.
4. **Bảo Toàn Minh Chứng Số & Quyền Riêng Tư**:
   - Lưu trữ mã hash SHA-256 để hỗ trợ phát hiện việc tệp bị thay đổi sau khi ghi nhận (Tamper-evident).
   - Tự động xóa dữ liệu nhạy cảm EXIF trên thiết bị người dùng trước khi gửi ảnh, chống spam bằng device hash không thu thập CCCD/SĐT.
5. **Giao Diện Sáng — Độ Tương Phản Cao — Zero Glassmorphism**:
   - Nền kem `#FDFBF7`, chữ mực in `#231B14`, dấu mộc đỏ `#9F241F`, xanh ngọc `#0D6F64`.
   - Nút bấm tối thiểu **44px x 44px**, hiển thị rõ ngoài trời nắng trên màn hình điện thoại 360px - 430px.
6. **Chi Phí Hạ Tầng Thấp**:
   - Chi phí hạ tầng pilot có thể gần bằng $0 trong hạn mức miễn phí hiện tại của Cloudflare (Workers + D1 + R2 + Static Assets).

---

## 6. HƯỚNG DẪN KHỞI CHẠY (QUICK START)

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
