# PUB-02 — Bản Đồ Rủi Ro Môi Trường (Citizen Map)

## 1. Screen identity
- Role: Public / Citizen
- Route: `/map`
- Component: `modules/citizen/CitizenMap.jsx`
- Layout: Public / Citizen Map Layout
- Navigation entry: Header Menu / Hero CTA
- Current implementation status: ACTIVE (Level 5 Production)

Purpose: Hiển thị trực quan bản đồ địa không gian WGS84 các công trình xây dựng, mức độ rủi ro phát tán bụi và mạng lưới cảm biến cộng đồng.

---

## 2. User goal
- Tra cứu vị trí công trình xây dựng gần nơi sinh sống/học tập.
- Kiểm tra mức độ rủi ro ô nhiễm bụi theo màu sắc (Xanh, Vàng, Cam, Đỏ).
- Bấm vào điểm nóng để xem chi tiết hoặc gửi phản ánh tại vị trí đó.

---

## 3. Entry points
- Menu "Bản đồ" trên Header.
- Nút "Khám phá bản đồ" từ Landing Page.
- Nút "Vị trí gần tôi" từ Citizen Home.

---

## 4. Exit / next actions
- Bấm vào Popup công trình $ightarrow$ Mở trang chi tiết công trình `/staff/sites/:id` hoặc form phản ánh `/citizen/report/new?siteId=...`
- Bấm nút quay lại $ightarrow$ `/` hoặc `/citizen`

---

## 5. Information hierarchy
1. Thanh công cụ tìm kiếm địa điểm & Bộ lọc mức độ rủi ro (4 cấp)
2. Không gian bản đồ tương tác toàn màn hình (Leaflet / OpenStreetMap)
3. Cụm điểm công trình (Markers / Heatmap clusters)
4. Thẻ tóm tắt thông tin công trình được chọn (Bottom / Sidebar Drawer)

---

## 6. Above-the-fold content
- **MUST SEE**: Bản đồ với các điểm marker màu chuẩn rủi ro, Thanh tìm kiếm địa chỉ.
- **SHOULD SEE**: Chú giải 4 cấp rủi ro (Thấp, Trung bình, Cao, Rất cao).
- **BELOW FOLD**: Bảng danh sách chi tiết các công trình lân cận.

---

## 7. Screen sections
### Section 1 — Map Canvas & Controls
- Purpose: Hiển thị bản đồ GIS và điều hướng không gian.
- Displays: Tiles bản đồ, Marker công trình, Vùng ảnh hưởng (Geofence radius).
- Data source: VERIFIED (D1 `/api/sites` + GeoJSON)
- Status: IMPLEMENTED

### Section 2 — Site Quick Card
- Purpose: Xem nhanh tên công trình, nhà thầu, chỉ số rủi ro $R$.
- User actions: Bấm "Gửi phản ánh tại đây" hoặc "Xem hồ sơ đầy đủ".
- Status: IMPLEMENTED

---

## 8. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|---:|---|---|
| Site Name & Code | Tên & Mã công trình | Có | D1 `sites` | REAL |
| Coordinates (Lat, Lng) | Tọa độ địa lý WGS84 | Có | D1 `sites` | REAL |
| Risk Score & Level | Điểm số & Mức rủi ro $R$ | Có | D1 `sites` | REAL |
| Contractor Name | Tên đơn vị thi công | Không | D1 `sites` | REAL |

---

## 9. User actions
| Action | Trigger | Result | Permission | Status |
|---|---|---|---|---|
| Tìm kiếm công trình | Nhập tên / quận huyện | Di chuyển tâm bản đồ tới vị trí | Public | WORKING |
| Lọc theo mức rủi ro | Bấm tab lọc rủi ro | Ẩn/hiện marker tương ứng | Public | WORKING |
| Tạo phản ánh theo vị trí | Bấm nút trong card | Chuyển sang `/citizen/report/new` kèm tọa độ | Public | WORKING |

---

## 10. Primary action
- Primary action: [Gửi phản ánh vị trí này]
- Secondary: [Xem chi tiết công trình], [Tìm kiếm khu vực]

---

## 11. Screen states
- Loading: Spinner bản đồ đang tải tiles & markers
- Empty: "Không tìm thấy công trình nào trong khu vực đã chọn"
- Error: Thông báo lỗi mạng kèm nút "Tải lại bản đồ"
- Success: Bản đồ tương tác mượt mà, hỗ trợ phóng to/thu nhỏ trên Mobile.

---

## 12. UI Copy
- Page title: Bản đồ rủi ro bụi công trình
- Description: Theo dõi trực quan 33 điểm thi công trọng điểm trên địa bàn.
- Button labels: [Tìm kiếm], [Lọc rủi ro], [Phản ánh ngay]
