# DUSTGUARD VN — BÁO CÁO RÀ SOÁT MÃ NGUỒN PHÌNH & TRÙNG LẶP (CODEBASE BLOAT REPORT)

> **Mã tài liệu**: `DG-AUDIT-BLOAT-01`  
> **Thời điểm lập**: 06/09/2026  
> **Nguyên tắc**: **TRẢI RỘNG KHÔNG PHẢI LÀ MẠNH; CODEBASE TINH GỌN, RÕ NGUỒN GỐC VÀ DỄ BẢO TRÌ LÀ TỐI THƯỢNG.**

---

## 1. TỔNG QUAN PHÂN BỐ DUNG LƯỢNG VÀ TỆP TIN

- **Side A (Cộng đồng)**: `apps/web` (28 trang TSX) + `apps/server` (Express API) + CSDL `dustguard-community.db` (21 bảng). Trạng thái: **Sạch, hoàn toàn TypeScript, không có tệp `.bak` hay duplicate**.
- **Side B (Thanh tra & Vận hành)**: `dustguard-operations/apps/web` (31 trang TSX) + `dustguard-operations/apps/server` (Express API + Decision Engine) + CSDL `dustguard-operations.db` (41 bảng). Trạng thái: **Tổ chức module chặt chẽ, 11 submodules decision-support**.
- **Phân hệ Cũ (Legacy Monolith `app/`)**: Được bảo lưu theo Section 30 để phục vụ tra cứu lịch sử Git và đối chiếu tài liệu, **hoàn toàn cô lập khỏi chuỗi build runtime chính của Side A & Side B**.

---

## 2. BẢNG PHÂN LOẠI & ĐÁNH GIÁ CÁC THÀNH PHẦN (ACTION DISPOSITION)

| Thành phần / Tệp tin | Vị trí hiện tại | Hiện trạng & Trách nhiệm | Đánh giá phân loại | Quyết định hành động |
|---|---|---|:---:|---|
| **Thư mục `app/`** | Root `/app/` | Chứa mã nguồn JSX cũ từ các phiên bản sơ khởi trước đợt di trú TSX 2 phía. | **DEPRECATE / ISOLATED** | **KEEP ISOLATED**: Giữ nguyên không xóa để bảo toàn lịch sử tra cứu Git theo Section 30, nhưng cách ly 100% khỏi các lệnh build sản xuất (`apps/` và `dustguard-operations/`). |
| **Component So sánh Trước/Sau** | `apps/web/src/components/common/BeforeAfterComparison.tsx`<br>`dustguard-operations/.../BeforeAfterComparison.tsx` | Hai bản component TSX độc lập phục vụ 2 phía (Side A người dân xem kết quả; Side B thanh tra thẩm tra đối chứng). | **KEEP (AUTONOMOUS)** | Giữ độc lập theo nguyên tắc 2 Side Autonomous; không gộp chung để tránh phụ thuộc chéo về styling và context. |
| **Thuật toán Băm SHA-256** | `apps/web/src/utils/crypto.ts`<br>`dustguard-operations/.../utils/crypto.ts` | Triển khai Web Crypto chuẩn FIPS 180-4 băm trên byte thực tế. | **KEEP** | Giữ độc lập ở cả 2 phía để bảo đảm client-side hashing độc lập không cần import chung. |
| **Công thức Rủi ro (Risk Formula)** | `apps/server/src/utils/riskScorer.ts`<br>`dustguard-operations/.../decision-support/risk/` | Version 1 (Heuristic cơ bản cho Side A hiển thị nhanh) vs Version 2 (Engine 5 thành tố có phân tách Confidence cho Side B). | **KEEP (INTENTIONAL)** | Đúng với thiết kế miền nghiệp vụ: Side A chỉ cần mức độ ưu tiên trực quan; Side B cần thẩm tra chứng cứ sâu. |
| **Tệp `driver_apm2000.c`** | Root `/driver_apm2000.c` | Mã nguồn C nhúng cho cảm biến phần cứng ESP32 APM2000. | **KEEP** | Lưu trữ mã nguồn firmware phục vụ phân hệ IoT viễn thám thực địa. |
| **Các tệp log tạm `test-results/`** | `logs/test-results/` | Kết quả thực thi các đợt test cũ. | **CLEANUP** | Tự động dọn dẹp trước khi đóng gói gói bàn giao. |
| **Bản nháp Form trên LocalStorage** | Client LocalStorage | Lưu bản nháp người dùng nhập dở. | **CONTROLLED** | Đã gắn cơ chế tự hủy (`removeItem`) ngay khi submit thành công; không gây phình bộ nhớ trình duyệt. |

---

## 3. ĐÁNH GIÁ CÁC TỆP CÓ DUNG LƯỢNG LỚN (GIANT FILES AUDIT)

1. **`CaseDetailPage.tsx` (Side B — 76 KB)**:
   - *Phân tích*: Là màn hình đầu não điều hành vụ việc thanh tra (Command Workspace), tập hợp 7 phân khu chức năng: Tổng quan, Thụ lý, Lịch sử tương tác, Chứng cứ số, Đối soát pháp luật, Lệnh khắc phục và Hỗ trợ thẩm tra.
   - *Đánh giá*: File lớn nhưng đã được phân tách rõ thành các Sub-component (`DecisionSupportSection`, `CitizenFeedbackSection`, `EvidenceTimeline`). Không phát sinh re-render thừa.
2. **`LegalWorkspacePage.tsx` (Side B — 72 KB)**:
   - *Phân tích*: Không gian làm việc thẩm định pháp chế, tích hợp bảng tra cứu FTS5 BM25 toàn văn và cây quyết định đối chiếu quy chuẩn.
   - *Đánh giá*: Hoạt động ổn định, có memoization chống giật khung hình.
