# NEXT ACTIONS — DUSTGUARD VN IMPLEMENTATION ROADMAP

> **Trạng thái hiện tại**: Phase 1 (Audit & SSOT Docs) ĐÃ HOÀN TẤT 100%  
> **Bước tiếp theo**: Bắt đầu Phase 2 — Shared Presentation Foundation

---

## 📋 Danh Sách Hành Động Cụ Thể Theo Thứ Tự Ưu Tiên

### 🔹 Giai đoạn 2 (Phase 2): Shared Presentation Foundation
1. [ ] **Tạo Shared Component `NeedsAttentionReasons.jsx`**:
   - Nhận props: `reasons: string[]`, `priority: string`, `factors: object`.
   - Render danh sách lý do cụ thể con người hiểu được (Gần trường học, PM2.5 tăng 2h qua, nhiều phản ánh, chưa phân công).
2. [ ] **Tạo Shared Component `NextActionPanel.jsx`**:
   - Nhận props: `action: string`, `assignee: string`, `deadline: string`, `onAction: function`.
   - Chuẩn hóa hiển thị việc tiếp theo trên các trang Case và Dashboard.
3. [ ] **Đồng bộ `StatusBadge.jsx`**:
   - Cập nhật màu sắc ngữ nghĩa và nhãn hiển thị theo đúng bảng Canonical Status trong `PRODUCT_LANGUAGE.md`.

### 🔹 Giai đoạn 3 (Phase 3): Landing Page & Golden Demo Hub
4. [ ] **Đồng bộ `DemoHub.jsx`**:
   - Đổi mã hồ sơ thành `#DG-2026-0842` (An Phú · Vành Đai 3).
   - Thể hiện rõ mỗi vai trò đứng ở đâu trong cùng một chuỗi xử lý.
5. [ ] **Tinh chỉnh `HeroSection.jsx` & `SolutionSection.jsx`**:
   - Làm nổi bật thông điệp: "Phát hiện vấn đề. Chuyển đúng người. Theo dõi đến kết quả."

### 🔹 Giai đoạn 4 (Phase 4): Staff Core Operations
6. [ ] **Nâng cấp `CaseDetailPage.jsx`**:
   - Gắn `NeedsAttentionReasons`, hạ điểm số rủi ro xuống tab kỹ thuật, đưa ảnh Before/After và biên bản tái kiểm lên vị trí trung tâm.
7. [ ] **Nâng cấp `StaffMonitoringPage.jsx`**:
   - Bổ sung nút liên kết nhanh từ trạm đo bất thường sang Mở vụ việc mới hoặc Gắn vào vụ việc hiện có.
8. [ ] **Nâng cấp `SitesListPage.jsx` & `SiteDetailPage.jsx`**:
   - Đổi cột rủi ro sang Vụ việc đang mở và Lịch sử tái kiểm.

### 🔹 Giai đoạn 5 (Phase 5): Citizen & Contractor Flow
9. [ ] **Tối ưu `CitizenHomePage.jsx` & `ReportDetailPage.jsx`**:
   - Ưu tiên hiển thị tiến độ và kết quả tái kiểm nghiệm thu cho người dân.
10. [ ] **Tối ưu `ContractorDashboardPage.jsx` & `ContractorTasksPage.jsx`**:
    - Làm rõ yêu cầu cần làm, thời hạn và việc nộp ảnh Before/After để được nghiệm thu.

### 🔹 Giai đoạn 6 (Phase 6): Admin Workflow Health
11. [ ] **Cập nhật `AdminDashboardPage.jsx`**:
    - Đo lường sức khỏe quy trình (SLA, Tái kiểm, Điểm nghẽn).

### 🔹 Giai đoạn 7 (Phase 7): Verification & Golden Demo Cross-Role Test
12. [ ] **Chạy toàn bộ Test Suites & DevTools MCP Test**:
    - Chạy `verify:quick`, kiểm thử hành trình Golden Case `#DG-2026-0842` từ Landing $\to$ Citizen $\to$ Staff $\to$ Contractor $\to$ Staff $\to$ Admin.
