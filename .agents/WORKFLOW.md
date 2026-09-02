# DUSTGUARD VN — 8-STAGE AGENTIC WORKFLOW & CONTEXT ENGINEERING

> **Phương pháp chuẩn (Tháng 8/2026)**: Không "code mù quáng", không "prompt 2 tiếng rồi check build".  
> **Vòng lặp chuẩn**: `SPEC → IMPLEMENT → VERIFY → OBSERVE → REVIEW → FIX → COMMIT → NEXT`

---

## 1. Vòng Lặp 8 Giai Đoạn (The 8-Stage Loop)

```text
       [1. SPEC (Xác định mục tiêu & Tiêu chí máy đo được)]
                                 ↓
       [2. IMPLEMENT (Tái sử dụng > Sửa > Tạo mới)]
                                 ↓
       [3. VERIFY CODE (Targeted Test < 0.5s)]
                                 ↓
       [4. OBSERVE PRODUCT (DevTools / Browser / Mobile / D1 Persist)]
                                 ↓
       [5. HUMAN-CENTRIC REVIEW (Ngôn từ đời thường, Touch ≥ 44px)]
                                 ↓
       [6. FIX LOOP (Tìm nguyên nhân gốc rễ → Sửa nhỏ an toàn)]
                                 ↓
       [7. COMMIT CHECKPOINT (Micro-commit Git có kiểm chứng)]
                                 ↓
       [8. NEXT (Chuyển sang lát cắt nghiệp vụ tiếp theo)]
```

---

## 2. Chi Tiết Từng Giai Đoạn

### Giai đoạn 1: SPEC (Executable Specification)
- Xác định rõ: Role (Citizen/Staff/Contractor/Admin/Executive), Mục tiêu người dùng, Happy path, Failure paths.
- Tiêu chí máy đo được (Executable Criteria):
  - *AC-01*: Viewport 375px không tràn ngang (`overflow-x: hidden`).
  - *AC-02*: Nút bấm thao tác chính luôn hiển thị trong tầm mắt.
  - *AC-03*: Gọi API thật lưu vào D1 SQLite (`prisma/dev.db`), F5 reload không mất.

### Giai đoạn 2: IMPLEMENT (Minimum Working Set)
- Không đọc bừa toàn bộ repository (tránh ngộ độc context).
- Xác định cây phụ thuộc nhỏ nhất (Minimum Dependency Graph) liên quan đến màn hình.
- Ưu tiên: `Tái sử dụng > Mở rộng > Sửa > Tạo mới`. Cấm duplicate component/service.

### Giai đoạn 3: VERIFY CODE (Fast Inner Test)
- Chạy test mục tiêu trong `< 0.5s`: `node --test app/tests/<file>.test.js`.
- Không spam chạy toàn bộ test trong lúc đang sửa 1 dòng code.

### Giai đoạn 4: OBSERVE PRODUCT (DevTools & Runtime Observation)
- Mở trang web thật qua Vite Dev Server / Chrome DevTools.
- Kiểm tra trực quan: 375px (Mobile), 1366px (Laptop), 1920px (Desktop).
- Kiểm tra Console: 0 lỗi đỏ, 0 warning React render object.
- Kiểm tra Network: Payload đúng shape, không 4xx/5xx, không lặp request.
- Kiểm tra CRUD: Create $\rightarrow$ F5 còn; Update $\rightarrow$ F5 nhận giá trị mới; Delete $\rightarrow$ F5 biến mất.

### Giai đoạn 5: HUMAN-CENTRIC REVIEW (Đời thường & Dễ dùng)
- Đọc lại toàn bộ copy UI: Nút bấm 1-3 từ, 0% developer jargon.
- Bỏ các từ: `SLA`, `DAG`, `SHA-256`, `Telemetry`, `Escrow`, `Orchestration`.
- Thay bằng: `Hạn xử lý`, `Tiến độ`, `Lưu nguyên bản`, `Cảm biến`, `Khắc phục`.

### Giai đoạn 6: FIX LOOP (Sửa dứt điểm nguyên nhân gốc)
- Nếu phát hiện lỗi: `Tái hiện → Tìm nguyên nhân gốc → Sửa nhỏ gọn → Kiểm tra lại`.
- Không vá víu CSS để che lỗi logic backend.

### Giai đoạn 7: COMMIT CHECKPOINT (Save-game)
- Khi tính năng pass Level 3 Gate (`npm --prefix app run verify:quick`):
  - Cập nhật `.agents/TIMELINE.md`.
  - Chạy `git add` và `git commit -m "<type>(scope): <description>"`.

### Giai đoạn 8: NEXT (Lát cắt tiếp theo)
- Chuyển sang lát cắt dọc (Vertical Slice) tiếp theo trong User Journey.
