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

# LAPTOP 14-INCH / WINDOWS 125% SCALE — MANDATORY
The primary DustGuard staff environment is a Windows laptop approximately 14–15.6 inches running display scaling at 125%.
Therefore DO NOT optimize only for physical resolution.

The primary CSS viewport acceptance target is:
**1536 x 864**

Also test:
- 1366 x 768
- 1440 x 810
- 1536 x 864
- 1280 x 720
- 1920 x 1080

**PRIORITY ORDER:**
1. **1536 x 864** (Chuẩn kiểm thử số 1 - Windows 125% scale trên màn 1080p)
2. **1366 x 768** (Stress test laptop phổ thông VN)
3. **1440 x 810 / 1440 x 900**
4. **1920 x 1080**

A screen is NOT considered complete if it only looks correct at 1920x1080.

### Mandatory rules at 1536x864:
- No page-level horizontal scrolling
- No clipped buttons
- No clipped table columns
- No text collision
- No wrapped primary actions unless intentionally designed
- Sidebar must not consume excessive content width (184–208px)
- Tables must preserve the most important columns
- Secondary metadata may collapse/hide before primary information
- Cards must not become unnecessarily tall
- No fixed-width composition that assumes a >1600px viewport

Do not use browser zoom as a substitute for proper responsive design. Test at browser zoom = 100%.

### Density rule:
DustGuard is an operational dashboard. At 1536x864, the first viewport should expose as much as possible:
- Screen title
- Core filters
- Summary metrics
- Beginning of primary work list

Avoid oversized headings, cards, padding, empty areas, and decorative elements.
Default desktop values:
- App sidebar: 184–208px
- Content horizontal padding: 20–24px
- Card padding: 14–18px
- Card gap: 12–16px
- Control height: 34–38px
- Body text: 13–14px
- Section heading: 16–20px

---

# DATA TABLE RESPONSIVE RULES

Never force every desktop table column to remain visible.
At effective viewport <= 1536px:

### Priority 1 — always visible:
- object/site
- score/severity
- reason/status
- main action

### Priority 2 — visible when space allows:
- time
- location
- evidence

### Priority 3 — collapse first:
- duplicate metadata
- secondary labels
- redundant status text

Do not shrink text below 12px just to fit a table.
Do not let action buttons create horizontal overflow.

### Preferred patterns:
1. Shorten labels
2. Reduce column gap
3. Constrain secondary columns
4. Merge related information in one cell
5. Hide low-priority metadata
6. Only then allow table-local horizontal scroll

**Never allow table overflow to create page-level horizontal scroll.**

