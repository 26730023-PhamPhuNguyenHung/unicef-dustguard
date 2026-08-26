# OPERATOR & DECISION SUPPORT WORKSPACE SSoT — DUSTGUARD VN

## 1. Triết Lý & Định Vị Cốt Lõi (Mindset Shift)

> **CHUYỂN DỊCH TƯ DUY TỐI THƯỢNG**:
> - **Cũ**: *"Thanh tra xử lý vi phạm"* — Áp đặt thẩm quyền nhà nước, lập biên bản xử phạt hành chính, ra lệnh đình chỉ.
> - **Mới**: *"Operational Review & Verification"* — Điều phối vận hành môi trường CivicTech, thẩm tra & xác minh tín hiệu, đối chứng minh chứng thực địa, hỗ trợ kết nối vụ việc tới các kênh xử lý chính thức (1022, iHanoi, Nhà thầu).

---

## 2. Review Queue: Cấu Trúc Hàng Đợi Thẩm Tra

Hàng đợi tác nghiệp sắp xếp các sự kiện/tín hiệu môi trường theo 4 khối thông tin minh bạch:

| Cột thông tin | Ý nghĩa & Dữ liệu nguồn | Cơ chế Fallback |
|---|---|---|
| **Priority Score & Rank** | Điểm số tổng hợp (0 - 100) phân hạng: **P1 Khẩn cấp** (≥ 75 hoặc Quá hạn SLA), **P2 Ưu tiên** (≥ 50), **P3 Theo dõi** (< 50). | Tự động cân bằng khi thiếu một số nguồn dữ liệu. |
| **Signal (Tín hiệu)** | Loại tín hiệu: Cảnh báo cảm biến IoT vượt ngưỡng, Báo cáo quan sát công dân/thanh niên, Tín hiệu điểm nóng tái diễn. | Phân loại rõ nguồn phát hiện ban đầu. |
| **Sensor Telemetry (Đo kiểm)** | Chỉ số bụi PM10, PM2.5, nhiệt độ, độ ẩm, độ tin cậy trạm đo và trạng thái chữ ký số HMAC. | **Zero-IoT Resilience**: Nếu không có cảm biến (0 trạm đo), hệ thống hiển thị rõ *"Chế độ quan sát cộng đồng không cảm biến"* và chuẩn hóa trọng số công thức. |
| **Citizen Evidence (Minh chứng)** | Ảnh hiện trường gắn tọa độ GPS, độ lệch geofence, mã băm **SHA-256 tamper-evident** và số lượt đối chứng. | Hỗ trợ ảnh nén < 300KB và tự động xóa EXIF vị trí nhạy cảm khi cần bảo mật. |

---

## 3. Verification Workflow: 4 Kết Quả Xác Minh Chuẩn Hóa

Khi một Điều phối viên (Operator) thẩm tra một tín hiệu trong Review Queue, họ đưa ra 1 trong 4 kết luận xác minh:

```text
                               ┌──────────────────────────────────────────────────────────┐
                               │                 TÍN HIỆU / SỰ KIỆN MÔI TRƯỜNG            │
                               └────────────────────────────┬─────────────────────────────┘
                                                            │
                                             [ Operator Thẩm tra Thực địa ]
                                                            │
                 ┌──────────────────────────┬───────────────┴──────────────┬──────────────────────────┐
                 ▼                          ▼                              ▼                          ▼
       confirmed_signal               not_confirmed              insufficient_evidence         needs_follow_up
     (Tín hiệu xác thực)          (Không có cơ sở)              (Chưa đủ bằng chứng)        (Cần theo dõi thêm)
                 │                          │                              │                          │
  ┌──────────────┴─────────────┐  ┌─────────┴────────────┐  ┌──────────────┴─────────────┐  ┌─────────┴────────────┐
  │ • Chuyển thành Case đối    │  │ • Đóng cảnh báo      │  │ • Gửi yêu cầu người dân    │  │ • Lên lịch tái kiểm  │
  │   chứng đa bên             │  │ • Lưu vết log giải   │  │   bổ sung ảnh rõ nét       │  │   tra trong 24h-48h  │
  │ • Gửi Handoff 1022/iHanoi  │  │   trình              │  │ • Chờ dữ liệu đối chứng    │  │   (Community Target) │
  └────────────────────────────┘  └──────────────────────┘  └────────────────────────────┘  └──────────────────────┘
```

### Chi tiết 4 trạng thái:
1. `confirmed_signal` (**Tín hiệu xác thực**):
   - Bằng chứng ảnh, tọa độ và đo kiểm khớp với thực tế ô nhiễm / phát tán bụi ngoài hiện trường.
   - Hành động: Chuyển sang tạo Hồ sơ Vụ việc (Case) 7 bước hoặc chuẩn bị hồ sơ Civic Dossier gửi Handoff.
2. `not_confirmed` (**Không xác nhận / Không có cơ sở**):
   - Hiện trường hoạt động bình thường, không phát hiện vi phạm quy chuẩn hoặc thông tin phản ánh không có căn cứ thực tế.
   - Hành động: Đóng cảnh báo, lưu trữ log thẩm tra với lý do giải trình.
3. `insufficient_evidence` (**Chưa đủ bằng chứng**):
   - Ảnh chụp chưa rõ nét, thiếu tọa độ GPS chính xác hoặc dữ liệu chưa đủ đối chứng.
   - Hành động: Gửi yêu cầu người báo cáo bổ sung thêm ảnh hiện trường có định vị.
4. `needs_follow_up` (**Cần theo dõi thêm**):
   - Tín hiệu chập chờn hoặc công trình đang trong quá trình thực hiện dập bụi.
   - Hành động: Đưa vào hàng đợi theo dõi và kích hoạt mục tiêu đối chứng cộng đồng 24h - 48h (Community Follow-up Target).

---

## 4. Regulation Reference Assistant (Trợ Lý Tra Cứu Quy Chuẩn)

### Disclaimer Bắt Buộc (Mandatory Civic Disclaimer)
> **`"Mang tính hỗ trợ tra cứu, không thay thế kết luận thẩm quyền"`**
> 
> *Thông tin tra cứu quy chuẩn và phân tích gợi ý mang tính hỗ trợ ra quyết định tác nghiệp cho Điều phối viên, không thay thế kết luận giám định hoặc quyết định của cơ quan nhà nước có thẩm quyền.*

### Bảng Quy chuẩn Cốt lõi được tích hợp:

#### 1. QCVN 05:2023/BTNMT — Chất lượng không khí xung quanh
- **Bụi PM10**: Giới hạn 1 giờ: **150 µg/m³**, Giới hạn 24 giờ: **100 µg/m³**, Giới hạn năm: **50 µg/m³**.
- **Bụi PM2.5**: Giới hạn 1 giờ: **75 µg/m³**, Giới hạn 24 giờ: **50 µg/m³**, Giới hạn năm: **25 µg/m³**.
- **Tổng bụi lơ lửng (TSP)**: Giới hạn 1 giờ: **300 µg/m³**, Giới hạn 24 giờ: **200 µg/m³**.

#### 2. QCVN 18:2021/BXD — An toàn & Môi trường trong thi công xây dựng
- **Mục 5.2.1**: Hàng rào che chắn kín cao tối thiểu 2,0m và hệ thống lưới bao che ngăn ngừa vật rơi, bụi phát tán.
- **Mục 5.2.3**: Lưới chắn bụi tầng cao cho công trình cao trên 3 tầng.
- **Mục 5.3**: Bãi tập kết vật liệu rời (cát, đá mạt, xi măng) phải có đê bao hoặc che bạt kín 100%.
- **Mục 5.4**: Bố trí hệ thống phun nước, phun sương dập bụi cưỡng bức liên tục khi phá dỡ, cắt mài bê tông, đào móng.
- **Mục 2.1**: Cầu rửa xe hoặc trạm xịt rửa lốp xe áp lực cao tại cổng ra vào công trường.

#### 3. Quyết định 48/2024/QĐ-UBND TP Hà Nội — Quản lý môi trường đô thị
- **Điều 4 Khoản 2**: Tưới ẩm giảm bụi tối thiểu 3 lần/ngày tại khu vực thi công và tuyến đường vận chuyển xung quanh vào các khung giờ hanh khô.
- **Điều 5 Khoản 1**: Xe chở bùn đất, phế thải xây dựng phải có thùng kín, phủ bạt kín khít, không để rơi vãi vật liệu ra lòng đường.

---

## 5. UI Tokens & Styling (Light Mode High-Contrast)

- **Màu chủ đạo**:
  - `#FDFBF7` Cream (Nền sáng)
  - `#231b14` Ink (Chữ đậm)
  - `#0d6f64` Teal (Thẩm tra & Xác thực)
  - `#9f241f` Seal Red (Cảnh báo khẩn P1)
  - `#d97706` Amber (Cận ngưỡng / Thiếu bằng chứng)
  - `#4f46e5` Indigo (Cần theo dõi thêm 24h-48h)
- **Tuyệt đối không sử dụng Glassmorphism (`backdrop-blur-*`)**.
- **Touch target tối thiểu 44px x 44px** trên toàn bộ các nút bấm thẩm tra, chuyển tab và tra cứu.
