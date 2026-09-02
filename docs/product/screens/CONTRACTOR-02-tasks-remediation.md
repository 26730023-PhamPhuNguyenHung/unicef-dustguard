# CON-02 — Tiếp Nhận Khắc Phục & Nộp Minh Chứng

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/contractor/tasks` (và alias `/contractor/actions`)
- **Primary Role**: Chỉ huy phó / Đội thi công tại hiện trường (`contractor`)
- **Secondary Roles**: Cán bộ thanh tra kiểm tra đối chứng (`staff`)
- **Current Component**: `ContractorTasksPage.jsx` (`app/src/apps/contractor/pages/tasks/ContractorTasksPage.jsx`)
- **Layout**: `ContractorLayout.jsx`
- **Primary Job**: Tiếp nhận chi tiết yêu cầu khắc phục, chụp ảnh đối chứng hiện trường sau khi đã xử lý (tưới nước, quét đường, che bạt) và gửi giải trình tới cán bộ thanh tra.
- **Success Condition**: Nhà thầu tải lên thành công ít nhất 1 ảnh chụp hiện trường sau khắc phục, có định vị GPS hợp lệ trong phạm vi công trường và nhận được xác nhận đã nộp.

---

## 2. WHY THIS SCREEN EXISTS
- Khép kín vòng đời xử lý sự cố môi trường: biến yêu cầu của chính quyền thành hành động cụ thể tại công trường. Nhà thầu nộp ảnh chụp đối chứng làm bằng chứng pháp lý bảo vệ mình trước các phản ánh sai lệch và chứng minh đã tuân thủ quy chuẩn an toàn.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Click "Nộp minh chứng" từ Bàn làm việc (`/contractor`), hoặc mở từ link thông báo trực tiếp.
- **Exit Points**:
  - Nộp thành công $\rightarrow$ Hiển thị thông báo "Đã gửi minh chứng thành công! Đang chờ cán bộ nghiệm thu".
  - Nút quay lại $\rightarrow$ Về Dashboard (`/contractor`).
- **Navigation Item**: Sidebar / Header item "Yêu cầu khắc phục" (icon CheckCircle).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem chi tiết yêu cầu khắc phục** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Tải ảnh đối chứng (Sau khắc phục)**| ❌ | ❌ | ❌ | ✅ | ✅ |
| **Nhập nội dung giải trình biện pháp**| ❌ | ❌ | ❌ | ✅ | ✅ |
| **Ký xác nhận hoàn thành** | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /contractor/tasks 
→ Xem nội dung yêu cầu: "Tưới nước dập bụi cổng phụ đường Nguyễn Văn Linh và phủ bạt đống xà bần"
→ Xem ảnh hiện trường lúc vi phạm do cán bộ/người dân gửi
→ Thực hiện biện pháp tại chỗ: Cho xe bồn tưới nước và công nhân phủ bạt
→ Bấm nút "CHỤP ẢNH MINH CHỨNG SAU KHẮC PHỤC"
→ Hệ thống kiểm tra tọa độ GPS (bắt buộc trong bán kính ≤50m công trường)
→ Nhập ghi chú: "Đã tưới nước ướt đẫm và phủ kín bạt lúc 14:30"
→ Bấm "GỬI NGHIỆM THU"
```

---

## 6. INFORMATION HIERARCHY
1. **Task Info Header**: Tiêu đề yêu cầu, Mã hồ sơ liên kết, Hạn hoàn thành SLA (đồng hồ đếm ngược).
2. **Issue Evidence Box (Ảnh Hiện Trạng Ban Đầu)**: Ảnh chụp phát hiện vi phạm do chính quyền cung cấp kèm thời gian.
3. **Remediation Upload Area (Khu Vực Nộp Ảnh Khắc Phục)**:
   - Khung chụp ảnh camera trực tiếp (hỗ trợ chụp nhiều góc độ).
   - Kiểm tra định vị Geofence (Xanh lá: Đúng vị trí công trường, Đỏ: Ngoài phạm vi).
4. **Contractor Explanation Field**: Ô nhập tóm tắt các biện pháp đã triển khai (tưới nước, lắp vòi phun, che bạt).
5. **Submit CTA Button**: Nút "GỬI BẰNG CHỨNG NGHIỆM THU" màu xanh lá đậm `#0D6F64`, kích thước lớn $\ge 48\text{px}$.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Nộp Minh Chứng Khắc Phục` (≤ 5 từ)
- **Primary CTA**: `GỬI BẰNG CHỨNG NGHIỆM THU` (≤ 5 từ)
- **Geofence Warning**: `Vui lòng chụp ảnh tại vị trí công trường để xác thực tính hợp lệ.`

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Field | Target DB Table | Fallback |
|---|:---:|---|---|---|
| Ảnh minh chứng khắc phục | Yes | `file/blob` | `evidences.url`, `evidences.sha256` | Bắt buộc 1 ảnh |
| Tọa độ chụp ảnh | Yes | `geolocation` | `evidences` metadata | Tọa độ công trường |
| Ghi chú giải trình | No | Form text | `contractor_explanations.content` | "Đã khắc phục hoàn tất" |

- **Current Implementation**: `POST /api/contractor/tasks/:id/submit-evidence`

---

## 9. ACCEPTANCE CRITERIA
- [ ] Cho phép chụp ảnh và nạp trực tiếp từ điện thoại của đội thi công.
- [ ] Tính toán mã băm SHA-256 cho ảnh khắc phục bảo đảm tính chống chối bỏ.
- [ ] Cập nhật trạng thái nhiệm vụ sang `RESOLVED` và thông báo đến cán bộ thụ lý ngay lập tức.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Form nộp minh chứng, tải ảnh, nhập giải trình, cập nhật D1.
- **PARTIAL**: Kiểm tra ranh giới Geofence GPS tại hiện trường công trường.
- **PROPOSED**: Tích hợp quét mã QR trên xe bồn tưới nước tự động.
