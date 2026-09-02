# Landing Page ↔ Product Parity Matrix — DustGuard VN

Đối chiếu 100% tuyên bố trên Landing Page (`LandingPage.jsx`) với tính năng và dữ liệu thực tế:

| Landing Claim / Section | Product Evidence | Actual Feature & Endpoint | Runtime Verified | Result |
|---|---|---|---|---|
| **Chấm điểm rủi ro bụi đa yếu tố** (4 mức rủi ro, $R = \sum w \cdot S$) | `riskEngine.js`, `sensors.routes.js` | Tính toán R từ diện tích, xe ra vào, che chắn, PM2.5. Hoạt động cả khi 0 cảm biến. | YES (Test pass) | `TRUE` |
| **Ghi nhận vi phạm 30 giây từ công dân** | `ReportNewPage.jsx`, `complaints.routes.js` | Chụp ảnh, gắn tọa độ GPS WGS84, mã băm SHA-256, nộp về D1. | YES (Live DevTools) | `TRUE` |
| **Quy trình xử lý vụ việc 7 bước chuẩn** | `CasesListPage.jsx`, `cases.routes.js` | 7 Bước DAG: Tiếp nhận → Khảo sát → Đề xuất → Duyệt → Khắc phục → Nghiệm thu → Đóng. | YES (Test pass) | `TRUE` |
| **Quy đổi tín chỉ tình nguyện thanh niên** (20h = 4.0 tín chỉ) | `YouthCredits.jsx`, `youth-credits.js` | Tích lũy giờ, bảng xếp hạng trường ĐH, tạo chứng chỉ QR vector SVG chuẩn ISO 18004. | YES (Test pass) | `TRUE` |
| **Cổng nhà thầu không cần mật khẩu (Quick-Token)** | `ContractorTasksPage.jsx`, `contractor-token.js` | Đăng nhập token link, kiểm tra Geofence $\le 50\text{m}$, gửi ảnh Before/After. | YES (Test pass) | `TRUE` |
| **Báo cáo điều hành chuẩn NĐ 30/2020/NĐ-CP** | `StaffReportsPage.jsx`, `executive.routes.js` | Định dạng A4 in ấn hành chính nhà nước, mã băm docHash chống giả mạo. | YES (Test pass) | `TRUE` |
| **Mạng lưới cảm biến IoT chi phí thấp** | `StaffMonitoringPage.jsx`, `IoTDemo.jsx` | Quan trắc PM2.5, PM10, Độ ẩm, Cảnh báo thời gian thực khi vượt ngưỡng QCVN 05:2023. | YES (Live DevTools) | `TRUE` |

### Kết luận đối chiếu:
- Không có tuyên bố giả dối hoặc sai lệch so với capability thực tế của hệ thống.
- Các nút CTA trên Landing Page điều hướng chính xác đến các phân hệ `/citizen/report/new`, `/map`, `/demo`, `/youth`, `/staff`.
