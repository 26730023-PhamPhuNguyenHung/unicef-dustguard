# TESTING & VERIFICATION SSOT

## 1. Test Execution Commands
- **Fast Single Test (< 0.5s)**: `node --test app/tests/<file_name>.test.js`
- **Full Verification Suite**: `npm --prefix app run verify` (Vite build + 55+ test suites)
- **Vite Build Verification**: `npm --prefix app run build`

## 2. Test Coverage Invariants
Mọi module mới phải có bài kiểm tra tự động bao phủ:
1. **Observation Lifecycle**: Tạo ghi nhận -> Lưu D1 -> Đính kèm ảnh SHA-256 -> Tải lại dữ liệu nguyên vẹn.
2. **Follow-Up State Changes**: Ghi nhận kiểm tra lại -> Đổi trạng thái (Better / Unchanged / Worse) -> Timeline cập nhật.
3. **Action CRUD**: Giao việc -> Cập nhật trạng thái -> Nghiệm thu hoàn thành.
4. **Handoff Workflow**: Chuẩn bị hồ sơ -> Gửi -> Xác nhận -> Đóng.
5. **Community Impact**: Tích lũy điểm, tính giờ tình nguyện, cập nhật thống kê tác động.
6. **No-IoT Resiliency**: Hệ thống hoạt động 100% khi 0 sensor.
