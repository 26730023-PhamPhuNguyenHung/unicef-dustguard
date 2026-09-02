# Hệ Thống Đặc Tả Tính Năng (Spec System) — DustGuard VN

Hệ thống đặc tả phân theo vai trò người dùng (Persona-Driven Specs):

- `specs/citizen/`: Các luồng phản ánh, bản đồ và tín chỉ thanh niên của người dân.
- `specs/staff/`: Các luồng quản lý công trình, khảo sát 10 tiêu chí và hồ sơ cán bộ.
  - [`SPEC-staff-case-evidence-flow.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/specs/staff/SPEC-staff-case-evidence-flow.md) (Pilot Active)
- `specs/contractor/`: Các luồng tiếp nhận công việc, nộp minh chứng khắc phục nhà thầu.
- `specs/admin/`: Các luồng quản trị người dùng, cấu hình quy chuẩn và cảm biến.
- `specs/executive/`: Các luồng trung tâm chỉ huy, báo cáo tổng hợp và ký số văn bản.
- `specs/shared/`: Các luồng dùng chung (Xác thực, Thông báo, Nhật ký).

Mọi tính năng mới bắt buộc phải lập spec theo [`specs/TEMPLATE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/specs/TEMPLATE.md) trước khi viết mã nguồn.
