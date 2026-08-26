# CURRENT STATE — DUSTGUARD VN (10 SUBAGENTS UI/UX REBUILD & WARD SSOT STANDARDIZED)

## 1. Architecture & Verification Summary
- **Verification Status**: **71/71 test files passing (100% PASS, 557+ tests)** (0 failures, 0 regressions, 18.4s).
- **Route Crawler & Visual QA**: **82/82 routes passing 100%**, 0 console errors, 0 blank screens, 0 unhandled promise rejections.
- **Vite Build**: Production bundle biên dịch thành công 100% trong **3.34s** (0 errors).
- **Đơn vị hành chính SSOT**: Chuẩn hóa 100% sang **Phường / Xã (Ward)** trực thuộc Tỉnh/Thành phố, loại bỏ toàn bộ khái niệm trung gian "Quận/Huyện" trên CSDL D1, API, Dropdown, SLA Ranking và Document Templates.
- **Database SSOT**: Cloudflare D1 persistent database (`env.DB` / `dev.db`) tích hợp transaction batching, SQL migrations, error taxonomy, RBAC middleware enforcement và idempotency store.
- **Triết lý thiết kế Civic Tech**: High-Contrast Light Mode (`#FDFBF7` cream, `#231b14` ink, `#0d6f64` teal, `#9f241f` seal red), **tuyệt đối 0% glassmorphism**, touch target ≥ 44px trên toàn bộ viewport mobile (360px - 430px).

## 2. 10 Core Domain Groups Backend Hardening
1. **Group 01: Environmental Categories & Regulatory Rules**
   - SSOT Model: 7 danh mục môi trường hoàn chỉnh kèm căn cứ pháp lý (QCVN 05:2023, QCVN 18:2021, NĐ 45/2022, QCVN 08:2023, Chỉ thị 19/CT-TTg, Luật BVMT 2020), yêu cầu minh chứng tối thiểu, thời hạn phản hồi tiêu chuẩn.
   - Endpoints: `GET /api/environmental-categories`, `GET /api/environmental-categories/:id`.
2. **Group 02: Observation Write & Persistence**
   - Mã ghi nhận va chạm an toàn: `OBS-YYYY-XXXX`.
   - Idempotency key protection (`Idempotency-Key` / `x-idempotency-key`).
   - Validate GPS tọa độ lãnh thổ Việt Nam (8.0-24.0°N, 102.0-110.0°E), độ chính xác ≤ 50m.
   - Lưu trữ SHA-256 evidence hash vào bảng `observation_evidence`.
3. **Group 03: Observation Detail & Aggregate Read Model**
   - Read aggregate trả về: `observation`, `category` (kèm quy chuẩn pháp lý), `evidence` (kèm trạng thái SHA-256), `timeline` (sắp xếp theo thời gian), `integrity` (trạng thái toàn vẹn dữ liệu).
   - Endpoints: `GET /api/observations/:id`, `GET /api/observations/:id/timeline`.
4. **Group 04: Follow-up 24h / 48h Decision Matrix**
   - `FollowUpDecisionService`: Đánh giá kết quả (BETTER có ảnh -> RESOLVED; BETTER thiếu ảnh -> NEEDS_FOLLOWUP; UNCHANGED x2 -> ESCALATED; WORSE -> READY_FOR_HANDOFF).
   - Cập nhật nguyên tử trạng thái quan sát và ghi nhận audit log.
   - Endpoint: `POST /api/follow-ups`, `GET /api/observations/:id/follow-ups`.
5. **Group 05: Handoff Dossier & Authority Dispatch**
   - `buildCanonicalHandoffPacket` & deterministic `canonicalHash` (SHA-256).
   - State machine: `PREPARED` -> `SUBMITTED` -> `ACKNOWLEDGED` -> `RESOLVED` / `CLOSED_NO_ACTION`.
   - Endpoints: `POST /api/handoffs`, `GET /api/handoffs/:id`, `POST /api/handoffs/:id/submit`, `POST /api/handoffs/:id/acknowledge`, `GET /api/handoffs/:id/packet`.
6. **Group 06: Community Impact Metrics Lineage**
   - 100% dynamic metrics tính từ SQL lineage trên D1 (không hardcode hệ số ảo).
   - Trả về `metrics`, `period`, `definitions` (SSOT giải nghĩa công thức).
   - Endpoint: `GET /api/community/impact`.
7. **Group 07: Campaigns & Community Action**
   - Bảng `campaigns` lưu trữ D1, chống tham gia trùng lặp (`joinCampaign`).
   - Tính toán động tác động chiến dịch `getCampaignImpact`.
   - Endpoints: `GET /api/campaigns`, `GET /api/campaigns/:id`, `POST /api/campaigns/:id/join`, `GET /api/campaigns/:id/impact`.
8. **Group 08: Explainable Dust Risk Engine**
   - `DustRiskEngine` SSOT v2.0: Phân tích 4 thành phần (Telemetry 40%, Observations 25%, Proximity 20%, Compliance 15%).
   - Kiểm tra sức khỏe cảm biến: Phạt giảm confidence khi cảm biến bị đơ (flatline) hoặc quá hạn (stale > 2h).
   - Endpoints: `GET /api/v1/public/sites`, `GET /api/sites/:id/risk-analysis`.
9. **Group 09: Youth Credit & HMAC Certificate**
   - Tích hợp bảng D1 `youth_activities` và `youth_certificates`.
   - Ký số HMAC-SHA256 bảo đảm tính toàn vẹn và chống làm giả.
   - Quy trình thu hồi chứng chỉ minh bạch cho Admin (`POST /api/admin/youth/certificate/:id/revoke`).
   - Endpoints: `POST /api/youth/certificate`, `GET /api/youth/certificate/:code`, `GET /api/youth/certificate/:code/verify`.
10. **Group 10: OpenAPI Contract Governance**
    - `scripts/audit-api-contract.js`: Đồng bộ 100% giữa 186 Worker routes và OpenAPI 3.0.3 spec.
    - 0 missing routes, 0 duplicate operation IDs, 0 schema errors.

## 3. Production Proof Verification Suite V2
- `scripts/verify-live-api-outputs.js`: Level 5 Proof (Setup -> Act -> Assert HTTP -> Reload DB -> Assert Persistence -> Assert Idempotency -> Assert Audit -> Assert Negative Case -> Cleanup).
