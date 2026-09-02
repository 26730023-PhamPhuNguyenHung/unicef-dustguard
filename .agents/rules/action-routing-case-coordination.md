# ACTION-ROUTING-CASE-COORDINATION.md — Tư Duy Sản Phẩm Mới (Loại Bỏ Risk-Score-Centric)

## 1. Định Vị & Triết Lý Sản Phẩm Tối Thượng
DustGuard VN **KHÔNG PHẢI** là một dashboard AI chấm điểm bụi (`Dust Risk Score`).
DustGuard VN **LÀ HỆ THỐNG ĐIỀU PHỐI VỤ VIỆC & LỘ TRÌNH TÁC NGHIỆP THỰC TẾ (Case Coordination & Action Routing Platform)**.

> **Slogan SSOT**:
> **"Phát hiện vấn đề. Chuyển đúng người. Theo dõi đến kết quả."**
> *(Không phải mọi phản ánh đều cần cùng một cách xử lý. DustGuard giúp hiểu từng trường hợp, phân luồng đúng người và theo dõi tái kiểm đến khi có kết quả thực địa).*

---

## 2. Core Product Loop 7 Bước (SSOT)

```text
SIGNAL (Phát hiện)
      ↓
UNDERSTAND (Hiểu tình huống & lý do)
      ↓
ROUTE (Phân luồng đúng việc)
      ↓
ACTION (Làm việc cụ thể)
      ↓
FOLLOW-UP (Theo dõi xuyên suốt)
      ↓
VERIFY (Tái kiểm thực địa — Đạt / Chưa đạt)
      ↓
OUTCOME (Kết quả & Đóng hồ sơ)
```

---

## 3. Quy Tắc Trình Bày UI Mọi Màn Hình (5 Câu Hỏi Sống Còn)

Mỗi màn hình phải trả lời ngay trong 3-5 giây đầu:
1. **Chuyện gì đang xảy ra?** (Loại vấn đề: Bụi phát tán, Đường bẩn, Xe chở vật liệu, Thiếu che chắn, Không hố rửa xe...).
2. **Thông tin đã đủ chưa?** (Đủ / Thiếu ảnh / Thiếu GPS / Cần khảo sát đối chứng).
3. **Vì sao cần chú ý?** (Lý do cụ thể: 4 phản ánh trong 24h, Gần trường học < 300m, PM2.5 tăng mạnh, Đã từng vi phạm).
4. **Ai nên xử lý và việc tiếp theo là gì?** (Hành động cụ thể: *Kiểm tra che chắn*, *Phun sương rửa đường*, *Nộp ảnh đối chứng*).
5. **Đã được tái kiểm thực tế chưa?** (Chờ tái kiểm $\rightarrow$ Đạt: Đóng case / Chưa đạt: Mở lại).

---

## 4. Bỏ "Risk Score" Khỏi Trung Tâm
- **CẤM** đặt `Dust Risk Score 92/100` làm Hero KPI hoặc tiêu đề to nhất màn hình.
- **CẤM** dùng score để ngầm kết luận vi phạm thay cho biên bản/quy chuẩn thực tế.
- Risk Score chỉ là một tín hiệu phụ nội bộ trong bước `UNDERSTAND` để hỗ trợ sắp xếp danh sách.
- Khi hiển thị ra UI: Thay `Risk 92 CRITICAL` $\rightarrow$ **`Cần ưu tiên`** đi kèm danh sách lý do cụ thể (Bullet points con người hiểu được).

---

## 5. Chuẩn Hóa 4 Màn Hình Trọng Tâm

### A. Staff Dashboard (`/staff`)
- **KPIs Vận hành**: `Việc cần làm hôm nay` · `Chờ tái kiểm` · `Thiếu thông tin` · `Quá hạn` · `Đã hoàn tất`.
- **Thẻ việc làm ngay**:
  - Mã vụ việc + Hành động cụ thể (VD: *Kiểm tra che chắn phía Đông*) + Địa điểm + Deadline (*Hạn 16:00 hôm nay*).

### B. Case Detail (`/staff/cases/:id`, `/citizen/reports/:id`)
- Vấn đề: `Bụi phát tán từ công trường Vành Đai 3`
- Trạng thái: `Cần kiểm tra hiện trường`
- **Vì sao cần chú ý?**
  - • 4 phản ánh của người dân trong 24h
  - • Vị trí gần trường tiểu học (< 250m)
  - • Nồng độ PM2.5 trạm đo gần nhất tăng vọt
- **Việc tiếp theo**: `Kiểm tra biện pháp che chắn và hố rửa xe` (Phụ trách: Cán bộ Đội 1 · Hạn 16:00).
- **Quy trình Tái kiểm**: Nộp ảnh After $\rightarrow$ Cán bộ/Cộng đồng tái kiểm $\rightarrow$ Đạt mới đóng case.

### C. Monitoring (`/staff/monitoring`)
- Phân nhóm: `Trạm có tín hiệu bất thường` (cần hành động ngay) và `Trạm hoạt động bình thường`.
- Dữ liệu trạm đo là nguồn tín hiệu (`SIGNAL`), không phải toàn bộ sản phẩm.

### D. Analytics & Outcome
- Đo lường kết quả thực tế:
  - Thời gian trung vị từ phát hiện đến xử lý (VD: `1.8 ngày`).
  - Tỷ lệ hồ sơ được tái kiểm thực địa (VD: `71%`).
  - Tỷ lệ đạt chuẩn sau lần xử lý đầu tiên (VD: `64%`).
  - Tỷ lệ có bước xử lý tiếp theo rõ ràng (VD: `100%`).
