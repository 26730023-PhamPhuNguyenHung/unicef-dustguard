# MAP SSOT — DUSTGUARD SPATIAL INTELLIGENCE MAP

> **Định danh duy nhất**: **DustGuard Spatial Intelligence Map** (Hệ thống Bản đồ Không gian Trí tuệ Môi trường).
> **Phạm vi áp dụng**: Là Single Source of Truth (SSOT) toàn diện cho tất cả các bản đồ trên toàn bộ nền tảng DustGuard VN (Public, Citizen, Youth Community, Staff Inspector, Executive Command, Contractor).

---

## 🗺️ 1. Tầm Nhìn & Nguyên Tắc Cốt Lõi (Core Invariants)

1. **One Map SSOT (Bản Đồ Hợp Nhất Duy Nhất)**: Thay thế hoàn toàn các component bản đồ phân mảnh cũ (`MapView` legacy, `RiskLeafletMap` tách biệt) thành 1 Kiến trúc Hợp nhất duy nhất được chia sẻ (`SpatialMap`, `SpatialMapWorkspace`, `SpatialMapCanvas`).
2. **D1 Persistent Storage**: Toàn bộ điểm quan trắc, cảm biến, công trình, phản ánh và dữ liệu không gian đều xuất phát từ cơ sở dữ liệu Cloudflare D1 (`prisma/dev.db` trên local, `env.DB` trên Worker). Tuyệt đối **Zero-Mock** trong luồng nghiệp vụ cốt lõi.
3. **Zero Fake Coordinates (Không Tọa Độ Giả)**:
   - Nếu thực thể chưa có tọa độ GPS thực địa xác thực, hệ thống lưu và trả về `lat: null, lng: null`.
   - Tuyệt đối không sinh tọa độ giả lập (fake mock coordinates) hay đặt bừa vị trí ngẫu nhiên để tránh nguy cơ sai lệch pháp lý và gây nhiễu loạn điều hành thực địa.
4. **WGS84 Coordinates Standard (EPSG:4326)**: Chuẩn hóa toàn bộ tọa độ theo định dạng chuẩn quốc tế `[latitude, longitude]` với dải giới hạn hợp lệ:
   $$\begin{aligned} -90.0 &\le \text{latitude} \le 90.0 \\ -180.0 &\le \text{longitude} \le 180.0 \end{aligned}$$
5. **High-Contrast Civic UI (Thiết Kế Đô Thị Tương Phản Cao)**:
   - Tuyệt đối **KHÔNG Glassmorphism** (`backdrop-blur-*`).
   - Bảng màu tương phản cao: Nền sáng (`#FDFBF7` cream, `#FFFFFF`), Chữ đậm (`#231B14` ink-900), Nhấn chính (`#0D6F64` teal, `#9F241F` seal red).
   - Kích thước vùng bấm (Touch targets) tối thiểu **44px x 44px** trên cả thiết bị di động và máy tính để bàn.
   - Cơ chế co giãn chống xám ô bản đồ (`MapResizeTrigger`, `ResizeObserver`) bảo đảm tải 100% mượt mà trên mọi kích thước khung hình (360px - 4K).

---

## 🌐 2. Mô Hình Dữ Liệu Không Gian Hợp Nhất (6 Lớp Không Gian)

Mọi biến thể bản đồ đều sử dụng chung một Data Model thống nhất gồm 6 lớp dữ liệu không gian:

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      DUSTGUARD SPATIAL INTELLIGENCE ENGINE                       │
├──────────────────────────────────────────────────────────────────────────────────┤
│  [1] SENSOR LAYER           : Trạm IoT (PM2.5, PM10, AQI, Online/Offline, Drift) │
│  [2] SITES & EMISSION LAYER : Công trình, Nguồn thải, Điểm rủi ro bụi (0-100)    │
│  [3] CITIZEN OBSERVATION    : Ghi nhận thực địa, Ảnh SHA-256, Fuzzed GPS 100m    │
│  [4] EVENT & HOTSPOT LAYER  : Điểm nóng ô nhiễm (Dynamic Buffer 400m - 500m)     │
│  [5] SENSITIVE GEOFENCE     : Vùng đệm bảo vệ Trường học & Y tế (300m Buffer)    │
│  [6] ADMINISTRATIVE BOUNDS  : Đa giác ranh giới Phường/Xã/Quận (GeoJSON Polygons)│
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Chi Tiết Từng Lớp Dữ Liệu (Layer Specifications)

| Lớp Không Gian | Nguồn Dữ Liệu D1 | Thuộc Tính Cốt Lõi | Cơ Chế Hiển Thị & Ngữ Nghĩa Marker |
|---|---|---|---|
| **1. Sensor Layer (Trạm Cảm biến IoT)** | Bảng `sensors`, `sensor_readings` | `id`, `code`, `name`, `coordinates`, `pm25`, `pm10`, `status`, `timestamp` | Marker tròn hiển thị số PM2.5 thực tế, đèn tín hiệu xanh/xám (Online/Offline), hiệu ứng xung nhịp đỏ (pulse) khi PM2.5 vượt ngưỡng QCVN (≥ 75 µg/m³). |
| **2. Sites Layer (Công trình & Nguồn thải)** | Bảng `sites`, `actions`, `inspections` | `id`, `code`, `name`, `address`, `ward`, `coordinates`, `dustRiskScore`, `riskLevel`, `contractorName` | Marker hình vuông bo góc với biểu tượng công trình, màu sắc phản ánh rủi ro (Đỏ: ≥ 80đ, Cam: 60-79đ, Vàng: 40-59đ, Xanh: < 40đ). |
| **3. Citizen Observation (Ghi nhận Thực địa)** | Bảng `observations`, `observation_evidence`, `complaints` | `id`, `code`, `category`, `latitude`, `longitude`, `status`, `sha256`, `createdAt` | Marker tròn biểu tượng máy ảnh/loa, phân màu theo trạng thái xử lý (Xanh dương: Chờ tiếp nhận, Vàng cam: Đang xử lý, Xanh lá: Đã khắc phục). Vị trí công chúng được làm mờ ~100m để bảo vệ quyền riêng tư. |
| **4. Hotspots Layer (Điểm nóng Ô nhiễm)** | Tính toán động từ `sites` & `complaints` | `id`, `lat`, `lng`, `radius` (400-500m), `severity`, `score`, `reason` | Vòng tròn phát tán bán kính động (Circle Buffer) màu đỏ mờ (opacity 0.18), kích hoạt khi có ≥ 3 phản ánh trong 24h hoặc PM2.5 vượt chuẩn nghiêm trọng. |
| **5. Sensitive Geofence (Vùng đệm Trường học 300m)** | Tính toán từ `sites` lân cận cơ sở trường học / bệnh viện | `schoolName`, `distance`, `bufferMeters` (300m), `alertTier` | Vùng đệm 300m bảo vệ trẻ em theo sáng kiến Clean Air for Children của UNICEF: ≤ 200m từ công trình phát thải (Cảnh báo đỏ khẩn cấp), ≤ 300m (Cảnh báo vàng theo dõi). |
| **6. Administrative Bounds (Ranh giới Hành chính)** | Bảng `wards`, `provinces`, GeoJSON metadata | `code`, `name`, `coordinates` (Polygons), `riskDensity` | Đa giác ranh giới Phường/Xã/Quận, viền nét đứt màu lục `#0D6F64`, độ mờ nền thể hiện mật độ tích tụ rủi ro ô nhiễm vi khí hậu. |

---

## 🔒 3. Phân Tầng Hiển Thị & Ma Trận Phân Quyền Không Gian (Spatial RBAC Matrix)

Nhằm bảo đảm tính minh bạch công cộng nhưng vẫn bảo vệ nghiêm ngặt thông tin cá nhân (PII) và tài liệu nghiệp vụ thanh tra, DustGuard Spatial Intelligence Map áp dụng cơ chế phân tầng dữ liệu theo 6 vai trò người dùng:

```text
┌───────────────────────────────┬──────────┬──────────┬───────────┬──────────┬───────────┬─────────┐
│ Năng Lực & Dữ Liệu Không Gian │  PUBLIC  │ CITIZEN  │ COMMUNITY │  STAFF   │ EXECUTIVE │  ADMIN  │
├───────────────────────────────┼──────────┼──────────┼───────────┼──────────┼───────────┼─────────┤
│ Bản đồ tổng quan (Overview)   │    ✅    │    ✅    │    ✅     │    ✅    │    ✅     │   ✅    │
│ Số liệu trạm cảm biến công khai│   ✅    │    ✅    │    ✅     │    ✅    │    ✅     │   ✅    │
│ Tọa độ phản ánh công dân      │ Ẩn PII / │ Ẩn PII / │ Ẩn PII /  │ Đầy đủ   │  Đầy đủ   │ Đầy đủ  │
│                               │ Fuzz 100m│ Fuzz 100m│ Fuzz 100m │ Thực địa │ Thực địa  │ Thực địa│
│ Tên & SĐT người báo cáo (PII) │    ❌    │  Chính họ│    ❌     │    ✅    │    ✅     │   ✅    │
│ Ghi chú nội bộ thanh tra      │    ❌    │    ❌    │    ❌     │    ✅    │    ✅     │   ✅    │
│ Thông tin liên hệ chủ nhà thầu│    ❌    │    ❌    │    ❌     │    ✅    │    ✅     │   ✅    │
│ Chế độ chọn tọa độ (Picker)   │    ❌    │    ✅    │    ✅     │    ✅    │    ✅     │   ✅    │
│ Bản đồ nhiệm vụ (Missions)    │    ❌    │    ❌    │    ✅     │    ✅    │    ✅     │   ✅    │
│ Full Telemetry & Audit Logs   │    ❌    │    ❌    │    ❌     │    ✅    │    ✅     │   ✅    │
│ Phân tích rủi ro Quận/Huyện   │    ❌    │    ❌    │    ❌     │    ❌    │    ✅     │   ✅    │
│ Cấu hình trạm & ranh giới đa giác│ ❌    │    ❌    │    ❌     │    ❌    │    ❌     │   ✅    │
└───────────────────────────────┴──────────┴──────────┴───────────┴──────────┴───────────┴─────────┘
```

### Quy Định Bảo Mật Dữ Liệu & Quyền Riêng Tư (PII Scrubbing Policy)
- **Công dân & Khách công cộng**:
  - Tên người báo cáo tự động chuyển thành `"Công dân (ẩn danh)"`.
  - Số điện thoại được làm mờ định dạng `"098****456"`.
  - Tọa độ phản ánh được làm tròn đến 3 chữ số thập phân (độ lệch ~100m) để bảo vệ vị trí tư gia của người gửi phản ánh.
  - Các ghi chú chỉ đạo nội bộ (`triageNote`, `internalNotes`) bị loại bỏ hoàn toàn khỏi response API.
- **Cán bộ Thanh tra & Vận hành (Staff / Inspector / Operator)**:
  - Xem đầy đủ 100% PII người báo cáo để tiến hành liên hệ thẩm tra.
  - Xem lịch sử thanh tra, biên bản hiện trường và thông tin liên hệ nhà thầu (`managerPhone`, `managerEmail`).
  - Được quyền mở hồ sơ vi phạm (Open Case) và điều phối nhiệm vụ xử lý.
- **Lãnh đạo & Cơ quan Quản lý (Executive / Manager)**:
  - Xem bản đồ giám sát rủi ro toàn thành phố (Executive Risk Map).
  - Phân tích bức tranh toàn cảnh theo địa bàn Phường/Xã và ma trận SLA (24h/48h/72h).

---

## 🏛️ 4. Kiến Trúc Thành Phần Frontend (Frontend Architecture)

Toàn bộ hệ thống bản đồ được tổ chức trong thư mục `app/src/components/map/`:

```text
app/src/components/map/
  ├── SpatialMap.jsx             # Core Container Component (Hỗ trợ 3 variants: workspace, embedded, picker)
  ├── SpatialMapWorkspace.jsx    # Unified Public Spatial Intelligence Hub
  ├── SpatialMapCanvas.jsx       # Leaflet Rendering Canvas (Quản lý đa lớp, MapResizeTrigger, chống ô xám)
  ├── MapToolbar.jsx             # Thanh công cụ tìm kiếm, chuyển tab, lọc mức độ rủi ro, định vị GPS
  ├── SpatialEntityDrawer.jsx    # Khung trượt thông tin chi tiết (Tổng quan, Diễn biến, Bằng chứng)
  ├── MapMarkerSemantics.js      # Định nghĩa ngữ nghĩa trực quan cho Marker và bảng màu chuẩn
  ├── MapLegend.jsx              # Bảng chú giải trực quan (QCVN 05:2023/BTNMT)
  ├── MapTimePlayback.jsx        # Thanh tua dòng thời gian 24h mô phỏng phát tán bụi
  ├── MapStates.jsx              # Trạng thái LoadingState, EmptyState, ErrorState không dùng mock data
  └── mapCapabilities.js         # Bộ giải mã phân quyền bản đồ (Role Capability Resolver)
```

### 3 Biến Thể Cốt Lõi Của `SpatialMap`

1. **`variant="workspace"` (Mặc định - Trung Tâm Điều Hành Không Gian)**:
   - Tích hợp đầy đủ: `MapToolbar` + `SpatialMapCanvas` (70% diện tích) + `SpatialEntityDrawer` (30% diện tích) + `MapLegend` + `MapTimePlayback`.
   - Áp dụng cho trang bản đồ chính của Citizen, Youth Community và Staff GIS Map.
2. **`variant="embedded"` (Bản Đồ Nhúng Thu Gọn)**:
   - Dành cho Dashboard điều hành (Executive Dashboard, Contractor Portal) và các trang chi tiết công trình.
   - Tối ưu chiều cao cố định (ví dụ `height={420}`), tự động bắt sự kiện click đối tượng và hiển thị popup tóm tắt.
3. **`variant="picker"` (Bộ Chọn Tọa Độ Hiện Trường)**:
   - Dành riêng cho màn hình nộp phản ánh hiện trường của Công dân và Thanh niên (`/citizen/report/new`, `/community/observations/new`).
   - Tích hợp Marker chọn tọa độ tương tác, nút định vị GPS *"Quanh tôi"* và hiển thị tọa độ WGS84 thời gian thực.

---

## 🧮 5. Thuật Toán & Quy Tắc Không Gian (Spatial Algorithms & Invariants)

### 1. Công Thức Haversine Tính Khoảng Cách Địa Lý (Great-Circle Distance)
Sử dụng công thức Haversine để tính toán chính xác khoảng cách giữa hai điểm tọa độ $(\text{lat}_1, \text{lng}_1)$ và $(\text{lat}_2, \text{lng}_2)$ theo mét:

$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$d = 2R \cdot \operatorname{atan2}\left(\sqrt{a}, \sqrt{1-a}\right) \quad (R = 6,371,000 \text{ m})$$

### 2. Vùng Đệm Geofence 50m Nghiệm Thu Thực Địa (Contractor & Inspector Check-in)
- Khi nhà thầu gửi báo cáo khắc phục hoặc cán bộ thanh tra kiểm tra hiện trường, tọa độ GPS của thiết bị phải nằm trong bán kính **50m** của công trình:
  $$\text{Distance}(\text{GPS}_{\text{device}}, \text{GPS}_{\text{site}}) \le 50\text{m} \implies \text{VALID\_50M\_BUFFER}$$
- Nếu vượt quá 50m, hệ thống ghi nhận trạng thái cảnh báo `OUT_OF_BOUNDS` để đối chứng minh bạch.

### 3. Vùng Đệm Geofence 300m Bảo Vệ Trường Học & Cơ Sở Y Tế
- Tự động quét và cảnh báo khoảng cách giữa các nguồn phát thải bụi và các điểm nhạy cảm trẻ em:
  - $d \le 200\text{m}$: Cảnh báo khẩn cấp Mức Đỏ (Trường học liền kề nguồn phát thải).
  - $200\text{m} < d \le 300\text{m}$: Cảnh báo giám sát Mức Vàng (Khu vực có nguy cơ ảnh hưởng).

### 4. Thuật Toán Gom Cụm Điểm Nóng Ô Nhiễm (Hotspot Dynamic Aggregation)
- Điểm nóng ô nhiễm được hình thành tự động khi một công trình hoặc khu vực thỏa mãn:
  $$\text{dustRiskScore} \ge 70 \quad \text{HOẶC} \quad \text{Complaints}_{24\text{h}} \ge 3$$
- Bán kính ảnh hưởng được tính động:
  $$\text{Radius} = 400\text{m} + (\text{Index} \times 50\text{m})$$

---

## 📡 6. Giao Thức API & Cơ Sở Dữ Liệu D1 (Backend Spatial Contract)

### API Endpoints Chuẩn Hóa
- `GET /api/map` (Aliases: `/api/spatial/features`, `/api/public/map/features`):
  - **Input**: Query params tùy chọn (`ward`, `severity`, `mode`).
  - **Output Response SSOT**:
    ```json
    {
      "status": "success",
      "data": {
        "sites": [
          {
            "id": "site_01",
            "code": "BD-HN-001",
            "name": "Công trình Xây dựng Cầu Giấy",
            "address": "12 Phạm Hùng, Cầu Giấy, Hà Nội",
            "ward": "Cầu Giấy",
            "lat": 21.0285,
            "lng": 105.7825,
            "dustRiskScore": 82,
            "riskLevel": "HIGH",
            "tier": "red",
            "status": "INSPECTING",
            "complaintsCount": 4
          }
        ],
        "sensors": [
          {
            "id": "sens_01",
            "code": "DG-HN-012",
            "name": "Trạm quan trắc Cầu Giấy",
            "lat": 21.0335,
            "lng": 105.7860,
            "pm25": 78,
            "status": "ONLINE",
            "trend": "UP"
          }
        ],
        "reports": [
          {
            "id": "rep_01",
            "code": "DG-PA-1001",
            "title": "Bụi phát tán từ xe chở phế thải",
            "address": "Đường Vành Đai 3, Cầu Giấy",
            "lat": 21.029,
            "lng": 105.784,
            "status": "IN_PROGRESS",
            "category": "CONSTRUCTION_DUST"
          }
        ],
        "hotspots": [
          {
            "id": "HOTSPOT-1",
            "name": "Điểm nóng Cầu Giấy #1",
            "lat": 21.0285,
            "lng": 105.7825,
            "radius": 450,
            "severity": "CRITICAL",
            "score": 82,
            "reason": "4 phản ánh trong 24h · PM2.5 vượt ngưỡng QCVN"
          }
        ],
        "missions": [
          {
            "id": "MISSION-01",
            "title": "Giám sát bụi quanh trường THPT Cầu Giấy",
            "ward": "Cầu Giấy",
            "lat": 21.0335,
            "lng": 105.7915,
            "requiredVolunteers": 6,
            "currentVolunteers": 4,
            "status": "ACTIVE",
            "organizer": "Đoàn TN ĐHQGHN"
          }
        ],
        "summary": {
          "highRiskCount": 3,
          "warningCount": 2,
          "activeSensorsCount": 4,
          "recentReportsCount": 8,
          "resolvedCount": 3
        }
      }
    }
    ```
- `POST /api/map/demo/reset`: Xóa cache bộ nhớ đệm `map:*` để đồng bộ dữ liệu mới nhất.
- `GET /admin/admin-boundary-metadata.json`: Trả về danh mục lớp ranh giới hành chính các cấp.

### Tối Ưu Hóa Truy Vấn Spatial Index Trong D1 SQLite (`0007_spatial_and_executive_indexes.sql`)
```sql
CREATE INDEX IF NOT EXISTS "idx_sites_spatial" ON "sites"("ward", "status", "coordinates");
CREATE INDEX IF NOT EXISTS "idx_sites_coordinates" ON "sites"("coordinates");
CREATE INDEX IF NOT EXISTS "idx_sensors_spatial" ON "sensors"("siteId", "status");
CREATE INDEX IF NOT EXISTS "idx_complaints_spatial" ON "complaints"("ward", "status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_observations_spatial" ON "observations"("latitude", "longitude");
CREATE INDEX IF NOT EXISTS "idx_observations_ward_status" ON "observations"("ward", "status", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_follow_ups_spatial" ON "follow_ups"("observation_id", "verified_at" DESC);
```

---

## 🎨 7. Tiêu Chuẩn Thiết Kế Giao Diện Không Gian (Civic Map UI Tokens)

1. **Bộ Màu Ngữ Nghĩa Marker (Marker Semantics Palette)**:
   - **Báo Động Đỏ (Critical / High Risk)**: `#9F241F` (Seal Red) — Áp dụng cho nguồn phát thải ≥ 80đ hoặc PM2.5 ≥ 75 µg/m³.
   - **Cảnh Báo Vàng (Warning / Medium Risk)**: `#B45309` (Amber) — Áp dụng cho nguồn phát thải 45-79đ hoặc PM2.5 45-74 µg/m³.
   - **Bình Thường / Đạt Chuẩn (Normal / Low Risk)**: `#0D6F64` (Teal) — Áp dụng cho nguồn phát thải < 45đ hoặc PM2.5 < 45 µg/m³.
   - **Trạng Thái Đã Khắc Phục (Resolved)**: `#059669` (Green) — Phản ánh đã hoàn tất chu kỳ đối chứng Before/After.
   - **Nhiệm Vụ Thanh Niên (Youth Mission)**: `#7C3AED` (Purple) — Hoạt động giám sát cộng đồng.
   - **Mất Kết Nối (Offline)**: `#6B7280` (Gray) — Trạm quan trắc mất tín hiệu.

2. **Quy Chuẩn Chữ Trên Nút & Tab (Max 3 Words Rule)**:
   - Tabs chế độ bản đồ: `Tình hình` (`overview`), `Cảm biến` (`sensors`), `Phản ánh` (`reports`), `Hoạt động` (`activities`).
   - Nút hành động: `Gửi phản ánh`, `Xem hồ sơ`, `Quanh tôi`, `Mở hồ sơ`, `Phát lại`, `Tạm dừng`.
   - Tabs khung thông tin: `Tổng quan`, `Diễn biến`, `Bằng chứng`.

---

## ✅ 8. Tiêu Chuẩn Nghiệm Thu & Kiểm Thử (Definition of Done)

Trước khi nghiệm thu bất kỳ tính năng bản đồ nào, hệ thống phải thỏa mãn 100% các tiêu chí sau:

- [x] **One Map SSOT**: Mọi module (`CitizenMap`, `StaffMap`, `ExecutiveRiskMap`) đều sử dụng `SpatialMap` / `SpatialMapWorkspace` / `SpatialMapCanvas`.
- [x] **WGS84 Coordinates**: Tọa độ chuẩn `[lat, lng]` hợp lệ, không sinh tọa độ giả khi thiếu dữ liệu thực tế.
- [x] **6 Lớp Không Gian**: Hiển thị chính xác Sensors, Sites, Observations, Hotspots, Geofence trường học 300m và Ranh giới Phường/Xã.
- [x] **Spatial RBAC**: Khách và Công dân được ẩn PII và làm mờ tọa độ ~100m; Cán bộ Thanh tra và Lãnh đạo xem toàn diện Full Telemetry & Audit.
- [x] **Zero-Mock Verification**: Dữ liệu lấy từ API Cloudflare D1 thật; hiển thị `MapLoadingState`, `MapEmptyState`, `MapErrorState` đúng ngữ cảnh.
- [x] **High-Contrast UI**: Đạt chuẩn tương phản Civic Tech, không glassmorphism, touch target ≥ 44px, hiển thị hoàn hảo từ 360px đến màn hình máy tính.
- [x] **Automated Test Gate**: Chạy pass 100% test suite `app/tests/spatial-intelligence-map.test.js`, `app/tests/worker-spatial-rbac-sanitizer.test.js`, và `app/tests/spatial-location-ssot.test.js`.

---

## 📍 9. Location SSOT, Geocoding & GeoLocationPicker

1. **Location SSOT Model (`src/lib/spatial/spatial.types.js`)**:
   - `isValidWGS84(lat, lng)`: Xác thực nghiêm ngặt tọa độ WGS84, loại bỏ điểm Null Island `(0, 0)`.
   - `classifyGpsAccuracy(accuracyMeters)`: Phân loại độ chính xác GPS thiết bị theo 4 cấp (`GOOD` $\le 20\text{m}$, `MODERATE` $20-100\text{m}$, `LOW` $> 100\text{m}$, `UNKNOWN`).
   - `calculateHaversineDistanceMeters(lat1, lng1, lat2, lng2)`: Tính khoảng cách cung tròn chính xác theo công thức Haversine.
   - `createLocationSSOT(...)`: Chuẩn hóa thực thể vị trí với nguồn gốc (`DEVICE_GPS`, `MAP_PIN`, `ADDRESS_GEOCODE`, `ADMIN_CORRECTION`), mức độ xác thực và thời gian cập nhật.

2. **Geocoding & Reverse Geocoding Service (`src/lib/spatial/geocoding.service.js`)**:
   - Tích hợp OpenStreetMap Nominatim API với tốc độ giới hạn an toàn ($\ge 1000\text{ms}$ interval) tuân thủ OSM Usage Policy.
   - Bộ nhớ đệm LRU Cache trong bộ nhớ (100 mục gần nhất) cho cả tra cứu thuận và nghịch.
   - Danh mục địa danh danh thắng & phường xã Hà Nội (`LOCAL_LANDMARKS`) hỗ trợ gợi ý tức thì và hoạt động dự phòng khi mạng ngoại tuyến.

3. **Bộ Chọn Vị Trí Đa Năng (`src/components/map/GeoLocationPicker.jsx`)**:
   - Hỗ trợ 3 phương thức xác định vị trí:
     - **(A) Gõ địa chỉ / Autocomplete**: Tìm kiếm tức thì từ danh mục địa danh hoặc OSM.
     - **(B) Ghim & Kéo marker trên bản đồ**: Kéo thả marker trên nền bản đồ trực quan, tự động kích hoạt reverse geocoding.
     - **(C) Lấy vị trí GPS thiết bị**: Trực tiếp từ `navigator.geolocation` với cảnh báo chi tiết, thân thiện khi bị từ chối cấp quyền.
   - Cảnh báo rõ ràng khi địa điểm chưa có tọa độ, không tự ý gán vị trí giả lập.
