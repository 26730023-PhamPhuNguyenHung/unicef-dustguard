# PRODUCT_LANGUAGE.md — Canonical Product Vocabulary & Language SSOT

Tài liệu này xác lập bộ từ vựng chuẩn (**Canonical Vocabulary**) cho toàn bộ hệ sinh thái **DustGuard VN**.  
Mục tiêu: Đảm bảo tính nhất quán tuyệt đối về mặt ngôn ngữ từ **Landing Page → Demo Hub → 5 Role Workspaces → API & Database Layer**.

---

## 1. Triết Lý Ngôn Ngữ Sản Phẩm (Product Voice & Invariants)

1. **Từ ngữ Đời thường & Thực tế**: Sử dụng ngôn ngữ hành động, ngắn gọn, dễ hiểu cho người dân và cán bộ tác nghiệp. Tuyệt đối không dùng thuật ngữ kỹ thuật trừu tượng trên UI (`DAG`, `SHA-256 HMAC`, `Telemetry stream`, `Risk Engine`, `Triage Vector`).
2. **Không coi Risk Score là phán quyết**: Không dùng từ "Điểm vi phạm", "Điểm nguy cơ", "Kết luận vi phạm bởi AI". Thay vào đó dùng **"Mức độ ưu tiên"**, **"Lý do cần chú ý"**, **"Tín hiệu bất thường"**.
3. **Thống nhất định danh thực thể cốt lõi**:
   - Tiếng Việt UI chuẩn: **"Vụ việc"** (cho các Case theo dõi xử lý) hoặc **"Phản ánh" / "Ghi nhận"** (cho Citizen Observations).
   - "Hồ sơ" chỉ dùng khi nói về tập tài liệu pháp lý / hồ sơ nghiệp vụ (`Case Dossier`).
   - Cấm dùng lẫn lộn: *Ticket*, *Incident*, *Issue*, *Complaint*, *Task* một cách tùy tiện.

---

## 2. Bảng Đối Chiếu Thực Thể & Khái Niệm Cốt Lõi (Core Entity Dictionary)

| Khái niệm cốt lõi | Code / Database Identifier | Tiếng Việt UI (Canonical SSOT) | Tiếng Anh UI | Định nghĩa & Ngữ cảnh sử dụng |
|---|---|---|---|---|
| **Tín hiệu ban đầu** | `signal` / `observation` / `alert` | **Tín hiệu** / **Ghi nhận** | Signal / Observation | Dữ liệu phát hiện ban đầu từ cảm biến IoT hoặc phản ánh của công dân/tình nguyện viên. |
| **Vụ việc** | `case` | **Vụ việc** | Case | Hồ sơ theo dõi tác nghiệp xuyên suốt 7 bước từ tiếp nhận đến xử lý và tái kiểm. |
| **Hồ sơ tài liệu** | `dossier` | **Hồ sơ vụ việc** / **Hồ sơ pháp lý** | Case Dossier | Bộ biên bản, ảnh bằng chứng số và kết quả tái kiểm được đóng gói để lưu trữ/in ấn. |
| **Nhiệm vụ** | `task` / `action` | **Nhiệm vụ** / **Yêu cầu xử lý** | Task / Action Item | Công việc cụ thể được giao cho cán bộ khảo sát hoặc nhà thầu thực hiện. |
| **Công trình** | `site` / `construction_site` | **Công trình** | Construction Site | Địa điểm thi công xây dựng đang được giám sát môi trường. |
| **Đơn vị thi công** | `contractor` | **Đơn vị xử lý** / **Nhà thầu** | Contractor / Remediation Unit | Đơn vị chịu trách nhiệm thực thi các biện pháp giảm bụi tại hiện trường. |
| **Tái kiểm** | `reinspection` / `verification` | **Tái kiểm thực địa** | Field Reinspection | Bước kiểm tra lại hiện trường (sau 24–48h) để đối chứng xem nhà thầu đã khắc phục thật chưa. |
| **Bằng chứng** | `evidence` | **Bằng chứng thực địa** | Field Evidence | Ảnh chụp trước/sau có gắn tọa độ GPS và thời gian xác thực. |
| **Điểm ưu tiên** | `priority_score` / `risk_score` | **Mức ưu tiên** (hạ thành supporting signal) | Priority Level | Điểm số gợi ý thứ tự xem xét (0–100), không phải kết luận vi phạm. |
| **Kết quả** | `outcome` | **Kết quả xử lý** | Outcome | Tình trạng cuối cùng sau khi tái kiểm (Đạt / Cần làm lại / Đã đóng). |

---

## 3. Bảng Mapping Trạng Thái Vụ Việc (Case Lifecycle Status SSOT)

| Database Status Enum | Tiếng Việt UI (Canonical) | Tiếng Anh UI | Màu sắc Semantic | Ý nghĩa nghiệp vụ | Hành động tiếp theo (Next Action) |
|---|---|---|---|---|---|
| `RECORDED` / `NEW` | **Mới ghi nhận** | Recorded | Xám đậm (`#5C5550`) | Tín hiệu/phản ánh vừa vào hệ thống | Cần xác minh thông tin ban đầu |
| `TRIAGED` / `VERIFIED` | **Đã xác minh** | Verified | Xanh lam (`#2563EB`) | Đã kiểm tra tính xác thực của ảnh & vị trí | Phân công cán bộ phụ trách |
| `ASSIGNED` / `NOTICE_SENT` | **Đã phân công** / **Đã yêu cầu xử lý** | Assigned / Dispatched | Tím (`#7C3AED`) | Đã giao nhiệm vụ cho nhà thầu/cán bộ | Chờ nhà thầu triển khai khắc phục |
| `IN_PROGRESS` / `INSPECTION` | **Đang xử lý** / **Đang khảo sát** | In Progress | Vàng cam (`#D97706`) | Nhà thầu đang thực hiện che chắn/tưới nước | Cán bộ kiểm tra tiến độ |
| `PENDING_REVIEW` / `REMEDIATION` | **Chờ tái kiểm** | Awaiting Verification | Cam đậm (`#EA580C`) | Nhà thầu đã nộp ảnh minh chứng khắc phục | Cán bộ/Tình nguyện viên tới tái kiểm |
| `COMPLETED` / `CLOSED` | **Đã hoàn tất** / **Đạt chuẩn** | Resolved / Mitigated | Xanh lá (`#16A34A`) | Tái kiểm đạt, nồng độ bụi an toàn, đóng hồ sơ | Không còn hành động tồn đọng |
| `REJECTED` / `REOPENED` | **Yêu cầu làm lại** / **Mở lại** | Needs Rework | Đỏ tươi (`#DC2626`) | Tái kiểm không đạt hoặc phản ánh không đúng | Yêu cầu khắc phục bổ sung trong 24h |

---

## 4. Bảng Mapping Trạng Thái Ghi Nhận Công Dân (Observation Status SSOT)

| Observation Enum | Tiếng Việt UI (Canonical) | Ý nghĩa với người dân |
|---|---|---|
| `SUBMITTED` | **Đã tiếp nhận** | Phản ánh đã gửi thành công vào hệ thống. |
| `UNDER_REVIEW` | **Đang xác minh** | Đội ngũ đang kiểm tra hình ảnh và vị trí phản ánh. |
| `IN_ACTION` | **Đã chuyển xử lý** | Đã yêu cầu đơn vị thi công tại khu vực khắc phục. |
| `VERIFYING` | **Chờ kiểm tra lại** | Đơn vị đã báo cáo khắc phục, đang tái kiểm thực tế. |
| `RESOLVED` | **Đã xử lý xong** | Hiện trường đã được kiểm tra đạt chuẩn môi trường. |

---

## 5. Quy Tắc Trình Bày Mức Độ Ưu Tiên (Priority Presentation Rules)

Tuyệt đối **KHÔNG** hiển thị dạng:
❌ `92/100 — NGUY CƠ NGUY HIỂM (CRITICAL RISK)`  
❌ `AI kết luận công trình vi phạm nghiêm trọng`

Thay vào đó, hiển thị dạng:
✅ **Cần ưu tiên xử lý** (Kèm danh sách lý do cụ thể):
- *Nhiều phản ánh liên tiếp từ người dân trong 2 giờ qua*
- *Nằm trong bán kính 100m cạnh trường học*
- *Nồng độ PM2.5 vượt ngưỡng 120 µg/m³*
- *Chưa có cán bộ tiếp nhận khảo sát*

*(Chi tiết điểm số `92/100` chỉ xuất hiện trong phần chi tiết kỹ thuật / tooltip khi người dùng muốn xem sâu).*

---

## 6. Vai Trò 5 Nhóm Người Dùng (Role Descriptions)

| Nhóm người dùng | Role ID | Nhiệm vụ chính trong vòng đời sản phẩm | Câu khẩu hiệu màn hình |
|---|---|---|---|
| **Công dân** | `citizen` | Tạo **SIGNAL** & theo dõi phản ánh của mình đến khi có kết quả | *"Phát hiện bụi. Gửi nhanh. Theo dõi đến cùng."* |
| **Cộng đồng / Tình nguyện** | `community` | Khảo sát thực địa, bổ sung **EVIDENCE** và đối chứng hiện trường | *"Chung tay giám sát không khí khu dân cư."* |
| **Cán bộ quản lý** | `staff` | **UNDERSTAND**, **ROUTE** và điều phối tái kiểm (**VERIFY**) | *"Nắm việc cần làm. Điều phối nhanh. Nghiệm thu chuẩn."* |
| **Đơn vị xử lý / Nhà thầu** | `contractor` | Thực thi **ACTION** và nộp minh chứng Before/After | *"Nhận yêu cầu rõ ràng. Khắc phục đúng hạn."* |
| **Lãnh đạo / Quản trị** | `admin` / `executive` | Giám sát **FOLLOW-UP**, theo dõi **OUTCOME** và giải quyết nghẽn | *"Bức tranh toàn cảnh về tiến độ và kết quả môi trường."* |
