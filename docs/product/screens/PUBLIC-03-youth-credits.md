# PUB-03 — Cổng Tín Chỉ Thanh Niên & Chứng Chỉ QR (Youth Credits)

## 1. Screen identity
- **Role**: Public / Youth / Sinh viên
- **Route**: `/youth`
- **Component**: `src/modules/youth/YouthCredits.jsx`
- **Layout**: Public / Youth Layout
- **Navigation entry**: Header Menu "Tín chỉ thanh niên" / Cổng công dân `/citizen/profile`
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Cơ chế khuyến khích thế hệ trẻ tham gia bảo vệ môi trường: quy đổi 20 giờ tình nguyện thành 4.0 tín chỉ hoạt động ngoại khóa, vinh danh câu lạc bộ dẫn đầu và cấp chứng chỉ số có mã QR vector SVG chuẩn ISO/IEC 18004.

---

## 2. User goal
1. **Theo dõi tiến độ tích lũy**: Kiểm tra số giờ ghi nhận hiện trường và số tín chỉ đạt được theo quy chuẩn $20	ext{h} = 4.0	ext{ tín chỉ}$.
2. **Tra cứu bảng xếp hạng**: Xem vị trí xếp hạng đóng góp của Trường Đại học và Câu lạc bộ Tình nguyện.
3. **Nhận chứng chỉ điện tử**: Điền thông tin sinh viên để tạo chứng chỉ có chữ ký số và mã QR quét được tức thì.

---

## 3. Information hierarchy
1. **Thanh tiến độ cá nhân (Credit Goal Calculator)**: Vòng tròn tiến độ 20 giờ, số giờ còn lại để đạt mốc nhận chứng chỉ tiếp theo.
2. **Bảng xếp hạng đóng góp (Universities & Clubs Leaderboard)**: Top 10 trường ĐH có số giờ khảo sát môi trường cao nhất.
3. **Khung xem trước & Tải chứng chỉ (Verifiable Certificate Frame)**: Khổ giấy A4, Quốc hiệu, Mã định danh duy nhất, Mã QR SVG chuẩn ISO 18004.
4. **Hướng dẫn tham gia nhiệm vụ**: 4 bước đơn giản để sinh viên bắt đầu ghi nhận và tích lũy giờ công.

---

## 4. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|:---:|---|---|
| Volunteer Hours Logged | Tổng giờ tình nguyện đã được cán bộ xác minh | Có | D1 `youth_activities` | REAL |
| Extracurricular Credits | Tín chỉ ngoại khóa quy đổi ($4.0	ext{ TC} / 20	ext{h}$) | Có | `youth-credits.js` | REAL |
| Top Universities | Danh sách trường ĐH & số giờ đóng góp | Có | D1 `youth_activities` | REAL |
| Certificate Code | Mã số chứng chỉ duy nhất (VD: `VN-YOUTH-2026-8891`) | Có | D1 `youth_certificates` | REAL |
| Digital Signature Hash | Mã băm SHA-256 xác thực tính toàn vẹn | Có | Web Crypto Engine | REAL |

---

## 5. Primary action
- **Primary action**: `[Cấp chứng chỉ tín chỉ]` (Mở modal nhận chứng chỉ)
- **Secondary**: `[Tải file SVG/PNG]`, `[Tham gia khảo sát mới]`

---

## 6. UI Copy
- **Page title**: Cổng tín chỉ thanh niên bảo vệ môi trường
- **Description**: 20 Giờ tình nguyện = 4.0 Tín chỉ ngoại khóa sinh viên.
- **Button labels**: `[Nhận chứng chỉ]`, `[Tải SVG]`, `[Tải PNG]`, `[Xem bảng xếp hạng]`
