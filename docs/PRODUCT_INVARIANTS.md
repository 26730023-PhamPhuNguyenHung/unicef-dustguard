# Product Invariants (Bất Biến Sản Phẩm) — DustGuard VN

Các nguyên tắc và ràng buộc bất biến đã được chứng minh qua kiểm thử và runtime:

### INV-001 — D1 Single Source of Truth
Cloudflare D1 (`env.DB` / `dev.db`) là cơ sở dữ liệu chân thực duy nhất. Cấm sử dụng localStorage của trình duyệt làm kho lưu trữ chính cho các thực thể công dân, công trình, hồ sơ vụ việc hay chứng chỉ.

### INV-002 — Observation != Case Separation
Ghi nhận ban đầu của cộng đồng (`observations`) là nguồn tin phát hiện; Hồ sơ vụ việc (`cases`) là hồ sơ tác nghiệp 7 bước độc lập của cơ quan quản lý. Một Observation chỉ trở thành Case khi được thẩm định.

### INV-003 — IoT Sensor Optionality
Hệ thống tính điểm rủi ro môi trường hoạt động 100% chính xác ngay cả khi có 0 cảm biến vật lý tại công trường thông qua công thức chuẩn hóa trọng số:
$$R = \frac{\sum w_i \cdot S_i}{\sum w_i}$$

### INV-004 — High-Contrast Civic Light UI (No Glassmorphism)
Chỉ sử dụng bảng màu độ tương phản cao (`#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#9f241f` seal red). Tuyệt đối cấm hiệu ứng mờ nhòe `backdrop-blur-*`.

### INV-005 — Zero Truncate on Critical Civic Entities
Cấm dùng `truncate`, `line-clamp` làm ẩn mất tên công trình, mã số hồ sơ vụ việc, mã chứng chỉ và nhãn nút hành động.

### INV-006 — Youth Credit Equivalence
Quy tắc tính tín chỉ thanh niên: 20 giờ tình nguyện môi trường = 4.0 tín chỉ sinh viên. Chứng chỉ xuất ra phải có mã QR ISO/IEC 18004 kèm chữ ký số SHA-256 đối soát.

### INV-007 — Contractor Geofence Boundary
Minh chứng ảnh khắc phục do nhà thầu nộp chỉ được coi là hợp lệ khi tọa độ GPS cách tâm công trình $\le 50\text{m}$.
