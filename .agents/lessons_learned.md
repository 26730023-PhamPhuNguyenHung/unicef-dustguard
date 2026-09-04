# DUSTGUARD VN — LESSONS LEARNED & TECHNICAL KNOWLEDGE BASE

> **Kho lưu trữ kinh nghiệm, bài học kiến trúc và phòng chống lỗi kỹ thuật (Anti-Regression)**  
> *Cập nhật sau mỗi chu trình phát triển tính năng mới thành công.*

---

## 📅 Bài học từ Dự án: DustGuard Operations (2026-09-05)

### 1. Kiến Trúc Express Router Sub-mount & Tránh Lỗi Lặp Đường Dẫn (Route Doubling Bug)
- **Vấn đề**: Khi mount một router vào một path tiền tố trong file server chính:
  ```typescript
  // index.ts
  app.use('/api/cases', casesRouter);
  ```
  Nếu bên trong `casesRouter` (hoặc các sub-router như `legalRouter`, `inspectionsRouter`) lại định nghĩa:
  ```typescript
  router.post('/cases/:id/legal/analyze', ...);
  ```
  Đường dẫn thực tế khi gọi từ Client sẽ bị gấp đôi thành `/api/cases/cases/:id/legal/analyze`, dẫn đến lỗi **404 Cannot POST**.
- **Giải pháp chuẩn hóa**:
  Mọi sub-router mount dưới `/api/cases` phải nhận dạng root của nó là `/:id/...`:
  ```typescript
  // legal.router.ts (được mount tại /api/cases)
  router.post('/:id/legal/analyze', ...);
  router.post('/:id/legal/review', ...);
  ```
  Luôn audit bảng định tuyến (Route Table) trước khi tích hợp Frontend.

---

### 2. Node.js 24 Native SQLite (`node:sqlite`) Parameter Binding với Kiểu Dữ Liệu Phức Tạp
- **Vấn đề**: Module native `DatabaseSync` của Node 24 kiểm tra kiểu dữ liệu nghiêm ngặt hơn các thư viện cũ (như `better-sqlite3`). Khi truyền một JavaScript Array (ví dụ danh sách `evidence_asset_ids: string[]`) trực tiếp vào prepared statement:
  ```typescript
  stmt.run(id, caseId, evidenceIds); // ❌ Throw: TypeError: Provided value cannot be bound to SQLite parameter
  ```
- **Giải pháp chuẩn hóa**:
  Mọi trường quan hệ nhiều-nhiều hoặc mảng nhúng (embedded arrays/JSON objects) bắt buộc phải serialize qua `JSON.stringify(val || [])` trước khi bind vào câu lệnh SQL:
  ```typescript
  stmt.run(id, caseId, JSON.stringify(evidenceIds || [])); // ✅ Chuẩn SQLite TEXT
  ```

---

### 3. Tìm Kiếm Toàn Văn SQLite FTS5 (Full-Text Search) Địa Phương
- **Vấn đề**: Tìm kiếm FTS5 trên SQLite rất nhạy cảm với các ký tự đặc biệt (dấu ngoặc, dấu gạch ngang, toán tử boolean). Nếu người dùng nhập chuỗi tìm kiếm thô có ký tự đặc biệt, câu lệnh `MATCH ?` có thể quăng ngoại lệ cú pháp SQL FTS5.
- **Giải pháp chuẩn hóa**:
  Làm sạch từ khóa tìm kiếm, loại bỏ ký tự điều khiển FTS5 trước khi truy vấn, hoặc bọc từng từ khóa trong ngoặc kép với wildcard prefix:
  ```typescript
  const sanitized = query.replace(/['"*^()]/g, ' ').trim();
  const ftsQuery = sanitized.split(/\s+/).filter(Boolean).map(w => `"${w}"*`).join(' OR ');
  ```

---

### 4. Đảm Bảo Mobile Viewport 390x844 Không Bị Tràn Ngang (`noOverflow: true`)
- **Vấn đề**: Các component Header, Topbar, hoặc Flex container có chứa văn bản dài (như Tiêu đề vụ việc, Tên công trình) có thể đẩy container rộng hơn `390px`, gây thanh cuộn ngang khó chịu trên điện thoại.
- **Giải pháp chuẩn hóa**:
  1. Thêm `min-w-0 flex-1` cho container văn bản trong flexbox.
  2. Áp dụng `truncate` hoặc `line-clamp-1` kết hợp `text-wrap: pretty`.
  3. Kiểm tra bằng lệnh: `node scripts/verify-responsive.js` chạy qua 5 viewports từ $390\text{px}$ đến $1440\text{px}$ đạt 75/75 test pass.

---

### 5. SQLite Concurrency & Chống Khóa Cơ Sở Dữ Liệu (`PRAGMA busy_timeout = 5000`)
- **Vấn đề**: Khi chạy `tsx watch` tự động restart server hoặc khi các tiến trình test chạy song song với backend, SQLite WAL mode có thể quăng lỗi `ERR_SQLITE_ERROR (errcode: 261): database is locked` nếu thời gian chờ mặc định là 0ms.
- **Giải pháp chuẩn hóa**:
  Luôn cấu hình `PRAGMA busy_timeout = 5000;` ngay sau khi khởi tạo kết nối `DatabaseSync`:
  ```typescript
  export const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA busy_timeout = 5000;');
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  ```

---

### 6. Chuẩn Hóa Giá Trị Enum Trước Ràng Buộc SQLite `CHECK`
- **Vấn đề**: Schema SQLite định nghĩa nghiêm ngặt `CHECK (section_type IN ('Chapter', 'Article', 'Clause', 'Point', 'Section'))`. Trong khi đó, bộ phân tích regex hoặc giao diện người dùng có thể gửi lên chuỗi in hoa (`'ARTICLE'`) hoặc tiếng Việt (`'ĐIỀU'`), gây lỗi `CHECK constraint failed`.
- **Giải pháp chuẩn hóa**:
  Viết hàm helper `normalizeSectionType()` chuyển đổi trước khi insert vào CSDL:
  ```typescript
  function normalizeSectionType(type: string): string {
    const upper = (type || '').toUpperCase();
    if (upper.includes('CHƯƠNG') || upper === 'CHAPTER') return 'Chapter';
    if (upper.includes('MỤC') || upper === 'SECTION') return 'Section';
    if (upper.includes('ĐIỀU') || upper === 'ARTICLE') return 'Article';
    if (upper.includes('KHOẢN') || upper === 'CLAUSE') return 'Clause';
    if (upper.includes('ĐIỂM') || upper === 'POINT') return 'Point';
    return 'Article';
  }
  ```

---

### 7. Tương Thích Hai Tầng Client Unwrapping (`return data.data ?? data`)
- **Vấn đề**: Khi HTTP client bóc tách `data.data ?? data`, phản hồi trả về dạng mảng thô `[...]`. Nếu mã nguồn trang web truy cập cứng `res.devices` hoặc `res.rules`, giá trị sẽ là `undefined` làm bảng hiển thị 0 bản ghi rỗng.
- **Giải pháp chuẩn hóa**:
  1. Phía Server trả về cả `data` chuẩn lẫn các thuộc tính tiện ích tương thích ngược: `{ success: true, data: processed, devices: processed }`.
  2. Phía Client luôn kiểm tra kiểu mảng trước:
     ```typescript
     const list = Array.isArray(res) ? res : res.devices || res.data || [];
     ```

---

### 8. Thao Tác Windows PowerShell với Ký Tự `@` trong CLI
- **Vấn đề**: Trong môi trường PowerShell trên Windows, cú pháp `@e16` bị nhận diện là toán tử mảng/splatting của PowerShell, dẫn đến việc nuốt mất tham số khi truyền vào lệnh `agent-browser click @e16`.
- **Giải pháp chuẩn hóa**:
  Luôn bọc các selector có ký tự `@` trong cặp dấu nháy kép: `agent-browser click "@e16"`.  3. Thêm cấu hình toàn cục `overflow-x: hidden` tại `body` và `html`.
  4. Xác minh tự động qua `agent-browser`:
     ```javascript
     document.documentElement.scrollWidth <= window.innerWidth // Bắt buộc true
     ```

---

### 5. Spawn Child Process Khởi Động Dev Server Trên Windows PowerShell
- **Vấn đề**: Lệnh `npx` trên Windows là `npx.cmd`. Nếu gọi `spawn('npx', ...)` mà không có `{ shell: true }` sẽ quăng lỗi `ENOENT: spawn npx ENOENT`.
- **Giải pháp chuẩn hóa**:
  Luôn kiểm tra platform hoặc truyền `{ shell: true }`:
  ```javascript
  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  spawn(npxCmd, args, { stdio: 'inherit', shell: true });
  ```

---

### 6. Nguyên Tắc Cốt Lõi Về Logic Nghiệp Vụ (Domain Logic Invariants)
- **BUILD PASS != FEATURE PASS** và **TEST PASS != PRODUCT PASS**.
- Một tính năng chỉ hoàn tất khi:
  1. Logic đầu vào - đầu ra phù hợp nghiệp vụ thực tế (Ví dụ: Cổng kiểm tra 4 điều kiện khắt khe trước khi Đóng vụ việc: phải hoàn tất thanh tra, hết yêu cầu khắc phục, có biên bản pháp chế, và có tóm tắt lý do đóng).
  2. Dữ liệu ghi nhận bền vững vào CSDL SQLite SSOT thật (Reload F5 không mất dữ liệu).
  3. Kiểm chứng trực quan qua trình duyệt thực tế không có lỗi console, không gãy giao diện.
