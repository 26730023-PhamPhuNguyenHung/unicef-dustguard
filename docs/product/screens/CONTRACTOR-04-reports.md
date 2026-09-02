# CON-04 — Báo Cáo Tuân Thủ & Minh Chứng Môi Trường (Contractor Reports & Compliance)

> **Mã màn hình**: `CON-04`  
> **Tên tiếng Việt**: Báo Cáo Tuân Thủ Môi Trường & Hồ Sơ Nghiệm Thu A4  
> **Tên tiếng Anh**: Contractor Compliance Reports & A4 Environmental Acceptance Dossier  
> **Tài liệu tham chiếu SSOT**: [`CIVIC_HANDOFF_SSOT.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.agents/ssot/CIVIC_HANDOFF_SSOT.md), [`QCVN 18:2021/BXD`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-18-2021-BXD.md), [`QCVN 05:2023/BTNMT`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-05-2023-BTNMT.md), [`Nghị định 45/2022/NĐ-CP`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/ND-45-2022-ND-CP.md)

---

## 1. Screen Identity

| Thuộc tính | Định danh kỹ thuật SSOT |
|---|---|
| **Mã màn hình** | `CON-04` |
| **Tên tiếng Việt** | Báo Cáo Tuân Thủ Môi Trường & Hồ Sơ Nghiệm Thu A4 |
| **Tên tiếng Anh** | Contractor Compliance Reports & A4 Environmental Acceptance Dossier |
| **Đường dẫn (Route)** | `/contractor/reports` |
| **Tệp mã nguồn (Component Path)** | [`app/src/apps/contractor/pages/reports/ContractorReportsPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/pages/reports/ContractorReportsPage.jsx), tích hợp module tuân thủ 10 tiêu chí và cảm biến bụi tại [`app/src/modules/contractor/ContractorProjectDetail.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/modules/contractor/ContractorProjectDetail.jsx) |
| **Khung bố cục (Layout)** | [`app/src/apps/contractor/layout/ContractorLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/layout/ContractorLayout.jsx) (Hỗ trợ chế độ in ấn A4 chuẩn sạch Clean Print Layout `@media print`) |
| **Phân quyền truy cập (RBAC)** | `contractor` (Chỉ huy trưởng công trường, Kỹ sư Trưởng HSE, Giám đốc Điều hành Dự án, Ban Quản lý Chất lượng & Pháp chế Nhà thầu) |
| **Trạng thái thực thi** | `ACTIVE` — Level 5 Production Coherent (Kết nối Cloudflare D1 SQLite, R2 Storage và định dạng xuất bản in ấn A4 chuẩn hóa) |

**Tóm tắt mục đích**: Màn hình là trung tâm tổng hợp số liệu định lượng về công tác chấp hành các quy chuẩn kỹ thuật an toàn môi trường xây dựng ([QCVN 18:2021/BXD](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-18-2021-BXD.md) và [QCVN 05:2023/BTNMT](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-05-2023-BTNMT.md)) của đơn vị thi công. Màn hình tự động trích xuất 3 chỉ số hiệu quả cốt lõi (Tỷ lệ che chắn 96%, Số lượt xe rửa lốp 1,420 lượt, Thời gian khắc phục trung bình 4.2h), bảng đánh giá 10 tiêu chí kiểm soát bụi và dữ liệu quan trắc bụi PM2.5/PM10. Chỉ huy trưởng có thể bấm xuất tức thì Báo cáo A4 có chữ ký điện tử và tem mã băm SHA-256 để nộp cho Chủ đầu tư, Ban Quản lý Dự án (PMU) và Phòng TN&MT phục vụ nghiệm thu giai đoạn, giải ngân và **hoàn trả 100% tiền ký quỹ bảo vệ môi trường (CSR Escrow Return)**.

---

## 2. Mục Đích & Giá Trị Thực Tế

### 2.1. Giải quyết bài toán tác nghiệp hiện trường tại Việt Nam
1. **Lượng hóa công tác bảo vệ môi trường thành chỉ số định lượng khách quan**:
   - Thay vì các bản báo cáo chung chung mang tính hình thức (*"công trường đã thực hiện tốt công tác dập bụi"*), hệ thống tự động tổng hợp dữ liệu thực tế từ D1:  
     - *Tỷ lệ che chắn bạt bãi vật liệu & lưới giàn giáo*: `96%`  
     - *Tổng số lượt xe tải ben được xịt rửa sạch bánh*: `1,420 lượt`  
     - *Thời gian phản hồi dập bụi trung bình*: `4.2 giờ` (vượt chuẩn cam kết $< 24\text{h}$)  
     - *Tỷ lệ hoàn thành 10 tiêu chuẩn thi công an toàn*: `10/10 Tiêu chí Đạt`.
2. **Cơ sở pháp lý để Hoàn quỹ Ký quỹ Môi trường (CSR Escrow Return)**:
   - Trong các hợp đồng xây dựng tại Việt Nam, nhà thầu thường phải trích giữ lại một khoản bảo lãnh/ký quỹ môi trường (chiếm $1\% - 3\%$ giá trị gói thầu, tương đương hàng trăm triệu đến hàng tỷ đồng).
   - Báo cáo tuân thủ CON-04 kèm mã băm SHA-256 là chứng thư số khách quan nhất giúp nhà thầu chứng minh đã hoàn thành đầy đủ nghĩa vụ môi trường, tạo điều kiện thuận lợi để Chủ đầu tư và Ban QLDA hoàn trả toàn bộ số tiền ký quỹ mà không bị giữ lại hoặc phạt trừ tiền.
3. **Phòng ngừa rủi ro bị xử phạt theo Nghị định 45/2022/NĐ-CP & Nghị định 16/2022/NĐ-CP**:
   - Báo cáo lưu trữ trọn vẹn lịch sử khắc phục của toàn bộ các vụ việc trong tháng/quý.
   - Khi Đoàn Thanh tra liên ngành (Sở Xây dựng, Sở TN&MT, Thanh tra Giao thông) kiểm tra định kỳ, Chỉ huy trưởng xuất trình ngay báo cáo A4 có đầy đủ số liệu và tem xác thực số, chứng minh công trình vận hành chuẩn mực, loại trừ hoàn toàn nguy cơ bị xử phạt 10 - 50 triệu đồng hoặc đình chỉ thi công.
4. **Chuẩn hóa chế độ in ấn A4 Clean Print (Sẵn sàng nộp hồ sơ công vụ)**:
   - Thiết kế chuẩn in ấn tự động ẩn toàn bộ Header, Sidebar, các nút bấm thao tác; định dạng bảng biểu sắc nét chuẩn khổ giấy A4 dọc (`portrait`), có khung chữ ký Chỉ huy trưởng và Kỹ sư HSE sẵn sàng đóng dấu công ty.

### 2.2. So sánh hiệu quả tác nghiệp (Trước và Sau khi có CON-04)

| Tiêu chí | Làm báo cáo thủ công (Word / Excel / Giấy) | Báo cáo số hóa DustGuard VN (CON-04) |
|---|---|---|
| **Thời gian lập báo cáo** | Mất 3 - 5 ngày để kỹ sư tổng hợp số liệu và hình ảnh | **< 5 giây** hệ thống tự động trích xuất và tính toán từ D1 |
| **Độ tin cậy của số liệu** | Dễ bị nghi ngờ là số liệu khống, ảnh chụp đối phó | Tuyệt đối tin cậy với mã băm SHA-256 và tem định vị GPS |
| **Nghiệm thu hoàn quỹ CSR** | Kéo dài nhiều tháng do tranh cãi về vệ sinh môi trường | Nhanh chóng, rõ ràng trên cơ sở bảng điểm 10 tiêu chí |
| **Đối chiếu quy chuẩn QCVN** | Tra cứu thủ công, dễ sót chỉ tiêu kỹ thuật | Tích hợp sẵn chuẩn QCVN 18:2021/BXD và QCVN 05:2023 |

---

## 3. Đối Tượng Người Dùng & Hành Trình Thao Tác (User Journey & Core Flow)

### 3.1. Chân dung người dùng mục tiêu (Personas)
1. **Kỹ sư Nguyễn Văn Hùng — Chỉ huy trưởng công trường (Hancorp / Vinaconex)**:
   - *Mục tiêu*: Mở xem bảng tổng kết tuân thủ cuối tháng, kiểm tra các chỉ số trước khi bấm in báo cáo nộp Ban Quản lý Dự án.
2. **Kỹ sư Trần Anh Tuấn — Kỹ sư An toàn & Môi trường HSE**:
   - *Mục tiêu*: Rà soát 10 tiêu chí kiểm soát bụi, đối chiếu số lượt xe rửa lốp và thời gian khắc phục trung bình.
3. **Ban Quản lý Dự án (PMU) & Tư vấn Giám sát (TVGS)**:
   - *Mục tiêu*: Tiếp nhận bản in A4 hoặc quét mã QR trên báo cáo để kiểm tra tính xác thực của dữ liệu trước khi ký biên bản nghiệm thu giai đoạn.

### 3.2. Sơ đồ quy trình tạo và xuất báo cáo tuân thủ

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Chỉ huy trưởng / Kỹ sư HSE truy cập phân hệ "Báo cáo tuân thủ" (/contractor/reports)] │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HỆ THỐNG TỰ ĐỘNG TỔNG HỢP DỮ LIỆU TỪ D1 SQLITE & R2 STORAGE                            │
│ ├─► 1. Tính toán 3 chỉ số hiệu quả: [Che chắn: 96%] [Xe rửa lốp: 1,420] [Thời gian: 4.2h]│
│ ├─► 2. Kiểm định Bảng 10 tiêu chuẩn kiểm soát bụi công trường (10-Point Checklist)     │
│ ├─► 3. Trích xuất nồng độ bụi PM2.5/PM10 từ trạm cảm biến đối chiếu QCVN 05:2023       │
│ └─► 4. Sinh mã niêm phong số SHA-256 toàn văn báo cáo                                  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CHỈ HUY TRƯỞNG RÀ SOÁT DỮ LIỆU TRÊN MÀN HÌNH CON-04                                    │
│ (Chọn kỳ báo cáo: Tháng hiện tại, Quý III/2026, hoặc Toàn bộ giai đoạn thi công)      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ BẤM NÚT [🖨️ XUẤT BÁO CÁO A4 / IN PDF]                                                  │
│ ├─► Trình duyệt tự động kích hoạt @media print với định dạng chuẩn khổ A4               │
│ ├─► Tự động ẩn Sidebar, Header điều hướng và các nút bấm giao diện                     │
│ ├─► Hiển thị đầy đủ: Quốc hiệu, Tên dự án, Bảng số liệu, Mã băm SHA-256 & Khung chữ ký│
│ └─► Chỉ huy trưởng ký tên, đóng dấu và nộp Ban QLDA / Phòng TN&MT                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bố Cục Giao Diện & Phân Cấp Thông Tin (Information Hierarchy & Wireframe)

### 4.1. Phân cấp thông tin (Information Hierarchy)
1. **Header trang & Nút xuất báo cáo**:
   - Tiêu đề: *Báo Cáo Tuân Thủ Bụi Xây Dựng & An Toàn Môi Trường*.
   - Căn cứ pháp lý: *Theo dõi và đánh giá chấp hành QCVN 18:2021/BXD và QCVN 05:2023/BTNMT.*
   - Bộ chọn kỳ báo cáo: `[ Tháng 09/2026 ▼ ]` hoặc `[ Quý III/2026 ]`.
   - Nút hành động chính: `[🖨️ Xuất báo cáo PDF / In A4]` (Nền Teal `#0D6F64`, chữ trắng đậm, $48\text{px}$).
2. **Hàng 3 Thẻ chỉ số định lượng hiệu quả (Performance Metric Cards)**:
   - **Thẻ 1 — Tỷ lệ che chắn đạt chuẩn**: Giá trị `96%` (Font số cực to `text-3xl font-bold`, màu Teal `#0D6F64`, chú thích: *Đạt chuẩn bao che bãi vật liệu & giàn giáo*).
   - **Thẻ 2 — Số lượt xe rửa lốp**: Giá trị `1,420 lượt` (Màu đen Ink `#1C1917`, chú thích: *100% xe ben được xịt rửa sạch bánh trước khi ra phố*).
   - **Thẻ 3 — Thời gian khắc phục trung bình**: Giá trị `4.2 giờ` (Màu Hổ phách `#B45309`, chú thích: *Vượt cam kết SLA 24h của Ban Quản lý Dự án*).
3. **Bảng đánh giá 10 tiêu chí kiểm soát bụi công trường (10-Point Compliance Checklist)**:
   - Danh sách 10 tiêu chuẩn thi công thực tế tại Việt Nam với trạng thái `ĐẠT CHUẨN [✓]` màu xanh ngọc.
4. **Khung biểu đồ nồng độ bụi thực tế (Telemetry PM2.5 / PM10)**:
   - So sánh nồng độ bụi đo được tại cổng công trình với ngưỡng giới hạn cho phép của QCVN 05:2023/BTNMT ($50\,\mu\text{g}/\text{m}^3$ cho PM2.5 trung bình 24h).
5. **Khung chữ ký & Niêm phong điện tử (Digital Acceptance Block)**:
   - Mã băm niêm phong báo cáo SHA-256 (64 ký tự hex).
   - Khung chữ ký Chỉ huy trưởng công trường và Kỹ sư trưởng HSE.

### 4.2. Wireframe Giao Diện Màn Hình Lớn (Desktop 1366px - 1920px)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] DUSTGUARD VN  [NHÀ THẦU XÂY DỰNG]   Dự án: Chung Cư Thanh Xuân Garden     Kỹ sư: Nguyễn Văn Hùng  [ Đăng xuất ] │
├────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ QUẢN LÝ CÔNG TRƯỜNG   │ BÁO CÁO TUÂN THỦ BỤI XÂY DỰNG & AN TOÀN MÔI TRƯỜNG                                            │
│ [ ] Tổng quan          │ Bảng tổng hợp số liệu phục vụ nghiệm thu giai đoạn và hoàn trả ký quỹ môi trường (CSR Escrow)│
│ [ ] Nhiệm vụ khắc phục │                                                                                               │
│ [ ] Hồ sơ vụ việc      │ Kỳ báo cáo: [ Tháng 09/2026 ▼ ]  •  Gói thầu: XL-01          [ 🖨️ XUẤT BÁO CÁO PDF / IN A4 ]  │
│ [●] Báo cáo tuân thủ   │ ───────────────────────────────────────────────────────────────────────────────────────────── │
│                        │                                                                                               │
│                        │ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│                        │ │ TỶ LỆ CHE CHẮN       │  │ SỐ LƯỢT XE RỬA LỐP   │  │ THỜI GIAN KHẮC PHỤC TRUNG BÌNH       │ │
│                        │ │        96%           │  │    1,420 lượt        │  │              4.2 giờ                 │ │
│                        │ │ ⭐ Đạt chuẩn QCVN 18 │  │ Tại 2 trạm rửa xe    │  │ ⚡ Nhanh hơn 82% so với hạn SLA 24h  │ │
│                        │ └──────────────────────┘  └──────────────────────┘  └──────────────────────────────────────┘ │
│                        │                                                                                               │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ BẢNG ĐÁNH GIÁ 10 TIÊU CHÍ BẢO VỆ MÔI TRƯỜNG CÔNG TRƯỜNG (QCVN 18:2021/BXD)                │ │
│                        │ ├───────────────────────────────────────────────────────────────────────────────────────────┤ │
│                        │ │ [✓] 1. Phun sương / tưới ẩm đường nội bộ và cổng ra vào định kỳ 3 lần/ngày     [ ĐẠT CHUẨN ]│ │
│                        │ │ [✓] 2. Lắp lưới chắn bụi kín khít toàn bộ khung giàn giáo kết cấu tầng cao     [ ĐẠT CHUẨN ]│ │
│                        │ │ [✓] 3. Vận hành cầu rửa xe áp lực cao 100% chuyến xe tải ben trước khi ra phố  [ ĐẠT CHUẨN ]│ │
│                        │ │ [✓] 4. Phủ kín bạt chuyên dụng thùng xe chở đất cát, phế thải xây dựng         [ ĐẠT CHUẨN ]│ │
│                        │ │ [✓] 5. Quét dọn, thu gom bùn đất rơi vãi trên đoạn đường gom tiếp giáp          [ ĐẠT CHUẨN ]│ │
│                        │ │ [✓] 6. Che phủ kín bạt bãi tập kết vật liệu rời (cát, đá dăm, xi măng bao)     [ ĐẠT CHUẨN ]│ │
│                        │ │ [✓] 7. Lắp đặt biển báo cảnh báo an toàn môi trường và đường dây nóng phản ánh [ ĐẠT CHUẨN ]│ │
│                        │ │ [✓] 8. Bố trí cán bộ HSE chuyên trách túc trực giám sát trong các ca thi công  [ ĐẠT CHUẨN ]│ │
│                        │ │ [✓] 9. Thiết lập nhật ký ghi nhận vi phạm và khắc phục hàng tuần               [ ĐẠT CHUẨN ]│ │
│                        │ │ [✓] 10. Phối hợp kịp thời với Tổ kiểm tra môi trường và đại diện cộng đồng     [ ĐẠT CHUẨN ]│ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│                        │                                                                                               │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ 🔒 TEM NIÊM PHONG SỐ & XÁC THỰC TOÀN VẸN (SHA-256 TAMPER-EVIDENT STAMP)                     │ │
│                        │ │ Mã xác thực: sha256_b48f9e12c8a044d56e71903fa723bc4e90123567abcd89ef0123456789abcdef       │ │
│                        │ │ Thời gian xuất bản: 02/09/2026 15:30 (GMT+7) • Trích xuất trực tiếp từ Cloudflare D1 SSOT   │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3. Wireframe Bản In Khổ A4 Chuẩn Hóa (@media print)

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│ CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM                                              │
│ Độc lập - Tự do - Hạnh phúc                                                     │
│ ──────────────────────────────────────                                          │
│                                                                                 │
│             BÁO CÁO THỰC HIỆN CAM KẾT BẢO VỆ MÔI TRƯỜNG CÔNG TRƯỜNG             │
│            (Phục vụ Nghiệm thu Giai đoạn & Hoàn trả Ký quỹ Môi trường)          │
│                                                                                 │
│ Dự án: Khu Chung Cư Thanh Xuân Garden          Gói thầu: XL-01 (Phần ngầm & Thân)│
│ Nhà thầu thi công: Tổng Công Ty CP Xuất Nhập Khẩu & Xây Dựng Việt Nam (Vinaconex)│
│ Địa điểm: Số 150 Đường Nguyễn Trãi, Phường Thanh Xuân Trung, Quận Thanh Xuân    │
│ Thời gian báo cáo: Tháng 09/2026                                                │
│ ─────────────────────────────────────────────────────────────────────────────── │
│                                                                                 │
│ I. CÁC CHỈ SỐ ĐỊNH LƯỢNG CHẤP HÀNH QUY CHUẨN KỸ THUẬT:                          │
│  • Tỷ lệ bao che bãi vật liệu & giàn giáo:  96% (Đạt chuẩn QCVN 18:2021/BXD)     │
│  • Tổng số lượt xe tải ben được xịt rửa lốp: 1,420 lượt                          │
│  • Thời gian khắc phục trung bình:           4.2 giờ / vụ việc (Hạn SLA: 24h)   │
│  • Nồng độ bụi PM2.5 trung bình 24h:         38.5 µg/m3 (Đạt chuẩn QCVN 05:2023)│
│                                                                                 │
│ II. ĐÁNH GIÁ 10 TIÊU CHÍ BẢO VỆ MÔI TRƯỜNG THỰC ĐỊA:                            │
│  [X] 1. Phun sương dập bụi đường gom          [X] 6. Che phủ bạt bãi cát đá     │
│  [X] 2. Lưới bao che giàn giáo tầng cao       [X] 7. Lắp biển cảnh báo an toàn  │
│  [X] 3. Vận hành cầu rửa xe áp lực cao        [X] 8. Bố trí cán bộ HSE thường trực│
│  [X] 4. Phủ bạt kín thùng xe tải ben          [X] 9. Lập sổ nhật ký hàng tuần   │
│  [X] 5. Quét dọn bùn đất rơi vãi              [X] 10. Phối hợp Tổ kiểm tra TT   │
│                                                                                 │
│ III. CHỨNG THỰC DỮ LIỆU SỐ BẤT BIẾN:                                            │
│  • Mã niêm phong số: sha256_b48f9e12c8a044d56e71903fa723bc4e90123567abcd89ef     │
│  • CSDL nguồn: Hệ thống Giám sát Bụi DustGuard VN (Cloudflare D1 SSOT)          │
│                                                                                 │
│        KỸ SƯ TRƯỞNG HSE                         CHỈ HUY TRƯỞNG CÔNG TRƯỜNG      │
│       (Ký và ghi rõ họ tên)                        (Ký, đóng dấu công ty)       │
│                                                                                 │
│         Trần Anh Tuấn                                  Nguyễn Văn Hùng          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & API / D1 Database Contract

### 5.1. Các Endpoints API Phục Vụ Màn Hình
- `GET /api/contractor/projects/:id/compliance`: Lấy bảng điểm 10 tiêu chí tuân thủ, tỷ lệ che chắn và số liệu rửa xe.
- `GET /api/contractor/projects/:id/telemetry`: Lấy dữ liệu cảm biến bụi PM2.5/PM10 đo đạc thực tế theo giờ.
- `GET /api/contractor/dashboard`: Lấy các chỉ số thống kê tổng hợp phục vụ hiển thị thẻ KPI.
- `POST /api/contractor/reports/export-dossier`: Tạo bản trích xuất hồ sơ nghiệm thu A4 có gắn tem mã băm SHA-256.

### 5.2. Cấu Trúc Payload JSON Chuẩn (Response Contract)

```json
{
  "success": true,
  "data": {
    "siteId": "site_tx_02",
    "siteName": "Dự án Khu Chung Cư Thanh Xuân Garden",
    "package": "Gói thầu XL-01: Thi công phần ngầm và kết cấu thân Block A & B",
    "contractorName": "Tổng Công Ty CP Xuất Nhập Khẩu & Xây Dựng Việt Nam (Vinaconex)",
    "period": "2026-09",
    "complianceScore": 92,
    "metrics": {
      "coverageRate": 96.0,
      "trucksWashed": 1420,
      "avgRemediationHours": 4.2,
      "totalActionsResolved": 12,
      "totalViolationsOverdue": 0
    },
    "telemetry": {
      "pm25_avg_24h": 38.5,
      "pm10_avg_24h": 68.2,
      "qcvn05_pm25_limit": 50.0,
      "qcvn05_pm10_limit": 100.0,
      "status": "PASSED_NATIONAL_STANDARD"
    },
    "checklist": [
      { "id": 1, "label": "Phun sương / tưới ẩm đường nội bộ và cổng ra vào định kỳ", "status": "PASSED" },
      { "id": 2, "label": "Lưới chắn bụi kín khít toàn bộ khung giàn giáo kết cấu tầng cao", "status": "PASSED" },
      { "id": 3, "label": "Vận hành cầu rửa xe áp lực cao 100% chuyến xe tải ben trước khi ra phố", "status": "PASSED" },
      { "id": 4, "label": "Phủ kín bạt chuyên dụng thùng xe chở đất cát, phế thải xây dựng", "status": "PASSED" },
      { "id": 5, "label": "Quét dọn, thu gom bùn đất rơi vãi trên đoạn đường gom tiếp giáp", "status": "PASSED" },
      { "id": 6, "label": "Che phủ kín bạt bãi tập kết vật liệu rời (cát, đá dăm, xi măng bao)", "status": "PASSED" },
      { "id": 7, "label": "Lắp đặt biển báo cảnh báo an toàn môi trường và thông tin liên hệ", "status": "PASSED" },
      { "id": 8, "label": "Bố trí cán bộ HSE chuyên trách túc trực giám sát trong các ca thi công", "status": "PASSED" },
      { "id": 9, "label": "Thiết lập nhật ký ghi nhận vi phạm và khắc phục hàng tuần", "status": "PASSED" },
      { "id": 10, "label": "Phối hợp kịp thời với Tổ kiểm tra môi trường và đại diện cộng đồng", "status": "PASSED" }
    ],
    "verificationStamp": {
      "sha256": "b48f9e12c8a044d56e71903fa723bc4e90123567abcd89ef0123456789abcdef",
      "generatedAt": "2026-09-02T15:30:00+07:00",
      "authority": "DustGuard VN Civic Platform SSOT"
    }
  }
}
```

### 5.3. Liên kết 12 Bảng D1 Database SSOT
- `contractor_tasks`: Đếm số lượng tác vụ hoàn thành và thời gian xử lý thực tế.
- `sites`: Lưu trữ thông tin công trình, nhà thầu và điểm rủi ro môi trường.
- `evidences`: Tổng hợp số lượng ảnh Before/After đã được duyệt nghiệm thu.
- `telemetry_readings`: Lưu trữ dữ liệu đo bụi thực tế từ các cảm biến IoT xung quanh công trình.
- `audit_logs`: Bảng nhật ký kiểm toán lưu vết mốc xuất báo cáo và mã băm SHA-256.

---

## 6. Bảng Nút Bấm & Tương Tác CTAs (Interactive Actions)

| Tên nút / Thao tác | Vị trí hiển thị | Loại CTA | Kích thước Touch | Hành vi hệ thống | Điều kiện kích hoạt | Phân quyền |
|---|---|---|---|---|---|---|
| **[🖨️ Xuất báo cáo PDF / In A4]** | Header góc trên bên phải | Primary CTA (Teal `#0D6F64`) | $\ge 48\text{px}$ chiều cao | Kích hoạt `window.print()` với định dạng Clean Print chuẩn khổ A4 | Luôn sẵn sàng | `contractor` |
| **[Chọn kỳ báo cáo]** | Thanh công cụ đầu trang | Dropdown Select | $\ge 44\text{px}$ chiều cao | Tải lại toàn bộ số liệu và biểu đồ theo tháng/quý đã chọn | Luôn sẵn sàng | `contractor` |
| **[Xem chi tiết tiêu chí]** | Từng dòng trong bảng 10 tiêu chí | Expand Action | $\ge 44\text{px}$ touch area | Mở rộng xem chi tiết căn cứ kỹ thuật của tiêu chí tương ứng | Luôn sẵn sàng | `contractor` |

---

## 7. Quy Chuẩn UI/UX & Responsive

### 7.1. Định dạng In ấn Khổ A4 Chuẩn Sạch (Clean Print Stylesheet `@media print`)
- **Nguyên tắc triệt để khi in ấn**:
  - Ẩn hoàn toàn 100%: Thanh điều hướng (`nav`), Sidebar bên trái, Header hệ thống, Nút `[Xuất báo cáo PDF]`, Nút `[Đăng xuất]`.
  - Nền trang chuyển sang màu trắng tinh `#FFFFFF`, mực chữ đen `#000000` đạt độ tương phản tối đa để in laser rõ nét và tiết kiệm mực in công trường.
  - Ngăn ngừa gãy trang xấu: Áp dụng CSS `page-break-inside: avoid` trên từng khối chỉ số và bảng checklist.
  - Kích thước chuẩn: `@page { size: A4 portrait; margin: 12mm 15mm 15mm 15mm; }`.

### 7.2. Tương thích đa thiết bị (Responsive Matrix)
- **Mobile nhỏ (360px - 430px)**: 3 Thẻ chỉ số hiển thị dạng 1 cột, số liệu to rõ `text-2xl font-bold`, bảng 10 tiêu chí thu gọn với biểu tượng tick xanh `[✓]`, nút bấm xuất PDF ghim nổi ở chân trang.
- **Tablet (768px - 1024px)**: Lưới 3 cột chỉ số nằm ngang, bảng checklist 10 điểm dàn 2 cột dễ đọc.
- **Laptop & Desktop (1366px - 1920px)**: Hiển thị đầy đủ giao diện phân tích toàn diện, bao gồm đồ thị nồng độ bụi thực tế và tem niêm phong số SHA-256.

---

## 8. Bẫy Lỗi Thường Gặp & Hướng Dẫn Kiểm Thử

### 8.1. Các bẫy lỗi thực tế tại công trường & Giải pháp phòng ngừa
1. **Bẫy lỗi vỡ khung hoặc tràn trang khi in ấn từ trình duyệt di động**:
   - *Hiện tượng*: Chỉ huy trưởng bấm in từ trình duyệt Safari/Chrome trên điện thoại làm bảng số liệu bị co cụm hoặc chia làm 2 trang rời rạc.
   - *Giải pháp*: Sử dụng class in chuyên dụng `@media print { body { width: 100%; } table { width: 100%; border-collapse: collapse; } }` đảm bảo co giãn hoàn hảo vừa vặn trang giấy A4.
2. **Bẫy lỗi hiển thị số liệu `NaN` hoặc `undefined` khi công trình mới khởi công**:
   - *Hiện tượng*: Dự án mới chưa có lượt rửa xe nào làm hiển thị `NaN%`.
   - *Giải pháp*: Sử dụng toán tử an toàn: `metrics?.coverageRate ?? 100`, `metrics?.trucksWashed ?? 0`, `metrics?.avgRemediationHours ?? 0`.

### 8.2. Hướng dẫn kiểm thử tự động qua CLI PowerShell

```powershell
# 1. Chạy bài kiểm thử đơn lẻ cho phân hệ báo cáo và 10 tiêu chuẩn QCVN 18 (< 0.5s)
node --test app/tests/contractor-ui-workspace.test.js

# 2. Kiểm tra tuân thủ bộ quy tắc thiết kế Zero Glassmorphism & Print Stylesheet
node --test app/tests/design-system-tokens.test.js

# 3. Chạy cổng kiểm định nhanh cấp độ 3 trước khi commit
npm --prefix app run verify:quick
```
