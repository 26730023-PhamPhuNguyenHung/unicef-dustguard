# DUSTGUARD VN — CHÍNH SÁCH BẢO TOÀN TRUNG THỰC CLAIM (CLAIM INTEGRITY POLICY)

Tài liệu này xác lập các ranh giới bất biến (Invariants) về phát ngôn, nghiệp vụ, giao diện, dữ liệu và kiểm thử đối với toàn bộ nền tảng DustGuard VN.

---

## 1. NGUYÊN TẮC TỐI THƯỢNG
> **DustGuard chỉ claim những gì DustGuard trực tiếp kiểm soát và đã kiểm chứng bằng code/test.**
> DustGuard là nền tảng Công nghệ Công dân (CivicTech) hỗ trợ cộng đồng thanh niên và người dân ghi nhận dữ liệu môi trường, cấu trúc hóa bằng chứng, theo dõi tiến trình và bàn giao minh bạch. DustGuard **KHÔNG** tự phong thẩm quyền pháp lý, công nhận học thuật hay phê chuẩn của cơ quan nhà nước.

---

## 2. MA TRẬN PHÂN LOẠI CLAIM (CLASS A - D)

### CLASS A — DUSTGUARD CONTROLLED (Hệ thống kiểm soát trực tiếp)
- Ghi nhận phản ánh & giám sát hiện trường (Observations/Reports).
- Tiếp nhận dữ liệu viễn thám cảm biến (IoT Telemetry).
- Kiểm tra tính hợp lệ GPS & Geofence.
- Băm dữ liệu toàn vẹn SHA-256 & HMAC.
- Nhật ký kiểm toán bất biến (Audit Trail).
- Phân quyền người dùng (RBAC) & Cô lập nhà thầu (Tenant Isolation).
- Quản lý vòng đời hồ sơ (Case State Machine).
- Phát hiện cảm biến gián đoạn / lỗi tín hiệu phẳng (Flatline detection).
- Tính toán chỉ số ưu tiên rủi ro (Risk Score Indicator).
- Thông báo & điều phối quy trình thực địa (Field Operations).

**Quy tắc:** Được claim trực tiếp nếu implementation và test thực sự tồn tại.

---

### CLASS B — DUSTGUARD ASSISTED (Hỗ trợ bên thứ ba)
- Báo cáo hoạt động tình nguyện gửi Nhà trường / CLB xem xét.
- Hồ sơ hiện trường cung cấp cho cán bộ kiểm tra.
- Dữ liệu môi trường hỗ trợ cơ quan quản lý và cộng đồng.
- Báo cáo kết quả khắc phục gửi đơn vị liên quan.

**Quy tắc:** Bắt buộc dùng ngôn ngữ:
- *"Hỗ trợ"*
- *"Có thể được sử dụng để"*
- *"Xuất hồ sơ phục vụ xem xét"*
- *"Cung cấp bằng chứng cho"*
- *"Đề xuất"*
- *"Chờ đơn vị có thẩm quyền xác nhận"*

---

### CLASS C — REQUIRES EXTERNAL AUTHORITY (Cần thẩm quyền bên ngoài)
- Cấp tín chỉ học thuật hoặc tín chỉ ngoại khóa chính thức.
- Cấp điểm rèn luyện (ĐRL) chính quy của Nhà trường.
- Giấy chứng nhận pháp lý hoặc chứng chỉ công nhận cấp nhà nước.
- Chữ ký số công cộng được cấp bởi CA có giấy phép theo Luật Giao dịch điện tử.
- Quyết định xử phạt vi phạm hành chính hoặc đình chỉ thi công.

**Quy tắc:** DustGuard **TUYỆT ĐỐI KHÔNG** tự động phê duyệt hoặc cam kết các kết quả này. Trạng thái trong hệ thống luôn là `status = 'pending_external_review'` kèm disclaimer pháp lý.

---

### CLASS D — UNSUPPORTED / FABRICATED CLAIM (Nghiêm cấm & Loại bỏ)
- Giả lập con dấu mộc đỏ cơ quan nhà nước ("Sở Tài nguyên & Môi trường", "UBND").
- Giả định quan hệ đối tác hoặc phê chuẩn của chính phủ chưa được ký kết.
- Tự xưng là "Cơ sở dữ liệu quốc gia".
- Tuyên bố tuyệt đối vô căn cứ ("100% anonymous", "100% unhackable", "chính xác 100%").

**Quy tắc:** Xóa bỏ hoàn toàn (REMOVE) khỏi codebase, UI, demo data và tài liệu.

---

## 3. CÁC RANH GIỚI BẤT BIẾN THEO LĨNH VỰC

### 3.1. Ranh giới Học thuật (Academic Recognition Boundary)
- **Cấm:** Không hardcode tỷ lệ quy đổi tín chỉ (vd: `20h = 4.0 tín chỉ = 80 ĐRL`). Không hiển thị "Bạn đã nhận 4 tín chỉ".
- **Chuẩn hóa:**
  - `Verified Activity Hours` (Giờ hoạt động đã xác thực).
  - `Evidence Record` (Hồ sơ minh chứng thực địa).
  - `DustGuard Activity Record` (Báo cáo hoạt động DustGuard).
- **Disclaimer bắt buộc trên mọi bản in/hồ sơ thanh niên:**
  > *"Hồ sơ này ghi nhận dữ liệu hoạt động trong hệ thống DustGuard. Việc công nhận cho mục đích học thuật, hành chính hoặc tổ chức thuộc quyền quyết định của đơn vị tiếp nhận."*

---

### 3.2. Ranh giới Chữ ký số & Thể thức (Digital Signature & Layout Boundary)
- **Phân biệt:**
  - Mã HMAC-SHA256 là **Mã băm toàn vẹn dữ liệu (Integrity Hash / Verification Hash)**, không phải chữ ký số pháp lý theo Nghị định 30/2020/NĐ-CP hoặc Luật Giao dịch điện tử.
  - Template trang in A4 là **Quy cách trình bày tham chiếu thể thức văn bản hành chính**, không phải văn bản pháp lý ban hành chính thức.
- **Cấm:** Không vẽ con dấu đỏ đồ họa giả lập cơ quan nhà nước trên giao diện web hoặc tài liệu in nội bộ.

---

### 3.3. Ranh giới Cơ quan Nhà nước & Vai trò Thanh tra (Government & Inspector Boundary)
- **Vai trò:** `inspector` trong DustGuard là **Cán bộ kiểm tra / Người kiểm tra hiện trường (Field Inspector / Reviewer)** của hệ thống, không tự động đồng nghĩa với Thanh tra Nhà nước.
- **Thẩm quyền:** Hệ thống không ra quyết định xử phạt, đình chỉ công trình. Hệ thống chỉ lập biên bản ghi nhận hiện trường, hỗ trợ đối soát checklist và đề xuất xử lý.
- **Dữ liệu mẫu:** Mọi kịch bản thử nghiệm phải gắn nhãn rõ ràng: `Dữ liệu mô phỏng (Synthetic Scenario / Demo Data)`.

---

### 3.4. Ranh giới Quy chuẩn QCVN & Đánh giá Rủi ro (Compliance & Risk Score Boundary)
- **QCVN:** Đánh giá checklist là **Đánh giá quy tắc hệ thống tham chiếu QCVN**, không phải kết luận vi phạm pháp luật chính thức.
- **Risk Score:** Là **Chỉ số ưu tiên hỗ trợ ra quyết định**, không phải kết luận xử phạt. Bắt buộc có tooltip giải thích:
  > *"Risk Score tổng hợp tín hiệu từ dữ liệu DustGuard để hỗ trợ ưu tiên kiểm tra. Chỉ số không thay thế kết luận của cơ quan hoặc người có thẩm quyền."*

---

### 3.5. Ranh giới Cảm biến & Trí tuệ Nhân tạo (Sensor & AI Boundaries)
- **Cảm biến:** Thiết bị IoT là **Environmental sensing node (Thiết bị ghi nhận chỉ số hoạt động)** hỗ trợ phát hiện bất thường, không thay thế trạm quan trắc chuẩn quốc gia đã được kiểm định.
- **AI:** Đóng vai trò **Trợ lý hỗ trợ (Assistant)** giúp trích xuất, tóm tắt, xếp hạng ưu tiên và gợi ý văn bản; **luôn cần con người kiểm duyệt (Human-in-the-loop)**; không tự động đưa ra phán quyết.

---

### 3.7. Ranh giới Chi phí Hạ tầng & Vận hành Pilot (Infrastructure Cost & Scaling Boundary)
- **Tuyên ngôn chuẩn hóa (SSOT Claim):**
  > *"Chi phí hạ tầng pilot có thể gần bằng 0 trong hạn mức miễn phí hiện tại của Cloudflare (ghi nhận khả năng phát sinh tên miền, email, dung lượng mở rộng khi scale)."*
- **Quy tắc phát ngôn:**
  - Không tuyên bố tuyệt đối "Hệ thống miễn phí 100% vĩnh viễn" hay "Hoàn toàn $0 không tốn một đồng nào".
  - Luôn ghi nhận minh bạch 3 hạng mục phát sinh tài chính thực tế:
    1. **Tên miền tùy chỉnh (Custom Domain):** Phí duy trì tên miền `.vn`, `.org`, hoặc `.com` (~10–25 USD/năm).
    2. **Dịch vụ Email giao dịch (Transactional Email):** Chi phí gửi OTP/thông báo khi vượt hạn mức email miễn phí.
    3. **Dung lượng mở rộng khi scale:** Khi mở rộng toàn diện vượt quá Cloudflare Free Tier (R2 Storage > 10GB tính $0.015/GB/tháng, Workers Paid $5/tháng khi vượt 100k requests/ngày, D1 read/write overages).

---

### 3.8. Ranh giới Quyền riêng tư & Tối ưu Ảnh Hiện trường (Photo Privacy & Mobile Network Boundary)
- **Bảo vệ quyền riêng tư người chụp (EXIF Sanitization):**
  - Trước khi ảnh được gửi lên máy chủ hoặc lưu trữ R2, toàn bộ siêu dữ liệu nhạy cảm (EXIF APP1: tọa độ GPS cá nhân, số serial máy ảnh, hãng/model thiết bị) đều được tự động loại bỏ trên thiết bị người dùng.
  - Tọa độ GPS phục vụ phản ánh được người dùng chủ động cho phép lấy qua Web Geolocation hoặc chọn ghim trên bản đồ, không phụ thuộc vào siêu dữ liệu ẩn trong file ảnh.
- **Nén ảnh tối ưu mạng di động (< 300KB):**
  - Mọi ảnh chụp độ phân giải cao (12MP–48MP dung lượng 5MB–15MB) đều được nén thích ứng xuống **dưới 300KB** để đảm bảo thao tác gửi phản ánh mượt mà ngay cả khi kết nối mạng 3G/4G yếu ngoài thực địa.
- **Mã băm toàn vẹn (Tamper-Evident SHA-256):**
  - Tạo mã băm SHA-256 từ tệp ảnh đã làm sạch và nén để đối chứng chống chỉnh sửa nội dung mà không cần giữ lại thông tin đời tư của người chụp.

---

*Tài liệu này là SSOT bắt buộc tuân thủ đối với mọi tác vụ phát triển, kiểm thử và viết tài liệu trên codebase DustGuard VN.*
