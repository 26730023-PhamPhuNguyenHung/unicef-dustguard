# CIT-03 — Danh Sách Phản Ánh Môi Trường & Theo Dõi Tiến Độ Thực Địa (Citizen Reports List)

## 1. Screen Identity (Định Danh Màn Hình)
- **Mã màn hình**: `CIT-03`
- **Tên màn hình (Tiếng Việt)**: Danh Sách Phản Ánh Môi Trường & Theo Dõi Tiến Độ Thực Địa
- **Tên màn hình (Tiếng Anh)**: Citizen Environmental Reports Tracking List
- **Tuyến đường (Route URL)**: `/citizen/reports`
  - *Tuyến đường tương thích & chuyển hướng*: `/citizen/track`, `/citizen/missions`
- **Đường dẫn Component**: [`app/src/apps/citizen/pages/reports/ReportsListPage.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/citizen/pages/reports/ReportsListPage.jsx)
- **Khung giao diện (Layout)**: [`app/src/apps/citizen/layout/CitizenLayout.jsx`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/app/src/apps/citizen/layout/CitizenLayout.jsx)
  - *Desktop*: Top Header cố định gồm Logo DustGuard, Huy hiệu vai trò `CỘNG ĐỒNG`, Navigation Tabs và Menu Tài khoản.
  - *Mobile (Viewport < 640px)*: Bottom Navigation Bar cố định đáy màn hình với 4 nút chạm kích thước lớn $\ge 44\text{px}$ (`Trang chủ`, `Phản ánh [Active]`, `Bản đồ`, `Hồ sơ`).
- **Phân quyền người dùng (Role / RBAC)**: `citizen`, `youth`, `community`, `public` (Công dân đã đăng nhập hoặc người dùng vãng lai tra cứu theo phiên).
- **Trạng thái triển khai**: `ACTIVE` (Production Level 5 — Kết nối trực tiếp Cloudflare D1 SQLite, cơ chế API unwrap chống sập trang, hỗ trợ lọc đa trạng thái và tối ưu hóa trải nghiệm thực địa).

---

## 2. Mục Đích & Giá Trị Thực Tế

1. **Xóa bỏ tình trạng "đơn từ rơi vào im lặng" (No Black Box)**:
   - Cung cấp cho công dân và sinh viên tình nguyện một trung tâm theo dõi minh bạch thời gian thực về toàn bộ các phản ánh môi trường đô thị (bụi đất công trình, xe tải không che bạt, bùn đất vương vãi, trạm rửa xe không hoạt động).
   - Mỗi hồ sơ được cấp một **Mã định danh tra cứu duy nhất** (Ví dụ: `DG-2026-F54A`, `DG-2026-E88B`) có thể đối soát chéo với các cổng thông tin công ích đô thị (Tổng đài 1022, Ứng dụng Công dân Thủ đô số iHanoi).

2. **Giám sát cam kết trách nhiệm thời hạn xử lý (SLA 48h)**:
   - Thể hiện rõ ràng mốc thời gian cam kết tiếp nhận và chỉ đạo khắc phục trong vòng 48 giờ làm việc từ chính quyền địa phương (UBND Phường/Xã, Đội Thanh tra Giao thông - Đô thị) và Chỉ huy trưởng ban điều hành dự án.

3. **Cơ sở dữ liệu tích lũy Tín chỉ Tình nguyện Đoàn - Hội**:
   - Mỗi phản ánh hiện trường được thẩm tra xác thực và có kết quả khắc phục (`RESOLVED`) là căn cứ dữ liệu gốc để tự động tính thưởng **+2.5 giờ tình nguyện thực địa** và **+10 Điểm rèn luyện (ĐRL)** cho Đoàn viên - Sinh viên thuộc mạng lưới các trường Đại học (ĐHQG Hà Nội, ĐH Bách Khoa, ĐH Xây dựng, ĐH Kinh tế Quốc dân...).

4. **Trải nghiệm thực tế một chạm (High Friction Reduction)**:
   - Giúp người dân thao tác nhanh chóng ngoài đường phố nắng gió: chuyển tab tức thì dưới 10ms, mở trực tiếp hồ sơ đối chứng ảnh Trước / Sau hoặc tạo phản ánh mới chỉ bằng một nút bấm lớn màu đỏ son.

---

## 3. Đối Tượng Người Dùng & Hành Trình Thao Tác (User Journey & Core Flow)

### 3.1. Đối tượng người dùng chính
- **Người dân sinh sống cạnh công trình xây dựng**: Cần theo dõi xem kiến nghị về xe chở vật liệu làm vương vãi bùn đất đã được phường kiểm tra và nhà thầu quét dọn chưa.
- **Đoàn viên, Sinh viên Tình nguyện (Youth Volunteers & CLB Môi trường)**: Kiểm tra trạng thái các phản ánh mà Đội/CLB của mình đã ghi nhận trong đợt ra quân khảo sát cuối tuần để tích lũy đủ mốc 20 giờ nhận Giấy chứng nhận điện tử.
- **Cán bộ Tổ dân phố & Ban Công tác Mặt trận**: Nắm bắt nhanh các điểm nóng ô nhiễm không khí trên địa bàn phường để phối hợp đôn đốc các chủ đầu tư.

### 3.2. Sơ đồ luồng thao tác cốt lõi (Core User Flow)

```mermaid
flowchart TD
    A[Mở Cổng Công Dân /citizen] --> B[Bấm Tab 'Phản Ánh' hoặc Nút 'Theo dõi tiến độ' từ CIT-01]
    B --> C[Truy cập màn hình CIT-03: /citizen/reports]
    C --> D[Gọi GET /api/complaints]
    D --> E{API trả về kết quả?}
    E -->|Đang tải| F[Hiển thị LoadingState xương mờ Skeleton]
    E -->|Lỗi kết nối| G[Hiển thị ErrorState + Nút 'Thử lại']
    E -->|Thành công| H[Unwrap normalizeList trả về Array an toàn]
    H --> I{Số lượng bản ghi?}
    I -->|Mảng rỗng []| J[Hiển thị EmptyState 'Chưa có phản ánh nào' + Nút 'Gửi phản ánh ngay']
    I -->|Có dữ liệu| K[Render danh sách Thẻ Phản Ánh trực quan]
    K --> L[Chọn Tab Chip Lọc: Tất cả | Mới gửi | Đang xử lý | Đã khắc phục]
    L --> M[Lọc Client-side mượt mà < 10ms]
    M --> N{Thao tác tiếp theo}
    N -->|Bấm vào Thẻ Phản Ánh| O[Điều hướng sang CIT-04: /citizen/reports/:id]
    N -->|Bấm '+ Gửi phản ánh mới'| P[Điều hướng sang CIT-02: /citizen/report/new]
```

---

## 4. Bố Cục Giao Diện & Phân Cấp Thông Tin (Information Hierarchy & Wireframe)

### 4.1. Phân cấp thị giác (Visual Hierarchy)
1. **Header Thẻ Tiêu Đề (Title Banner Card)**:
   - Tiêu đề H1: `Theo Dõi Phản Ánh Môi Trường` (Font chữ đen mực `#1C1917`, in đậm sắc nét).
   - Mô tả phụ: `Xem tiến độ xử lý và kết quả khắc phục của đơn vị thi công.`
   - Nút hành động chính (Primary CTA): `[+ Gửi phản ánh mới]` (Màu đỏ son ấn triện `#B91C1C`, hover `#991B1B`, chiều cao chuẩn $\ge 44\text{px}$).
2. **Thanh Phân Loại Trạng Thái Dạng Chip (Status Filter Chips)**:
   - Dãy 4 nút chip cuộn ngang linh hoạt:
     - `Tất cả` (`ALL`): Hiển thị toàn bộ hồ sơ ghi nhận.
     - `Mới gửi` (`PENDING`): Gồm các trạng thái `PENDING`, `SUBMITTED`, `RECORDED`.
     - `Đang xử lý` (`IN_PROGRESS`): Gồm `PROCESSING`, `INVESTIGATING`, `VERIFIED`, `ON_SITE`, `APPRAISING`.
     - `Đã khắc phục` (`RESOLVED`): Gồm `RESOLVED`, `CLOSED`, `COMPLETED`, `SANCTION_ISSUED`.
   - Nút được chọn nổi bật trên nền đỏ son `#B91C1C`, chữ trắng tương phản tuyệt đối.
3. **Danh Sách Thẻ Phản Ánh Thực Địa (Reports Feed)**:
   - Mỗi thẻ card gồm:
     - Dòng 1: Mã tra cứu hồ sơ định dạng monospace (`DG-2026-XXXX`) + Huy hiệu trạng thái màu sắc (`StatusBadge`) + Thời gian gửi chuẩn Việt Nam (`dd/mm/yyyy`).
     - Dòng 2: Nội dung tóm tắt vi phạm/phát hiện (font đậm 14px, không cắt cụt làm mất nghĩa).
     - Dòng 3: Biểu tượng ghim định vị GPS + Địa chỉ cụ thể và Tên Phường/Quận.
     - Nút xem chi tiết: `Xem tiến độ →` căn phải nổi bật.
4. **Khối Trạng Thái Rỗng Thân Thiện (Empty State)**:
   - Biểu tượng thư mục mở, thông điệp hướng dẫn rõ ràng và nút bấm kêu gọi `[Gửi phản ánh ngay]` kích thích người dùng hành động.

### 4.2. Khung dây giao diện trực quan (ASCII Wireframe)

```text
+----------------------------------------------------------------------------------------------------+
| [Logo DustGuard VN]  [CỘNG ĐỒNG]              Trang chủ   [Phản ánh (*)]   Bản đồ   Tài khoản      |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  | THEO DÕI PHẢN ÁNH MÔI TRƯỜNG                                         [ + Gửi phản ánh mới ]  |  |
|  | Xem tiến độ xử lý và kết quả khắc phục của đơn vị thi công.                                   |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
|  [ Tất cả (4) ]   [ Mới gửi (1) ]   [ Đang xử lý (1) ]   [ Đã khắc phục (2) ]                     |
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  | DG-2026-F54A   [ ĐÃ KHẮC PHỤC (Xanh ngọc) ]   • 25/07/2026                                   |  |
|  | Phát hiện xe tải chở đất đá rơi vãi gây ô nhiễm bụi nghiêm trọng tại ô đất E9 Phường Yên Hòa  |  |
|  | 📍 Số 18 Phạm Hùng, Phường Yên Hòa, Cầu Giấy                                  Xem tiến độ →  |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  | DG-2026-E88B   [ ĐÃ KHẮC PHỤC (Xanh ngọc) ]   • 27/07/2026                                   |  |
|  | Công trường thi công không bật phun sương dập bụi bãi vật liệu vào giờ cao điểm             |  |
|  | 📍 Đường Nguyễn Văn Lộc, Phường Mộ Lao, Hà Đông                               Xem tiến độ →  |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  | DG-2026-M102   [ ĐANG XỬ LÝ (Vàng cam) ]      • 29/07/2026                                   |  |
|  | Khói bụi phát sinh từ hoạt động cắt mài bê tông lộ thiên không che chắn                       |  |
|  | 📍 Phường Láng Hạ, Đống Đa, Hà Nội                                           Xem tiến độ →  |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
|  +----------------------------------------------------------------------------------------------+  |
|  | DG-2026-K419   [ MỚI GỬI (Xám trung tính) ]   • 02/09/2026                                   |  |
|  | Xe bồn trộn bê tông xả nước rửa chứa bùn xi măng ra cống thoát nước đường gom               |  |
|  | 📍 Đường Trần Thái Tông, Phường Dịch Vọng Hậu, Cầu Giấy                      Xem tiến độ →  |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                                                                    |
+----------------------------------------------------------------------------------------------------+
| [Mobile Bottom Nav (≤ 640px)]:   (🏠 Trang chủ)   (📋 Phản ánh [*])   (🗺️ Bản đồ)   (👤 Hồ sơ)     |
+----------------------------------------------------------------------------------------------------+
```

---

## 5. Dữ Liệu & API / D1 Database Contract

### 5.1. Bảng CSDL D1 SQLite liên quan (Schema SSOT)
- **Bảng `complaints`**:
  ```sql
  CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    site_id TEXT,
    ward TEXT NOT NULL,
    address TEXT NOT NULL,
    description TEXT NOT NULL,
    reporter_name TEXT,
    reporter_phone TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
  CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at DESC);
  ```
- **Bảng `evidences`**: Lưu ảnh hiện trường gốc do công dân tải lên và ảnh đối chứng do nhà thầu nộp kèm mã băm SHA-256.

### 5.2. API Contract chi tiết
- **Endpoint**: `GET /api/complaints` (Hỗ trợ alias fallback `GET /complaints`)
- **Headers**:
  ```http
  Accept: application/json
  Authorization: Bearer <session_token> (Tùy chọn cho công dân đã đăng nhập)
  ```
- **Query Parameters**:
  - `limit`: Số bản ghi tối đa (mặc định 50).
  - `offset`: Phân trang.
  - `status`: Lọc theo trạng thái nghiệp vụ.
- **Cấu trúc JSON phản hồi thành công (HTTP 200)**:
  ```json
  {
    "status": "success",
    "data": {
      "items": [
        {
          "id": "cmp_88f91a2b3c4d",
          "code": "DG-2026-F54A",
          "ward": "Phường Yên Hòa",
          "address": "Số 18 Phạm Hùng, Phường Yên Hòa",
          "description": "Phát hiện xe tải chở đất đá rơi vãi gây ô nhiễm bụi nghiêm trọng tại ô đất E9",
          "status": "RESOLVED",
          "reporterName": null,
          "reporterPhone": null,
          "createdAt": "2026-07-25T08:30:00.000Z",
          "updatedAt": "2026-07-26T10:00:00.000Z",
          "evidences": [
            {
              "id": "evi_before_01",
              "url": "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3",
              "type": "BEFORE",
              "sha256": "8a9c012f45bd67e89012345678abcdef0123456789abcdef0123456789abcdef"
            }
          ]
        }
      ],
      "pagination": {
        "limit": 50,
        "offset": 0,
        "total": 1
      }
    }
  }
  ```
- **Chuẩn hóa Client Layer (Data Normalization Invariant)**:
  - Bắt buộc dùng `normalizeList(res)` từ `app/src/lib/api/request.js`.
  - Không bao giờ giả định response luôn là array. Bóc tách `{ data: { items } }`, `{ data: [] }` hoặc `[]` để luôn trả về Array an toàn `[]`, loại trừ 100% rủi ro `TypeError: reports.filter is not a function`.

---

## 6. Bảng Nút Bấm & Hành Động Cốt Lõi (CTAs & Interactions)

| Tên Nút / Thành Phần UI | Vị Trí / Bố Cục | Hành Vi Tương Tác & Phản Hồi | Quyền Hạn | Điều Hướng / Thay Đổi State |
|---|---|---|---|---|
| **[+ Gửi phản ánh mới]** | Góc phải Thẻ Header | Hover chuyển `#991B1B`, active nén nhẹ 98%, touch target $44\text{px}$ | Public / Citizen / Youth | Điều hướng ngay sang `CIT-02` (`/citizen/report/new`) |
| **Tab Bộ Lọc Trạng Thái** | Dãy chip đầu trang | Bấm đổi màu nền sang đỏ son `#B91C1C`, chữ trắng, shadow nhẹ | Tất cả | Cập nhật `filter` state, lọc danh sách tức thì (< 10ms) |
| **Thẻ Bản Ghi Phản Ánh** | Thân danh sách Feed | Hover viền đổi đỏ nhạt `#FECACA`, con trỏ chuột `pointer` | Tất cả | Bấm vào bất kỳ đâu trên thẻ chuyển sang `CIT-04` (`/citizen/reports/:id`) |
| **[Xem tiến độ →]** | Góc phải mỗi thẻ | Chữ xám đậm, hover gạch chân, biểu tượng mũi tên dịch chuyển nhẹ | Tất cả | Mở chi tiết đối chứng tiến độ của hồ sơ tương ứng |
| **[Gửi phản ánh ngay]** | Khối EmptyState | Nền đỏ son, bo góc 12px, chiều cao $\ge 44\text{px}$ | Tất cả | Điều hướng sang `CIT-02` khi chưa có dữ liệu |
| **[Thử lại]** | Khối ErrorState | Nền trắng, viền `#E7E5E4`, hover `#F5F5F4` | Tất cả | Kích hoạt lại hàm `loadReports()` gọi lại API |
| **Bottom Navigation Bar** | Cố định đáy Mobile | Active icon chuyển sang đỏ son `#B91C1C` kèm nhãn nổi bật | Public / Citizen | Chuyển đổi giữa 4 phân hệ chính trên di động |

---

## 7. Quy Chuẩn UI/UX, In Ấn & Responsive (Design System Tokens)

### 7.1. Bảng màu & Tương phản Civic Tech (High-Contrast Rules)
- **Nền trang**: Màu kem sáng nhạt `#FDFBF7` (Dịu mắt, chống lóa khi sử dụng ngoài trời).
- **Nền thẻ card**: Màu trắng tinh `#FFFFFF`, viền mảnh `#E7E5E4` (Stone-200), bo tròn góc `rounded-2xl` hoặc `rounded-3xl`.
- **Chữ chính**: Màu mực đậm `#1C1917` (Độ tương phản $\ge 7:1$ so với nền trắng).
- **Chữ phụ & Mã tra cứu**: `#57534E` / `#78716C` (Độ tương phản $\ge 4.5:1$ theo chuẩn WCAG AA).
- **Màu hành động khẩn cấp (Primary CTA)**: Đỏ son ấn triện `#B91C1C` (Hover `#991B1B`, Active `#7F1D1D`).
- **Màu xanh ngọc thành công (Resolved)**: Xanh ngọc `#065F46` trên nền xanh nhạt `#ECFDF5` có viền `#A7F3D0`.
- **Màu vàng hổ phách xử lý (In Progress)**: Vàng hổ phách `#92400E` trên nền vàng nhạt `#FEF3C7`.
- **Tuyệt đối cấm**:
  - Không sử dụng hiệu ứng kính mờ `backdrop-blur-*` (Glassmorphism).
  - Không dùng chữ xám nhạt trên nền trắng gây mỏi mắt cho người cao tuổi hoặc người đi đường.

### 7.2. Responsive SSOT & Touch Targets
- **Mobile Viewport (360px — 430px)**:
  - Thanh tab filter hỗ trợ cuộn ngang ngón tay cái (`overflow-x-auto pb-1`).
  - Thẻ phản ánh bố cục 1 cột dọc; mã hồ sơ, ngày gửi và huy hiệu trạng thái tự động co dãn không tràn viền (`min-w-0 flex`).
  - Toàn bộ vùng chạm trên thẻ và nút bấm đảm bảo chiều cao tối thiểu $\ge 44\text{px}$.
  - Hiển thị thanh Bottom Navigation Bar cố định đáy với `z-index: 50`.
- **Tablet (640px — 1024px)**:
  - Thẻ phản ánh chuyển sang dạng dàn ngang (Flex Row), thông tin căn trái, nút "Xem tiến độ →" căn phải thẳng hàng.
- **Desktop (1024px — 1920px)**:
  - Bố cục giới hạn độ rộng tối đa `max-w-4xl` căn giữa màn hình, giữ nhịp thị giác chặt chẽ, không bị loãng thông tin trên màn hình lớn.

---

## 8. Bẫy Lỗi Thường Gặp & Hướng Dẫn Kiểm Thử (Gotchas & Verification Commands)

### 8.1. Bẫy lập trình & Quy tắc an toàn (Gotchas)

> [!CAUTION]
> 1. **Collection Normalization Crash**: API Edge Worker trả về `{ status: 'success', data: { items: [...] } }`. Nếu component trực tiếp gán `setReports(res.data)` hoặc `res.data.items` mà không bọc lớp bảo vệ `normalizeList(res)`, khi mạng chập chờn hoặc API trả về `{ error }` sẽ làm nổ ứng dụng (`TypeError: reports.filter is not a function`).
> 2. **Xung đột State giữa Offline và Cloud D1**: Người dùng gửi phản ánh khi offline có thể lưu tạm trong `localStorage`. Component cần hòa nhập khéo léo giữa dữ liệu D1 thật và bản ghi đệm cục bộ mà không sinh mã trùng lặp.
> 3. **Lỗi che khuất thông tin (Zero Truncate on Critical Entities)**: Tuyệt đối không dùng class `truncate` cứng trên địa chỉ và mã tra cứu; chỉ dùng `line-clamp-1` cho tiêu đề mô tả ngắn trên danh sách tổng quan, toàn bộ chi tiết phải đọc được đầy đủ trong `CIT-04`.

### 8.2. Lệnh kiểm thử nhanh một dòng qua PowerShell (< 0.5s)

```powershell
node --test app/tests/citizen-full-functional.test.js app/tests/citizen-youth-ux.test.js
```

### 8.3. Tiêu chí nghiệm thu (Pass Criteria 100%)
1. **API Fallback An Toàn**: Màn hình hiển thị `EmptyState` chuẩn mực khi API trả về rỗng hoặc lỗi mạng mà không làm phát sinh lỗi console.
2. **Lọc Tab Tức Thì**: Chuyển đổi giữa 4 tab `Tất cả`, `Mới gửi`, `Đang xử lý`, `Đã khắc phục` có thời gian phản hồi $< 10\text{ms}$.
3. **Điều Hướng Chính Xác**: Bấm vào thẻ phản ánh bất kỳ chuyển đúng route `/citizen/reports/:id` kèm mã định danh tương ứng.
4. **Chuẩn Touch Target & Không Tràn Giao Diện**: Không phát sinh thanh cuộn ngang trang (horizontal overflow) trên màn hình 360px.
