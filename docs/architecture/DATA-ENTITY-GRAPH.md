# DATA-ENTITY-GRAPH.md — D1 SQLite Entity Relationship & State Machines

> Sơ đồ dữ liệu thực tế từ D1 Database Schema (`app/prisma/schema.prisma`) và các máy trạng thái nghiệp vụ chuẩn.

---

## 🗄️ 1. D1 SQLite Database ERD (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ ACCOUNTS : has
    USERS ||--o| PROFILES : has
    USERS ||--o{ AUDIT_LOGS : generates

    SITES ||--o{ COMPLAINTS : receives
    SITES ||--o{ INSPECTIONS : undergoes
    SITES ||--o{ ACTIONS : requires
    SITES ||--o{ SENSORS : hosts
    SITES ||--o{ ALERTS : triggers
    SITES ||--o{ CASES : tracks
    SITES ||--o{ DRAFT_DOCUMENTS : generates
    SITES ||--o{ PRIORITY_SCORE_HISTORY : logs

    COMPLAINTS ||--o{ EVIDENCES : contains
    COMPLAINTS ||--o{ CASES : escalates_to

    INSPECTIONS ||--o{ EVIDENCES : attaches
    INSPECTIONS ||--o{ CASES : documents

    CASES ||--o{ CASE_TIMELINES : records
    CASES ||--o{ CASE_STATUS_HISTORY : transitions
    CASES ||--o{ CONTRACTOR_EXPLANATIONS : receives
    CASES ||--o{ SANCTION_DECISIONS : issues
    CASES ||--o{ ACTIONS : assigns
    CASES ||--o{ DRAFT_DOCUMENTS : compiles
    CASES ||--o{ EVIDENCES : references

    SENSORS ||--o{ SENSOR_READINGS : measures
    SENSORS ||--o{ ALERTS : raises
    ALERTS ||--o{ ALERT_NOTIFICATIONS : sends

    DRAFT_DOCUMENTS ||--o{ DOCUMENT_REVISIONS : revisions

    PROVINCES ||--o{ WARDS : contains
    ADMINISTRATIVE_UNITS ||--o{ PROVINCES : governs
    ADMINISTRATIVE_UNITS ||--o{ WARDS : governs
```

---

## 🔄 2. State Machines SSOT

### 2.1 Case State Machine (11 Bước Chuẩn Hóa)
```text
[detected] ➔ [needs_review] ➔ [under_review] ➔ [needs_verification]
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
[verified_signal] ➔ [forwarded] ➔ [action_in_progress] ➔ [monitoring] ➔ [resolved] ➔ [closed]
         │
         └─────────────➔ [dismissed] (Không đủ cơ sở / Sai lệch)
```

### 2.2 Complaint / Observation State Machine
```text
[PENDING] ➔ [PROCESSING] ➔ [RESOLVED]
    │
    └────➔ [REJECTED] (Ảnh mờ / Không khớp định vị / Spam)
```

### 2.3 Action Remediation State Machine
```text
[PENDING] ➔ [IN_PROGRESS] ➔ [COMPLETED] (Nhà thầu nộp ảnh GPS <= 50m) ➔ [VERIFIED] (TNV / Cán bộ đối chứng)
```

### 2.4 Sensor Health Status
```text
[ACTIVE] ➔ [DRIFTING] ➔ [FLATLINE] ➔ [FAULTY] ➔ [INACTIVE]
```
