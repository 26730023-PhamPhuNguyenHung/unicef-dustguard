# BÁO CÁO KHẢO SÁT & AUDIT TOÀN DIỆN UI/UX, DESIGN TOKENS, CSS & COMMUNITY MODULES — DUSTGUARD VN

**Thời điểm thực hiện**: 21/08/2026  
**Phạm vi**: CSS & Tokens (`index.css`, `index.html`), Thư viện Component Primitives (`design-system`, `components/ui`, `shared/components`), và 11 trang/thành phần thuộc phân hệ **Community Action & Youth Portal** (`app/src/modules/community/`).

---

## I. TỔNG QUAN KHẢO SÁT CSS, DESIGN TOKENS & TAILWIND V4

### 1. Phân tích `app/src/index.css` & Tailwind CSS v4 `@theme`
- **Hệ thống Token hiện tại**: Đã khai báo bảng màu thương hiệu Civic Tech tương phản cao theo tôn chỉ SSOT:
  - Nền Canvas/Surface: Cream `#FDFBF7` (`--color-cream-50`), `#F8F1E2` (`--color-cream-100`), `#EFE3CB` (`--color-cream-200`).
  - Typography Ink: Ink `#231b14` (`--color-ink-900`), `#6b6056` (`--color-ink-500`), `#a89e93` (`--color-ink-300`).
  - Action / Accent: Teal `#0d6f64` (`--color-accent-500`), `#0a564e` (`--color-accent-600`), `#eefaf8` (`--color-accent-50`).
  - Danger / Brand: Seal Red `#9f241f` (`--color-seal-500`), `#7f1d1a` (`--color-seal-600`).
  - Mức độ rủi ro (Risk Levels): `risk-low` (#027a48), `risk-medium` (#b54708), `risk-high` (#c4320a), `risk-critical` (#9f241f).
- **Vấn đề tồn đọng trong CSS**:
  1. **Hardcoded Raw Hex Codes**:
     - `app/src/index.css:330, 334, 349, 373`: Dùng `text-[#231b14]` và `text-[#231b14]/70` thay vì class ngữ nghĩa `text-ink-900` hoặc biến token `var(--color-ink-900)`.
     - `app/src/index.css:529`: `.digital-signature-hash-box` hardcode `background-color: #f0f9ff;` thay vì token `var(--color-blue-light-50)`.
     - `app/src/index.css:265`: Hardcode `box-shadow: 0 0 0 3px rgba(13, 111, 100, 0.25) !important;` cho `:focus-visible` thay vì dùng biến token accent.
  2. **Token Naming Chưa Chuẩn SSOT**:
     - `app/src/index.css:112`: Token bóng `--shadow-glass` mang tên "glass" vi phạm nguyên tắc Golden Invariant *"No Glassmorphism"*. Cần đổi thành `--shadow-elevation-lg`.
  3. **Hardcoded Hex trong `app/src/shared/components/ui.jsx`**:
     - `ui.jsx:6-8`: `text-[#9f241f]`, `text-[#b8770f]`, `text-[#0d6f64]`. Cần đổi sang `text-seal-500`, `text-warning-700`, `text-accent-600`.

### 2. Khảo sát `app/index.html`
- **Vấn đề**:
  - Thiếu `<meta name="theme-color" content="#FDFBF7" />` cho trình duyệt mobile (Safari/Chrome bar).
  - Cần cấu hình thẻ SVG favicon chuẩn Civic Tech đồng bộ với dải màu Seal Red/Cream.

---

## II. BẢNG PHÂN LOẠI VẤN ĐỀ THEO 4 MỨC ĐỘ ƯU TIÊN (P0 - P3)

### 🔴 P0 (Critical) — Lỗi giao diện nghiêm trọng, Dead CTA, Mất dữ liệu, Form không chặn lỗi
1. **[CommunityDiscover.jsx:82]**: Nút *"Tham gia chiến dịch"* dùng `alert()` trình duyệt thay vì gọi API hoặc tương tác thật.
2. **[CommunityCaseWorkspace.jsx:78-92]**: Tạo Task mới chỉ lưu vào React state, không persist xuống D1 backend (`/api/cases/:id/tasks`).
3. **[CommunityCaseWorkspace.jsx:108]**: Nuốt lỗi chuyển hồ sơ `setHandoffSuccess(true)` trong khối catch.
4. **[CommunityActions.jsx:38-48]**: Checkbox hoàn thành nhiệm vụ không sync API xuống D1.
5. **[CreateObservation.jsx:408-423]**: Thiếu bước validate form bắt buộc ở Bước 3 (Địa bàn & Địa chỉ) và Bước 4 trước khi submit.
6. **[CommunityHome.jsx:249]**: Link tới `/community/campaigns/:id` không có trang chi tiết campaign riêng.

### 🟠 P1 (High) — Thiếu Loading/Skeleton/Empty State, Trùng lặp Component, Inline Modal
1. **Trùng lặp Primitives Core**:
   - `Button.tsx` trùng lặp giữa `design-system/components/Button.tsx` và `components/ui/button/Button.tsx`.
   - `StatusBadge` xung đột API giữa `design-system` và `shared/components/ui.jsx`.
2. **Thiếu Skeleton & Empty State**:
   - `ObservationDetail.jsx:88-94` & `CommunityCaseWorkspace.jsx:112-118` dùng văn bản `Đang tải...`.
   - `CommunityCases.jsx:192-196` dùng raw text div cho empty state.
3. **Modal không đạt chuẩn Accessibility**:
   - `ObservationDetail.jsx:243`, `CommunityCaseWorkspace.jsx:435`, `CommunityImpact.jsx:126` tự viết inline modal.
4. **Kích thước payload ảnh Base64 trong `CreateObservation.jsx:56-76`**: Nén ảnh qua Canvas (max width 1200px, quality 0.7) và giới hạn tối đa 4 ảnh.

### 🟡 P2 (Medium) — Hardcoded hex/styles, Microcopy, Contrast, In ấn A4
1. **Hardcoded raw hex colors**: `index.css:330`, `shared/ui.jsx:6-8`.
2. **In ấn Giấy chứng nhận (`CommunityImpact.jsx:182`)**: Bổ sung CSS print chuyên biệt `@media print`.
3. **Breadcrumb sai ngữ nghĩa (`ObservationDetail.jsx:114`)**: Đổi nhãn breadcrumb `/community/cases` thành *"Vấn đề theo dõi"*.

### 🔵 P3 (Low) — Polish Animation, Semantic HTML & ARIA tags
1. Đổi tên token `--shadow-glass` thành `--shadow-elevation-lg`.
2. Bổ sung `aria-current="step"`, `role="tablist"`, `role="tab"`, `aria-selected`.
3. Thêm `<meta name="theme-color" content="#FDFBF7" />`.
