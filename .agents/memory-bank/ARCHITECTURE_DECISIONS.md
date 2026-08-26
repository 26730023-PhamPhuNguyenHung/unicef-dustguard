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
