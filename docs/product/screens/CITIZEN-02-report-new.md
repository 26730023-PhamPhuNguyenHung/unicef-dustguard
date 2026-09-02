# CIT-02 — Tạo Phản Ánh Vi Phạm 30 Giây (Report New Observation)

## 1. Screen identity
- Role: Citizen / Youth
- Route: `/citizen/report/new`
- Component: `apps/citizen/pages/report-new/ReportNewPage.jsx`
- Layout: `apps/citizen/layout/CitizenLayout.jsx`
- Navigation entry: Nút hành động chính trên Header & Home
- Current implementation status: ACTIVE (Level 5 Production)

Purpose: Biểu mẫu tối ưu thao tác 1 tay trên Mobile, cho phép người dân ghi nhận vi phạm bụi công trình trong 30 giây kèm định vị GPS WGS84 và ảnh bằng chứng mã hóa SHA-256.

---

## 2. User goal
- Chụp ảnh hoặc tải lên hình ảnh vi phạm tại hiện trường.
- Tự động lấy tọa độ GPS hiện tại hoặc chọn vị trí công trình trên bản đồ.
- Chọn nhanh loại vi phạm (Bụi phát tán, Không che chắn, Xe không rửa bánh, Thi công sai giờ).
- Gửi phản ánh và nhận mã tra cứu hồ sơ ngay lập tức.

---

## 3. Information hierarchy
1. Thanh tiến trình 3 bước trực quan: Chụp ảnh $ightarrow$ Vị trí $ightarrow$ Xác nhận
2. Vùng chụp/tải ảnh minh chứng (Tự động nén ảnh & tính hash SHA-256 Web Crypto)
3. Công cụ gắn tọa độ GPS (Nút "Lấy vị trí hiện tại" kèm Geofence check)
4. Bộ chọn loại hành vi vi phạm & Mô tả ngắn (tùy chọn)
5. Nút gửi phản ánh kích thước lớn [Gửi phản ánh ngay]

---

## 4. Form fields & Validation
| Field | Type | Required | Validation Rule |
|---|---|:---:|---|
| Evidence Photo | Image File | Có | File ảnh hợp lệ, nén dưới 2MB, sinh mã SHA-256 |
| Location (Lat, Lng) | GPS Coordinate | Có | Tọa độ WGS84 trong phạm vi Việt Nam |
| Category | Selection | Có | Thuộc 4 nhóm: Bụi, Rửa xe, Che chắn, Khác |
| Address / Landmark | Text | Có | Độ dài tối thiểu 5 ký tự |
| Description | Textarea | Không | Tối đa 500 ký tự |

---

## 5. Primary action
- Primary action: [Gửi phản ánh ngay]
- Secondary: [Lưu bản nháp], [Hủy]
