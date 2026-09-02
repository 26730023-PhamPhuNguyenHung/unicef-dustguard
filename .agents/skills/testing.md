# Kỹ Năng Kiểm Thử (Testing) — DustGuard VN

> **Mục tiêu**: Vận hành hệ thống kiểm thử phân tầng siêu tốc với Node.js Native Test Runner (`node --test`), đảm bảo phát hiện lỗi hồi quy tức thì và chi phí thực thi tối thiểu.

---

## 1. Cấu Trúc Kiểm Thử Phân Tầng (Test Pyramid)

| Cấp độ kiểm thử | Lệnh thực thi | Mục tiêu thời gian | Trách nhiệm |
|---|---|---|---|
| **Level 0 (Micro Test)** | `node --test app/tests/<file>.test.js` | $< 0.5\text{s}$ | Kiểm tra 1 chức năng cụ thể sau khi sửa code. |
| **Level 1 (Domain Logic)** | `node app/scripts/verify-domain.js unit` | $< 2\text{s}$ | Kiểm tra logic tính toán, SLA, Geofence, DAG state machine. |
| **Level 2 (D1 Database)** | `node app/scripts/verify-domain.js database` | $< 3\text{s}$ | Kiểm tra truy vấn và ràng buộc CSDL D1 SQLite thật. |
| **Level 3 (Quick Gate)** | `npm --prefix app run verify:quick` | $< 7\text{s}$ | Chạy trước khi commit; 100% tests in-memory & UI smoke phải pass. |
| **Level 4 (Release Check)** | `npm --prefix app run verify` | $< 30\text{s}$ | Chạy trước khi phát hành hoặc nghiệm thu toàn diện. |

---

## 2. Tiêu Chuẩn Viết Test
- Sử dụng thư viện chuẩn tích hợp `node:test` và `node:assert/strict`.
- Không phụ thuộc vào môi trường bên ngoài (No external cloud dependency).
- Mọi test phải độc lập, tự dọn dẹp dữ liệu thử nghiệm (hoặc dùng transaction / database cô lập).
- Tên test phải mô tả rõ ràng hành vi kỳ vọng và tiêu chí nghiệm thu (Acceptance Criteria).
- Test pass là chưa đủ; phải kiểm chứng logic đầu vào/đầu ra phản ánh đúng bài toán thực tế của đô thị.
