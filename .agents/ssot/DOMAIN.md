# DOMAIN SSOT — BOUNDED CONTEXTS, ENVIRONMENTAL EVENT ARCHITECTURE & DECISION TREE

> **Single Source of Truth (SSOT) cho Kiến trúc Nghiệp vụ & Mô hình Miền (Domain-Driven Design).**  
> Phiên bản: **v2.0 (Environmental Event-Centric Paradigm)**  
> Trọng tâm: **Thay thế tư duy "vi phạm/violation" sang "Sự kiện Môi trường / Environmental Event" trong nền tảng CivicTech.**

---

## 1. Triết Lý Nghiệp Vụ Cốt Lõi (Core Domain Philosophy)

1. **Lấy 'Environmental Event' làm Trung Tâm**:
   - Nền tảng CivicTech không đóng vai cơ quan hành pháp và không ban hành chế tài xử phạt (No sanctioning / No policing illusion).
   - Hệ thống chuyển đổi trọng tâm từ *"xử lý vi phạm"* sang **"Nhận diện, Kết nối và Theo dõi Sự kiện Môi trường" (Environmental Event Management)**.
   - Một Sự kiện Môi trường là một diễn biến thực tế tại địa bàn, cần sự chung tay của cộng đồng, thanh niên, nhà thầu và các kênh tiếp nhận chính thức (1022, iHanoi).

2. **Phân Định Rõ 3 Tầng Dữ Liệu & Nghiệp Vụ**:
   - **Tầng 1 — Measurement (Bản ghi đo đạc thô)**: Dữ liệu chuỗi thời gian từ cảm biến IoT, trạm quan trắc hoặc mẫu test nhanh. Thuần túy khách quan, trung tính, không chứa định kiến hay phán đoán.
   - **Tầng 2 — Signal (Dấu hiệu bất thường phát hiện)**: Chỉ dấu môi trường khi đo đạc vượt ngưỡng (Telemetry Spike) hoặc khi công dân/thanh niên gửi quan sát (Observation). Đây là dấu hiệu có ngữ cảnh không-thời gian nhưng chưa phải sự kiện hoàn chỉnh.
   - **Tầng 3 — Event (Sự kiện Môi trường — Aggregate Root)**: Thực thể trung tâm gom cụm một hoặc nhiều Signal cùng khu vực và khoảng thời gian; có vòng đời quản lý, phân công điều phối, hồ sơ minh chứng Before/After và quy trình chuyển tiếp có cấu trúc.

3. **AI là Trợ Lý, Không Phải Thẩm Phán (AI is Assistant, Not Judge)**:
   - AI hỗ trợ tóm tắt nội dung, chuẩn hóa thông tin hiện trường, phân loại sơ bộ danh mục và kiểm tra độ sắc nét của ảnh chứng cứ.
   - Quyết định xác thực, phân công hành động và chuyển tiếp hồ sơ thuộc về con người (Điều phối viên, tình nguyện viên, ban quản trị CLB).

---

## 2. Bounded Contexts (Kiến Trúc Phân Vùng Nghiệp Vụ)

```text
src/domains/ (hoặc server/domain/)
  ├── events/          # [CORE AGGREGATE] Sự kiện môi trường, gom cụm tín hiệu, máy trạng thái 11 bước
  ├── signals/         # Tín hiệu bất thường từ IoT spike, vệ tinh hoặc ghi nhận cộng đồng
  ├── measurements/    # Dữ liệu đo đạc thô, time-series từ cảm biến và thiết bị ngoại vi
  ├── observations/    # Ghi nhận hiện trường ban đầu (Zero-Login, ảnh, GPS, phân loại nhanh)
  ├── community/       # CLB đại học, Đoàn thanh niên, thành viên, vai trò (Member, Coordinator, Admin)
  ├── campaigns/       # Chiến dịch hành động xanh theo chủ đề (bụi học đường, đốt rơm rạ, kênh rạch)
  ├── evidence/        # Kho minh chứng số (URL, mã băm SHA-256 tamper-evident, đối chứng Before/After)
  ├── actions/         # Nhiệm vụ thực tế (Dọn dẹp hiện trường, rửa đường, kiểm tra bạt che)
  ├── followups/       # Tái kiểm định thực địa 24h-48h (Tốt hơn / Không đổi / Xấu hơn)
  ├── handoffs/        # Kết nối hồ sơ cấu trúc Dossier A4 sang 1022 / iHanoi / BQLDA (Prepared -> Closed)
  └── impact/          # Số liệu tác động xã hội, giờ tình nguyện thực tế & Chứng chỉ Tín chỉ Xanh (QR)
```

---

## 3. Vòng Đời & Máy Trạng Thái 11 Bước Của Event (Event State Machine)

Một **Environmental Event** vận hành theo quy trình 11 trạng thái chặt chẽ:

```text
               ┌──────────────┐
               │   detected   │ ◄── Khởi tạo từ Signal / Gom cụm Signals
               └──────┬───────┘
                      │
                      ▼
               ┌──────────────┐
       ┌───────┤ needs_review ├───────┐
       │       └──────┬───────┘       │
       │ (Hủy/Sai)    │ (Duyệt sơ bộ) │ (Trùng lặp)
       ▼              ▼               ▼
 ┌───────────┐ ┌──────────────┐ ┌───────────┐
 │ dismissed │ │ under_review │ │ dismissed │
 └───────────┘ └──────┬───────┘ └───────────┘
                      │
       ┌──────────────┴──────────────┐
       │ (Cần kiểm tra thực địa)     │ (Đủ căn cứ dữ liệu)
       ▼                             ▼
┌────────────────────┐      ┌─────────────────┐
│ needs_verification │ ────►│ verified_signal │
└────────────────────┘      └────────┬────────┘
                                     │
       ┌─────────────────────────────┴─────────────────────────────┐
       │ (Chuyển hồ sơ 1022/iHanoi/BQLDA)                          │ (Cộng đồng tự giải quyết)
       ▼                                                           ▼
┌───────────┐                                            ┌────────────────────┐
│ forwarded │ ──────────────────────────────────────────►│ action_in_progress│
└───────────┘                                            └─────────┬──────────┘
                                                                   │
                                                                   ▼
                                                         ┌────────────────────┐
                                                         │     monitoring     │ ◄── Chu kỳ theo dõi 24h-48h
                                                         └─────────┬──────────┘
                                                                   │
                                                                   ▼
                                                         ┌────────────────────┐
                                                         │      resolved      │ ◄── Đối chứng Before/After tốt hơn
                                                         └─────────┬──────────┘
                                                                   │
                                                                   ▼
                                                         ┌────────────────────┐
                                                         │       closed       │ ◄── Đóng hồ sơ, cấp Green Credits
                                                         └────────────────────┘
```

### Bảng Ý Nghĩa & Điều Kiện Chuyển Đổi Trạng Thái (State Transition Matrix):

| Trạng thái | Tên tiếng Việt | Điều kiện kích hoạt / Ý nghĩa thực tế | Trạng thái tiếp theo |
|---|---|---|---|
| **`detected`** | Mới phát hiện | Hệ thống tự động tạo từ cụm Signal hoặc ghi nhận cộng đồng | `needs_review` |
| **`needs_review`** | Chờ xem xét | Hồ sơ mới cần Điều phối viên kiểm tra sơ bộ thông tin & ảnh | `under_review`, `dismissed` |
| **`under_review`** | Đang xem xét | Điều phối viên đang đánh giá mức độ, bối cảnh và lịch sử địa bàn | `needs_verification`, `verified_signal`, `dismissed` |
| **`needs_verification`** | Cần xác minh | Phân công tình nguyện viên/CLB đến kiểm tra thực địa bổ sung | `verified_signal`, `dismissed` |
| **`verified_signal`** | Đã xác thực | Dữ liệu và thực địa đã được đối chứng chính xác, có minh chứng | `forwarded`, `action_in_progress` |
| **`forwarded`** | Đã chuyển tiếp | Xuất Dossier A4 gửi sang Cổng 1022, iHanoi hoặc BQLDA | `action_in_progress`, `monitoring` |
| **`action_in_progress`** | Đang xử lý | Hành động khắc phục đang được triển khai (rửa đường, che chắn, dọn dẹp) | `monitoring` |
| **`monitoring`** | Đang theo dõi | Cửa sổ 24h - 48h để thanh niên quay lại đối chứng tình trạng | `resolved`, `action_in_progress` |
| **`resolved`** | Đã cải thiện | Đối chứng ảnh Before/After xác nhận môi trường đã cải thiện rõ rệt | `closed` |
| **`closed`** | Đã đóng hồ sơ | Hoàn tất chu trình, cấp chứng nhận giờ tình nguyện (Green Credits) | *(Trạng thái kết thúc)* |
| **`dismissed`** | Đã hủy bỏ | Ghi nhận bị trùng lặp, thông tin sai lệch hoặc không có căn cứ | *(Trạng thái kết thúc)* |

---

## 4. Luồng Dữ Liệu & Cây Quyết Định Nghiệp Vụ (Architecture Decision Tree)

```text
               TẦNG THU THẬP ĐA NGUỒN (MULTI-SOURCE INPUT)
               IoT Sensors / Citizen Report / Satellite / Open Data
                                     │
                                     ▼
                      TẦNG DỮ LIỆU ĐO ĐẠC (MEASUREMENT)
                    PM2.5 / PM10 / Noise / Raw Telemetry
                                     │
                             (Vượt ngưỡng / Phản ánh)
                                     ▼
                      TẦNG DẤU HIỆU (ENVIRONMENTAL SIGNAL)
                      Evidence + Location (WGS84) + Time
                                     │
                          (Gom cụm theo không-thời gian)
                                     ▼
                   TẦNG SỰ KIỆN (ENVIRONMENTAL EVENT)
                   Core Aggregate Root (EVT-2026-XXXXX)
                                     │
                 ┌───────────────────┴───────────────────┐
                 │                                       │
         [Xem xét & Xác minh]                    [Không có căn cứ]
         Triage / Field Verify                           │
                 │                                       ▼
        [verified_signal]                           [dismissed]
                 │
       CẦN CAN THIỆP PHÍA NGOÀI?
                 │
       ┌─────────┴─────────┐
      KHÔNG               CÓ
       │                   │
[Tự xử lý nội bộ]   [Chuẩn bị Hồ sơ Số Dossier A4]
(CLB ra quân)       (Tổng hợp bằng chứng SHA-256)
       │                   │
       │            [Chuyển tiếp 1022 / iHanoi / BQLDA]
       │            (Kênh tiếp nhận chính thức)
       │                   │
       └─────────┬─────────┘
                 ▼
     [Community Follow-up 24h-48h]
     (Quay lại hiện trường chụp ảnh After)
                 │
       ┌─────────┴─────────┐
    TỐT HƠN             CHƯA ĐẠI YÊU CẦU
       │                   │
  [resolved]       [action_in_progress]
       │
    [closed]
       │
[Cấp Green Credits & QR Certificate]
```

---

## 5. Lộ Trình Tiến Hóa Tích Hợp Handoff (Handoff Evolution Roadmap)

1. **Manual Handoff (Giai đoạn 1 — Hiện tại)**: Xuất Structured Dossier PDF A4 kèm mã QR tra cứu. Điều phối viên nộp thủ công qua Cổng 1022 / ứng dụng iHanoi / gửi trực tiếp BQLDA.
2. **Assisted Handoff (Giai đoạn 2)**: Tính năng 1-Click Copy định dạng chuẩn hành chính của 1022/iHanoi, tự động nén ảnh < 300KB và xóa EXIF bảo mật.
3. **Integration Gateway (Giai đoạn 3)**: Dispatcher tự động gửi thông tin qua Webhooks, Secure Email hoặc Zalo OA tới đơn vị quản lý kèm mã băm SHA-256 đối chứng.
4. **Official API Integration (Giai đoạn 4)**: Tích hợp Open API / e-Gov API hai chiều với hệ thống chính quyền đô thị thông minh khi có biên bản ghi nhớ hợp tác (MOU).
5. **Two-Way Status Synchronization (Giai đoạn 5)**: Đồng bộ trạng thái 2 chiều tự động: Khi cơ quan chức năng cập nhật tiến độ xử lý, cộng đồng được kích hoạt chu trình tái kiểm định đối chứng thực địa.

---

## 6. Nguyên Tắc Nghiệp Vụ Bất Biến (Domain Invariants)

1. **Measurement ≠ Signal ≠ Event**: Phân tách tuyệt đối 3 tầng dữ liệu; không nhảy cóc từ một số đo thô thành một sự kiện xử lý mà chưa qua phân tích tín hiệu và xác thực.
2. **Observation ≠ Case/Event**: Ghi nhận từ công dân là tín hiệu khởi đầu; chỉ khi được xác minh và gom nhóm mới trở thành Sự kiện Môi trường theo dõi dài hạn.
3. **Community Follow-up Target 24h - 48h**: Là chỉ số đo lường trách nhiệm của cộng đồng (tỷ lệ điểm được thanh niên quay lại kiểm tra trong 24h-48h), không phải áp đặt thời gian giải quyết cho cơ quan nhà nước.
4. **Bảo Toàn Minh Chứng (Tamper-Evident SHA-256)**: Mọi hình ảnh và hồ sơ số đều gắn mã hash SHA-256 để phát hiện việc chỉnh sửa hoặc giả mạo sau khi nộp.
5. **Khuyến Khích Xanh (Green Credits Policy)**: DustGuard xác thực lịch sử tham gia, thời lượng hoạt động thực tế qua QR và mã băm; quyền quy đổi điểm rèn luyện hoặc tín chỉ học tập thuộc về từng trường đại học / đơn vị giáo dục.
6. **Hoạt Động Không Phụ Thuộc Cảm Biến (Zero-IoT Resilience)**: Nền tảng vận hành 100% khi có 0 cảm biến IoT; dữ liệu cảm biến là nguồn bổ trợ tăng cường độ tin cậy.
