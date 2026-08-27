# BÁO CÁO TOÀN DIỆN: FEATURE PRESERVATION AUDIT (10 SUBAGENTS GIT AUDIT)
**Dự án:** DustGuard VN — CivicTech Platform  
**Phương pháp:** 10 Subagent Git Audit (Timeline Archaeologist, Deleted Feature Hunter, Frontend Diff, Backend/API Diff, Database Archaeologist, Auth/Role Auditor, UI/Design Preservation, Tests Archaeologist, Lost Commit Hunter, Integration Lead)  
**Thời gian rà soát:** 7 ngày gần nhất (20/08/2026 – 27/08/2026)  
**Tiêu chí tối thượng:** Khôi phục chọn lọc các tính năng giá trị cao nhất từ các bản có **LOC nhiều nhất** trên nền kiến trúc SSOT hiện tại.

---

## 1. DÒNG THỜI GIAN GIT 7 NGÀY (GIT TIMELINE 7 DAYS)

Codebase DustGuard VN đã phát triển liên tục và đạt đỉnh cao nhất lịch sử tại **HEAD (`9557a48` / `c7ef853`)** với **396 source files `src/`**, **86,060 dòng code JS/JSX** và **124 React routes**.

| Mốc Thời Gian | Commit Hash | Mô Tả & Thay Đổi Kiến Trúc | JS LOC | Files | Routes |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **2026-05-17** | `3020867` | Khởi tạo ban đầu (Monolith Mock Data) | 22,949 | 241 | 20 |
| **2026-08-18** | `faa7c23` | DevTools MCP Full QA & Chuẩn hóa 10 domain | 50,530 | 238 | 31 |
| **2026-08-21** | `45b807b` | Cloudflare D1 SSoT Repositories & Priority Scoring | 51,753 | 242 | 47 |
| **2026-08-22** | `34f6b72` | Contractor Workspace & Clerk Hybrid Auth | 65,491 | 300 | 55 |
| **2026-08-23** | `fc8be59` | Reliability & Automated 79-Route Crawler | 70,120 | 330 | 85 |
| **2026-08-26** | `3150a4b` | Google-Docs Document Engine & AST Model (+3,007 LOC) | 72,669 | 342 | 95 |
| **2026-08-26** | `8364312` | Rules-as-Code & Full Backend CRUD (+1,516 LOC) | 74,500 | 350 | 98 |
| **2026-08-26** | `de38d5f` | Spatial Map SSOT, True GIS WGS84 & Geocoding (+1,564 LOC) | 81,917 | 374 | 117 |
| **2026-08-27** | `b0883a0` | Executive Portal Operational Command Center (+2,399 LOC) | 84,960 | 393 | 124 |
| **2026-08-27** | `c7ef853` | **PEAK JS LOC: Seal Red & Civic Theme Alignment** | **86,060** | **396** | **124** |
| **2026-08-27** | `9557a48` | **HEAD CURRENT: Master Ops Closed-Loop SSOT** | **86,024** | **396** | **124** |

---

## 2. MA TRẬN BẢO TOÀN TÍNH NĂNG (FEATURE PRESERVATION MATRIX)

| Mã Feature | Tên Tính Năng / Năng Lực | Phân Loại | Commit Gốc (Bản LOC lớn nhất) | Đánh Giá Kỹ Thuật & Hành Động Khôi Phục |
|---|---|:---:|:---:|---|
| **GAP-01** | Spatial Geocode & Update Location API | `RESTORE` | `de38d5f` | **ĐÃ KHÔI PHỤC**: Bổ sung `GET /api/spatial/geocode`, `GET /api/v1/spatial/geocode` và `PATCH /api/spatial/entities/:type/:id/location` vào `worker.js` và OpenAPI spec. |
| **GAP-02** | Executive Case Directive API | `RESTORE` | `b0883a0` | **ĐÃ KHÔI PHỤC**: Thêm `POST /api/executive/cases/:id/directive` vào Express `executive.js` đồng bộ với D1 AuditLog. |
| **GAP-03** | Citizen Profile Duplicate Route Prefix | `RESTORE` | `619b46b` | **ĐÃ KHÔI PHỤC**: Sửa route mapping trong `users.js` để hỗ trợ cả `/profile` và `/citizen/profile`. |
| **GAP-04** | Document Signature Verification Alias | `RESTORE` | `070dc71` | **ĐÃ KHÔI PHỤC**: Thêm alias `GET /api/documents/drafts/:id/verify-signature` vào `worker.js`. |
| **GAP-06** | Telemetry Ingest Canonical Alias | `RESTORE` | `fc8be59` | **ĐÃ KHÔI PHỤC**: Bổ sung alias `POST /api/telemetry` vào `worker.js` và OpenAPI spec. |
| **DB-01** | Missing Columns in `cases` Table | `RESTORE` | `45b807b` | **ĐÃ KHÔI PHỤC**: Migration `0008` bổ sung `priority`, `createdBy`, `assignedTo`, `category`, `severity`, `attention_state`, `is_clock_paused` vào D1 & Prisma. |
| **DB-02** | Missing Columns in `complaints`, `evidences`, `contractor_explanations` | `RESTORE` | `7c92653` | **ĐÃ KHÔI PHỤC**: Migration `0008` bổ sung `feedbackNote`, `photoCount`, `latitude`, `longitude`, `actionId`, `isTampered`, `contractorName`, `reviewedBy`, `reviewedAt`, `reviewNote`. |
| **UI-01** | DataTable Multi-Select Checkbox & Bulk Actions | `RESTORE` | `components/ui/table/DataTable.tsx` (253 LOC) | **ĐÃ KHÔI PHỤC**: Nâng cấp `shared/components/ui/DataTable.jsx` hỗ trợ `selectable`, `selectedRows`, `renderBulkActions` và Density switcher. |
| **UI-02** | Modal Portal DOM & Mobile Bottom Sheet | `RESTORE` | `components/ui/Modal.jsx` (146 LOC) | **ĐÃ KHÔI PHỤC**: Nâng cấp `shared/components/ui/Modal.jsx` với `createPortal`, sub-components (`ModalHeader/Title/Body/Footer`) và bottom sheet `rounded-t-3xl sm:rounded-2xl`. |
| **UI-03** | Universal Timeline & StatusStepper SSOT | `MERGE` | `CommunityCaseWorkspace` & `CitizenTrack` | **ĐÃ TẠO MỚI SSOT**: Tạo `shared/components/ui/Timeline.jsx` hỗ trợ cả Vertical Timeline và Horizontal Stepper kèm mã băm SHA-256. |
| **DEL-02** | Youth / Club Leaderboard & Top 3 Podium | `RESTORE` | `YouthLeaderboard.jsx` (346 LOC) | **ĐÃ KHÔI PHỤC**: Tích hợp Top 3 Podium (Gold, Silver, Bronze) và Bảng thi đua CLB toàn quốc vào `YouthCredits.jsx` (`?tab=leaderboard`). |
| **DEL-03** | Volunteer Micro-Missions (< 50m Geofence) | `RESTORE` | `CitizenMissions.jsx` (248 LOC) | **ĐÃ KHÔI PHỤC**: Tích hợp danh sách nhiệm vụ khảo sát thực địa kèm cự ly GPS và điểm thưởng vào `YouthCredits.jsx` (`?tab=missions`). |
| **DEL-01** | 24h-48h Field Re-inspection Modal | `MERGE` | `CommunityFollowUps.jsx` (643 LOC) | **ĐÃ BẢO TOÀN**: Luồng tái kiểm tra 3 trạng thái (`BETTER`, `UNCHANGED`, `WORSE`) tích hợp trong `ObservationDetail.jsx` và `CommunityActions.jsx`. |
| **DEL-07** | Executive Directive Timeline & Signatures | `MERGE` | `ExecutiveDecisionsPanel.jsx` (230 LOC) | **ĐÃ BẢO TOÀN**: Tích hợp vào `ExecutiveDashboard.jsx` (`ExecutiveDecisionsTab.jsx`) và Audit Log D1. |
| **DEL-09** | 12 Mẫu Văn Bản Hành Chính & Khung Phạt | `MERGE` | `AutoReport.jsx` (1,582 LOC) | **ĐÃ BẢO TOÀN**: Chuyển giao toàn bộ 12 template sang `TemplatesGalleryPage.jsx` và Tiptap AST Engine. |
| **OBS-01** | Template TailAdmin E-commerce (`CountryMap.tsx`) | `OBSOLETE` | `origin/hackathon-2026-react` | **CHỦ ĐỘNG KHÔNG DÙNG**: Template thương mại ngoài lề, thay bằng Civic Tech High-Contrast UI SSOT. |
| **OBS-02** | LocalStorage Personal Task Checklist | `OBSOLETE` | `StaffDashboard.jsx` (`c99b328`) | **CHỦ ĐỘNG KHÔNG DÙNG**: Vi phạm nguyên tắc D1 persistent SSOT, đã thay bằng D1 Priority Queue. |

---

## 3. CÁC REGRESSION ĐÃ ĐƯỢC FORWARD-PORT THÀNH CÔNG

1. **Database & Schema Integrity**:
   - Khắc phục triệt để lỗi thiếu cột `priority` trong bảng `cases` từng gây crash log trong `automation_runs`.
   - Đồng bộ hoàn chỉnh 46 bảng D1 và 14 models cộng đồng vào `prisma/schema.prisma`.
2. **Backend / API Dual Parity**:
   - Đảm bảo 100% endpoint routing giữa Cloudflare Worker (`worker.js`), Express Server và OpenAPI 3.0.3 spec (`scripts/verify-quick.js` pass 100%).
   - Sửa lỗi định tuyến `/api/citizen/profile` trong Express.
3. **UI / Component Primitives SSOT**:
   - Nâng cấp `DataTable` với Multi-select Checkbox + Floating Bulk Actions + Density toggle.
   - Nâng cấp `Modal` với React Portal + Mobile Bottom Sheet.
   - Ban hành `Timeline.jsx` chuẩn hóa dòng thời gian cho toàn bộ các portal.
4. **Youth & Community Engagement**:
   - Khôi phục Bảng xếp hạng thi đua CLB Môi trường Toàn quốc với Top 3 Podium trực quan.
   - Khôi phục Trung tâm Khảo sát & Nhiệm vụ Thực địa Micro-Missions cho tình nguyện viên.

---

## 4. TÍNH NĂNG CHỦ ĐỘNG KHÔNG RESTORE & LÝ DO

1. **Template TailAdmin & Demo Logistics (`origin/hackathon-2026-react`)**:
   - *Lý do*: Nhóm đã chuyển hướng sang **Civic Tech High-Contrast UI** (chuẩn tiếp cận WCAG 2.2, zero glassmorphism, tương phản cao, tối ưu mobile 360-430px). Không dùng template thương mại để giữ bản sắc Civic Tech.
2. **Personal Daily Task Checklist lưu bằng `localStorage`**:
   - *Lý do*: Vi phạm Invariant 1 (*D1 is Persistent SSOT*). Tác vụ của cán bộ phải được điều phối tập trung từ D1 Priority Queue.
3. **Mô hình chế tài xử phạt đơn phương giả lập**:
   - *Lý do*: Tuân thủ định vị sản phẩm Civic Tech mới: DustGuard là nền tảng Trí tuệ Môi trường & Hỗ trợ Ra Quyết định, bàn giao sang 1022 / iHanoi; không đóng vai cơ quan nhà nước tự ý xử phạt.

---

## 5. CÁC COMMIT CHỨA IMPLEMENTATION TỐT ĐÁNG THAM CHIẾU

- `3150a4b` & `82c4121`: **Document Studio & AST Engine** (+4,981 LOC) — Trình soạn thảo văn bản hành chính A4 Tiptap.
- `8364312`: **LegalTech & Rules-as-Code** (+1,516 LOC) — Quy chuẩn NĐ 45/2022/NĐ-CP & Luật BVMT 2020.
- `de38d5f`: **Spatial GIS & WGS84 Geocoding** (+1,564 LOC) — Bản đồ thông minh 6 lớp và tọa độ thực tế.
- `b0883a0`: **Executive Ops Command Center** (+2,399 LOC) — Bảng chỉ đạo điều hành thực tế 6 phân khu.
- `fdc7640`: **Explainable Priority Scoring Engine** (+2,113 LOC) — Công thức điểm ưu tiên giải trình được.
- `d1edb19` & `4733cf3`: **Tamper-Evident SHA-256 & Privacy Engine** — Mã băm WebCrypto và nén ảnh < 300KB loại bỏ EXIF.

---

## 6. KẾT QUẢ KIỂM THỬ XÁC THỰC (VERIFICATION EVIDENCE)

```powershell
npm --prefix app run verify:quick
```
- **Step 1/3**: OpenAPI Contract Parity Audit: **353 runtime routes, 100% matched in spec, 0 unmatched**.
- **Step 2/3**: Unit & Integration Test Suites: **28/28 test files passed (237/237 unit tests, 0 failures, 2.6s)**.
- **Step 3/3**: UI Smoke & Layout Verification: **4/4 test files passed (42/42 smoke tests, 0 failures, 0.4s)**.
- **Tổng cộng**: **279/279 tests PASSED 100%**.

---

## 7. THỐNG KÊ TỔNG HỢP CUỐI CÙNG (AUDIT SCORECARD)

```text
Total historical capabilities found: 42
Still working: 32
Regressed: 8
Restored: 8
Intentionally retired: 2
Need investigation: 0
```
