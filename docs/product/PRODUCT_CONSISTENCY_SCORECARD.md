# PRODUCT_CONSISTENCY_SCORECARD.md — Bảng Đánh Giá Chất Lượng Nhất Quán Sản Phẩm (Nội Bộ QA)

> **Mục đích**: Bảng điểm nội bộ phục vụ kiểm thử và nghiệm thu sản phẩm. Không dùng điểm số này để hiển thị ra UI người dùng.  
> **Thang điểm**: 1 đến 5 sao cho 7 tiêu chí (Tối đa 35 điểm / trang).  
> **Tiêu chuẩn đạt (PASS)**: Tổng điểm $\ge 30/35$ và không có tiêu chí nào dưới 3.

---

## 1. TIÊU CHÍ ĐÁNH GIÁ (7 CRITERIA DEFINITION)

1. **Narrative Consistency (Kể cùng câu chuyện)**: Màn hình có đóng góp vào chuỗi `SIGNAL → UNDERSTAND → ROUTE → ACTION → FOLLOW-UP → VERIFY → OUTCOME` hay đứng độc lập rời rạc?
2. **Terminology (Chuẩn từ ngữ Canonical)**: Sử dụng đúng từ ngữ chuẩn (Vụ việc, Tín hiệu, Chờ tái kiểm, Đạt) hay dùng lẫn lộn thuật ngữ (Ticket, Incident, Danger, AI Judge)?
3. **Workflow Clarity (Rõ ràng quy trình)**: Người dùng có biết mình đang ở bước nào trong quy trình 7 bước tác nghiệp không?
4. **Next Action Clarity (Rõ việc cần làm tiếp)**: Có nút hành động rõ ràng và chỉ dẫn bước kế tiếp không?
5. **Status Consistency (Nhất quán trạng thái & màu sắc)**: Trạng thái có dùng đúng bộ Semantic Status Tokens không?
6. **Demo Consistency (Nhất quán với Golden Demo)**: Dữ liệu mẫu trên trang có kết nối logic với Golden Case `#DG-2026-0842` không?
7. **Human-centric UX (Trọng tâm người dùng)**: AI/Công nghệ đóng vai trò trợ lý hỗ trợ (Human-in-the-loop) hay làm thẩm phán phán quyết thay con người?

---

## 2. BẢNG ĐIỂM CHI TIẾT 35 MÀN HÌNH (DETAILED SCORECARD)

| Mã | Tên Màn Hình / Route | Narrative | Terminology | Workflow | Next Action | Status | Demo | Human UX | Tổng điểm | Đánh giá |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **PUBLIC** |
| P01 | Landing Page (`/`) | 5 | 5 | 5 | 5 | 5 | 4 | 5 | **34/35** | 🟢 PASS |
| P02 | Bản đồ cộng đồng (`/map`) | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **28/35** | 🟡 Cần nâng cấp liên kết case |
| P03 | Hướng dẫn trạm đo mở (`/guide`) | 4 | 5 | 4 | 4 | 5 | 4 | 5 | **31/35** | 🟢 PASS |
| P04 | Demo Hub (`/demo`) | 4 | 4 | 4 | 5 | 4 | 3 | 4 | **28/35** | 🔴 Cần đồng bộ mã DG-0842 |
| P05 | Giả lập trạm đo IoT (`/demo/iot`) | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **28/35** | 🟡 Cần đổi CTA sang mở vụ việc |
| P06 | Tín chỉ thanh niên (`/youth`) | 5 | 5 | 5 | 5 | 5 | 4 | 5 | **34/35** | 🟢 PASS |
| P07 | Đăng nhập (`/login`) | 4 | 5 | 4 | 5 | 5 | 5 | 5 | **33/35** | 🟢 PASS |
| P08 | Trang 404 (`*`) | 4 | 5 | 4 | 5 | 5 | 5 | 5 | **33/35** | 🟢 PASS |
| **CITIZEN** |
| C01 | Bàn làm việc công dân (`/citizen`) | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **28/35** | 🟡 Đưa case đang theo dõi lên đầu |
| C02 | Gửi phản ánh mới (`/citizen/report/new`)| 5 | 5 | 5 | 5 | 5 | 5 | 5 | **35/35** | 🟢 XUẤT SẮC |
| C03 | Danh sách phản ánh (`/citizen/reports`)| 4 | 4 | 4 | 4 | 4 | 4 | 5 | **29/35** | 🟡 Cần chuẩn hóa status badge |
| C04 | Chi tiết phản ánh (`/citizen/reports/:id`)| 5 | 4 | 5 | 4 | 4 | 4 | 5 | **31/35** | 🟢 PASS |
| C05 | Hồ sơ công dân (`/citizen/profile`) | 5 | 5 | 4 | 4 | 5 | 4 | 5 | **32/35** | 🟢 PASS |
| **STAFF** |
| S01 | Bàn làm việc cán bộ (`/staff`) | 5 | 4 | 5 | 5 | 5 | 4 | 5 | **33/35** | 🟢 PASS |
| S02 | Quản lý công trình (`/staff/sites`) | 3 | 3 | 4 | 3 | 4 | 3 | 4 | **24/35** | 🔴 Cần đổi cột rủi ro sang vụ việc |
| S03 | Chi tiết công trình (`/staff/sites/:id`)| 3 | 3 | 4 | 3 | 4 | 3 | 4 | **24/35** | 🔴 Hạ vai trò điểm rủi ro |
| S04 | Danh sách vụ việc (`/staff/cases`) | 5 | 4 | 5 | 4 | 4 | 4 | 5 | **31/35** | 🟢 PASS |
| S05 | Chi tiết vụ việc (`/staff/cases/:id`) | 5 | 4 | 5 | 5 | 5 | 5 | 5 | **34/35** | 🟢 PASS |
| S06 | Nhiệm vụ tác nghiệp (`/staff/tasks`) | 5 | 5 | 5 | 5 | 5 | 4 | 5 | **34/35** | 🟢 PASS |
| S07 | Trạm quan trắc (`/staff/monitoring`) | 4 | 4 | 4 | 4 | 4 | 3 | 4 | **27/35** | 🔴 Cần nút tạo case từ trạm đo |
| S08 | Tín hiệu cảnh báo (`/staff/alerts`) | 5 | 5 | 5 | 5 | 5 | 4 | 5 | **34/35** | 🟢 PASS |
| S09 | Báo cáo điều hành (`/staff/reports`) | 5 | 5 | 5 | 4 | 5 | 4 | 5 | **33/35** | 🟢 PASS |
| S10 | Hồ sơ cán bộ (`/staff/profile`) | 5 | 5 | 4 | 4 | 5 | 4 | 5 | **32/35** | 🟢 PASS |
| S11 | Thông báo tác nghiệp (`/staff/notifications`)| 5 | 5 | 5 | 5 | 5 | 4 | 5 | **34/35** | 🟢 PASS |
| S12 | Cài đặt cán bộ (`/staff/settings`) | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **28/35** | 🟡 Giữ nguyên |
| S13 | Nhật ký tác nghiệp (`/staff/activity`)| 5 | 5 | 5 | 4 | 5 | 4 | 5 | **33/35** | 🟢 PASS |
| S14 | Hướng dẫn & Quy định (`/staff/help`) | 5 | 5 | 5 | 4 | 5 | 4 | 5 | **33/35** | 🟢 PASS |
| **CONTRACTOR** |
| K01 | Bàn làm việc nhà thầu (`/contractor`)| 4 | 4 | 5 | 5 | 4 | 4 | 4 | **30/35** | 🟢 PASS |
| K02 | Xử lý yêu cầu (`/contractor/tasks`) | 5 | 5 | 5 | 5 | 5 | 5 | 5 | **35/35** | 🟢 XUẤT SẮC |
| K03 | Vụ việc & Dự án (`/contractor/cases`)| 4 | 4 | 4 | 4 | 4 | 4 | 4 | **28/35** | 🟡 Chuẩn hóa nhãn trạng thái |
| K04 | Báo cáo tuân thủ (`/contractor/reports`)| 4 | 5 | 4 | 4 | 5 | 4 | 5 | **31/35** | 🟢 PASS |
| **ADMIN** |
| A01 | Bảng điều khiển Admin (`/admin`) | 3 | 3 | 4 | 3 | 4 | 3 | 4 | **24/35** | 🔴 Đổi analytics sang outcome |
| A02 | Quản lý người dùng (`/admin/users`) | 5 | 5 | 4 | 4 | 5 | 4 | 5 | **32/35** | 🟢 PASS |
| A03 | Quản lý công trình (`/admin/sites`) | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **28/35** | 🟡 Dùng chung với Staff Sites |
| A04 | Cấu hình hệ thống (`/admin/settings`)| 4 | 5 | 4 | 4 | 5 | 4 | 5 | **31/35** | 🟢 PASS |

---

## 3. TỔNG KẾT VÀ HÀNH ĐỘNG KHẮC PHỤC

- **Tổng số màn hình đã chấm điểm**: 35 màn hình.
- **Số lượng màn hình đạt chuẩn ngay (PASS $\ge 30$)**: 22/35 (62.8%).
- **Số lượng màn hình cần tinh chỉnh nhẹ (28-29)**: 8/35 (22.9%).
- **Số lượng màn hình cần ưu tiên refactor narrative (< 28)**: 5/35 (14.3%):
  1. `DemoHub.jsx` (Đồng bộ Golden Demo Case `#DG-2026-0842`).
  2. `SitesListPage.jsx` & `SiteDetailPage.jsx` (Chuyển trọng tâm từ Risk Score sang Vụ việc đang mở & Lịch sử tái kiểm).
  3. `StaffMonitoringPage.jsx` (Nối liền luồng Tín hiệu trạm đo → Mở vụ việc).
  4. `AdminDashboardPage.jsx` (Đổi chỉ số đếm tĩnh sang chỉ số sức khỏe quy trình & tỷ lệ hoàn tất).
