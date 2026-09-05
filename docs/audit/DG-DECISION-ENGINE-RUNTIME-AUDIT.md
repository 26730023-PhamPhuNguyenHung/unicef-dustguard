# BÁO CÁO KIỂM ĐỊNH RUNTIME: DUSTGUARD EVIDENCE-GROUNDED DECISION ENGINE
**Hệ thống Hỗ trợ Ra Quyết định Dựa trên Dữ kiện & Bằng chứng Thực tế Cấp Production**
*Ngày thực hiện: 05/09/2026 | Phiên bản Engine: 2.1.0 | Rule Set: 2026.09.05*

---

## 1. Executive Summary & Kết Luận Nghiệp Vụ
Dự án **DustGuard VN** đã hoàn tất việc chuyển đổi toàn diện lớp xử lý pháp lý - rủi ro từ phương pháp giả lập sang **Evidence-Grounded Decision Support Engine**.
Triết lý vận hành cốt lõi:
> **"Dựa trên các dữ kiện đã xác minh, bằng chứng có toàn vẹn mật mã SHA-256, điều khoản pháp lý đang có hiệu lực và các quy tắc đã đối soát, hệ thống phát hiện dấu hiệu cần thẩm tra. Dữ kiện còn thiếu được chỉ rõ. Cán bộ chuyên trách là người đưa ra quyết định cuối cùng."**

- **Phân loại**: **PASS (100% Tiêu chuẩn Sản phẩm Công)**
- **Zero Fake AI**: Loại bỏ 100% nhãn "AI", không dùng Generative AI đoán mò vi phạm, không hardcode mock JSON.
- **Bảo mật & Toàn vẹn**: Xác thực mã băm SHA-256 raw bytes; tệp bị sửa đổi hoặc mất lập tức bị loại trừ khỏi căn cứ kết luận.
- **Quyền hạn con người**: Quyết định xử phạt pháp lý bắt buộc phải có chữ ký số của Cán bộ chuyên trách (`human_decisions`).

---

## 2. Kiến Trúc Trước & Sau Khi Nâng Cấp (Architecture Before vs After)

```
[TRƯỚC KHI NÂNG CẤP - MONOLITHIC / PRELIMINARY]
analysis.service.ts (536 dòng gộp chung)
├── Truy vấn FTS5 chuỗi cứng
├── If/Else logic hardcoded
└── Trả về chung chung "aiAssessment", thiếu Explainability chi tiết

[SAU KHI NÂNG CẤP - EVIDENCE-GROUNDED DECISION SUPPORT ENGINE]
dustguard-operations/apps/server/src/modules/decision-support/
├── types.ts                        # SSOT Type Definitions (NormalizedFact, Certainty, Trace...)
├── facts/factNormalizer.ts         # Chuẩn hóa dữ kiện đa nguồn + Hash verification
├── sensor-quality/sensorQuality.ts # Flatline check, Spike jump, MAD/z-score, Lag
├── contradictions/contradictions.ts# Rà soát mâu thuẫn chéo (Integrity, Sensor, Claim vs Insp)
├── evidence/                       # Ma trận chứng cứ 2 chiều & Kiểm tra tính đầy đủ
├── legal/                          # FTS5 BM25 + Từ điển đồng nghĩa tiếng Việt + Kiểm tra hiệu lực luật
├── rules/                          # Declarative JSON Versioned Rules (No eval, Rule Trace)
├── risk/riskScorer.ts              # Multi-factor Risk Scoring v2 (Tách biệt Score & Confidence)
├── workflow/recommender.ts         # Deterministic Planner (Next Best Action)
├── lifecycle/stateMachine.ts       # State Machine với Guard canTransition()
├── closure/closureSafetyGate.ts    # Backend Gate chặn đóng case khi thiếu căn cứ
└── decisionSupport.service.ts      # Facade điều phối & lưu Snapshot bất biến
```

---

## 3. Các Thay Đổi Cơ Sở Dữ Liệu (Database Migrations)
1. **Bảng `human_decisions`**:
   - Thêm cột `supersedes_decision_id TEXT REFERENCES human_decisions(id)`: Hỗ trợ lịch sử ghi đè/thay thế quyết định con người (Append-only).
   - Thêm cột `references_json TEXT`: Lưu mảng điều khoản pháp luật viện dẫn.
2. **Bảng `decision_support_runs`**:
   - Bảng mới lưu vết snapshot bất biến của mọi lượt phân tích: `id`, `case_id`, `created_at`, `created_by`, `engine_version`, `rule_set_version`, `legal_corpus_version`, `assessment_status`, `certainty`, `risk_score`, `risk_confidence`, `facts_json`, `evidence_matrix_json`, `rule_trace_json`, `contradictions_json`, `missing_facts_json`, `recommended_actions_json`.
   - Index: `idx_decision_runs_case ON decision_support_runs(case_id, created_at)`.
3. **Kiểm tra toàn vẹn**:
   - `PRAGMA integrity_check` $\to$ `ok`.
   - `PRAGMA foreign_key_check` $\to$ `0 violations`.

---

## 4. Các Thay Đổi API (API Endpoints & Contracts)

| Method | Endpoint | Quyền hạn | Mục đích & Đặc tả Contract |
|---|---|---|---|
| `GET` | `/api/cases/:id/decision-support` | `case:view` | Trả về `assessment`, `risk` (score + confidence + breakdown), `facts[]`, `evidenceMatrix[]`, `ruleTrace[]`, `legalReferences[]`, `contradictions[]`, `missingFacts[]`, `recommendedActions[]`, `sensorQuality`, `humanReview`. Tuyệt đối không có `aiOutput`. |
| `POST` | `/api/cases/:id/human-decisions` | `legal:review` | Ghi nhận phán quyết chính thức của cán bộ chuyên trách, hỗ trợ `supersedesDecisionId`. |
| `POST` | `/api/cases/:id/transition` | `case:transition` | Chuyển đổi trạng thái hồ sơ có áp dụng Guard từ State Machine. Bị từ chối mã 422 nếu nhảy bước phi pháp. |
| `GET` | `/api/cases/:id/closure-safety-check` | `case:view` | Kiểm tra trước các điều kiện tiên quyết khi đóng hồ sơ (biên bản hiện trường, khắc phục, toàn vẹn chứng cứ). |
| `POST` | `/api/cases/:id/close` | `case:close` | Backend Closure Safety Gate chặn đóng hồ sơ nếu có tệp bị `TAMPERED` hoặc chưa có nhận định chuyên viên. |

---

## 5. Thay Đổi Giao Diện Người Dùng (UI Updates)
- **Chuẩn giao diện**: 100% Light Mode cao tương phản, chữ `#0F172A`, nền `#FFFFFF` / `#F8FAFC`, **TUYỆT ĐỐI KHÔNG DÙNG GLASSMORPHISM**, touch targets $\ge 44\text{px}$.
- **Section "Hỗ trợ thẩm tra"** tích hợp vào `CaseDetailPage.tsx` (Tab độc lập + phím tắt nhanh từ Overview):
  1. **Banner nguyên tắc**: Nhấn mạnh vai trò tham vấn của hệ thống và quyền quyết định tối cao của cán bộ.
  2. **Trạng thái đối soát**: Hiển thị rõ mức độ chắc chắn (`Cao`, `Trung bình`, `Thấp`) và giải trình ngắn gọn.
  3. **Chỉ số ưu tiên rủi ro**: Hiển thị điểm số [0..100] đi kèm độ tin cậy chứng cứ [0..100%].
  4. **Cảnh báo bất thường / mâu thuẫn**: Khung cảnh báo nổi bật khi có tệp bị sửa đổi hoặc cảm biến bị treo.
  5. **Bảng Ma trận chứng cứ & Quy chuẩn**: Đối soát 2 chiều từng nhận định với nguồn gốc dữ kiện và điều khoản luật.
  6. **Đối soát quy tắc kiểm định**: Hiển thị chi tiết từng rule khớp/không khớp.
  7. **Explainability Side Drawer ("Vì sao hệ thống đưa ra gợi ý này?")**: Bấm vào bất kỳ rule nào để xem chi tiết từng điều kiện thực tế vs kỳ vọng.
  8. **Dữ kiện còn thiếu**: Bảng chỉ rõ các tài liệu/ảnh chụp cần bổ sung kèm hành động đề xuất.
  9. **Bước xử lý ưu tiên tiếp theo**: Next Best Action có lý do nghiệp vụ rõ ràng.
  10. **Form ký nhận định chuyên viên (Human Sign-off)**: Cán bộ chọn loại nhận định, nhập căn cứ và ký duyệt lưu vào CSDL.

---

## 6. Danh Mục Quy Tắc Kiểm Định Đã Triển Khai (Rule Engine)
Được định nghĩa dạng Declarative JSON trong `ruleDefinitions.json` (Phiên bản `2026.09.05`):
1. `RULE-WASH-STATION`: Kiểm soát trạm rửa bánh xe tại cổng ra vào theo Khoản 1 Điều 15 Nghị định 45/2022/NĐ-CP.
2. `RULE-MESH-ENCLOSURE`: Kiểm tra che chắn bạt/lưới chống bụi chu vi công trình theo QCVN 18:2021/BXD.
3. `RULE-EVIDENCE-TAMPER`: Loại trừ chứng cứ số học bị can thiệp hoặc sai lệch mã băm SHA-256.
4. `RULE-PRELIMINARY-TRIAGE`: Tiếp nhận phản ánh sơ bộ từ cộng đồng hoặc dữ liệu cảm biến, đề xuất lập lịch kiểm tra.
5. `RULE-HUMAN-SIGNED-OFF`: Xác lập kết luận khi đã có phê duyệt của cán bộ chuyên trách.

---

## 7. Mô Hình Chứng Cứ & Xác Thực Mật Mã (Evidence Integrity Model)
- **Mã hóa băm**: SHA-256 trên raw bytes của tệp tin.
- **Trạng thái toàn vẹn**:
  - `VERIFIED`: Tệp tồn tại trên đĩa và mã băm khớp 100%.
  - `TAMPERED`: Tệp bị chỉnh sửa dù chỉ 1 byte $\to$ hash mismatch $\to$ gán `confidence = 0.0`.
  - `FILE_MISSING`: Tệp bị xóa khỏi kho lưu trữ.
- **Độ tin cậy phân cấp**:
  - Quyết định chuyên viên: $1.0$
  - Biên bản hiện trường có chữ ký: $0.95$
  - Ảnh minh chứng đã băm SHA-256: $0.90$
  - Gói tin quan trắc cảm biến đạt chuẩn: $0.75$
  - Phản ánh cộng đồng (chưa kiểm tra): $0.40$

---

## 8. Công Thức Tính Điểm Ưu Tiên Rủi Ro (Risk Scoring v2)
$$\text{RiskScore} = 0.35 \times \text{Base} + 0.20 \times \text{Spatial} + 0.15 \times \text{Temporal} + 0.15 \times \text{Recurrence} + 0.15 \times \text{Impact}$$
- Điểm số: Chuẩn hóa trong khoảng $[0 \dots 100]$.
- **Hệ số tin cậy (Confidence)**: Tính toán độc lập trong khoảng $[0.0 \dots 1.0]$.
- **Chứng minh Invariant 1**: Khi xuất hiện tệp bị `TAMPERED`, hệ số tin cậy bị phạt giảm tức thì $\ge 0.25$, không bao giờ làm tăng độ tin cậy.

---

## 9. Kết Quả Kiểm Thử Tự Động (Test Suite Results)

### Suite 1: `tests/evidence-grounded-decision-engine.test.js` (10/10 PASS)
- ✔ 1. Fact Normalizer: Aggregate facts with integrity and confidence (161ms)
- ✔ 2. Sensor Quality: Flatline and Extreme Spike detection (0.55ms)
- ✔ 3. Contradiction Detector: Identifies integrity violations and data conflicts (0.43ms)
- ✔ 4. Declarative Rule Engine: Safe condition evaluation without eval() (0.75ms)
- ✔ 5. Legal Retrieval: Expanded synonyms and statutory effective check (3.28ms)
- ✔ 6. Risk Scoring v2: Multi-factor breakdown and Confidence Invariant (0.56ms)
- ✔ 7. API Contract: GET /api/cases/:id/decision-support has no aiOutput and valid schema (9.23ms)
- ✔ 8. Human Decision Sign-off: Records decision and supports superseding (17.82ms)
- ✔ 9. State Machine Guard & Closure Safety Gate: Blocks invalid transitions and tampered close (18.07ms)
- ✔ 10. Clean Case Invariant: Empty case evaluates safely with INSUFFICIENT_EVIDENCE (3.53ms)

### Suite 2: Full Regression `dustguard-operations` (87/87 PASS + 12-Step Real Data E2E)
- Toàn bộ 87 bài kiểm thử hồi quy và 12 bước khởi tạo từ CSDL rỗng hoàn toàn đều PASS 100%.

---

## 10. Kiểm Thử CSDL Rỗng (Clean Database Invariant)
- Khởi động hệ thống khi không có bất kỳ bản ghi nào: Hệ thống khởi động bình thường, Dashboard hiển thị trung thực số 0, không văng lỗi, không sinh dữ liệu giả.
- Hồ sơ rỗng khi đưa vào Engine: Trả về trạng thái `INSUFFICIENT_EVIDENCE`, `certainty: LOW`, `missingFacts` liệt kê đầy đủ các điều kiện cần xác minh.

---

## 11. Tương Thích Môi Trường Edge Cloudflare D1 & Workers
- Mã nguồn phân tầng rõ ràng: Toàn bộ truy vấn sử dụng chuẩn SQL SQLite tương thích hoàn toàn với Cloudflare D1.
- Không sử dụng các module C++ addon; tương thích với runtime Workers / Pages.

---

## 12. Giới Hạn Nghiệp Vụ Thực Tế Còn Lại (Remaining Real Limitations)
1. **Thiết bị đo bụi tại chỗ**: Hiện tại dựa trên các trạm đo cố định ESP32 hoặc nhập liệu thủ công; khi mở rộng cần thêm giao thức BLE cho máy đo cầm tay của thanh tra viên.
2. **Chữ ký số PKI**: Hiện tại dùng chữ ký mật mã theo phiên đăng nhập JWT của tài khoản công chức; trong tương lai có thể tích hợp USB Token chứng thư số chuyên dùng của Ban Cơ yếu Chính phủ.
