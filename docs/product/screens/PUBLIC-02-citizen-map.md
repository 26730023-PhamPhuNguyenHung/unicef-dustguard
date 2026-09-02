# PUB-02 — Tra Cứu Điểm Nóng Địa Bàn & Bản Đồ Công Trình (Citizen Map & Hotspot Lookup Hub)

---

## 1. Định Danh Màn Hình (Screen Identity)

| Thuộc tính | Chi tiết |
|---|---|
| **Mã màn hình** | `PUB-02` |
| **Tên tiếng Việt** | Tra Cứu Điểm Nóng & Bản Đồ Công Trình Gần Nhà |
| **Tên tiếng Anh** | Citizen Hotspot Map & Address Lookup Hub |
| **Đường dẫn (URL)** | `/map` |
| **Tập tin mã nguồn chính** | `app/src/modules/citizen/CitizenMap.jsx` |
| **Các khối thành phần** | `SpatialMap.jsx` (Khối hiển thị bản đồ trực quan)<br>`MapLegend.jsx` (Bảng chú thích mức độ bụi)<br>`MapToolbar.jsx` (Thanh công cụ tìm kiếm và lọc)<br>`MapStates.jsx` (Trạng thái đang tải, không có dữ liệu, thông báo lỗi) |
| **Bố cục giao diện** | Khung trang công khai (Có thanh menu trên cùng và chân trang) |
| **Quyền truy cập** | Tất cả mọi người (Người dân, sinh viên, khách vãng lai — Không cần đăng nhập) |
| **Trạng thái vận hành** | **Đang hoạt động ổn định** (Tự động tải danh sách địa chỉ nhanh, hỗ trợ mở Google Maps và gửi phản ánh tức thì) |

---

## 2. Mục Đích Nghiệp Vụ & Giá Trị Thực Tế

Trang **PUB-02** giải quyết câu hỏi sát sườn của người dân đô thị tại Việt Nam (Hà Nội, TP.HCM, Bình Dương, Đà Nẵng...): **"Gần nhà tôi có công trình nào đang phát tán bụi vượt chuẩn không, và làm sao để chỉ đường tới tận cổng hoặc gửi phản ánh ngay trong 30 giây?"**

Thay vì bắt người dân phải chờ tải một tấm bản đồ nặng nề, dễ giật lag khi dùng mạng 4G/5G ngoài đường, DustGuard VN áp dụng cách làm **Ưu tiên danh sách địa chỉ rõ ràng**:

1. **Tra cứu theo địa chỉ thực tế (Ưu tiên danh sách trước)**:
   - Mặc định tải ngay dạng danh sách (Bảng số liệu trên máy tính / Thẻ thông tin trên điện thoại) hiển thị rõ số nhà, tên đường, tên Phường/Xã thực tế (ví dụ: *Phường Dịch Vọng Hậu, Phường Mễ Trì, Phường Mỹ Đình 1, Phường Hoàng Liệt, Phường An Phú...*).
   - Người dân tìm thấy ngay công trình gần nhà mình trong dưới 3 giây bằng ô tìm kiếm nhanh hoặc lọc theo Phường/Quận.
2. **Dẫn đường Google Maps 1-chạm**:
   - Mỗi công trình đều có nút **[Google Maps]** mở thẳng ứng dụng bản đồ trên điện thoại, chỉ đường chính xác tới cổng chính công trường mà không cần người dân phải gõ lại địa chỉ.
3. **Gửi phản ánh nhanh 1-chạm trong 30 giây**:
   - Nút **[Phản ánh]** màu đỏ son (`#9f241f`) mở ngay trang gửi vi phạm với tên công trình và địa chỉ đã được điền sẵn, người dân chỉ cần chụp ảnh và bấm gửi.
4. **Xem bản đồ trực quan khi cần**:
   - Có sẵn nút bấm chuyển đổi nhanh sang chế độ **"Bản đồ"** để nhìn toàn cảnh các điểm nóng xung quanh khu vực sinh sống.
5. **Đối chiếu Quy chuẩn môi trường quốc gia QCVN 05:2023/BTNMT dễ hiểu**:
   - Hiển thị rõ nồng độ bụi thực tế kèm đánh giá bằng tiếng Việt:
     - **Mức an toàn**: Bụi PM2.5 $\le 50\,\mu\text{g/m}^3$ (Gắn nhãn xanh *Trong giới hạn*).
     - **Mức vượt chuẩn**: Bụi PM2.5 $> 50\,\mu\text{g/m}^3$ (Gắn nhãn đỏ *Vượt chuẩn QCVN*).
   - Thang điểm ưu tiên $0 - 100$ tính toán dựa trên mức độ bụi, khoảng cách gần trường học/bệnh viện (dưới 200m), số lần người dân phản ánh và lịch sử xử lý của nhà thầu.

### Bảng so sánh cách làm cũ và DustGuard VN:

| Tiêu chí | Cổng thông tin cũ | DustGuard VN (Mới & Thiết thực) |
|---|---|---|
| **Cách tiếp cận** | Bắt buộc tải bản đồ nặng, dễ giật lag trên điện thoại | Ưu tiên hiện danh sách địa chỉ rõ ràng, tải cực nhanh trong 0.5s |
| **Chi tiết địa bàn** | Chỉ hiện chung chung cấp Quận/Huyện | Chi tiết đến từng Phường (Dịch Vọng Hậu, Mễ Trì...), số nhà, cổng công trường |
| **Dẫn đường tới nơi** | Không có, người dân phải tự nhớ và gõ lại | 1-chạm mở thẳng Google Maps chỉ đường đến tận cổng |
| **Gửi phản ánh vi phạm** | Phải tự điền lại tên công trình, địa chỉ từ đầu | 1-chạm [Phản ánh], tự động điền sẵn tên công trình và địa chỉ trong 30s |
| **Đánh giá chỉ số bụi** | Không giải thích chỉ số kỹ thuật | Gắn nhãn quy chuẩn rõ ràng: *Vượt chuẩn* (Đỏ) hay *Trong giới hạn* (Xanh) |

---

## 3. Luồng Hành Trình Người Dùng (User Journey)

```text
[Người dân / Sinh viên tình nguyện mở trang /map]
                        │
                        ▼
       [1. Quét nhanh 4 thẻ tổng quan đầu trang]
   (Tổng công trình | Nguy cơ cao ≥ 70đ | Cần theo dõi 40-69đ | Trạm đo đang chạy)
                        │
                        ▼
      [2. Gõ tên đường / Chọn Phường / Chọn Mức độ bụi]
   (Ví dụ: Chọn Phường Dịch Vọng Hậu hoặc gõ "Trần Thái Tông")
                        │
                        ▼
     [3. Xem chi tiết mức bụi & Đối chiếu quy chuẩn]
   (Điểm rủi ro 78/100, Bụi PM2.5: 84.5 µg/m³ - VƯỢT CHUẨN, Tên nhà thầu)
                        │
            ┌───────────┴────────────────────────────┐
            ▼                                        ▼
   [HÀNH ĐỘNG 1: DẪN ĐƯỜNG]                 [HÀNH ĐỘNG 2: GỬI PHẢN ÁNH]
   Bấm [Google Maps]                        Bấm [Phản ánh] (Nút đỏ son)
            │                                        │
            ▼                                        ▼
   Mở ứng dụng Google Maps                  Chuyển sang form gửi vi phạm
   Dẫn đường tới cổng công trường           Tự điền sẵn tên công trình & địa chỉ
                                            Chụp ảnh gửi vi phạm trong 30 giây
```

### Các bước thao tác chi tiết:
1. **Bước 1 — Vào trang**: Người dùng bấm liên kết **[Bản đồ]** trên thanh menu hoặc nút **[Xem bản đồ]** từ trang chủ.
2. **Bước 2 — Quét nhanh 4 con số tổng quan (trong 3 giây)**:
   - Tổng số công trình đang theo dõi trên địa bàn (ví dụ: 33 công trình).
   - Số công trình nguy cơ cao ($\ge 70$ điểm, nhãn đỏ) cần xử lý khẩn cấp.
   - Số công trình cần theo dõi ($40 - 69$ điểm, nhãn vàng).
   - Số trạm đo tự động đang trực tuyến gửi số liệu liên tục.
3. **Bước 3 — Tìm kiếm theo tên đường hoặc Phường**:
   - Gõ tên đường, tên dự án vào ô tìm kiếm (ví dụ: *"Trần Thái Tông"*, *"Vành đai 3"*, *"Mễ Trì"*).
   - Chọn Phường từ danh sách (ví dụ: *Phường Dịch Vọng Hậu, Phường Mễ Trì, Phường Mỹ Đình 1, Phường Hoàng Liệt, Phường An Phú*).
   - Bấm vào thẻ màu đỏ hoặc vàng để lọc nhanh các điểm nóng tương ứng.
4. **Bước 4 — Xem chi tiết mức độ bụi**:
   - Đọc chỉ số bụi $\text{PM2.5}$ và nhãn cảnh báo (*"Vượt chuẩn QCVN"* hoặc *"Trong giới hạn"*).
   - Đọc tên nhà thầu thi công và điểm rủi ro.
5. **Bước 5 — Chọn thao tác tiếp theo**:
   - Bấm **[Google Maps]**: Mở bản đồ điện thoại để xem đường đi hoặc xem ảnh vệ tinh.
   - Bấm **[Phản ánh]**: Mở form chụp ảnh hiện trường gửi vi phạm.
6. **Bước 6 (Tùy chọn) — Chuyển sang xem Bản đồ trực quan**:
   - Bấm nút **[Bản đồ]** ở góc trên bên phải để xem toàn cảnh các điểm nóng trên bản đồ.

---

## 4. Bố Cục Giao Diện & Khung Dây Wireframe Chi Tiết

### 4.1. Bố cục dạng Danh sách trên Máy tính (Desktop $\ge 768\text{px}$)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TIÊU ĐỀ: [Biểu tượng La bàn] Tra Cứu Tình Hình Bụi & Điểm Nóng Địa Bàn   [Danh sách|Bản đồ] [↻]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 4 THẺ TỔNG QUAN ĐẦU TRANG (Bấm 1-chạm để lọc nhanh):                                   │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌───────────────────────────┐  │
│ │ Tổng số: 33    │ │ Nguy cơ cao: 6 │ │ Cần theo dõi: 8│ │ Trạm đo đang chạy: 4/4    │  │
│ │ Công trình     │ │ (≥ 70đ - Đỏ)   │ │ (40-69đ - Vàng)│ │ (Gửi số liệu liên tục)    │  │
│ └────────────────┘ └────────────────┘ └────────────────┘ └───────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ THANH TÌM KIẾM & BỘ LỌC:                                                               │
│ [🔍 Tìm theo địa chỉ, tên đường, tên công trình...] [Tất cả Phường/Xã ▼] [Mức rủi ro ▼]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ BẢNG DANH SÁCH CÔNG TRÌNH THEO ĐỊA CHỈ:                                                │
│ ┌───────┬───────────────────────────────────┬──────────────┬────────────┬─────────────┬─────────────────────────┐ │
│ │ Mã    │ Tên công trình & Địa chỉ          │ Phường/Quận  │ Mức rủi ro │ Chỉ số bụi  │ Thao tác 1-chạm         │ │
│ ├───────┼───────────────────────────────────┼──────────────┼────────────┼─────────────┼─────────────────────────┤ │
│ │ BD-01 │ Tòa nhà hỗn hợp Grand Park        │ Dịch Vọng Hậu│ [● 78/100] │ PM2.5: 84.5 │ [Google Maps] [Phản ánh]│ │
│ │       │ 128 Trần Thái Tông, Cầu Giấy, HN  │ Cầu Giấy     │ (Nguy cơ)  │ (VƯỢT QCVN) │                         │ │
│ ├───────┼───────────────────────────────────┼──────────────┼────────────┼─────────────┼─────────────────────────┤ │
│ │ BD-02 │ Cải tạo hạ tầng nút Vành Đai 3    │ Mễ Trì       │ [● 52/100] │ PM2.5: 46.2 │ [Google Maps] [Phản ánh]│ │
│ │       │ Nút giao Mễ Trì - Phạm Hùng, HN   │ Nam Từ Liêm  │ (Theo dõi) │ (Giới hạn)  │                         │ │
│ ├───────┼───────────────────────────────────┼──────────────┼────────────┼─────────────┼─────────────────────────┤ │
│ │ BD-03 │ Chung cư cao tầng Mỹ Đình Plaza 3 │ Mỹ Đình 1    │ [● 74/100] │ PM2.5: 81.0 │ [Google Maps] [Phản ánh]│ │
│ │       │ 18 Lê Đức Thọ, Nam Từ Liêm, HN    │ Nam Từ Liêm  │ (Nguy cơ)  │ (VƯỢT QCVN) │                         │ │
│ ├───────┼───────────────────────────────────┼──────────────┼────────────┼─────────────┼─────────────────────────┤ │
│ │ BD-04 │ Dự án KĐT Tây Nam Linh Đàm CT4    │ Hoàng Liệt   │ [● 48/100] │ PM2.5: 42.0 │ [Google Maps] [Phản ánh]│ │
│ │       │ Bán đảo Linh Đàm, Hoàng Mai, HN   │ Hoàng Mai    │ (Theo dõi) │ (Giới hạn)  │                         │ │
│ ├───────┼───────────────────────────────────┼──────────────┼────────────┼─────────────┼─────────────────────────┤ │
│ │ BD-05 │ Khu phức hợp An Phú Urban Point   │ An Phú       │ [● 32/100] │ PM2.5: 26.5 │ [Google Maps] [Phản ánh]│ │
│ │       │ ĐT743, P. An Phú, Thuận An, BD    │ Thuận An, BD │ (An toàn)  │ (Giới hạn)  │                         │ │
│ └───────┴───────────────────────────────────┴──────────────┴────────────┴─────────────┴─────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2. Bố cục dạng Thẻ trên Điện thoại di động ($< 768\text{px}$)

```text
┌──────────────────────────────────────────┐
│ [La bàn] Tra Cứu Điểm Nóng Địa Bàn   [↻] │
│ [ Danh sách (Đang xem) ] [ Bản đồ ]      │
├──────────────────────────────────────────┤
│ ┌──────────────────┐ ┌─────────────────┐ │
│ │ Tổng số: 33      │ │ Nguy cơ: 6 (Đỏ) │ │
│ └──────────────────┘ └─────────────────┘ │
│ ┌──────────────────┐ ┌─────────────────┐ │
│ │ Theo dõi: 8(Vàng)│ │ Trạm đo: 4/4    │ │
│ └──────────────────┘ └─────────────────┘ │
├──────────────────────────────────────────┤
│ [🔍 Tìm theo địa chỉ, tên đường...      ]│
│ [ Tất cả Phường ▼ ]  [ Mức rủi ro ▼ ]    │
├──────────────────────────────────────────┤
│ THẺ CÔNG TRÌNH 1:                        │
│ ┌──────────────────────────────────────┐ │
│ │ BD-01 · Dịch Vọng Hậu, Cầu Giấy      │ │
│ │ Tòa nhà hỗn hợp Grand Park           │ │
│ │ 📍 128 Trần Thái Tông, Cầu Giấy, HN  │ │
│ │                                      │ │
│ │ [● 78/100 Nguy cơ]   PM2.5: 84.5 µg  │ │
│ │ Nhà thầu: CP XD Delta-V  (VƯỢT QCVN) │ │
│ │                                      │ │
│ │ ┌────────────────┬─────────────────┐ │ │
│ │ │  [Google Maps] │  [📸 Phản ánh]  │ │ │
│ │ └────────────────┴─────────────────┘ │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ THẺ CÔNG TRÌNH 2:                        │
│ ┌──────────────────────────────────────┐ │
│ │ BD-02 · Mễ Trì, Nam Từ Liêm          │ │
│ │ Cải tạo hạ tầng nút Vành Đai 3       │ │
│ │ 📍 Nút giao Mễ Trì - Phạm Hùng, HN   │ │
│ │                                      │ │
│ │ [● 52/100 Theo dõi]  PM2.5: 46.2 µg  │ │
│ │ Nhà thầu: Cienco 4      (Giới hạn)   │ │
│ │                                      │ │
│ │ ┌────────────────┬─────────────────┐ │ │
│ │ │  [Google Maps] │  [📸 Phản ánh]  │ │ │
│ │ └────────────────┴─────────────────┘ │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & Nguồn Thông Tin Cần Hiển Thị

### 5.1. Nguồn dữ liệu từ máy chủ
- **Đường dẫn**: `GET /map` (hoặc `GET /api/v1/public/sites`)
- **Quyền truy cập**: Mở công khai cho mọi người dân (không cần đăng nhập)
- **Thời điểm tải**: Tải ngay khi mở trang và tải lại khi bấm nút `[Làm mới]`.

### 5.2. Cấu trúc dữ liệu đơn giản dễ hiểu:
```json
{
  "success": true,
  "data": {
    "sites": [
      {
        "id": "site_hn_01",
        "code": "BD-01",
        "name": "Tòa nhà hỗn hợp Grand Park",
        "address": "128 Trần Thái Tông, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội",
        "ward": "Dịch Vọng Hậu",
        "district": "Cầu Giấy",
        "city": "Hà Nội",
        "lat": 21.0333,
        "lng": 105.7989,
        "dustRiskScore": 78,
        "pm25": 84.5,
        "pm10": 168.0,
        "complaintsCount": 5,
        "contractorName": "Công ty Cổ phần Xây dựng Delta-V",
        "status": "ACTIVE"
      },
      {
        "id": "site_hn_02",
        "code": "BD-02",
        "name": "Cải tạo hạ tầng nút Vành Đai 3",
        "address": "Nút giao Mễ Trì - Phạm Hùng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội",
        "ward": "Mễ Trì",
        "district": "Nam Từ Liêm",
        "city": "Hà Nội",
        "lat": 21.0167,
        "lng": 105.7833,
        "dustRiskScore": 52,
        "pm25": 46.2,
        "pm10": 98.0,
        "complaintsCount": 2,
        "contractorName": "Tổng Công ty Xây dựng Công trình Giao thông 4 (Cienco 4)",
        "status": "ACTIVE"
      }
    ],
    "sensors": [
      {
        "id": "sen_01",
        "code": "SEN-HN-01",
        "name": "Trạm Cổng chính Grand Park",
        "lat": 21.0335,
        "lng": 105.7991,
        "pm25": 84.5,
        "status": "ONLINE"
      }
    ]
  }
}
```

### 5.3. Các trường thông tin thực tế cần quản lý:
- **Thông tin công trình (`sites`)**:
  - `Mã công trình`: Ví dụ `BD-01`, `BD-02`.
  - `Tên công trình`: Tên dự án đầy đủ.
  - `Địa chỉ`: Số nhà, tên đường chi tiết.
  - `Phường / Xã`: Tên phường trực thuộc.
  - `Quận / Huyện`: Tên quận trực thuộc.
  - `Tọa độ vị trí`: Vị trí để mở Google Maps và hiển thị trên bản đồ.
  - `Điểm rủi ro bụi`: Thang điểm $0 - 100$.
  - `Chỉ số bụi PM2.5 / PM10`: Số đo nồng độ bụi thực tế.
  - `Tên nhà thầu thi công`: Đơn vị chịu trách nhiệm thi công.
- **Tự động xử lý an toàn khi thiếu dữ liệu**:
  - Nếu thiếu điểm rủi ro: Tự động gán điểm trung bình $45$ để người dùng vẫn theo dõi được.
  - Nếu thiếu chỉ số bụi: Tự động ước tính dựa theo mức rủi ro để không bị trống thông tin.
  - Nếu thiếu tọa độ: Nút Google Maps tự động tìm theo chuỗi địa chỉ văn bản.

---

## 6. Bảng Danh Mục Nút Bấm & Thao Tác Cốt Lõi

| Tên nút / Thao tác | Vị trí | Màu sắc & Kiểu nút | Kích thước nút bấm | Bấm vào thì làm gì | Hiển thị phản hồi |
|---|---|---|:---:|---|---|
| **[Google Maps]** | Cột thao tác trong bảng / Thẻ điện thoại | Nền kem sáng `#FDFBF7`, viền xám nhẹ, biểu tượng chỉ đường đỏ | $\ge 38\text{px}$ (Máy tính)<br>$\ge 44\text{px}$ (Điện thoại) | Mở ứng dụng Google Maps trên điện thoại | Dẫn đường chính xác tới cổng chính công trường |
| **[Phản ánh]** | Cột thao tác trong bảng / Thẻ điện thoại | Nền đỏ son `#9f241f`, chữ trắng, biểu tượng máy ảnh | $\ge 38\text{px}$ (Máy tính)<br>$\ge 44\text{px}$ (Điện thoại) | Chuyển tới màn hình gửi vi phạm `/citizen/report/new` | Mở ngay form đã điền sẵn tên công trình và địa chỉ |
| **[Danh sách] / [Bản đồ]** | Góc trên bên phải thanh tiêu đề | Cụm nút chuyển đổi 2 chế độ xem | $\ge 40\text{px}$ | Chuyển đổi qua lại giữa xem danh sách và xem bản đồ | Màn hình hoán đổi tức thì không cần tải lại trang |
| **[Làm mới] (↻)** | Góc trên bên phải thanh tiêu đề | Nền trắng, viền nhạt, biểu tượng xoay | $\ge 40\text{px}$ | Tải lại số liệu đo mới nhất từ máy chủ | Biểu tượng xoay tròn, cập nhật số liệu mới |
| **Thẻ tổng quan (Nguy cơ / Theo dõi)** | 4 Thẻ đầu trang | Nền trắng, viền phân màu (đỏ/vàng), có hiệu ứng bấm | $\ge 48\text{px}$ | Lọc danh sách công trình theo mức nguy cơ tương ứng | Danh sách tự động lọc còn các điểm nóng đã chọn |
| **Ô tìm kiếm nhanh** | Thanh tìm kiếm | Nền trắng, viền xám, biểu tượng kính lúp | $\ge 44\text{px}$ | Tìm kiếm theo tên công trình, tên đường, địa chỉ | Danh sách co lại theo đúng từ khóa vừa gõ |
| **Chọn Phường/Xã** | Thanh tìm kiếm | Nền trắng, viền xám, danh sách chọn | $\ge 44\text{px}$ | Lọc các công trình thuộc đúng địa bàn Phường | Hiển thị chính xác các công trình trên địa bàn đã chọn |

---

## 7. Quy Chuẩn Giao Diện & Thích Ứng Màn Hình (Responsive)

### 7.1. Bảng màu sáng, tương phản cao, dễ nhìn ngoài đường
- **Nền trang chính**: Màu kem sáng dịu mắt `#FDFBF7` (`bg-cream-50`), không gây lóa mắt ngoài trời.
- **Màu chữ văn bản**: Mực in đen đậm `#231b14` (`text-ink-900`), chữ đậm rõ nét trên nền sáng.
- **Màu cảnh báo nguy cơ**: Đỏ son `#9f241f` (`text-seal-600`, `bg-seal-50`), nổi bật rõ ràng.
- **Màu cảnh báo theo dõi**: Vàng hổ phách `#d97706` (`text-amber-800`, `bg-amber-50`).
- **Màu an toàn / Trong giới hạn**: Xanh ngọc `#0d6f64` (`text-teal-700`, `bg-teal-50`).
- **QUY TẮC BẮT BUỘC**: **Tuyệt đối KHÔNG dùng hiệu ứng làm mờ nền (Glassmorphism)**. Nền sáng thì chữ phải đen đậm rõ ràng.

### 7.2. Nguyên tắc không cắt cụt chữ (Đọc trọn vẹn thông tin)
- **Tuyệt đối không cắt cụt tên công trình**: Không dùng các hiệu ứng cắt bớt chữ làm người dân không đọc được tên công trình (ví dụ: *"Tòa nhà hỗn hợp Grand Park"*), tên nhà thầu hay số nhà tên đường.
- Khi xem trên điện thoại, chữ tự động xuống dòng mượt mà, giúp người dân đọc trọn vẹn địa chỉ trước khi bấm dẫn đường.

### 7.3. Tương thích trên các loại thiết bị:
- **Điện thoại di động (360px – 430px)**:
  - Tự động chuyển sang chế độ Thẻ thông tin dễ bấm.
  - 4 Thẻ tổng quan xếp thành lưới 2 cột $\times$ 2 hàng gọn gàng.
  - Hai nút **[Google Maps]** và **[Phản ánh]** dàn đều 2 bên, chiều cao $\ge 44\text{px}$ thuận tiện bấm bằng ngón tay cái.
- **Laptop 14-inch (1366x768 & 1440x900)**:
  - Bảng danh sách 6 cột hiển thị thoáng đãng, lề trang vừa vặn.
  - Không bị tràn ngang màn hình, không xuất hiện thanh cuộn ngang khó chịu.
- **Màn hình lớn (1920x1080)**:
  - Khung nội dung giới hạn căn giữa sang trọng, dễ quan sát toàn bộ danh sách.

---

## 8. Các Tình Huống Thực Tế & Lệnh Kiểm Tra Nhanh

### 8.1. Các tình huống thường gặp và cách xử lý:
1. **Không tìm thấy kết quả phù hợp**:
   - *Tình huống*: Người dân gõ tên đường hoặc chọn Phường chưa có công trình nào.
   - *Cách xử lý*: Hiển thị thông báo thân thiện: *"Không tìm thấy công trình nào phù hợp với bộ lọc"* kèm nút bấm **[Xóa tất cả bộ lọc]** để quay về danh sách đầy đủ.
2. **Mất kết nối mạng hoặc máy chủ phản hồi chậm**:
   - *Tình huống*: Mạng 4G yếu hoặc kết nối bị gián đoạn.
   - *Cách xử lý*: Ứng dụng tự động giữ lại danh sách dữ liệu mẫu đã lưu trước đó, tuyệt đối không để xảy ra hiện tượng màn hình trắng.
3. **Điện thoại chưa bật quyền định vị**:
   - *Tình huống*: Người dân mở bản đồ nhưng chưa cấp quyền vị trí.
   - *Cách xử lý*: Bản đồ tự động căn giữa theo trung tâm thành phố (Hà Nội hoặc TP.HCM) và hiển thị thông báo hướng dẫn bật định vị.
4. **Công trình chưa cập nhật tọa độ**:
   - *Tình huống*: Dữ liệu công trình chưa có số tọa độ cụ thể.
   - *Cách xử lý*: Nút **[Google Maps]** tự động chuyển sang tìm kiếm theo địa chỉ văn bản để vẫn chỉ đường được cho người dân.

### 8.2. Lệnh kiểm tra nhanh trên máy tính qua PowerShell (< 0.5s):
```powershell
# 1. Kiểm tra tính năng hiển thị bản đồ và định vị không gian
node --test app/tests/spatial-intelligence-map.test.js

# 2. Kiểm tra tính chính xác của địa chỉ và tọa độ các điểm nóng
node --test app/tests/spatial-location-ssot.test.js

# 3. Kiểm tra toàn bộ luồng tra cứu địa bàn và gửi phản ánh của công dân
node --test app/tests/citizen-real-world-audit.test.js
```
