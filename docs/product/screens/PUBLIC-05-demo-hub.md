# PUB-05 — Trung Tâm Trải Nghiệm Kịch Bản 5 Vai Trò

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/demo` (và alias `/demo/accounts`)
- **Primary Role**: Ban Giám khảo / Người đánh giá sản phẩm / Khách thử nghiệm (`evaluator` / `public`)
- **Secondary Roles**: Nhà phát triển, Cán bộ đào tạo
- **Current Component**: `DemoHub.jsx` (`app/src/modules/public/DemoHub.jsx`)
- **Layout**: Public Header & Container View
- **Primary Job**: Cho phép người đánh giá chuyển đổi nhanh (1-click role switch) giữa 5 vai trò thực tế để trải nghiệm trọn vẹn luồng nghiệp vụ khép kín mà không cần đăng ký tài khoản thủ công.
- **Success Condition**: Người dùng chọn 1 trong 5 vai trò và được chuyển ngay vào không gian làm việc tương ứng với đầy đủ dữ liệu mẫu sống động.

---

## 2. WHY THIS SCREEN EXISTS
- Phục vụ đánh giá sản phẩm tại các cuộc thi và buổi trình diễn thực tế: Ban Giám khảo cần kiểm thử nhanh luồng tương tác đa bên (Dân gửi $\rightarrow$ Cán bộ thụ lý $\rightarrow$ Nhà thầu khắc phục $\rightarrow$ Admin quản trị) chỉ trong vài phút mà không gặp rào cản đăng nhập.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Menu "Trải nghiệm Demo" trên Header, nút "Demo 5 vai trò" tại chân trang.
- **Exit Points**:
  - Chọn thẻ "Công dân" $\rightarrow$ Đăng nhập nhanh và mở `/citizen`.
  - Chọn thẻ "Cán bộ thanh tra" $\rightarrow$ Đăng nhập nhanh và mở `/staff`.
  - Chọn thẻ "Nhà thầu xây dựng" $\rightarrow$ Đăng nhập nhanh và mở `/contractor`.
  - Chọn thẻ "Quản trị hệ thống" $\rightarrow$ Đăng nhập nhanh và mở `/admin`.
- **Navigation Item**: Header button "Demo 5 Vai Trò" (icon PlayCircle/Layers).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem trung tâm trải nghiệm demo** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Chuyển đổi vai trò 1-click** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Tải lại dữ liệu mẫu (Reset Demo)** | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /demo 
→ Đọc kịch bản trải nghiệm: "Quy trình phối hợp 4 bên xử lý ô nhiễm bụi công trình"
→ Thấy 5 thẻ vai trò với mô tả công việc và tài khoản sẵn có:
   1. 📱 Công dân số (Citizen)
   2. 🎓 Tình nguyện viên thanh niên (Community)
   3. 📋 Cán bộ trật tự xây dựng (Staff)
   4. 🏗️ Chỉ huy trưởng nhà thầu (Contractor)
   5. ⚙️ Quản trị viên IOC (Admin)
→ Bấm nút "Trải nghiệm vai trò Cán bộ"
→ Hệ thống thiết lập phiên đăng nhập tức thì và điều hướng vào /staff
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tiêu đề "Trung Tâm Trải Nghiệm Kịch Bản 5 Vai Trò", hướng dẫn nhanh cho Ban Giám khảo.
2. **Interactive Role Grid (Lưới 5 Thẻ Vai Trò)**:
   - Mỗi thẻ gồm: Icon đại diện lớn, Tên vai trò, Nhiệm vụ chính, Tên tài khoản demo, Nút "Vào trải nghiệm ngay" (Màu sắc theo nhận diện từng vai trò).
3. **End-to-End Guided Journey**: Sơ đồ gợi ý thứ tự trải nghiệm 4 bước để thấy trọn vẹn giá trị sản phẩm.
4. **Simulator Sandbox Link**: Nút chuyển sang "Bàn mô phỏng cảm biến IoT" (`/demo/iot`).

---

## 7. CONTENT CONTRACT
- **Page Title**: `Trung Tâm Trải Nghiệm Demo` (≤ 5 từ)
- **Role Cards CTA**: `Vào vai [Tên vai trò]` (≤ 3 từ)
- **Minh bạch**: Ghi rõ đây là môi trường dữ liệu demo phục vụ đánh giá tính năng.

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Target Session | Fallback |
|---|:---:|---|---|---|
| Danh sách tài khoản demo | Yes | `app/server/auth.js` | Session Mock Token | Demo accounts static |

- **Current Implementation**: `GET /api/auth/demo-accounts`, `POST /api/auth/demo-login`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Bấm vào bất kỳ thẻ vai trò nào đều đăng nhập thành công và chuyển đúng vào route của vai trò đó.
- [ ] Dữ liệu trong các phân hệ demo hiển thị đầy đủ và có thể thao tác thật (tạo phản ánh, duyệt hồ sơ, nộp ảnh).

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Giao diện Demo Hub 5 vai trò, đăng nhập nhanh 1-click, chuyển hướng chính xác.
- **PARTIAL**: Hướng dẫn tương tác từng bước (Interactive Tour Guide).
- **PROPOSED**: Nút "Reset Demo Data" để khôi phục lại trạng thái ban đầu của cuộc thi.
