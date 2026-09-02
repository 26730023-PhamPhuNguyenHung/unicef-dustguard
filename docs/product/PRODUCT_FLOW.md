# DUSTGUARD VN — VÒNG ĐỜI VẬN HÀNH SẢN PHẨM (PRODUCT WORKFLOW SSOT)

> **Mã tài liệu**: `DG-PRODUCT-FLOW-2026`

---

## 1. MA TRẬN PHÂN QUYỀN 5 VAI TRÒ (ROLE CAPABILITY MATRIX)

| Khả năng & Quyền hạn Nghiệp vụ | Người Dân (Citizen) | Thanh Niên (Youth) | Cán Bộ (Staff) | Nhà Thầu (Contractor) | Lãnh Đạo (Executive) | Quản Trị (Admin) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Gửi phản ánh & tra cứu tiến độ** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Ghi nhận quan sát & tích lũy tín chỉ** | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Tiếp nhận & Sàng lọc phản ánh** | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Thanh tra thực địa (10 tiêu chí)** | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Giao việc khắc phục cho nhà thầu** | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Nộp ảnh Trước/Sau khắc phục** | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Hậu kiểm & Giám sát 24–48h** | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Soạn thảo văn bản A4 (NĐ 30)** | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Ký số thẩm định & Đóng hồ sơ** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Xem Dashboard KPI & Bản đồ nhiệt** | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Quản trị Thiết bị, Điểm đo, Hệ thống**| ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 2. HÀNH TRÌNH NGƯỜI DÙNG THEO VAI TRÒ (ROLE-BASED USER JOURNEYS)

```text
HÀNH TRÌNH 1: NGƯỜI DÂN (CITIZEN JOURNEY)
  Trang chủ (/citizen) ➔ Bấm "Phản ánh nhanh trong 30s" ➔ Điền 6 bước kèm ảnh ➔ Nhận mã DG-2026-XXXX ➔ Xem Timeline minh bạch

HÀNH TRÌNH 2: THANH NIÊN XUNG KÍCH (YOUTH JOURNEY)
  Mở /community ➔ Ghi nhận quan sát tại trường học/công trình ➔ Tham gia chiến dịch ➔ Tái kiểm tra 24h ➔ Nhận chứng chỉ số có QR HMAC-SHA256

HÀNH TRÌNH 3: CÁN BỘ THANH TRA (STAFF JOURNEY)
  Mở /staff/dashboard ➔ Xem hàng đợi ưu tiên theo SLA ➔ Chọn Case ➔ Khảo sát hiện trường (Checklist 10 mục) ➔ Giao việc nhà thầu ➔ Giám sát 24-48h ➔ Xuất biên bản DOCX/PDF

HÀNH TRÌNH 4: NHÀ THẦU THI CÔNG (CONTRACTOR JOURNEY)
  Mở /contractor/actions ➔ Nhận yêu cầu dập bụi kèm deadline ➔ Thi công che chắn/tưới nước ➔ Nộp ảnh Before/After ➔ Chờ cán bộ nghiệm thu

HÀNH TRÌNH 5: LÃNH ĐẠO ĐIỀU HÀNH (EXECUTIVE JOURNEY)
  Mở /executive/dashboard ➔ Đánh giá 8 KPI D1 ➔ Xem Bản đồ nhiệt rủi ro ➔ Lọc điểm nóng ➔ Ký số duyệt báo cáo xử lý
```
