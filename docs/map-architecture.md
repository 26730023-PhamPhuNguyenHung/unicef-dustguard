# DustGuard VN — Map Architecture & Spatial SSOT

## 1. Mục Đích & Vai Trò Của Bản Đồ (Product Intent)
DustGuard VN là nền tảng **Civic Tech** & **Hỗ Trợ Ra Quyết Định** lấy **Hồ sơ Vụ việc (Case SSOT)** và **Cộng đồng Thanh niên** làm trọng tâm.
Bản đồ không gian (Spatial Map) đóng vai trò hỗ trợ trực quan, không phải là một hệ thống GIS/Viễn thám chuyên sâu hay trung tâm thao tác độc lập:
1. **Trực quan hóa bối cảnh không gian ("Quanh tôi")**: Giúp người dân và thanh niên tình nguyện nhìn thấy các điểm nóng ô nhiễm và công trình xung quanh.
2. **Bộ chọn tọa độ thực địa (Location Picker)**: Cho phép chọn và xác thực tọa độ WGS84 chính xác khi gửi phản ánh vi phạm.
3. **Điều hướng 1-chạm (Google Maps External Handoff)**: Mở ngay ứng dụng Google Maps ngoài (`https://www.google.com/maps?q={lat},{lng}`) để tình nguyện viên và cán bộ di chuyển tới hiện trường.
4. **Vùng đệm bảo vệ trường học (UNICEF School Geofence 300m)**: Trực quan hóa bán kính nhạy cảm 300m quanh các trường học để ưu tiên xử lý.

---

## 2. Danh Mục Route Canonical
| Route | Component | Vai Trò |
|---|---|---|
| `/citizen/map` | `CitizenMap.jsx` | Bản đồ không gian công cộng cho Người dân & Cộng đồng thanh niên (`variant="workspace"`). |
| `/community/map` | `CitizenMap.jsx` | Cổng bản đồ cho Thanh niên hành động khí hậu (Sub-route của `/community`). |
| `/staff/map` | `StaffMap.jsx` | GIS Intelligence Hub giám sát cho Cán bộ thanh tra (`SpatialMapWorkspace`). |
| `/executive/heatmap` | `ExecutiveHeatmap.jsx` | Bản đồ nhiệt phân tích rủi ro theo Phường/Xã cho Lãnh đạo. |
| `/map` | `App.jsx` | Redirect 301 sang `/citizen/map`. |
| `/executive/map` | `App.jsx` | Redirect 301 sang `/executive/heatmap`. |

---

## 3. Thành Phần Cốt Lõi (Core Active Components)
Toàn bộ mã nguồn bản đồ chuẩn hóa nằm tại `app/src/components/map/`:
- `SpatialMap.jsx`: Component trung tâm hợp nhất 3 biến thể (`workspace`, `embedded`, `picker`).
- `SpatialMapCanvas.jsx`: Lõi Leaflet canvas render 6 lớp không gian (`sites`, `sensors`, `reports`, `hotspots`, `missions`, `wardPolygons`) tích hợp `MapResizeTrigger` chống giật/ô xám.
- `SpatialMapWorkspace.jsx`: Container điều hành GIS dành riêng cho cán bộ thanh tra.
- `GeoLocationPicker.jsx`: Bộ chọn tọa độ thực địa SSOT kết hợp Nominatim reverse geocoding.
- `SpatialEntityDrawer.jsx`: Drawer xem thông tin chi tiết thực thể kết hợp Spatial RBAC & PII Masking.
- `MapMarkerSemantics.js`: Factory tạo DivIcon theo bảng màu tương phản cao QCVN (Teal `#0D6F64`, Amber `#B45309`, Seal Red `#9F241F`).
- `MapToolbar.jsx`: Thanh công cụ tìm kiếm, tabs phân loại và nút định vị GPS.
- `MapLegend.jsx`: Bảng chú giải trực quan QCVN 05:2023/BTNMT.
- `MapStates.jsx`: Trực quan hóa các trạng thái Loading, Empty, Error.
- `mapCapabilities.js`: Spatial RBAC 6 vai trò người dùng.

---

## 4. Nguồn Dữ Liệu & Backend Persistence
- **SSOT Endpoint**: `GET /api/map` từ Cloudflare D1 persistent storage.
- **Zero-Mock & Zero-Fake-Coords**: 100% dữ liệu thực từ database D1 SQLite, tọa độ WGS84 EPSG:4326 được kiểm chứng qua `spatial.types.js`. Nếu thực thể chưa có GPS, giữ `lat: null, lng: null` thay vì sinh tọa độ giả.

---

## 5. Thư Viện Được Phép Sử Dụng
- `leaflet` (`^1.9.4`) & `react-leaflet` (`^5.0.0`): Lõi canvas hiển thị bản đồ tối thiểu.
- In-house Spatial Engine (`src/lib/spatial/spatial.types.js`): Tính toán khoảng cách Haversine và xác thực tọa độ WGS84 bằng JavaScript thuần.

---

## 6. Những Điều TUYỆT ĐỐI KHÔNG Còn Sử Dụng (Banned / Legacy)
1. ❌ **Không sử dụng `MapView.jsx` và `RiskLeafletMap.jsx`**: Các file legacy này đã được loại bỏ hoàn toàn.
2. ❌ **Không sử dụng `MapDynamicLegend.jsx`**: Đã hợp nhất vào `MapLegend.jsx`.
3. ❌ **Không sử dụng `useMapData()`**: Toàn bộ fetch bản đồ qua endpoint `GET /api/map` của `SpatialMap`.
4. ❌ **Không dùng biến toàn cục `selectedEntity`**: Trạng thái thực thể được quản lý tường minh qua `effectiveSelectedEntity` và handler `handleSelectEntity(entity)`.
5. ❌ **Không dùng Glassmorphism**: Giữ vững giao diện Civic Tech High-Contrast sáng màu (`#FDFBF7`, `#0D6F64`, `#9F241F`), touch target >= 44px.
