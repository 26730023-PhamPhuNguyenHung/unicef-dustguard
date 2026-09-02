# KIẾN TRÚC HỆ THỐNG DUSTGUARD VN — ĐƠN GIẢN, DỄ HIỂU & DỄ DÙNG

> **Mục tiêu**: Giải thích toàn bộ cách vận hành của hệ thống bằng ngôn ngữ đời thường, thực tế, không dùng thuật ngữ kỹ thuật phức tạp, ai đọc cũng hiểu ngay và làm theo được.

---

## 💡 1. DustGuard VN Giải Quyết Việc Gì Ngoài Đời Thực?

Trước đây, khi người dân thấy công trình xây dựng bụi mù mịt, xe tải chở đất cát rơi vãi ra đường:
- Phản ánh lên các nhóm mạng xã hội hoặc gọi điện thì **thường bị trôi tin, không biết ai xử lý và kết quả ra sao**.
- Cán bộ phường/quận thì **không đủ người đi tuần tra khắp nơi 24/7**.
- Nhà thầu thi công thì **chỉ khi bị phạt mới chịu dọn dẹp**.

**DustGuard VN kết nối 4 nhóm người vào 1 quy trình xử lý khép kín, minh bạch từ đầu đến cuối**:

```
[1. NGƯỜI DÂN]           [2. SINH VIÊN TÌNH NGUYỆN]         [3. CÁN BỘ PHƯỜNG/QUẬN]          [4. NHÀ THẦU CÔNG TRÌNH]
Thấy bụi chụp ảnh  ───►  Đến tận nơi kiểm tra       ───►    Giao việc qua Zalo/SMS    ───►   Phun nước, che bạt dập bụi
(Mất đúng 30 giây)       (Tích điểm rèn luyện)              (Đôn đốc xử lý trong 24h)        (Chụp ảnh Sau đối chứng)
```

---

## 🔄 2. Bốn Bước Vận Hành Thực Tế (Quy Trình 4 Bước)

### Bước 1: Người dân chụp ảnh gửi phản ánh (Mất đúng 30 giây)
- Người đi đường hoặc người dân sống cạnh công trình thấy bụi, xe ben rơi đất cát.
- Mở điện thoại lên, bấm **[Gửi phản ánh]** $\rightarrow$ Chụp 1 bức ảnh $\rightarrow$ Chọn địa chỉ $\rightarrow$ Bấm **[Gửi ngay]**.
- **Không cần đăng ký tài khoản rườm rà**. Nếu đang đi ngoài đường mất sóng 4G, điện thoại tự lưu lại và gửi khi có mạng.

### Bước 2: Sinh viên tình nguyện đến kiểm tra lại
- Các bạn sinh viên trong CLB Môi trường (ĐH Bách Khoa, ĐH Xây dựng, ĐHQG...) mở ứng dụng thấy phản ánh gần trường mình.
- Đến tận nơi xem có đúng bụi thật không, chụp lại bức ảnh rõ nét và tích vào bảng kiểm tra đơn giản:
  - *Có che bạt không? Có vòi phun nước không? Có cầu rửa lốp xe không?*
- Sinh viên được **cộng giờ tình nguyện (20 tiếng = 4 tín chỉ ngoại khóa hoặc điểm rèn luyện)** và được cấp giấy chứng nhận có mã QR.

### Bước 3: Cán bộ mở màn hình, giao việc ngay cho nhà thầu
- Cán bộ phụ trách mở máy tính/điện thoại, thấy ngay danh sách các điểm bụi cần xử lý trong ngày.
- Bấm gửi thông báo qua Zalo/SMS cho Chỉ huy trưởng công trình: *"Có bụi tại cổng số 2, yêu cầu tưới nước và che chắn ngay trong 24 giờ!"*.
- Chỉ huy trưởng bấm vào đường link trong tin nhắn, mở xem được ngay ảnh vi phạm mà **không cần nhớ mật khẩu đăng nhập**.

### Bước 4: Nhà thầu dập bụi xong, chụp ảnh nộp lại để nghiệm thu
- Nhà thầu cho công nhân tưới nước rửa đường, kéo bạt che bãi cát, bật máy rửa xe ben.
- Lấy điện thoại chụp lại bức ảnh công trường đã sạch sẽ gửi lên hệ thống.
- Cán bộ và người dân nhìn thấy **2 bức ảnh Trước vs Sau đặt cạnh nhau**. Thấy sạch thật thì bấm **[Hoàn tất]**.
- Người dân ban đầu gửi phản ánh sẽ nhận được thông báo: *"Công trình đã khắc phục xong kèm ảnh nghiệm thu"*.

---

## 🧩 3. Hệ Thống Kỹ Thuật Gồm Những Gì? (Rất Gọn Nhẹ)

Hệ thống được thiết kế theo nguyên tắc **tối giản, ổn định, không phức tạp hóa**:

```
+-----------------------------------------------------------------------------------+
| 1. GIAO DIỆN NGƯỜI DÙNG (Giao diện Web chạy mượt trên Điện thoại & Máy tính)      |
|    - Màu sắc sáng sủa, chữ to rõ ràng, nút bấm to dễ bấm.                         |
|    - Tuyệt đối không dùng hiệu ứng kính mờ loá mắt ngoài trời nắng.               |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼ (Gửi & Nhận dữ liệu)
+-----------------------------------------------------------------------------------+
| 2. MÁY CHỦ XỬ LÝ (Backend)                                                        |
|    - Nhận ảnh, nén ảnh nhẹ dưới 300KB để gửi siêu nhanh.                          |
|    - Tự động gán mã hồ sơ (Ví dụ: DG-HN-2026-0842).                               |
|    - Tính toán giờ tình nguyện cho sinh viên và gửi tin nhắn đôn đốc nhà thầu.    |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼ (Lưu trữ chắc chắn)
+-----------------------------------------------------------------------------------+
| 3. SỔ CÁI ĐIỆN TỬ (Cơ sở dữ liệu SQLite)                                          |
|    - Giống như một cuốn sổ lưu trữ an toàn mọi hồ sơ, biên bản và ảnh hiện trường.|
|    - Không bao giờ bị mất dữ liệu, ai làm gì vào giờ nào đều được ghi lại.        |
+-----------------------------------------------------------------------------------+
                                         ▲
                                         │ (Bổ sung thêm nếu có)
+-----------------------------------------------------------------------------------+
| 4. TRẠM ĐO CẢM BIẾN TỰ RÁP (Khoảng 500.000đ / trạm)                               |
|    - Ráp từ linh kiện thông dụng ở chợ điện tử (ESP32, cảm biến bụi laser).       |
|    - Lắp ở cổng công trình để đo bụi tự động 24/7.                                |
|    - NẾU KHÔNG CÓ CẢM BIẾN THÌ HỆ THỐNG VẪN CHẠY TỐT 100% nhờ ảnh người dân gửi. |
+-----------------------------------------------------------------------------------+
```

---

## 👥 4. Năm Nhóm Người Dùng & Quyền Hạn Thực Tế

| Nhóm người dùng | Họ là ai? | Họ dùng hệ thống để làm gì? |
|---|---|---|
| **1. Người dân** | Người đi đường, cư dân quanh công trình | Chụp ảnh gửi phản ánh trong 30 giây; theo dõi tiến độ đến khi sạch bụi. |
| **2. Sinh viên tình nguyện** | CLB Môi trường, Đoàn Thanh niên các trường ĐH | Đến hiện trường kiểm tra, chụp ảnh bổ sung; tích lũy 20h tình nguyện = 4.0 tín chỉ/ĐRL. |
| **3. Cán bộ thanh tra** | Cán bộ trật tự xây dựng, địa chính phường/quận | Nhìn thấy việc ưu tiên trong ngày; giao việc cho nhà thầu; in biên bản A4 kiểm tra. |
| **4. Nhà thầu công trình** | Chỉ huy trưởng, cán bộ an toàn công trường | Nhận tin nhắn Zalo/SMS; xem ảnh vi phạm; dập bụi rồi chụp ảnh Sau nộp lại để không bị phạt. |
| **5. Lãnh đạo quận/sở** | Lãnh đạo UBND Quận, Sở Tài nguyên Môi trường | Xem báo cáo tổng kết toàn địa bàn; ký duyệt xử phạt nếu nhà thầu chây ì. |

---

## 🛡️ 5. Bốn Nguyên Tắc "Bất Di Bất Dịch" Giúp Hệ Thống Dễ Dùng

1. **Chữ to, nút to, giao diện sáng rõ**:
   - Dùng nền sáng, chữ đen đậm, nút bấm màu đỏ son hoặc xanh lá đậm.
   - Đi ngoài trời nắng chói chang vẫn nhìn rõ và bấm được ngay cả khi đeo găng tay.
2. **Không giấu thông tin quan trọng**:
   - Tên công trình, địa chỉ nhà, mã hồ sơ luôn hiển thị đầy đủ, không bị cắt bớt chữ `...`.
3. **Ảnh thật Trước & Sau là thước đo duy nhất**:
   - Không đánh giá bằng lời nói suông. Muốn đóng hồ sơ thì phải có 2 bức ảnh: **Lúc phát hiện bụi (Trước)** và **Lúc đã dọn sạch (Sau)**.
4. **Không mạng vẫn dùng được**:
   - Khi ra hiện trường mất sóng 4G, điện thoại tự lưu nháp lại. Khi có sóng hoặc về nhà có Wifi thì bấm gửi một chạm.
