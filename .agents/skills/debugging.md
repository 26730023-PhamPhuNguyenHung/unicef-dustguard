# Kỹ Năng Gỡ Lỗi Tự Chủ (Autonomous Debugging & Fix Loop) — DustGuard VN

> **Mục tiêu**: Hướng dẫn quy trình phát hiện, cô lập và khắc phục lỗi dứt điểm tận gốc rễ (Root Cause), tuyệt đối không sửa đổi bề mặt để che giấu triệu chứng.

---

## 1. Nguyên Tắc Tối Thượng: Sửa Gốc Rễ, Không Sửa Ảnh Chụp
> **"FIX THE ROOT CAUSE, NOT THE SCREENSHOT."**
- Không dùng các biện pháp tạm bợ (hacky CSS như `overflow: hidden !important` để che lỗi tính toán chiều rộng, hoặc mock data để vượt qua lỗi gọi API).
- Không viết lại toàn bộ module hoặc xóa code cũ khi chỉ có 1 dòng logic bị sai lệch.
- Không mở rộng phạm vi sửa lỗi ngoài bằng chứng kiểm thử yêu cầu.

---

## 2. Vòng Lặp Sửa Lỗi 7 Bước (7-Step Fix Loop)
```text
1. REPRODUCE (Tái hiện):
   Chạy test mục tiêu hoặc kịch bản trình duyệt để tái hiện chính xác lỗi.

2. ISOLATE (Cô lập):
   Xác định tầng bị lỗi: Frontend React State / API Route / SQL D1 Schema / Network Proxy.

3. ROOT CAUSE (Tìm nguyên nhân gốc):
   Đọc trace stack, kiểm tra biến đầu vào, điều kiện rẽ nhánh và kiểu dữ liệu.

4. SMALLEST SAFE FIX (Sửa nhỏ nhất và an toàn nhất):
   Áp dụng thay đổi tối thiểu cần thiết để giải quyết đúng nguyên nhân gốc.

5. FOCUSED TEST (Chạy lại test mục tiêu):
   Chạy lại `node --test app/tests/<target>.test.js` trong thời gian < 0.5s để xác nhận lỗi đã biến mất.

6. REAL APP VERIFY (Kiểm chứng trên ứng dụng thật):
   Mở màn hình thật trên browser, kiểm tra console 0 error, kiểm tra D1 re-query.

7. REGRESSION CHECK (Kiểm tra hồi quy):
   Chạy bộ kiểm thử nhanh `npm --prefix app run verify:quick` đảm bảo không gây lỗi lan truyền.
```

---

## 3. Mẫu Ghi Nhận Lỗi Chuẩn (.specify/bugs/)
Mỗi lỗi nghiêm trọng cần được ghi lại theo mẫu để học hỏi và chống tái phát:
- **Mã lỗi (BUG ID)**: `BUG-YYYY-XXX`
- **Hành vi thực tế (Observed)** vs **Hành vi kỳ vọng (Expected)**
- **Các bước tái hiện (Steps to reproduce)**
- **Tầng lỗi & Nguyên nhân gốc rễ (Root Cause)**
- **Giải pháp khắc phục (Fix applied)**
- **Bằng chứng thực chứng (Verification evidence)**
