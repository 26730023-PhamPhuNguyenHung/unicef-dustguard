# CON-01 — Bàn Làm Việc Chỉ Huy Trưởng

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/contractor` (và alias `/contractor/dashboard`)
- **Primary Role**: Chỉ huy trưởng / Cán bộ ATLĐ & Môi trường nhà thầu (`contractor`)
- **Secondary Roles**: Quản trị viên (`admin`)
- **Current Component**: `ContractorDashboardPage.jsx` (`app/src/apps/contractor/pages/dashboard/ContractorDashboardPage.jsx`)
- **Layout**: `ContractorLayout.jsx`
- **Primary Job**: Nắm bắt ngay các yêu cầu khắc phục môi trường khẩn cấp cần xử lý tại công trường dự án và thời hạn phản hồi.
- **Success Condition**: Chỉ huy trưởng biết chính xác cần làm gì, ở vị trí nào của công trường và trước mấy giờ để tránh bị đình chỉ thi công hoặc xử phạt.

---

## 2. WHY THIS SCREEN EXISTS
- Không xem nhà thầu là "đối tượng vi phạm", DustGuard thiết kế không gian làm việc này như một công cụ hỗ trợ tuân thủ (Compliance Assistant) cho nhà thầu: hướng dẫn rõ ràng biện pháp cần khắc phục, thời hạn SLA và cách nộp minh chứng để hoàn thành nghĩa vụ bảo vệ môi trường.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Đăng nhập với vai trò Contractor (`/login`), hoặc quét mã liên kết nhanh từ thông báo yêu cầu khắc phục.
- **Exit Points**:
  - Click vào yêu cầu khắc phục $\rightarrow$ Mở Không gian nộp minh chứng (`/contractor/tasks`).
  - Click vào vụ việc $\rightarrow$ Chuyển đến Sổ bộ vụ việc (`/contractor/cases`).
- **Navigation Item**: Sidebar / Header item "Tổng quan" (icon Home/HardHat).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem bàn làm việc nhà thầu** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Xem danh sách việc cần khắc phục**| ❌ | ❌ | ❌ | ✅ | ✅ |
| **Nộp ảnh khắc phục Before/After** | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /contractor 
→ Xem thông báo: "Bạn có 2 yêu cầu khắc phục cần hoàn thành hôm nay"
→ Đọc chi tiết từng thẻ việc: Loại vi phạm (Bụi đào đất), Vị trí, Hạn chót (ví dụ: trước 16:00)
→ Bấm nút "NỘP MINH CHỨNG KHẮC PHỤC" trên thẻ việc
→ Điều hướng sang màn hình /contractor/tasks để tải ảnh và định vị
```

---

## 6. INFORMATION HIERARCHY
1. **Contractor Site Header**: Tên nhà thầu, Tên công trường dự án đang thi công, Trạng thái tuân thủ chung.
2. **Urgent Action Banner**: Banner nổi bật màu vàng/đỏ thể hiện các yêu cầu khắc phục có thời hạn dưới 4 giờ.
3. **Key Compliance Metrics (3 Thẻ Chỉ Số)**:
   - `Yêu cầu cần khắc phục ngay` (Số lượng có badge đỏ)
   - `Đang chờ cán bộ nghiệm thu` (Số lượng màu vàng)
   - `Đã hoàn thành đúng hạn` (Tỷ lệ % tuân thủ)
4. **Active Remediation Tasks List**: Danh sách các nhiệm vụ khắc phục đang mở kèm nút nộp ảnh đối chứng nhanh.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Bàn Làm Việc Nhà Thầu` (≤ 5 từ)
- **Primary CTA**: `Nộp minh chứng ngay` (≤ 4 từ)
- **Nguyên tắc từ ngữ**: Không dùng từ "đã vi phạm" hay "kẻ phạm tội", dùng từ "Yêu cầu khắc phục", "Biện pháp bảo vệ môi trường", "Thời hạn hoàn thành".

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Tên công trình | Yes | `sites` table | `sites.name` | `Dự án của bạn` |
| Danh sách việc cần khắc phục | Yes | `actions` table | `actions WHERE status='PENDING'` | `[]` |
| Hạn SLA hoàn thành | Yes | `actions` table | `actions.dueDate` | `Trong ngày` |

- **Current Implementation**: `GET /api/contractor/dashboard`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Hiển thị chính xác các yêu cầu khắc phục thuộc dự án mà nhà thầu đang thi công.
- [ ] Thời hạn SLA đếm ngược cảnh báo đúng thời gian thực.
- [ ] Nút nộp minh chứng chuyển tiếp mượt mà đến trang tác nghiệp `/contractor/tasks`.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Giao diện tổng quan nhà thầu, hiển thị danh sách yêu cầu khắc phục, thẻ chỉ số tuân thủ.
- **PARTIAL**: Quick-token đăng nhập không cần mật khẩu từ link thông báo SMS.
- **PROPOSED**: Tự động nhắc việc qua Zalo OA trước thời hạn hết hạn 2 tiếng.
