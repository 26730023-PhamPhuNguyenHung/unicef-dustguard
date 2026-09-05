# DUSTGUARD VN — KIỂM TOÁN THỰC TẾ TÍNH NĂNG TRÍ TUỆ NHÂN TẠO (AI ACTUAL USAGE AUDIT)

> **Mã tài liệu**: `DG-AUDIT-AI-ACTUAL-USAGE`  
> **Thời điểm xác lập**: 05/09/2026  
> **Nguyên tắc sống còn**: **KHÔNG FAKE AI; KHÔNG GỌI SEARCH / RULE ENGINE LÀ AI; TRUNG THỰC TUYỆT ĐỐI VỀ MẶT CÔNG NGHỆ**.

---

## 1. TỔNG QUAN KIỂM ĐỊNH (EXECUTIVE FORENSIC VERDICT)

Qua rà soát toàn bộ 100% tệp mã nguồn của hệ thống DustGuard VN:
1. **Không có mô hình ngôn ngữ lớn (LLM) bí mật hay API bên thứ ba (OpenAI / Claude / Gemini) gọi trực tiếp trong luồng runtime chính**: Hệ thống hoạt động hoàn toàn tự chủ (Self-contained), ngoại tuyến, không phát sinh chi phí token và không rò rỉ dữ liệu công dân ra máy chủ nước ngoài.
2. **Bản chất thật của "Trợ lý Phân tích Pháp lý" (Legal Intelligence)**:
   - **Tầng 1 - Tổng hợp Dữ kiện (Fact Aggregation)**: Thuần túy đọc từ CSDL SQLite SSOT (`claims`, `observations`, `telemetry`, `evidence`, `human_decisions`). **0% AI**.
   - **Tầng 2 - Tra cứu Điều khoản Pháp luật (Statutory Retrieval)**: Sử dụng SQLite Full-Text Search FTS5 (`legal_sections_fts`) tính điểm xếp hạng theo thuật toán **BM25**. **Đây là Search Engine quy chuẩn, không phải Generative AI**.
   - **Tầng 3 - Đối soát Quy chuẩn Vi phạm (Rule Matching Engine)**: Hệ thống chuyên gia luật (Expert Rule Engine) dựa trên cây quyết định tất định (Deterministic Decision Tree) đối chiếu sự kiện thực địa với các ngưỡng của Nghị định 45/2022/NĐ-CP và QCVN 18:2021/BXD. **Không phải Machine Learning hay Deep Learning**.
   - **Tầng 4 - Khuyến nghị Trình tự Xử lý (Workflow Recommender)**: Máy trạng thái hữu hạn (Finite State Machine) xác định bước tiếp theo dựa trên dữ kiện còn thiếu (`MissingFact`).
3. **Quy định đạo đức công nghệ (Civic Ethics)**:
   - Hệ thống **tuyệt đối không cho phép "AI tự động phán quyết" hay "AI tự động xử phạt"**.
   - Quyền kết luận pháp lý duy nhất thuộc về con người (Human-in-the-loop: Chuyên viên pháp chế & Lãnh đạo giám sát).

---

## 2. BẢNG BÓC TÁCH TÍNH NĂNG "AI" TRONG CODEBASE (AI CLAIMS VS REALITY)

| Thành phần trong Code | Vị trí tệp | Nhãn hiển thị ban đầu | Bản chất công nghệ thực tế | Mức độ trung thực | Hành động chuẩn hóa (Remediation) |
|---|---|---|---|:---:|---|
| **Legal Provision Search** | `apps/server/src/modules/legal/` | "AI Legal Search" | **SQLite FTS5 Full-Text Search (BM25)** trên bảng ảo `legal_sections_fts` | Sai lệch (Overclaim) | Đổi nhãn thành: **"Tra cứu Pháp điển FTS5 Toàn văn"** |
| **Case Analysis Engine** | `apps/server/src/modules/cases/analysis.service.ts` | `LegalAIOutput`, `ai_assessment` | **Bộ quy tắc Đối soát Dữ kiện Tất định (Deterministic Fact-Rule Engine)** | Sai lệch (Overclaim) | Gắn kèm Banner Quy chế Thẩm tra; làm rõ đây là Trợ lý Đối soát Quy chuẩn (Rule-based Assistant), không phải AI phán quyết |
| **Dust Risk Score** | `apps/web/src/pages/LandingPage.tsx` | "Điểm rủi ro AI" | **Công thức hàm trọng số đại số (Weighted Risk Formula)**: $0.4 \times \text{AQI} + 0.3 \times \text{Complaints} + 0.3 \times \text{Proximity}$ | Sai lệch (Overclaim) | Định danh chính xác: **"Chỉ số Rủi ro Môi trường (Heuristic Score 0-100)"** |
| **Băm Minh Chứng Hiện Trường** | `apps/web/src/utils/crypto.ts` | "AI Vision Verification" | **Thuật toán Băm Mật mã Học SHA-256 thuần FIPS 180-4** trên mảng byte tệp | Sai lệch (Overclaim) | Định danh chính xác: **"Niêm phong Bằng chứng Số SHA-256"** |
| **Đánh giá Tiêu chuẩn Thi công** | `apps/web/src/pages/FieldInspectionPage.tsx` | "AI Smart Inspection" | **Phiếu kiểm tra 10 tiêu chí kỹ thuật QCVN 18/BXD (Form Checklist)** | Sai lệch (Overclaim) | Định danh chính xác: **"Biên bản Thanh tra Thực địa QCVN 18/BXD"** |

---

## 3. KIỂM THỬ ĐỐI SOÁT & KỊCH BẢN THẤT BẠI (GROUNDING & FAILURE TESTING)

Hệ thống đã được kiểm thử nghiêm ngặt tại `dustguard-operations/tests/evidence-grounded-intelligence.test.js` để bảo đảm tính trung thực khi dữ liệu bất thường hoặc không đầy đủ:

### Kịch bản 1: Cơ sở dữ liệu rỗng hoặc Vụ việc thiếu chứng cứ (Clean Database / Missing Facts)
- **Đầu vào**: Vụ việc mới tạo chỉ có tin báo công dân, chưa có ảnh hiện trường được xác minh, chưa có biên bản thanh tra.
- **Phản ứng của Hệ thống**:
  - `conclusion_level` trả về: **`INSUFFICIENT_EVIDENCE`** (Không đủ căn cứ kết luận).
  - Không tự bịa ra mức phạt tiền hay trích dẫn điều luật giả mạo.
  - Danh sách `missing_facts` chỉ rõ: *Thiếu ảnh bằng chứng đã kiểm định băm SHA-256*, *Thiếu biên bản kiểm tra hiện trường*.
  - Khuyến nghị ưu tiên: Lập kế hoạch thanh tra đột xuất.
- **Kết luận**: **GROUNDING PASS 100%**.

### Kịch bản 2: Tệp bằng chứng bị sửa đổi trái phép (Tampered Evidence Detection)
- **Đầu vào**: Tệp ảnh trên đĩa bị thay đổi byte (dù chỉ 1 bit) khiến mã băm SHA-256 tính lại không khớp với giá trị lưu trong CSDL.
- **Phản ứng của Hệ thống**:
  - Endpoint `POST /api/evidence/:id/verify-hash` phát hiện sai lệch băm $\to$ Chuyển `integrity_state` sang **`TAMPERED`**.
  - Trợ lý pháp lý lập tức loại bỏ tệp này khỏi Danh mục Chứng cứ Hợp lệ (Evidence Matrix).
  - Cảnh báo cán bộ: *"Bằng chứng có dấu hiệu bị can thiệp kỹ thuật số, không thể dùng làm căn cứ lập biên bản vi phạm"*.
- **Kết luận**: **INTEGRITY PASS 100%**.

### Kịch bản 3: Không tìm thấy điều khoản pháp luật tương thích (No Statutory Match)
- **Đầu vào**: Phản ánh về hiện tượng ô nhiễm không thuộc danh mục bụi xây dựng (ví dụ: tiếng ồn ban đêm).
- **Phản ứng của Hệ thống**:
  - FTS5 trả về 0 kết quả khớp trong NĐ 45/2022 điều khoản bụi.
  - Hệ thống hiển thị rõ ràng: *"Chưa có quy chuẩn tương thích trực tiếp trong cơ sở dữ liệu pháp điển cục bộ"*.
  - Tuyệt đối không sinh ra mã điều luật ảo (Hallucination = 0).
- **Kết luận**: **ZERO HALLUCINATION PASS 100%**.

### Kịch bản 4: Chốt chặn an toàn khi đóng hồ sơ (Case Closure Gatekeeper)
- **Đầu vào**: Cán bộ cố tình bấm đóng vụ việc khi Trợ lý Pháp lý chưa có xác nhận từ Chuyên viên hoặc các đợt kiểm tra hiện trường chưa hoàn thành.
- **Phản ứng của Hệ thống**:
  - Backend trả về mã lỗi HTTP **`400 Bad Request`** (RFC 7807 Problem Details).
  - Thông báo chi tiết: *"Vụ việc chưa có kết luận thẩm tra pháp lý hoàn tất từ chuyên viên pháp chế."*
- **Kết luận**: **SAFETY INVARIANT PASS 100%**.

---

## 4. BẢNG CAM KẾT ĐẠO ĐỨC TRUNG THỰC CÔNG NGHỆ (ETHICAL CIVIC AI DECLARATION)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TUYÊN BỐ TRUNG THỰC CÔNG NGHỆ DUSTGUARD VN               │
│                                                                             │
│  1. Chúng tôi không bao giờ dùng từ "AI" để quảng cáo cho các thuật toán    │
│     tìm kiếm chuỗi, câu lệnh SQL FTS5 hay công thức tính điểm đơn giản.      │
│  2. Mọi kết luận pháp lý và quyết định xử lý bắt buộc phải do Cán bộ        │
│     chuyên trách con người phê duyệt và ký nhận bằng tài khoản công vụ.     │
│  3. Hệ thống không lưu trữ hay gửi bất kỳ dữ liệu nhạy cảm nào của          │
│     công dân ra các dịch vụ AI đám mây của bên thứ ba.                      │
│  4. Mã băm SHA-256 được tính toán trực tiếp từ mảng byte nhị phân thực tế    │
│     để bảo vệ công dân trước nguy cơ bị làm giả bằng chứng.                 │
└─────────────────────────────────────────────────────────────────────────────┘
```
