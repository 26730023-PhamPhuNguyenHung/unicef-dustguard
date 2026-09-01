# DUSTGUARD UI TEXT + RESPONSIVE RULES (SSOT)

Mục tiêu:
- Không truncate chữ vô lý.
- Không rớt chữ.
- Không ép nội dung vào card/table quá hẹp.
- Nội dung UI phải ngắn ngay từ nguồn, không chữa cháy bằng CSS.
- Ưu tiên đọc được hơn việc cố nhét nhiều cột (ĐỌC ĐƯỢC > NHÉT NHIỀU > TRANG TRÍ).

---

## 1. COPY PHẢI NGẮN (Từ Data Presentation Layer)

Bắt buộc:
- Menu: tối đa 2–3 từ.
- Button: tối đa 1–3 từ.
- KPI label: tối đa 3 từ.
- Tab: tối đa 2 từ.
- Status badge: tối đa 2–3 từ.
- Table header: tối đa 2–3 từ.
- Subtitle: tối đa 1 câu.
- Không dùng câu hành chính dài trong UI.

### Bảng chuẩn hóa Copy:
| BAD (Dài dòng / Hành chính) | GOOD (Ngắn / Rõ / Dễ đọc) |
|---|---|
| "Xem tất cả các công trình đang được theo dõi" | "Xem tất cả" |
| "Yêu cầu thực hiện biện pháp khắc phục" | "Yêu cầu xử lý" |
| "Đang trong quá trình xử lý" | "Đang xử lý" |
| "Cảnh báo vượt ngưỡng chất lượng không khí" | "Cảnh báo bụi cao" |

---

## 2. CẤM TRUNCATE MẶC ĐỊNH

Tuyệt đối KHÔNG được tự ý dùng:
- `truncate`
- `text-ellipsis`
- `overflow-hidden`
- `whitespace-nowrap`

cho:
- Tên công trình
- Tên hồ sơ
- Tiêu đề nhiệm vụ
- Trạng thái / Status
- Button text
- Sidebar navigation item
- Table cell thông tin chính

### Ngoại lệ DUY NHẤT:
Chỉ truncate dữ liệu phụ kỹ thuật thật dài: UUID, SHA-256 hash, URL, Technical Trace ID.

### Quy tắc xử lý khi text không vừa:
1. Rút ngắn copy ngay từ data presentation layer.
2. Tăng width vùng chứa.
3. Cho text wrap tự nhiên (tối đa 2 dòng).
4. Giảm số cột hiển thị trong card hẹp (đưa dữ liệu phụ xuống dòng 2 hoặc vào drawer chi tiết).
5. KHÔNG được che nội dung chính bằng "...".

---

## 3. FLEX & GRID SAFETY (Bắt buộc `min-w-0`)

Mọi flex/grid child chứa text phải có `min-width: 0` (`min-w-0`) để chống tràn cha.

```jsx
// Chuẩn an toàn:
<div className="flex min-w-0 gap-3">
  <div className="min-w-0 flex-1">
    <div className="font-bold text-sm break-words leading-snug">...</div>
  </div>
</div>
```

---

## 4. TABLE & CARD DENSITY RULE

Không cố nhét 8–10 cột vào một khung card hẹp.

### Đối với Dashboard 3 Cột (Grid hẹp ~350–450px):
- Tối đa 3–4 cột thông tin cốt lõi (VD: `Công trình / Địa bàn`, `Điểm`, `Lý do`, `Thao tác`).
- Thời gian hoặc mã hồ sơ đưa lên dòng phụ của tên công trình.
- Thao tác gom gọn `[Mở]` `[Sửa ⌵]`, không bày 4-5 nút dài.

### Đối với Trang Danh sách Toàn màn hình (Desktop 1366–1536px):
- Tối đa 6–7 cột thông tin chính.
- Tên công trình / hồ sơ: Cho phép wrap 2 dòng, `break-words`.
- Nếu thiếu chỗ: Ưu tiên ẩn/bỏ cột phụ trước khi giảm font.

---

## 5. RESPONSIVE MATRIX & DEVTOOLS VERIFICATION

- **>= 1440px**: Full layout 3 cột cân đối, không rớt chữ.
- **1280–1439px**: Giảm gap/padding, giữ font đọc rõ ($\ge 11-12\text{px}$).
- **1024–1279px**: 3 cột chuyển thành 2 cột hoặc panel phụ chuyển xuống dưới.
- **< 1024px / Mobile 360–430px**: Xếp chồng dọc (stacked cards), zero horizontal overflow.

### Kiểm tra Target Viewports bắt buộc:
1. `1366 × 768` (Laptop phổ thông VN)
2. `1440 × 900` (MacBook / Laptop 14-inch)
3. `1536 × 864` (Laptop tỷ lệ 16:9)
4. `1920 × 1080` (Màn hình lớn)
5. `390 × 844` (Mobile chuẩn)
