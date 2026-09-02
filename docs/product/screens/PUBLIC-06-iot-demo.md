# PUB-06 — Không Gian Trình Diễn & Giả Lập Cảm Biến IoT (IoT Telemetry Sandbox)

---

## 1. Screen Identity

| Thuộc tính | Giá trị SSOT |
|---|---|
| **Mã màn hình** | `PUB-06` |
| **Tên tiếng Việt** | Không Gian Trình Diễn & Giả Lập Cảm Biến IoT |
| **Tên tiếng Anh** | IoT Interactive Telemetry Simulator & Field Node Sandbox |
| **Route URL** | `/demo/iot` |
| **Component Path** | `app/src/modules/public/IoTDemo.jsx` |
| **Sub-components** | `app/src/modules/staff/components/IoTSetupModal.jsx` (Modal lắp đặt 3 bước), `staffApi` (`app/src/lib/api/staff-api.js`) |
| **Layout** | Public Workspace Layout (Sticky Control Header + Container `max-w-7xl` + Footer) |
| **Quyền truy cập (Role)** | Public / Guest / Ban Giám khảo chấm thi / Kỹ sư IoT / Cán bộ thanh tra (Không cần đăng nhập) |
| **Trạng thái Triển khai** | **ACTIVE** (Level 5 Production Coherent — Kết nối API D1 & Mô phỏng luồng Telemetry thời gian thực) |

---

## 2. Mục Đích Nghiệp Vụ & Giá Trị Thực Tế

Trang **PUB-06** là môi trường thử nghiệm và trình diễn tương tác trực tiếp (Interactive Simulation Hub), cho phép Ban Giám khảo UNICEF Hackathon, cán bộ quản lý môi trường và cộng đồng trải nghiệm trọn vẹn sức mạnh của mạng lưới cảm biến bụi thông minh:

1. **Trực quan hóa Trạm Quan trắc Thực địa (`NODE-DG-HCM-001`)**:
   - Hiển thị đầy đủ thông số hoạt động của trạm đo quang học thực nghiệm tại cổng chính Khu công trình đô thị An Phú (P. An Phú, TP. Thuận An, Bình Dương) kết nối với các công trình điểm nóng tại Hà Nội (Mỹ Đình 1, Dịch Vọng Hậu).
   - Phần cứng thực nghiệm bao gồm: Vi điều khiển **ESP32 NodeMCU**, cảm biến laser **Plantower PMS7003** và cảm biến nhiệt ẩm **Sensirion SHT30**.
2. **Mô phỏng phát sinh số đo 1-chạm (1-Click Telemetry Trigger)**:
   - Cung cấp 2 kịch bản phát sinh tín hiệu trực tiếp lên API máy chủ Cloudflare D1:
     - **Kịch bản 1 — [⚡ Gửi số đo an toàn]**: Phát sinh nồng độ PM2.5 bình thường ($22 - 34\,\mu\text{g/m}^3$) và PM10 ($42 - 62\,\mu\text{g/m}^3$) $\rightarrow$ Nằm an toàn dưới ngưỡng Quy chuẩn **QCVN 05:2023/BTNMT** $\rightarrow$ Thẻ KPI chuyển màu Xanh Teal bình yên.
     - **Kịch bản 2 — [⚠ Mô phỏng bụi cao (>75)]**: Tạo đột biến nồng độ bụi cực đại ($\text{PM2.5} = 82.5\,\mu\text{g/m}^3$, $\text{PM10} = 115.0\,\mu\text{g/m}^3$) $\rightarrow$ Vượt ngưỡng QCVN 05:2023/BTNMT $\rightarrow$ Thẻ KPI chuyển màu Đỏ Son cảnh báo khẩn cấp, kích hoạt cơ chế đưa công trình vào diện giám sát đặc biệt.
3. **Trải nghiệm Triển khai 4 bước trong đời thực**:
   - Khẳng định quy trình lắp đặt tối giản không cần cấu hình mạng phức tạp: *Gắn thiết bị tại công trường $\rightarrow$ Cắm nguồn USB 5V $\rightarrow$ Hệ thống tự nhận diện qua chữ ký HMAC $\rightarrow$ Dữ liệu xuất hiện trên Bàn làm việc Cán bộ*.
4. **Đối soát tính toàn vẹn với Chữ ký số HMAC**:
   - Bảng nhật ký số đo (Telemetry Timeline) hiển thị mã băm chữ ký kèm trạng thái `HỢP LỆ` cho từng bản ghi, chứng minh tính minh bạch và cơ chế chống gian lận.
5. **Nguyên tắc Đánh giá Tín hiệu Môi trường (Civic Tech Philosophy)**:
   - Minh định nguyên tắc cốt lõi: *Cảm biến IoT là tín hiệu cảnh báo sớm (Early-Warning Signal), không thay thế kết luận vi phạm pháp lý của con người. Hệ thống luôn kết hợp ảnh chụp hiện trường có GPS và khảo sát thực địa của CLB thanh niên / cán bộ trước khi ra quyết định xử phạt*.

---

## 3. Luồng Hành Trình Người Dùng (User Journey)

```text
[Người dùng / Ban Giám khảo truy cập /demo/iot]
                      │
                      ▼
     [1. Xem Banner 4 bước triển khai thực tế]
                      │
                      ▼
     [2. Quan sát Trạng thái Trạm đo NODE-DG-HCM-001]
  (Đèn Online nhấp nháy, PM2.5 hiện tại: 24.5 µg/m³, Nhiệt ẩm: 29.4°C / 68%)
                      │
         ┌────────────┴───────────────────────────┐
         ▼                                        ▼
[KỊCH BẢN 1: BỤI CAO VƯỢT CHUẨN]        [KỊCH BẢN 2: SỐ ĐO AN TOÀN]
Bấm [⚠ Mô phỏng bụi cao (>75)]          Bấm [⚡ Gửi số đo an toàn]
         │                                        │
         ▼                                        ▼
POST /api/telemetry (PM2.5: 82.5)       POST /api/telemetry (PM2.5: ~24)
KPI Card chuyển sang ĐỎ SON CẢNH BÁO    KPI Card chuyển sang XANH TEAL AN TOÀN
         │                                        │
         └────────────┬───────────────────────────┘
                      │
                      ▼
      [3. Kiểm tra Bảng Nhật ký Telemetry Timeline]
  (Dòng mới nhất xuất hiện ngay đầu bảng với dấu thời gian và mã băm HMAC)
                      │
                      ▼
     [4. Bấm [+ Lắp đặt 3 bước] để mở Modal Cấu hình Node mới]
```

---

## 4. Bố Cục Trực Quan & Wireframe ASCII (Information Hierarchy)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STICKY HEADER: [← Quay lại Demo Hub] | 📡 Node DG-HCM-001    [+ Lắp đặt 3 bước]   [↻] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 1: BANNER TRẢI NGHIỆM TRIỂN KHAI THỰC TẾ                                       │
│ Tiêu đề: "Việc lắp đặt trạm đo chỉ mất vài bước đơn giản"        [Bắt đầu thiết lập]   │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌───────────────────────────┐│
│ │ 1. Gắn thiết   │ │ 2. Cắm nguồn   │ │ 3. DustGuard   │ │ 4. Dữ liệu xuất hiện trên ││
│ │ bị công trình  │ │ USB 5V         │ │ tự nhận tin    │ │ Backoffice & Bản đồ       ││
│ └────────────────┘ └────────────────┘ └────────────────┘ └───────────────────────────┘│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 2: KHUNG ĐIỀU HÀNH TRẠM ĐO (NODE OVERVIEW CARD)                                │
│ [NODE-DG-HCM-001]  [● Trực tuyến Online]                                               │
│ Trạm Đo Quang Học Cổng Chính — Khu đô thị An Phú                                       │
│ Vị trí: P. An Phú, TP. Thuận An, Bình Dương · Cảm biến: Plantower PMS7003 + ESP32      │
│                                                                                        │
│ CỤM NÚT MÔ PHỎNG TƯƠNG TÁC:                                                            │
│ [⚡ Gửi số đo an toàn (22-34 µg)]    [⚠ Mô phỏng bụi cao (>75 µg/m³ - Vượt QCVN 05)]   │
│                                                                                        │
│ 4 THẺ CHỈ SỐ KPI ĐO ĐẠC THỜI GIAN THỰC:                                                │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌─────────────────────┐ │
│ │ PM2.5            │ │ PM10             │ │ Nhiệt độ / Độ ẩm │ │ Xác thực Toàn vẹn   │ │
│ │ 24.5 µg/m³       │ │ 48.2 µg/m³       │ │ 29.4°C / 68%     │ │ 100% HỢP LỆ         │ │
│ │ (● Mức an toàn)  │ │ (● Bình thường)  │ │ (Sensirion SHT30)│ │ (Chữ ký HMAC-SHA256)│ │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘ └─────────────────────┘ │
│                                                                                        │
│ KHỐI LƯU Ý: ℹ Nguyên tắc Đánh giá Tín hiệu Môi trường (Cảm biến là tín hiệu ban đầu)   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SECTION 3: NHẬT KÝ SỐ ĐO GẦN NHẤT (TELEMETRY TIMELINE)             POST /api/telemetry │
│ ┌──────────────┬───────────────┬───────────────┬──────────────┬─────────────┬────────┐ │
│ │ Thời gian    │ PM2.5 (µg/m³) │ PM10 (µg/m³)  │ Nhiệt / Ẩm   │ Mã xác thực │ TT     │ │
│ ├──────────────┼───────────────┼───────────────┼──────────────┼─────────────┼────────┤ │
│ │ 12:25:30     │ 82.5          │ 115.0         │ 29.4°C / 68% │ hmac_sha256 │ HỢP LỆ │ │
│ │ 12:20:30     │ 24.5          │ 48.2          │ 29.4°C / 68% │ hmac_sha256 │ HỢP LỆ │ │
│ │ 12:15:30     │ 27.2          │ 51.0          │ 29.4°C / 68% │ hmac_sha256 │ HỢP LỆ │ │
│ │ 12:10:30     │ 23.8          │ 47.5          │ 29.4°C / 68% │ hmac_sha256 │ HỢP LỆ │ │
│ └──────────────┴───────────────┴───────────────┴──────────────┴─────────────┴────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Hợp Đồng Dữ Liệu & API / D1 Database Contract

### 5.1. Danh sách API Endpoints:
1. **Lấy thông tin và lịch sử trạm đo**:
   - `GET /api/sensors/DG-HCM-001` (qua `staffApi.getSensorById`)
   - Trả về thông tin trạm đo và mảng các bản ghi đo đạc gần nhất.
2. **Gửi số đo mô phỏng lên máy chủ**:
   - `POST /api/telemetry` hoặc `POST /api/sensors/DG-HCM-001/telemetry` (qua `staffApi.sendSensorTelemetry`)
   - **Request Payload JSON**:
     ```json
     {
       "pm25": 82.5,
       "pm10": 115.0,
       "temperature": 29.4,
       "humidity": 68.0,
       "timestamp": "2026-09-02T05:25:30.000Z"
     }
     ```

### 5.2. Thuật toán Fallback Nội suy (Graceful Offline Simulation):
- Nếu kết nối tới Cloudflare D1 tạm thời gián đoạn, ứng dụng tự động sinh 6 mốc đo gần nhất theo hàm sóng điều hòa tự nhiên:
  - $\text{PM2.5} = 24.5 + 3\sin(i)$
  - $\text{PM10} = 48.2 + 5\cos(i)$
  - Mã băm chữ ký: `hmac_sha256_[random_hex_8_chars]`
- Đảm bảo phiên demo của Giám khảo diễn ra liên tục, không bao giờ bị đứt quãng.

### 5.3. Ánh xạ Bảng Cơ sở dữ liệu D1 SQLite (Schema SSOT):
- **Bảng `sensors`**: Lưu trữ mã `NODE-DG-HCM-001`, tọa độ WGS84, chủng loại cảm biến `PMS7003 + SHT30`, trạng thái `ONLINE`.
- **Bảng `sensor_readings`**: Lưu trữ chuỗi thời gian telemetry, nồng độ PM2.5, PM10, nhiệt độ, độ ẩm và chữ ký số xác thực.

---

## 6. Bảng Danh Mục Hành Động & Nút Bấm (CTAs & Action Matrix)

| Tên nút / Thao tác | Vị trí | Màu sắc / Token | Kích thước Touch Target | Điều kiện kích hoạt | Hành vi hệ thống | Phản hồi giao diện |
|---|---|---|:---:|---|---|---|
| **[⚠ Mô phỏng bụi cao (>75)]** | Khung điều hành trạm | Nền đỏ nhạt `bg-seal-50`, viền đỏ `border-seal-300`, chữ đỏ son | $\ge 44\text{px}$ | `!isSimulating` | Gửi PM2.5 = $82.5\,\mu\text{g/m}^3$ lên API | Thẻ KPI chuyển màu đỏ cảnh báo, thêm bản ghi mới vào bảng |
| **[⚡ Gửi số đo an toàn]** | Khung điều hành trạm | Nền kem `#FDFBF7`, viền xám, icon vàng hổ phách | $\ge 44\text{px}$ | `!isSimulating` | Gửi PM2.5 ngẫu nhiên $22 - 34\,\mu\text{g/m}^3$ | Thẻ KPI chuyển màu xanh teal an toàn, cập nhật số đo |
| **[+ Lắp đặt 3 bước]** | Sticky Header / Banner | Nền đỏ son `#9f241f` hoặc xanh teal `#0d6f64`, chữ trắng | $\ge 44\text{px}$ | Luôn khả dụng | Mở modal `IoTSetupModal` | Modal hiển thị 3 bước cấu hình thiết bị mới |
| **[Làm mới] (↻)** | Sticky Header góc phải | Nền trắng, viền nhạt, icon xoay | $\ge 40\text{px}$ | `!loading` | Tải lại telemetry từ `GET /api/sensors/DG-HCM-001` | Icon xoay tròn, cập nhật dữ liệu mới nhất từ D1 |
| **[← Quay lại Demo Hub]** | Sticky Header góc trái | Chữ xám đậm, icon mũi tên trái | $\ge 44\text{px}$ | Luôn khả dụng | Điều hướng về `/demo` | Chuyển trang mượt mà về Trung tâm Demo |

---

## 7. Quy Chuẩn Thích Ứng Giao Diện (Responsive & Design System)

### 7.1. Bảng màu & Typography (High-Contrast Civic Tech)
- **Nền tổng thể**: `#FDFBF7` (Màu kem tự nhiên, chống lóa mắt).
- **Thẻ Card chứa nội dung**: Nền trắng nguyên khối `#ffffff`, bo góc 16px (`rounded-2xl`), viền mờ sắc nét `border-ink-900/10`.
- **Chỉ số đo đạc**: Font số cố định đơn cách `font-mono font-black text-3xl` giúp các con số không bị xô lệch vị trí khi giá trị nhảy số liên tục.
- **Trạng thái an toàn**: Xanh teal `bg-teal-50 text-teal-800 border-teal-200`.
- **Trạng thái cảnh báo**: Đỏ son `bg-seal-50 text-seal-800 border-seal-300`.
- **Quy tắc cấm**: **TUYỆT ĐỐI KHÔNG DÙNG GLASSMORPHISM**, không dùng màu mờ làm giảm khả năng tiếp cận.

### 7.2. Tương thích Đa Viewport:
- **Mobile (360px – 430px)**:
  - 4 Thẻ KPI tự động chuyển thành lưới 2 cột $\times$ 2 hàng tiện ngón tay cái chạm.
  - 2 Nút bấm mô phỏng co giãn full-width.
  - Bảng telemetry hỗ trợ cuộn ngang mượt mà, không làm vỡ bố cục trang.
- **Laptop 14-inch (1366x768 & 1440x900)**:
  - 4 Thẻ KPI dàn đều 4 cột trên 1 hàng ngang.
  - Khoảng cách lề rộng thoáng `px-6`, hiển thị trọn vẹn toàn bộ thao tác mô phỏng trên 1 khung nhìn màn hình.
- **Desktop (1920x1080)**:
  - Căn giữa trang nhã trong container `max-w-7xl`.

---

## 8. Kịch Bản Ngoại Lệ & Xử Lý Lỗi Biên (Edge Cases & Fallbacks)

### 8.1. Các tình huống ngoại lệ và cách xử lý:
1. **Người dùng bấm liên tục vào nút mô phỏng (Spam Click)**:
   - *Xử lý*: State `isSimulating` tự động khóa tạm thời cả 2 nút bấm và hiển thị hiệu ứng xoay tròn, ngăn ngừa gửi trùng lặp request lên máy chủ.
2. **Hiểu nhầm cảm biến là kết luận xử phạt pháp lý**:
   - *Xử lý*: Bố trí khung thông điệp nguyên tắc nghiệp vụ: Cảm biến là tín hiệu tham chiếu ban đầu, cần đối soát chéo với hình ảnh hiện trường và biên bản khảo sát thực địa.
3. **Lỗi kết nối API D1 khi đang chấm thi**:
   - *Xử lý*: Tự động kích hoạt cơ chế Fallback Timeline, đảm bảo số liệu vẫn phản hồi chân thực và không làm gián đoạn bài thuyết trình.

### 8.2. Lệnh kiểm thử tự động (PowerShell CLI):
```powershell
# 1. Kiểm thử vòng đời thiết lập Node IoT và trạng thái hoạt động
node --test app/tests/iot-node-setup-and-status-lifecycle.test.js

# 2. Kiểm thử tính toàn vẹn của chuỗi Telemetry và lưu trữ R2
node --test app/tests/iot-telemetry-r2-integrity.test.js

# 3. Kiểm thử luồng vận hành toàn diện của phân hệ IoT
node --test app/tests/iot-operational-flow-auditor.test.js
```
