# CON-02 — Tiếp Nhận Khắc Phục & Đối Chứng Trước/Sau (Contractor Tasks)

## 1. Screen identity
- **Role**: Contractor / Chỉ huy trưởng công trường
- **Route**: `/contractor/tasks`
- **Component**: `src/apps/contractor/pages/tasks/ContractorTasksPage.jsx`
- **Layout**: `src/apps/contractor/layout/ContractorLayout.jsx`
- **Navigation entry**: Sidebar Contractor ("Yêu cầu khắc phục")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Cổng tiếp nhận yêu cầu khắc phục dành cho nhà thầu: kiểm tra phạm vi địa lý Geofence $le 50	ext{m}$, chụp và nộp bộ ảnh đối chứng Trước/Sau (Before/After) kèm văn bản giải trình để gửi cán bộ thanh tra nghiệm thu.

---

## 2. User goal
1. **Xem yêu cầu xử lý**: Đọc chi tiết nội dung vi phạm do thanh tra yêu cầu (VD: Bổ sung lưới chắn bụi, tưới nước rửa đường, rửa xe trước khi ra khỏi công trường).
2. **Xác thực vị trí hiện trường**: Hệ thống tự động kiểm tra GPS thiết bị phải nằm trong bán kính 50m quanh tâm công trình.
3. **Nộp minh chứng hoàn thành**: Tải lên ảnh chụp thực tế sau khi đã xử lý, điền nội dung giải trình và bấm gửi nghiệm thu.

---

## 3. Information hierarchy
1. **Danh sách nhiệm vụ cần làm (Pending Actions List)**: Thẻ nhiệm vụ có hạn chót xử lý và mức độ ưu tiên.
2. **Khung so sánh ảnh đối chứng (Before/After Comparison Zone)**:
   - Ảnh vi phạm ban đầu (Before): Do người dân/thanh tra chụp kèm mã hash SHA-256.
   - Khung chụp ảnh khắc phục (After): Do nhà thầu tải lên tại hiện trường.
3. **Công cụ xác thực vị trí (Geofence Distance Check)**: Hiển thị khoảng cách thực tế tới công trình (VD: `Cách tâm công trình 18m — Hợp lệ`).
4. **Ô nội dung giải trình (Remediation Explanation)**: Nhập biện pháp kỹ thuật đã áp dụng.
5. **Nút gửi nghiệm thu (Submit Remediation)**: `[Gửi báo cáo khắc phục]`.

---

## 4. Primary action
- **Primary action**: `[Gửi báo cáo khắc phục]` ($ge 44	ext{px}$, kiểm tra Geofence $le 50	ext{m}$)
- **Secondary**: `[Xem hồ sơ vụ việc]`, `[Liên hệ cán bộ phụ trách]`
