# Rule: 5-Tier Verification Pipeline & Instant Failure Recovery

1. **Không Chạy Full Verify Khi Đang Code**:
   - Trong quá trình phát triển tính năng hoặc sửa bug, chỉ chạy Level 0 targeted test (`node --test app/tests/<file>.test.js`) hoặc Level 1 `verify:changed`.
2. **Cổng Kiểm Tra Trước Khi Hoàn Tất**:
   - Trước khi thông báo hoàn tất task cho người dùng, bắt buộc chạy Level 3 `npm --prefix app run verify:quick`.
3. **Quy Trình Khôi Phục Lỗi**:
   - Khi có test fail: Ngay lập tức cô lập test fail đó, chạy riêng bằng `node --test app/tests/<failed>.test.js`, sửa lỗi tận gốc, và chạy lại `verify:quick`.
   - Tuyệt đối không spam lệnh full test khi chưa sửa xong lỗi cục bộ.
