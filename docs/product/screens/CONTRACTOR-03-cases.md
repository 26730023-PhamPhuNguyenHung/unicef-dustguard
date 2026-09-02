# CONTRACTOR-03 — Sổ Theo Dõi Vụ Việc & Hồ Sơ Vi Phạm Công Trường

> **Mã màn hình**: `CONTRACTOR-03` (Viết tắt: `CON-03`)  
> **Tên tiếng Việt**: Sổ Theo Dõi Vụ Việc & Hồ Sơ Vi Phạm Môi Trường Công Trường  
> **Tên tiếng Anh**: Contractor Cases Management & Violation Dossiers  
> **Quy chuẩn & Pháp lý liên quan**: [`QCVN 18:2021/BXD`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/QCVN-18-2021-BXD.md) (An toàn môi trường xây dựng), [`Nghị định 45/2022/NĐ-CP`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/docs/legal/ND-45-2022-ND-CP.md) (Xử phạt vi phạm môi trường)

---

## 1. Thông Tin Nhận Diện Màn Hình (Screen Identity)

| Thuộc tính | Chi tiết nhận diện thực tế |
|---|---|
| **Mã màn hình** | `CONTRACTOR-03` (Tên tệp: `CONTRACTOR-03-cases.md`) |
| **Tên tiếng Việt** | Sổ Theo Dõi Vụ Việc & Hồ Sơ Vi Phạm Môi Trường Công Trường |
| **Tên tiếng Anh** | Contractor Cases Management & Violation Dossiers |
| **Đường dẫn truy cập (Route)** | `/contractor/cases` (Đường dẫn phụ: `/contractor/cases/:id`, `/contractor/projects`) |
| **Tệp giao diện chính** | [`app/src/apps/contractor/pages/cases/ContractorCasesPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/pages/cases/ContractorCasesPage.jsx), kết hợp [`app/src/modules/contractor/ContractorProjectDetail.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/modules/contractor/ContractorProjectDetail.jsx) |
| **Khung bố cục (Layout)** | [`app/src/apps/contractor/layout/ContractorLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/contractor/layout/ContractorLayout.jsx) (Giao diện sáng rõ, bảng danh sách dễ đọc, mã hồ sơ không bị cắt chữ) |
| **Ai được sử dụng?** | Nhà thầu xây dựng (Chỉ huy trưởng công trường, Kỹ sư an toàn HSE, Giám đốc điều hành dự án, Cán bộ pháp chế hợp đồng) |
| **Trạng thái vận hành** | Đang hoạt động ổn định — Kết nối dữ liệu hồ sơ thực tế từ hệ thống |

**Tóm tắt mục đích sử dụng**: Màn hình đóng vai trò như một cuốn "Sổ nhật ký điện tử" theo dõi tất cả các lần công trường bị người dân phản ánh hoặc bị đoàn kiểm tra nhắc nhở về bụi và tiếng ồn. Màn hình giúp Chỉ huy trưởng và Ban điều hành nhà thầu nắm rõ tình trạng của từng hồ sơ: đang ở bước nào (mới tiếp nhận, đang dập bụi, đang chờ cán bộ nghiệm thu hay đã đóng hồ sơ xong xuôi). Màn hình lưu lại toàn bộ ảnh chụp ban đầu và ảnh chụp sau khi đã dọn dẹp sạch sẽ, biên bản kiểm tra và ý kiến của cán bộ thanh tra, giúp nhà thầu chứng minh rõ ràng mình đã xử lý trách nhiệm, không bị phạt tiền và bảo vệ uy tín trước Chủ đầu tư.

---

## 2. Mục Đích & Giá Trị Thực Tế

### 2.1. Giải quyết bài toán thực tế ngoài công trường
1. **Thay thế sổ ghi chép và giấy tờ rời rạc — Không lo thất lạc**:
   - Thay vì lưu các biên bản nhắc nhở bằng giấy trong cặp tài liệu dễ ướt hoặc thất lạc, toàn bộ lịch sử vi phạm và xử lý đều được lưu trữ tập trung trên hệ thống.
   - Mỗi vụ việc có một mã số riêng (ví dụ: `#CASE-0420`), tìm kiếm lại chỉ mất 3 giây.
2. **Theo dõi tiến độ xử lý qua từng bước rõ ràng**:
   - Chỉ huy trưởng nhìn vào là biết ngay hồ sơ đang ở bước nào:
     - *Bước 1: Tiếp nhận phản ánh* $\rightarrow$ *Bước 2: Cán bộ đi kiểm tra* $\rightarrow$ *Bước 3: Đề xuất phương án tưới nước/che bạt* $\rightarrow$ *Bước 4: Duyệt phương án* $\rightarrow$ *Bước 5: Nhà thầu đã dập bụi xong* $\rightarrow$ *Bước 6: Cán bộ nghiệm thu* $\rightarrow$ *Bước 7: Đóng hồ sơ an toàn*.
   - Biết rõ ai đang phải làm gì: *Chờ nhà thầu nộp ảnh* hay *Chờ cán bộ duyệt*.
3. **Phân định rõ ranh giới trách nhiệm — Tránh bị phạt oan**:
   - Ở các công trình gần đường lớn, bụi có thể do xe cộ ngoài đường hoặc công trình bên cạnh gây ra.
   - Hồ sơ lưu rõ vị trí chụp ảnh, số liệu đo bụi và ảnh đối chứng giúp nhà thầu giải trình rõ ràng: bụi phát sinh từ đâu và công trường mình đã tưới ẩm sạch sẽ thế nào, tránh bị xử phạt oan thay cho người khác.
4. **Bằng chứng vững chắc khi giải trình với Đoàn kiểm tra**:
   - Khi Thanh tra Sở Xây dựng hoặc Đội Quản lý trật tự đô thị đến kiểm tra, Chỉ huy trưởng mở màn hình này ra cho xem toàn bộ các vụ việc đã được xử lý xong đúng hạn, là căn cứ để không bị lập biên bản xử phạt từ 10 đến 50 triệu đồng.

### 2.2. So sánh cách làm cũ và cách làm mới

| Tiêu chí | Quản lý bằng giấy tờ truyền thống | Dùng Sổ theo dõi điện tử CON-03 |
|---|---|---|
| **Tìm lại hồ sơ cũ** | Mất cả buổi lục lọi đống giấy tờ trong lán trại | **Dưới 3 giây** tìm theo mã số hoặc ngày tháng |
| **Biết hồ sơ đang ở đâu** | Không rõ cán bộ đã ký biên bản đóng vụ việc chưa | Nhìn thấy rõ từng bước theo thời gian thực |
| **Giải quyết tranh chấp** | Khó cãi khi có người dân phản ánh lên phường | Có đầy đủ ảnh Trước/Sau và ngày giờ làm bằng chứng |
| **Báo cáo giao ban tuần** | Mất nhiều thời gian tổng hợp số liệu thủ công | 1 chạm xem toàn bộ các việc đã giải quyết trong tháng |
| **Đánh giá từ Chủ đầu tư** | Bị xem là thụ động, làm việc thiếu ngăn nắp | Được đánh giá là chuyên nghiệp, minh bạch, bài bản |

---

## 3. Ai Sử Dụng & Luồng Thao Tác Thực Tế

### 3.1. Các vị trí thực tế tại công trường
1. **Kỹ sư Nguyễn Văn Hùng — Chỉ huy trưởng công trường**:
   - Mở xem tổng số hồ sơ đang mở trước các cuộc họp giao ban hàng tuần với Ban Quản lý Dự án (PMU).
2. **Kỹ sư Trần Anh Tuấn — Phụ trách An toàn & Môi trường (HSE)**:
   - Theo dõi từng hồ sơ xem cán bộ thanh tra đã duyệt nghiệm thu ảnh chụp hay chưa để an tâm hoàn thành nhiệm vụ.
3. **Cán bộ Pháp chế & Hợp đồng của Nhà thầu**:
   - Trích xuất lịch sử hồ sơ và ảnh chụp để làm việc với các cơ quan quản lý khi có đợt thanh tra định kỳ.

### 3.2. Sơ đồ quy trình tra cứu hồ sơ vụ việc

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [MỞ MỤC "SỔ THEO DÕI VỤ VIỆC" (/contractor/cases)]                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [DANH SÁCH TẤT CẢ CÁC VỤ VIỆC CỦA CÔNG TRƯỜNG]                         │
│ • Xem nhanh tổng số: [Tất cả: 14] [Đang xử lý: 2] [Đã đóng: 12]        │
│ • Lọc theo: Mức độ ưu tiên, Thời gian hoặc Tìm kiếm theo Mã hồ sơ      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Bấm chọn 1 hồ sơ cụ thể)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [XEM CHI TIẾT HỒ SƠ VI PHẠM & KHẮC PHỤC]                               │
│ ├─► 1. Thanh tiến trình: Đang ở bước nào (Đang dập bụi -> Đã nghiệm thu)│
│ ├─► 2. Xem cặp ảnh đối chứng: Ảnh lúc bị lỗi và Ảnh sau khi đã dọn dẹp  │
│ ├─► 3. Lịch sử làm việc: Ai phát hiện, Ai chụp ảnh nộp, Cán bộ nào duyệt│
│ ├─► 4. Ý kiến kết luận của Cán bộ kiểm tra môi trường                  │
│ └─► 5. Bấm nút [In hồ sơ A4] nếu cần nộp cho Chủ đầu tư                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bố Cục Giao Diện & Hình Ảnh Minh Họa

### 4.1. Cách sắp xếp thông tin trên màn hình
1. **Hàng 3 ô tóm tắt hồ sơ**:
   - **Tổng số vụ việc**: Toàn bộ các lần có phản ánh từ đầu dự án (Ví dụ: `14 vụ`).
   - **Đang xử lý**: Các vụ việc chưa hoàn thành (Chữ màu cam/đỏ, ví dụ: `2 vụ`).
   - **Đã đóng an toàn**: Các vụ việc đã được cán bộ kiểm tra duyệt xong (Chữ màu xanh lá, ví dụ: `12 vụ`).
2. **Khung tìm kiếm & Lọc nhanh**:
   - Ô tìm kiếm mã hồ sơ (ví dụ: `#CASE-0420`) hoặc vị trí (Cổng số 2, Bãi cát).
   - Nút lọc theo trạng thái: Tất cả / Đang thụ lý / Đã đóng.
3. **Bảng danh sách hồ sơ**:
   - Hiển thị đầy đủ: Mã hồ sơ, Vị trí vi phạm, Ngày lập, Mức độ ưu tiên, Trạng thái và Nút xem chi tiết.
4. **Khung xem chi tiết một hồ sơ**:
   - Thanh tiến trình từng bước trực quan.
   - Cặp ảnh Before (Trước) và After (Sau) hiển thị song song.
   - Ý kiến kết luận và chữ ký của cán bộ phụ trách.

### 4.2. Giao diện xem trên máy tính (Desktop)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DUSTGUARD VN  |  NHÀ THẦU XÂY DỰNG   Dự án: Chung Cư Thanh Xuân Garden   Chỉ huy trưởng: Nguyễn Văn Hùng  [ Đăng xuất ]│
├────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┤
│ BÀN LÀM VIỆC           │ SỔ THEO DÕI VỤ VIỆC & HỒ SƠ VI PHẠM MÔI TRƯỜNG                                                │
│ [ ] Tổng quan nhanh    │ ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│ [ ] Việc cần khắc phục │ │ TỔNG SỐ HỒ SƠ        │  │ ĐANG XỬ LÝ GẤP       │  │ ĐÃ ĐÓNG AN TOÀN                      │ │
│ [●] Sổ theo dõi vụ việc│ │          14          │  │          2           │  │                  12                  │ │
│ [ ] Báo cáo in A4      │ └──────────────────────┘  └──────────────────────┘  └──────────────────────────────────────┘ │
│ ────────────────────── │                                                                                               │
│ TÌM KIẾM & BỘ LỌC      │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│ [🔍 Nhập mã hồ sơ...] │ │ Lọc trạng thái: [ Tất cả (14) ]  [ ⚠️ Đang xử lý (2) ]  [ ✅ Đã nghiệm thu đóng hồ sơ (12) ]│ │
│ Trạng thái: Tất cả ▼  │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
│ Mức độ: Tất cả ▼       │                                                                                               │
│                        │ DANH SÁCH CÁC VỤ VIỆC:                                                                        │
│                        │ ┌───────────────────────────────────────────────────────────────────────────────────────────┐ │
│                        │ │ Mã hồ sơ: #CASE-2026-0420  |  Cổng số 2 — Xe tải không rửa bánh làm bẩn đường Nguyễn Trãi │ │
│                        │ │ • Mức độ: Ưu tiên Cao  |  Ngày lập: 02/09/2026  |  Trạng thái: ĐANG CHỜ CÁN BỘ DUYỆT      │ │
│                        │ │ • Đã nộp ảnh: Lúc 11:30 (Đã quét dọn và xịt rửa lốp 100% xe)        [ 🔍 XEM HỒ SƠ CHI TIẾT ]│ │
│                        │ ├───────────────────────────────────────────────────────────────────────────────────────────┤ │
│                        │ │ Mã hồ sơ: #CASE-2026-0388  |  Bãi cát xây thô Zone B — Chưa phủ bạt chống bụi phát tán    │ │
│                        │ │ • Mức độ: Ưu tiên Vừa  |  Ngày lập: 01/09/2026  |  Trạng thái: ĐANG KHẮC PHỤC (Hạn 10:00)  │ │
│                        │ │ • Yêu cầu: Trùm bạt kín 100% và phun sương dập bụi                   [ 🔍 XEM HỒ SƠ CHI TIẾT ]│ │
│                        │ ├───────────────────────────────────────────────────────────────────────────────────────────┤ │
│                        │ │ Mã hồ sơ: #CASE-2026-0312  |  Giàn giáo tầng 4 — Rách lưới chắn bụi phía sau              │ │
│                        │ │ • Mức độ: Bình thường  |  Ngày lập: 25/08/2026  |  Trạng thái: ĐÃ ĐÓNG HỒ SƠ AN TOÀN       │ │
│                        │ │ • Kết luận cán bộ: "Đã thay lưới mới đạt chuẩn an toàn, đồng ý nghiệm thu"  [ 🔍 XEM LẠI ] │ │
│                        │ └───────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Kết Nối Hệ Thống

### 5.1. Các đường dẫn lấy dữ liệu (API Endpoints)
- `GET /api/contractor/cases`: Lấy danh sách toàn bộ hồ sơ vụ việc của nhà thầu.
- `GET /api/contractor/cases/:id`: Lấy chi tiết hồ sơ cụ thể kèm hình ảnh và biên bản.

### 5.2. Mẫu dữ liệu hồ sơ vụ việc từ hệ thống

```json
{
  "success": true,
  "data": {
    "caseId": "case_0420",
    "caseCode": "CASE-2026-0420",
    "title": "Xe tải vận chuyển đất móng không rửa bánh Cổng số 2",
    "status": "PENDING_VERIFICATION",
    "statusText": "Đang chờ cán bộ nghiệm thu",
    "createdAt": "2026-09-02T08:30:00+07:00",
    "remediatedAt": "2026-09-02T11:30:00+07:00",
    "inspectorName": "Nguyễn Thành Long (Cán bộ Đội QLTTĐT)",
    "beforePhoto": "/uploads/evidences/cong2_truoc.jpg",
    "afterPhoto": "/uploads/evidences/cong2_sau.jpg",
    "conclusion": "Nhà thầu đã chủ động quét bùn và vận hành máy xịt rửa lốp đúng cam kết."
  }
}
```

---

## 6. Danh Sách Nút Bấm & Thao Tác (Action Buttons)

| Tên nút bấm | Nằm ở đâu | Màu sắc & Kiểu nút | Kích thước | Bấm vào sẽ làm gì? | Khi nào bấm được? |
|---|---|---|---|---|---|
| **[🔍 Xem hồ sơ chi tiết]** | Trên từng dòng vụ việc | Nền xanh nhạt, viền đậm | Cao $\ge 44\text{px}$ | Mở xem chi tiết các bước, ảnh Before/After và biên bản | Luôn bấm được |
| **[Tất cả] / [Đang xử lý] / [Đã đóng]** | Thanh lọc trạng thái | Thẻ tab xám / xanh | Cao $44\text{px}$ | Lọc nhanh danh sách hồ sơ | Luôn bấm được |
| **[🖨️ In hồ sơ A4]** | Trong trang xem chi tiết | Nền trắng viền xám | Cao $\ge 44\text{px}$ | Xuất bản in hồ sơ để lưu vào cặp tài liệu nghiệm thu | Khi xem chi tiết hồ sơ |
| **[← Quay lại]** | Góc trên bên trái | Nút mũi tên | $44\text{px} \times 44\text{px}$ | Quay lại danh sách tổng hợp | Khi đang xem chi tiết |

---

## 7. Quy Chuẩn Giao Diện Ngoài Trời

### 7.1. Màu sắc sáng rõ — Tuyệt đối không dùng nền mờ
- **Nền trang**: Màu kem sáng `#FAFAF9`, các khối hồ sơ nền trắng `#FFFFFF` với viền xám `#E7E5E4` rõ ràng.
- **Mã hồ sơ**: Chữ in hoa rõ nét (ví dụ: `#CASE-2026-0420`), không bao giờ bị cắt ngắn văn bản.
- **Màu trạng thái**:
  - Đang xử lý: Nền vàng cam nhạt, chữ cam đậm.
  - Đã đóng an toàn: Nền xanh nhạt, chữ xanh lá đậm.

### 7.2. Nút bấm to — Dễ tra cứu trên điện thoại
- Danh sách dạng thẻ cuộn mượt mà trên điện thoại, nút bấm xem chi tiết to rõ, khoảng cách thoáng đãng chống bấm nhầm.

---

## 8. Hướng Dẫn Xử Lý Tình Huống & Kiểm Tra Lỗi

### 8.1. Các tình huống thực tế và cách xử lý
1. **Tìm kiếm không ra hồ sơ**:
   - *Tình huống*: Nhập sai mã số vụ việc hoặc tìm nhầm tên gói thầu.
   - *Cách xử lý*: Hệ thống hiển thị: *"Không tìm thấy hồ sơ nào khớp với từ khóa. Bấm [Xóa bộ lọc] để xem lại toàn bộ danh sách."*
2. **Chủ đầu tư yêu cầu bản in giấy của các vụ việc đã đóng**:
   - *Tình huống*: Ban Quản lý Dự án yêu cầu hồ sơ giấy để làm thủ tục thanh toán.
   - *Cách xử lý*: Bấm nút `[🖨️ In hồ sơ A4]`, hệ thống tự xuất bản in sạch đẹp gồm ảnh Trước/Sau và chữ ký xác nhận của cán bộ.

### 8.2. Lệnh kiểm tra màn hình qua PowerShell

```powershell
# 1. Kiểm tra màn hình danh sách vụ việc nhà thầu (< 0.5s)
node --test app/tests/contractor-ui-workspace.test.js

# 2. Kiểm tra hiển thị đầy đủ mã hồ sơ không bị cắt chữ
node --test app/tests/design-system-tokens.test.js

# 3. Chạy kiểm tra nhanh toàn hệ thống
npm --prefix app run verify:quick
```
