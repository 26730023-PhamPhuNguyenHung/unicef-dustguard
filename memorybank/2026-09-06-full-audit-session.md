# DustGuard VN — Phiên Audit & Sửa Lỗi Toàn Diện 2 Phía (2026-09-06)

> Bối cảnh: vòng audit trước (đã tạo ~35 file trong `docs/audit/`) bị đánh giá là **doc-heavy, sửa quá ít code thật**. Phiên này chạy 4 subagent trực tiếp trên server đang sống (Side A :3000/:3001, Side B :3002/:4000), dùng `agent-browser`/curl/SQLite để verify từng claim, và **sửa code ngay khi tìm thấy lỗi** thay vì chỉ ghi nhận. Toàn bộ số liệu dưới đây lấy từ báo cáo cuối của từng agent, có bằng chứng runtime kèm theo (không phải ước lượng).

---

## ĐÃ LÀM (DONE)

### Side A — Community (`apps/web` + `apps/server` + `data/dustguard-community.db`)
- Audit 30/30 màn hình bằng agent-browser: 28 working, 2 ui-only, 0 broken còn lại.
- Audit 64 endpoint, sửa 8.
- Bug tìm thấy: P0 2, P1 6, P2 3, P3 3 → đã fix: **P0 2/2, P1 6/6**, P2 1/3, P3 1/3.
- Fix quan trọng (đều verify sống):
  - `CaseDetailPage.tsx` đọc sai field response → mọi trang chi tiết vụ việc báo "không tìm thấy" dù case tồn tại. **Đã sửa.**
  - Ảnh bằng chứng field-observation bị mất vĩnh viễn do gọi endpoint upload không tồn tại (404 bị nuốt bởi `.catch`), UI vẫn báo thành công. **Đã thêm route thật, verify multipart upload.**
  - Report `visibility: private` chưa từng được backend chặn đọc → ai cũng xem được report riêng tư qua URL. **Đã thêm access-control, verify 403/200.**
  - API user trả luôn `password_hash`. **Đã sanitize.**
  - `ProfilePage`, `ContributionsPage`, `YouthCreditsPage`, `MyTrackingPage` gọi sai path/field → điểm đóng góp/tín chỉ/hồ sơ luôn hiện rỗng. **Đã sửa cả 4 trang.**
  - Forward-case double-submit tạo trùng timeline/notification. **Đã thêm chặn idempotent, verify bằng 2 request đồng thời.**
  - Draft autosave localStorage không gắn owner → lộ bản nháp giữa các user dùng chung máy. **Đã thêm owner-check.**
  - `GET /reports/check-duplicate` lệch tên field FE/BE → modal cảnh báo trùng lặp chưa từng chạy. **Đã sửa 2 chiều.**
  - Thiếu index trên `case_feedback.case_id` dù mọi query đều filter theo cột này, và statement tạo bảng dùng sai API (`.run()` thay vì `.exec()` cho multi-statement). **Đã sửa.**

### Side B — Operations (`dustguard-operations/`)
- Audit 32/32 màn hình (31 route + AppLayout shell): 31 working, 1 broken tìm-thấy-và-sửa, 0 ui-only còn lại.
- Audit 100 endpoint, sửa 6. Thêm 7 index vào cột FK/lookup nóng (quan trọng nhất: `legal_reviews.case_id`, được query mỗi lần đóng hồ sơ).
- Bug tìm thấy: P0 0, P1 5, P2 5, P3 4 → đã fix: **P1 5/5**, P2 5/5, P3 1/4.
- Fix quan trọng:
  - `node:sqlite` không nhận bind-param `undefined` → mọi PATCH cases/admin-config bỏ qua field tùy chọn đều lỗi 500. **Đã sửa ở tầng query, verify trước/sau.**
  - Role switcher demo trong `AppLayout.tsx` cho phép bất kỳ user nào tự đăng nhập lại thành admin bằng password hardcode. **Đã khóa sau `import.meta.env.DEV`, không lọt vào production build.**
  - `POST /:id/remediation` (Actions) không có middleware auth — endpoint ghi dữ liệu mở hoàn toàn. **Đã thêm requireAuth.**
  - Evidence upload nhận mọi loại file rồi serve tĩnh từ `/uploads` (rủi ro stored-content). **Đã thêm MIME allowlist.**
  - `LegalWorkspacePage.tsx` hiển thị "Độ tin cậy: 7500%" do nhân đôi thang đo. **Đã sửa.**
  - Bảng `contractors` có 0 dòng dù 26 tên nhà thầu thật nằm rải trên 31 case. **Đã backfill + auto-link cho case mới.**
  - `dustguard-operations/apps/web/src/api/client.ts` có key `admin:` trùng lặp làm hỏng `tsc` production build. **Đã xóa key chết**, đồng thời bổ sung `vite-env.d.ts` còn thiếu từ đầu dự án.
  - Draft autosave (giống Side A) không check owner. **Đã sửa.**
  - Endpoint tích hợp `/community/feedback` chưa từng có zod schema. **Đã thêm `CommunityFeedbackSchema`.**

### Cross-side + Legacy + Bloat
- **Legacy `app/`**: xác nhận cô lập 100% thật (workspaces + import-graph, không phải claim suông). Redirect `/citizen/*`, `/community/*` → thật. Claim `/staff/cases → Operations` là **sai** (chỉ redirect nội bộ Side A) — ghi nhận, không tự chế thêm hạ tầng redirect xuyên origin.
- **Idempotency forward-case** (Side A→B): verify sống, double-forward không tạo trùng case (update in-place).
- **Resolution sync** (Side B đóng case → Side A cập nhật): verify sống, hoạt động thật.
- Phát hiện + vá ngay 1 bug: webhook đến trễ/sai thứ tự có thể revert case đã resolved về forwarded.
- **Lỗ hổng bảo mật P1**: 2 endpoint tích hợp liên-side (`/api/integrations/community/cases` và `/api/integrations/operations/sync`) hoàn toàn không có auth dù `CROSS_SIDE_CONTRACT.md` claim có `x-service-key`. **Đã vá**: thêm shared-secret `x-service-key` (env `INTEGRATION_SERVICE_KEY`) cả 2 chiều, verify 401 khi sai/thiếu key, verify luồng thật (moderator forward case qua UI → tự gửi đúng header, không cần can thiệp tay).
- **Bloat report cũ bị bịa số liệu**: 2/3 "duplicate có chủ đích" được liệt kê **không tồn tại file** (`crypto.ts` phía Operations, `riskScorer.ts`). Đã xóa 10 file chết thật (0 importer, xác minh bằng import-graph + `tsc --noEmit`): 8 component landing cũ + `DevRoleSwitcher.tsx` + `usePermission.ts`.
- LOC: 48,391 → 45,860 · Files: 208 → 201 (đo thật bằng `wc -l`/`git ls-files`, không phải số cũ trong doc).

---

## CHƯA LÀM / TỒN ĐỌNG (NOT DONE) — ghi rõ lý do, không che giấu

| Hạng mục | Phía | Lý do chưa sửa |
|---|---|---|
| `content_reports` table luôn rỗng | Side A | Chưa từng có UI để user report/flag nội dung — thiếu tính năng, không phải regression. Nằm ngoài phạm vi 1 phiên fix-bug. |
| `impact_stats` table luôn rỗng | Side A | Không có code path nào ghi vào bảng này — tính năng rollup chưa từng được implement. |
| Row test cũ ("case-fb-...", "case-sync-test-...") lẫn trong bảng `cases` | Side A | Để nguyên, chờ xác nhận từ product owner trước khi xóa dữ liệu. |
| `projects` table 0 dòng thật | Side B | `POST /api/projects` hoạt động tốt; backfill sẽ phải bịa dữ liệu địa chỉ/mã dự án — không làm. |
| `POST /api/cases` (tạo case thủ công) không có idempotency key phía server | Side B | Hiện chỉ dựa vào disable-button phía client. Community-intake (Side A→B) đã idempotent thật; nhánh tạo case thủ công thì chưa. |
| `GET /api/legal/search`, `/documents`, `/documents/:id`, `/sections/:id` không có `requireAuth` | Side B | Đánh giá là văn bản pháp luật công khai, không phải dữ liệu case — không rõ có nên khóa hay không, cần quyết định sản phẩm. |
| 8 endpoint mồ côi (vd. `POST /cases/:id/reassign`, `/human-decisions`, `/automations/rules`) | Side B | Không tìm thấy caller frontend nào, nhưng chưa xóa vì chưa chắc chắn 100% không dùng ở nơi khác (vd. script nội bộ, tích hợp tương lai). |
| ~19 P2/P3 nhỏ khác (UX, thiếu validation ở action admin nội bộ ít rủi ro) | Cả 2 phía | Ưu tiên thấp hơn P0/P1 theo đúng thứ tự bắt buộc (data loss > security > broken workflow > ...); còn trong `audit-output/side-a-endpoints.json` và `side-b-endpoints.json`, chưa xử lý hết trong phiên này. |

---

## Số liệu trước/sau (đo thật, không ước lượng)

| Metric | Trước | Sau |
|---|---:|---:|
| Files (toàn repo `apps/` + `dustguard-operations/`) | 208 | 201 |
| LOC (cùng phạm vi) | 48,391 | 45,860 |
| Bug P0 tìm thấy / đã fix | 2 | 2/2 |
| Bug P1 tìm thấy / đã fix | 11 | 11/11 |
| Bug P2 tìm thấy / đã fix | 8 | 6/8 |
| Bug P3 tìm thấy / đã fix | 7 | 2/7 |
| Endpoint tích hợp liên-side có auth | 0/2 | 2/2 |
| File dead code đã xóa (0 importer, verify bằng import-graph) | – | 10 |
| Index DB thêm mới | – | 8 (1 Side A + 7 Side B) |

## File tham chiếu
- `audit-output/side-a-{screens,endpoints,database}.json`
- `audit-output/side-b-{screens,endpoints,database}.json`
- `audit-output/{legacy,cross-side,bloat}.json`
- `CHANGELOG.md` (mục `[1.1.1]` trở lên — append, không rewrite)
- `docs/audit/CROSS_SIDE_CONTRACT.md`, `ARCHITECTURE_REALITY_MAP.md`, `DATA_LINEAGE_MASTER.md` (đã đồng bộ theo thay đổi thật)

## Việc tiếp theo nếu tiếp tục phiên audit
1. Xử lý nốt các P2/P3 còn lại trong `audit-output/*-endpoints.json`.
2. Quyết định sản phẩm: có cần idempotency key cho `POST /api/cases` thủ công không; có khóa `legal/*` GET không.
3. Xác nhận với product owner để dọn row test cũ trong bảng `cases`.
4. Xây tính năng report-content (Side A) nếu vẫn cần `ModerationQueuePage` có việc thật để xử lý.
