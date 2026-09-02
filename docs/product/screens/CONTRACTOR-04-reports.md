# CONTRACTOR-04 — Báo Cáo Chấp Hành Môi Trường & Hồ Sơ Nghiệm Thu In A4

> **Mã màn hình**: `CONTRACTOR-04` (Viết tắt: `CON-04`)  
> **Tên tiếng Việt**: Báo Cáo Chấp Hành Môi Trường & Hồ Sơ Nghiệm Thu In A4  
> **Tên tiếng Anh**: Contractor Compliance Reports & A4 Environmental Acceptance Dossier  
> **Quy chuẩn & Pháp lý liên quan**: [`QCVN 18:2021/BXD`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-18-2021-BXD.md) (An toàn môi trường xây dựng), [`QCVN 05:2023/BTNMT`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-05-2023-BTNMT.md) (Quy chuẩn chất lượng không khí), [`Nghị định 45/2022/NĐ-CP`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/ND-45-2022-ND-CP.md)

---

## 1. Thông Tin Nhận Diện Màn Hình (Screen Identity)

| Thuộc tính | Chi tiết nhận diện thực tế |
|---|---|
| **Mã màn hình** | `CONTRACTOR-04` (Tên tệp: `CONTRACTOR-04-reports.md`) |
| **Tên tiếng Việt** | Báo Cáo Chấp Hành Môi Trường & Hồ Sơ Nghiệm Thu In A4 |
| **Tên tiếng Anh** | Contractor Compliance Reports & A4 Environmental Acceptance Dossier |
| **Đường dẫn truy cập (Route)** | `/contractor/reports` |
| **Tệp giao diện chính** | [`app/src/apps/contractor/pages/reports/ContractorReportsPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/pages/reports/ContractorReportsPage.jsx), kết hợp module bảng 10 tiêu chuẩn tại [`app/src/modules/contractor/ContractorProjectDetail.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/modules/contractor/ContractorProjectDetail.jsx) |
| **Khung bố cục (Layout)** | [`app/src/apps/contractor/layout/ContractorLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/layout/ContractorLayout.jsx) (Hỗ trợ chế độ in ấn A4 chuẩn đẹp, tự ẩn thanh menu khi in) |
| **Ai được sử dụng?** | Nhà thầu xây dựng (Chỉ huy trưởng công trường, Kỹ sư Trưởng HSE, Giám đốc Dự án, Ban Quản lý Chất lượng & Pháp chế) |
| **Trạng thái vận hành** | Đang hoạt động ổn định — Tự động tổng hợp số liệu thực tế từ hệ thống |

**Tóm tắt mục đích sử dụng**: Màn hình là nơi tự động tổng hợp toàn bộ số liệu về việc giữ gìn vệ sinh môi trường của công trường trong suốt tháng hoặc cả giai đoạn thi công. Màn hình tự động tính toán 3 chỉ số cốt lõi: Tỷ lệ che chắn bạt bãi vật liệu (96%), Số lượt xe tải được xịt rửa lốp (1.420 lượt), Thời gian xử lý dập bụi trung bình (4.2 giờ), kèm bảng đánh giá 10 tiêu chuẩn thi công sạch. Chỉ huy trưởng chỉ cần bấm nút `[🖨️ Xuất Báo Cáo A4 / In PDF]` là có ngay bản báo cáo chuẩn mực, có sẵn vị trí ký tên đóng dấu để nộp cho Chủ đầu tư, Ban Quản lý Dự án và Phòng Tài nguyên Môi trường làm thủ tục nghiệm thu giai đoạn và **nhận lại 100% số tiền bảo lãnh / đặt cọc môi trường**.

---

## 2. Mục Đích & Giá Trị Thực Tế

### 2.1. Giải quyết bài toán thực tế ngoài công trường
1. **Có số liệu thật để chứng minh — Không còn báo cáo chung chung**:
   - Thay vì những câu báo cáo hình thức (*"đơn vị đã làm tốt công tác dập bụi"*), hệ thống tự động tổng hợp số liệu thực tế:
     - *Tỷ lệ che bạt bãi cát đá và lưới chắn*: `96%`
     - *Tổng số lượt xe tải ben được rửa sạch bánh*: `1.420 lượt`
     - *Thời gian trung bình dập bụi khi có phản ánh*: `4.2 giờ` (nhanh hơn nhiều so với hạn cam kết 24h)
     - *Đánh giá 10 tiêu chuẩn an toàn thi công*: `10/10 Tiêu chí Đạt`.
2. **Cơ sở để Chủ đầu tư hoàn trả lại tiền đặt cọc môi trường**:
   - Trong hợp đồng xây dựng, nhà thầu thường bị giữ lại một khoản tiền bảo lãnh/ký quỹ môi trường (chiếm từ 1% đến 3% giá trị gói thầu, tương đương hàng trăm triệu đến hàng tỷ đồng).
   - Báo cáo tuân thủ in A4 này là bằng chứng khách quan nhất để Chủ đầu tư và Ban Quản lý Dự án duyệt nghiệm thu, hoàn trả lại toàn bộ tiền đặt cọc mà không bị phạt hay giữ lại tiền.
3. **Bảo vệ nhà thầu trước các đợt thanh tra liên ngành**:
   - Báo cáo lưu trọn vẹn lịch sử tất cả các vụ việc đã xử lý xong trong quý.
   - Khi Thanh tra Sở Xây dựng, Sở TN&MT hoặc Thanh tra Giao thông đến kiểm tra, Chỉ huy trưởng xuất trình ngay bản báo cáo A4 này chứng minh công trường thi công an toàn, đúng quy định, loại bỏ hoàn toàn nguy cơ bị phạt 10 - 50 triệu đồng hoặc đình chỉ thi công.
4. **Chế độ in ấn A4 chuẩn đẹp — Bấm in là nộp được ngay**:
   - Bấm nút in là hệ thống tự động ẩn hết thanh menu, khung viền, chỉ giữ lại nội dung báo cáo trang trọng đúng khổ giấy A4, có quốc hiệu, tên dự án, bảng số liệu rõ nét và khung chữ ký Chỉ huy trưởng để đóng dấu công ty.

### 2.2. So sánh cách làm cũ và cách làm mới

| Tiêu chí | Làm báo cáo thủ công (Word / Excel) | Báo cáo tự động DustGuard VN (CON-04) |
|---|---|---|
| **Thời gian làm báo cáo** | Mất 3 - 5 ngày để kỹ sư ngồi gõ số liệu và ghép ảnh | **Dưới 5 giây** hệ thống tự động tổng hợp đầy đủ |
| **Độ tin cậy của số liệu** | Dễ bị nghi ngờ là số liệu tự bịa, ảnh chụp đối phó | Tuyệt đối tin cậy với ảnh thật lưu rõ ngày giờ và vị trí GPS |
| **Nhận lại tiền đặt cọc** | Kéo dài nhiều tháng do tranh cãi về vệ sinh môi trường | Nhanh chóng vì có bảng điểm 10 tiêu chuẩn rõ ràng |
| **Định dạng in ấn** | Hay bị lệch trang, vỡ bảng khi in ra giấy | Chuẩn khổ giấy A4 dọc sắc nét, sẵn sàng ký tên đóng dấu |

---

## 3. Ai Sử Dụng & Luồng Thao Tác Thực Tế

### 3.1. Các vị trí thực tế tại công trường
1. **Kỹ sư Nguyễn Văn Hùng — Chỉ huy trưởng công trường**:
   - Mở xem bảng tổng kết cuối tháng, kiểm tra lại các chỉ số và bấm in báo cáo nộp Ban Quản lý Dự án.
2. **Kỹ sư Trần Anh Tuấn — Phụ trách An toàn & Môi trường (HSE)**:
   - Rà soát 10 tiêu chí kiểm soát bụi và đối chiếu số lượt xe rửa lốp trong tháng.
3. **Ban Quản lý Dự án (PMU) & Tư vấn Giám sát (TVGS)**:
   - Nhận bản in A4 hoặc quét mã QR trên báo cáo để kiểm tra tính chính xác trước khi ký biên bản nghiệm thu.

### 3.2. Sơ đồ quy trình tạo và in báo cáo tuân thủ

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [MỞ MỤC "BÁO CÁO TUÂN THỦ" (/contractor/reports)]                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ HỆ THỐNG TỰ ĐỘNG TỔNG HỢP TOÀN BỘ SỐ LIỆU TỪ DỮ LIỆU THẬT              │
│ ├─► 1. Tính 3 chỉ số chính: [Che bạt: 96%] [Xe rửa: 1.420] [Xử lý: 4.2h]│
│ ├─► 2. Kiểm tra Bảng 10 tiêu chuẩn kiểm soát bụi công trường           │
│ ├─► 3. Tổng hợp số liệu nồng độ bụi từ trạm đo thực tế                 │
│ └─► 4. Tạo mã xác thực số cho toàn văn báo cáo                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ CHỈ HUY TRƯỞNG CHỌN KỲ BÁO CÁO (Tháng này / Quý này / Cả gói thầu)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ BẤM NÚT [🖨️ XUẤT BÁO CÁO A4 / IN PDF]                                  │
│ • Máy tự động định dạng chuẩn giấy A4, ẩn các nút bấm không cần thiết   │
│ • In ra giấy, Chỉ huy trưởng ký tên, đóng dấu nộp Ban Quản lý Dự án    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bố Cục Giao Diện & Hình Ảnh Minh Họa

### 4.1. Cách sắp xếp thông tin trên màn hình
1. **Khung chọn thời gian báo cáo**:
   - Chọn nhanh: `[Tháng 8/2026]`, `[Tháng 9/2026 (Hiện tại)]`, `[Quý III/2026]`, `[Cả dự án]`.
   - Nút hành động chính: `[🖨️ In Báo Cáo A4 / Xuất PDF]` (Màu xanh Teal, nút to dễ bấm).
2. **Hàng 3 ô số liệu chấp hành cốt lõi**:
   - **Tỷ lệ che bạt & giàn giáo**: `96%` (Đạt chuẩn).
   - **Số lượt xe xịt rửa lốp**: `1,420 lượt` (Ghi nhận tự động từ trạm rửa).
   - **Thời gian xử lý trung bình**: `4.2 giờ` (Nhanh hơn mức cam kết 24h).
3. **Bảng 10 tiêu chuẩn thi công an toàn môi trường**:
   - Danh sách 10 hạng mục: Tưới ẩm đường gom, Phủ bạt bãi cát, Vận hành cầu rửa xe, Lưới chống bụi giàn giáo, Che chắn xe chở phế thải, Thu gom phế thải xây dựng, Đo nồng độ bụi định kỳ, Bố trí công nhân quét dọn, Đặt biển báo tốc độ trong công trường, Nhật ký nhật trình phương tiện.
4. **Khung chữ ký và xác nhận**:
   - Bên trái: Đại diện Nhà thầu (Kỹ sư HSE & Chỉ huy trưởng).
   - Bên phải: Đại diện Tư vấn Giám sát & Ban Quản lý Dự án (PMU).

### 4.2. Giao diện xem trên máy tính (Desktop)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DUSTGUARD VN  |  NHÀ THẦU XÂY DỰNG   Dự án: Chung Cư Thanh Xuân Garden   Chỉ huy trưởng: Nguyễn Văn Hùng  [ Đăng xuất ]│
├────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ BÀN LÀM VIỆC           │ BÁO CÁO CHẤP HÀNH MÔI TRƯỜNG & HỒ SƠ NGHIỆM THU                                               │
│ [ ] Tổng quan nhanh    │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│ [ ] Việc cần khắc phục │ │ Kỳ báo cáo: [ Tháng 9/2026 ▼ ]     Gói thầu: Gói XL-01 Thi công ngầm & kết cấu thân       │ │
│ [ ] Sổ theo dõi vụ việc│ │                                                       [ 🖨️ XUẤT BÁO CÁO A4 / IN PDF ]     │ │
│ [●] Báo cáo in A4      │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│ ────────────────────── │                                                                                               │
│ KẾT QUẢ TỔNG HỢP       │ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│ ⭐ Điểm số: 94/100     │ │ TỶ LỆ CHE BẠT & LƯỚI │  │ SỐ LƯỢT XE RỬA LỐP   │  │ THỜI GIAN XỬ LÝ BỤI TRUNG BÌNH       │ │
│ 🏆 Đạt chuẩn QCVN 18   │ │         96%          │  │     1.420 lượt       │  │               4.2 giờ                │ │
│ 📁 12 vụ đã đóng xong  │ │ ⭐ Đạt chuẩn an toàn │  │ 100% xe rời công trình│  │ ⚡ Nhanh hơn mức cam kết 24h         │ │
│                        │ └──────────────────────┘  └──────────────────────┘  └──────────────────────────────────────┘ │
│                        │                                                                                               │
│                        │ BẢNG KIỂM TRA 10 TIÊU CHUẨN THI CÔNG SẠCH (QCVN 18:2021/BXD)                                  │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ [x] 1. Phun nước dập bụi đường gom nội bộ và đường nối ra ngõ phố (Tưới 3 lần/ngày) - ĐẠT │ │
│                        │ │ [x] 2. Phủ bạt 100% các bãi tập kết cát đá thô và đất đào móng                      - ĐẠT │ │
│                        │ │ [x] 3. Vận hành máy xịt rửa lốp xe tải ben áp lực cao trước khi rời cổng          - ĐẠT │ │
│                        │ │ [x] 4. Căng lưới chắn bụi mắt nhỏ bao quanh toàn bộ giàn giáo ngoài công trình      - ĐẠT │ │
│                        │ │ [x] 5. Xe tải chở đất cát phế thải phải có bạt trùm kín thùng xe, không chở quá tải- ĐẠT │ │
│                        │ │ [x] 6. Bố trí công nhân quét dọn mặt đường thường xuyên trong ca thi công cao điểm   - ĐẠT │ │
│                        │ │ [x] 7. Có thiết bị đo bụi PM2.5/PM10 theo dõi liên tục                             - ĐẠT │ │
│                        │ │ [x] 8. Thu gom và vận chuyển phế thải xây dựng về đúng bãi tập kết quy định          - ĐẠT │ │
│                        │ │ [x] 9. Cắm biển hạn chế tốc độ xe tải trong công trường dưới 10 km/h                - ĐẠT │ │
│                        │ │ [x] 10. Tiếp nhận và khắc phục xong các phản ánh bụi trong vòng 24 giờ              - ĐẠT │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3. Định dạng bản in A4 khi xuất ra giấy / PDF

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM                                   │
│                                Độc lập - Tự do - Hạnh phúc                                     │
│                                           -----                                                │
│                                                                                                │
│                   BÁO CÁO KẾT QUẢ THỰC HIỆN CÔNG TÁC BẢO VỆ MÔI TRƯỜNG                         │
│                    (Phục vụ nghiệm thu giai đoạn & Hoàn trả tiền đặt cọc)                      │
│                                                                                                │
│  Dự án: Khu Chung Cư Thanh Xuân Garden                                                        │
│  Gói thầu: XL-01 — Thi công phần ngầm và kết cấu thân Block A & B                              │
│  Đơn vị thi công: Tổng Công Ty CP Xuất Nhập Khẩu & Xây Dựng Việt Nam (Vinaconex)               │
│  Kỳ báo cáo: Tháng 09/2026                                                                     │
│                                                                                                │
│  I. CÁC CHỈ SỐ KẾT QUẢ ĐẠT ĐƯỢC:                                                               │
│  1. Tỷ lệ che bạt bãi vật liệu và căng lưới chắn bụi: 96% (Đạt)                                │
│  2. Tổng số lượt xe tải ben được xịt rửa lốp: 1.420 lượt xe                                    │
│  3. Thời gian xử lý khắc phục bụi trung bình: 4.2 giờ / vụ (Cam kết < 24 giờ)                  │
│  4. Tổng số vụ việc phản ánh đã tiếp nhận và giải quyết xong: 12 / 12 vụ (100%)                │
│                                                                                                │
│  II. KẾT QUẢ THỰC HIỆN 10 TIÊU CHUẨN AN TOÀN MÔI TRƯỜNG (QCVN 18:2021/BXD):                    │
│  • Đạt 10/10 tiêu chí theo quy chuẩn kỹ thuật an toàn môi trường xây dựng.                     │
│                                                                                                │
│  III. KẾT LUẬN & ĐỀ NGHỊ:                                                                      │
│  Đơn vị thi công đã thực hiện nghiêm túc các biện pháp giảm thiểu bụi và bảo vệ môi trường.    │
│  Kính đề nghị Ban Quản lý Dự án nghiệm thu công tác môi trường và hoàn trả tiền đặt cọc.      │
│                                                                                                │
│          KỸ SƯ AN TOÀN HSE                            CHỈ HUY TRƯỞNG CÔNG TRƯỜNG               │
│          (Ký và ghi rõ họ tên)                            (Ký tên và đóng dấu)                 │
│                                                                                                │
│             Trần Anh Tuấn                                    Nguyễn Văn Hùng                   │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Kết Nối Hệ Thống

### 5.1. Các đường dẫn lấy dữ liệu (API Endpoints)
- `GET /api/contractor/reports/compliance`: Lấy toàn bộ số liệu tổng kết tuân thủ môi trường của nhà thầu.
- `GET /api/contractor/reports/export-pdf`: Xuất file báo cáo định dạng PDF chuẩn in A4.

### 5.2. Mẫu dữ liệu báo cáo từ hệ thống

```json
{
  "success": true,
  "data": {
    "projectName": "Dự án Khu Chung Cư Thanh Xuân Garden",
    "contractorName": "Tổng Công Ty CP Xuất Nhập Khẩu & Xây Dựng Việt Nam (Vinaconex)",
    "period": "Tháng 09/2026",
    "metrics": {
      "coveringRate": 96,
      "wheelWashCount": 1420,
      "avgResponseHours": 4.2,
      "resolvedCasesCount": 12,
      "totalCasesCount": 12,
      "complianceScore": 94
    },
    "checklistPassedCount": 10,
    "checklistTotalCount": 10
  }
}
```

---

## 6. Danh Sách Nút Bấm & Thao Tác (Action Buttons)

| Tên nút bấm | Nằm ở đâu | Màu sắc & Kiểu nút | Kích thước | Bấm vào sẽ làm gì? | Khi nào bấm được? |
|---|---|---|---|---|---|
| **[🖨️ Xuất báo cáo A4 / In PDF]** | Góc trên bên phải trang | Nền xanh Teal `#0D6F64`, chữ trắng | Cao $\ge 48\text{px}$, nút to | Bật hộp thoại in của trình duyệt với khổ A4 sạch sẽ | Luôn bấm được |
| **[Kỳ báo cáo ▼]** | Thanh chọn trên đầu | Khung chọn viền xám | Cao $44\text{px}$ | Đổi tháng hoặc quý cần xem số liệu | Luôn bấm được |
| **[Tải file ảnh minh chứng]** | Bên dưới bảng 10 tiêu chuẩn | Nền trắng viền xanh | Cao $44\text{px}$ | Tải về trọn bộ ảnh đối chứng Trước/Sau dạng file nén | Khi cần đính kèm phụ lục |

---

## 7. Quy Chuẩn Giao Diện & In Ấn A4

### 7.1. Chế độ in A4 sạch đẹp — Không bị dính nút bấm hay thanh menu
- Khi người dùng bấm nút in hoặc nhấn `Ctrl + P`, hệ thống tự động:
  - Ẩn toàn bộ thanh menu bên trái (Sidebar) và thanh tiêu đề trên cùng (Header).
  - Ẩn toàn bộ các nút bấm và ô chọn.
  - Chuyển màu nền sang màu trắng tinh, chữ màu đen đậm để in ra giấy rõ nét và tiết kiệm mực in.
  - Căn lề chuẩn: Lề trên/dưới 20mm, lề trái 25mm, lề phải 15mm.

### 7.2. Màu sắc trên màn hình — Sáng rõ và trang trọng
- Sử dụng màu xanh Teal `#0D6F64` làm điểm nhấn trang trọng, các số liệu KPI to đậm, rõ ràng, dễ nhìn cho lãnh đạo khi xem trên máy chiếu trong các buổi họp giao ban.

---

## 8. Hướng Dẫn Xử Lý Tình Huống & Kiểm Tra Lỗi

### 8.1. Các tình huống thực tế và cách xử lý
1. **In ra giấy bị nhảy sang trang thứ 2 chỉ có vài dòng**:
   - *Tình huống*: Bảng biểu dài làm tràn vài dòng chữ ký sang trang 2.
   - *Cách xử lý*: Giao diện in ấn đã được tinh chỉnh kích thước chữ và khoảng cách bảng vừa khít đúng 1 trang A4 chuẩn.
2. **Cần xuất báo cáo cho cả quý thi công**:
   - *Tình huống*: Ban Quản lý Dự án nghiệm thu theo quý thay vì theo tháng.
   - *Cách xử lý*: Chọn mục `[Quý III/2026]` ở ô chọn kỳ báo cáo, hệ thống sẽ tự động gộp toàn bộ số liệu 3 tháng lại thành một báo cáo hoàn chỉnh.

### 8.2. Lệnh kiểm tra màn hình qua PowerShell

```powershell
# 1. Kiểm tra màn hình báo cáo tuân thủ nhà thầu (< 0.5s)
node --test app/tests/contractor-ui-workspace.test.js

# 2. Kiểm tra định dạng chuẩn in ấn và thẻ số liệu
node --test app/tests/design-system-tokens.test.js

# 3. Chạy kiểm tra nhanh toàn hệ thống
npm --prefix app run verify:quick
```
