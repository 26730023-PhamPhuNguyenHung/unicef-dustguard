# UI-CONSISTENCY-MATRIX.md — Visual & Feature Consistency Audit Matrix

> Bảng kiểm toán tính nhất quán thị giác, cấu trúc Shell, vị trí Primary CTA, Brand Logo và ngăn ngừa trùng lặp tính năng giữa các trang trong toàn bộ hệ thống DustGuard VN.

---

## 🧭 1. Layout Zones SSOT Standard
Mỗi màn hình trong hệ thống bắt buộc tuân theo 10 phân vùng layout chuẩn:
1. **Global Shell**: `AppLayout`, `PublicLayout`, `CommunityLayout`, `CitizenLayout`, `ContractorLayout`
2. **Brand Logo**: `BrandLogo.jsx` (`full`, `compact`, `mark`)
3. **Header / TopNav**: Navigation menu + User avatar / Quick search
4. **Sidebar / BottomNav**: Điều hướng chính theo Actor (Desktop sidebar / Mobile bottom bar)
5. **PageHeader**: `title`, `description`, `breadcrumbs`, `primaryAction`, `secondaryActions`
6. **Primary CTA**: Nút hành động chính (Ghi nhận mới, Tạo hồ sơ, Thêm công trình, Nộp minh chứng)
7. **Filters / Search**: Thanh tìm kiếm, dropdown trạng thái, bộ lọc ngày
8. **Main Content**: `DataTable SSOT`, `MetricGrid`, `SpatialMap`, `EvidenceGallery`
9. **Context Actions**: Action buttons theo từng dòng dữ liệu hoặc card
10. **Footer**: Thông tin bản quyền, disclaimer pháp lý, hỗ trợ kỹ thuật

---

## 📊 2. Visual & Feature Consistency Audit Matrix

| Route | Actor | Brand Logo | Shell Layout | Page Header | Primary CTA | Data Table | Duplicate Feature? | Status |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| `/` | Public | `full` (lg) | `PublicLayout` | ✅ Hero | [Bản đồ trực tiếp] | N/A | ❌ Không | **DONE** |
| `/login` | Public | `full` (lg) | `PublicLayout` | ✅ Card | [Đăng nhập] | N/A | ❌ Không | **DONE** |
| `/docs/sensor-guide` | Public | `compact` | `PublicLayout` | ✅ Standard | N/A | N/A | ❌ Không | **DONE** |
| `/community` | Community | `full` (md) | `CommunityLayout`| ✅ Hero | [📷 Ghi nhận mới] | N/A | ❌ Không | **DONE** |
| `/community/observe` | Community | `full` (md) | `CommunityLayout`| ✅ Standard | [Gửi ghi nhận GPS] | N/A | ❌ Không | **DONE** |
| `/community/cases` | Community | `full` (md) | `CommunityLayout`| ✅ Standard | [Lọc vụ việc] | ✅ Card List | ❌ Không | **DONE** |
| `/community/cases/:id` | Community | `full` (md) | `CommunityLayout`| ✅ Standard | [Đối chứng Before/After]| N/A | ❌ Không | **DONE** |
| `/community/actions` | Community | `full` (md) | `CommunityLayout`| ✅ Standard | [⚡ Nhận việc] | ✅ Card List | ❌ Không | **DONE** |
| `/community/impact` | Community | `full` (md) | `CommunityLayout`| ✅ Standard | [🏅 Xuất chứng nhận] | N/A | ❌ Không | **DONE** |
| `/contractor` | Contractor | `compact` | `ContractorLayout`| ✅ Dashboard| [Khắc phục khẩn] | ✅ Card List | ❌ Không | **DONE** |
| `/contractor/actions` | Contractor | `compact` | `ContractorLayout`| ✅ Standard | [Lọc yêu cầu] | ✅ DataTable | ❌ Không | **DONE** |
| `/contractor/actions/:id`| Contractor | `compact` | `ContractorLayout`| ✅ Standard | [Nộp ảnh dập bụi 50m] | N/A | ❌ Không | **DONE** |
| `/staff/dashboard` | Staff | `compact` (md)| `AppLayout` | ✅ Dashboard| [Thẩm tra hàng đợi] | ✅ DataTable | ❌ Không | **DONE** |
| `/staff/operations` | Staff | `compact` (md)| `AppLayout` | ✅ Standard | [Xử lý SLA] | ✅ DataTable | ❌ Không | **DONE** |
| `/staff/cases` | Staff | `compact` (md)| `AppLayout` | ✅ Standard | [+ Tạo hồ sơ vụ việc]| ✅ DataTable | ❌ Không | **DONE** |
| `/staff/cases/:id` | Staff | `compact` (md)| `AppLayout` | ✅ Standard | [Xuất hồ sơ A4 1022] | N/A | ❌ Không | **DONE** |
| `/staff/sites` | Staff | `compact` (md)| `AppLayout` | ✅ Standard | [+ Thêm công trình] | ✅ DataTable | ❌ Không | **DONE** |
| `/staff/complaints` | Staff | `compact` (md)| `AppLayout` | ✅ Standard | [Tiếp nhận phản ánh] | ✅ DataTable | ❌ Không | **DONE** |
| `/staff/inspections` | Staff | `compact` (md)| `AppLayout` | ✅ Standard | [+ Lập biên bản] | ✅ DataTable | ❌ Không | **DONE** |
| `/staff/map` | Staff | `compact` (md)| `AppLayout` | ✅ Standard | [Lớp bản đồ GIS] | N/A | ❌ Không | **DONE** |
| `/staff/documents` | Staff | `compact` (md)| `AppLayout` | ✅ Standard | [+ Soạn thảo văn bản]| ✅ DataTable | ❌ Không | **DONE** |
| `/executive/dashboard` | Executive | `compact` (md)| `AppLayout` | ✅ Dashboard| [Chỉ đạo điểm nóng] | N/A | ❌ Không | **DONE** |
| `/executive/heatmap` | Executive | `compact` (md)| `AppLayout` | ✅ Standard | [Lọc rủi ro theo Phường]| N/A | ❌ Không | **DONE** |
| `/executive/reports` | Executive | `compact` (md)| `AppLayout` | ✅ Standard | [Xuất báo cáo PDF] | ✅ DataTable | ❌ Không | **DONE** |

---

## 🚫 3. Feature Duplication Prevention Rules
1. **One Feature = One Domain Owner**: Mỗi chức năng nghiệp vụ chỉ thuộc về một trang chủ quản duy nhất (Ví dụ: Tạo Case thuộc `/staff/cases`, Thêm công trình thuộc `/staff/sites`, Soạn thảo thuộc `/staff/documents`).
2. **Dashboard Shortcuts Only**: Trên Dashboard (`StaffDashboard`, `ExecutiveDashboard`, `CommunityHome`), các nút hành động chỉ đóng vai trò là liên kết điều hướng (Shortcut) dẫn sang trang chủ quản, không dựng luồng thứ hai lặp lại.
3. **No Duplicate CTAs at Page Bottom**: Không render lại các nút hành động chính ở cuối trang nếu đã có trên PageHeader hoặc Floating Bar có chủ đích.
4. **Consistent Terminology**:
   - `Tạo hồ sơ vụ việc` (không dùng "Tạo mới", "Thêm case", "Lập case")
   - `Thêm công trình` (không dùng "Tạo điểm giám sát", "Add site")
   - `Gửi ghi nhận hiện trường` (không dùng "Báo vi phạm", "Tố cáo")
   - `Nộp minh chứng dập bụi` (không dùng "Gửi bằng chứng nhà thầu")
`;
fs.writeFileSync(path.join(docsArchDir, 'UI-CONSISTENCY-MATRIX.md'), auditStatus);

