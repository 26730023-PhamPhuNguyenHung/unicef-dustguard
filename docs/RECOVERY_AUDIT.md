# RECOVERY_AUDIT.md — Báo Cáo Điều Tra & Phục Hồi Pháp Y Mã Nguồn (Forensic Recovery)

> **Dự án**: DustGuard Operations  
> **Thời điểm kiểm tra**: 2026-09-05T01:58:00+07:00  
> **Phạm vi kiểm tra**: Toàn bộ Git history (`git log --all`, `git reflog`), submodule `app/`, `firmware/` và các tài liệu kỹ thuật.

---

## 1. Bảng Tổng Hợp Kiểm Tra & Quyết Định Tái Sử Dụng

| Module | Old Location | Current Status | Reuse? | Plan |
|---|---|---|:---:|---|
| **IoT Sensor Firmware (ESP32)** | `firmware/src/`, `firmware/include/` | Hoạt động thật trên phần cứng ESP32 + ASAIR APM2000 qua UART 1200 baud | **KEEP** | Bảo toàn định dạng canonical `%s:%.1f:%.1f:%s` và headers `X-Device-ID`, `X-Firmware-Version`. |
| **IoT HMAC-SHA256 Cryptography** | `app/server/auth/device/hmac.js`, `firmware/src/security/RequestSigner.cpp` | Hoạt động tốt, hỗ trợ timing-safe comparison và Web Crypto Subtle | **ADAPT** | Chuyển đổi và tích hợp trực tiếp vào module backend `iot.service.ts` cho `POST /api/iot/ingest`. |
| **IoT Anomaly & Flatline Detection** | `app/src/services/anomalyDetection.js` | Đã kiểm chứng: phát hiện 5 mẫu liên tiếp cùng giá trị float (frozen ADC) và liveness 15 phút | **ADAPT** | Tích hợp vào quy trình thẩm định chất lượng dữ liệu đo đạc trước khi lưu vào `iot_readings`. |
| **Legal Document Structure & Parser** | `app/src/lib/aiService.js`, `app/src/legal-document-engine/` | Logic regex nhận diện Điều, Khoản, Điểm rải rác trong client | **REFACTOR** | Xây dựng pipeline hoàn chỉnh tại backend: Upload → SHA-256 → Regex Phân cấp (Phần, Chương, Mục, Điều, Khoản, Điểm) → Preview UI → Human Approve → SQLite FTS5. |
| **SQLite FTS5 Full-text Search** | `dustguard-operations/apps/server/src/modules/legal/` | Bảng ảo `legal_sections_fts` với tokenizer `unicode61` | **KEEP** | Giữ nguyên và mở rộng hỗ trợ tìm kiếm theo số hiệu văn bản và loại điều khoản. |
| **Citation Integrity & AI Provider** | `app/src/lib/aiService.js`, `dustguard-operations/apps/server/src/modules/legal/` | Tích hợp Zod schema và cơ chế xác thực ID trích dẫn | **KEEP** | Bắt buộc đối chiếu `legal_sections.id`. Nếu sai lệch gắn nhãn `UNVERIFIED_AI_REFERENCE`. |
| **Case State Machine** | `dustguard-operations/packages/shared/src/stateMachine.ts` | 12 trạng thái khép kín từ `NEW` đến `CLOSED`, kiểm tra điều kiện chuyển tiếp | **KEEP** | Đảm bảo mọi chuyển trạng thái chạy qua Transaction cùng Timeline và Audit log. |
| **Evidence Asset & SHA-256** | `dustguard-operations/apps/server/src/modules/evidence/` | Băm Web Crypto SHA-256, lưu tệp cục bộ `/uploads` | **KEEP** | Mở rộng liên kết nguồn (Source: SIGNAL, CASE, INSPECTION, FINDING, REMEDIATION). |
| **Field Inspection & Findings** | `dustguard-operations/apps/server/src/modules/inspections/` | Mẫu biểu chuẩn hóa, chấm điểm Pass/Fail, sinh phát hiện vi phạm | **KEEP** | Hoàn thiện giao diện di động 390x844 cho cán bộ ngoài hiện trường. |
| **Signals & Correlation Engine** | Phân tán trong `app/src/modules/` | Chưa có bảng chuyên biệt và thuật toán so khớp khoảng cách/thời gian | **REWRITE** | Tạo bảng `signals`, `case_signals` và thuật toán đối sánh tất định (Deterministic matching). |
| **Task Engine** | Rải rác trong `app` | Thiếu liên kết deep-link ngược về thực thể phát sinh | **REWRITE** | Tạo bảng `tasks` hỗ trợ deep link về Case, Inspection, Legal hoặc IoT alert. |
| **Automation Rules & Runs** | Chưa có module độc lập | Chỉ có logic trigger cứng ngắc trong code | **REWRITE** | Thiết lập bảng `automation_rules` cấu hình bằng JSON và `automation_runs` lưu vết kiểm toán. |
| **Decision Pack Generator** | Prototype trong `ExecutiveSignModal.jsx` | Chỉ xuất HTML/Docx đơn giản | **REFACTOR** | Tích hợp trích xuất tổng hợp toàn bộ dữ liệu thật từ DB cho hồ sơ kết luận vụ việc. |

---

## 2. Kết Luận
Không viết lại những gì đã chạy xuất sắc (Firmware ESP32, HMAC Cryptography, Flatline Detection, SQLite FTS5). Tiến hành chuyển đổi, tinh gọn và bổ sung các thực thể còn thiếu vào kiến trúc monorepo `dustguard-operations` theo đúng tiêu chuẩn SSOT.
