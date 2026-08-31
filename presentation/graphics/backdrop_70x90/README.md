# DustGuard VN — Backdrop 70x90cm & Video Cover Graphics Package

Tài liệu hướng dẫn in ấn và danh mục ấn phẩm đồ họa cho Vòng Chung kết UNICEF Hackathon 2026.

---

## 📦 Danh Mục File Đã Xuất

| Tên File | Định Dạng | Quy Cách / Kích Thước | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| `dustguard_backdrop_70x90.svg` | SVG Vector | **700mm × 900mm** (ViewBox 7000×9000) | File vector gốc, phóng to vô hạn không vỡ nét |
| `dustguard_backdrop_70x90.png` | PNG Raster | **2333px × 3000px** (Chống răng cưa) | Xem nhanh, trình chiếu slide & preview sân khấu |
| `dustguard_backdrop_70x90_print_guide.pdf` | PDF Vector | **700mm × 900mm** chuẩn in ấn | File gửi trực tiếp xưởng in quảng cáo / poster |
| `backdrop_70x90_renderer.html` | HTML5 Standalone | Đầy đủ nút in 1:1 sang PDF & Canvas 300DPI | Trình chiếu tương tác và in trực tiếp trên trình duyệt |
| `video_thumbnail_cover_16x9.svg` | SVG Vector | **1920px × 1080px** (Tỷ lệ 16:9) | Cover Thumbnail Vector cho video giới thiệu dự án |
| `video_thumbnail_cover_16x9.png` | PNG Raster | **1920px × 1080px** chuẩn Full HD | Ảnh cover thumbnail tải lên YouTube / Presentation |
| `video_thumbnail_cover_renderer.html` | HTML5 Standalone | 16:9 Interactive Viewer | Trình duyệt xem trước thumbnail |
| `dustguard_backdrop_70x90_cmyk_spec.json` | JSON Metadata | Machine-readable Print & CMYK Specs | Tra cứu thông số kỹ thuật cho máy in và AI agents |

---

## 🎨 4 Khối Bố Cục Chuẩn Civic Tech Trên Backdrop

1. **Khối 1: Vấn Đề & Bối Cảnh Đô Thị**:
   - Ô nhiễm PM2.5/10 vượt ngưỡng 3-7 lần tại các đại công trình.
   - Bảng so sánh 4 tiêu chí giữa Phản ánh truyền thống vs. DustGuard VN Civic Tech.
2. **Khối 2: Giải Pháp & Quy Trình 5 Bước Đóng Vòng (5-Step Closed Loop)**:
   - Sơ đồ 5 trạm: (1) Phát hiện → (2) Ưu tiên Risk Score → (3) Hồ sơ số SHA-256 → (4) Chuyển giao 1022 → (5) Tái kiểm 48h.
   - Bằng chứng đối soát mẫu `#DG-2026-0842` (Trước: 142 µg/m³ → Sau: 28 µg/m³).
3. **Khối 3: Trách Nhiệm AI & Bằng Chứng D1 SSOT**:
   - Triết lý *"AI là Trợ lý, Không Phán xét"*: Con người giữ quyền quyết định thực địa.
   - Chuỗi băm SHA-256 Client Web Crypto + Cloudflare D1 SQLite chuẩn SSOT (< 50ms).
4. **Khối 4: Lộ Trình Lean Pilot & Mô Hình 3 Trụ Cột**:
   - 3 Chỉ số Lean: Cảm biến ~0.5tr | SLA 24-48h | Cloud D1 Serverless.
   - 3 Trụ cột: Thanh niên tình nguyện — Nhà thầu thi công — Cơ quan quản lý 1022.
   - 2 Mã QR Vector trực tiếp: Live Demo Web App & Thuyết minh Kỹ thuật.

---

## 🖨️ Hướng Dẫn In Ấn Chuẩn Công Nghiệp (Print Ready)

1. **Khổ giấy thành phẩm**: 700 mm × 900 mm (Khổ đứng).
2. **Chất liệu khuyến nghị**: Decal PP ngoài trời cán màng mờ bồi Formex 5mm (chống bóng lóa dưới đèn hội trường).
3. **Xuất file từ HTML Renderer**: Mở `backdrop_70x90_renderer.html` trên Google Chrome, nhấn **Ctrl + P**, chọn *Save as PDF*, mục Paper Size chọn khổ *Custom 700x900mm*, Margins: *None*, bật *Background graphics*.

---
*Bản quyền © 2026 DustGuard VN — UNICEF Hackathon 2026.*
