# PUB-03 — Cổng Tín Chỉ Tình Nguyện & Bảng Vàng Đoàn - Hội

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/youth` (và alias `/youth/credits`, `/youth/leaderboard`)
- **Primary Role**: Sinh viên / Đoàn viên / Tình nguyện viên (`student` / `community`)
- **Secondary Roles**: Đại chúng, Ban Giám hiệu các trường Đại học
- **Current Component**: `YouthCredits.jsx` (`app/src/modules/youth/YouthCredits.jsx`)
- **Layout**: Public Header & Footer
- **Primary Job**: Tra cứu cơ chế quy đổi giờ tình nguyện sang tín chỉ học tập (chuẩn 20 giờ thực địa = 4.0 tín chỉ rèn luyện), xem bảng vàng thi đua giữa các trường Đại học và câu lạc bộ.
- **Success Condition**: Sinh viên hiểu rõ quyền lợi quy đổi tín chỉ và tra cứu được thứ hạng của trường/CLB mình.

---

## 2. WHY THIS SCREEN EXISTS
- Động lực thúc đẩy lực lượng thanh niên tham gia giám sát môi trường: gắn kết hoạt động công ích với kết quả rèn luyện học tập của sinh viên. Công khai bảng thi đua tạo phong trào thi đua sôi nổi giữa các trường Đại học (ĐH Bách Khoa, ĐH Sư Phạm, ĐH Kinh Tế...).

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Menu "Tín chỉ SV" trên thanh điều hướng, link từ Landing Page (`/`).
- **Exit Points**:
  - Bấm "Đăng ký tham gia tình nguyện" $\rightarrow$ Mở trang Đăng ký `/login`.
  - Bấm vào tên CLB $\rightarrow$ Xem hồ sơ thành tích của CLB.
- **Navigation Item**: Navigation Bar item "Tín chỉ SV" (icon Award/GraduationCap).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem bảng xếp hạng & cơ chế tín chỉ**| ✅ | ✅ | ✅ | ✅ | ✅ |
| **Tra cứu chứng chỉ số bằng mã QR** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Xác nhận giờ tình nguyện cho sinh viên**| ❌ | ❌ | ✅ *(Staff / Đoàn trường)*| ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /youth 
→ Xem quy chuẩn quy đổi: 20 giờ khảo sát hiện trường = 4.0 tín chỉ rèn luyện
→ Xem Bảng Vàng Vinh Danh: Top 1 CLB Bách Khoa Xanh (540 giờ), Top 2 ĐH Kinh Tế (420 giờ)
→ Nhập mã sinh viên vào ô tra cứu để kiểm tra số giờ tích lũy của bản thân
→ Bấm nút "Tải giấy chứng nhận điện tử" (có mã QR xác thực)
```

---

## 6. INFORMATION HIERARCHY
1. **Hero Banner**: Tiêu đề "Cổng Tín Chỉ Tình Nguyện & Bảng Vàng Đoàn - Hội", tóm tắt cơ chế 20h = 4.0 tín chỉ.
2. **Impact Summary Bar**: Tổng số sinh viên tham gia | Tổng số giờ tình nguyện | Số điểm nóng đã khảo sát.
3. **University & Community Leaderboard (Bảng Xếp Hạng Thi Đua)**:
   - Thứ hạng (Huy chương Vàng, Bạc, Đồng)
   - Tên trường Đại học / Tên Câu lạc bộ
   - Tổng số giờ cống hiến & Số thành viên tích cực
4. **Certificate Verification Box**: Ô nhập mã chứng nhận hoặc quét mã QR để đối soát tính xác thực của Giấy chứng nhận tình nguyện.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Tín Chỉ Tình Nguyện Sinh Viên` (≤ 5 từ)
- **Primary CTA**: `Đăng ký tham gia ngay` (≤ 4 từ)
- **Quy tắc tính chỉ**: Ghi rõ căn cứ quy chế công tác sinh viên của Bộ Giáo dục & Đào tạo.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Bảng xếp hạng CLB | Yes | `communities` table | `communities.volunteer_hours, communities.member_count` | `[]` |
| Tổng giờ toàn hệ thống | Yes | `volunteer_logs` | `SUM(hours)` | `1,250+` |

- **Current Implementation**: `GET /api/community/leaderboard`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Bảng xếp hạng sắp xếp đúng theo thứ tự tổng số giờ tình nguyện giảm dần.
- [ ] Tra cứu mã chứng chỉ hiển thị đúng họ tên sinh viên và số giờ đã được xác nhận.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Bảng xếp hạng các câu lạc bộ, hiển thị cơ chế quy đổi tín chỉ 20h = 4.0, tra cứu số giờ.
- **PARTIAL**: Xuất file PDF Giấy chứng nhận có mã QR ma trận ISO/IEC 18004.
- **PROPOSED**: Tích hợp đồng bộ dữ liệu tín chỉ trực tiếp vào cổng đào tạo của các trường Đại học.
