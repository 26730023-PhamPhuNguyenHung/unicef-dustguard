# PUB-05 — Trung Tâm Kịch Bản Đánh Giá & Chuyển Vai Trò (Demo Hub)

## 1. Screen identity
- **Role**: Public / Giám khảo / Khách đánh giá
- **Route**: `/demo`
- **Component**: `src/modules/public/DemoHub.jsx`
- **Layout**: Public Root Layout
- **Navigation entry**: Header Topbar ("Kịch bản Demo")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Cho phép giám khảo và người đánh giá nhanh chóng trải nghiệm 5 vai trò (Citizen, Staff, Contractor, Admin, Executive), nạp dữ liệu mẫu chuẩn và kiểm chứng tính toàn vẹn của hệ thống trong 3 phút mà không cần gõ mật khẩu.

---

## 2. User goal
1. **Chuyển đổi vai trò tức thì**: Chọn 1 trong 5 vai trò để hệ thống tự động thiết lập quyền và chuyển đến trang chủ của phân hệ tương ứng.
2. **Trải nghiệm 4 kịch bản tác nghiệp**: Đi theo luồng hướng dẫn từng bước: Phản ánh $ightarrow$ Thụ lý $ightarrow$ Khắc phục $ightarrow$ Nghiệm thu.
3. **Khôi phục cơ sở dữ liệu mẫu (Reset D1)**: Đưa 46 bảng về trạng thái chuẩn chỉ với 1 click.

---

## 3. Information hierarchy
1. **Ma trận chuyển đổi vai trò (Role Switcher 5 Cards)**: Citizen, Staff, Contractor, Admin, Executive kèm mô tả quyền hạn.
2. **Kịch bản trải nghiệm tương tác (4 Guided Scenarios)**:
   - Kịch bản 1: Người dân báo cáo vi phạm bụi trong 30 giây.
   - Kịch bản 2: Cán bộ thanh tra xử lý hồ sơ 7 bước DAG.
   - Kịch bản 3: Nhà thầu nhận yêu cầu và nộp ảnh Before/After $le 50	ext{m}$.
   - Kịch bản 4: Lãnh đạo xuất báo cáo A4 chuẩn NĐ 30/2020.
3. **Công cụ chẩn đoán hạ tầng (System Diagnostics)**: Tình trạng kết nối D1 Database, R2 Object Storage và Cloudflare Worker API.
