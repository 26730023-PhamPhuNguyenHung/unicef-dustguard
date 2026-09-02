# IMPLEMENTATION GAPS & REFACTORING ROADMAP — DUSTGUARD VN

> **Cập nhật**: 2026-09-02  
> **Định vị mới**: `SIGNAL → UNDERSTAND → ROUTE → ACTION → FOLLOW-UP → VERIFY → OUTCOME`  
> **Nguyên tắc**: Sửa theo từng Vertical Slice, Kiểm thử sau mỗi nhóm, Không phá vỡ CSDL D1 và API tests hiện có.

---

## 1. DANH MỤC GAPS CẦN XỬ LÝ THEO GIAI ĐOẠN (PHASED GAPS)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        LỘ TRÌNH 7 GIAI ĐOẠN                            │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Giai đoạn 1       │ Phase 1: AUDIT    │ ĐÃ HOÀN TẤT                    │
│ Giai đoạn 2       │ Phase 2: SHARED   │ Shared UI Components & Badges  │
│ Giai đoạn 3       │ Phase 3: LANDING  │ Landing Page & Demo Hub        │
│ Giai đoạn 4       │ Phase 4: STAFF    │ Staff Core Operations          │
│ Giai đoạn 5       │ Phase 5: CITIZEN  │ Citizen & Contractor Workspace │
│ Giai đoạn 6       │ Phase 6: ADMIN    │ Admin Workflow Health          │
│ Giai đoạn 7       │ Phase 7: E2E      │ DevTools Cross-Role E2E Test   │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 2. CHI TIẾT CÁC GAPS THEO TỪNG GIAI ĐOẠN

### Phase 2: Nền Tảng Trình Bày Chung (Shared Presentation Foundation)
- **GAP-01**: Cần tạo component `NeedsAttentionReasons.jsx` để hiển thị giải thích dạng danh sách (bullet points) tại sao một vụ việc cần ưu tiên, thay thế cho việc phô diễn score.
- **GAP-02**: Cần tạo component `NextActionPanel.jsx` để chuẩn hóa hiển thị: Việc cần làm tiếp theo là gì, ai phụ trách, hạn khi nào.
- **GAP-03**: Cập nhật `StatusBadge.jsx` và semantic tokens theo đúng Canonical Status trong `PRODUCT_LANGUAGE.md`.

### Phase 3: Đồng Bộ Landing Page & Demo Hub (Narrative Source of Truth)
- **GAP-04**: Trong `DemoHub.jsx`, đồng bộ mã vụ việc thành `#DG-2026-0842`, gắn kết 5 vai trò vào một hành trình liền mạch.
- **GAP-05**: Trong `HeroSection.jsx` và `SolutionSection.jsx`, tinh chỉnh copy làm nổi bật "Theo dõi đến kết quả", giảm điểm nhấn số đo 85/100.

### Phase 4: Bàn Điều Phối Tác Nghiệp Cán Bộ (Staff Workflow)
- **GAP-06**: `CaseDetailPage.jsx`: Chuyển điểm số `dustRiskScore` sang tab thông số kỹ thuật phụ, đưa khối `NeedsAttentionReasons` và đối chứng Before/After lên vị trí dễ nhìn nhất.
- **GAP-07**: `SitesListPage.jsx` & `SiteDetailPage.jsx`: Đổi trọng tâm cột rủi ro sang Vụ việc đang mở và Tái kiểm gần nhất.
- **GAP-08**: `StaffMonitoringPage.jsx`: Bổ sung nút 1-click liên kết từ trạm đo vượt ngưỡng sang Mở vụ việc mới hoặc Gắn vào vụ việc hiện có.

### Phase 5: Không Gian Công Dân & Nhà Thầu (Citizen & Contractor)
- **GAP-09**: `CitizenHomePage.jsx` & `ReportDetailPage.jsx`: Đưa danh sách vụ việc đang theo dõi lên hàng đầu, làm nổi bật ảnh sau khắc phục và biên bản tái kiểm.
- **GAP-10**: `ContractorDashboardPage.jsx`: Nhấn mạnh 3 câu hỏi: Tôi cần làm gì? Hạn khi nào? Cần nộp ảnh Before/After nào để nghiệm thu?

### Phase 6: Sức Khỏe Quy Trình Quản Trị (Admin Workflow Health)
- **GAP-11**: `AdminDashboardPage.jsx`: Chuyển các chỉ số đếm số lượng sang chỉ số đo lường hiệu quả quy trình: Thời gian giải quyết trung bình, Tỷ lệ tái kiểm đạt, Số vụ quá hạn.

### Phase 7: Nghiệm Thu Chéo Toàn Bộ Hành Trình (DevTools Cross-Role Proof)
- **GAP-12**: Duyệt qua trình duyệt bằng Chrome DevTools theo kịch bản Golden Case `#DG-2026-0842` qua đủ 5 vai trò.
