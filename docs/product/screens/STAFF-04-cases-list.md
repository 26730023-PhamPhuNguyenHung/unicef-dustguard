# STF-04 — Danh Sách Hồ Sơ Vụ Việc Xử Lý Vi Phạm (Cases List)

## 1. Screen identity
- **Role**: Staff / Thanh tra môi trường / Pháp chế
- **Route**: `/staff/cases`
- **Component**: `src/apps/staff/pages/cases/CasesListPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx`
- **Navigation entry**: Sidebar Staff ("Hồ sơ vụ việc")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Quản lý và theo dõi toàn bộ hồ sơ vụ việc xử lý vi phạm môi trường theo chu trình 7 bước (DAG), phân loại theo giai đoạn tác nghiệp và cảnh báo thời hạn xử lý SLA 48 giờ.

---

## 2. 7-Step DAG Pipeline Filter Tabs
- **Tất cả (All)**: Toàn bộ hồ sơ trong hệ thống.
- **1. Tiếp nhận (`INTAKE`)**: Phản ánh mới được duyệt thành vụ việc.
- **2. Khảo sát (`SURVEYED`)**: Đã kiểm tra thực địa và lập biên bản.
- **3. Đề xuất (`PROPOSED`)**: Đã lập phương án xử lý / mức phạt.
- **4. Phê duyệt (`APPROVED`)**: Lãnh đạo đã ký duyệt quyết định.
- **5. Khắc phục (`REMEDIATED`)**: Nhà thầu đã nộp ảnh Before/After $le 50	ext{m}$.
- **6. Nghiệm thu (`VERIFIED`)**: Thanh tra đã xác nhận đạt yêu cầu.
- **7. Hoàn tất (`CLOSED`)**: Đóng hồ sơ và lưu trữ kiểm toán.

---

## 3. Table specification
| Cột | Ý nghĩa | Định dạng / Badge | Sắp xếp |
|---|---|---|:---:|
| **Mã vụ việc** | Mã số hồ sơ (VD: `CASE-2026-0042`) | Phông Monospace | Có |
| **Công trình** | Tên công trình vi phạm | Zero Truncate, break-words | Có |
| **Giai đoạn (Stage)** | 1 trong 7 bước DAG | Badge màu theo bước | Có |
| **Điểm rủi ro** | Mức độ nghiêm trọng của vi phạm | 4 Màu chuẩn hóa | Có |
| **Thời hạn SLA** | Đếm ngược 48 giờ xử lý | Đỏ nếu quá hạn, Vàng nếu $le 12	ext{h}$ | Có (Default) |
| **Người thụ lý** | Cán bộ chịu trách nhiệm | Text | Không |
| **Thao tác** | Nút mở hồ sơ | Nút `[Xem chi tiết]` | Không |

---

## 4. Primary action
- **Primary action**: Bấm vào dòng hồ sơ vụ việc $ightarrow$ Chuyển sang `/staff/cases/:id`
- **Secondary**: `[Lọc theo bước DAG]`, `[Lọc hồ sơ quá hạn SLA]`
