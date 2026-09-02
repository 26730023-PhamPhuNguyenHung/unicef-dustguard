# PUB-02 — Tra Cứu Điểm Nóng Địa Bàn & Bản Đồ Công Trình (Citizen Map & Hotspot Lookup Hub)

---

## 1. Screen Identity

| Thuộc tính | Giá trị SSOT |
|---|---|
| **Mã màn hình** | `PUB-02` |
| **Tên tiếng Việt** | Tra Cứu Điểm Nóng Địa Bàn & Bản Đồ Công Trình |
| **Tên tiếng Anh** | Citizen Hotspot Map & Address-First Lookup Hub |
| **Route URL** | `/map` |
| **Component Path** | `app/src/modules/citizen/CitizenMap.jsx` |
| **Sub-components** | `app/src/components/map/SpatialMap.jsx` (`citizenPolicy`), `MapLegend.jsx`, `MapToolbar.jsx`, `MapStates.jsx` |
| **Layout** | Public Root Layout (`LandingNav.jsx` + `LandingFooter.jsx`) |
| **Quyền truy cập (Role)** | Public / Guest / Người dân / Tình nguyện viên (Không yêu cầu đăng nhập) |
| **Trạng thái Triển khai** | **ACTIVE** (Level 5 Production Coherent — Xác thực D1 SQLite & Leaflet WGS84) |

---

## 2. Mục Đích Nghiệp Vụ & Giá Trị Thực Tế

Trang **PUB-02** giải quyết bài toán cốt lõi của người dân đô thị tại Việt Nam (Hà Nội, TP.HCM, Bình Dương, Đà Nẵng...): **"Khu vực xung quanh tôi có công trình nào đang phát tán bụi vượt chuẩn, và làm thế nào để tôi chỉ đường tới cổng công trường hoặc gửi phản ánh ngay trong 30 giây?"**

Thay vì bắt người dùng phải chờ tải bản đồ GIS nặng nề với nhiều thao tác zoom/pan phức tạp trên mạng di động 4G/5G, DustGuard VN áp dụng triết lý **Address-First SSOT**:

1. **Tra cứu theo địa chỉ thực tế (Address-First Lookup)**:
   - Mặc định tải giao diện dạng Danh sách (Bảng dữ liệu trên Desktop / Thẻ Card trên Mobile) hiển thị rõ ràng số nhà, tên đường, tên Phường/Xã thực tế (ví dụ: Phường Dịch Vọng Hậu, Phường Mễ Trì, Phường Mỹ Đình 1, Phường Hoàng Liệt, Phường An Phú...).
   - Giúp người dân tìm thấy ngay công trình gần nhà trong dưới 3 giây qua ô tìm kiếm tức thì và bộ lọc nhanh theo Phường/Quận.
2. **Dẫn đường Google Maps 1-chạm (1-Click External Navigation)**:
   - Mỗi công trình đều có nút **[Google Maps]** mở trực tiếp ứng dụng bản đồ gốc của điện thoại (`https://www.google.com/maps/search/?api=1&query=...`), dẫn đường tới đúng cổng chính công trường mà không phụ thuộc vào hạ tầng map nội bộ.
   - Cơ chế fallback 3 cấp: Chuỗi địa chỉ thực $\rightarrow$ Tọa độ GPS WGS84 $\rightarrow$ Tọa độ trung tâm địa bàn.
3. **Kích hoạt phản ánh công dân 1-chạm (1-Click Civic Action)**:
   - Nút **[Phản ánh]** màu đỏ son (`#9f241f`) điều hướng thẳng tới `/citizen/report/new` với các trường `siteName` và `address` đã được tự động điền sẵn, rút ngắn thời gian gửi phản ánh hiện trường xuống chỉ còn 30 giây.
4. **Bản đồ không gian WGS84 tùy chọn (Optional Spatial GIS)**:
   - Nút gạt chuyển đổi tức thì sang chế độ **"Bản đồ GIS"** (Leaflet WGS84) để xem trực quan các cụm điểm nóng, bán kính ảnh hưởng Geofence $\le 50\text{m}$ và mạng lưới trạm quan trắc xung quanh.
5. **Đối chiếu Quy chuẩn Kỹ thuật Quốc gia QCVN 05:2023/BTNMT**:
   - Đối chiếu nồng độ bụi đo đạc với Quy chuẩn chất lượng không khí xung quanh:
     - **Ngưỡng an toàn 24 giờ**: $\text{PM2.5} \le 50\,\mu\text{g/m}^3$, $\text{PM10} \le 100\,\mu\text{g/m}^3$.
     - **Ngưỡng cảnh báo vượt chuẩn**: $\text{PM2.5} > 50\,\mu\text{g/m}^3$ (Đỏ/Cam) hoặc $\text{PM10} > 100\,\mu\text{g/m}^3$.
   - Tính toán Điểm rủi ro bụi $R \in [0, 100]$ dựa trên 4 yếu tố trọng số: nồng độ bụi ($w_1$), cự ly trường học/bệnh viện $\le 200\text{m}$ ($w_2$), tần suất phản ánh ($w_3$), và lịch sử khắc phục của nhà thầu ($w_4$).

### So sánh cách làm cũ và DustGuard VN:

| Tiêu chí | Cổng thông tin truyền thống (Cũ) | DustGuard VN (Mới & Thực tế) |
|---|---|---|
| **Cách tiếp cận** | Bắt buộc tải bản đồ GIS đồ sộ, dễ giật lag trên mobile | Ưu tiên danh sách địa chỉ rõ ràng (Address-First), tải tức thì < 0.5s |
| **Độ chi tiết địa bàn** | Chỉ hiện chung chung cấp Quận/Huyện | Chi tiết đến từng Phường (Dịch Vọng Hậu, Mễ Trì, Hoàng Liệt...), số nhà, cổng công trường |
| **Dẫn đường hiện trường** | Không có dẫn đường, người dân phải tự gõ lại | 1-chạm mở thẳng Google Maps chỉ đường tới cổng chính |
| **Gửi phản ánh** | Form dài dòng, phải tự gõ lại tên và địa chỉ công trình | 1-chạm [Phản ánh], tự động điền sẵn tên công trình và địa chỉ, xong trong 30s |
| **Chuẩn đối chiếu** | Không giải thích chỉ số kỹ thuật | Gắn nhãn chuẩn QCVN 05:2023/BTNMT rõ ràng: *Vượt chuẩn* hay *Trong giới hạn* |

---

## 3. Luồng Hành Trình Người Dùng (User Journey)

```text
[Người dân / Tình nguyện viên mở /map]
                  │
                  ▼
    [1. Quét nhanh 4 thẻ KPI Tổng quan]
  (Tổng công trình | Nguy cơ ≥70đ | Cần theo dõi 40-69đ | Trạm trực tuyến)
                  │
                  ▼
   [2. Tìm kiếm theo tên đường / Lọc theo Phường / Lọc Mức rủi ro]
  (Ví dụ: Chọn Phường Dịch Vọng Hậu hoặc gõ "Trần Thái Tông")
                  │
                  ▼
      [3. Đọc thông số chi tiết công trình & Đối chiếu QCVN 05:2023]
  (Điểm rủi ro R/100, PM2.5: 84.5 µg/m³ - VƯỢT CHUẨN, Tên nhà thầu)
                  │
        ┌─────────┴──────────────────────────────┐
        ▼                                        ▼
[HÀNH ĐỘNG A: DẪN ĐƯỜNG]               [HÀNH ĐỘNG B: PHẢN ÁNH]
Bấm [Google Maps]                       Bấm [Phản ánh] (Nút Đỏ Son)
        │                                        │
        ▼                                        ▼
Mở ứng dụng Google Maps                 Chuyển sang /citizen/report/new
Dẫn đường tới cổng công trường          Form điền sẵn siteName & address
                                        Chụp ảnh hiện trường & gửi trong 30s
```

### Các bước thao tác chi tiết:
1. **Bước 1 — Tiếp cận trang**: Người dùng bấm liên kết **[Bản đồ]** trên thanh Header hoặc nút **[Xem bản đồ rủi ro]** từ Trang chủ.
2. **Bước 2 — Quét nhanh thông tin KPI (Scan trong 3 giây)**:
   - Tổng số công trình đang theo dõi trên địa bàn (ví dụ: 33 công trình).
   - Số lượng công trình nguy cơ cao ($\ge 70$ điểm, huy hiệu đỏ) cần kiểm tra khẩn cấp.
   - Số lượng công trình cần theo dõi ($40 - 69$ điểm, huy hiệu vàng).
   - Số lượng trạm quan trắc IoT đang trực tuyến truyền số liệu thời gian thực.
3. **Bước 3 — Lọc và Tra cứu địa bàn**:
   - Nhập từ khóa tên đường, tên dự án vào ô tìm kiếm (ví dụ: "Trần Thái Tông", "Vành đai 3", "Mễ Trì").
   - Chọn Phường cụ thể từ dropdown (ví dụ: "Phường Dịch Vọng Hậu", "Phường Mễ Trì", "Phường Mỹ Đình 1", "Phường Hoàng Liệt", "Phường An Phú").
   - Bấm vào thẻ KPI đỏ hoặc vàng để lọc nhanh các điểm nóng tương ứng.
4. **Bước 4 — Xem chi tiết & Đối chiếu quy chuẩn**:
   - Đọc nồng độ $\text{PM2.5}$ ($\mu\text{g/m}^3$) và nhãn cảnh báo (*"Vượt chuẩn QCVN"* hoặc *"Trong giới hạn"*).
   - Đọc tên đơn vị thi công (Nhà thầu) và điểm rủi ro $R/100$.
5. **Bước 5 — Chọn hành động tiếp theo**:
   - Bấm **[Google Maps]**: Mở Google Maps để điều hướng đường đi hoặc xem ảnh vệ tinh công trình.
   - Bấm **[Phản ánh]**: Chuyển ngay sang form gửi hình ảnh hiện trường có tọa độ GPS.
6. **Bước 6 (Tùy chọn) — Chuyển sang Bản đồ không gian GIS**:
   - Bấm nút **[Bản đồ GIS]** trên góc phải Header để hiển thị lớp bản đồ tương tác Leaflet WGS84 toàn cảnh.

---

## 4. Bố Cục Trực Quan & Wireframe ASCII (Information Hierarchy)

### 4.1. Bố cục Tổng quan & Chế độ Danh sách (Desktop $\ge 768\text{px}$)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Icon La Bàn] Tra Cứu Tình Hình & Điểm Nóng Địa Bàn      [Danh sách|Bản đồ] [↻]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ KPI SUMMARY BAR (4 Thẻ tương tác 1-chạm để lọc):                                       │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌───────────────────────────┐  │
│ │ Tổng điểm: 33  │ │ Nguy cơ: 6     │ │ Cần theo dõi: 8│ │ Trạm đo trực tuyến: 4/4   │  │
│ │ Công trình     │ │ (≥ 70đ - Đỏ)   │ │ (40-69đ - Vàng)│ │ (Thời gian thực)          │  │
│ └────────────────┘ └────────────────┘ └────────────────┘ └───────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ FILTER BAR:                                                                            │
│ [🔍 Tìm theo địa chỉ, tên đường, tên dự án...     ] [Tất cả Phường/Xã ▼] [Mức rủi ro ▼]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ BẢNG DANH SÁCH CÔNG TRÌNH & ĐIỂM NÓNG (Address-First Table):                           │
│ ┌───────┬───────────────────────────────────┬──────────────┬────────────┬─────────────┬─────────────────────────┐ │
│ │ Mã    │ Tên công trình & Địa chỉ          │ Địa bàn      │ Mức rủi ro │ Nồng độ bụi │ Thao tác 1-chạm         │ │
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

### 4.2. Bố cục Thẻ Card trên Mobile ($< 768\text{px}$)

```text
┌──────────────────────────────────────────┐
│ [La Bàn] Tra Cứu Điểm Nóng Địa Bàn   [↻] │
│ [ Danh sách (Active) ] [ Bản đồ GIS ]    │
├──────────────────────────────────────────┤
│ ┌──────────────────┐ ┌─────────────────┐ │
│ │ Tổng: 33         │ │ Nguy cơ: 6 (Đỏ) │ │
│ └──────────────────┘ └─────────────────┘ │
│ ┌──────────────────┐ ┌─────────────────┐ │
│ │ Theo dõi: 8 (Vàng│ │ Trạm đo: 4/4    │ │
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

## 5. Hợp Đồng Dữ Liệu & API / D1 Database Contract

### 5.1. API Endpoints
- **URL**: `GET /map` (hoặc `GET /api/v1/public/sites`)
- **Phân quyền**: Public (Không yêu cầu Authentication Bearer Token)
- **Tần suất gọi**: Tải lần đầu khi render trang và tải lại khi bấm nút `[Làm mới]`.

### 5.2. Cấu trúc Response JSON Chuẩn Hóa (SSOT Contract):
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
      },
      {
        "id": "site_hn_03",
        "code": "BD-03",
        "name": "Chung cư cao tầng Mỹ Đình Plaza 3",
        "address": "18 Lê Đức Thọ, Phường Mỹ Đình 1, Quận Nam Từ Liêm, Hà Nội",
        "ward": "Mỹ Đình 1",
        "district": "Nam Từ Liêm",
        "city": "Hà Nội",
        "lat": 21.0285,
        "lng": 105.7702,
        "dustRiskScore": 74,
        "pm25": 81.0,
        "pm10": 155.0,
        "complaintsCount": 4,
        "contractorName": "Công ty CP Xây lắp Điện 1 (PCC1)",
        "status": "ACTIVE"
      },
      {
        "id": "site_hn_04",
        "code": "BD-04",
        "name": "Dự án KĐT Tây Nam Linh Đàm CT4",
        "address": "Bán đảo Linh Đàm, Phường Hoàng Liệt, Quận Hoàng Mai, Hà Nội",
        "ward": "Hoàng Liệt",
        "district": "Hoàng Mai",
        "city": "Hà Nội",
        "lat": 20.9688,
        "lng": 105.8285,
        "dustRiskScore": 48,
        "pm25": 42.0,
        "pm10": 88.0,
        "complaintsCount": 1,
        "contractorName": "Công ty TNHH Đầu tư Xây dựng HUD",
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
      },
      {
        "id": "sen_02",
        "code": "SEN-HN-02",
        "name": "Trạm Vành Đai 3 - Phạm Hùng",
        "lat": 21.0169,
        "lng": 105.7835,
        "pm25": 46.2,
        "status": "ONLINE"
      }
    ]
  }
}
```

### 5.3. Ánh xạ Bảng Cơ sở dữ liệu D1 SQLite (Schema SSOT):
- **Bảng `sites`**:
  - `id` (TEXT PRIMARY KEY) — Mã định danh duy nhất (UUID/CUID).
  - `code` (TEXT) — Mã hiệu quản lý (ví dụ: `BD-01`, `BD-02`).
  - `name` (TEXT) — Tên công trình / dự án đầy đủ.
  - `address` (TEXT) — Địa chỉ chi tiết số nhà, tên đường.
  - `ward` (TEXT) — Tên Phường/Xã trực thuộc.
  - `district` (TEXT) — Tên Quận/Huyện/Thị xã.
  - `lat` (REAL), `lng` (REAL) — Tọa độ không gian WGS84.
  - `dust_risk_score` (INTEGER) — Điểm rủi ro bụi tổng hợp ($0 - 100$).
  - `contractor_name` (TEXT) — Tên đơn vị nhà thầu thi công.
  - `status` (TEXT) — Trạng thái công trình (`ACTIVE`, `COMPLETED`, `PAUSED`).
- **Bảng `sensors`**:
  - `id`, `code`, `name`, `site_id`, `lat`, `lng`, `status`, `last_pm25`, `last_reading_at`.

### 5.4. Chuẩn hóa & Phòng vệ Dữ liệu (Normalization & Defensive Fallbacks):
- **Bảo toàn danh sách**: Nếu backend trả về `{ data: { sites } }` hoặc array trực tiếp, hàm `loadData` tự động unwrap và chuẩn hóa về mảng `[]` an toàn.
- **Nội suy rủi ro khi thiếu dữ liệu**:
  - Nếu `dustRiskScore` vắng mặt: Mặc định gán `score = 45`.
  - Nếu `pm25` vắng mặt: Tự động nội suy theo mức rủi ro ($R \ge 70 \rightarrow 82\,\mu\text{g/m}^3$; $R \ge 40 \rightarrow 52\,\mu\text{g/m}^3$; $R < 40 \rightarrow 28\,\mu\text{g/m}^3$).
  - Nếu `pm10` vắng mặt: Tự động nội suy ($R \ge 70 \rightarrow 165\,\mu\text{g/m}^3$; $R \ge 40 \rightarrow 105\,\mu\text{g/m}^3$; $R < 40 \rightarrow 55\,\mu\text{g/m}^3$).

---

## 6. Bảng Danh Mục Hành Động & Nút Bấm (CTAs & Action Matrix)

| Tên nút / Thao tác | Vị trí | Màu sắc / Token | Kích thước Touch Target | Điều kiện kích hoạt | Hành vi hệ thống | Phản hồi giao diện |
|---|---|---|:---:|---|---|---|
| **[Google Maps]** | Cột thao tác (Bảng) / Thẻ Mobile | Nền kem `#FDFBF7`, viền xám `border-ink-900/10`, icon đỏ | $\ge 38\text{px}$ (Desktop)<br>$\ge 44\text{px}$ (Mobile) | Luôn khả dụng | Mở tab mới với URL Google Maps Search | Mở trực tiếp app Google Maps trên điện thoại để dẫn đường |
| **[Phản ánh]** | Cột thao tác (Bảng) / Thẻ Mobile | Nền đỏ son `#9f241f`, chữ trắng, icon Camera | $\ge 38\text{px}$ (Desktop)<br>$\ge 44\text{px}$ (Mobile) | Luôn khả dụng | Điều hướng sang `/citizen/report/new?siteName=...&address=...` | Chuyển trang tức thì với form đã điền sẵn địa chỉ |
| **[Danh sách] / [Bản đồ GIS]** | Header góc trên bên phải | Segmented control, nền kem, nút active nền trắng | $\ge 40\text{px}$ | Luôn khả dụng | Chuyển đổi trạng thái `viewMode` giữa `'list'` và `'map'` | Hoán đổi ngay lập tức giữa Table/Cards và Bản đồ Leaflet |
| **[Làm mới] (↻)** | Header góc trên bên phải | Nền trắng, viền nhạt, icon xoay | $\ge 40\text{px}$ | Đang không tải dữ liệu | Gọi lại hàm `loadData(true)` tải lại D1 | Icon xoay tròn 360°, cập nhật các số đo mới nhất |
| **Thẻ KPI (Nguy cơ / Theo dõi)** | Thanh KPI đầu trang | Nền trắng, viền phân màu (đỏ/vàng), cursor pointer | $\ge 48\text{px}$ | Luôn khả dụng | Kích hoạt bộ lọc `riskFilter = 'CRITICAL'` hoặc `'WARNING'` | Bảng danh sách tự động lọc còn các công trình nguy cơ |
| **Ô tìm kiếm tức thì** | Thanh Filter Bar | Nền trắng, viền xám, icon Search | $\ge 44\text{px}$ | Nhập ký tự | Lọc realtime theo tên, địa chỉ, tên đường, mã công trình | Danh sách co gọn theo từ khóa gõ vào |
| **Dropdown Phường/Xã** | Thanh Filter Bar | Nền trắng, viền xám | $\ge 44\text{px}$ | Chọn 1 phường | Lọc các công trình thuộc đúng địa bàn Phường | Hiển thị chính xác các công trình trên địa bàn đã chọn |

---

## 7. Quy Chuẩn Thích Ứng Giao Diện (Responsive & Design System)

### 7.1. Bảng màu & Design Tokens (High-Contrast Civic Tech)
- **Nền trang chính**: Màu kem sáng `#FDFBF7` (`bg-cream-50`), dịu mắt, chống chói ngoài trời nắng.
- **Màu chữ văn bản**: Mực in đậm `#231b14` (`text-ink-900`), tương phản tối đa đạt chuẩn WCAG AAA.
- **Màu nhấn cảnh báo nguy cơ**: Đỏ son `#9f241f` (`text-seal-600`, `bg-seal-50`, `border-seal-300`).
- **Màu nhấn theo dõi**: Vàng hổ phách `#d97706` (`text-amber-800`, `bg-amber-50`, `border-amber-300`).
- **Màu an toàn / Hành động phụ**: Xanh teal mòng két `#0d6f64` (`text-teal-700`, `bg-teal-50`).
- **Quy tắc bất biến**: **TUYỆT ĐỐI KHÔNG DÙNG GLASSMORPHISM**, cấm `backdrop-blur-*`. Nền sáng thì chữ phải đậm rõ nét.

### 7.2. Nguyên tắc Zero Truncate trên tên công trình và địa chỉ (UI Text SSOT)
- Tuyệt đối không dùng `truncate`, `line-clamp`, `overflow-hidden` làm mất tên công trình (ví dụ: *"Tòa nhà hỗn hợp Grand Park"*), tên nhà thầu hay số nhà tên đường.
- Khi màn hình nhỏ, văn bản tự động xuống dòng mượt mà (`break-words`), bảo đảm công dân đọc trọn vẹn thông tin địa chỉ trước khi bấm dẫn đường.

### 7.3. Tương thích Viewport Đa Màn hình:
- **Mobile (360px – 430px)**:
  - Tự động chuyển sang chế độ Thẻ Card (`block md:hidden`).
  - Thanh KPI bố trí lưới 2 cột $\times$ 2 hàng tiện chạm.
  - Cụm 2 nút **[Google Maps]** và **[Phản ánh]** dàn đều 2 nửa bằng nhau với chiều cao chuẩn $\ge 44\text{px}$.
- **Laptop 14-inch (1366x768 & 1440x900)**:
  - Bảng dữ liệu 6 cột hiển thị thoáng đãng, lề trang chuẩn `px-6`.
  - Không bị tràn ngang màn hình, không xuất hiện thanh cuộn ngang vô lý.
- **Desktop (1920x1080)**:
  - Giới hạn độ rộng tối đa trong khung `max-w-7xl` căn giữa sang trọng.

---

## 8. Kịch Bản Ngoại Lệ & Xử Lý Lỗi Biên (Edge Cases & Fallbacks)

### 8.1. Các tình huống ngoại lệ và cách xử lý:
1. **Không tìm thấy kết quả theo bộ lọc**:
   - *Biểu hiện*: Người dùng gõ tên đường hoặc chọn Phường không có công trình nào.
   - *Xử lý*: Hiển thị Empty State rõ ràng: *"Không tìm thấy công trình nào phù hợp với bộ lọc"* kèm nút bấm **[Xóa tất cả bộ lọc]** đưa danh sách về mặc định.
2. **Mất kết nối mạng / API D1 gián đoạn**:
   - *Biểu hiện*: Request `/map` bị timeout hoặc trả về mã lỗi 500.
   - *Xử lý*: Khối `try/catch` bọc an toàn, ứng dụng tự phục hồi với danh sách công trình mẫu đã chuẩn hóa, không hiển thị màn hình trắng (White Screen of Death).
3. **Thiết bị không hỗ trợ định vị GPS**:
   - *Biểu hiện*: Người dùng mở bản đồ nhưng trình duyệt chặn quyền Geolocation.
   - *Xử lý*: Hệ thống tự động căn giữa bản đồ theo tọa độ trung tâm địa bàn mặc định (Hà Nội: `[21.0285, 105.8542]` hoặc TP.HCM: `[10.8231, 106.6297]`) và hiển thị thông báo hướng dẫn.
4. **Tọa độ công trình bị thiếu trong dữ liệu**:
   - *Biểu hiện*: Trường `lat`, `lng` mang giá trị `null` hoặc `undefined`.
   - *Xử lý*: Nút **[Google Maps]** tự động fallback mở tìm kiếm theo chuỗi địa chỉ văn bản `site.address`.

### 8.2. Lệnh kiểm thử tự động (PowerShell CLI):
```powershell
# 1. Kiểm thử phân hệ bản đồ và adapter không gian WGS84
node --test app/tests/spatial-intelligence-map.test.js

# 2. Kiểm thử hợp đồng tọa độ và định vị địa bàn SSOT
node --test app/tests/spatial-location-ssot.test.js

# 3. Kiểm thử luồng tra cứu thực địa và phản ánh của công dân
node --test app/tests/citizen-real-world-audit.test.js
```
