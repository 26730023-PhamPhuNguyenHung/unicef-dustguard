# DUSTGUARD VN — MOCK & PLACEHOLDER AUDIT
> **Ngày thực hiện**: 2026-09-05  
> **Mục tiêu**: Loại bỏ 100% dữ liệu giả mạo, fake API, fake AI, Math.random() trong luồng nghiệp vụ production.

---

## 1. PHÂN LOẠI & KẾT QUẢ RÀ SOÁT MÃ NGUỒN

### A. Test Fixture (Được phép trong phạm vi kiểm thử)
- Các dữ liệu mẫu trong `app/tests/`, `dustguard-operations/tests/`: Được cô lập hoàn toàn trong môi trường chạy test tự động (`node --test`), không liên đới tới runtime của `apps/server` hay `dustguard-operations`.
- **Trạng thái**: HỢP LỆ & GIỮ NGUYÊN.

### B. Development Seed (Dữ liệu khởi tạo môi trường dev)
- `apps/server/src/db/seed.ts` và `dustguard-operations/apps/server/src/db/seed.ts`: Cung cấp dữ liệu mẫu cho nhà phát triển khi chạy `npm run seed`.
- **Nguyên tắc**: Cả hai hệ thống đều sở hữu cơ chế `runMigrations()` độc lập hoàn toàn. Khi khởi động cơ sở dữ liệu trống không chạy seed, hệ thống vẫn vận hành 100% bình thường (Clean Database Test PASS).
- **Trạng thái**: HỢP LỆ & ĐÃ XÁC MINH TÍNH ĐỘC LẬP.

### C. Production Mock & Fallback Data (Đã phát hiện & Loại bỏ)
1. **Mã băm SHA-256 giả lập khi Web Crypto lỗi**:
   - *Vị trí phát hiện*: `apps/web/src/utils/crypto.ts` dòng 12.
   - *Hành vi cũ*: Sử dụng `sha256_${Date.now()}_${Math.random().toString(36)...}` khi xảy ra lỗi.
   - *Khắc phục*: Triển khai thuật toán băm SHA-256 thuần chuẩn FIPS 180-4 (`sha256Pure`) tính toán trực tiếp trên từng byte nhị phân của file tải lên. Đảm bảo 100% mã băm SHA-256 là giá trị cryptographic thật, loại bỏ hoàn toàn `Math.random()`.
   - *Trạng thái*: **ĐÃ SỬA TRIỆT ĐỂ (FIXED)**.
2. **Biến độ tin cậy AI cố định (`confidence || 0.44`)**:
   - *Vị trí phát hiện*: `dustguard-operations/apps/web/src/pages/LegalWorkspacePage.tsx` dòng 356.
   - *Hành vi cũ*: Khai báo biến `confidencePercent = Math.round((analysis?.confidence || 0.44) * 100)`.
   - *Khắc phục*: Xóa bỏ hoàn toàn biến giả lập này; bổ sung banner công bố pháp lý chính thống xác nhận hệ thống hoạt động dựa trên bộ quy tắc chuyên gia kết hợp FTS5, chỉ mang tính chất tham khảo kỹ thuật và không tự tiện đưa ra kết luận xử phạt thay thế cán bộ công vụ.
   - *Trạng thái*: **ĐÃ SỬA TRIỆT ĐỂ (FIXED)**.

### D. Placeholder UI & Feature Gating
1. **Phân hệ Cảm biến Bụi IoT**:
   - Hệ thống backend đã có endpoint nhận dữ liệu thật (`POST /api/iot/ingest`) có xác thực chữ ký HMAC-SHA256, nhưng phần cứng vật lý tại các công trình vẫn đang ở giai đoạn chế tạo thử nghiệm (ESP32 + APM2000).
   - *Xử lý*: Bổ sung badge nổi bật `"Thử nghiệm Hiện trường (Hardware Pilot)"` trên giao diện `IotDevicesPage.tsx`. Không giả lập luồng dữ liệu ảo hay dùng `Math.random()` để tạo chỉ số bụi giả mạo.
   - *Trạng thái*: **ĐÃ GẮN NHÃN MINH BẠCH (PILOT LABELED)**.
2. **Dữ liệu Trống (Empty State) trên Dashboard**:
   - Cả hai trang Dashboard (`apps/web` và `dustguard-operations`) đều truy vấn trực tiếp bảng dữ liệu thật qua SQLite Aggregations.
   - Khi cơ sở dữ liệu hoàn toàn trống (0 vụ việc, 0 phản ánh), hệ thống hiển thị banner và giao diện Empty State chuẩn mực (`0 phản ánh`, `0 vụ việc`, nút bấm dẫn tới hành động thực tế), tuyệt đối không tự chèn các con số giả như 38, 11, 42.
   - *Trạng thái*: **CHUẨN MỰC RUNTIME (VERIFIED)**.
