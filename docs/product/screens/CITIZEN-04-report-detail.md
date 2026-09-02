# CIT-04 — Chi Tiết Phản Ánh & Đối Chứng Trước/Sau

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/citizen/reports/:id`
- **Primary Role**: Người dân theo dõi phản ánh (`citizen`)
- **Secondary Roles**: Tình nguyện viên, Cán bộ giám sát (`staff`)
- **Current Component**: `ReportDetailPage.jsx` (`app/src/apps/citizen/pages/reports/ReportDetailPage.jsx`)
- **Layout**: `CitizenLayout.jsx`
- **Primary Job**: Xem chi tiết toàn bộ tiến trình giải quyết phản ánh và đối chứng trực quan hình ảnh Trước khi xử lý vs Sau khi nhà thầu khắc phục xong.
- **Success Condition**: Người dân nhìn thấy rõ ràng kết quả khắc phục bằng hình ảnh thực tế và đánh giá được mức độ hài lòng.

---

## 2. WHY THIS SCREEN EXISTS
- Xây dựng niềm tin vững chắc giữa người dân và chính quyền đô thị thông qua sự minh bạch tuyệt đối: người dân thấy được phản ánh của mình không bị "chìm xuồng", mà đã được cán bộ kiểm tra và nhà thầu thực sự tưới nước, che bạt, rửa đường thông qua ảnh đối chứng Before/After rõ ràng.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Click từ Sổ tay phản ánh (`/citizen/reports`), từ Trang chủ (`/citizen`), hoặc quét mã QR tra cứu.
- **Exit Points**:
  - Nút quay lại $\rightarrow$ Về Sổ tay phản ánh (`/citizen/reports`).
  - Nút "Gửi phản ánh mới" $\rightarrow$ Mở `/citizen/report/new`.
- **Navigation Item**: Breadcrumb / Back button "Quay lại danh sách".

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem chi tiết phản ánh** | ❌ | ✅ *(Owner)* | ✅ | ❌ | ✅ |
| **So sánh ảnh Trước/Sau** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Đánh giá mức độ hài lòng (1-5 sao)**| ❌ | ✅ *(Khi đã hoàn tất)*| ❌ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /citizen/reports/:id 
→ Đọc thanh tiến trình 4 bước: "Đã gửi" → "Đã tiếp nhận" → "Đang khắc phục" → "Đã hoàn thành"
→ Xem ảnh chụp lúc gửi ban đầu
→ Xem ảnh chụp nghiệm thu sau khi nhà thầu đã khắc phục
→ Kéo thanh trượt so sánh Before / After (hoặc xem 2 ảnh cạnh nhau)
→ Đánh giá mức độ hài lòng và để lại lời cảm ơn
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Mã phản ánh (`DG-2026-XXXX`), Thời gian gửi, Địa chỉ phát hiện, Badge trạng thái lớn.
2. **Citizen Progress Stepper (4 Giai Đoạn)**:
   - `1. Đã gửi phản ánh` $\rightarrow$ `2. Cán bộ đã tiếp nhận` $\rightarrow$ `3. Nhà thầu đang xử lý` $\rightarrow$ `4. Đã khắc phục xong`
3. **Before & After Visual Proof Area (Minh Chứng Trước/Sau)**:
   - **Ảnh Trước (Before)**: Ảnh chụp hiện trường lúc phát hiện ô nhiễm (có ngày giờ & mã băm).
   - **Ảnh Sau (After)**: Ảnh chụp công trường sau khi tưới nước, rửa đường hoặc che bạt kín.
4. **Resolution Notes**: Ghi chú tóm tắt từ cán bộ phụ trách (ví dụ: *Đội TTXD Quận đã yêu cầu nhà thầu tưới nước 4 lần/ngày và rửa sạch bùn đất trên đường*).
5. **Feedback & Rating Block**: Chọn số sao hài lòng (⭐⭐⭐⭐⭐) và nút "Gửi đánh giá".

---

## 7. CONTENT CONTRACT
- **Page Title**: `Chi Tiết Phản Ánh` (≤ 4 từ)
- **Status Stepper Labels**: Ngắn gọn, dễ hiểu, tránh thuật ngữ nghiệp vụ nội bộ (DAG/SLA).
- **Primary Action**: `Đánh giá kết quả` (≤ 3 từ).

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Chi tiết phản ánh | Yes | `complaints` table | `complaints.*` | `—` |
| Ảnh ban đầu (Before) | Yes | `evidences` table | `evidences.url` (gắn complaintId) | Placeholder |
| Ảnh khắc phục (After) | No | `evidences` table | `evidences.url` (gắn actionId) | "Đang chờ khắc phục" |
| Đánh giá của dân | No | `complaints` table | `feedbackNote` | `—` |

- **Current Implementation**: `GET /api/complaints/:id`, `POST /api/complaints/:id/feedback`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Hiển thị đầy đủ và rõ nét ảnh Trước và ảnh Sau khi vụ việc được khắc phục.
- [ ] Thanh tiến trình 4 giai đoạn thể hiện chính xác trạng thái thực tế từ D1.
- [ ] Cho phép công dân gửi đánh giá sao hài lòng sau khi hoàn thành.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Chi tiết phản ánh, stepper 4 giai đoạn, hiển thị ảnh đối chứng Before/After, gửi feedback.
- **PARTIAL**: Thanh trượt so sánh ảnh Before/After tương tác trực tiếp (Image Slider).
- **PROPOSED**: Tải giấy xác nhận đóng góp công dân số dạng chứng chỉ điện tử.
