# CIT-02 — Tạo Phản Ánh Vi Phạm 30 Giây (Report New Observation)

## 1. Screen identity
- **Role**: Citizen / Youth
- **Route**: `/citizen/report/new`
- **Component**: `src/apps/citizen/pages/report-new/ReportNewPage.jsx`
- **Layout**: `src/apps/citizen/layout/CitizenLayout.jsx`
- **Navigation entry**: Nút CTA đỏ son trên Header / Citizen Home / Mobile Bottom Nav
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Biểu mẫu ghi nhận phản ánh hiện trường được thiết kế tối ưu cho thao tác một tay trên điện thoại: chụp ảnh bằng chứng, gắn định vị GPS WGS84, mã hóa SHA-256 và gửi về cơ quan quản lý trong 30 giây.

---

## 2. User goal
1. **Chụp/Tải ảnh bằng chứng**: Chụp ảnh trực tiếp từ camera hoặc tải ảnh từ thư viện, tự động nén dưới 2MB và tính mã hash SHA-256 Web Crypto.
2. **Gắn vị trí chính xác**: Bấm nút "Lấy vị trí hiện tại" để tự động điền tọa độ GPS và tìm công trình xây dựng gần nhất trong bán kính 100m.
3. **Phân loại hành vi vi phạm**: Chọn nhanh 1 trong 4 loại: Bụi phát tán, Không che chắn bạt, Xe không rửa bánh, Thi công ngoài giờ.
4. **Nộp phản ánh**: Bấm nút gửi và nhận ngay mã định danh hồ sơ tra cứu (VD: `OBS-2026-0812`).

---

## 3. Information hierarchy & Form Steps
1. **Thanh chỉ báo 3 bước tiến trình (Step Progress Indicator)**: 1. Chụp ảnh $ightarrow$ 2. Vị trí & Hành vi $ightarrow$ 3. Xác nhận gửi.
2. **Khung tải ảnh & Xem trước (Evidence Upload Zone)**: Hỗ trợ kéo thả, chụp camera, hiển thị mã băm SHA-256 minh bạch.
3. **Bộ chọn vị trí địa lý (Location Picker)**: Nút "Lấy GPS", bản đồ thu nhỏ định vị vị trí, ô nhập địa chỉ/tên công trình gợi ý.
4. **Phân loại hành vi vi phạm (Category Chips)**: 4 Nút chọn nhanh kích thước lớn có biểu tượng minh họa.
5. **Ô mô tả bổ sung (Optional Note)**: Tùy chọn nhập thêm chi tiết vi phạm.
6. **Nút gửi hành động chính (Submit Button)**: `[Gửi phản ánh ngay]` ($ge 48	ext{px}$, đỏ son).

---

## 4. Form fields & Validation
| Field | Type | Required | Validation Rule |
|---|---|:---:|---|
| Evidence Photo | File (Image) | Có | File ảnh hợp lệ, tự động nén dưới 2MB, sinh mã SHA-256 |
| Location (Lat, Lng) | GPS Coordinates | Có | Tọa độ chuẩn WGS84 trong lãnh thổ Việt Nam |
| Category | Selection | Có | Bắt buộc chọn 1 trong 4 nhóm danh mục |
| Address / Landmark | Text | Có | Độ dài tối thiểu 5 ký tự |
| Description | Textarea | Không | Tối đa 500 ký tự |

---

## 5. Primary action
- **Primary action**: `[Gửi phản ánh ngay]`
- **Secondary**: `[Lưu bản nháp]`, `[Hủy bỏ]`

---

## 6. Screen states
- **Loading state**: Hiển thị thanh tiến trình nén ảnh $ightarrow$ tải lên Cloudflare R2 $ightarrow$ ghi nhận vào D1 Database.
- **Success state**: Màn hình thông báo thành công kèm Mã hồ sơ tra cứu và nút "Xem tiến độ xử lý".
- **Error state**: Báo lỗi cụ thể (ảnh quá mờ, vị trí ngoài phạm vi) kèm hướng dẫn khắc phục.
