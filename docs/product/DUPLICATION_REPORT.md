# Duplication & Code Consolidation Report — DustGuard VN

Báo cáo kiểm toán trùng lặp mã nguồn và đề xuất hợp nhất thành phần dùng chung:

## 1. Route Redirection & Legacy Mappings (Đã hợp nhất chuẩn)
- Các route cũ `/community/*` đã được chuyển hướng 301 về `/citizen/*`.
- Các route cũ `/executive/*` đã được chuyển hướng 301 về `/staff/reports`.
- Các route cũ `/app/*` đã được chuyển hướng 301 về `/staff`.

## 2. Shared UI Components Consolidation
- **BrandLogo**: Đã thống nhất dùng chung component `src/shared/components/BrandLogo.jsx` cho cả 5 phân hệ.
- **StatusBadge**: Đã hợp nhất logic màu sắc và nhãn trạng thái qua `src/shared/components/StatusBadge.jsx`.
- **ToastProvider**: Đã tích hợp một Toast Feedback Provider duy nhất tại `src/context/`.

## 3. Data Client Normalization
- Hợp nhất toàn bộ HTTP requests qua `src/lib/api/request.js` và các client chuyên biệt (`staff-api.js`, `contractor-api.js`), đảm bảo tự động unwrap dữ liệu và xử lý lỗi RFC 7807 tập trung.
