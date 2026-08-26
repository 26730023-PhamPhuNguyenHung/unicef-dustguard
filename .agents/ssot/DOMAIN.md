# DOMAIN SSOT — BOUNDED CONTEXTS, DECISION TREE & ROADMAP

## 1. Bounded Contexts

```text
src/domains/ (hoặc server/domain/)
  ├── community/       # Nhóm, CLB, thành viên, vai trò (Member, Coordinator, Admin)
  ├── campaigns/       # Chiến dịch hành động xanh, mục tiêu, địa bàn, thời hạn
  ├── observations/    # Ghi nhận hiện trường ban đầu (ảnh, GPS, danh mục, mô tả)
  ├── cases/           # Vấn đề hệ thống hóa theo dõi lâu dài (status, priority, owner)
  ├── evidence/        # Kho minh chứng số (URL, hash SHA-256 tamper-evident, timestamps)
  ├── actions/         # Nhiệm vụ cụ thể (TODO, IN_PROGRESS, DONE, CANCELLED)
  ├── followups/       # Quay lại kiểm tra 24h-48h (Tốt hơn / Không đổi / Xấu hơn, ảnh mới)
  ├── handoffs/        # Chuyển hồ sơ có cấu trúc sang 1022 / iHanoi / BQLDA (Prepared -> Closed)
  └── impact/          # Số liệu tác động xã hội & giờ tình nguyện có thực
```

---

## 2. Luồng Dữ Liệu & Cây Quyết Định (Architecture Decision Tree)

```text
                   COMMUNITY & YOUTH PARTICIPATION
                    Observe / Act / Follow-up
                               │
                      ENVIRONMENTAL SIGNAL
                   Evidence + Location + Time
                               │
                      DUSTGUARD RECORD
       ┌───────────────────────┼───────────────────────┐
  [Understand]           [Follow-up]             [Green Action]
Legal / Edu info        Before / After         Verified Hours
Map & Context          Timeline (24-48h)       Certificates (QR)
                               │
                 IS EXTERNAL ACTION REQUIRED?
                               │
             ┌─────────────────┴─────────────────┐
            NO                                  YES
             │                                   │
    [Community Follow-up]               [Prepare Structured Case]
 (CLB tự xử lý / dọn dẹp)               (Gom bằng chứng + Dossier A4)
             │                                   │
    [Mark Resolved & Impact]            [Handoff to 1022 / iHanoi]
                                        (Kênh chính thức tiếp nhận)
                                                 │
                                        [Track Public Outcome]
                                        (Theo dõi kết quả công khai)
                                                 │
                                        [Community Follow-up]
                                        (Thanh niên kiểm tra lại)
```

---

## 3. Lộ Trình Tiến Hóa Tích Hợp Handoff (Handoff Evolution Roadmap)

1. **Manual Handoff (Hiện tại)**: Xuất Dossier PDF A4 / Link QR tra cứu. Điều phối viên gửi thủ công qua 1022 / iHanoi / BQLDA.
2. **Assisted Handoff**: 1-Click copy định dạng chuẩn của 1022/iHanoi, tự format mẫu hành chính, nén ảnh bằng chứng.
3. **Integration Gateway**: Dispatcher tự động gửi qua Webhooks, Secure Email, Zalo OA hoặc Telegram Bot BQLDA kèm chữ ký SHA-256.
4. **Official API / Approved Automation**: Tích hợp trực tiếp Open API / e-Gov API của Cổng 1022 / iHanoi khi có thỏa thuận.
5. **Two-Way Status Synchronization**: Đồng bộ trạng thái 2 chiều giữa kết quả xử lý của cơ quan và chuỗi tái kiểm định thực địa của thanh niên.

---

## 4. Nguyên Tắc Nghiệp Vụ Cốt Lõi (Invariants)
- **Observation != Case**: Ghi nhận ban đầu là tín hiệu quan trắc độc lập; chỉ khi cần phối hợp theo dõi dài hạn hoặc chuyển giao mới nhóm thành hồ sơ theo dõi (Case).
- **Target 24h - 48h**: Là **Community Follow-up Target** (Tỷ lệ điểm được cộng đồng quay lại đối chứng trong 24-48 giờ). Thời gian xử lý của cơ quan chính thức phụ thuộc quy trình riêng của họ.
- **Bằng chứng số**: Lưu trữ mã hash SHA-256 để hỗ trợ phát hiện việc tệp bị thay đổi sau khi ghi nhận (Tamper-evident).
- **Green Credits**: DustGuard xác thực lịch sử tham gia, thời lượng và hoạt động bằng QR và dữ liệu truy vết; việc quy đổi sang điểm rèn luyện hoặc tín chỉ do từng đơn vị giáo dục quyết định.
- **Zero-IoT Resilience**: Hệ thống vận hành 100% khi có 0 cảm biến. IoT (<$25) là nguồn dữ liệu bổ sung.
