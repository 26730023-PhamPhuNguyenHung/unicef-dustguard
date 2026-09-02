# BUSINESS-VALUE TESTING RULES & QUALITY CONTRACT — DUSTGUARD VN

> **Tuyên ngôn**: Ưu tiên test theo **giá trị nghiệp vụ thực tế**, tuyệt đối không chạy theo số lượng test hay phần trăm coverage vô nghĩa. Test pass nhưng logic không ra giá trị cho người dùng là vô ích.

---

## 1. Phân Tầng Kiểm Thử Chuẩn Theo Giá Trị Nghiệp Vụ (5 Tầng)

| Tầng Kiểm Thử | Trọng Tâm Nghiệp Vụ (Business Focus) | Quy Tắc Thực Hiện |
|---|---|---|
| **1. Unit Test** | Business logic, Domain Models, Utils, Validators, Risk & Scoring Engines | Test các thuật toán tính toán, quy đổi tín chỉ (20h = 4.0), tính điểm rủi ro bụi, sinh mã băm SHA-256, kiểm tra input boundary. |
| **2. Integration Test** | API Routes + D1/SQLite Thật + Auth + RBAC Permissions | Gọi endpoint với SQLite backend thật, kiểm tra đúng status code (200, 201, 400, 401, 403, 404), kiểm tra phân quyền role. |
| **3. Contract Test** | Khớp nối Schema Response giữa Backend & Frontend | Kiểm tra shape của payload API: collections trả về `{ items: [...] }` hoặc `[...]`, unwrap an toàn, không có trường undefined gây crash client. |
| **4. E2E Workflow** | Luồng nghiệp vụ trọng yếu của người dùng (P0 User Journeys) | Chỉ test các luồng sống còn: Ghi nhận vi phạm $\to$ Khảo sát $\to$ Lập hồ sơ xử lý $\to$ Đóng ca; Nhà thầu khắc phục $\to$ Nghiệm thu. |
| **5. UI Test** | Hành vi & Trạng thái tương tác quan trọng (Behavior > Markup) | Test tương tác cốt lõi (submit form, lọc dữ liệu, switch role, hiển thị error/empty state). **Cấm khóa chặt markup/CSS/class string** tránh làm brittle test. |

---

## 2. Các Điều Cấm Kỵ Trong Kiểm Thử (Strict Anti-Patterns)

1. ❌ **CẤM tạo test chỉ để "tăng số lượng" hoặc "kéo coverage"**:
   - Mỗi test case phải gắn liền với một nghiệp vụ thực tế hoặc một bẫy lỗi (bug trap) đã xác định.
2. ❌ **CẤM lặp lại (duplicate) cùng một assertion ở nhiều file test**:
   - Nếu một invariant đã được kiểm thử sâu ở `domain/*.test.js`, không copy nguyên assertion đó sang UI hay route test.
3. ❌ **CẤM mock quá mức (Over-Mocking)**:
   - Cấm mock response giả tạo đến mức tách rời khỏi SQLite D1 và nghiệp vụ thực. Dùng database in-memory / dev.db thật để phản ánh đúng runtime.
4. ❌ **CẤM test kiểm tra chuỗi CSS cứng ngắc (Brittle Snapshot/CSS matching)**:
   - Trừ các token cốt lõi của Design System, không viết test bắt buộc component phải có chính xác 1 class CSS phụ nào đó nếu nó không ảnh hưởng tới layout/accessibility.
5. ❌ **CẤM test pass nhưng logic sai domain**:
   - Kiểm tra logic input $\to$ output: Có đúng Nghị định 45/2022/NĐ-CP, QCVN 18:2021/BXD, QCVN 05:2023/BTNMT không? Tín chỉ thanh niên có đúng công thức không?

---

## 3. Checklist Nghiệm Thu Một File Test Mới

- [ ] Test này bảo vệ giá trị nghiệp vụ nào cho người dân / cán bộ / nhà thầu?
- [ ] Dữ liệu đầu vào và đầu ra có phản ánh đúng thế giới thực (zero fake logic)?
- [ ] Có phụ thuộc vào mock bên ngoài không cần thiết không?
- [ ] Thời gian thực thi có đạt chuẩn Fast Loop (< 0.5s cho single test file)?
- [ ] Test có dễ hiểu và dễ bảo trì khi refactor giao diện không?
