# 👁️ UI QUALITY WATCH POLICY — NON-BLOCKING AUTOMATION (WORKSPACE SSOT)

> 🕒 **SSOT Timestamp:** `2026-09-05`  
> 🌍 **Phạm vi:** DustGuard VN & DustGuard Operations trong toàn bộ quá trình phát triển và kiểm thử giao diện.

---

## 🏛️ NGUYÊN TẮC CỐT LÕI (CORE INVARIANTS)
1. **Non-Blocking Execution**: Không dừng hoặc làm lệch task chính chỉ vì lỗi UI phụ. Task nghiệp vụ cốt lõi luôn đi trước.
2. **Record-First Discipline**: Khi phát hiện bất thường giao diện trong lúc kiểm thử tính năng chính, **chỉ ghi nhận lại trước**, không dừng lại sửa ngay làm đứt đoạn mạch logic.
3. **Dedicated Cleanup Pass**: Sau khi task chính hoàn thành và functional/domain flow đã PASS 100%, mới kích hoạt vòng rà soát và sửa lỗi giao diện (UI cleanup pass).
4. **Zero-Tolerance for Display Defects**: Không được bỏ qua lỗi responsive, text clipping, button clipping hoặc horizontal overflow chỉ vì "chức năng vẫn chạy được".

---

## 🔍 5 TIÊU CHÍ KIỂM TRA BẮT BUỘC TRÊN MỖI MÀN HÌNH

### 1. Text Clipping / Rớt Chữ
- Văn bản bị cắt ngắn, mất chữ hoặc dính vào mép viền.
- Các dòng chữ đè lên nhau do `line-height` quá thấp.
- Cắt chuỗi (`text-overflow: ellipsis`) không hợp lý hoặc cắt cụt mất thông tin quan trọng.
- Văn bản tràn ra ngoài thẻ chứa (`container overflow`).
- Tiêu đề (Heading) hoặc nhãn nút (Button text) bị xuống dòng một từ đơn lẻ bất thường (luôn yêu cầu `text-wrap: pretty`).

### 2. Nút Bấm & Phần Tử Tương Tác (Interactive Elements)
- Nút bấm bị mất một phần hoặc tràn ra ngoài mép viewport.
- Văn bản trong nút bấm bị vỡ xuống dòng xấu xí.
- Biểu tượng (Icon) đè lên chữ hoặc méo mó tỉ lệ (thiếu `shrink-0`).
- Kích thước touch target quá nhỏ (đặc biệt trên Mobile, yêu cầu tối thiểu $\ge 44\text{px}$).
- Nút bấm bị đè lấn hoặc chồng chéo lên component khác.

### 3. Bố Cục & Tràn Khung (Layout & Overflow)
- **Tuyệt đối không có Horizontal Overflow**: `document.documentElement.scrollWidth <= window.innerWidth`.
- Các khối nội dung, card, bảng (table), hộp thoại modal bị cắt cụt.
- Khoảng cách (gap, padding, margin) lệch chuẩn hoặc co rúm bất thường.
- Canh hàng (alignment) lệch mắt rõ rệt giữa các khối nội dung cùng cấp.
- Thanh Sidebar, Topbar cố định (fixed/sticky) che khuất nội dung bên dưới.

### 4. Ma Trận Đa Độ Phân Giải (Responsive Matrix)
Bắt buộc kiểm tra tối thiểu 5 kích thước chuẩn đại diện:
- **Mobile nhỏ**: `390x844` (iPhone 12/13/14)
- **Mobile lớn**: `430x932` (iPhone Pro Max / Android flagship)
- **Tablet**: `768x1024` (iPad / Android Tablet)
- **Laptop nhỏ**: `1366x768` (Màn hình HD phổ thông)
- **Desktop**: `1440x900` (Màn hình chuẩn hiển thị đa cột)

### 5. Tính Nhất Quán Thị Giác (Visual Consistency)
- Cỡ chữ (`font-size`), độ đậm (`font-weight`) nhất quán theo Design System.
- Các component cùng cấp có chiều cao và tỷ lệ đồng nhất.
- Bán kính bo góc (`border-radius`) và thang khoảng cách (`spacing`) chuẩn xác.
- Trạng thái rỗng (Empty State) hoặc trạng thái tải (Loading/Skeleton) hiển thị ngay ngắn, không vỡ layout.
- Giao diện **luôn sáng màu (Light Mode)**, **tuyệt đối không dùng Glassmorphism**.

---

## 📝 ĐỊNH DẠNG GHI NHẬN: `artifacts/ui-anomalies.json`

Khi phát hiện bất thường mà chưa sửa ngay, tự động append vào tệp:
`artifacts/ui-anomalies.json`

```json
[
  {
    "route": "/cases/case-001/legal",
    "viewport": "430x932",
    "severity": "medium",
    "category": "touch-target",
    "selector": "button:text(Tạo Checklist)",
    "description": "Nút có chiều cao 28px, chưa đạt chuẩn touch target di động >= 44px",
    "evidence": {
      "initialHeight": 28,
      "fixedHeight": 44,
      "width": 122
    },
    "status": "open"
  }
]
```

### Phân Cấp Mức Độ (Severity):
- `critical`: Không thể thao tác, nút bấm bị che khuất không click được, nội dung chính bị che lấp.
- `high`: Tràn ngang màn hình (horizontal overflow), rớt chữ tiêu đề, vỡ layout cột rõ rệt.
- `medium`: Touch target nhỏ (< 44px), spacing/gap không đều, text wrap chưa tối ưu.
- `low`: Cải thiện tinh tế về padding, màu sắc viền nhẹ, polish.

---

## 🛠️ QUY TRÌNH SỬA LỖI (UI CLEANUP PASS)

Sau khi task nghiệp vụ chính đã hoàn tất và test functional PASS:
1. **Đọc danh sách**: Đọc toàn bộ các mục có `status: "open"` trong `artifacts/ui-anomalies.json`.
2. **Thứ tự ưu tiên**: Giải quyết lần lượt theo `critical` $\rightarrow$ `high` $\rightarrow$ `medium` $\rightarrow$ `low`.
3. **Sửa tận gốc (Root Cause)**:
   - Sửa bằng layout linh hoạt (Flexbox wrap, CSS Grid, clamp, min-h, media queries chuẩn).
   - Tuyệt đối không vá víu bằng hardcoded pixel cho từng viewport riêng lẻ.
4. **Bảo toàn nghiệp vụ**: Không thay đổi business logic, state management hay API contract khi sửa UI.
5. **Tái kiểm thử bằng Browser Thực Tế**:
   - Chạy lại các viewport liên quan bằng `agent-browser` hoặc `playwright-cli`.
   - Chỉ cập nhật `status: "fixed"` khi browser audit thực tế pass 100%.
   - Nếu việc sửa gây regression (lỗi phụ) ở viewport khác, tiếp tục vòng lặp cho đến khi hoàn toàn ổn định.

---

## 📢 YÊU CẦU BÁO CÁO KẾT THÚC (MANDATORY SUMMARY)
Kết thúc phiên làm việc, luôn báo cáo định dạng chuẩn:
- **main task**: PASS / FAIL
- **UI anomalies detected**: N
- **fixed**: N
- **remaining**: N
- **routes checked**: [danh sách các routes]
- **viewport matrix checked**: [danh sách các viewports]
