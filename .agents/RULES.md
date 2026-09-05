# DUSTGUARD VN — MASTER DEVELOPMENT & ENGINEERING RULES

> **Phiên bản**: v2.0 (Consolidated Master Rules)  
> **Mục tiêu**: Toàn bộ quy tắc cốt lõi về Phát triển sản phẩm, Giao diện UI/UX, API Contract, Kiểm thử và PowerShell CLI.

---

## 1. CHU TRÌNH 4 BƯỚC PHÁT TRIỂN SẢN PHẨM (PRODUCT LOOP)
```text
[BƯỚC 1: SPEC] ────► [BƯỚC 2: FRONTEND + UX] ────► [BƯỚC 3: BACKEND + DATA] ────► [BƯỚC 4: DEVTOOLS + QC]
```
- **Bước 1 (Spec)**: Xác định rõ User Goal (Một câu duy nhất), Happy Path 3-6 bước, Data Mapping `UI -> API -> D1 Table`.
- **Bước 2 (Frontend & UX)**: Ngôn từ tự nhiên tiếng Việt (Zero Jargon), Button 1-3 từ, Mobile-First, Touch target $\ge 44$px.
- **Bước 3 (Backend & Data)**: 100% CRUD Thật qua SQLite D1, tuyệt đối không dùng mock hay fake data trong catch blocks.
- **Bước 4 (DevTools & QC)**: Console sạch 0 warning, Network HTTP chuẩn, kiểm thử đa màn hình (1536x864, 1366x768, 390px).

---

## 2. QUY TẮC GIAO DIỆN & RESPONSIVE (UI RULES)
- **Zero Glassmorphism**: Nền sáng chữ đậm, nền đậm chữ sáng. Bảng màu: Kem `#FDFBF7`, Mực `#231B14`, Xanh ngọc `#0D6F64`, Đỏ con dấu `#9F241F`.
- **Cấm `truncate` trên Thực thể Dân sự**: Tên công trình, mã hồ sơ, tên nhiệm vụ, trạng thái bắt buộc dùng `break-words leading-snug`. Chỉ truncate mã kỹ thuật dài (UUID, SHA-256 hash).
- **Flex & Grid An Toàn**: Bắt buộc `min-w-0` trên mọi flex/grid children để chống tràn khung.
- **Độ Phủ Màn Hình 14-Inch**: Tối ưu chuẩn tại **1536 x 864** (Windows 125% scale trên màn Full HD) và **1366 x 768**. Không tràn ngang, không rớt nút, sidebar cố định 184–208px.

---

## 3. CHUẨN HÓA DỮ LIỆU API (DATA CONTRACT & NORMALIZATION)
- **Collection luôn là mảng `[]`**: API Client (`request.js`, `*api.js`) bắt buộc unwrap và fallback về mảng `[]` an toàn trước khi vào React state.
- **Phòng vệ đa tầng**: Sử dụng `(Array.isArray(items) ? items : []).map(...)` để chống crash `items.map is not a function`.
- **Kiểm tra HTTP `res.ok`**: Ném lỗi có cấu trúc khi `!res.ok`, cấm nhét error payload vào state thành công.

---

## 4. CHIẾN LƯỢC KIỂM THỬ GIÁ TRỊ THỰC (5 TẦNG FAST DEV LOOP)
- **Level 0 (< 0.5s)**: Chạy test đơn lẻ mục tiêu ngay khi code: `node --test app/tests/<file>.test.js`.
- **Level 1 (< 3s)**: Chạy sau khi sửa 1 batch file: `npm --prefix app run verify:changed`.
- **Level 3 Gate (< 7s)**: Default gate bắt buộc trước khi commit/bàn giao: `npm --prefix app run verify:quick`.
- **Level 4 Release**: Chạy 1 lần duy nhất trước release lớn: `npm --prefix app run verify`.
- **Nguyên tắc**: Trọng giá trị thực, kiểm thử theo 5 tầng (Unit -> Integration D1 -> Contract -> P0 E2E -> UI Behavior). Không over-mock, không chạy theo vanity coverage.

---

## 5. THỰC THI POWERSHELL CLI CHUẨN MỰC
- Chạy lệnh một dòng trực tiếp bằng PowerShell CLI trên Windows.
- Không dùng cú pháp Unix sai (`&&` không tương thích, dùng `;` hoặc PowerShell chaining).
- Tự động chạy micro-commit ngay khi pass `verify:quick` 100%.

---

## 6. QUY TRÌNH UI QUALITY WATCH (NON-BLOCKING AUTOMATION)
- **Non-blocking**: Khi implement và browser test, không dừng hoặc làm lệch task chính chỉ vì lỗi UI phụ.
- **Record-First**: Ghi nhận bất thường vào `artifacts/ui-anomalies.json` trước. Chỉ thực hiện UI Cleanup Pass sau khi task chính và domain logic PASS 100%.
- **5 Tiêu chuẩn kiểm tra**:
  1. *Text clipping / rớt chữ*: mất chữ, đè dòng, ellipsis sai, tràn thẻ, xuống dòng cụt chữ đơn lẻ.
  2. *Button / interactive*: mất nút, vỡ dòng trong nút, icon đè chữ, touch target di động $< 44\text{px}$, overlap.
  3. *Layout*: CẤM horizontal overflow (`scrollWidth <= innerWidth`), component cắt ngang, fixed/sticky che nội dung.
  4. *Responsive Matrix tối thiểu*: `390x844`, `430x932`, `768x1024`, `1366x768`, `1440x900`.
  5. *Visual consistency*: cỡ chữ, bo góc, spacing, empty/loading state vỡ; cấm glassmorphism.
- **Quy trình Fix**:
  - Sửa theo thứ tự: `critical` $\rightarrow$ `high` $\rightarrow$ `medium` $\rightarrow$ `low`.
  - Sửa Root Cause bằng responsive CSS (clamp, flex, min-h), cấm hardcoded pixel patch từng viewport.
  - Không thay đổi business logic. Chỉ đánh dấu `"fixed"` khi tái kiểm thử thực tế bằng browser pass 100%.
- **Báo cáo bắt buộc**: `main task`, `UI anomalies detected`, `fixed`, `remaining`, `routes checked`, `viewport matrix checked`.

