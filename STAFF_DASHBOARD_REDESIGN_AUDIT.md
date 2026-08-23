# BÁO CÁO AUDIT TOÀN DIỆN DASHBOARD CÁN BỘ DUSTGUARD VN
*(STAFF_DASHBOARD_REDESIGN_AUDIT.md)*

Hệ thống: **DustGuard VN — Trung tâm Điều phối & Giám sát Môi trường Không khí Đô thị**  
Đối tượng sử dụng: Cán bộ Thanh tra Môi trường, Cán bộ Tiếp nhận Xử lý Vi phạm, Đội phản ứng nhanh cấp Quận/Huyện.

---

## 1. Audit Information Architecture (IA)

### Hiện trạng:
- **Trùng lặp phân cấp**: Nhiều đường dẫn trỏ về cùng một trang (`/staff/alerts` vs `/staff/incidents`, `/staff/ai` vs `/staff/legal`), tạo sự nhập nhằng trong điều hướng.
- **Sidebar bị cắt chữ**: Độ rộng sidebar co giãn tự động hoặc cố định không đồng đều, dẫn đến việc chữ bị co ngắn thành `Tổng quan Tác n...`.
- **Phân nhóm chưa sát luồng công tác GovTech**: Hiện đang chia thành các nhóm chung chung, chưa làm nổi bật 5 khối tác nghiệp:
  1. `TỔNG QUAN`: Trung tâm tác nghiệp (`/staff/dashboard`)
  2. `GIÁM SÁT`: Giám sát tập trung (`/staff/monitoring`), Công trình (`/staff/sites`), Bản đồ GIS (`/staff/map`), Thiết bị IoT (`/staff/alerts` / `/staff/monitoring?tab=sensors`)
  3. `XỬ LÝ`: Tình huống & Cảnh báo (`/staff/alerts`), Phản ánh công dân (`/staff/complaints`), Thanh tra hiện trường (`/staff/inspections`), Hồ sơ vụ việc (`/staff/cases`)
  4. `TUÂN THỦ`: Hạn định SLA & Khắc phục (`/staff/sla`), AI & Căn cứ Pháp lý (`/staff/legal`)
  5. `HỆ THỐNG`: Cấu hình & Quản trị (`/staff/settings`)
- **Vị trí của AI**: AI hiện được đặt như một phân hệ độc lập, nhưng thực tế cán bộ cần AI hỗ trợ trực tiếp bên trong từng bước (AI soạn biên bản, AI tóm tắt vụ việc, AI đối chiếu Nghị định 45/2022/NĐ-CP).

### Đề xuất IA mới:
- Đặt AI như một Action tích hợp trong từng màn hình hồ sơ, đồng thời duy trì trang "Căn cứ Pháp lý & Hỗ trợ AI" trong nhóm `TUÂN THỦ`.
- Khóa cố định chiều rộng Sidebar Desktop 256px, icon chuẩn SVG 20x20px, label rõ ràng.

---

## 2. Audit Layout & Visual Hierarchy

### Hiện trạng:
- **Card lồng Card (Card Nesting Hell)**: Xuất hiện cấu trúc `Card > Card > Card`, mỗi card lại có viền và màu nền khác nhau, làm mất phân cấp thị giác.
- **Bố cục dọc kéo dài vô tận**: Trang Overview kéo dài hơn 2000px với 7-8 section nối tiếp nhau. Cán bộ phải cuộn chuột liên tục để tìm thông tin.
- **Lệch tỷ lệ nghiêm trọng (Layout Distortion)**: Module "Danh sách việc cần làm trong ngày" bị đặt trong cột hẹp bên phải dưới dạng 3 cột lộn xộn, dẫn đến việc tiêu đề bị ép xuống thành 1 từ mỗi dòng (`Danh \n sách \n Việc \n Cần...`).
- **Khoảng trắng mất kiểm soát**: Khi dữ liệu rỗng (0 items), bản đồ hiển thị khung xám 350-500px chỉ với 1 dòng chữ "Chưa có tọa độ công trường".
- **Visual Noise**: Quá nhiều badge màu sắc đối chọi (đỏ, vàng, xanh lá, tím, hồng, cam) nằm rải rác mà không mang ý nghĩa cảnh báo rõ ràng.

### Đề xuất Layout mới:
- Áp dụng hệ thống Grid 12 cột chuẩn:
  - KPI Cards: 4 cột đều nhau (Span 3 mỗi card).
  - Main Operational Area: Cột trái (Span 8) cho **Priority Queue**, Cột phải (Span 4, min-width 320px) cho **Việc của tôi (My Tasks)**.
  - Case Pipeline 7 bước: Chuyển thành **Horizontal Status Strip** nhỏ gọn (chiều cao 110-130px), click từng bước để lọc trực tiếp.
  - Risk & GIS Workspace: Tích hợp chế độ Split View / Tab View gọn gàng.
  - Sensor Health Summary: Thu gọn thành 4 metric chips tinh giản ở chân trang.

---

## 3. Audit Operational UX (Tiêu chí 5 Giây)

### Hiện trạng:
Cán bộ mở dashboard phải mất hơn 30 giây mới nắm được tình hình vì:
1. Không biết việc nào là khẩn cấp nhất phải làm trước.
2. Không biết hồ sơ nào sắp quá hạn SLA trừ khi cuộn xuống giữa trang.
3. Các con số KPI không có khả năng click drill-down trực tiếp đến trang đã filter.

### Đề xuất Tác nghiệp mới (Cán bộ trả lời trong ≤ 5s):
1. **Hôm nay có vấn đề gì?** -> Nhìn 4 thẻ KPI đầu trang (Hồ sơ cần xử lý, Sắp/quá hạn SLA, Cảnh báo cần xác nhận, Công trình rủi ro cao).
2. **Việc nào cần xử lý trước?** -> Xem ngay bảng **Priority Queue** ở vị trí trung tâm, sắp xếp theo mức độ ưu tiên (P1 Khẩn cấp, P2 Ưu tiên cao, P3 Theo dõi) kèm nút `[Xử lý ngay →]`.
3. **Nhiệm vụ cá nhân trong ngày?** -> Nhìn sang cột "Việc của tôi" bên phải, có thời hạn và check-off ngay khi xong.
4. **Hồ sơ đang ở giai đoạn nào?** -> Nhìn thanh Pipeline 7 bước ngang, click để mở nhóm hồ sơ tương ứng.

---

## 4. Audit Frontend Architecture

### Hiện trạng:
- Các trang sử dụng các class Tailwind tự do, không có quy chuẩn về padding, margin, border-radius giữa các trang (`StaffDashboard` dùng `p-5`, `StaffMonitoring` dùng `p-4`, `StaffSites` dùng `p-6`).
- Lặp lại code Skeleton Loader và Error Banner ở hơn 10 file khác nhau.
- CSS hardcoded width làm vỡ bố cục trên tablet và mobile.

### Đề xuất Architecture mới:
- Tạo bộ **Staff Primitives** dùng chung:
  - `StaffApplicationShell`: Shell khung chuẩn bao gồm Sidebar cố định, Topbar và Page Header.
  - `PageHeader`: Tiêu đề trang, mô tả ngắn, badge hệ thống và khu vực Action Buttons bên phải (chiều cao tối đa 88px).
  - `Section` / `SectionHeader`: Khung phân vùng đồng nhất với viền mỏng `border-cream-200`, nền trắng hoặc kem nhạt.
  - `MetricCard` / `MetricGrid`: Thẻ KPI chuẩn hóa.
  - `SegmentedFilter`: Bộ lọc tab dạng viên thuốc tinh tế.
  - `DataTable`: Bảng dữ liệu chuẩn với hover, zebra striping nhẹ và action links.
  - `StatusBadge` / `RiskBadge`: Huy hiệu trạng thái kiểm soát theo thang màu DustGuard.
  - `EmptyState` / `LoadingSkeleton` / `ErrorState`: Xử lý 100% các trạng thái tải và dữ liệu rỗng.

---

## 5. Audit Data State & Resilience

### Hiện trạng:
- Khi backend D1 trả về mảng rỗng `[]` (hệ thống mới khởi tạo hoặc dữ liệu demo đã xóa), một số màn hình bị trống hoác hoặc hiển thị thanh tiến độ 0% trông như lỗi hệ thống.
- Thiếu các nút CTA phục hồi nhanh trên Empty State (ví dụ: nút `[Thêm công trình mới]`, `[Tạo hồ sơ đầu tiên]`).

### Đề xuất Data State mới:
- 100% null-safety cho toàn bộ các thuộc tính `sites`, `cases`, `alerts`, `sensors`, `tasks`.
- Empty State chuẩn hoá: Icon phù hợp + Tiêu đề ngắn + 1 câu hướng dẫn + Nút CTA hành động.
- Loading Skeleton chuẩn xác mô phỏng đúng layout 12 cột thực tế, không gây hiện tượng giật cục (layout shift).
