# DUSTGUARD VN — QUY TRÌNH SAO LƯU & PHỤC HỒI DỮ LIỆU (BACKUP & DISASTER RECOVERY)

> **Mã tài liệu**: `DG-OPS-BACKUP-RECOVERY-01`
> **Phiên bản**: 2.0.0 (Đã hiệu đính sau kiểm chứng thực tế) | **Ngày ban hành**: 06/09/2026
> **Áp dụng cho**: Side A (`dustguard-community.db`) & Side B (`dustguard-operations.db`) — 2 tệp CSDL SQLite cục bộ của kiến trúc 2-side hiện hành (`apps/` + `dustguard-operations/`).
> **KHÔNG áp dụng cho**: Kho tệp bằng chứng (uploads), và bất kỳ hạ tầng Cloudflare nào (xem Mục 6).

---

## 0. Tóm Tắt Sự Thật (Ground Truth Summary)

Tài liệu phiên bản 1.0.0 (06/09/2026) đã nêu sai lệch một số điểm quan trọng: khai báo RPO/RTO như thể có một hệ thống sao lưu Cloudflare R2 production đang vận hành, trong khi thực tế **không hề tồn tại**. Phiên bản này được viết lại sau khi:
1. Đọc trực tiếp mã nguồn `scripts/backup-restore.js`.
2. Chạy thực tế `backup`, `test`, và `restore` trên 2 CSDL thật của hệ thống.
3. Rà soát toàn bộ `apps/`, `dustguard-operations/` để tìm bất kỳ dấu vết Cloudflare (wrangler config, D1Database/R2Bucket binding, CI/CD deploy workflow, Dockerfile, biến môi trường tài khoản Cloudflare) — **không tìm thấy gì**.

Không có con số RPO/RTO nào trong tài liệu này là suy đoán — mọi con số đều lấy từ lần chạy thực tế nêu dưới, hoặc được ghi rõ "chưa xác minh" / "không áp dụng".

---

## 1. Mục Tiêu Khôi Phục (RPO & RTO) — Đã Hiệu Đính

| Chỉ số vận hành | Local (2 tệp SQLite) | Production (kiến trúc 2-side hiện hành) |
|---|---|---|
| **RPO (Recovery Point Objective)** | Không có lịch tự động; phụ thuộc vào tần suất chạy `backup` thủ công (xem Mục 3). Không có bằng chứng cron/scheduler nào đang chạy. | **Không áp dụng** — chưa có môi trường production. |
| **RTO (Recovery Time Objective)** | Khôi phục 2 tệp `.db` chính: **~130–160ms** đo thực tế trên máy dev (xem Mục 5, kết quả chạy thực tế 06/09/2026). Đây là thời gian copy tệp thuần túy, **chưa gồm** thời gian dừng/khởi động lại server, xác minh ứng dụng, hay khôi phục thư mục `uploads/`. | **Chưa xác minh** — không có hạ tầng production để đo. |

> Con số "~130–160ms" chỉ phản ánh thao tác copy + xác minh SHA-256 của 2 tệp `.db` (~650KB và ~900KB) trên ổ đĩa local. Đây **không phải** ước tính RTO cho một sự cố thực tế (không tính thời gian phát hiện sự cố, dừng service đang chạy, hay khôi phục thư mục bằng chứng).

---

## 2. Đối Tượng Sao Lưu (What Actually Gets Backed Up)

`scripts/backup-restore.js` (đọc trực tiếp mã nguồn, xác nhận 06/09/2026) **chỉ** sao lưu 2 tệp CSDL SQLite sau — không có gì khác:

1. **Cơ sở dữ liệu SQLite SSOT (Side A Community DB)**:
   - Đường dẫn: `data/dustguard-community.db`
   - Kèm các tệp phụ trợ WAL nếu tồn tại: `dustguard-community.db-wal`, `dustguard-community.db-shm`
2. **Cơ sở dữ liệu SQLite SSOT (Side B Operations DB)**:
   - Đường dẫn: `dustguard-operations/data/dustguard-operations.db`
   - Kèm các tệp phụ trợ WAL nếu tồn tại: `dustguard-operations.db-wal`, `dustguard-operations.db-shm`

### 2.1. KHÔNG được sao lưu (Explicit Gap — Chưa Có Cơ Chế)

- **Thư mục tệp bằng chứng (uploads)**: `apps/server/uploads/`, `dustguard-operations/uploads/`, `dustguard-operations/apps/server/uploads/` — chứa ảnh hiện trường, PDF chứng chỉ, biên bản A4. **Script hiện tại không đụng tới các thư mục này.** Nếu ổ đĩa local mất, các tệp bằng chứng trong các thư mục này sẽ mất vĩnh viễn trừ khi có cơ chế sao lưu riêng (hiện chưa có).
- **Cloudflare R2**: Không có — xem Mục 6.

---

## 3. Tần Suất & Thời Gian Lưu Trữ (Frequency & Retention) — Hiện Trạng Thực Tế

- **Không có lịch tự động (cron/scheduler) nào được xác nhận** trong `apps/`, `dustguard-operations/`, hay cấu hình CI/CD (không tìm thấy `.github/workflows/` cho 2 hệ thống này, không có PM2/systemd job). Mọi lần sao lưu hiện tại là **thủ công**, chạy bằng tay qua CLI (Mục 5).
- **Vị trí lưu trữ hiện tại**: Cục bộ, thư mục `backups/backup-<ISO_TIMESTAMP>/` tại gốc repo — cùng ổ đĩa vật lý với dữ liệu gốc. Đây là điểm yếu: một sự cố hỏng ổ đĩa sẽ mất cả bản gốc lẫn bản sao lưu vì chúng nằm trên cùng một disk.
- **Đám mây**: Không có. Xem Mục 6.

---

## 4. Kiểm Định Toàn Vẹn Mật Mã (Cryptographic Verification) — Đã Kiểm Chứng Thực Tế

Mỗi bản sao lưu tự động tạo tệp `backup_manifest.json` ghi nhận SHA-256 của từng tệp `.db`. Khi phục hồi, script tính lại mã băm và so sánh; nếu lệch, script từ chối phục hồi và báo lỗi.

**Kết quả kiểm chứng thực tế (06/09/2026, trên máy dev Windows, đo bằng `date +%s%N` quanh lệnh CLI):**

| Bước | Kết quả | Ghi chú |
|---|---|---|
| `node scripts/backup-restore.js backup` | **PASS** — ~160ms | Sao lưu thành công 2 CSDL thật (652.0 KB + 896.0 KB), SHA-256 khớp giữa bản gốc và bản sao lưu. |
| `node scripts/backup-restore.js test` (kịch bản tự tạo dữ liệu giả lập → hỏng → khôi phục → đối soát) | **PASS 100% (5/5 bước)** — ~148ms | Kịch bản tự chứa (self-contained), không chạm CSDL thật. |
| `node scripts/backup-restore.js restore <snapshot>` trên CSDL thật | **Ban đầu FAIL** do lỗi mã nguồn (biến `targetDir` bị khai báo trùng tên trong cùng scope trong hàm `performRestore`, gây `ReferenceError`). **Đã sửa** (đổi tên biến nội bộ). Sau khi sửa: tệp `.db` chính phục hồi thành công, SHA-256 khớp 100% với bản sao lưu (~130–140ms). | Việc khôi phục tệp phụ trợ `-shm` có thể thất bại trên Windows nếu tiến trình server đang chạy và giữ khóa tệp (memory-mapped) — cần dừng service trước khi restore trong môi trường thật. Đây là hành vi WAL-mode SQLite tiêu chuẩn, không phải lỗi mất dữ liệu. |
| Kiểm định chống giả mạo (tamper detection) | **PASS** — sửa 1 byte trong tệp sao lưu, chạy `restore`, script từ chối với lỗi `Hash mismatch`, thoát mã lỗi khác 0. | Kiểm chứng trên bản sao cô lập, không ảnh hưởng dữ liệu thật. |

**Kết luận vận hành**: Cơ chế sao lưu/phục hồi 2 tệp CSDL SQLite hoạt động đúng như thiết kế (đã sửa 1 lỗi mã nguồn phát hiện trong quá trình kiểm chứng). Tuy nhiên phải dừng server trước khi restore trong thực tế để tránh xung đột khóa tệp WAL/SHM.

---

## 5. Hướng Dẫn Vận Hành CLI (Execution Guide)

### 5.1. Thực hiện Sao lưu (Backup)
```powershell
node scripts/backup-restore.js backup
```

### 5.2. Phục hồi Dữ liệu từ Snapshot (Restore)
```powershell
# Dừng mọi tiến trình server (apps/server, dustguard-operations/apps/server) trước khi restore
node scripts/backup-restore.js restore <tên_thư_mục_sao_lưu>
```

### 5.3. Chạy Kiểm Thử Tự Động Toàn Vẹn Phục Hồi (Verification Test)
```powershell
node scripts/backup-restore.js test
```
*Kịch bản này tự tạo CSDL giả lập, không thao tác trên dữ liệu thật.*

---

## 6. Cloudflare / Production — Tình Trạng Thực Tế

- **Kiến trúc 2-side hiện hành (`apps/` + `dustguard-operations/`) không có bất kỳ kết nối Cloudflare nào**: đã rà soát toàn bộ mã nguồn, không tìm thấy `wrangler.jsonc`/`wrangler.toml`, không có `D1Database`/`R2Bucket` binding, không có biến môi trường tài khoản/zone Cloudflare, không có workflow CI/CD deploy, không có Dockerfile, không có cấu hình PM2/systemd. `dustguard-operations/.env.example` chỉ khai báo cấu hình local-dev (`PORT`, `DATABASE_PATH`, `COMMUNITY_SYNC_URL=http://localhost:3001/...`).
- **Chưa có môi trường production triển khai cho kiến trúc 2-side hiện tại**: không tìm thấy domain, URL công khai, hay bằng chứng deploy nào cho `apps/` hay `dustguard-operations/`. Toàn bộ vận hành hiện tại là **local/dev**, phù hợp với bối cảnh sản phẩm dự thi hackathon.
- **Cloudflare D1/R2/Workers là một hệ thống khác, cũ (`app/`), đã bị cô lập**: thư mục `app/` (có `app/wrangler.jsonc`, `app/Dockerfile`, `app/.github/workflows/deploy.yml`) là ứng dụng độc lập thế hệ trước, **không phải** một phần của kiến trúc 2-side hiện hành. Theo `docs/audit/06-LEGACY-DISPOSITION-PLAN.md`, đây là hệ thống legacy đang trong lộ trình xử lý riêng — backup/RTO/RPO của nó (nếu có) nằm ngoài phạm vi tài liệu này.
- **Kế hoạch chuyển dịch sang Cloudflare cho sản phẩm hiện tại**: đã rà soát các tài liệu roadmap/quyết định (bao gồm `docs/decisions/ADR-002-sqlite-d1-r2-storage-split.md`) — không tìm thấy cam kết lộ trình cụ thể (mốc thời gian, phạm vi) để di dời `apps/` + `dustguard-operations/` sang Cloudflare D1/R2. ADR-002 mô tả một *chính sách phân tầng lưu trữ* ở mức khái niệm (nêu D1/R2 như một lựa chọn tầng lưu trữ song song với SQLite/Local Disk), không phải một kế hoạch triển khai đã phê duyệt cho hệ thống hiện hành. Nếu trong tương lai có quyết định chính thức di dời, tài liệu này cần được viết lại với RPO/RTO đo thực tế trên hạ tầng đó — không suy đoán trước.

---

## 7. Khuyến Nghị Cải Thiện (Chưa Triển Khai — Ghi Nhận Để Theo Dõi)

Các mục sau là khoảng trống thực tế phát hiện được, **chưa được triển khai**, liệt kê để minh bạch:
1. Chưa có lịch backup tự động (cron/scheduled task) cho 2 CSDL — hiện là thao tác thủ công.
2. Chưa có sao lưu ra ngoài ổ đĩa vật lý hiện tại (off-site/off-disk) — bản sao lưu và bản gốc cùng nằm trên một ổ đĩa.
3. Chưa có cơ chế sao lưu cho thư mục `uploads/` (ảnh bằng chứng, PDF).
4. Trên Windows, lệnh `restore` cần dừng tiến trình server trước để tránh lỗi khóa tệp `-shm`/`-wal` (WAL mode); quy trình vận hành cần bổ sung bước này thành hướng dẫn chính thức thay vì ngầm định.
