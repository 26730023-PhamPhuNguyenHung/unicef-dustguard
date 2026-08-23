# KẾ HOẠCH TRIỂN KHAI REDESIGN DASHBOARD CÁN BỘ DUSTGUARD VN
*(STAFF_DASHBOARD_REDESIGN_PLAN.md)*

## 1. Thiết Kế Hệ Thống Design Tokens & Visual Language (CivicTech Standard)

### Bảng màu chuẩn (Palette Tokens):
- **Primary / Brand**: Seal Red (`#8F1D18` / `#A52620` / `#9f241f` / `#4a0e0c`) — Đại diện cho tính pháp lý, cơ quan quản lý nhà nước.
- **Surface / Background**: Cream White (`#FDFBF7` / `#FAFAF8` / `#F5F3EF`), viền Subtle Border (`#E8E4DD` / `#E2DDD5`).
- **Typography / Ink**: Deep Charcoal Ink (`#231b14` / `#24211E` / `#423c35` / `#6B665F`).
- **Semantic Colors**:
  - `Critical / P1`: Red (`bg-rose-50 text-rose-800 border-rose-200` hoặc `bg-seal-600 text-white`)
  - `Warning / P2`: Amber (`bg-amber-50 text-amber-900 border-amber-200`)
  - `Normal / P3 / Success`: Teal/Green (`bg-teal-50 text-teal-800 border-teal-200`)
  - `Neutral / Info`: Slate/Blue (`bg-cream-100 text-ink-700 border-cream-200`)

### Nguyên tắc thị giác (Visual Principles):
- **Tuyệt đối KHÔNG Glassmorphism**: Toàn bộ bề mặt là nền đặc (solid background), độ tương phản cao, chữ đậm rõ nét.
- **Giảm 50% số Card độc lập**: Chuyển các card con lồng nhau thành các phân vùng bảng (Table rows) hoặc danh sách phẳng (Flat list).
- **Typography Scale**:
  - Page Title: 24–28px (Bold/Black)
  - Section Title: 16–18px (Bold)
  - Table / Body Text: 13–14px (Medium/Regular)
  - Metadata / Badges: 11–12px (Bold/Mono)
  - KPI Numbers: 32–36px (Black/Mono)

---

## 2. Shared Primitives Component Library (`src/modules/staff/components/StaffPrimitives.jsx`)

Bộ component nguyên tử dùng chung cho toàn bộ phân hệ `/staff/*`:
1. `StaffPageHeader`: Header chuẩn với breadcrumbs, tiêu đề, mô tả và action button.
2. `StaffSection`: Khung section chuẩn với padding, border mỏng, background đồng nhất.
3. `StaffSectionHeader`: Tiêu đề khối với icon, tag phân loại và liên kết "Xem tất cả".
4. `StaffMetricCard`: Thẻ KPI chuẩn hóa 3 trạng thái (Normal, Warning, Critical) kèm nhãn biến động.
5. `StaffSegmentedControl`: Bộ lọc tab dạng viên thuốc tối giản, không chiếm diện tích.
6. `StaffStatusBadge` & `StaffRiskBadge`: Huy hiệu trạng thái nhất quán.
7. `StaffDataTable`: Khung bảng dữ liệu responsive hỗ trợ cuộn ngang an toàn.
8. `StaffEmptyState`: Trạng thái dữ liệu rỗng tinh gọn kèm nút CTA khôi phục.
9. `StaffLoadingSkeleton`: Khung tải dữ liệu mô phỏng chính xác grid layout.
10. `StaffErrorState`: Khung thông báo lỗi kết nối kèm nút thử lại.

---

## 3. Bản Đồ Tái Thiết Kế Các Tuyến Đường (`/staff/*`)

| Tuyến đường (`Route`) | Tên màn hình | Cấu trúc tái thiết kế |
|---|---|---|
| `/staff/dashboard` | **Trung tâm Tác nghiệp** | 4 KPI -> Priority Queue (8 col) + Việc của tôi (4 col) -> Case Pipeline 7 bước (Horizontal Strip) -> Risk & GIS Workspace (Split/Tab) -> Sensor Health Summary (4 metrics) |
| `/staff/monitoring` | **Giám sát Tập trung** | 1 Header -> 5 KPI summary -> Segmented Workspace (Danh sách / GIS / Cảm biến / Điểm nóng) -> Bảng dữ liệu đa tiêu chí |
| `/staff/cases` | **Hồ sơ Vụ việc** | Header -> Bộ lọc tiến trình 7 bước -> Bảng hồ sơ vi phạm -> Drawer chi tiết |
| `/staff/cases/:id` | **Chi tiết Vụ việc** | Thông tin công trình -> Nhật ký 7 bước -> Bằng chứng vi phạm -> Quyết định xử lý |
| `/staff/sites` | **Quản lý Công trình** | Thẻ công trình nguy hại -> Bảng giám sát địa bàn -> Chỉ số bụi PM2.5/PM10 |
| `/staff/sites/:id` | **Chi tiết Công trình** | Bản đồ bán kính 200m -> Trạm cảm biến gắn tại site -> Lịch sử thanh tra |
| `/staff/alerts` | **Tình huống & Cảnh báo** | Hàng đợi Triage cảnh báo đỏ -> Phân loại tự động -> Chuyển thành hồ sơ |
| `/staff/complaints` | **Phản ánh Công dân** | Danh sách phản ánh -> Đối chiếu ảnh chụp người dân -> Phân công thanh tra viên |
| `/staff/inspections` | **Thanh tra Hiện trường** | Lập đoàn thanh tra -> Biên bản đo kiểm thực địa -> Ký số SHA-256 |
| `/staff/sla` | **Hạn định SLA & Khắc phục** | Đồng hồ đếm ngược SLA -> Hồ sơ sắp quá hạn -> Báo cáo tuân thủ |
| `/staff/map` | **Bản đồ GIS Giám sát** | Bản đồ số tương tác -> Lớp phủ nhiệt ô nhiễm -> Lọc theo quận/huyện |
| `/staff/legal` (`/staff/ai`) | **AI & Căn cứ Pháp lý** | Tra cứu Nghị định 45/2022/NĐ-CP & 16/2022/NĐ-CP -> Trợ lý soạn thảo văn bản |
| `/staff/settings` | **Cấu hình & Quản trị** | Thiết lập ngưỡng cảnh báo -> Quản lý tài khoản cán bộ -> Nhật ký hệ thống |

---

## 4. Kế Hoạch Kiểm Thử & Nghiệm Thu (5 Tầng)

1. **Level 0 (Targeted Test)**: Tạo và chạy `app/tests/staff-dashboard-redesign.test.js` kiểm thử toàn bộ component tree và luồng dữ liệu.
2. **Level 1 (Verify Changed)**: `npm run verify:changed` sau mỗi lượt cập nhật.
3. **Level 2 (Verify Quick)**: `npm run verify:quick` đảm bảo 209+ unit test và 42+ UI smoke test luôn 100% PASS.
4. **Level 3 (Vite Production Build)**: `npm run build` đảm bảo không có lỗi biên dịch TypeScript/JSX hay CSS.
5. **Level 4 (Full Release Gate)**: `npm run verify` chạy 67 test files với hơn 520 tests.
