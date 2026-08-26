# Rule: Windows PowerShell Execution & Proactive CLI Action

1. **Chủ Động Chạy CLI**:
   - Tự động chạy tất cả các lệnh kiểm tra, build, migrate, commit thông qua tool `run_command`. Tuyệt đối không yêu cầu người dùng phải gõ lệnh thủ công.
2. **Cú Pháp PowerShell Chuẩn**:
   - Không sử dụng các lệnh Unix shell không hỗ trợ trong PowerShell (`grep`, `export`, `rm -rf`, `mkdir -p`, `cat`).
   - Sử dụng lệnh PowerShell tương đương: `Select-String`, `$env:VAR`, `Remove-Item -Recurse -Force`, `New-Item -ItemType Directory -Force`, `Get-Content`.
3. **Không Thay Đổi Thư Mục Bằng `cd`**:
   - Sử dụng tham số `Cwd` hoặc chỉ định path trực tiếp (`npm --prefix app ...`, `git -C app ...`).
