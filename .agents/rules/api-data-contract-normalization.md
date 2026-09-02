# API DATA CONTRACT & NORMALIZATION RULE — DUSTGUARD VN

> **Mục tiêu tối thượng**: Loại bỏ 100% lỗi runtime do mismatch shape dữ liệu giữa Backend và Frontend (như `slice is not a function`, `map is not a function`, `Cannot read properties of undefined`).

---

## 1. Nguyên Tắc Cốt Lõi (Invariants)

1. **Frontend CẤM Đoán Response Shape**:
   - Trước khi code UI hoặc API client: Đọc route handler backend thực tế để biết chính xác schema JSON.
   - Không giả định backend trả `[...]` khi backend trả `{ data: { items: [...] } }` hoặc ngược lại.

2. **Kiến Trúc Chuẩn Hóa Phân Tầng (Layered Architecture)**:
   ```text
   Backend (Cloudflare D1 / Worker)
          ↓
      Raw JSON
          ↓
     API Client Layer (request.js / *api.js)  <-- [BẮT BUỘC NORMALIZATION]
          ↓
   Normalized Data (Domain Entities, Array = [], Object = Safe Defaults)
          ↓
   React State & Components (Không bao giờ phải đoán shape)
   ```

3. **Collection Phải Luôn Normalize Thành Array `[]`**:
   - Tuyệt đối không để API method trả về `undefined`, `null` hoặc raw object khi hàm đó đại diện cho một danh sách (list/items).
   - Chuẩn unwrap:
     ```js
     export const normalizeList = (res) => {
       if (Array.isArray(res)) return res;
       if (Array.isArray(res?.data?.items)) return res.data.items;
       if (Array.isArray(res?.data)) return res.data;
       if (Array.isArray(res?.items)) return res.items;
       return [];
     };
     ```

4. **Kiểm Tra HTTP `res.ok` Trước Khi Xử Lý**:
   - Cấm nhét payload lỗi (`{ error: "Unauthorized" }` hoặc RFC 7807 problem details) vào state dữ liệu thành công.
   - `request.js` phải ném lỗi có cấu trúc khi `!response.ok`.

5. **Phòng Vệ Đa Tầng (Defensive Consumption)**:
   - Trước các thao tác collection `.map()`, `.slice()`, `.filter()`, `.find()`, `.reduce()`:
     State khởi tạo phải là `[]` (ví dụ `useState([])`).
   - Nếu dữ liệu truyền từ props/external: Luôn đảm bảo `(Array.isArray(items) ? items : []).slice(...)`.

6. **Cấm Dùng `as Type[]` Hoặc Optional Chaining Tràn Lan Để Vá Víu**:
   - Phải sửa contract tại nguồn API layer thay vì đặt `?.` khắp nơi mà dữ liệu bên dưới vẫn sai.
   - Mọi API method trong `staff-api.js`, `public-api.js`, `contractor-api.js`, `admin-api.js` phải return normalized data.

---

## 2. Checklist Khi Viết API Client Method Mới

- [ ] Đã kiểm tra route backend trả về: `{ status: 'success', data: ... }` hay raw JSON?
- [ ] Danh sách items có được unwrap và fallback `[]` an toàn không?
- [ ] Object chi tiết có fallback `{}` an toàn không?
- [ ] Đã test case backend trả về rỗng (`{ items: [] }` hoặc `null`) không làm crash frontend?
- [ ] DevTools Console không có bất kỳ warning hay TypeError nào.
