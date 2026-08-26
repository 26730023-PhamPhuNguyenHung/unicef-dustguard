---
name: fast-verification-pipeline
description: Quy trình kiểm thử phân cấp 5 tầng siêu tốc và khôi phục lỗi tức thì cho DustGuard VN.
---

# Skill: Fast Verification Pipeline & Instant Failure Recovery

## Khi nào sử dụng
- Khi đang viết code hoặc sửa bug (chạy Level 0 targeted test trong < 0.5s).
- Sau khi hoàn thành 1 batch file (chạy Level 1 hoặc Level 2 trong < 5s).
- Trước khi hoàn tất task (chạy Level 3 `verify:quick` trong < 8s).
- Chuẩn bị commit / release (chạy Level 4 `verify` DUY NHẤT 1 LẦN).

## 5 Tầng Kiểm Thử Phân Cấp (5-Tier Pipeline)

```
Level 0: Targeted Test (< 0.5s)
  └─ node --test app/tests/<target_test>.test.js

Level 1: Changed Tests (< 3s)
  └─ npm --prefix app run verify:changed

Level 2: Domain Tests (< 5s)
  └─ npm --prefix app run verify:domain -- <domain_name>
     (domains: observations, risk, complaints, contractor, executive, youth, spatial, ui)

Level 3: Quick Gate (< 8s)  [DEFAULT GATE CHO AGENT]
  └─ npm --prefix app run verify:quick

Level 4: Full Release Gate (10-15s) [CHẠY DUY NHẤT 1 LẦN TRƯỚC COMMIT]
  └─ npm --prefix app run verify
```

## Quy trình Xử lý Khôi phục Lỗi (Failure Recovery Protocol)
Khi một tầng kiểm thử báo lỗi:
1. **Dừng lại ngay, KHÔNG chạy full verify**: Đọc chính xác tên file test bị fail và dòng lỗi (AssertionError, ReferenceError, Timeout).
2. **Cô lập và chạy Targeted Test riêng cho file lỗi**:
   ```powershell
   node --test app/tests/<failed_test>.test.js
   ```
3. **Phân tích Nguyên nhân Gốc (Root Cause)**:
   - Sai logic domain vs Sai mock/stub dữ liệu?
   - Thiếu import hoặc sai đường dẫn?
   - TDZ (Temporal Dead Zone) trong React hooks?
   - Thiếu WGS84 spatial normalization?
4. **Sửa code cục bộ** và chạy lại targeted test cho đến khi pass xanh.
5. **Chạy lại `verify:quick`** để xác nhận không có hiệu ứng phụ (regression).
