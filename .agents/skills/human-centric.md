# Hiến Chương Thiết Kế Vị Nhân Sinh (Human-Centric Constitution) — DustGuard VN

> **Mục tiêu**: Đảm bảo toàn bộ giao diện của DustGuard VN phục vụ con người trong điều kiện thực tế (ngoài trời nắng, thao tác 1 tay trên điện thoại, mạng chập chờn), ngôn ngữ đời thường, không gây quá tải nhận thức.

---

## 1. 4 Câu Hỏi Định Vị Tức Thì (Instant Orientation)
Mọi màn hình khi người dùng truy cập phải trả lời được trong vòng **3 giây**:
1. **Tôi đang ở đâu?** (Tiêu đề rõ ràng, thanh chỉ mục hoặc breadcrumb ngắn gọn).
2. **Việc chính tôi cần làm là gì?** (Một hành động ưu tiên nổi bật nhất - Dominant CTA).
3. **Trạng thái hiện tại là gì?** (Huy hiệu trạng thái trực quan, màu sắc theo quy ước quốc gia).
4. **Tôi nên làm gì tiếp theo?** (Bảng hướng dẫn bước tiếp theo rõ ràng, không bắt người dùng đoán).

---

## 2. Chuẩn Mực Ngôn Ngữ (Language & Copywriting)
- **Tiếng Việt Đời Thường Trước Tiên**: Tuyệt đối không dùng tiếng Anh hay thuật ngữ viết tắt không giải thích.
- **Nút Bấm Ngắn Gọn (1–3 Từ)**:
  - ❌ *Không tốt*: "Xác nhận hoàn tất quy trình kiểm tra thực địa" $\to$ ✅ *Chuẩn*: **"Hoàn tất"**
  - ❌ *Không tốt*: "Submit photographic evidence" $\to$ ✅ *Chuẩn*: **"Tải minh chứng"**
  - ❌ *Không tốt*: "Proceed to next DAG transition" $\to$ ✅ *Chuẩn*: **"Chuyển bước"**
- **Thông Báo Lỗi Thấu Cảm (No Raw Error)**:
  - ❌ *Không tốt*: `HTTP 500: Internal Server Error` $\to$ ✅ *Chuẩn*: **"Có lỗi kết nối. Vui lòng bấm thử lại."**
  - ❌ *Không tốt*: `Failed to fetch R2 object` $\to$ ✅ *Chuẩn*: **"Chưa tải được hình ảnh. Vui lòng kiểm tra mạng."**

---

## 3. Tác Nghiệp Hiện Trường Của Cán Bộ (Staff Field Operations)
Cán bộ kiểm tra công trình thường:
- Cầm điện thoại bằng 1 tay, tay kia cầm hồ sơ hoặc thiết bị đo.
- Đứng dưới trời nắng gắt, màn hình bị lóa (Cần nền sáng, tương phản cao, chữ to).
- Đang di chuyển trên đường bụi bặm, thao tác cần nhanh và chống bấm nhầm.

**Quy chuẩn bắt buộc cho màn hình Staff & Field**:
- Kích thước chạm (Touch Target) $\ge 44\text{px}$.
- Nút bấm chính nằm trong vùng ngón tay cái dễ chạm tới (Thumb-friendly zone).
- Tối thiểu hóa việc gõ phím: Cung cấp sẵn các mẫu ghi chú nhanh, nút chọn 1-chạm (Preset Photos, Checklist 10 tiêu chí Đạt/Chưa đạt).
- Lưu giữ trạng thái form nếu mất kết nối hoặc chuyển ứng dụng chụp ảnh.
- Không tạo chuỗi popup lồng nhau (No modal chains).

---

## 4. Phân Cấp Thông Tin (Information Hierarchy)
1. **Nổi bật**: Thông tin phục vụ trực tiếp cho quyết định hiện tại.
2. **Thứ cấp**: Dữ liệu ngữ cảnh bổ trợ (thời gian tạo, cán bộ liên quan).
3. **Ẩn sau tương tác mở rộng (Progressive Disclosure)**: Mã băm SHA-256, thông số JSON, nhật ký hệ thống.
4. **Không biến màn hình tác nghiệp thành Dashboard**: Khi cán bộ đang cần xử lý 1 hồ sơ, chỉ hiển thị thông tin hồ sơ đó, không nhồi nhét biểu đồ phân tích đô thị vào giữa luồng làm việc.

---

## 5. 10 Tiêu Chí Kiểm Toán Đánh Giá (Audit Dimensions)
1. Độ dễ hiểu (Comprehension)
2. Tải nhận thức (Cognitive Load)
3. Ngôn ngữ thân thiện (Zero Jargon)
4. Sự rõ ràng của hành động chính (Dominant Action Clarity)
5. Phân cấp thông tin (Information Hierarchy)
6. Khả năng dùng trên di động (Mobile Usability)
7. Khả năng phục hồi khi lỗi (Error Recovery)
8. Màn hình trống (Empty State)
9. Trạng thái tải (Loading Feedback)
10. Độ tương phản & Khả năng tiếp cận (Accessibility & Contrast)
