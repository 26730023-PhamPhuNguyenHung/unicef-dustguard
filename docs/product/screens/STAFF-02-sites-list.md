# STF-02 — Danh Sách 33 Công Trình Xây Dựng (Sites List)

## 1. Screen identity
- **Role**: Staff / Inspector
- **Route**: `/staff/sites`
- **Component**: `src/apps/staff/pages/sites/SitesListPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx`
- **Navigation entry**: Sidebar Staff ("Công trình")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Quản lý tập trung danh mục 33 công trình xây dựng: tra cứu theo quận huyện, lọc theo 4 mức độ rủi ro $R$, theo dõi tình trạng trạm cảm biến và mở hồ sơ chi tiết từng điểm thi công.

---

## 2. Table specification
| Cột | Ý nghĩa | Sắp xếp | Độ rộng gợi ý |
|---|---|:---:|:---:|
| **Mã công trình** | Mã định danh duy nhất (VD: `BD-0001`) | Có | 120px |
| **Tên công trình** | Tên dự án thi công (Zero truncate, hiển thị trọn vẹn) | Có | 250px |
| **Địa chỉ / Quận** | Vị trí địa lý công trình | Có | 200px |
| **Nhà thầu thi công** | Đơn vị chịu trách nhiệm | Không | 180px |
| **Cảm biến IoT** | Tình trạng trạm đo (Hoạt động / Ngoại tuyến) | Không | 120px |
| **Điểm rủi ro $R$** | Điểm số $0-100$ kèm Badge 4 màu | Có (Default Giảm dần) | 140px |
| **Thao tác** | Nút xem hồ sơ chi tiết [Chi tiết] | Không | 100px |

---

## 3. Primary action
- **Primary action**: Bấm vào dòng công trình $ightarrow$ Chuyển sang `/staff/sites/:id`
- **Secondary**: `[Lọc theo rủi ro]`, `[Tìm kiếm theo tên/địa chỉ]`, `[Thêm công trình mới]`
