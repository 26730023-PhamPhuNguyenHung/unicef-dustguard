# ARCHITECTURE DECISION RECORDS (ADR)

## ADR-001: D1 is Persistent Single Source of Truth
- **Context**: Cần đảm bảo dữ liệu ghi nhận và hồ sơ vụ việc lưu trữ nhất quán trên Cloudflare Edge.
- **Decision**: Mọi mutation từ người dùng đều lưu thẳng vào D1 SQLite (`env.DB`), không dùng localStorage làm database.
- **Consequences**: API trả về bản ghi đã lưu bền vững, chống mất dữ liệu khi reload.

## ADR-002: Observation and Case Separation
- **Context**: Người dân và thanh niên ghi nhận nhiều hiện tượng thực tế, không phải mọi phản ánh đều là vi phạm cần lập án thanh tra.
- **Decision**: Tách `Observation` (ghi nhận hiện trường ban đầu) và `Case` (vấn đề cần theo dõi dài hạn/leo thang).
- **Consequences**: Cho phép mở rộng sang nhiều lĩnh vực môi trường (nước thải, rác, đốt rơm) mà không làm phức tạp hóa quy trình ban đầu.

## ADR-003: IoT as Optional Corroborating Source
- **Context**: Nhiều địa bàn không có thiết bị cảm biến IoT đầu cuối.
- **Decision**: IoT là nguồn dữ liệu đối chứng phụ trợ, hệ thống hoạt động 100% khi 0 cảm biến.
- **Consequences**: Triển khai linh hoạt ở mọi trường học và khu dân cư.

## ADR-004: Youth Community as Primary Pioneer Actor
- **Context**: Người dân thường chỉ báo cáo 1 lần rồi bỏ quên; thanh niên & CLB môi trường có động lực hành động và theo dõi lâu dài.
- **Decision**: Đặt Youth Community vào vị trí Primary Actor, hỗ trợ phân công nhiệm vụ (Actions), kiểm tra lại (Follow-ups) và tích lũy tín chỉ tình nguyện.
- **Consequences**: Tạo ra chu kỳ giải quyết vấn đề khép kín có sự tham gia của xã hội.

## ADR-005: Civic Decision Tree & Verification Closed-Loop
- **Context**: Cần luồng dữ liệu chuẩn hóa từ lúc tiếp nhận tín hiệu (Signal) tới khi xử lý dứt điểm, phân định ranh giới giữa tự xử lý cộng đồng và chuyển cơ quan chức năng.
- **Decision**: Áp dụng cây quyết định 4 pha:
  `Signal -> Record (Understand / Follow-up / Green Action) -> Cần can thiệp chính thức?`
  - **NO**: Tiếp tục Community follow-up nội bộ và hoàn tất bằng Green Actions.
  - **YES**: Tạo Structured Case (Dossier A4 + SHA-256) -> Chuyển 1022 / iHanoi / Kênh chính thức -> Theo dõi kết quả công khai -> Community follow-up đối chứng Before/After độc lập trước khi đóng.
- **Consequences**: Tránh gửi rác/phản ánh không căn cứ lên chính quyền; mọi hồ sơ bàn giao đều có đối chứng và bằng chứng vững chắc.

## ADR-006: 5-Stage Handoff Maturity Roadmap
- **Context**: Hệ thống chính quyền và các kênh phản ánh (1022, iHanoi) có mức độ sẵn sàng API khác nhau.
- **Decision**: Thiết kế lộ trình Handoff 5 cấp: `Manual -> Assisted -> Integration Gateway -> Official API -> Two-way Status Sync`.
- **Consequences**: Hệ thống chạy được ngay 100% từ ngày đầu tiên bằng Manual/Assisted, sẵn sàng tích hợp sâu khi chính quyền mở API kết nối.

## ADR-007: Staff Dashboard as Coordination Workspace (Not Location Tracker)
- **Context**: Staff dashboard không phải là bản đồ định vị giám sát nhân sự/người dùng theo thời gian thực (xâm phạm riêng tư, vô nghĩa).
- **Decision**: Staff Dashboard là **Workspace điều phối hành động thực chất**: Hàng đợi phân loại (Triage Queue), Điều phối nhiệm vụ (Action Dispatcher), Quản lý bàn giao (Handoff Pipeline Hub), và Nghiệm thu đối chứng (Verification & Impact Closing).
- **Consequences**: Tăng năng suất điều phối, tập trung vào giải quyết vấn đề ô nhiễm thay vì theo dõi nhân sự.

