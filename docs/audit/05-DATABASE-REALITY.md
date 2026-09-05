# DUSTGUARD VN — AUDIT 05: DATABASE REALITY & SCHEMA AUDIT
## Kiểm Toán Thực Tế 3 Cơ Sở Dữ Liệu & Phân Tích Tính Độc Lập Khỏi Seed (Seed Independence)

> **Mã tài liệu**: `DG-AUDIT-05-DATABASE-REALITY`  
> **Thời điểm kiểm toán**: 05/09/2026  
> **Mục tiêu**: Kiểm tra cấu trúc vật lý, dữ liệu thực tế, sự phân hóa và xung đột giữa 3 tệp CSDL đang tồn tại trong repository (`data/dustguard-community.db`, `dustguard-operations/data/dustguard-operations.db`, và `app/prisma/dev.db`); xác định bảng nào còn sống, bảng nào chết/rác, và đánh giá tính độc lập khỏi `seed.ts` để sẵn sàng cho Production.

---

## 1. TỔNG QUAN HIỆN TRẠNG 3 CƠ SỞ DỮ LIỆU VẬT LÝ

| CSDL (Database) | Vị trí tệp | Dung lượng | Số bảng | Trạng thái kiến trúc | Vai trò định vị |
|---|---|---|:---:|---|---|
| **Community DB (Side A)** | `data/dustguard-community.db` | 471 KB | **21 bảng** | **ACTIVE_NEW** (SSOT Side A) | Quản lý toàn bộ vòng đời ghi nhận cộng đồng: tài khoản người dân/thanh niên, phản ánh, xác nhận tín hiệu, vụ việc công khai, CLB và nhiệm vụ thực địa. |
| **Operations DB (Side B)** | `dustguard-operations/data/dustguard-operations.db` | 884 KB | **41 bảng** (gồm 7 bảng FTS5) | **ACTIVE_NEW** (SSOT Side B) | Quản lý toàn bộ chu trình nghiệp vụ chuyên trách: thụ lý vụ việc từ cộng đồng, thanh tra hiện trường (10 tiêu chí QCVN 18), tra cứu FTS5 luật pháp, giám sát khắc phục qua Quick-Token Geofence 50m, và 4 điều kiện đóng hồ sơ. |
| **Legacy D1 DB (Monolith)** | `app/prisma/dev.db` | 45.3 MB | **60 bảng** | **LEGACY MONOLITH** (D1 Local) | Chứa schema thế hệ 1 phục vụ Hono Cloudflare Worker và 30 file unit tests trong `app/tests/`. Có tới 22 bảng rỗng không bao giờ được ghi; dữ liệu phình to do chạy kiểm thử lặp đi lặp lại. |

---

## 2. PHÂN TÍCH CHI TIẾT TỪNG CƠ SỞ DỮ LIỆU

### A. Community DB (`dustguard-community.db`, 21 bảng)
- **Các bảng hoạt động thực tế (Active & Persisted)**:
  - `users` (27 rows): Tài khoản người dân, thanh niên, điều phối viên (`citizen`, `community_member`, `moderator`, `admin`).
  - `reports` (44 rows) & `report_media` (39 rows): Các tin báo vi phạm bụi có ảnh và tọa độ GPS.
  - `confirmations` (111 rows): Lượt xác nhận "Tôi cũng ghi nhận" giúp gia tăng trọng số xác thực.
  - `cases` (24 rows) & `case_reports` (43 rows): Các vụ việc cộng đồng được gộp từ các phản ánh lân cận.
  - `observations` (51 rows) & `observation_media` (21 rows): Minh chứng quan sát Before/After thực địa.
  - `communities` (4 rows) & `community_members` (32 rows): Mạng lưới CLB thanh niên tình nguyện.
  - `verification_tasks` (5 rows): Nhiệm vụ khảo sát thực địa.
  - `audit_logs` (87 rows): Nhật ký kiểm toán hành vi người dùng.
- **Bảng rỗng / Chưa ghi (Empty Tables)**:
  - `content_reports` (0 rows): Hàng đợi báo cáo bài viết xấu độc chưa phát sinh dữ liệu thật.
  - `impact_stats` (0 rows): Bảng tổng kết tác động môi trường (tính toán động qua query thay vì lưu tĩnh).

---

### B. Operations DB (`dustguard-operations.db`, 41 bảng)
- **Các bảng hoạt động thực tế (Active & Persisted)**:
  - `users` (13 rows): Tài khoản cán bộ thanh tra, giám sát viên, pháp chế (`staff`, `supervisor`, `legal_reviewer`, `admin`).
  - `cases` (28 rows) & `case_timeline` (60 rows): Hồ sơ vụ việc xử lý, trong đó có vụ việc được nhập tự động từ Community (`source = 'COMMUNITY'`).
  - `case_closures` (3 rows): Bản ghi đóng hồ sơ thỏa mãn cổng kiểm soát 4 điều kiện.
  - `inspections` (2 rows), `inspection_items` (12 rows), `inspection_findings` (4 rows): Đợt thanh tra thực tế với 10 tiêu chí kỹ thuật QCVN 18/BXD.
  - `corrective_actions` (6 rows) & `remediation_submissions` (2 rows): Lệnh khắc phục và báo cáo hoàn thành của nhà thầu.
  - `legal_documents` (5 rows), `legal_sections` (9 rows), và 7 bảng ảo SQLite FTS5 (`legal_sections_fts_*`): Phục vụ AI tra cứu ngữ nghĩa văn bản pháp lý.
  - `iot_devices` (4 rows) & `iot_readings` (32 rows): Cảm biến đo nồng độ bụi thực tế.
  - `staff_assignments` (23 rows): Dữ liệu phân công cán bộ điều phối khối lượng công việc.
  - `integration_logs` (2 rows): **Bằng chứng rõ ràng việc tiếp nhận thành công từ DustGuard Community qua `POST /api/integrations/community/cases`!**
- **Bảng rỗng (Empty Tables)**:
  - `contractors` (0 rows): Danh bạ nhà thầu (nhà thầu hiện được gắn trực tiếp qua tên `contractor_name` trên vụ việc).
  - `projects` (0 rows): Tên công trình hiện được lưu trong `location_text` của case.
  - `legal_search_history` (0 rows): Lịch sử tra cứu của cán bộ chưa được ghi nhận.

---

### C. Legacy D1 DB (`app/prisma/dev.db`, 60 bảng)
- **Các bảng còn ghi dữ liệu**:
  - `audit_logs` (26,783 rows), `observations` (6,292 rows), `follow_ups` (3,637 rows), `handoffs` (1,850 rows), `impact_events` (11,776 rows): Hàng chục ngàn dòng sinh ra từ các test scripts lặp lại của harness cũ.
  - `complaints` (14 rows), `cases` (24 rows), `sites` (11 rows): Dữ liệu cũ thế hệ monolithic.
- **Các bảng rỗng không bao giờ được ghi (Dead / Ghost Tables, 22 bảng)**:
  - `administrative_regions`, `administrative_units`, `alert_notifications`, `audit_events`, `campaign_clubs`, `contractor_explanations`, `document_revisions`, `environmental_categories`, `legal_rules`, `obligation_checklist_mappings`, `provinces`, `report_schedules`, `system_settings`, `task_participants`, `task_submissions`, `task_timelines`, `verification`, `wards`...
  - **Kết luận**: Hơn 35% số bảng trong D1 cũ là các bảng "ma" (ghost tables) được tạo ra từ migration cũ nhưng không có bất kỳ dòng code backend nào ghi dữ liệu vào!

---

## 3. ĐÁNH GIÁ TÍNH ĐỘC LẬP KHỎI SEED (SEED INDEPENDENCE)

### Hiện trạng kiểm tra:
1. **Side A (`apps/server`)**:
   - Khởi tạo tài khoản (`POST /api/auth/register`): **HOẠT ĐỘNG THỰC TẾ (PERSIST VÀO DB)**.
   - Tạo phản ánh (`POST /api/reports`): **HOẠT ĐỘNG THỰC TẾ**, tự động lưu `report_media` và ghi `audit_logs`.
   - Xác thực phản ánh (`POST /api/moderator/reports/:id/verify`): **HOẠT ĐỘNG THỰC TẾ**, tạo `cases` và `notifications`.
   - F5 Reload trình duyệt: **DỮ LIỆU VẪN CÒN NGUYÊN VẸN 100%**.
   - **Độc lập khỏi `seed.ts`**: **PASS**. Không cần seed dữ liệu mẫu, hệ thống vẫn tự vận hành trơn tru từ tài khoản trắng.

2. **Side B (`dustguard-operations`)**:
   - Tiếp nhận hồ sơ từ Community (`POST /api/integrations/community/cases`): **HOẠT ĐỘNG THỰC TẾ (IDEMPOTENT)**.
   - Phân công cán bộ & Cập nhật trạng thái: **PERSIST VÀO DB**.
   - Checklist thanh tra & Báo cáo khắc phục: **PERSIST VÀO DB**.
   - Đóng hồ sơ qua cổng 4 điều kiện kiểm soát: **PERSIST VÀO DB**.
   - **Độc lập khỏi `seed.ts`**: **PASS**. Dù xóa sạch DB, việc đăng ký tài khoản cán bộ ban đầu (qua setup wizard `/setup`) và tiếp nhận case mới từ Community vẫn hoạt động bình thường.

3. **Legacy Monolith (`app/`)**:
   - Phụ thuộc nặng vào seed dữ liệu cứng: Trong `CasesListPage.jsx`, nếu API trả về mảng rỗng thì tự động gán dữ liệu giả (fallback mock array).
   - **Độc lập khỏi `seed.ts`**: **FAIL (Cần phụ thuộc vào seed hoặc dữ liệu có sẵn để hiển thị đúng giao diện)**.

---

## 4. QUYẾT ĐỊNH QUY HOẠCH CƠ SỞ DỮ LIỆU (DATABASE CONVERGENCE DECISION)

1. **CSDL Phía Cộng đồng (Side A SSOT)**: Sử dụng duy nhất `data/dustguard-community.db` (Drizzle SQLite).
2. **CSDL Phía Chuyên trách (Side B SSOT)**: Sử dụng duy nhất `dustguard-operations/data/dustguard-operations.db` (Better-SQLite3 với FTS5).
3. **Cơ chế liên kết giữa 2 CSDL**: Sử dụng HTTP Webhook / Integration API idempotent (`POST /api/integrations/community/cases`) kèm mã băm SHA-256 đối soát. Tuyệt đối không dùng Cross-Database Foreign Key gây coupling kiến trúc.
4. **Số phận của D1 cũ (`app/prisma/dev.db`)**: Đóng băng (Freeze). Chỉ giữ để bảo đảm các bài test hồi quy cũ không bị gãy cho đến khi toàn bộ test suite được chuyển dịch sang 2 phân hệ mới.
