# HUMAN JOURNEYS — DUSTGUARD VN V2
## Hành Trình Vận Hành Đa Bên Xuyên Suốt Một Vụ Việc Thực Tế (Golden Journey)

> **Golden Case SSOT**: `#DG-2026-0842` — Nút giao An Phú · TP. Thủ Đức (Dự án Vành Đai 3)  
> **Nguyên tắc**: Một dòng thời gian duy nhất nối liền 5 vai trò từ Phát hiện đến Nghiệm thu.

---

## 1. SƠ ĐỒ HÀNH TRÌNH VÀNG XUYÊN SUỐT (GOLDEN JOURNEY FLOW)

```text
[BƯỚC 1: SIGNAL] ──> Người dân / Cảm biến phát hiện bụi tại Nút giao An Phú
       ↓
[BƯỚC 2: TRIAGE] ──> Admin tiếp nhận tín hiệu, thấy gần trường học (<100m) ➔ Tạo Vụ việc #DG-2026-0842
       ↓
[BƯỚC 3: INSPECT] ──> Admin giao Cán bộ Lan khảo sát ➔ Lan đến chụp ảnh Before & chấm 10 checklist QCVN 18
       ↓
[BƯỚC 4: DISPATCH] ──> Admin ra lệnh khắc phục ➔ Giao Nhà thầu Miền Nam thực hiện trong 24h
       ↓
[BƯỚC 5: ACTION] ──> Nhà thầu phun nước dập bụi, quây lưới ➔ Chụp ảnh After nộp lên hệ thống
       ↓
[BƯỚC 6: VERIFY] ──> Cán bộ Lan quay lại tái kiểm sau 24h ➔ Đo lại PM2.5 (28 µg/m³) đạt chuẩn ➔ Ký nghiệm thu
       ↓
[BƯỚC 7: OUTCOME] ──> Đóng vụ việc ➔ Người dân nhận thông báo kết quả Before/After ➔ Admin ghi nhận SLA đạt
```

---

## 2. KỊCH BẢN TỪNG BƯỚC THEO GÓC NHÌN CON NGƯỜI (STEP-BY-STEP SCENARIOS)

### 2.1 Bước 1: Người Dân Phát Hiện & Gửi Tín Hiệu (08:15 Sáng)
- **Nhân vật**: Anh Nguyễn Văn An (Phụ huynh đưa con đi học tại Trường Tiểu học An Phú).
- **Hành động thực tế**:
  1. Anh An thấy xe tải chở đất từ công trường Vành Đai 3 làm rơi vãi đất, bụi bay mù mịt cổng trường.
  2. Mở trình duyệt điện thoại vào `dustguard.vn/citizen/report/new`.
  3. Chụp 1 bức ảnh hiện trường (hệ thống tự nén <300KB và lấy GPS WGS84).
  4. Chọn danh mục *"Bụi thi công & rơi vãi đất cát"*, bấm **[Gửi phản ánh]**.
  5. Màn hình trả về mã theo dõi **`#DG-2026-0842`** kèm trạng thái *"Đã tiếp nhận"*.

### 2.2 Bước 2: Admin Tiếp Nhận & Tạo Vụ Việc (08:30 Sáng)
- **Nhân vật**: Anh Hùng (Cán bộ trực Trung tâm Điều phối Môi trường).
- **Hành động thực tế**:
  1. Anh Hùng mở Bàn làm việc Admin (`/admin`), thấy tín hiệu mới từ An Phú ở đầu Inbox.
  2. Xem lý do cần ưu tiên: *"Gần trường học 85m + Trạm cảm biến CG-03 đo PM2.5 đạt 142 µg/m³"*.
  3. Bấm **[Tạo vụ việc & Giao khảo sát]**, chọn Cán bộ Lan phụ trách địa bàn Thủ Đức với hạn 2 giờ.

### 2.3 Bước 3: Cán bộ Lan Khảo Sát Thực Địa (09:45 Sáng)
- **Nhân vật**: Chị Nguyễn Thị Lan (Thanh tra viên môi trường).
- **Hành động thực tế**:
  1. Chị Lan nhận thông báo trên điện thoại (`/staff`), bấm vào nhiệm vụ.
  2. Bấm nút **[Chỉ đường]** để mở Google Maps đi xe máy tới Nút giao An Phú.
  3. Tới nơi, chị Lan mở form kiểm tra (`/staff/inspect/DG-2026-0842`):
     - Chụp 2 ảnh góc rộng cổng công trường không có cầu rửa xe và đất bám mặt đường.
     - Tích chọn 10 tiêu chí QCVN 18 (Ghi nhận: Chưa có cầu rửa xe, Lưới che rách 30%).
     - Đề xuất: Yêu cầu nhà thầu lắp giàn phun sương và bố trí công nhân quét đường ngay.
  4. Bấm **[Gửi biên bản khảo sát]**.

### 2.4 Bước 4: Admin Ban Hành Lệnh Khắc Phục (10:15 Sáng)
- **Nhân vật**: Anh Hùng (Admin).
- **Hành động thực tế**:
  1. Xem biên bản của chị Lan trên trang Case Detail (`/admin/cases/DG-2026-0842`).
  2. Bấm **[Giao đơn vị thi công]**, chọn Nhà thầu Xây dựng Miền Nam, đặt hạn chót khắc phục là 10:00 sáng hôm sau (SLA 24h).
  3. Hệ thống tự động gửi thông báo SMS/Zalo kèm link tác nghiệp không cần mật khẩu cho Chỉ huy trưởng.

### 2.5 Bước 5: Nhà Thầu Triển Khai Khắc Phục & Nộp Minh Chứng (15:30 Chiều)
- **Nhân vật**: Kỹ sư Tuấn (Chỉ huy trưởng Gói thầu XL-02).
- **Hành động thực tế**:
  1. Anh Tuấn mở link trên điện thoại (`/contractor/tasks/DG-2026-0842`), đọc rõ 2 yêu cầu: Rửa sạch mặt đường tiếp giáp và lắp lưới chắn bụi mới.
  2. Anh Tuấn điều xe bồn tưới nước dập bụi và cho công nhân căng lại lưới che kín 100%.
  3. Đứng tại cổng công trường, mở camera trong app chụp ảnh sau xử lý (App kiểm tra Geofence GPS $<50$m hợp lệ).
  4. Bấm **[Nộp minh chứng & Báo hoàn tất]**. Trạng thái chuyển sang *"Chờ tái kiểm"*.

### 2.6 Bước 6: Cán bộ Lan Tái Kiểm Thực Địa (09:00 Sáng Hôm Sau)
- **Nhân vật**: Chị Lan (Thanh tra viên).
- **Hành động thực tế**:
  1. Chị Lan thấy nhiệm vụ *"Tái kiểm An Phú"* trong danh sách việc hôm nay.
  2. Quay lại hiện trường, đối chiếu ảnh Before của hôm qua với hiện trạng hôm nay: Đường đã sạch bùn đất, lưới bao che kín, trạm đo di động ghi nhận PM2.5 giảm xuống **28 µg/m³** (An toàn).
  3. Chụp ảnh nghiệm thu, tích chọn *"Đạt chuẩn QCVN 18:2021/BXD"*, bấm **[Nghiệm thu Đạt]**.

### 2.7 Bước 7: Đóng Vụ Việc & Minh Bạch Kết Quả (09:30 Sáng)
- **Kết quả đa bên**:
  1. **Anh An (Người dân)**: Nhận thông báo trên web/Zalo kèm ảnh Before/After, thấy đường trước cổng trường con mình đã sạch bụi.
  2. **Nhà thầu Tuấn**: Nhận xác nhận đã hoàn thành trách nhiệm, không bị phạt tiền ký quỹ.
  3. **Admin Hùng**: Thấy vụ việc chuyển sang màu xanh *"Đã hoàn tất"*, ghi nhận 1 vụ việc giải quyết đúng hạn SLA 24h.
