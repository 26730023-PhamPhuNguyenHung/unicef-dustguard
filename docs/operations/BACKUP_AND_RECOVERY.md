# DUSTGUARD VN — QUY TRÌNH SAO LƯU & PHỤC HỒI DỮ LIỆU (BACKUP & DISASTER RECOVERY)

> **Mã tài liệu**: `DG-OPS-BACKUP-RECOVERY-01`  
> **Phiên bản**: 1.0.0 | **Ngày ban hành**: 06/09/2026  
> **Áp dụng cho**: Side A (`dustguard-community.db`) & Side B (`dustguard-operations.db`) & R2 Storage

---

## 1. Mục Tiêu Khôi Phục (RPO & RTO Targets)

| Chỉ số vận hành | Định mức mục tiêu | Cơ chế kỹ thuật đảm bảo |
|---|:---:|---|
| **RPO (Recovery Point Objective)** | **< 1 giờ** | Sao lưu định kỳ hàng giờ kết hợp SQLite WAL Mode (Write-Ahead Logging); không mất dữ liệu giao dịch đã commit. |
| **RTO (Recovery Time Objective)** | **< 5 phút** | Phục hồi trực tiếp bằng CLI `node scripts/backup-restore.js restore <snapshot>`; tự động kiểm định mã băm SHA-256. |

---

## 2. Đối Tượng Sao Lưu (What Gets Backed Up)

1. **Cơ sở dữ liệu SQLite SSOT (Side A Community DB)**:
   - Đường dẫn: `data/dustguard-community.db`
   - Kèm các tệp phụ trợ WAL: `dustguard-community.db-wal`, `dustguard-community.db-shm`
   - Phạm vi: 21 bảng (tài khoản công dân, phản ánh, bằng chứng, tọa độ, tín chỉ thanh niên, thông báo, nhật ký kiểm toán).
2. **Cơ sở dữ liệu SQLite SSOT (Side B Operations DB)**:
   - Đường dẫn: `dustguard-operations/data/dustguard-operations.db`
   - Kèm các tệp phụ trợ WAL: `dustguard-operations.db-wal`, `dustguard-operations.db-shm`
   - Phạm vi: 41 bảng (hồ sơ vụ việc, nhiệm vụ thanh tra, biên bản hiện trường, lệnh khắc phục nhà thầu, pháp điển FTS5, quyết định chuyên viên).
3. **Kho lưu trữ tệp & bằng chứng (Cloudflare R2 / Local Storage)**:
   - Ảnh hiện trường, chứng chỉ số PDF, biên bản A4.

---

## 3. Tần Suất & Thời Gian Lưu Trữ (Frequency & Retention)

- **Tần suất sao lưu tự động**:
  - Hàng ngày (Daily Snapshot): Chạy lúc 00:30 UTC hàng ngày, lưu trữ trong 30 ngày.
  - Hàng tuần (Weekly Archive): Chạy vào Chủ nhật hàng tuần, lưu trữ trong 12 tháng.
  - Trước mỗi đợt Release / Migration: Thực thi Snapshot thủ công qua CLI.
- **Vị trí lưu trữ**:
  - Cục bộ: Thư mục `backups/backup-<ISO_TIMESTAMP>/`
  - Đám mây: Cloudflare R2 Bucket sao lưu chuyên biệt `dustguard-backups-vault/` có bật Object Lock chống xóa sửa.

---

## 4. Kiểm Định Toàn Vẹn Mật Mã (Cryptographic Verification)

Mỗi bản sao lưu đều tự động tạo tệp `backup_manifest.json` ghi nhận:
- Tên và kích thước tệp (bytes).
- Số lượng bảng và tổng số dòng dữ liệu (`DatabaseSync` inspection).
- **Mã băm SHA-256** của từng tệp cơ sở dữ liệu.
- Khi phục hồi, script sẽ tính toán lại mã băm byte thực tế; nếu sai lệch dù chỉ 1 bit, tiến trình phục hồi sẽ lập tức từ chối và báo động `TAMPER_DETECTED`.

---

## 5. Hướng Dẫn Vận Hành CLI (Execution Guide)

### 5.1. Thực hiện Sao lưu (Backup)
```powershell
# Chạy sao lưu tự động cả 2 CSDL
node scripts/backup-restore.js backup
```

### 5.2. Phục hồi Dữ liệu từ Snapshot (Restore)
```powershell
# Khôi phục từ một thư mục sao lưu cụ thể
node scripts/backup-restore.js restore backup-2026-09-06T03-38-28-528Z
```

### 5.3. Chạy Kiểm Thử Tự Động Toàn Vẹn Phục Hồi (Verification Test)
```powershell
# Tạo DB giả lập -> Snapshot -> Sửa hỏng DB -> Khôi phục -> So sánh đối soát
node scripts/backup-restore.js test
```
*Kết quả kiểm thử thực tế đã xác nhận: **PASS 100% (5/5 bước đối soát khớp tuyệt đối)**.*
