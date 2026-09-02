# CIT-02 — Gửi Phản Ánh Hiện Trường 30 Giây

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/citizen/report/new` (và alias `/citizen/report`)
- **Primary Role**: Người dân / Tình nguyện viên tại hiện trường (`citizen`)
- **Secondary Roles**: Cán bộ kiểm tra nhanh (`staff`)
- **Current Component**: `ReportNewPage.jsx` (`app/src/apps/citizen/pages/report-new/ReportNewPage.jsx`)
- **Layout**: `CitizenLayout.jsx`
- **Primary Job**: Ghi nhận và gửi nhanh một phản ánh ô nhiễm bụi công trình tại hiện trường trong vòng dưới 30 giây bằng hình ảnh thực tế và định vị tự động.
- **Success Condition**: Người dân gửi thành công phản ánh với ít nhất 1 ảnh chụp và nhận được Mã hồ sơ tiếp nhận (`DG-...`) để theo dõi.

---

## 2. WHY THIS SCREEN EXISTS
- Quy trình phản ánh truyền thống quá rườm rà (viết đơn, nộp giấy hoặc khai báo nhiều thông tin hành chính). DustGuard thiết kế luồng "30s Quick Flow": Mở camera $\rightarrow$ Chụp ảnh $\rightarrow$ Tự động lấy GPS $\rightarrow$ Chọn nhanh loại vi phạm $\rightarrow$ Bấm gửi.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Nút "Gửi phản ánh" tại Trang chủ công dân (`/citizen`), nút nổi (FAB) trên bản đồ, hoặc quét mã QR tại biển báo công trình.
- **Exit Points**:
  - Gửi thành công $\rightarrow$ Mở Popup thành công kèm mã hồ sơ và nút "Theo dõi phản ánh" (`/citizen/reports/:id`).
  - Nút "Hủy / Quay lại" $\rightarrow$ Về Trang chủ công dân (`/citizen`).
- **Navigation Item**: Nút hành động trung tâm trên Bottom Nav.

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Mở form gửi phản ánh** | ❌ *(Redirect)* | ✅ | ✅ | ❌ | ✅ |
| **Tải ảnh / Chụp ảnh hiện trường** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Lấy tọa độ GPS tự động** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Gửi phản ánh vào hệ thống D1** | ❌ | ✅ | ✅ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW (30-SECOND QUICK FLOW)
```text
Bấm "Gửi phản ánh"
→ Bước 1: Bấm chụp ảnh hiện trường (hỗ trợ tối đa 3 ảnh)
→ Bước 2: Hệ thống tự động điền vị trí GPS và địa chỉ gần nhất
→ Bước 3: Chọn nhanh loại vấn đề (Bụi đào đất | Xe ben không rửa | Không che bạt | Khác)
→ Bước 4: Nhập mô tả ngắn gọn (tùy chọn)
→ Bấm nút lớn "GỬI PHẢN ÁNH" 
→ Nhận Mã phản ánh DG-2026-XXXX và thông báo "Đã tiếp nhận thành công"
```

---

## 6. INFORMATION HIERARCHY
1. **Form Header**: Tiêu đề "Gửi Phản Ánh Hiện Trường", nút "Hủy".
2. **Camera / Photo Upload Area**: Khung lớn có icon máy ảnh, chạm vào để mở camera hoặc thư viện ảnh. Hiển thị ảnh thu nhỏ có nút xóa.
3. **Location Card**: Tự động nhận diện địa chỉ (ví dụ: `123 Đường Nguyễn Thị Minh Khai, Phường Hải Châu 1`), nút "Định vị lại" nếu sai lệch.
4. **Issue Quick Tags (Thẻ chọn nhanh)**:
   - `Xe ben chở đất làm rơi vãi`
   - `Công trường không che chắn bạt`
   - `Không tưới nước dập bụi khi thi công`
   - `Bụi mù mịt ảnh hưởng nhà dân`
5. **Short Description**: Ô nhập mô tả ngắn gọn (tối đa 200 ký tự).
6. **Submit Button**: Nút "GỬI PHẢN ÁNH NGAY" màu đỏ son đậm, kích thước lớn $\ge 48\text{px}$.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Gửi Phản Ánh` (≤ 3 từ)
- **Primary CTA**: `GỬI PHẢN ÁNH NGAY` (≤ 4 từ)
- **Thông điệp thành công**: `Cảm ơn bạn! Phản ánh đã được gửi đến Đội trật tự đô thị.`

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Field | Target DB Table | Fallback |
|---|:---:|---|---|---|
| Ảnh hiện trường | Yes | `file/blob` | `evidences.url`, `evidences.sha256` | Bắt buộc 1 ảnh |
| Tọa độ GPS | Yes | `navigator.geolocation` | `complaints.latitude, complaints.longitude` | Chọn thủ công trên map |
| Địa chỉ phát hiện | Yes | Form input | `complaints.address` | "Hiện trường thực tế" |
| Phân loại vấn đề | Yes | Quick tags | `complaints.description` | `CONSTRUCTION_DUST` |

- **Current Implementation**: `POST /api/complaints`, `POST /api/storage/upload`

---

## 9. STATE MODEL
- **Submitting State**: Nút chuyển sang "Đang gửi ảnh & thông tin..." kèm spinner đỏ son.
- **Offline / Mất mạng**: Tự động lưu nháp tạm vào bộ nhớ thiết bị, hiển thị nút "Gửi lại khi có mạng".
- **Success Modal**: Hiện mã số tiếp nhận to rõ kèm mã QR tra cứu nhanh.

---

## 10. ACCEPTANCE CRITERIA
- [ ] Mở trực tiếp camera điện thoại khi chạm vào vùng chụp ảnh.
- [ ] Tự động bắt tọa độ GPS với sai số cho phép $\le 50\text{m}$.
- [ ] Tạo mới bản ghi trong bảng `complaints` và bảng `evidences` với mã băm SHA-256 tính toán thành công.
- [ ] Thời gian hoàn thành luồng không quá 30 giây đối với người dùng thông thường.

---

## 11. IMPLEMENTATION STATUS
- **CURRENT**: Form gửi phản ánh, chụp ảnh/tải ảnh, GPS tự động, danh mục chọn nhanh, gửi D1.
- **PARTIAL**: Lưu nháp ngoại tuyến khi mất sóng 4G.
- **PROPOSED**: Tự động nhận diện biển số xe ben hoặc tên công trình qua AI Vision.
