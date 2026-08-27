# DUSTGUARD VN — ARCHITECTURE DECISION RECORDS (ADRs)

> **Nhật Ký Quyết Định Kiến Trúc & Nguyên Tắc Bất Biến Kỹ Thuật**  
> **Mục tiêu**: Ngăn chặn sự sai lệch kiến trúc (Architecture Drift) giữa các lượt phát triển của AI Agent và Đội ngũ Kỹ thuật.

---

## ADR-001: Cloudflare D1 SQLite Là Nguồn Sự Thật Duy Nhất (D1 as SSOT)
- **Quyết định (Decision)**: Sử dụng Cloudflare D1 SQLite (`env.DB`) cho toàn bộ dữ liệu nghiệp vụ có tính bền vững. Local environment dùng file `dev.db` đồng nhất schema qua các migration SQL.
- **Lý do (Why)**: Đảm bảo độ trễ truy vấn cực thấp tại Edge, chi phí vận hành tối ưu (Free-tier first), tính nhất quán ACID tuyệt đối và không phụ thuộc vào các dịch vụ bên ngoài phức tạp.
- **Giải pháp bị từ chối (Alternatives Rejected)**: Sử dụng Firebase Realtime DB (chi phí cao, khó kiểm soát quan hệ phức tạp) hoặc chỉ dùng `localStorage` (mất dữ liệu khi đổi trình duyệt).
- **Hệ quả & Ràng buộc**: Mọi thay đổi cấu trúc bảng bắt buộc phải tạo file migration trong `app/migrations/`.

---

## ADR-002: Kiến Trúc Dual-Runtime (Hono Edge SSOT & Express Dev Adapter)
- **Quyết định (Decision)**: Xây dựng `worker.js` (Hono Framework) là API Gateway và Production Server chính thức trên Cloudflare Workers. Duy trì `server/index.js` (Express) phục vụ phát triển nội bộ và chạy bộ test offline siêu tốc.
- **Lý do (Why)**: Tối ưu hóa hiệu năng triển khai toàn cầu trên Cloudflare Network, đồng thời giữ chu kỳ kiểm thử cục bộ (Fast Inner Loop < 0.5s) cho lập trình viên.
- **Quy tắc**: Mọi logic domain (`domain/cases`, `domain/observations`, `domain/risk`) được viết dưới dạng pure ES Modules để chia sẻ 100% giữa cả 2 runtime.

---

## ADR-003: Phân Định Rạch Ròi Thực Thể Observation và Case (Observation != Case)
- **Quyết định (Decision)**:
  - `Observation`: Là phản ánh/ghi nhận ô nhiễm ban đầu từ Công dân/Thanh niên hoặc trạm quan trắc IoT. Có thể nhận nhiều `followups`.
  - `Case`: Là hồ sơ pháp lý - hành chính chính thức do Thanh tra viên/Admin thụ lý khi phát hiện hành vi vi phạm quy chuẩn QCVN 05:2023/BTNMT.
- **Lý do (Why)**: Tránh việc tạo hồ sơ hành chính tràn lan từ các tin báo rác/chưa xác minh; phân định rõ trách nhiệm pháp lý giữa quyền giám sát của người dân và thẩm quyền xử phạt của cơ quan chức năng.

---

## ADR-004: Triệt Tiêu Fake/Mock Trong Luồng Production (Zero-Mock Policy)
- **Quyết định (Decision)**: Cấm hoàn toàn việc hardcode mảng dữ liệu giả lập (`mockCases = [{ id: 'CASE-2026-001' }]`) hoặc tự động fallback sang mock khi API lỗi.
- **Lý do (Why)**: Dữ liệu giả khiến người dùng và ban giám khảo hiểu lầm hệ thống hoạt động bình thường trong khi DB/API thực tế đã hỏng.
- **Hành vi chuẩn**: Khi API lỗi hoặc chưa có dữ liệu, UI bắt buộc phải hiển thị **Empty State** hoặc **Error Box kèm nút [Thử lại]**.

---

## ADR-005: Chuẩn Giao Diện CivicTech Tương Phản Cao (No Glassmorphism)
- **Quyết định (Decision)**: Áp dụng bảng màu Civic Tech sáng màu, tương phản cao: Nền kem `#FDFBF7`, chữ đen đậm `#231b14`, điểm nhấn xanh ngọc `#0d6f64`, màu dấu triện đỏ `#9f241f`.
- **Lý do (Why)**: Đảm bảo khả năng đọc rõ ràng ngoài trời nắng gắt khi Thanh tra viên và Tình nguyện viên thao tác trên điện thoại di động; tuân thủ chuẩn tiếp cận WCAG 2.2 AAA.
- **Quy tắc**: Vùng chạm cảm ứng (Touch Target) tối thiểu 44px $\times$ 44px; chữ tối trên nền sáng và chữ sáng trên nền tối.

---

## ADR-006: Mã Băm SHA-256 HMAC Cho Minh Chứng & Chứng Chỉ Thanh Niên
- **Quyết định (Decision)**: Mọi ảnh hiện trường tải lên R2 và mọi Chứng Chỉ Xanh cấp cho sinh viên đều được tính toán và lưu kèm mã băm SHA-256 HMAC (kết hợp `user_id`, `timestamp`, `coordinates`).
- **Lý do (Why)**: Ngăn chặn triệt để hành vi tráo đổi ảnh sau thanh tra, đảm bảo chứng cứ có giá trị đối chất pháp lý và cho phép kiểm định công khai chứng chỉ thanh niên chống làm giả.

---

## ADR-007: Quy Trình Kiểm Thử Phân Cấp 5 Tầng (5-Tier Verification Pipeline)
- **Quyết định (Decision)**: Áp dụng 5 cấp độ kiểm tra:
  - *Tier 0*: Targeted test (`node --test app/tests/<file>.test.js`) — 0.2s đến 1.0s.
  - *Tier 1*: `verify:changed` — < 3s.
  - *Tier 2*: `verify:domain` — < 5s.
  - *Tier 3*: `verify:quick` — < 8s (Default gate trước khi hoàn tất task).
  - *Tier 4*: `verify` — Chạy một lần duy nhất trước Release Gate.
- **Lý do (Why)**: Giữ tốc độ phát triển thần tốc mà vẫn đảm bảo 100% không phát sinh lỗi hồi quy (Zero Regression).
