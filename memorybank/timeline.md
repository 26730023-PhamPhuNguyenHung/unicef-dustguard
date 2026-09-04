# DUSTGUARD VN — SSOT TIMELINE (MEMORY BANK)

> **Cập nhật mốc phát triển và lịch sử trạng thái dự án**  
> *Đồng bộ với .agents/TIMELINE.md*

---

## 📅 Các Mốc Phát Triển Chính (Milestones)

### 1. [2026-09-05] `operations-v1.1`: DustGuard Operations Enterprise Expansion (32 Tables, IoT HMAC Telemetry, Legal Ingestion & 32 Tests)
- **Mục tiêu**: Nâng cấp toàn diện nền tảng Operations với hạ tầng dữ liệu mở rộng.
- **Phạm vi hoàn tất**:
  - Mở rộng cấu trúc cơ sở dữ liệu lên **32 bảng quan hệ + SQLite FTS5**: `signals`, `case_signals`, `tasks`, `iot_devices`, `iot_readings`, `iot_events`, `automation_rules`, `automation_runs`.
  - Tích hợp giao thức viễn thám IoT (ESP32 APM2000 Sensor Node) với chữ ký HMAC SHA-256 xác thực nguồn gốc và bộ lọc phát hiện cảm biến đóng băng số liệu (Flatline & Faulty Detection).
  - Cỗ máy điều hướng hành động kế tiếp (**Next Action Engine**) và Xuất hồ sơ quyết định tổng hợp (**Decision Pack**).
  - Bộ bóc tách cấu trúc văn bản pháp luật tiếng Việt (**Vietnamese Legal Parser & Ingestion**) tự động phân cấp Chương/Điều/Khoản/Điểm và lập chỉ mục FTS5 tức thì.
  - Trung tâm quản lý công việc (**Centralized Tasks**) với liên kết sâu tới vụ việc/thiết bị/pháp chế.
  - **Kiểm thử**: Đạt **32/32 tests PASS 100%** trong 1.26 giây. Vite production build thành công 100% trong 3.81s.

---

### 2. [2026-09-05] `operations-v1`: DustGuard Operations (Staff Case Management + Legal Intelligence + Inspection Workflow)
- **Mục tiêu**: Xây dựng nền tảng độc lập hoàn chỉnh dành cho cán bộ nội bộ, giám sát, pháp chế và admin.
- **Phạm vi**:
  - Khép kín 10 bước nghiệp vụ: `CASE INTAKE → TRIAGE → ASSIGNMENT → LEGAL REVIEW → INSPECTION → FINDINGS → CORRECTIVE ACTION → REMEDIATION → REINSPECTION → CLOSURE`.
  - Monorepo độc lập `dustguard-operations/`:
    - Backend Express + TypeScript + SQLite native `node:sqlite` trong WAL mode, 24 bảng quan hệ + bảng FTS5 virtual table.
    - Frontend React 18 + Vite + TypeScript + TailwindCSS Civic High-Contrast, sáng màu, không glassmorphism, 18 màn hình đầy đủ.
    - Shared types, permissions RBAC capability model, canTransitionCase state machine.
    - Assistive AI Legal Provider (Citation-first, Zod schema validation, fallback local engine).
    - Hợp đồng tích hợp DustGuard Community Idempotent API.
  - **Kiểm thử**: 15/15 integration tests PASS 100% (1.28s).
  - **Nghiệm thu trình duyệt thực tế**: Chạy trọn vẹn 10 bước qua `agent-browser`, xác minh độ bền vững dữ liệu F5 reload không mất mát, không tràn màn hình (`noOverflow: true`) trên Desktop 1440x900, 1366x768 và Mobile 390x844.

---

### 2. [2026-09-05] `community-v1`: DustGuard Community
- Phân hệ độc lập dành cho Thanh niên, Tình nguyện viên và Người dân tiếp nhận & phản ánh ô nhiễm bụi cộng đồng.
- 23 màn hình, SQLite local engine, REST API và 14/14 automated tests passed.

---

### 3. [2026-09-03] `30-screens`: Master Human-Centric Consolidation
- Hoàn tất 30 màn hình trải đều 5 nhóm người dùng: Citizen, Field Staff, Admin Coordinator, Contractor, Youth Community.
