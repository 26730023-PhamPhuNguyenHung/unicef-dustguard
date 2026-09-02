# DustGuard VN — Current Product State

## 1. What the product currently does
DustGuard VN là nền tảng Công nghệ Công dân (CivicTech) kết nối 5 bên liên quan:
- **Người dân & Thanh niên**: Ghi nhận phản ánh vi phạm bụi công trình trong 30 giây, nộp ảnh bằng chứng mã hóa SHA-256, tích lũy giờ tình nguyện quy đổi tín chỉ đại học (20h = 4.0 tín chỉ) có chứng chỉ QR số.
- **Cán bộ & Thanh tra môi trường**: Quản lý 33 công trình trọng điểm, giám sát dữ liệu cảm biến thời gian thực, điều hành hồ sơ vụ việc theo chu trình 7 bước (DAG), tự động chấm điểm rủi ro $R$, xuất biên bản hành chính chuẩn NĐ 30/2020/NĐ-CP.
- **Nhà thầu thi công**: Đăng nhập nhanh không mật khẩu qua Quick-Token link, xác thực vị trí hiện trường trong phạm vi Geofence $\le 50\text{m}$, nộp báo cáo khắc phục với ảnh đối chứng Trước/Sau.
- **Quản trị viên & Lãnh đạo**: Giám sát toàn bộ dữ liệu hệ thống, phân quyền RBAC, theo dõi audit log, quản lý tự động hóa kiểm toán rủi ro.

## 2. Actual users / roles
1. **Public / Guest**: Khách vãng lai xem bản đồ công khai, tra cứu chỉ số chất lượng không khí, tra cứu chứng chỉ QR.
2. **Citizen / Youth**: Công dân, tình nguyện viên, sinh viên các trường đại học.
3. **Staff / Inspector**: Cán bộ giám sát môi trường đô thị và thanh tra xây dựng.
4. **Contractor**: Đại diện nhà thầu hoặc chỉ huy trưởng công trường.
5. **Admin / Executive**: Quản trị viên hệ thống và lãnh đạo cơ quan ban ngành.

## 3. Actual product areas
- **Public & Landing**: `/`, `/demo`, `/demo/iot`, `/map`, `/guide`, `/youth`
- **Citizen Portal**: `/citizen`, `/citizen/report/new`, `/citizen/reports`, `/citizen/profile`
- **Staff Operations (12 modules)**: `/staff`, `/staff/sites`, `/staff/cases`, `/staff/tasks`, `/staff/monitoring`, `/staff/alerts`, `/staff/reports`, `/staff/profile`, `/staff/notifications`, `/staff/settings`, `/staff/activity`, `/staff/help`
- **Contractor Portal**: `/contractor`, `/contractor/tasks`, `/contractor/cases`, `/contractor/reports`
- **Admin Command Center**: `/admin`, `/admin/users`, `/admin/sites`, `/admin/settings`

## 4. Main workflows
1. **Luồng Ghi nhận & Xử lý phản ánh**: Citizen tạo Observation -> Staff tiếp nhận & xác minh -> Tự động/thủ công tạo Case 7 bước -> Giao nhiệm vụ cho Contractor -> Contractor nộp ảnh Before/After trong Geofence 50m -> Staff nghiệm thu & đóng hồ sơ.
2. **Luồng Tín chỉ Thanh niên**: Tình nguyện viên tham gia ghi nhận/khảo sát -> Hệ thống tính giờ (base + bonus) -> Đạt mốc 20h quy đổi 4.0 tín chỉ -> Xuất chứng chỉ điện tử có chữ ký số & mã QR ISO/IEC 18004.
3. **Luồng Giám sát Cảm biến & Cảnh báo**: Trạm đo gửi chỉ số PM2.5/PM10 -> Edge worker phát hiện vượt ngưỡng -> Kích hoạt cảnh báo thời gian thực -> Cán bộ xử lý hiện trường.

## 5. Actual architecture
- **Frontend**: React 19 SPA, React Router v7, Tailwind CSS v4, Lucide Icons, Leaflet GIS.
- **Edge Backend**: Hono framework chạy trên Cloudflare Workers (20 route modules, 399 endpoints).
- **Persistence**: Cloudflare D1 (SQLite engine, 46 bảng quan hệ).
- **Storage**: Cloudflare R2 bucket lưu trữ ảnh bằng chứng.
- **Security & RBAC**: JWT bearer tokens, SHA-256 Web Crypto hashing, RFC 7807 problem details.

## 6. Data model
Gồm 46 bảng quan hệ chuẩn D1, trong đó có 12 bảng nghiệp vụ cốt lõi: `sites`, `cases`, `observations`, `actions`, `sensors`, `sensor_readings`, `youth_activities`, `youth_certificates`, `draft_documents`, `evidences`, `users`, `alerts`.

## 7. Working features
- 100% 6 Core Feature Epic (F-001 đến F-006) hoạt động trơn tru từ UI -> Edge Worker -> D1 Database -> R2 Storage.
- 28 bộ test in-memory và UI layout smoke pass 100% (237 unit/domain assertions + 42 UI assertions).

## 8. Partial features
- Đa ngôn ngữ (i18n): Giao diện hiện tại tối ưu 100% tiếng Việt chuẩn Civic Tech; bản dịch tiếng Anh ở trạng thái partial.

## 9. Broken features
- Không phát hiện tính năng vỡ/gãy ở Core Paths.

## 10. Visual-only/demo features
- `/demo/iot` (Bộ giả lập phát sinh dữ liệu cảm biến ảo phục vụ trình diễn ban giám khảo).

## 11. Major inconsistencies
- Đã được chuẩn hóa triệt để trong đợt refactor vừa qua: thuật ngữ thống nhất, không còn mâu thuẫn giữa Landing Page và Product.

## 12. Main technical debt
- Tối ưu hóa caching HTTP header trên các endpoint đọc danh mục hành chính (`/api/public/provinces`).

## 13. Main product debt
- Mở rộng thêm danh mục checklist khảo sát môi trường chuyên sâu cho các dự án hạ tầng giao thông ngầm.

## 14. Recommended implementation sequence
1. Tiếp tục duy trì Invariant: Zero Glassmorphism, D1 is SSOT, Zero Mock.
2. Mở rộng thêm tính năng báo cáo tự động theo mẫu biểu mới nếu có văn bản sửa đổi NĐ 30/2020.
