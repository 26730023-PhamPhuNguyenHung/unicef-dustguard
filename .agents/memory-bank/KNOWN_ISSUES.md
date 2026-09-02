# KNOWN ISSUES & PRODUCT INCONSISTENCY TRACKER — DUSTGUARD VN

> **Cập nhật**: 2026-09-02 (Sau Phiên Product Consistency Audit Toàn Diện)  
> **Nguồn đối chiếu**: [`docs/product/PRODUCT_CONSISTENCY_AUDIT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/PRODUCT_CONSISTENCY_AUDIT.md)

---

## 1. Danh Mục 10 Điểm Bất Nhất Sản Phẩm Cần Khắc Phục (Top 10 Inconsistencies)

1. **[PROD-01] Mã Hồ Sơ Golden Demo Chưa Đồng Bộ**:
   - *Hiện trạng*: Landing Page dùng mã `#DG-2026-0842`, trong khi `DemoHub.jsx` đang dùng `#CASE-2026-001`.
   - *Khắc phục*: Đồng bộ duy nhất một mã `#DG-2026-0842` (Nút giao An Phú) xuyên suốt Landing $\rightarrow$ Demo $\rightarrow$ 5 Vai trò.

2. **[PROD-02] Trọng Tâm Trang Công Trình (`SitesListPage` / `SiteDetailPage`) Còn Score-Centric**:
   - *Hiện trạng*: Cột chính đang hiển thị "Điểm rủi ro (0-100)" và phân loại "Nguy cơ cao".
   - *Khắc phục*: Đổi cột chính sang "Vụ việc đang mở" & "Lần tái kiểm gần nhất"; hạ điểm số xuống thông số phụ trợ.

3. **[PROD-03] Trạm Quan Trắc (`StaffMonitoringPage`) Tách Rời Quản Lý Vụ Việc**:
   - *Hiện trạng*: Cán bộ xem trạm đo nhưng thiếu nút liên kết nhanh sang Vụ việc.
   - *Khắc phục*: Bổ sung nút hành động 1-click: *"Tạo vụ việc cần xác minh từ trạm đo"* hoặc *"Gắn vào vụ việc hiện có"*.

4. **[PROD-04] Bảng Điều Khiển Quản Trị (`AdminDashboardPage`) Chỉ Đếm Số Lượng Tĩnh**:
   - *Hiện trạng*: Chỉ hiển thị số lượng user, số trạm đo.
   - *Khắc phục*: Đổi sang đo lường **Sức khỏe Quy trình (Workflow Health)**: Vụ việc quá hạn, Tỷ lệ tái kiểm đạt, Thời gian xử lý trung bình.

5. **[PROD-05] Thiếu Shared Component Giải Thích Lý Do Cần Chú Ý**:
   - *Hiện trạng*: Điểm số hiển thị nhưng thiếu lý do cụ thể con người hiểu được.
   - *Khắc phục*: Xây dựng component `NeedsAttentionReasons` (Ví dụ: Gần trường học < 100m, PM2.5 tăng 2h qua, Chưa phân công).

6. **[PROD-06] Chưa Đồng Bộ Nhãn Trạng Thái Giữa Các Role**:
   - *Hiện trạng*: Citizen thấy "Đã tiếp nhận", Staff thấy "Mới ghi nhận", Contractor thấy "Chờ xử lý".
   - *Khắc phục*: Chuẩn hóa theo bảng Canonical Status trong [`PRODUCT_LANGUAGE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/product/PRODUCT_LANGUAGE.md).

7. **[PROD-07] Demo Hub Trình Bày 5 Role Như 5 Ứng Dụng Rời Rạc**:
   - *Hiện trạng*: Demo selector chỉ là các nút đăng nhập riêng lẻ.
   - *Khắc phục*: Thể hiện rõ mỗi vai trò đứng ở đâu trong cùng một chuỗi xử lý vụ việc An Phú.

8. **[PROD-08] Dùng Lẫn Lộn Thuật Ngữ "Hồ Sơ" và "Vụ Việc"**:
   - *Khắc phục*: Toàn bộ quá trình theo dõi gọi là **"Vụ việc"** (`Case`); chỉ gọi là **"Hồ sơ"** khi nói về tập tài liệu/biên bản A4 (`Dossier`).

9. **[PROD-09] Tái Kiểm (Reinspection) Chưa Nổi Bật Ở Citizen View**:
   - *Khắc phục*: Đưa ảnh đối chứng Before/After và kết quả tái kiểm lên vị trí trung tâm trong `ReportDetailPage`.

10. **[PROD-10] Bản Đồ Công Dân Còn Dùng Thuật Ngữ Phán Quyết Nguy Hiểm**:
    - *Khắc phục*: Đổi sang "Chất lượng không khí & Vụ việc đang xử lý tại khu vực".

---

## 2. Trạng Thái Mã Nguồn Kỹ Thuật (Zero Technical Bugs)
- Toàn bộ 28 test files + Quick Gate: **279/279 tests PASS 100%**.
- Production Bundle: **Vite build PASS 100%**.
- API Contract Parity: **100% khớp OpenAPI 3.0.3 & D1 SQLite**.
