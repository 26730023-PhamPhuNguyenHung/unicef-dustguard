# BUG ID: BUG-2026-XXX — [Tên Khiếm Khuyết / Lỗi Ngắn Gọn]

## 1. Hành Vi Quan Sát Được (Observed Behavior)
- Mô tả chính xác điều gì đã xảy ra (Lỗi màn hình, exception console, API trả về sai mã, dữ liệu mất sau F5).

## 2. Hành Vi Kỳ Vọng (Expected Behavior)
- Mô tả hành vi đúng chuẩn theo thiết kế vị nhân sinh và nghiệp vụ SSOT.

## 3. Các Bước Tái Hiện (Steps to Reproduce)
1. Bước 1: Truy cập route ...
2. Bước 2: Bấm nút ...
3. Bước 3: Quan sát thấy lỗi ...

## 4. Phân Loại Ngữ Cảnh (Context)
- **Vai trò bị ảnh hưởng (Affected Role)**: `CITIZEN` / `FIELD_STAFF` / `CONTRACTOR` / `ADMIN` / `EXECUTIVE`
- **Đường dẫn bị ảnh hưởng (Affected Route)**: `/path/...`
- **Tầng nghi vấn (Suspected Layer)**: Frontend UI / State / API Router / D1 SQLite / Network Proxy

## 5. Nguyên Nhân Gốc Rễ (Root Cause)
- Phân tích cặn kẽ tại sao lỗi lại xảy ra (Không chỉ mô tả triệu chứng).

## 6. Giải Pháp Khắc Phục An Toàn (Smallest Safe Fix)
- Tóm tắt thay đổi tối thiểu, phẫu thuật chính xác không gây xáo trộn kiến trúc.

## 7. Bằng Chứng Thực Chứng (Verification Evidence)
- File test đã chạy: `node --test app/tests/...`
- Bằng chứng DevTools: Console 0 error, network status 200, D1 persisted record.

## 8. Rủi Ro Hồi Quy (Regression Risk)
- Thấp / Trung bình / Cao kèm các biện pháp kiểm soát đã thực hiện.

## 9. Trạng Thái (Status)
- `OPEN` / `INVESTIGATING` / `FIXED` / `VERIFIED`
