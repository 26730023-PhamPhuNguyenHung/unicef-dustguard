# CONTRACTOR-01 — Bàn Làm Việc Chỉ Huy Trưởng Công Trường (Xem Nhanh Yêu Cầu Xử Lý Bụi)

> **Mã màn hình**: `CONTRACTOR-01` (Viết tắt: `CON-01`)  
> **Tên tiếng Việt**: Bàn Làm Việc Chỉ Huy Trưởng Công Trường & Xử Lý Yêu Cầu Khẩn Cấp  
> **Tên tiếng Anh**: Contractor Overview Dashboard & Fast-Response Workspace  
> **Quy chuẩn & Pháp lý liên quan**: [`QCVN 18:2021/BXD`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-18-2021-BXD.md) (An toàn môi trường xây dựng), [`Nghị định 45/2022/NĐ-CP`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/ND-45-2022-ND-CP.md) (Xử phạt vi phạm môi trường)

---

## 1. Thông Tin Nhận Diện Màn Hình (Screen Identity)

| Thuộc tính | Chi tiết nhận diện thực tế |
|---|---|
| **Mã màn hình** | `CONTRACTOR-01` (Tên tệp: `CONTRACTOR-01-dashboard.md`) |
| **Tên tiếng Việt** | Bàn Làm Việc Chỉ Huy Trưởng Công Trường & Xử Lý Yêu Cầu Khẩn Cấp |
| **Tên tiếng Anh** | Contractor Overview Dashboard & Fast-Response Workspace |
| **Đường dẫn truy cập (Route)** | `/contractor` (hoặc `/contractor/dashboard`) |
| **Tệp giao diện chính** | [`app/src/apps/contractor/pages/dashboard/ContractorDashboardPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/pages/dashboard/ContractorDashboardPage.jsx) kết hợp [`app/src/modules/contractor/ContractorDashboard.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/modules/contractor/ContractorDashboard.jsx) |
| **Khung bố cục (Layout)** | [`app/src/apps/contractor/layout/ContractorLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/layout/ContractorLayout.jsx) (Giao diện sáng rõ, nút bấm to $\ge 48\text{px}$ dễ bấm ngoài công trường) |
| **Ai được sử dụng?** | Nhà thầu xây dựng (Chỉ huy trưởng công trường, Kỹ sư an toàn môi trường HSE, Đội trưởng thi công đào móng, Đội xe vận chuyển) |
| **Trạng thái vận hành** | Đang hoạt động ổn định — Kết nối dữ liệu thực tế từ hệ thống máy chủ |

**Tóm tắt mục đích sử dụng**: Màn hình giúp Chỉ huy trưởng và Ban quản lý công trường nắm bắt ngay các phản ánh về bụi phát tán để kịp thời xử lý. Khi có phản ánh từ người dân hoặc nhắc nhở từ cán bộ kiểm tra, Chỉ huy trưởng nhận được tin nhắn Zalo hoặc SMS kèm đường link, bấm mở trực tiếp trên điện thoại ngoài hiện trường mà không cần nhớ mật khẩu. Màn hình hiển thị ngay: số việc cần làm gấp trong ngày, số việc đã xử lý xong, điểm chấp hành môi trường và danh sách các việc cần làm ngay (tưới nước dập bụi đường gom, trùm bạt bãi cát, xịt rửa lốp xe tải) để xử lý trong vòng 24 giờ đến 48 giờ, giúp nhà thầu không bị phạt tiền từ 10 đến 50 triệu đồng và không bị đình chỉ thi công.

---

## 2. Mục Đích & Giá Trị Thực Tế

### 2.1. Giải quyết bài toán thực tế ngoài công trường
1. **Mở xem ngay từ tin nhắn Zalo/SMS — Không cần nhớ mật khẩu**:
   - Chỉ huy trưởng và kỹ sư thường xuyên ở ngoài hiện trường đầy bụi bặm, tay đeo găng bảo hộ, rất ngại đăng nhập tài khoản hay gõ mật khẩu dài dòng.
   - Khi có việc gấp, hệ thống tự động gửi tin nhắn:  
     `[DustGuard VN] Cảnh báo bụi tại Cổng 2 Dự án Chung cư Thanh Xuân. Yêu cầu xịt rửa xe và tưới ẩm trước 17:00. Bấm mở xem ngay: https://dustguard.vn/contractor?token=a8f2e9... (Link dùng được trong 3 ngày)`.
   - Bấm vào link là mở thẳng bàn làm việc của đúng công trường mình đang phụ trách.
2. **Biết trước để sửa ngay — Tránh bị phạt tiền từ 10 đến 50 triệu đồng**:
   - Theo quy định pháp luật (Nghị định 45/2022/NĐ-CP), xe chở đất cát không rửa lốp làm bẩn đường, bãi vật liệu không phủ bạt sẽ bị phạt nặng và có thể bị đình chỉ thi công từ 1 đến 3 tháng.
   - Màn hình đếm ngược thời gian còn lại (ví dụ: *Còn 2 giờ 30 phút*), giúp Chỉ huy trưởng kịp gọi xe bồn tưới nước hoặc nhắc công nhân trùm bạt trước khi đoàn kiểm tra đến lập biên bản.
3. **Giữ trọn uy tín để nhận lại tiền đặt cọc môi trường**:
   - Mỗi lần dập bụi xong và nộp ảnh chụp nghiệm thu sạch sẽ, điểm chấp hành môi trường sẽ tăng lên.
   - Bảng điểm này là bằng chứng rõ ràng để nộp cho Chủ đầu tư và Ban Quản lý Dự án làm thủ tục thanh toán và hoàn trả toàn bộ tiền ký quỹ bảo vệ môi trường khi xong gói thầu.

### 2.2. So sánh cách làm cũ và cách làm mới

| Nội dung công việc | Cách làm cũ (Gọi điện / Nhắc nhở giấy) | Dùng bàn làm việc DustGuard VN |
|---|---|---|
| **Thời gian nhận tin báo** | Mất 1 - 3 ngày mới nhận được văn bản nhắc nhở | **Dưới 30 giây** nhận tin nhắn Zalo/SMS vào điện thoại |
| **Cách mở xem** | Phải về văn phòng mở máy tính đăng nhập | Bấm 1 chạm trên điện thoại ngay tại công trường |
| **Nội dung yêu cầu** | Nói chung chung, khó biết chính xác chỗ nào | Rõ từng vị trí: Cổng nào, bãi cát nào, cần tưới nước hay che bạt |
| **Nguy cơ bị phạt tiền** | Rất dễ bị lập biên bản phạt bất ngờ | **Tránh được 90%** vì có cảnh báo sớm để tự dập bụi ngay |
| **Bằng chứng giải trình** | Khó chứng minh công trường đã tưới nước dọn dẹp | Có ảnh chụp Trước và Sau lưu rõ ngày giờ làm bằng chứng |

---

## 3. Ai Sử Dụng & Luồng Thao Tác Thực Tế

### 3.1. Các vị trí thực tế tại công trường
1. **Kỹ sư Nguyễn Văn Hùng — Chỉ huy trưởng công trường**:
   - Cần xem nhanh sáng nay có việc gì gấp không, điểm tuân thủ của công trường đạt bao nhiêu để điều hành công nhân làm việc.
2. **Kỹ sư Trần Anh Tuấn — Phụ trách An toàn & Môi trường (HSE)**:
   - Nhận thông báo bụi phát tán, chạy ra kiểm tra thực tế, gọi công nhân dọn dẹp rồi chụp ảnh nộp báo cáo.
3. **Đội trưởng cơ giới & Đội tưới nước**:
   - Nhận lệnh từ Chỉ huy trưởng để cho xe bồn chạy tưới nước đường gom và vận hành máy xịt rửa lốp xe tải ben.

### 3.2. Luồng thao tác nhanh 4 bước ngoài hiện trường

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 1: NHẬN TIN BÁO QUA ZALO / SMS]                                  │
│ Nhận tin nhắn: "Bụi tại Cổng số 2. Hạn xử lý: Trước 17:00 hôm nay"     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Bấm vào link trên điện thoại)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 2: MỞ BÀN LÀM VIỆC CHỈ HUY TRƯỞNG (CONTRACTOR-01)]               │
│ • Xem 3 chỉ số chính: [Việc cần làm: 3] [Đã xong: 8] [Điểm: 88/100]    │
│ • Đọc cảnh báo nguy cơ phạt và danh sách các việc cần làm gấp          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Bấm nút [Chụp ảnh nộp ngay →])
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 3: ĐIỀU ĐỘNG CÔNG NHÂN TƯỚI NƯỚC / CHE BẠT HIỆN TRƯỜNG]          │
│ Cho xe xịt rửa lốp xe tải và quét dọn sạch bùn đất trên đường gom      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [BƯỚC 4: MỞ MÀN HÌNH CON-02 CHỤP ẢNH HIỆN TRƯỜNG ĐÃ SẠCH ĐỂ NỘP BÁO CÁO]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bố Cục Giao Diện & Hình Ảnh Minh Họa

### 4.1. Cách sắp xếp thông tin trên màn hình
1. **Khung thông tin công trường đầu trang**:
   - Tên nhà thầu và Tên dự án (Ví dụ: *Chung cư Thanh Xuân Garden — Gói thầu Móng và Thân*).
   - Nút nổi bật: `[⚠️ Xem 3 việc cần xử lý gấp]` (Màu cam đậm, chữ to, bấm vào nhảy thẳng đến danh sách việc).
2. **Hàng 3 ô số liệu chính**:
   - **Ô 1 — Cần làm gấp**: Số lượng việc đang chờ khắc phục (Chữ màu cam/đỏ, ghi rõ hạn chót 24h - 48h).
   - **Ô 2 — Đã hoàn thành**: Số việc đã dọn dẹp sạch và có ảnh nghiệm thu (Chữ màu xanh lá).
   - **Ô 3 — Điểm chấp hành môi trường**: Điểm số từ 0 đến 100 (Ví dụ: `88 / 100 — Đạt chuẩn an toàn xây dựng`).
3. **Khung nhắc nhở phòng ngừa phạt tiền**:
   - Đánh giá mức độ rủi ro (Thấp / Vừa / Cao) kèm lời khuyên ngắn gọn: *Cần tưới nước đường gom giờ cao điểm để tránh bị thanh tra lập biên bản*.
4. **Danh sách việc cần làm ngay**:
   - Mỗi ô việc ghi rõ: Tên sự việc (xe chưa rửa lốp, bãi cát chưa che bạt), Hạn chót còn bao nhiêu tiếng và nút to `[📷 Chụp ảnh nộp ngay →]`.
5. **Thanh điều hướng nhanh dưới chân màn hình điện thoại**:
   - 4 mục to rõ: `[🏠 Tổng quan]`, `[📋 Việc cần làm]`, `[📁 Sổ vụ việc]`, `[📊 Báo cáo in A4]`.

### 4.2. Giao diện xem trên máy tính (Desktop)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DUSTGUARD VN  |  NHÀ THẦU XÂY DỰNG   Dự án: Chung Cư Thanh Xuân Garden   Chỉ huy trưởng: Nguyễn Văn Hùng  [ Đăng xuất ]│
├────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ BÀN LÀM VIỆC           │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│ [●] Tổng quan nhanh    │ │ BÀN LÀM VIỆC CHỈ HUY TRƯỞNG & ĐIỀU HÀNH HIỆN TRƯỜNG                                       │ │
│ [ ] Việc cần khắc phục │ │ Nhà thầu: Tổng Công Ty CP Xuất Nhập Khẩu & Xây Dựng Việt Nam (Vinaconex)                 │ │
│ [ ] Sổ theo dõi vụ việc│ │ Dự án: Thi công phần ngầm và kết cấu thân Block A & B                                     │ │
│ [ ] Báo cáo in A4      │ │                                                        [ ⚠️ XEM 3 VIỆC CẦN XỬ LÝ GẤP ]    │ │
│ ────────────────────── │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│ CÔNG CỤ NHANH          │                                                                                               │
│ 📍 Kiểm tra vị trí GPS │ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│ 📷 Nộp ảnh báo cáo     │ │ CẦN LÀM GẤP          │  │ ĐÃ XỬ LÝ XONG        │  │ ĐIỂM CHẤP HÀNH MÔI TRƯỜNG            │ │
│ 📑 Hướng dẫn dập bụi   │ │          3           │  │          8           │  │               88 / 100               │ │
│ 📞 Đường dây nóng hỗ trợ│ │ Hạn trong 24h - 48h  │  │ Cán bộ đã duyệt ảnh  │  │ ⭐ Đạt chuẩn an toàn môi trường      │ │
│                        │ └──────────────────────┘  └──────────────────────┘  └──────────────────────────────────────┘ │
│                        │                                                                                               │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ 🛡️ LỜI KHUYÊN PHÒNG NGỪA PHẠT TIỀN (NGHỊ ĐỊNH 45/2022/NĐ-CP)                               │ │
│                        │ │ • Tình trạng: Cần lưu ý — Trường Tiểu học cách công trường 180m                            │ │
│                        │ │ • Việc cần làm ngay: Tưới ẩm đường gom trước giờ học sinh tan học (11:30 & 16:30) để tránh │ │
│                        │ │   bị Thanh tra giao thông lập biên bản phạt từ 10 đến 50 triệu đồng.                       │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│                        │                                                                                               │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ DANH SÁCH VIỆC CẦN LÀM NGAY                                              Xem tất cả (3) →  │ │
│                        │ ├───────────────────────────────────────────────────────────────────────────────────────────┤ │
│                        │ │ [Mã: ACT-089]  [VIỆC GẤP]  [Chưa làm]                             Hạn chót: Hôm nay 17:00  │ │
│                        │ │ Vấn đề: Xe tải chở đất móng không rửa bánh làm dính bùn đất Cổng số 2 ra đường Nguyễn Trãi │
│                        │ │ Cách xử lý: Cho bật máy xịt rửa lốp 100% xe và cử 2 công nhân quét sạch bùn mặt đường      │ │
│                        │ │                                                                [ 📷 CHỤP ẢNH NỘP NGAY → ] │ │
│                        │ ├───────────────────────────────────────────────────────────────────────────────────────────┤ │
│                        │ │ [Mã: ACT-092]  [BÌNH THƯỜNG]  [Đang làm]                          Hạn chót: Ngày mai 10:00 │ │
│                        │ │ Vấn đề: Bãi cát xây thô tại khu vực Zone B chưa trùm bạt                                  │ │
│                        │ │ Cách xử lý: Kéo bạt phủ kín toàn bộ bãi cát và tưới phun sương dập bụi                      │ │
│                        │ │                                                                [ 📷 CHỤP ẢNH NỘP NGAY → ] │ │
│                        │ ├───────────────────────────────────────────────────────────────────────────────────────────┤ │
│                        │ │ [Mã: ACT-095]  [ĐÃ NỘP BÁO CÁO]  [Đang chờ cán bộ duyệt]          Gửi lúc: 11:20 trưa nay │ │
│                        │ │ Vấn đề: Lưới chắn bụi giàn giáo tầng 4 bị rách góc phía sau                               │ │
│                        │ │ Cách xử lý: Đã thay 30m2 lưới mới và buộc dây thép chắc chắn                              │ │
│                        │ │                                                                     [ 🔍 XEM CHI TIẾT → ]  │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3. Giao diện xem trên điện thoại ngoài công trường (Mobile)

```text
┌──────────────────────────────────────────┐
│ [≡] DUSTGUARD VN  [VINACONEX]        [👤]│
├──────────────────────────────────────────┤
│ BÀN LÀM VIỆC CHỈ HUY TRƯỞNG              │
│ Dự án: Chung cư Thanh Xuân Garden        │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │  ⚠️ CÓ 3 VIỆC CẦN XỬ LÝ TRONG HÔM NAY│ │
│ │  [ Bấm xem danh sách việc cần làm ]  │ │ (Nút bấm to rõ)
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────┐ ┌──────────────┐        │
│ │ CẦN LÀM GẤP  │ │ ĐÃ XONG      │        │
│ │      3       │ │      8       │        │
│ │ Hạn trong 24h│ │ Cán bộ đã xem│        │
│ └──────────────┘ └──────────────┘        │
│ ┌──────────────────────────────────────┐ │
│ │ ĐIỂM CHẤP HÀNH: 88 / 100 (ĐẠT CHUẨN) │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ VIỆC CẦN LÀM NGAY:                       │
│ ┌──────────────────────────────────────┐ │
│ │ [MÃ: ACT-089] [HẠN: HÔM NAY 17:00]   │ │
│ │ Xe tải không rửa bánh tại Cổng số 2  │ │
│ │ Cần làm: Xịt rửa xe + Quét bùn đất   │ │
│ │                                      │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │    📷 CHỤP ẢNH NỘP BÁO CÁO NGAY  │ │ │ (Nút to dễ bấm ngoài nắng)
│ │ └──────────────────────────────────┘ │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [MÃ: ACT-092] [HẠN: NGÀY MAI 10:00]  │ │
│ │ Bãi cát Zone B chưa phủ bạt          │ │
│ │ ┌──────────────────────────────────┐ │ │
│ │ │    📷 CHỤP ẢNH NỘP BÁO CÁO NGAY  │ │ │
│ │ └──────────────────────────────────┘ │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│ [🏠 Trang chủ] [📋 Việc làm] [📁 Vụ việc]│
└──────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Kết Nối Hệ Thống

### 5.1. Các đường dẫn lấy dữ liệu (API Endpoints)
- `GET /api/contractor/dashboard`: Lấy thông tin công trường, số việc cần làm và điểm chấp hành môi trường.
- `GET /api/contractor/actions`: Lấy danh sách chi tiết các công việc cần xử lý.
- `POST /api/contractor/auth/verify-token`: Tự động nhận diện Chỉ huy trưởng khi bấm vào đường link trong tin nhắn Zalo/SMS.

### 5.2. Mẫu dữ liệu đơn giản trả về từ hệ thống

```json
{
  "success": true,
  "data": {
    "contractor": {
      "name": "Tổng Công Ty CP Xuất Nhập Khẩu & Xây Dựng Việt Nam (Vinaconex)",
      "representative": "Kỹ sư Nguyễn Văn Hùng",
      "phone": "0988 123 456"
    },
    "project": {
      "name": "Dự án Khu Chung Cư Thanh Xuân Garden",
      "package": "Gói thầu thi công móng và phần thân",
      "address": "Số 150 Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội"
    },
    "stats": {
      "actionRequired": 3,
      "inProgress": 1,
      "completed": 8,
      "complianceRate": 88
    },
    "advice": "Tưới nước đường gom trước 16:30 để tránh bụi giờ học sinh tan trường.",
    "priorityActions": [
      {
        "id": "act_089",
        "code": "ACT-089",
        "title": "Xịt rửa lốp xe tải và dọn bùn đất Cổng số 2",
        "status": "todo",
        "priority": "HIGH",
        "dueDate": "Hôm nay 17:00 (Còn 2.5 giờ)",
        "beforePhotoUrl": "/uploads/evidences/cong2_bui.jpg"
      },
      {
        "id": "act_092",
        "code": "ACT-092",
        "title": "Phủ bạt bãi cát xây thô tại Zone B",
        "status": "in_progress",
        "priority": "MEDIUM",
        "dueDate": "Ngày mai 10:00 (Còn 19.5 giờ)",
        "beforePhotoUrl": "/uploads/evidences/bai_cat_bui.jpg"
      }
    ]
  }
}
```

---

## 6. Danh Sách Nút Bấm & Thao Tác (Action Buttons)

| Tên nút bấm | Nằm ở đâu | Màu sắc & Kiểu nút | Kích thước | Bấm vào sẽ làm gì? | Khi nào bấm được? |
|---|---|---|---|---|---|
| **[⚠️ Xem X việc cần xử lý gấp]** | Banner đầu trang | Nền cam đậm, chữ trắng | Cao $\ge 48\text{px}$, bấm êm | Nhảy nhanh xuống danh sách việc cần làm | Khi có từ 1 việc trở lên |
| **[📷 Chụp ảnh nộp ngay →]** | Trên từng việc cần làm | Nền xanh lá / Cam | Cao $\ge 48\text{px}$, nút to | Mở máy ảnh điện thoại để chụp ảnh sau khi đã dập bụi xong | Việc đang ở trạng thái chưa làm hoặc đang làm |
| **[Xem tất cả (X) →]** | Đầu mục danh sách việc | Chữ xanh đậm có gạch chân | Dễ bấm | Chuyển sang trang xem toàn bộ danh sách công việc | Luôn bấm được |
| **[🔍 Xem chi tiết →]** | Trên việc đã nộp ảnh | Nền xám nhạt, viền đậm | Cao $\ge 44\text{px}$ | Mở xem ảnh đối chứng Trước/Sau và xem cán bộ đã duyệt chưa | Việc đang chờ duyệt hoặc đã hoàn thành |
| **[Đăng xuất]** | Góc trên bên phải | Viền mảnh đơn giản | $44\text{px} \times 44\text{px}$ | Thoát khỏi phiên làm việc hiện tại | Luôn bấm được |

---

## 7. Quy Chuẩn Giao Diện Ngoài Trời

### 7.1. Màu sắc sáng rõ — Tuyệt đối không dùng hiệu ứng mờ ảo
- **Nền trang**: Màu kem sáng `#FAFAF9` phối cùng các thẻ nền trắng tinh `#FFFFFF`.
- **Màu chữ**: Chữ màu xám than đậm `#1C1917`, tương phản cao giúp đọc rõ nét dưới ánh nắng mặt trời gắt ngoài công trường.
- **Màu trạng thái**:
  - Việc gấp cần làm: Nền vàng cam nhạt, viền cam đậm `#D97706`, chữ cam đậm `#B45309`.
  - Đã làm xong: Nền xanh nhạt, viền xanh đậm `#0D6F64`, chữ xanh lá `#047857`.
  - Quá hạn khẩn cấp: Nền đỏ nhạt, viền đỏ đậm `#DC2626`, chữ đỏ gạch `#9F241F`.
- **Tuyệt đối không dùng nền mờ (glassmorphism)** vì sẽ làm lóa mắt khi đứng ngoài trời nắng.

### 7.2. Nút to dễ bấm — Không bị trượt tay khi đeo găng
- Toàn bộ các nút bấm chính có chiều cao tối thiểu **$48\text{px}$** để người dùng bấm chính xác ngay cả khi tay to, đeo găng tay bảo hộ hoặc màn hình bị bám chút bụi.
- Các nút cách nhau ít nhất **$12\text{px}$** để tránh bấm nhầm nút bên cạnh.

---

## 8. Hướng Dẫn Xử Lý Tình Huống & Kiểm Tra Lỗi

### 8.1. Các tình huống thực tế và cách xử lý
1. **Mở link cũ trong tin nhắn bị hết hạn (Sau 3 ngày)**:
   - *Tình huống*: Chỉ huy trưởng mở lại tin nhắn gửi từ tuần trước, link đã hết hiệu lực.
   - *Cách xử lý*: Màn hình không báo lỗi khó hiểu mà hiện thông báo thân thiện: *"Đường link bảo mật đã hết hạn. Bấm nút [Gửi lại link mới qua Zalo/SMS] vào số điện thoại của bạn để nhận mã mới ngay."*
2. **Công trường đang làm tốt, không có vi phạm nào**:
   - *Tình huống*: Chưa có phản ánh hay việc nào cần làm.
   - *Cách xử lý*: Hiển thị thông báo vui tươi: *"Rất tốt! Công trường hiện không có vấn đề bụi nào cần xử lý. Hãy duy trì tưới nước và rửa xe đều đặn."*
3. **Mạng 4G ngoài công trường chập chờn**:
   - *Tình huống*: Tải dữ liệu chậm khi đứng ở góc khuất công trình.
   - *Cách xử lý*: Hiện sẵn khung mẫu xám nhẹ, các nút bấm không bị xê dịch vị trí khi dữ liệu tải xong.

### 8.2. Lệnh kiểm tra màn hình qua PowerShell

```powershell
# 1. Kiểm tra logic hiển thị màn hình nhà thầu (< 0.5s)
node --test app/tests/contractor-ui-workspace.test.js

# 2. Kiểm tra màu sắc tương phản cao và nút bấm to rõ
node --test app/tests/design-system-tokens.test.js

# 3. Chạy kiểm tra nhanh toàn bộ hệ thống
npm --prefix app run verify:quick
```
