# PRODUCT BLUEPRINT V2 — DUSTGUARD VN
## Kiến Trúc Sản Phẩm Tối Giản Dựa Trên Hành Trình Người Dùng Thực Tế (Human Journeys)

> **Nguyên tắc tối thượng**: Xây dựng từ Con người & Nhiệm vụ thực tế (Jobs-To-Be-Done), không bắt đầu từ 35 màn hình cũ.  
> **Slogan SSOT**: *"Phát hiện vấn đề. Chuyển đúng người. Theo dõi đến kết quả."*  
> **Trục cốt lõi**: `SIGNAL → UNDERSTAND → ROUTE → ACTION → FOLLOW-UP → VERIFY → OUTCOME`

---

## 1. NĂM NHÓM NGƯỜI DÙNG & MỤC TIÊU THỰC SỰ (5 ROLES & JOBS-TO-BE-DONE)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          5 NHÓM TÁC NHÂN TRONG VÒNG ĐỜI VỤ VIỆC                         │
├──────────────┬──────────────┬──────────────┬───────────────────┬───────────────────────┤
│ 1. PUBLIC    │ 2. CITIZEN   │ 3. STAFF     │ 4. CONTRACTOR     │ 5. ADMIN / DISPATCHER │
├──────────────┼──────────────┼──────────────┼───────────────────┼───────────────────────┤
│ Người vãng lai│ Người dân địa│ Cán bộ khảo  │ Đơn vị thi công / │ Người điều phối &     │
│ & tìm hiểu   │ bàn & TNV    │ sát hiện     │ Đơn vị xử lý tại  │ Quản lý toàn bộ vòng  │
│ thông tin    │              │ trường       │ công trường       │ đời vụ việc           │
└──────────────┴──────────────┴──────────────┴───────────────────┴───────────────────────┘
```

### 1.1 Public (Công chúng)
- **Họ là ai**: Người dân truy cập tìm hiểu hoặc người muốn tra cứu nhanh tình trạng bụi khu vực.
- **Job thực sự**:
  1. Hiểu DustGuard là gì trong 10 giây (Không đọc báo cáo dài).
  2. Xem bản đồ chất lượng không khí & các vụ việc đang được xử lý công khai.
  3. Bấm vào là gửi phản ánh được ngay (Zero-Login).
- **Số màn hình tối giản**: **2 màn hình** (`/` Landing Page, `/map` Bản đồ công khai).

### 1.2 Citizen (Công dân & Tình nguyện viên)
- **Họ là ai**: Người dân sống cạnh công trường hoặc tình nguyện viên Đoàn/Hội phát hiện bụi.
- **Job thực sự**:
  1. **Tạo tín hiệu nhanh (30s)**: Chụp ảnh, định vị GPS, gửi phản ánh không cần đăng nhập phức tạp.
  2. **Biết phản ánh đi đâu**: Theo dõi mã vụ việc (`#DG-2026-0842`) đang ở bước nào trong 7 bước.
  3. **Xem kết quả minh bạch**: Thấy ảnh Before/After sau khi nhà thầu khắc phục và xác nhận nghiệm thu.
  4. **Tích lũy giờ tình nguyện**: Nhận chứng chỉ xanh (20h = 4.0 tín chỉ) có mã QR tra cứu.
- **Số màn hình tối giản**: **3 màn hình** (`/citizen` Bàn làm việc & Theo dõi, `/citizen/report/new` Gửi phản ánh 30s, `/citizen/reports/:id` Chi tiết & Minh chứng nghiệm thu).

### 1.3 Staff (Cán bộ Khảo sát Thực địa — Mobile-First)
- **Họ là ai**: Thanh tra viên môi trường, cán bộ địa bàn đi xe máy ngoài đường.
- **Job thực sự**:
  1. **Xem việc cần làm hôm nay**: Danh sách nhiệm vụ ca trực theo mức độ ưu tiên & khoảng cách.
  2. **Đi tới hiện trường**: Xem địa chỉ, mở bản đồ chỉ đường Google Maps 1-chạm.
  3. **Kiểm tra & Thu thập bằng chứng**: Chụp ảnh Before, chấm checklist 10 tiêu chuẩn QCVN 18.
  4. **Gửi kết luận & Đề xuất**: Gửi biên bản kiểm tra về Admin để ban hành lệnh khắc phục.
  5. **Tái kiểm sau 24h-48h**: Quay lại hiện trường đo lại PM2.5 và chụp ảnh nghiệm thu.
- **Số màn hình tối giản**: **3 màn hình** (`/staff` Danh sách việc hôm nay, `/staff/tasks/:id` Chi tiết nhiệm vụ & Chỉ đường, `/staff/inspect/:id` Chụp ảnh & Biên bản kiểm tra).

### 1.4 Contractor (Đơn vị Xử lý / Nhà Thầu — Action-First)
- **Họ là ai**: Chỉ huy trưởng công trường, đội trưởng thi công.
- **Job thực sự**:
  1. **Nhận yêu cầu rõ ràng**: Tôi phải làm gì? Ở vị trí nào? Hạn chót khi nào (SLA 24h-48h)?
  2. **Thực thi & Nộp minh chứng**: Phun nước, quây bạt $\rightarrow$ Chụp ảnh After có định vị Geofence $<50$m $\rightarrow$ Báo hoàn tất.
  3. **Xem kết quả tái kiểm**: Biết cán bộ đã nghiệm thu Đạt hay yêu cầu làm lại.
- **Số màn hình tối giản**: **2 màn hình** (`/contractor` Danh sách yêu cầu cần xử lý, `/contractor/tasks/:id` Nộp ảnh minh chứng After & Báo hoàn tất).

### 1.5 Admin / Dispatcher (Người Điều Phối & Quản Trị)
- **Họ là ai**: Lãnh đạo đội thanh tra, cán bộ tiếp nhận trung tâm điều phối.
- **Job thực sự**:
  1. **Hộp thư tiếp nhận (Triage Inbox)**: Lọc tín hiệu mới từ dân & cảm biến trạm đo $\rightarrow$ Tạo vụ việc.
  2. **Điều phối & Giao việc (Dispatch)**: Giao Staff khảo sát $\rightarrow$ Đọc kết quả $\rightarrow$ Giao Contractor xử lý.
  3. **Không gian Xử lý Vụ việc (Case Detail SSOT)**: Quản lý toàn bộ 1 vụ việc trên 1 trang duy nhất (Vấn đề, Bằng chứng Before/After, Lịch sử phân công, Timeline, Nghiệm thu, In ấn A4).
  4. **Giám sát sức khỏe quy trình (Workflow Health)**: Vụ việc quá hạn, nghẽn ở bước nào, tỷ lệ hoàn tất.
  5. **Quản trị người dùng & Cấu hình**: Phân quyền 5 roles, cài đặt ngưỡng QCVN 05.
- **Số màn hình tối giản**: **5 màn hình** (`/admin` Inbox điều phối & Sức khỏe quy trình, `/admin/cases/:id` Case Detail trung tâm, `/admin/monitoring` Tín hiệu trạm đo, `/admin/users` Người dùng, `/admin/settings` Cấu hình).

---

## 2. BẢNG TỔNG KẾT HỆ THỐNG MÀN HÌNH V2 (15 MÀN HÌNH CHUẨN)

| Phân hệ | Số Screen Cũ | Số Screen Mới (V2) | Danh sách Màn hình Chuẩn V2 |
|---|:---:|:---:|---|
| **Public** | 8 | **2** | 1. Landing Page (`/`), 2. Bản đồ công khai (`/map`) |
| **Citizen** | 5 | **3** | 3. Bàn làm việc & Theo dõi (`/citizen`), 4. Gửi phản ánh 30s (`/citizen/report/new`), 5. Chi tiết & Minh chứng nghiệm thu (`/citizen/reports/:id`) |
| **Staff** | 14 | **3** | 6. Danh sách việc hôm nay (`/staff`), 7. Chi tiết nhiệm vụ & Bản đồ (`/staff/tasks/:id`), 8. Khảo sát / Tái kiểm thực địa (`/staff/inspect/:id`) |
| **Contractor** | 4 | **2** | 9. Bàn làm việc nhà thầu (`/contractor`), 10. Nộp ảnh khắc phục & Báo hoàn tất (`/contractor/tasks/:id`) |
| **Admin** | 4 | **5** | 11. Inbox điều phối & Sức khỏe vận hành (`/admin`), 12. Trung tâm Vụ việc 1 Trang (`/admin/cases/:id`), 13. Tín hiệu Trạm đo (`/admin/monitoring`), 14. Quản lý Người dùng (`/admin/users`), 15. Cấu hình Hệ thống (`/admin/settings`) |
| **TỔNG CỘNG** | **35** | **15** | **Giảm 57% số màn hình, tập trung 100% vào nghiệp vụ thực tế** |

---

## 3. NGUYÊN TẮC THIẾT KẾ CỐT LÕI V2

1. **One-Case, One-Page**: Mọi thông tin của 1 vụ việc (Thông tin, Bằng chứng, Nhiệm vụ, Nhà thầu, Tái kiểm, In A4, Nhật ký) nằm gọn trong **1 màn hình Case Detail duy nhất**, không bắt người dùng nhảy qua 5 trang.
2. **Không Dashboard hình thức**: Bỏ toàn bộ biểu đồ đếm số lượng vô nghĩa. Mọi màn hình Home/Dashboard phải trả lời ngay: *"Hôm nay tôi phải làm gì? Có việc gì quá hạn không?"*.
3. **Mobile-First cho Hiện Trường**: Giao diện Staff và Contractor tối ưu nút bấm lớn ($\ge 48\text{px}$), thao tác bằng 1 tay ngoài trời nắng gắt.
4. **Minh bạch Đối chứng Before/After**: Mọi vụ việc kết thúc đều phải có cặp ảnh Trước - Sau kèm mã băm SHA-256 đối chứng toàn vẹn.
