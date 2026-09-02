# STF-03 — Hồ Sơ Pháp Lý & Lịch Sử Công Trình

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/staff/sites/:id`
- **Primary Role**: Cán bộ thanh tra trật tự xây dựng (`staff`)
- **Secondary Roles**: Lãnh đạo (`executive`), Quản trị viên (`admin`)
- **Current Component**: `SiteDetailPage.jsx` (`app/src/apps/staff/pages/sites/SiteDetailPage.jsx`)
- **Layout**: `StaffLayout.jsx`
- **Primary Job**: Tra cứu toàn bộ hồ sơ pháp lý, thông tin nhà thầu, số liệu đo bụi và lịch sử các vụ việc vi phạm của một công trình cụ thể.
- **Success Condition**: Cán bộ nắm rõ lịch sử tuân thủ môi trường của công trình và có thể tạo lệnh kiểm tra hiện trường ngay tại màn hình.

---

## 2. WHY THIS SCREEN EXISTS
- Khi xảy ra sự cố bụi hoặc cần lập biên bản xử lý, cán bộ cần một nơi tra cứu tập trung toàn bộ dữ liệu: giấy phép xây dựng, thông tin liên hệ chỉ huy trưởng, dữ liệu trạm đo gắn tại công trình và các biên bản đã lập trước đó.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Click từ danh sách công trình (`/staff/sites`), click từ danh sách vụ việc hoặc từ bản đồ GIS.
- **Exit Points**:
  - Click nút "Tạo nhiệm vụ kiểm tra" $\rightarrow$ Mở Drawer tạo nhiệm vụ (`/staff/tasks`).
  - Click vào vụ việc liên quan $\rightarrow$ Chuyển đến Chi tiết vụ việc (`/staff/cases/:id`).
  - Nút quay lại $\rightarrow$ Về danh mục công trình (`/staff/sites`).
- **Navigation Item**: Breadcrumb hiển thị: `Công trình / [Tên công trình]`.

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem chi tiết hồ sơ công trình** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Cập nhật thông tin pháp lý/nhà thầu**| ❌ | ❌ | ✅ | ❌ | ✅ |
| **Giao nhiệm vụ kiểm tra tại chỗ** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Xóa / Lưu trữ hồ sơ công trình** | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Truy cập /staff/sites/:id 
→ Đọc thông tin tổng quan & điểm Dust Risk Score hiện tại
→ Chuyển qua các tab: "Tổng quan", "Trạm đo IoT", "Lịch sử vụ việc", "Biên bản đã lập"
→ Kiểm tra dữ liệu nồng độ bụi hoặc lịch sử phản ánh của người dân
→ Bấm nút "Tạo nhiệm vụ khảo sát" nếu phát hiện rủi ro cao
```

---

## 6. INFORMATION HIERARCHY
1. **Header Block**: Tên công trình, Mã định danh, Địa chỉ đầy đủ, Trạng thái hoạt động, Badge điểm Dust Risk Score.
2. **Action Bar**: Nút "Tạo nhiệm vụ kiểm tra", Nút "Chỉnh sửa thông tin", Nút "Quay lại".
3. **Tab Navigation**:
   - **Tab 1: Tổng quan**: Thông tin chủ đầu tư, nhà thầu chính, số giấy phép, liên hệ chỉ huy trưởng.
   - **Tab 2: Cảm biến & Đo đạc**: Danh sách trạm đo liên kết, biểu đồ nồng độ PM2.5/PM10 7 ngày qua.
   - **Tab 3: Vụ việc & Phản ánh**: Danh sách tất cả các vụ việc (cases) và phản ánh (complaints) gắn với công trình này.
   - **Tab 4: Văn bản & Biên bản**: Các quyết định xử lý, biên bản kiểm tra NĐ 30/2020 đã ban hành.

---

## 7. CONTENT CONTRACT
- **Page Title**: Tên công trình hiển thị đầy đủ, không truncate.
- **Section Headers**: `Thông tin pháp lý`, `Đơn vị thi công`, `Chỉ số môi trường`, `Lịch sử tác nghiệp`.
- **Primary CTA**: `Tạo nhiệm vụ kiểm tra` (≤ 4 từ).

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Tên công trình | Yes | `sites` table | `sites.name` | `—` |
| Địa chỉ & Tọa độ | Yes | `sites` table | `sites.address`, `sites.coordinates` | `—` |
| Tên chủ đầu tư & Nhà thầu | No | `sites` table | `sites.investorName`, `sites.contractorName` | `Chưa cập nhật` |
| Điện thoại chỉ huy trưởng | No | `sites` table | `sites.managerPhone` | `—` |
| Danh sách cảm biến | No | `sensors` table | `sensors WHERE siteId = ?` | `[]` |
| Danh sách vụ việc | No | `cases` table | `cases WHERE siteId = ?` | `[]` |

- **Current Implementation**: `GET /api/sites/:id` kèm quan hệ sensors và cases.
- **Safe Normalization**: Đảm bảo unwrap dữ liệu an toàn `site.sensors || []` và `site.cases || []`.

---

## 9. STATE MODEL
- **Loading**: Skeleton chi tiết công trình (Header + 4 Tabs).
- **Empty**: Tab không có dữ liệu (ví dụ chưa có vụ việc nào) hiển thị banner xanh: "Công trình chưa ghi nhận vụ việc ô nhiễm nào".
- **Error**: Hiển thị "Không tìm thấy công trình hoặc hồ sơ đã bị xóa" kèm nút quay lại danh sách.

---

## 10. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Tab bar dạng ngang, bố cục 2 cột (Cột trái: Thông tin pháp lý & Nhà thầu; Cột phải: Dữ liệu quan trắc & Lịch sử).
- **Mobile (360–430px)**: Tab bar dạng trượt ngang (scrollable tabs), toàn bộ thông tin xếp chồng 1 cột, nút "Tạo nhiệm vụ" ghim cố định ở đáy màn hình.

---

## 11. ACCEPTANCE CRITERIA
- [ ] Route `/staff/sites/:id` load dữ liệu chính xác theo ID công trình.
- [ ] Tab switching mượt mà, giữ nguyên trạng thái không reload toàn trang.
- [ ] Số điện thoại chỉ huy trưởng có link `tel:` bấm gọi nhanh trên di động.
- [ ] Hiển thị đầy đủ lịch sử các vụ việc đã từng xảy ra tại công trình.

---

## 12. IMPLEMENTATION STATUS
- **CURRENT**: Chi tiết thông tin công trình, hiển thị nhà thầu, tab chuyển đổi, danh sách vụ việc liên kết.
- **PARTIAL**: Biểu đồ trực quan hóa dữ liệu cảm biến theo thời gian thực trong tab Cảm biến.
- **PROPOSED**: Tích hợp ảnh chụp Flycam/CCTV công trường trực tiếp.
