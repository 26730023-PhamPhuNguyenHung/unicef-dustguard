# PUB-03 — Cổng Tín Chỉ Tình Nguyện Đoàn - Hội, Bảng Thi Đua CLB & Chứng Chỉ QR (Youth Credits)

---

## 1. Định Danh Màn Hình (Screen Identity)

| Thuộc tính | Chi tiết |
|---|---|
| **Mã màn hình** | `PUB-03` |
| **Tên tiếng Việt** | Cổng Tín Chỉ Tình Nguyện Đoàn - Hội, Bảng Thi Đua CLB & Chứng Chỉ QR |
| **Tên tiếng Anh** | Youth Environmental Credits, University Leaderboard & Verifiable QR Certificate |
| **Đường dẫn (URL)** | `/youth` (hỗ trợ chuyển hướng từ `/public/youth-credits`, `/citizen/credits`, `/youth/leaderboard`) |
| **Tập tin mã nguồn chính** | `app/src/modules/youth/YouthCredits.jsx` |
| **Tập tin quy đổi giờ & tín chỉ** | `app/src/lib/youth-credits.js` |
| **Bố cục giao diện** | Khung trang công khai 3 Tab lớn, hỗ trợ định dạng in ấn chuyên dụng cho khổ giấy A4 |
| **Quyền truy cập** | Mở công khai cho toàn thể học sinh, sinh viên, đoàn viên thanh niên và các câu lạc bộ tình nguyện toàn quốc |
| **Trạng thái vận hành** | **Đang hoạt động ổn định** (Tích hợp công thức tính giờ thực tế, mã QR quét bằng camera điện thoại, mã đối chiếu chống làm giả và xuất file in A4 sắc nét) |

---

## 2. Mục Đích Nghiệp Vụ & Giá Trị Thực Tế

Trang **PUB-03** tạo động lực thực chất cho thế hệ trẻ (học sinh, sinh viên, đoàn viên - hội viên) tham gia bảo vệ môi trường sống quanh mình thông qua 5 giá trị cốt lõi:

1. **Quy đổi rõ ràng: 20 Giờ tình nguyện = 4.0 Tín chỉ ngoại khóa / Điểm rèn luyện**:
   - Giải quyết bài toán ghi nhận công sức đóng góp thực tế của sinh viên khi tham gia giám sát và hỗ trợ dập bụi đô thị.
   - Mỗi phản ánh hiện trường được cán bộ hoặc đội liên ngành xác nhận đã xử lý xong được quy đổi thành **+2.5 giờ tình nguyện thực địa** và **+10 Điểm rèn luyện**.
   - Khi tích lũy đủ **20.0 giờ** trong học kỳ, sinh viên đạt xếp loại *Tích cực xuất sắc* và được đề xuất quy đổi **4.0 Tín chỉ ngoại khóa**.
2. **Giấy chứng nhận điện tử chuẩn khổ A4 trang trọng**:
   - Tự động xuất hồ sơ chứng nhận hoạt động môi trường khổ giấy A4 trang nhã để sinh viên nộp cho Văn phòng Đoàn trường hoặc Phòng Công tác sinh viên.
   - Tích hợp **Con dấu đỏ số hóa** của *Ban Điều Phối Mạng Lưới Giám Sát Môi Trường DustGuard VN*.
   - Có **Mã đối chiếu chống làm giả** (ví dụ: `VERIFY-HUST-8A9C012F`) để nhà trường dễ dàng kiểm tra, chống khai khống giờ tình nguyện.
3. **Mã QR quét trực tiếp bằng camera điện thoại**:
   - Tự động tạo mã QR rõ nét trên màn hình và trên giấy in A4.
   - Thầy cô phụ trách Đoàn - Hội chỉ cần bật camera điện thoại quét mã là mở ra ngay trang xác thực kết quả thực tế trên hệ thống DustGuard.
4. **Bục vinh danh Top 3 & Bảng thi đua các trường Đại học toàn quốc**:
   - Thúc đẩy phong tràu thi đua sôi nổi giữa các Đội Sinh viên Tình nguyện (SVTN) và Câu lạc bộ Môi trường thuộc các trường Đại học lớn (ĐH Bách Khoa Hà Nội - HUST, ĐHQG Hà Nội - VNU, ĐH Xây dựng - HUCE, ĐH Kinh tế Quốc dân - NEU, ĐH Ngoại thương - FTU, ĐH Giao thông Vận tải - UTC, ĐH Thủy lợi - TLU...).
   - Bục vinh danh 3 cấp: Quán quân Vàng 🥇, Á quân Bạc 🥈, Hạng ba Đồng 🥉.
5. **Nhận nhiệm vụ khảo sát thực địa gần nhà (Micro-Missions)**:
   - Gợi ý các nhiệm vụ kiểm tra thực tế trong phạm vi gần nơi sinh sống (kiểm tra che bạt công trình Keangnam Landmark, đối chứng trạm rửa xe The Zei Mỹ Đình, đo nồng độ bụi cổng trường TH Dịch Vọng A...).
   - Sinh viên nhận việc 1-chạm và chụp ảnh nộp minh chứng trực tiếp để cộng giờ tình nguyện.

---

## 3. Đối Tượng Người Dùng & Hành Trình Thao Tác (User Journey)

### 3.1. Các nhóm người dùng chính
- **Sinh viên các trường Đại học / Cao đẳng**: Nhập Họ tên, Mã sinh viên (MSSV), Trường để theo dõi tích lũy giờ và in Giấy chứng nhận A4 nộp cho Đoàn trường.
- **Ban Chấp hành Đoàn trường / Hội Sinh viên**: Quét mã QR trên chứng chỉ để kiểm tra đối soát giờ hoạt động trước khi cộng điểm rèn luyện.
- **Đội trưởng các CLB Tình nguyện**: Theo dõi thứ hạng của Đội/CLB trên Bảng thi đua toàn quốc để phát động các buổi ra quân thực tế cuối tuần.
- **Tình nguyện viên hiện trường**: Nhận các nhiệm vụ kiểm tra gần nhà để tích lũy thêm giờ hoạt động.

### 3.2. Sơ đồ luồng thao tác 3 Tab chức năng

```text
[Truy cập /youth hoặc bấm "Góc Thanh Niên"]
                     │
                     ▼
          [Chọn 1 trong 3 Tab Chức Năng]
                     │
    ┌────────────────┼────────────────────────────────┐
    ▼                ▼                                ▼
[TAB 1: HỒ SƠ TÍN CHỈ] [TAB 2: BẢNG THI ĐUA CLB]    [TAB 3: NHẬN NHIỆM VỤ]
    │                │                                │
    ├─ Nhập Tên,     ├─ Xem Bục vinh danh Top 3       ├─ Xem việc gần nhà
    │  MSSV, Trường  │  (HUST, VNU, NEU...)           │  (+45p / +60p)
    │                │                                │
    ├─ Xem thanh tiến├─ Tìm kiếm tên CLB / Trường     ├─ Bấm [Nhận việc]
    │  độ 5h-10h-20h │                                │
    │                ├─ Xem tổng giờ & số phản ánh    ├─ Bấm [Nộp ảnh]
    ├─ Nạp mã phản   │  đã xử lý xong                 │  chụp ảnh kiểm tra
    │  ánh cộng giờ  └────────────────────────────────┘  để nhận giờ thưởng
    │                                                 └────────────────────┘
    ├─ Hiện Giấy chứng nhận A4 có Dấu đỏ & Mã QR
    │
    └─ Bấm [🖨️ In / Tải PDF A4] để xuất hồ sơ
```

---

## 4. Bố Cục Giao Diện & Khung Dây Wireframe Chi Tiết

### 4.1. Khung dây Wireframe Tab 1 — Hồ Sơ Tín Chỉ & Chứng Nhận A4

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ THANH ĐIỀU HƯỚNG: Trang chủ / Góc Thanh Niên & Hồ Sơ Đóng Góp                  [ + Gửi phản ánh ]  │
│ TIÊU ĐỀ: QUẢN LÝ GIỜ HOẠT ĐỘNG & HỒ SƠ ĐÓNG GÓP MÔI TRƯỜNG                                         │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3 TAB CHỨC NĂNG LỚN:                                                                               │
│  [ ⭐ Hồ Sơ Tín Chỉ & Chứng Nhận ]   [ 🏆 Bảng Thi Đua CLB ]   [ 🎯 Nhiệm Vụ Khảo Sát Thực Địa ]   │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ FORM NHẬP THÔNG TIN SINH VIÊN / TÌNH NGUYỆN VIÊN:                                                  │
│ ┌───────────────────────────┬────────────────────────────┬───────────────────────────────────────┐ │
│ │ Họ và tên: NGUYỄN VĂN AN  │ Mã sinh viên: 20221234     │ Trường: [HUST] ĐH Bách Khoa Hà Nội... │ │
│ └───────────────────────────┴────────────────────────────┴───────────────────────────────────────┘ │
│                                                                                                    │
│ THANH TIẾN ĐỘ TÍCH LŨY HOẠT ĐỘNG: 20.0 / 20.0 GIỜ                            [ ĐÃ TÍCH LŨY: 20.0h ] │
│ [========================================================================================] 100%    │
│ (1. Mốc 5h: Đạt ✓)    (2. Mốc 10h: Đạt ✓)    (3. Mốc 15h: Đạt ✓)    (4. Mốc 20h: Xuất sắc ✓)     │
│                                                                                                    │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ KHUNG GIẤY CHỨNG NHẬN ĐIỆN TỬ CHUẨN A4:                                                        │ │
│ │ ┌────────────────────────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │                                 MẠNG LƯỚI DUSTGUARD VN                                     │ │ │
│ │ │                   HỒ SƠ GHI NHẬN HOẠT ĐỘNG MÔI TRƯỜNG THANH NIÊN                           │ │ │
│ │ │                         Mã hồ sơ: ACT-REC-2026-88912 • Ngày cấp: 02/09/2026                │ │ │
│ │ │────────────────────────────────────────────────────────────────────────────────────────────│ │ │
│ │ │ Tình nguyện viên:  NGUYỄN VĂN AN                  │ Tổng giờ hoạt động:  20.0 Giờ          │ │ │
│ │ │ Mã số sinh viên:   20221234                       │ Tín chỉ ngoại khóa:  4.0 Tín chỉ       │ │ │
│ │ │ Đơn vị đào tạo:    Đại học Bách Khoa Hà Nội       │ Điểm rèn luyện:      80 ĐRL            │ │ │
│ │ │────────────────────────────────────────────────────────────────────────────────────────────│ │ │
│ │ │ "Đã hoàn thành 20.0 giờ tình nguyện giám sát môi trường đô thị, đóng góp ghi nhận và phối   │ │ │
│ │ │  hợp xử lý 12 phản ánh ô nhiễm bụi thực địa."                                              │ │ │
│ │ │                                                                                            │ │ │
│ │ │  ┌───────────────┐   Mã đối chiếu: VERIFY-HUST-8A9C012F            ┌─────────────────────┐ │ │ │
│ │ │  │   [MÃ QR]     │   Xác thực: Chữ ký điện tử DustGuard VN         │ (DẤU ĐỎ SỐ DUSTGUARD│ │ │ │
│ │ │  │  Quét camera  │   Tra cứu: https://dustguard.vn/citizen...      │ DỮ LIỆU ĐÃ XÁC THỰC)│ │ │ │
│ │ │  └───────────────┘                                                 └─────────────────────┘ │ │ │
│ │ └────────────────────────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                  [ 🖨️ In / Tải PDF Hồ Sơ A4 ]  │ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                    │
│ NHẬT KÝ HOẠT ĐỘNG & ĐÓNG GÓP:                         [ Nhập mã DG-2026-XXXX ]   [ + Nạp mã ]      │
│ ┌──────────────┬────────────┬──────────────────────────┬──────────────────────────┬──────────────┐ │
│ │ Mã phản ánh  │ Ngày gửi   │ Địa điểm                 │ Trạng thái               │ Giờ tích lũy │ │
│ ├──────────────┼────────────┼──────────────────────────┼──────────────────────────┼──────────────┤ │
│ │ DG-2026-F54A │ 25/07/2026 │ Số 18 Phạm Hùng, Yên Hòa │ Đã dập bụi xong (RESOLVED)│ +2.5 giờ    │ │
│ │ DG-2026-E88B │ 27/07/2026 │ Nguyễn Văn Lộc, Mộ Lao   │ Đã dập bụi xong (RESOLVED)│ +2.5 giờ    │ │
│ │ DG-2026-K419 │ 02/09/2026 │ Trần Thái Tông, Cầu Giấy │ Đã dập bụi xong (RESOLVED)│ +2.5 giờ    │ │
│ └──────────────┴────────────┴──────────────────────────┴──────────────────────────┴──────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Nguồn Thông Tin Cần Hiển Thị

### 5.1. Dữ liệu tiến độ tín chỉ & giờ tình nguyện
- **Đường dẫn**: `GET /api/youth/credits`
- **Cấu trúc dữ liệu đơn giản**:
```json
{
  "status": "success",
  "data": {
    "studentName": "Nguyễn Văn An",
    "studentId": "20221234",
    "universityCode": "HUST",
    "universityName": "Đại học Bách Khoa Hà Nội",
    "verifiedHours": 20.0,
    "totalHours": 20.0,
    "extracurricularCredits": 4.0,
    "activityPoints": 80,
    "rating": "Tích cực xuất sắc",
    "verificationHash": "VERIFY-HUST-8A9C012F",
    "certificateEligible": true,
    "disclaimer": "Hồ sơ này ghi nhận dữ liệu hoạt động trong hệ thống DustGuard. Việc công nhận thuộc thẩm quyền của đơn vị tiếp nhận."
  }
}
```

### 5.2. Dữ liệu bảng thi đua các trường toàn quốc
- **Đường dẫn**: `GET /api/youth/leaderboard`
- **Cấu trúc dữ liệu**:
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "rank": 1,
        "name": "Đội SVTN Môi Trường HUST (ĐH Bách Khoa)",
        "universityCode": "HUST",
        "verifiedHours": 428.5,
        "resolvedReports": 172,
        "activeMembers": 45
      },
      {
        "rank": 2,
        "name": "CLB Tình Nguyện Xanh VNU (ĐHQG Hà Nội)",
        "universityCode": "VNU",
        "verifiedHours": 396.0,
        "resolvedReports": 158,
        "activeMembers": 38
      },
      {
        "rank": 3,
        "name": "Đội Xung Kích Môi Trường NEU (ĐH KTQD)",
        "universityCode": "NEU",
        "verifiedHours": 312.5,
        "resolvedReports": 125,
        "activeMembers": 30
      }
    ]
  }
}
```

---

## 6. Bảng Danh Mục Nút Bấm & Thao Tác Cốt Lõi

| Tên Nút / Thao tác | Vị trí | Màu sắc & Kiểu nút | Kích thước nút bấm | Bấm vào thì làm gì | Hiển thị phản hồi |
|---|---|---|:---:|---|---|
| **Bộ 3 Tab lớn** | Thanh chọn chức năng | Nền xanh ngọc `#0d6f64` khi chọn, chữ trắng | $\ge 44\text{px}$ | Chuyển đổi qua lại giữa 3 chức năng: Tín chỉ / Bảng thi đua / Nhiệm vụ | Màn hình đổi nội dung ngay lập tức |
| **[🖨️ In / Tải PDF Hồ Sơ A4]** | Dưới Giấy chứng nhận | Nền đỏ son `#9f241f`, chữ trắng, biểu tượng máy in | $\ge 44\text{px}$ | Kích hoạt lệnh in của trình duyệt | Mở cửa sổ in, sẵn sàng lưu PDF hoặc in ra giấy A4 |
| **[+ Nạp mã]** | Form nạp mã phản ánh | Nền kem sáng, viền xám đậm | $\ge 40\text{px}$ | Kiểm tra mã phản ánh và cộng thêm giờ tình nguyện | Danh sách cập nhật và thanh tiến độ tăng lên |
| **[Nhận nhiệm vụ này]** | Thẻ nhiệm vụ khảo sát | Nền xanh ngọc nhạt, viền xanh | $\ge 40\text{px}$ | Ghi nhận sinh viên nhận việc khảo sát | Nút đổi sang trạng thái sẵn sàng nộp ảnh |
| **[Nộp ảnh minh chứng]** | Thẻ nhiệm vụ đã nhận | Nền đỏ son `#9f241f`, chữ trắng | $\ge 40\text{px}$ | Chuyển tới form chụp ảnh kiểm tra thực tế | Mở màn hình camera nộp ảnh |
| **Ô tìm kiếm CLB** | Tab Bảng Thi Đua | Nền trắng, viền xám | $\ge 44\text{px}$ | Tìm kiếm tên trường, tên CLB theo từ khóa | Danh sách bảng xếp hạng lọc tức thì |

---

## 7. Quy Chuẩn Giao Diện, In Ấn A4 & Thích Ứng Màn Hình

### 7.1. Định dạng in ấn khổ A4 chuyên dụng
Khi người dùng bấm in hoặc tải PDF, toàn bộ các thành phần thừa (thanh menu, nút bấm, chân trang) tự động ẩn đi, chỉ giữ lại khung Giấy chứng nhận:
- **Khổ giấy**: Chuẩn A4 ($210\text{mm} \times 297\text{mm}$), căn giữa trang đẹp mắt.
- **Viền chứng nhận**: Viền kép màu đỏ son ấn triện sang trọng.
- **Mã QR & Con dấu đỏ**: In sắc nét, không bị nhòe hay vỡ hình.

### 7.2. Bảng màu sáng, trang trọng
- **Nền trang chính**: Màu kem sáng `#FDFBF7`.
- **Màu nhận diện Thanh Niên**: Xanh ngọc `#0d6f64` (Teal).
- **Màu ấn triện / Dấu đỏ chứng nhận**: Đỏ son `#9f241f` (Seal Red).
- **Màu bục vinh danh**:
  - Hạng 1 (Quán quân): Nền vàng kem `#FEF3C7`, viền vàng đậm `#D97706`.
  - Hạng 2 (Á quân): Nền xám bạc `#F3F4F6`, viền bạc `#9CA3AF`.
  - Hạng 3 (Hạng ba): Nền đồng cam `#FFEDD5`, viền đồng `#EA580C`.
- **Tuyệt đối KHÔNG dùng hiệu ứng làm mờ nền (Glassmorphism)**.

### 7.3. Tương thích trên điện thoại và máy tính
- **Điện thoại di động (< 768px)**:
  - Bảng nhật ký tự động chuyển sang dạng thẻ dọc tiện xem.
  - Bục vinh danh xếp theo thứ tự: Hạng 1 ở trên cùng, sau đó đến Hạng 2 và Hạng 3.
  - Mã QR tự co dãn vừa vặn với màn hình điện thoại.
- **Máy tính (Desktop $\ge 1024px$)**:
  - Bục vinh danh hiển thị chuẩn: Bạc (#2) bên trái, Vàng (#1) ở giữa nhô cao, Đồng (#3) bên phải.

---

## 8. Các Tình Huống Thực Tế & Lệnh Kiểm Tra Nhanh

### 8.1. Các điểm cần lưu ý thực tế
1. **Chống gửi mã liên tục làm nghẽn hệ thống**: Hệ thống có cơ chế tự động giới hạn nếu một thiết bị gửi quá nhiều mã trong thời gian ngắn để tránh gian lận.
2. **Mã QR luôn quét được**: Mã QR được tạo theo chuẩn nét cao, đảm bảo dù in ra giấy hay hiển thị trên màn hình bị mờ nhẹ vẫn quét thành công.
3. **Dòng lưu ý bắt buộc trên chứng chỉ**: Mọi giấy chứng nhận đều có dòng chữ: *"Hồ sơ này ghi nhận dữ liệu hoạt động trong hệ thống DustGuard. Việc công nhận cho mục đích học tập hoặc rèn luyện thuộc thẩm quyền của đơn vị tiếp nhận."*

### 8.2. Lệnh kiểm tra nhanh trên máy tính qua PowerShell (< 0.5s)
```powershell
node --test app/tests/youth-credits.test.js app/tests/citizen-youth-ux.test.js
```

### 8.3. Tiêu chí nghiệm thu hoàn thành:
1. **Tính đúng công thức giờ & tín chỉ**: $20.0\text{h} = 4.0\text{ Tín chỉ}$ và 4 mốc tiến độ hiển thị chính xác.
2. **Mã QR quét được bằng điện thoại**: Quét mã chuyển đúng về trang tra cứu kết quả.
3. **In ấn A4 chuẩn đẹp**: Bấm lệnh in ra đúng 1 trang A4 gọn gàng, không bị nhảy sang trang thứ 2.
