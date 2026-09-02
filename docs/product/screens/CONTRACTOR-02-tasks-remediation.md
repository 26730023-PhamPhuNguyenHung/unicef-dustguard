# CONTRACTOR-02 — Xử Lý Khắc Phục & Nộp Ảnh Đối Chứng Trước / Sau

> **Mã màn hình**: `CONTRACTOR-02` (Viết tắt: `CON-02`)  
> **Tên tiếng Việt**: Tiếp Nhận Khắc Phục & Nộp Ảnh Đối Chứng Trước / Sau  
> **Tên tiếng Anh**: Remediation Tasks & Before/After Evidence Verification  
> **Quy chuẩn & Pháp lý liên quan**: [`QCVN 18:2021/BXD`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-18-2021-BXD.md) (Quy chuẩn an toàn môi trường xây dựng), [`Nghị định 45/2022/NĐ-CP`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/ND-45-2022-ND-CP.md) (Xử phạt vi phạm bảo vệ môi trường)

---

## 1. Thông Tin Nhận Diện Màn Hình (Screen Identity)

| Thuộc tính | Chi tiết nhận diện thực tế |
|---|---|
| **Mã màn hình** | `CONTRACTOR-02` (Tên tệp: `CONTRACTOR-02-tasks-remediation.md`) |
| **Tên tiếng Việt** | Tiếp Nhận Khắc Phục & Nộp Ảnh Đối Chứng Trước / Sau |
| **Tên tiếng Anh** | Remediation Tasks & Before/After Evidence Verification |
| **Đường dẫn truy cập (Route)** | `/contractor/tasks` (Đường dẫn phụ: `/contractor/actions`, `/contractor/remediation/:id`) |
| **Tệp giao diện chính** | [`app/src/apps/contractor/pages/tasks/ContractorTasksPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/pages/tasks/ContractorTasksPage.jsx), kết hợp [`app/src/modules/contractor/ContractorEvidenceUpload.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/modules/contractor/ContractorEvidenceUpload.jsx) |
| **Khung bố cục (Layout)** | [`app/src/apps/contractor/layout/ContractorLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/layout/ContractorLayout.jsx) (Giao diện sáng rõ, mở máy ảnh 1 chạm, nút bấm to $\ge 48\text{px}$) |
| **Ai được sử dụng?** | Nhà thầu xây dựng (Kỹ sư an toàn HSE, Chỉ huy trưởng công trường, Đội trưởng thi công, Đội trưởng rửa xe) |
| **Trạng thái vận hành** | Đang hoạt động ổn định — Hỗ trợ chụp ảnh trực tiếp tại công trường |

**Tóm tắt mục đích sử dụng**: Màn hình là nơi kỹ sư hiện trường xem ảnh vi phạm ban đầu (ảnh Trước: xe chưa rửa bánh làm bẩn đường, bãi cát chưa trùm bạt), cho công nhân xử lý thực tế (tưới nước dập bụi, kéo bạt che kín, bật vòi xịt rửa lốp), sau đó cầm điện thoại chụp lại ảnh hiện trường đã sạch sẽ (ảnh Sau) và gửi nộp cho cán bộ kiểm tra. Hệ thống tự động kiểm tra xem ảnh chụp có đúng vị trí tại công trường không (khoảng cách dưới 50 mét) và lưu ảnh gốc chống sửa đổi. Việc hoàn thành nộp ảnh đúng hạn (trong 24h - 48h) giúp nhà thầu được duyệt đóng vụ việc trên mạng, không bị cán bộ lập biên bản phạt từ 10 đến 50 triệu đồng và không lo bị đình chỉ thi công.

---

## 2. Mục Đích & Giá Trị Thực Tế

### 2.1. Giải quyết bài toán thực tế ngoài công trường
1. **Có ảnh Trước và ảnh Sau rõ ràng — Hết cảnh cãi nhau bằng miệng**:
   - Thay vì cãi nhau xem công trường đã tưới nước hay chưa, màn hình xếp cạnh nhau:
     - **Ảnh Trước (Khi bị nhắc nhở)**: Xe tải chở đất làm rơi vãi bùn đất ở Cổng số 2, đường bụi mù mịt.
     - **Ảnh Sau (Khi đã xử lý xong)**: Mặt đường đã được quét dọn và tưới ẩm sạch bóng, cầu xịt rửa lốp đang phun nước.
2. **Tự kiểm tra vị trí GPS tại công trường — Chống nộp ảnh chụp bừa từ nơi khác**:
   - Điện thoại tự động so sánh vị trí của người chụp với vị trí công trường. Nếu người chụp đang đứng tại công trường (dưới 50 mét), ảnh mới được chấp nhận.
   - Tránh tình trạng ngồi ở quán cà phê lấy ảnh cũ trên mạng nộp đối phó.
3. **Lưu ảnh gốc có ngày giờ chính xác — Bằng chứng không thể làm giả**:
   - Mỗi bức ảnh chụp nộp lên đều được đóng dấu ngày giờ và mã lưu trữ bất biến. Không ai có thể chỉnh sửa Photoshop để qua mặt cán bộ.
4. **Nộp giải trình trong 2 phút — Cán bộ duyệt online không cần chờ giấy tờ**:
   - Sau khi chụp ảnh Sau và gõ 1 câu giải trình (ví dụ: *"Đã cho xe bồn tưới ẩm 200m đường và vận hành máy rửa xe 100% chuyến"*), kỹ sư bấm gửi là xong. Cán bộ xem ảnh trên điện thoại và bấm duyệt nghiệm thu ngay trong ngày.

### 2.2. So sánh cách làm cũ và cách làm mới

| Tiêu chí | Cách làm cũ (Biên bản giấy / Chờ kiểm tra lại) | Dùng màn hình CON-02 |
|---|---|---|
| **Xem lỗi vi phạm** | Cán bộ gọi điện tả chung chung, dễ nhầm chỗ | Mở máy thấy ngay ảnh chụp lỗi ban đầu kèm vị trí chính xác |
| **Chứng minh đã sửa** | Chờ đoàn thanh tra đến xem lại sau vài ngày | Chụp ngay ảnh Sau gửi lên hệ thống trong 2 phút |
| **Xác thực vị trí** | Khó biết ảnh chụp ở đâu, chụp lúc nào | Tự động đo khoảng cách GPS dưới 50m và ghi rõ ngày giờ |
| **Thời gian nộp giải trình** | Mất 2 - 3 ngày làm công văn giấy gửi phòng Một Cửa | **Dưới 2 phút** gửi trực tiếp từ điện thoại ngoài công trường |
| **Nguy cơ bị phạt tiền** | Cao vì trễ hạn giải trình theo văn bản | **Không bị phạt** vì hoàn thành khắc phục đúng hạn 24h - 48h |

---

## 3. Ai Sử Dụng & Luồng Thao Tác Thực Tế

### 3.1. Các vị trí thực tế tại công trường
1. **Kỹ sư Trần Anh Tuấn — Phụ trách An toàn & Môi trường (HSE)**:
   - Người trực tiếp nhận thông báo, ra hiện trường kiểm tra, đốc thúc tổ thợ tưới nước/trùm bạt, cầm điện thoại chụp ảnh Sau và bấm nộp.
2. **Kỹ sư Nguyễn Văn Hùng — Chỉ huy trưởng công trường**:
   - Xem lại các ảnh đã nộp, theo dõi những việc cán bộ đã duyệt để yên tâm bàn giao ca.
3. **Đội trưởng thi công & Đội lái xe bồn**:
   - Thực hiện trực tiếp việc dập bụi: tưới nước mặt đường, chằng buộc bạt che bãi cát, xịt rửa gầm xe tải trước khi lăn bánh ra đường phố.

### 3.2. Sơ đồ quy trình dập bụi và nộp ảnh 4 bước

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 1: XEM YÊU CẦU & ẢNH LỖI BAN ĐẦU (ẢNH TRƯỚC)]                    │
│ Mở danh sách việc -> Bấm xem chi tiết: Chỗ nào bụi? Hạn xử lý khi nào?│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 2: CHO CÔNG NHÂN XỬ LÝ NGOÀI HIỆN TRƯỜNG]                       │
│ • Điều xe bồn tưới nước dập bụi đường gom                              │
│ • Phủ kín bạt chuyên dụng lên bãi cát đá xây dựng                      │
│ • Bật máy xịt rửa lốp áp lực cao cho toàn bộ xe tải ra vào cổng        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 3: MỞ CAMERA ĐIỆN THOẠI CHỤP ẢNH HIỆN TRƯỜNG ĐÃ SẠCH (ẢNH SAU)]   │
│ • Bấm nút [📷 Chụp ảnh hiện trường]                                    │
│ • Máy tự kiểm tra: Bạn đang đứng tại công trường (Cách 12m - Hợp lệ)  │
│ • Tích chọn các biện pháp đã làm (Đã tưới nước, Đã rửa xe)             │
│ • Nhập 1 câu giải trình ngắn gọn                                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 4: BẤM "XÁC NHẬN HOÀN THÀNH & NỘP ẢNH"]                          │
│ Ảnh gửi thẳng đến cán bộ kiểm tra để duyệt nghiệm thu online           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bố Cục Giao Diện & Hình Ảnh Minh Họa

### 4.1. Cách sắp xếp thông tin trên màn hình
1. **Thanh lọc công việc**:
   - Các nút lọc nhanh: `[Tất cả]`, `[⚠️ Cần làm ngay]`, `[⏳ Đang xử lý]`, `[🔍 Chờ cán bộ duyệt]`, `[✅ Đã hoàn thành]`.
2. **Danh sách các thẻ công việc**:
   - Mỗi thẻ hiển thị: Mã số việc, Mức độ ưu tiên, Tiêu đề lỗi phát tán bụi, Thời hạn còn lại.
   - Nút hành động nổi bật: `[📷 Chụp ảnh nộp ngay]` hoặc `[🔍 Xem ảnh đối chứng]`.
3. **Khung chụp ảnh và nộp báo cáo (Hộp thoại Popup / Trang chi tiết)**:
   - Cột trái: Xem lại **Ảnh vi phạm ban đầu (Ảnh Trước)**.
   - Cột phải: Ô chụp hoặc chọn **Ảnh hiện trường đã khắc phục (Ảnh Sau)**.
   - Ô kiểm tra vị trí: Hiện dòng chữ xanh lá `📍 Đang đứng tại công trường (Cách 15m — Hợp lệ)`.
   - Danh sách tích chọn 10 tiêu chuẩn sạch (Tưới ẩm đường, Phủ bạt bãi cát, Rửa bánh xe, Lưới bao che...).
   - Ô nhập giải trình ngắn gọn (tối đa 200 chữ).

### 4.2. Giao diện xem trên máy tính (Desktop)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DUSTGUARD VN  |  NHÀ THẦU XÂY DỰNG   Dự án: Chung Cư Thanh Xuân Garden   Kỹ sư HSE: Trần Anh Tuấn          [ Đăng xuất ]│
├────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ BÀN LÀM VIỆC           │ DANH SÁCH VIỆC KHẮC PHỤC MÔI TRƯỜNG (3 VIỆC CẦN LÀM)                                          │
│ [ ] Tổng quan nhanh    │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│ [●] Việc cần khắc phục │ │ Lọc nhanh: [ Tất cả (12) ]  [ ⚠️ Cần làm ngay (3) ]  [ Đang xử lý (1) ]  [ Đã xong (8) ]  │ │
│ [ ] Sổ theo dõi vụ việc│ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│ [ ] Báo cáo in A4      │                                                                                               │
│ ────────────────────── │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│ HƯỚNG DẪN DẬP BỤI      │ │ [#ACT-089]  MỨC ĐỘ: GẤP  |  TRẠNG THÁI: CẦN LÀM                           Hạn chót: 17:00 │ │
│ 1. Tưới ẩm đường gom   │ │ Vấn đề: Xe tải chở đất móng không rửa bánh làm rơi vãi bùn đất Cổng số 2 ra đường gom    │ │
│ 2. Phủ bạt bãi cát đá  │ │ Biện pháp yêu cầu: Vận hành máy xịt rửa lốp 100% xe và quét dọn sạch mặt đường            │ │
│ 3. Rửa bánh xe tải     │ │ ┌──────────────────────┐  ┌──────────────────────┐                                        │ │
│ 4. Lưới chắn giàn giáo │ │ │ ẢNH TRƯỚC (BỊ LỖI)   │  │ ẢNH SAU (CHỜ CHỤP)   │                                        │ │
│                        │ │ │ [ Hình xe dính bùn ] │  │ [ Ô chờ tải ảnh lên] │    [ 📷 CHỤP ẢNH HIỆN TRƯỜNG ĐÃ SẠCH ] │ │
│                        │ │ └──────────────────────┘  └──────────────────────┘                                        │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ [#ACT-092]  MỨC ĐỘ: VỪA  |  TRẠNG THÁI: ĐANG XỬ LÝ                    Hạn: Ngày mai 10:00 │ │
│                        │ │ Vấn đề: Bãi tập kết cát đá xây thô tại khu Zone B chưa phủ bạt                            │ │
│                        │ │ Biện pháp yêu cầu: Phủ bạt kín bề mặt bãi cát và lắp vòi phun sương                       │ │
│                        │ │                                                                [ 📷 CHỤP ẢNH NỘP NGAY → ] │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3. Giao diện hộp thoại chụp ảnh nộp báo cáo trên điện thoại (Mobile)

```text
┌──────────────────────────────────────────┐
│ [← Quay lại]  NỘP ẢNH KHẮC PHỤC          │
├──────────────────────────────────────────┤
│ Mã công việc: ACT-089                    │
│ Sự việc: Xe tải không rửa lốp Cổng số 2  │
│ Hạn chót: Còn 2 giờ 15 phút              │
│                                          │
│ 1. ẢNH VI PHẠM BAN ĐẦU (ẢNH TRƯỚC):      │
│ ┌──────────────────────────────────────┐ │
│ │  [ Ảnh chụp xe ben làm rơi bùn đất ] │ │
│ │  Chụp lúc: 08:30 sáng nay            │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ 2. CHỤP ẢNH ĐÃ XỬ LÝ XONG (ẢNH SAU):     │
│ ┌──────────────────────────────────────┐ │
│ │  📷 BẤM ĐỂ MỞ MÁY ẢNH CHỤP NGAY       │ │ (Nút to dễ bấm ngoài trời)
│ │  (Hoặc chọn ảnh vừa chụp từ thư viện)│ │
│ └──────────────────────────────────────┘ │
│  📍 Vị trí: Đang ở công trường (Cách 12m) │
│                                          │
│ 3. BIỆN PHÁP ĐÃ LÀM (TÍCH CHỌN):         │
│ [x] Đã xịt rửa lốp 100% xe tải ra vào    │
│ [x] Đã tưới nước và quét sạch bùn đất    │
│                                          │
│ 4. LỜI GIẢI TRÌNH NGẮN GỌN:              │
│ ┌──────────────────────────────────────┐ │
│ │ Đã cho 2 công nhân quét sạch bùn và  │ │
│ │ bật máy xịt rửa lốp áp lực cao.      │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │    ✅ XÁC NHẬN HOÀN THÀNH & NỘP BÁO CÁO│ │ (Nút to h-48px màu xanh lá)
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Kết Nối Hệ Thống

### 5.1. Các đường dẫn lấy và gửi dữ liệu (API Endpoints)
- `GET /api/contractor/actions`: Lấy danh sách toàn bộ các việc cần làm.
- `GET /api/contractor/actions/:id`: Lấy chi tiết một việc cụ thể kèm ảnh vi phạm ban đầu.
- `POST /api/contractor/actions/:id/evidence`: Nộp ảnh Sau, vị trí GPS và nội dung giải trình.

### 5.2. Mẫu dữ liệu nộp ảnh gửi lên hệ thống

```json
{
  "actionId": "act_089",
  "afterPhotoUrl": "/uploads/evidences/cong2_da_rua_sach.jpg",
  "checklistCompleted": [
    "WHEEL_WASHING",
    "ROAD_SWEEPING_WATERING"
  ],
  "explanation": "Đã cho 2 công nhân quét dọn sạch mặt đường Nguyễn Trãi và vận hành máy xịt rửa lốp áp lực cao cho 100% xe ra vào.",
  "location": {
    "latitude": 20.99845,
    "longitude": 105.81240,
    "distanceMeters": 12,
    "isWithinSite": true
  }
}
```

---

## 6. Danh Sách Nút Bấm & Thao Tác (Action Buttons)

| Tên nút bấm | Nằm ở đâu | Màu sắc & Kiểu nút | Kích thước | Bấm vào sẽ làm gì? | Khi nào bấm được? |
|---|---|---|---|---|---|
| **[📷 Bấm để mở máy ảnh chụp ngay]** | Trong khung nộp ảnh | Nền xanh Teal, viền nổi | Cao $\ge 48\text{px}$, nút to | Bật máy ảnh sau của điện thoại để chụp ảnh hiện trường | Khi đang mở form nộp ảnh |
| **[✅ Xác nhận hoàn thành & Nộp báo cáo]** | Cuối form nộp ảnh | Nền xanh lá đậm `#047857`, chữ trắng | Cao $\ge 48\text{px}$, rộng 100% | Gửi ảnh và lời giải trình lên hệ thống để cán bộ duyệt | Khi đã chụp ảnh Sau và chọn vị trí hợp lệ |
| **[Tất cả] / [Cần làm ngay] / [Đã xong]** | Thanh lọc trên đầu | Thẻ tab xám / xanh | Cao $44\text{px}$ | Lọc danh sách công việc theo trạng thái | Luôn bấm được |
| **[← Quay lại danh sách]** | Góc trên bên trái form | Nút quay lại kèm mũi tên | $44\text{px} \times 44\text{px}$ | Đóng form nộp ảnh và quay lại danh sách | Luôn bấm được |

---

## 7. Quy Chuẩn Giao Diện Ngoài Trời

### 7.1. Màu sắc sáng rõ — Tuyệt đối không dùng nền mờ
- **Nền trang**: Màu kem sáng `#FAFAF9`, thẻ trắng `#FFFFFF` có viền xám `#E7E5E4` sắc nét.
- **Màu ảnh đối chứng**:
  - Khung ảnh lỗi Trước: Viền màu cam đỏ cảnh báo `#DC2626`.
  - Khung ảnh sạch Sau: Viền màu xanh lá hoàn thành `#16A34A`.
- **Cấm hoàn toàn nền mờ ảo**: Không dùng nền kính mờ hay chữ bóng đổ vì người dùng đứng ngoài trời nắng sẽ không nhìn thấy gì.

### 7.2. Nút bấm to — Thao tác bằng ngón tay cái dễ dàng
- Nút chụp ảnh và nút nộp báo cáo chiếm toàn bộ chiều ngang màn hình điện thoại (full width), chiều cao tối thiểu **$48\text{px}$** để chỉ cần dùng 1 ngón tay cái là bấm trúng ngay.

---

## 8. Hướng Dẫn Xử Lý Tình Huống & Kiểm Tra Lỗi

### 8.1. Các tình huống thực tế và cách xử lý
1. **Đứng quá xa công trường khi chụp ảnh (Cách trên 50 mét)**:
   - *Tình huống*: Kỹ sư về nhà hoặc ngồi quán cà phê bấm nộp ảnh.
   - *Cách xử lý*: Hệ thống báo dòng chữ đỏ rõ ràng: *"Bạn đang cách công trường 250m. Vui lòng chụp ảnh trực tiếp tại công trường (dưới 50m) để nộp báo cáo hợp lệ."*
2. **Chụp nhầm ảnh mờ hoặc tối đen**:
   - *Tình huống*: Ảnh chụp bị rung tay hoặc chụp ban đêm không bật đèn flash.
   - *Cách xử lý*: Có nút `[🗑️ Chụp lại]` to rõ ngay bên dưới ảnh để kỹ sư bấm chụp lại ngay trước khi gửi.
3. **Cán bộ yêu cầu làm lại vì chưa sạch hẳn**:
   - *Tình huống*: Cán bộ xem ảnh thấy mặt đường vẫn còn bụi cát nên chưa duyệt.
   - *Cách xử lý*: Thẻ công việc chuyển về màu cam kèm ghi chú của cán bộ: *"Mặt đường còn dính bùn, yêu cầu quét lại"*. Kỹ sư cho quét lại rồi chụp ảnh mới nộp lần 2.

### 8.2. Lệnh kiểm tra màn hình qua PowerShell

```powershell
# 1. Kiểm tra luồng nộp ảnh khắc phục và kiểm tra vị trí GPS (< 0.5s)
node --test app/tests/contractor-ui-workspace.test.js

# 2. Kiểm tra giao diện và nút bấm to rõ
node --test app/tests/design-system-tokens.test.js

# 3. Chạy kiểm tra nhanh toàn hệ thống
npm --prefix app run verify:quick
```
