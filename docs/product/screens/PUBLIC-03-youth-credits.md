# PUB-03 — Cổng Tín Chỉ Thanh Niên (Youth Credits)

## 1. Screen identity
- Role: Public / Youth / Sinh viên
- Route: `/youth`
- Component: `modules/youth/YouthCredits.jsx`
- Layout: Public / Youth Layout
- Navigation entry: Header Menu / Citizen Profile
- Current implementation status: ACTIVE (Level 5 Production)

Purpose: Quy đổi giờ tình nguyện môi trường thành tín chỉ hoạt động ngoại khóa sinh viên (20h = 4.0 tín chỉ) và xuất chứng chỉ số có mã QR xác thực chuẩn ISO/IEC 18004.

---

## 2. User goal
- Xem bảng quy tắc tích lũy giờ tình nguyện và quy đổi tín chỉ.
- Tra cứu bảng xếp hạng đóng góp của các trường Đại học & Câu lạc bộ.
- Nhập mã sinh viên để nhận chứng chỉ điện tử có chữ ký số.

---

## 3. Entry points
- Menu "Tín chỉ thanh niên" trên Header.
- Nút "Nhận chứng chỉ" từ trang cá nhân công dân `/citizen/profile`.

---

## 4. Exit / next actions
- Bấm "Tham gia ghi nhận" $ightarrow$ `/citizen/report/new`
- Bấm "Tải chứng chỉ PDF/SVG" $ightarrow$ Lưu file chứng chỉ về máy.

---

## 5. Information hierarchy
1. Banner thông điệp: "20 Giờ Tình Nguyện = 4.0 Tín Chỉ Sinh Viên"
2. Máy tính quy đổi giờ & Điểm rèn luyện thời gian thực
3. Bảng xếp hạng Top các Trường ĐH & CLB Tình nguyện dẫn đầu
4. Trình xuất & Kiểm tra Chứng chỉ số (Certificate Generator with QR Matrix)

---

## 6. Above-the-fold content
- **MUST SEE**: Thẻ quy đổi tiến độ (Ví dụ: 15h / 20h — Đạt 75%), Nút "Nhận chứng chỉ".
- **SHOULD SEE**: Top 3 trường đại học tích cực nhất (ĐHQG, ĐHBK, ĐHKT).
- **BELOW FOLD**: Lịch sử các đợt ra quân khảo sát môi trường và danh sách cấp chứng chỉ công khai.

---

## 7. Screen sections
### Section 1 — Credit Converter & Progress
- Displays: Số giờ ghi nhận, Giờ khảo sát hiện trường, Điểm rèn luyện tích lũy.
- Status: IMPLEMENTED

### Section 2 — Top Universities Leaderboard
- Displays: Bảng xếp hạng gồm Tên trường, Số tình nguyện viên, Tổng giờ đóng góp.
- Status: IMPLEMENTED

### Section 3 — Verifiable Digital Certificate Preview
- Displays: Mẫu chứng chỉ hành chính A4 có Quốc huy/Logo, Mã băm bảo mật SHA-256, Mã QR SVG quét được trên mọi thiết bị.
- Status: IMPLEMENTED

---

## 8. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|---:|---|---|
| Volunteer Hours Logged | Tổng giờ tình nguyện đã xác minh | Có | D1 `youth_activities` | REAL |
| Extracurricular Credits | Tín chỉ ngoại khóa quy đổi | Có | Engine quy đổi | REAL (20h = 4.0) |
| Certificate Code | Mã định danh chứng chỉ duy nhất | Có | D1 `youth_certificates` | REAL |
| QR Matrix SVG | Mã QR vector chuẩn ISO 18004 | Có | `youth-credits.js` | REAL |

---

## 9. User actions
| Action | Trigger | Result | Permission | Status |
|---|---|---|---|---|
| Đăng ký đổi chứng chỉ | Điền mã SV & bấm "Cấp chứng chỉ" | Sinh bản ghi D1 + tạo file QR | Student/Citizen | WORKING |
| Tải ảnh chứng chỉ PNG/SVG | Bấm "Tải chứng chỉ" | Tải file Base64 PNG hoặc Vector SVG | Student/Citizen | WORKING |

---

## 10. Primary action
- Primary action: [Nhận chứng chỉ tín chỉ]
- Secondary: [Xem bảng xếp hạng], [Tham gia đợt khảo sát mới]
