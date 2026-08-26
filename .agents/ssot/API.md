# API SSOT — REST ENDPOINTS & SCHEMAS

## 1. Community & Discovery API
- `GET /api/community/me`: Lấy thông tin cá nhân, CLB đang tham gia, điểm tích lũy, số giờ tình nguyện.
- `GET /api/community/groups`: Danh sách các nhóm/CLB môi trường hoạt động.
- `POST /api/community/groups`: Tạo CLB môi trường mới.
- `GET /api/community/impact`: Tổng hợp số liệu tác động cộng đồng thời gian thực (số ghi nhận, số lần kiểm tra lại, số giờ, số điểm nóng cải thiện).

## 2. Campaigns API
- `GET /api/campaigns`: Danh sách chiến dịch xanh đang chạy hoặc đã lên lịch.
- `POST /api/campaigns`: Tạo chiến dịch mới (chủ đề, địa bàn, thời gian).
- `GET /api/campaigns/:id`: Chi tiết chiến dịch, danh sách thành viên và các ghi nhận liên kết.
- `POST /api/campaigns/:id/join`: Tham gia chiến dịch.

## 3. Observations API (Core Loop Entrypoint)
- `GET /api/observations`: Lọc danh sách ghi nhận theo danh mục, phường, trạng thái, CLB, chiến dịch.
- `POST /api/observations`: Tạo ghi nhận mới (Category, GPS/Địa chỉ, Mô tả, Tư cách người gửi, file ảnh).
- `GET /api/observations/:id`: Chi tiết ghi nhận, danh sách ảnh/bằng chứng và lịch sử theo dõi.
- `POST /api/observations/:id/evidence`: Bổ sung ảnh/tài liệu minh chứng mới kèm mã băm SHA-256.
- `POST /api/observations/:id/follow-ups`: Ghi nhận kết quả quay lại kiểm tra (Tốt hơn / Không đổi / Xấu hơn).
- `POST /api/observations/:id/escalate-case`: Chuyển ghi nhận thành Hồ sơ vụ việc (Case) để theo dõi chuyên sâu.

## 4. Community Case & Tasks API
- `GET /api/cases`: Danh sách vụ việc đang theo dõi.
- `GET /api/cases/:id`: Chi tiết hồ sơ vụ việc.
- `POST /api/cases/:id/actions`: Giao nhiệm vụ thực địa cho thành viên/nhóm.
- `PATCH /api/actions/:id`: Cập nhật trạng thái nhiệm vụ (`TODO`, `IN_PROGRESS`, `DONE`).
- `POST /api/actions/:id/complete`: Hoàn thành nhiệm vụ kèm ảnh minh chứng nghiệm thu.
- `POST /api/cases/:id/handoffs`: Chuẩn bị & gửi hồ sơ bàn giao sang đơn vị có thẩm quyền.
- `PATCH /api/handoffs/:id`: Cập nhật trạng thái phản hồi từ đơn vị tiếp nhận.
