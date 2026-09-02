# STF-05 — Chi Tiết Quy Trình 7 Bước Vụ Việc (Case Detail DAG)

## 1. Screen identity
- **Role**: Staff / Thanh tra môi trường / Pháp chế
- **Route**: `/staff/cases/:id`
- **Component**: `src/apps/staff/pages/cases/CaseDetailPage.jsx`
- **Layout**: `src/apps/staff/layout/StaffLayout.jsx`
- **Navigation entry**: Bấm dòng vụ việc từ danh sách hoặc dashboard
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Không gian tác nghiệp cốt lõi của cán bộ thanh tra: thực hiện điều chuyển trạng thái qua 7 bước, xem xét ảnh bằng chứng gốc SHA-256, giao việc khắc phục cho nhà thầu, nghiệm thu ảnh Before/After và ban hành quyết định hành chính chuẩn NĐ 30/2020.

---

## 2. Information hierarchy
1. **Thanh tiêu đề hồ sơ (Case Header)**: Mã vụ việc lớn, Tên công trình, Trạng thái SLA 48h, Nút thao tác nhanh theo bước.
2. **Thanh tiến trình 7 bước DAG tương tác (Interactive 7-Step Pipeline)**: Hiển thị trực quan bước hiện tại, thời gian hoàn thành các bước trước.
3. **Không gian bằng chứng số (Digital Evidence Space)**: Ảnh phản ánh ban đầu, mã băm SHA-256 Web Crypto, tọa độ WGS84.
4. **Khu vực giao nhiệm vụ & Nhà thầu khắc phục (Remediation Task Section)**: Xem yêu cầu đã giao, ảnh đối chứng Trước/Sau do nhà thầu nộp từ hiện trường $le 50	ext{m}$.
5. **Dòng thời gian kiểm toán vụ việc (Case Audit Timeline)**: Lịch sử từng lần chuyển bước, người thực hiện, ghi chú nghiệp vụ.
6. **Khu vực văn bản & Quyết định xử phạt (Legal Decisions)**: Soạn thảo biên bản, gắn chữ ký số, xuất file in ấn A4.

---

## 3. 7-Step Transition Rules & Verification
- `INTAKE ightarrow SURVEYED`: Yêu cầu có biên bản khảo sát hiện trường hoặc ảnh xác minh.
- `SURVEYED ightarrow PROPOSED`: Yêu cầu điền biện pháp xử lý và mức phạt đề xuất (nếu có).
- `PROPOSED ightarrow APPROVED`: Yêu cầu chữ ký duyệt của Lãnh đạo.
- `APPROVED ightarrow REMEDIATED`: Tự động kích hoạt khi nhà thầu nộp ảnh Before/After hợp lệ trong Geofence $le 50	ext{m}$.
- `REMEDIATED ightarrow VERIFIED`: Cán bộ thanh tra bấm "Nghiệm thu đạt yêu cầu".
- `VERIFIED ightarrow CLOSED`: Đóng hồ sơ, hoàn tất lưu trữ.

---

## 4. Primary action
- **Primary action**: `[Chuyển bước tiếp theo]` hoặc `[Nghiệm thu khắc phục]`
- **Secondary**: `[Giao nhiệm vụ cho nhà thầu]`, `[Xuất văn bản A4]`, `[Yêu cầu làm lại]`
