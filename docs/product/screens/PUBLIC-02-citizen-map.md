# PUB-02 — Bản Đồ Điểm Nóng Bụi & Tra Cứu Địa Bàn

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/map`
- **Primary Role**: Người dân / Báo chí / Cán bộ khảo sát (`public` / `citizen` / `staff`)
- **Secondary Roles**: Toàn bộ người dùng
- **Current Component**: `CitizenMap.jsx` (`app/src/modules/citizen/CitizenMap.jsx`)
- **Layout**: Public / Fullscreen Map View
- **Primary Job**: Tra cứu trực quan vị trí các điểm nóng ô nhiễm bụi, công trình xây dựng và các trạm quan trắc xung quanh vị trí của mình.
- **Success Condition**: Người dùng tìm thấy khu vực mình quan tâm trên bản đồ trong 5 giây và xem được nồng độ bụi hoặc tình trạng công trình khi bấm vào marker.

---

## 2. WHY THIS SCREEN EXISTS
- Trực quan hóa không gian địa lý (GIS WGS84): giúp người dân biết được xung quanh nhà mình có những nguồn phát tán bụi nào, và giúp cơ quan quản lý nhìn thấy bức tranh tổng thể phân bổ các điểm nóng ô nhiễm trên toàn thành phố.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Menu "Bản đồ" trên thanh điều hướng, nút "Xem bản đồ" từ Landing Page (`/`).
- **Exit Points**:
  - Bấm vào một công trình $\rightarrow$ Mở Popup chi tiết hoặc chuyển sang `/staff/sites/:id`.
  - Bấm "Gửi phản ánh tại vị trí này" $\rightarrow$ Mở form gửi phản ánh `/citizen/report/new` với tọa độ điền sẵn.
- **Navigation Item**: Navigation Bar item "Bản đồ" (icon MapPin).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem bản đồ điểm nóng toàn đô thị** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Lọc theo quận / mức độ ô nhiễm** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Bấm định vị vị trí hiện tại** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Xem dữ liệu kỹ thuật trạm đo** | ❌ *(Chỉ số cơ bản)*| ✅ | ✅ *(Dữ liệu đầy đủ)*| ✅ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /map 
→ Bản đồ tự động định vị đến thành phố / vị trí người dùng
→ Xem các vòng tròn nhiệt (Heatmap) và icon công trình/trạm đo
→ Chọn bộ lọc: "Điểm nguy cơ cao" | "Trạm đo không khí" | "Công trình xây dựng"
→ Bấm vào 1 điểm trên bản đồ để xem thẻ thông tin (Tên công trình, Nồng độ bụi, Mức độ ưu tiên)
→ Bấm "Gửi phản ánh tại đây" nếu phát hiện công trường đang gây bụi
```

---

## 6. INFORMATION HIERARCHY
1. **Map Controls Overlay**: Ô tìm kiếm địa chỉ/tên đường, nút "Định vị vị trí của tôi" (GPS), nút phóng to/thu nhỏ.
2. **Filter Bar Floating Top**: Các chip chọn nhanh: `Tất cả` | `Trạm đo IoT` | `Công trường đang thi công` | `Điểm nóng cảnh báo`.
3. **Interactive Map Canvas**: Nền bản đồ giao thông sáng màu, các cụm điểm (Clusters) và icon đánh dấu trực quan.
4. **Selected Point Drawer / Modal**: Mở ra ở đáy màn hình khi nhấp vào một điểm, hiển thị Tên địa điểm, Địa chỉ, Chỉ số bụi PM2.5/PM10, và nút hành động.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Bản Đồ Điểm Nóng Bụi` (≤ 5 từ)
- **Point Popup Info**: `Tên công trình | Địa chỉ | Nồng độ đo được | Đánh giá sơ bộ`
- **Zero Jargon**: Sử dụng dải màu trực quan (Xanh: Tốt, Vàng: Trung bình, Đỏ: Cần lưu ý).

---

## 8. DATA CONTRACT
| UI Datum | Required? | Source Found | Current Field | Fallback |
|---|:---:|---|---|---|
| Danh sách tọa độ trạm | Yes | `sensors`, `sites` | `coordinates, latitude, longitude` | `[]` |
| Giá trị bụi tức thời | No | `sensor_readings` | `pm10, pm25` | `Đang cập nhật` |

- **Current Implementation**: `GET /api/sensors/locations`

---

## 9. DESKTOP & MOBILE BEHAVIOR
- **Desktop (1366×768)**: Khung bản đồ toàn màn hình, thanh danh sách địa điểm nằm ở cột trái có thể thu gọn.
- **Mobile (360–430px)**: Bản đồ tràn viền, hỗ trợ vuốt chạm 2 ngón tay, thẻ chi tiết địa điểm trượt từ đáy màn hình lên (Bottom Sheet).

---

## 10. ACCEPTANCE CRITERIA
- [ ] Bản đồ tải mượt mà không bị trắng trang hoặc giật khung hình.
- [ ] Bắt vị trí GPS người dùng chính xác khi được cấp quyền.
- [ ] Nhấp vào trạm đo hiển thị đúng số liệu nồng độ bụi từ D1.

---

## 11. IMPLEMENTATION STATUS
- **CURRENT**: Bản đồ tương tác, hiển thị vị trí công trình và trạm đo, định vị GPS, thẻ chi tiết địa điểm.
- **PARTIAL**: Lớp phủ nhiệt Heatmap nồng độ bụi theo thời gian thực.
- **PROPOSED**: Tích hợp lộ trình di chuyển tránh các tuyến đường nhiều bụi.
