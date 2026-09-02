# PUB-05 — Trung Tâm Kịch Bản Đánh Giá (Demo Hub)

## 1. Screen identity
- Role: Public / Giám khảo / Khách đánh giá
- Route: `/demo`
- Component: `modules/public/DemoHub.jsx`
- Layout: Public Root Layout
- Navigation entry: Header Topbar ("Kịch bản Demo")
- Current implementation status: ACTIVE (Level 5 Production)

Purpose: Cho phép người đánh giá nhanh chóng trải nghiệm 5 vai trò (Citizen, Staff, Contractor, Admin, Executive), nạp dữ liệu mẫu chuẩn và kiểm chứng tính toàn vẹn của hệ thống trong 3 phút.

---

## 2. User goal
- Chuyển đổi vai trò chỉ với 1 click không cần nhập mật khẩu.
- Chọn kịch bản kiểm thử: Phản ánh vi phạm, Xử lý hồ sơ 7 bước, Nhà thầu khắc phục, Xuất báo cáo A4.
- Khôi phục cơ sở dữ liệu mẫu về trạng thái chuẩn (Reset Demo D1).

---

## 3. Screen sections
1. Role Switcher Matrix (5 Khối vai trò trực quan kèm quyền hạn)
2. Live Scenario Walkthroughs (4 Kịch bản tác nghiệp điển hình)
3. System Diagnostics & Reset Button (Kiểm tra kết nối D1, R2, Worker)
