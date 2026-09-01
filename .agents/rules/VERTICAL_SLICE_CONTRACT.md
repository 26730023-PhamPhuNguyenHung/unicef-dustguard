# VERTICAL SLICE CONTRACT — ĐẶC TẢ PHÁT TRIỂN NỐI DỮ LIỆU THẬT END-TO-END

## 0. NGUYÊN TẮC BẮT BUỘC
Ưu tiên theo thứ tự:
1. **Đơn giản**
2. **Chạy thật**
3. **Ít code**
4. **Dễ hiểu**
5. **Dễ maintain**
6. **Sau đó mới tối ưu**

Tuyệt đối tránh over-engineering:
- KHÔNG tạo repository layer, service layer chỉ để forward hàm.
- KHÔNG CQRS, event bus, WebSocket / realtime giả lập.
- KHÔNG Redux, không custom server-state store.
- D1 prepared statements + bind trực tiếp tham số (Zero ORM rườm rà).
- Hono native trên Cloudflare Workers.
- TanStack Query / lightweight fetch & invalidation pattern cho server-state.
- Mỗi lượt chỉ làm đúng **1 Vertical Slice** mỏng cho **1 Màn hình**:
  `UI hiện có → API thật → D1 thật → Thao tác thật → Refresh đúng dữ liệu → DevTools Verify → D1 Verify`

---

## 1. THỨ TỰ TRIỂN KHAI TUYẾN TÍNH (8 PHÂN HỆ STAFF)
1. **Quan trắc (`/staff/monitoring`)** — Tạo station/readings, derive summary/chart/abnormal.
2. **Cảnh báo (`/staff/alerts`)** — Reuse sensor alerts, triage & escalation.
3. **Công trình (`/staff/sites` & `/staff/sites/:id`)** — Parent entity, risk score, map & telemetry history.
4. **Hồ sơ (`/staff/cases` & `/staff/cases/:id`)** — 7-step DAG enforcement, Before/After evidence.
5. **Nhiệm vụ (`/staff/tasks`)** — Assignment, deadlines, calendar slots.
6. **Báo cáo (`/staff/reports`)** — Weekly aggregates, export PDF/Excel.
7. **Thông báo (`/staff/notifications`)** — Actionable reminders.
8. **Trang chính (`/staff`)** — Executive snapshot deriving 100% from underlying D1 entities.

---

## 2. DEFINITION OF DONE CHO MỖI VERTICAL SLICE
- [ ] Không còn mock data / hardcoded arrays trên màn hình.
- [ ] Mọi con số KPI, Chart, Bảng đều query & derive từ D1 thật.
- [ ] Mọi nút bấm (Tạo, Thêm, Sửa ngưỡng, Tạm dừng, CSV) thực hiện HTTP request thật và persist vào D1.
- [ ] Reload trang (F5) dữ liệu vẫn tồn tại chính xác trong D1.
- [ ] Network tab DevTools không có 404, 500, hay vòng lặp request vô hạn.
- [ ] Responsive matrix đạt chuẩn: 1366x768, 1440x900, 1920x1080 và Mobile.
