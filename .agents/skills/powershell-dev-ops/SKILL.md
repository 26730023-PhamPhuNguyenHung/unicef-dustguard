---
name: powershell-dev-ops
description: Hướng dẫn thực thi lệnh Windows PowerShell chính xác, tránh các lỗi cú pháp Unix shell, tự động chạy lệnh trực tiếp và tối ưu hóa tác vụ CLI.
---

# Skill: Windows PowerShell DevOps & CLI Automation

## Khi nào sử dụng
- Khi chạy bất kỳ lệnh terminal/CLI nào trong môi trường Windows PowerShell.
- Khi quản lý file, thư mục, git, npm, node test runners.
- Khi khắc phục các lỗi đặc thù của Windows (đường dẫn `\`, khoảng trắng, escaping, quotes).

## Quy tắc Vận hành PowerShell (PowerShell Invariants)
1. **Chủ Động Thực Thi**: Tự chạy lệnh trực tiếp bằng tool `run_command`, tuyệt đối không yêu cầu người dùng copy-paste hay gõ thủ công.
2. **Không dùng `cd` Command**: Luôn dùng tham số `Cwd` hoặc chỉ định path trực tiếp (`npm --prefix app ...`, `git -C app ...`).
3. **Cấm dùng Cú pháp Unix Shell**:
   - ❌ `grep "text" file` ➔ ✅ `Select-String -Pattern "text" -Path file` hoặc ripgrep `rg "text"`.
   - ❌ `export VAR="val"` ➔ ✅ `$env:VAR="val"`.
   - ❌ `rm -rf dir` ➔ ✅ `Remove-Item -Recurse -Force dir`.
   - ❌ `mkdir -p dir` ➔ ✅ `New-Item -ItemType Directory -Force -Path dir`.
   - ❌ `cat file` ➔ ✅ `Get-Content file` hoặc tool `view_file`.
4. **Dấu gạch chéo đường dẫn (Path Separator)**:
   - Trong PowerShell command: Dùng `\` hoặc `/` đều được, nhưng ưu tiên `\` cho đường dẫn Windows nội bộ hoặc forward slash `/` trong npm scripts.
5. **WaitMsBeforeAsync hợp lý**:
   - Đối với test nhanh (< 1s): Đặt `WaitMsBeforeAsync: 5000`.
   - Đối với test suite lớn (`verify:quick`, `verify`): Đặt `WaitMsBeforeAsync: 10000`.

## Các Lệnh Thường Dùng Nhất
```powershell
# Chạy targeted test
node --test app/tests/<file>.test.js

# Chạy quick verify
npm --prefix app run verify:quick

# Chạy full verify
npm --prefix app run verify

# Kiểm tra git log rút gọn
git log -n 10 --oneline

# Kiểm tra trạng thái git submodule
git -C app status

# Tạo commit theo quy chuẩn
git add .
git commit -m "feat(scope): concise description"
```
