---
name: evidence-r2-verification
description: Xác thực tính toàn vẹn của bằng chứng số, mã băm SHA-256 (Web Crypto), lưu trữ Cloudflare R2 bucket và đối chứng Before/After.
---

# Skill: Evidence R2 Verification & SHA-256 Digital Forensic Integrity

## Khi nào sử dụng
- Khi xử lý tải lên, tải về hoặc xác thực ảnh bằng chứng hiện trường (`observations`, `cases`, `complaints`, `remediations`).
- Khi tính toán hoặc kiểm tra mã băm SHA-256 (Digital Fingerprint) chống làm giả ảnh.
- Khi làm việc với Cloudflare R2 Bucket (`env.STORAGE` hoặc local upload mock).

## Quy tắc Tính Toàn Vẹn Minh Chứng
1. **Web Crypto First**:
   - Khi tính hash SHA-256 trên cả Frontend và Backend, ưu tiên sử dụng `globalThis.crypto.subtle.digest('SHA-256', buffer)`.
   - Bọc fallback `node:crypto` trong runtime check để tránh Vite 8 externalization warning khi build browser bundle.
2. **Metadata Minh Chứng Bắt Buộc**:
   - Mỗi file ảnh lưu vào R2 phải kèm metadata:
     * `sha256`: Chuỗi hex 64 ký tự của file gốc.
     * `timestamp`: Thời gian chụp ISO 8601.
     * `latitude` & `longitude`: Tọa độ GPS WGS84 lúc chụp.
     * `uploadedBy`: ID người dùng hoặc device hash.
3. **Đối Chứng Before/After Chống Gian Lận**:
   - Ảnh trước (Before) lấy từ Observation/Complaint ban đầu của cộng đồng.
   - Ảnh sau (After) do Nhà thầu tải lên phải thỏa mãn Geofence < 50m so với tọa độ công trình.
   - Hiển thị song song 2 ảnh kèm thông số ngày giờ và khoảng cách địa lý để cán bộ thanh tra nghiệm thu.

## Lệnh Kiểm Thử
```powershell
node --test app/tests/r2-evidence-storage.test.js
node --test app/tests/contractor-portal-audit.test.js
```
