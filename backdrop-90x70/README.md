# DustGuard VN — Backdrop Khổ Ngang 90x70cm (Bản Chuẩn HTML/CSS & Mapping Text)

Thư mục này chứa mã nguồn HTML, CSS và dữ liệu cấu hình text mapping hoàn chỉnh để hiển thị, chỉnh sửa nội dung và in ấn **Backdrop khổ ngang 90cm x 70cm (tỷ lệ 9:7)** cho dự án **DustGuard VN**.

---

## 📁 Cấu Trúc Thư Mục
```text
backdrop-90x70/
├── Dustguard_Backdrop_ngang_90x70.pdf  # File PDF gốc sao chép từ Downloads
├── index.html                          # Trang web chính (Backdrop 1800x1400px ~ 90x70cm)
├── style.css                           # CSS chuẩn in ấn 900mm x 700mm, High-Contrast
├── mapping-data.js                     # File cấu hình dữ liệu text SSOT của toàn bộ 11 khối
├── README.md                           # Tài liệu hướng dẫn sử dụng
└── assets/                             # Thư mục hình ảnh & logo độ nét cao
    ├── header-logos.png                # Dải logo các đơn vị đồng hành & bảo trợ
    ├── dustguard-shield-logo.webp      # Biểu tượng khiên đỏ DustGuard VN
    ├── hero-devices.png                # Mockup Laptop Dashboard & Điện thoại & Trạm IoT
    ├── iot-device.png                  # Hình ảnh trạm cảm biến phần cứng DustGuard
    ├── qr-code.png                     # Mã QR liên kết dự án
    └── footer-city.png                 # Tranh minh họa thành phố xanh bền vững
```

---

## 🚀 Cách Sử Dụng

### 1. Mở xem trực tiếp trên trình duyệt
- Bạn chỉ cần **Double click vào file `index.html`** trong File Explorer (hoặc click chuột phải chọn **Open with > Chrome / Edge**).
- Không cần cài đặt server phức tạp!

### 2. Hai cách sửa và mapping chữ:
1. **Cách 1 (Trực quan nhất)**: 
   - Bấm nút **`✏️ Sửa Chữ Trực Tiếp`** trên thanh công cụ màu đen phía trên.
   - Nhấp chuột trực tiếp vào bất kỳ dòng chữ nào trên backdrop để gõ sửa nội dung bị sai.
   - Bấm lại nút đó để lưu vào bộ nhớ máy (`localStorage`).
2. **Cách 2 (Cấu hình qua bảng Mapping hoặc File JS)**:
   - Bấm nút **`⚙️ Bảng Mapping Text`** ở góc phải để mở bảng nhập liệu nhanh.
   - Hoặc mở file [`mapping-data.js`](./mapping-data.js) bằng VS Code / Text Editor và sửa trực tiếp các chuỗi text trong đối tượng `DEFAULT_BACKDROP_DATA`.

### 3. Xuất file hoặc in ấn khổ 90x70cm:
- Bấm nút **`🖨️ In / Xuất PDF 90x70cm`** (hoặc phím tắt `Ctrl + P`):
  - Hộp thoại in của trình duyệt sẽ tự động nhận khổ giấy chuẩn **900mm x 700mm**.
  - Tự động ẩn toàn bộ thanh công cụ và bảng điều khiển.
  - Chọn **Save as PDF** để xuất ra file PDF chất lượng cao vector sắc nét 100% không bị vỡ font hay răng cưa.
  - Hoặc gửi trực tiếp file PDF này đến nhà in để in bạt/decal khổ 90cm x 70cm.

---

## 🎯 Danh Mục 11 Khối Nghiệp Vụ Trên Backdrop
1. **Khối 1: VẤN ĐỀ** (4 thực trạng bụi đô thị)
2. **Khối 2: GIẢI PHÁP** (Kết hợp IoT + AI + Cộng đồng)
3. **Khối 3: ĐỐI TƯỢNG LỢI ÍCH** (Cơ quan quản lý, Người dân, Trường học, Nhà thầu)
4. **Khối 4: QUY TRÌNH VẬN HÀNH** (5 bước tiếp nhận $\to$ xử lý $\to$ đối chứng)
5. **Khối 5: ĐIỂM ƯU TIÊN XỬ LÝ** (Đồng hồ Gauge 87 điểm rủi ro cao)
6. **Khối 6: THIẾT BỊ IOT ĐƠN GIẢN** (Phần cứng cảm biến PM2.5/PM10, 4G, nguồn bền bỉ)
7. **Khối 7: TÁC ĐỘNG DỰ KIẾN** (4 tác động tích cực định tính)
8. **Khối 8: SO SÁNH GIẢI PHÁP** (Bảng đối chiếu 6 tiêu chí với cách làm truyền thống)
9. **Khối 9: HIỆN TRẠNG & KẾ HOẠCH KẾT NỐI** (4 giai đoạn lộ trình pilot)
10. **Khối 10: BỀN VỮNG** (4 trụ cột thành phố xanh)
11. **Khối 11: LỘ TRÌNH** (Q4/2026, Q1/2027, Q2/2027)
