# Báo Cáo Kiểm Toán Toàn Chu Trình E2E & Khôi Phục Hệ Thống DustGuard VN
**Mã tài liệu**: `DG-AUDIT-2026-E2E`  
**Phiên bản**: `v2.0`  
**Ngày phát hành**: `22/08/2026`  
**Tổ chức**: UNICEF DustGuard VN — Nền tảng Giám sát & Quản trị Môi trường Không khí Trọng điểm  

---

## 1. Tóm Tắt Điều Hành (Executive Summary)

Đợt kiểm toán toàn diện này tiến hành rà soát, tái cấu trúc và xác thực tính toàn vẹn của hệ thống DustGuard VN qua 17 chặng kiểm thử khép kín (Full Flow E2E) từ lớp phần cứng ngoại vi IoT (ESP32 Node) đến hạ tầng biên Cloudflare Workers (Edge Routing), cơ sở dữ liệu phân tán Cloudflare D1 (SSOT Database), động cơ rủi ro giải trình được `DustRiskEngine`, và trung tâm tác nghiệp đa phân quyền (Citizen, Staff, Executive, Contractor).

### Kết quả Tổng quan:
- **Tình trạng ESP32 Node**: Đã phát hiện cổng nạp UART `COM7` (CH340), biên dịch thành công firmware `esp32dev` và nạp trực tiếp qua cổng USB máy tính. Hệ thống hỗ trợ chế độ tự chẩn đoán / dự phòng an toàn (`DUSTGUARD_TEST_MODE`) khi chưa gắn cảm biến vật lý.
- **Tính toàn vẹn Động cơ Rủi ro**: Đã chuẩn hóa toàn bộ thang đo rủi ro về khoảng đóng `[0, 100]`. Sửa triệt để điểm số ngoài giới hạn `154` trong database seed thành `92` (CRITICAL). Bộ kiểm thử Table-Driven đạt **10/10 PASS 100%**.
- **Mock IoT Node Engine**: Script `scripts/mock-iot-node.js` (`npm run mock:node`) hỗ trợ đầy đủ 9 kịch bản chuẩn hóa (`normal`, `moderate`, `high`, `critical`, `flatline`, `offline`, `tampered`, `burst`, `recovery`) có ký số HMAC-SHA256.
- **Xác thực Chu trình E2E**: Script `scripts/verify-full-flow.js` (`npm run verify:full-flow`) đạt **17/17 tiêu chí PASS 100%**.
- **Khôi phục Giao diện & Thương hiệu**: Sửa lỗi runtime `STEP_LABELS is not defined` trên `StaffDashboard.jsx`, khôi phục quy trình 7 bước, chuẩn hóa bảng màu đỏ thương hiệu DustGuard (`seal-600` / `#9F241F`) cho toàn bộ nút hành động chính, tuyệt đối không dùng glassmorphism.

---

## 2. Ma Trận Phân Loại & Xử Lý Lỗi (Defect Classification Matrix)

| Mã lỗi | Mức độ | Hạng mục ảnh hưởng | Mô tả nguyên nhân gốc (Root Cause) | Biện pháp khắc phục đã triển khai | Trạng thái |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **BUG-01** | **P0** | Database Seed & Risk Engine | `dustRiskScore: 154` trong `d1-seed.sql` và `d1-seed-sites.sql` vượt ngoài ngưỡng [0, 100], làm sai lệch thước đo và biến dạng thanh Gauge trên Cổng nhà thầu. | Sửa thành `92` (CRITICAL), bổ sung hàm chuẩn hóa `Math.max(0, Math.min(100, score))` tại tầng hiển thị và `DustRiskEngine`. | **ĐÃ KHẮC PHỤC** |
| **BUG-02** | **P0** | Giao diện Tác nghiệp Staff | Lỗi `ReferenceError: STEP_LABELS is not defined` tại dòng 561 file `StaffDashboard.jsx` gây crash trắng trang điều phối. | Cập nhật render Stepper 7 bước sử dụng mảng chuẩn `PIPELINE_STEPS` và bộ đếm `pipelineCounts`. | **ĐÃ KHẮC PHỤC** |
| **BUG-03** | **P1** | Bảo mật IoT Telemetry | Nguy cơ tấn công Replay Attack và Timestamp Drift khi thiết bị truyền bản tin trễ hơn 5 phút hoặc truyền lại bản tin cũ. | Triển khai xác thực HMAC-SHA256 với Pre-Shared Key, kiểm tra clock drift `< 5 phút` và cơ chế chống trùng lặp timestamp trên bảng `sensor_readings`. | **ĐÃ KHẮC PHỤC** |
| **BUG-04** | **P1** | Nhận diện Bụi Giả (Data Fraud) | Cảm biến bị đơ (Flatline) hoặc ngắt kết nối (Offline) không phân biệt được với không khí sạch. | Bổ sung thuật toán phát hiện Flatline (5 mẫu đo liên tiếp giống nhau giảm điểm tin cậy) và chuyển trạng thái thiết bị sang `FAULTY` / `INACTIVE`. | **ĐÃ KHẮC PHỤC** |
| **BUG-05** | **P2** | Nhận diện Thương hiệu & UI | Nút bấm và thẻ điều hướng sử dụng tone màu xanh ngọc (`accent-600`), làm lu mờ màu đỏ truyền thống của DustGuard VN. | Khôi phục toàn bộ Primary Action, Stepper indicator, Active Tab về màu đỏ Seal Red (`#9F241F` / `seal-600`), chỉ giữ màu xanh lá cho trạng thái an toàn / đạt chuẩn. | **ĐÃ KHẮC PHỤC** |
| **BUG-06** | **P3** | Kiểm thử Tự động E2E | Thiếu kịch bản chạy thử nghiệm đầy đủ từ Mock Node đến Khắc phục hiện trường và Thẩm định hồ sơ. | Xây dựng công cụ `scripts/verify-full-flow.js` kiểm tra tự động 17 chặng với báo cáo trực quan qua CLI. | **ĐÃ KHẮC PHỤC** |

---

## 3. Kiến Trúc 17 Chặng Kiểm Thử E2E (Full Flow Verification)

```
[1. Mock IoT Node (HMAC)] ──► [2. Edge Ingestion API] ──► [3. Anti-Drift / Anti-Replay]
                                                                     │
                                                                     ▼
[6. Sensor Health/Liveness] ◄── [5. D1 SSOT Persistence] ◄── [4. HMAC Signature Verify]
            │
            ▼
[7. DustRiskEngine (0-100)] ──► [8. High-Risk Alert & SLA] ──► [9. Realtime Dashboard Aggregation]
                                                                              │
                                                                              ▼
[12. 7-Step Case State DAG] ◄── [11. SHA-256 Evidence Link] ◄── [10. Citizen GIS Complaint]
            │
            ▼
[13. Contractor Quick Token] ──► [14. SLA Warning Escalation] ──► [15. Recovery & Resolution]
                                                                              │
                                                                              ▼
                                                    [16. Flatline Sensor Detection]
                                                    [17. Stale Device Detection]
```

### Kết Quả Xác Thực 17 Chặng:
1. `[PASS]` **Mock Node HMAC Signature**: Tạo bản tin có chữ ký HMAC-SHA256 hợp lệ với secret SSOT.
2. `[PASS]` **Ingestion API**: Tiếp nhận bản tin vi khí hậu và phản hồi `200/201`.
3. `[PASS]` **Chữ ký Giả mạo**: Trả về `403 Forbidden` khi phát hiện chữ ký sai lệch.
4. `[PASS]` **Chống Replay Attack**: Từ chối bản tin có clock drift vượt 5 phút hoặc trùng timestamp.
5. `[PASS]` **D1 Database Persistence**: Bản ghi nồng độ bụi được lưu trữ an toàn trên D1 SQLite.
6. `[PASS]` **Device Liveness**: Trạng thái cảm biến tự động chuyển sang `ACTIVE` và cập nhật `lastSeen`.
7. `[PASS]` **DustRiskEngine v2.0**: Tính toán điểm rủi ro giải trình được, giới hạn nghiêm ngặt [0, 100].
8. `[PASS]` **Cảnh báo Tự động**: Tự động sinh cảnh báo và thiết lập hạn xử lý SLA 24h khi nồng độ bụi vượt ngưỡng.
9. `[PASS]` **Tổng hợp Dashboard**: Số liệu thống kê thời gian thực phản ánh ngay lập tức trên API tổng hợp.
10. `[PASS]` **Phản ánh Công dân GIS**: Tạo phản ánh kèm tọa độ GPS thực tế.
11. `[PASS]` **Minh chứng Chống Giả mạo**: Khởi tạo mã băm mật mã SHA-256 (64 ký tự hex) gắn với ảnh hiện trường.
12. `[PASS]` **Quy trình Thanh tra 7 bước**: Chuyển trạng thái tuân thủ nghiêm ngặt DAG (`SCREENING` -> `PREPARING` -> `DECISION_ISSUED` -> `ON_SITE` -> `REPORTING` -> `APPRAISING` -> `COMPLETED`).
13. `[PASS]` **Zero-Login Quick Token**: Tạo mã truy cập 1-Click cho nhà thầu phản hồi trong < 15 giây.
14. `[PASS]` **Cảnh báo Quá hạn SLA**: Phân loại trạng thái khẩn khi thời gian xử lý vi phạm chậm trễ.
15. `[PASS]` **Phục hồi & Giảm rủi ro**: Điểm rủi ro giảm dần khi các bản tin đo kiểm trở về mức an toàn.
16. `[PASS]` **Phát hiện Cảm biến Đơ (Flatline)**: Ghi nhận sự bất thường khi giá trị đo không đổi qua 5 chu kỳ.
17. `[PASS]` **Phát hiện Cảm biến Mất tín hiệu (Offline)**: Phân biệt rõ giữa không khí trong lành và trạm quan trắc mất kết nối.

---

## 4. Kết Luận & Hướng Dẫn Vận Hành

Hệ thống đã đạt đầy đủ tiêu chuẩn sẵn sàng phát hành (Production Ready) với tỷ lệ kiểm thử thành công 100% trên toàn bộ các tầng logic.
- **Để chạy giả lập thiết bị IoT**: Sử dụng lệnh `npm --prefix app run mock:node -- --scenario critical`
- **Để kiểm tra lại toàn chu trình E2E**: Sử dụng lệnh `npm --prefix app run verify:full-flow`
- **Để nạp firmware ESP32 khi có cảm biến mới**: Sử dụng lệnh `pio run -d firmware -t upload --upload-port COM7`
