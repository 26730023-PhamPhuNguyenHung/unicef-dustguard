# DUSTGUARD — 4-STEP PRODUCT DEVELOPMENT LOOP

> **SSOT Quy trình Phát triển Sản phẩm DustGuard VN (v1.0)**  
> Áp dụng bắt buộc cho mọi Vertical Slice và Feature: **SPEC → FRONTEND/UX → BACKEND/DATA → DEVTOOLS/QC**

---

## NGUYÊN TẮC CỐT LÕI
1. Không tự viết lại toàn bộ hệ thống nếu code hiện tại có thể tái sử dụng.
2. Không giả định kiến trúc, route, schema hoặc API nếu chưa kiểm tra codebase.
3. Không dừng ở mock UI. Không tạo feature chỉ để demo nếu nghiệp vụ yêu cầu dữ liệu thật.
4. **Đo tiến độ bằng số nghiệp vụ chạy End-to-End thật**, không đo bằng số dòng code hay số màn hình tĩnh.

---

## CHU TRÌNH 4 BƯỚC BẮT BUỘC

```text
[BƯỚC 1: SPEC] ────► [BƯỚC 2: FRONTEND + UX] ────► [BƯỚC 3: BACKEND + DATA] ────► [BƯỚC 4: DEVTOOLS + QC]
     ▲                                                                                      │
     └────────────────────────── (Phát hiện lỗi / Vấn đề) ◄─────────────────────────────────┘
                                                │ (Pass 100%)
                                                ▼
                                           [DONE SLICE]
```

### BƯỚC 1 — SPEC: Hiểu Đúng Nghiệp Vụ Trước Khi Code
- **Người dùng là ai?** (Citizen, Staff, Admin, Contractor, Public) — Không trộn lẫn nghiệp vụ giữa các vai trò.
- **User Goal**: Một câu duy nhất mô tả mục tiêu của người dùng khi vào màn hình.
- **Happy Path**: Luồng chính gọn gàng 3–6 bước.
- **Dữ liệu cần có**: Mapping rõ ràng `UI FIELD → API → DATABASE TABLE/COLUMN`.
- **Trạng thái nghiệp vụ**: Tối giản, đúng chuẩn nghiệp vụ thực tế, không tạo status thừa.
- **Acceptance Criteria**: Checklist cụ thể (Reload còn dữ liệu, D1 persistence, responsive 390px, không lỗi console/network).

### BƯỚC 2 — FRONTEND + UX + Ngôn Từ Tự Nhiên
- **Ngôn từ Tự nhiên & Civic (Zero Jargon)**:
  - "Evidence" $\rightarrow$ "Ảnh hiện trường"
  - "Case" $\rightarrow$ "Vụ việc" / "Hồ sơ"
  - "Assigned to me" $\rightarrow$ "Việc của tôi"
  - "Inspection" $\rightarrow$ "Kiểm tra thực địa"
  - "Resolve" $\rightarrow$ "Hoàn tất xử lý"
- **Button Rule**: Nút bấm ngắn gọn **1–3 từ** (Xem, Sửa, Lưu, Giao việc, Chụp ảnh, Bắt đầu, Hoàn tất).
- **Mobile-First**: Tối ưu trên 375px, 390px, 430px, 768px, 1366/1440px. CTA dễ chạm $\ge 44\text{px}$, không dùng bảng ngang khổng lồ trên điện thoại (chuyển sang card list).
- **Giới hạn nhận thức**: Người dùng mở trang trong 5 giây trả lời được: *Tôi đang ở đâu? Có chuyện gì? Cần làm gì tiếp?*

### BƯỚC 3 — BACKEND + DATABASE: Biến UI Thành Nghiệp Vụ Thật
- **100% CRUD Thật**: Dữ liệu ghi/đọc trực tiếp D1 SQLite, reload trang dữ liệu vẫn còn nguyên vẹn.
- **Tuyệt đối cấm**: `setTimeout` giả lập, hardcode JSON trong catch, local state giả làm database.
- **Authorization & Validation**: Backend kiểm tra quyền và validate dữ liệu đầu vào, không tin tưởng mù quáng frontend.
- **Error Response có cấu trúc**: Trả về thông điệp tiếng Việt thân thiện theo hành động ("Không thể lưu kết quả kiểm tra", "Bạn không có quyền giao việc").

### BƯỚC 4 — DEVTOOLS + TEST + QC
- **Console sạch**: Không TypeError, không React warning, không failed fetch, không uncaught promise.
- **Network sạch**: Mã HTTP chuẩn (200, 201, 400, 401, 403, 404), không duplicate request.
- **Data Persistence**: Create $\rightarrow$ Reload $\rightarrow$ Còn; Update $\rightarrow$ Reload $\rightarrow$ Cập nhật; Delete $\rightarrow$ Reload $\rightarrow$ Đã ẩn/xóa.
- **Responsive**: Không tràn viền, chữ không rớt dòng vô lý, modal/bottom sheet vừa vặn trên màn hình mobile.
- **Nghiệp vụ End-to-End**: Test đúng chu trình thao tác thực tế của từng vai trò.

---

## MẪU BÁO CÁO NGHIỆM THU TỪNG MODULE

```markdown
## MODULE: [Tên Module]

### SPEC
- User goal: ...
- Flow: ...
- Data mapping: ...
- Acceptance criteria: ...

### FRONTEND
- Đã sửa: ...
- Ngôn từ đã tối ưu: ...
- Responsive: ...
- Component reuse: ...

### BACKEND
- Endpoint: ...
- DB / D1: ...
- Validation & Auth: ...

### DEVTOOLS & QC
- Console: Sạch 100%
- Network: Status 200/201 chuẩn
- Responsive: 375px -> 1440px mượt mà
- Persistence: Reload kiểm chứng thành công

### TESTS
- Các test đã chạy: ...
- Kết quả: PASS 100%

### STATUS: DONE
```
