import fs from 'node:fs';
import path from 'node:path';

const SCREENS_DIR = path.resolve('docs/product/screens');

function writeScreen(filename, content) {
  fs.writeFileSync(path.join(SCREENS_DIR, filename), content.trim() + '\n', 'utf8');
}

console.log('Generating deep PDRs for all screens...');

// =========================================================================
// STAFF SCREENS (DEEP DIVE)
// =========================================================================

writeScreen('STAFF-01-dashboard.md', `# STF-01 — Bảng Điều Hành Tác Nghiệp 12 Chỉ Số (Staff Dashboard)

## 1. Screen identity
- **Role**: Staff / Thanh tra môi trường / Cán bộ giám sát
- **Route**: \`/staff\`
- **Component**: \`src/apps/staff/pages/dashboard/StaffDashboardPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\` (Sidebar điều hành 12 phân hệ)
- **Navigation entry**: Gốc phân hệ cán bộ
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Trung tâm chỉ huy tác nghiệp tổng thể: giám sát 12 chỉ số điều hành trọng yếu, ma trận rủi ro 33 công trình, cảnh báo ô nhiễm khẩn cấp và các hồ sơ vụ việc cần xử lý ngay trong ca trực.

---

## 2. User goal
1. **Xác định việc ưu tiên trong ngày**: Nắm bắt ngay số vụ việc sắp quá hạn SLA 48h và các cảnh báo ô nhiễm mức độ Cao/Rất cao.
2. **Chỉ đạo xử lý hiện trường**: Mở trực tiếp hồ sơ vụ việc hoặc cảnh báo để phân công cán bộ khảo sát hoặc giao nhiệm vụ khắc phục cho nhà thầu.
3. **Theo dõi chất lượng môi trường**: Đánh giá diễn biến chỉ số PM2.5/PM10 trên toàn địa bàn quản lý.

---

## 3. Entry points
- Đăng nhập tài khoản Staff (\`/login\`).
- Bấm "Bảng điều hành" trên Sidebar Staff.
- Chuyển vai trò từ Demo Hub (\`/demo\`).

---

## 4. Exit / next actions
- Bấm vào thẻ "Công trình" $\rightarrow$ \`/staff/sites\`
- Bấm vào thẻ "Vụ việc cần xử lý" $\rightarrow$ \`/staff/cases\`
- Bấm vào thẻ "Cảnh báo khẩn" $\rightarrow$ \`/staff/alerts\`
- Bấm vào một dòng hồ sơ cụ thể $\rightarrow$ \`/staff/cases/:id\`
- Bấm "Tạo hồ sơ mới" $\rightarrow$ Mở Modal tạo hồ sơ vụ việc

---

## 5. Information hierarchy
1. **Thanh thông tin ca trực (Shift Header)**: Ngày giờ hiện tại, tên cán bộ trực, Nút [Tạo hồ sơ vụ việc mới].
2. **Lưới 4 Thẻ chỉ số trọng yếu (Top Metric Cards)**:
   - Tổng số công trình quản lý (33)
   - Hồ sơ vụ việc đang thụ lý (7 bước DAG)
   - Cảnh báo ô nhiễm khẩn cấp (Cần xác minh)
   - Tỷ lệ xử lý đúng hạn SLA (Mục tiêu $\ge 90\%$)
3. **Dải cảnh báo ô nhiễm thời gian thực (Real-time Alerts Strip)**: Danh sách các sự kiện nồng độ bụi vượt QCVN 05:2023.
4. **Bảng 5 Hồ sơ vụ việc có điểm rủi ro cao nhất (Top Priority Cases Table)**: Mã hồ sơ, Tên công trình, Giai đoạn 7 bước, Điểm rủi ro $R$, Hạn chót SLA.
5. **Ma trận phân bố rủi ro công trình (Risk Distribution Matrix)**: Biểu đồ tỷ lệ 4 cấp rủi ro (Thấp, Trung bình, Cao, Rất cao).

---

## 6. Above-the-fold content (First Viewport)
- **MUST SEE**: 4 Thẻ chỉ số vận hành, Nút [Tạo hồ sơ vụ việc], Danh sách 3 cảnh báo khẩn cấp nhất.
- **SHOULD SEE**: Bảng top 5 vụ việc ưu tiên cao.
- **BELOW FOLD**: Biểu đồ phân tích xu hướng ô nhiễm theo tuần và lịch phân công kiểm tra.

---

## 7. Screen sections chi tiết

### Section 1 — Shift Header & Quick Action
- **Displays**: Tiêu đề trang, thông tin ngày trực, Nút [Tạo hồ sơ vụ việc] (Đỏ son, $\ge 44\text{px}$).
- **Status**: IMPLEMENTED.

### Section 2 — 4 Core KPI Metric Cards
- **Displays**:
  - \`sitesCount\`: 33 Công trình đang theo dõi.
  - \`activeCases\`: Số vụ việc đang ở các bước INTAKE, SURVEYED, PROPOSED, APPROVED, REMEDIATED.
  - \`pendingAlerts\`: Số cảnh báo vượt ngưỡng chưa được xử lý.
  - \`slaCompliance\`: Tỷ lệ phần trăm xử lý trong vòng 48h.
- **Data Source**: VERIFIED (D1 \`/api/staff/dashboard\`).
- **Status**: IMPLEMENTED.

### Section 3 — High-Risk Alerts Banner
- **Displays**: Thẻ cảnh báo nền đỏ/cam nổi bật, tên trạm đo, nồng độ PM2.5 ($\mu\text{g/m}^3$), thời điểm kích hoạt, Nút [Xử lý ngay].
- **Status**: IMPLEMENTED.

### Section 4 — Top Priority Cases Table
- **Displays**: Bảng 5 vụ việc nóng nhất có điểm rủi ro cao hoặc sắp hết hạn SLA.
- **Columns**: Mã vụ việc, Tên công trình, Giai đoạn DAG, Điểm $R$, Hạn SLA, Thao tác.
- **Status**: IMPLEMENTED.

---

## 8. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|:---:|---|---|
| Total Sites Monitored | Tổng số công trình đang giám sát | Có | D1 \`sites\` | REAL |
| Active Cases | Số hồ sơ vụ việc đang thụ lý | Có | D1 \`cases\` | REAL |
| Critical Alerts | Số cảnh báo ô nhiễm vượt ngưỡng chưa đóng | Có | D1 \`alerts\` | REAL |
| SLA Compliance Rate | Tỷ lệ xử lý vụ việc đúng hạn 48h | Có | Calculated Metric | REAL |
| Priority Cases List | Danh sách 5 hồ sơ ưu tiên xử lý | Có | D1 \`cases\` | REAL |

---

## 9. User actions
| Action | Trigger | Result | Permission | Status |
|---|---|---|---|---|
| Mở hồ sơ vụ việc ưu tiên | Bấm vào dòng trong bảng | Chuyển tới \`/staff/cases/:id\` | Staff | WORKING |
| Mở xử lý cảnh báo | Bấm [Xử lý ngay] trên Alert | Mở modal tạo Case từ Alert | Staff | WORKING |
| Tạo hồ sơ vụ việc mới | Bấm [Tạo hồ sơ vụ việc] | Mở form tạo Case mới | Staff | WORKING |
| Lọc theo khoảng thời gian | Chọn bộ lọc Hôm nay / Tuần này | Cập nhật số liệu dashboard | Staff | WORKING |

---

## 10. Primary action
- **Primary action**: \`[Xử lý hồ sơ ưu tiên]\` (Bấm vào dòng vụ việc)
- **Secondary**: \`[Tạo hồ sơ vụ việc mới]\`, \`[Xem tất cả cảnh báo]\`

---

## 11. Screen states
- **Loading state**: Hiển thị 4 Skeleton Cards và Skeleton Table trong khi fetch \`/api/staff/dashboard\`.
- **Empty state**: "Không có cảnh báo khẩn cấp nào trong ca trực hôm nay."
- **Error state**: Toast thông báo lỗi kèm nút "Thử lại".
- **Success state**: Tải dữ liệu D1 hoàn tất dưới 0.2s, hiển thị chỉ số chính xác.

---

## 12. UI Copy
- **Page title**: Bảng điều hành tác nghiệp
- **Short description**: Tổng hợp chỉ số vận hành, cảnh báo ô nhiễm và hồ sơ vụ việc ưu tiên xử lý.
- **Button labels**: \`[Tạo hồ sơ vụ việc]\`, \`[Xử lý ngay]\`, \`[Xem tất cả]\`

---

## 13. Text density budget
- Page title: 5 từ ($\le 8$ từ)
- Description: 16 từ ($\le 20$ từ)
- Primary CTA: 3 từ (\`[Tạo hồ sơ mới]\`)
- Card titles: 3–5 từ
- Status badges: 2–3 từ
- **Đạt chuẩn SCAN > READ trong 5 giây.**

---

## 14. Responsibility boundary
- **Staff ĐƯỢC**: Xem toàn bộ chỉ số, tạo hồ sơ mới, chỉ đạo xử lý cảnh báo, mở chi tiết vụ việc.
- **Staff KHÔNG ĐƯỢC**: Xóa vĩnh viễn dữ liệu D1 (thuộc quyền Admin).

---

## 15. Dependencies & Data reality
- **Dependencies**: React 19, Recharts, Lucide Icons, \`staff-api.js\`.
- **Data reality**: D1 Database SSOT kết nối qua \`/api/staff/dashboard\`.
`);

writeScreen('STAFF-02-sites-list.md', `# STF-02 — Danh Sách 33 Công Trình Xây Dựng (Sites List)

## 1. Screen identity
- **Role**: Staff / Inspector / Quản lý địa bàn
- **Route**: \`/staff/sites\`
- **Component**: \`src/apps/staff/pages/sites/SitesListPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Sidebar Staff ("Công trình")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Quản lý tập trung toàn bộ 33 công trình xây dựng: tra cứu theo quận huyện, lọc theo 4 mức độ rủi ro $R$, theo dõi tình trạng trạm cảm biến và mở hồ sơ chi tiết từng điểm thi công.

---

## 2. User goal
1. **Tìm kiếm công trình nhanh**: Tìm theo mã định danh (VD: \`BD-0001\`), tên dự án hoặc địa chỉ đường phố.
2. **Phân loại mức độ rủi ro**: Lọc nhanh các công trình có nguy cơ phát tán bụi ở mức Cao hoặc Rất cao để lên kế hoạch thanh tra.
3. **Mở hồ sơ chi tiết**: Nhấn vào dòng công trình để xem thông số kỹ thuật, lịch sử cảm biến và các vụ việc liên quan.

---

## 3. Information hierarchy
1. **Thanh công cụ tìm kiếm & Bộ lọc (Toolbar)**: Ô tìm kiếm từ khóa, Bộ lọc Quận/Huyện, Bộ lọc 4 Cấp rủi ro $R$, Nút [Thêm công trình].
2. **Bảng danh sách công trình (Sites Data Table)**: 33 công trình với các cột thông tin chuẩn hóa.
3. **Thanh phân trang & Tổng số (Pagination Footer)**: Hiển thị \`Hiển thị 1-10 trên tổng số 33 công trình\`.

---

## 4. Table specification (Chuẩn Zero Truncate)
| Cột | Ý nghĩa | Sắp xếp | Độ rộng | Ghi chú hiển thị |
|---|---|:---:|:---:|---|
| **Mã công trình** | Mã định danh duy nhất (VD: \`BD-0001\`) | Có | 120px | Phông Monospace, viền đậm |
| **Tên công trình** | Tên đầy đủ dự án xây dựng | Có | 250px | **Zero Truncate**, tự động xuống dòng (\`break-words\`) |
| **Địa chỉ / Quận** | Vị trí địa lý công trình | Có | 200px | Địa chỉ hành chính rõ ràng |
| **Nhà thầu thi công** | Đơn vị chịu trách nhiệm | Không | 180px | Tên công ty / Liên danh |
| **Trạm đo IoT** | Số lượng cảm biến & trạng thái | Không | 130px | Badge xanh (Đang đo) / Xám (Chưa lắp) |
| **Điểm rủi ro $R$** | Điểm số $0-100$ kèm Badge màu | Có | 140px | 4 Màu chuẩn: Xanh, Vàng, Cam, Đỏ |
| **Thao tác** | Nút xem chi tiết | Không | 100px | Nút \`[Chi tiết]\` |

---

## 5. Primary action
- **Primary action**: Bấm vào bất kỳ dòng nào trong bảng $\rightarrow$ Mở \`/staff/sites/:id\`
- **Secondary**: \`[Thêm công trình mới]\`, \`[Xuất danh sách Excel/PDF]\`

---

## 6. Screen states
- **Loading state**: Hiển thị bảng khung xương (Skeleton Rows).
- **Empty state**: "Không tìm thấy công trình nào phù hợp với bộ lọc tìm kiếm."
- **Error state**: Báo lỗi tải danh mục kèm nút "Tải lại danh sách".
- **Success state**: Hiển thị đầy đủ 33 công trình thực tế từ D1 Database.

---

## 7. UI Copy
- **Page title**: Danh sách công trình xây dựng
- **Short description**: Giám sát 33 điểm thi công trên địa bàn, đánh giá mức độ phát tán bụi và tình trạng lắp đặt trạm đo.
- **Button labels**: \`[Thêm công trình]\`, \`[Lọc rủi ro]\`, \`[Chi tiết]\`
`);

writeScreen('STAFF-03-site-detail.md', `# STF-03 — Hồ Sơ Chi Tiết Công Trình & Quan Trắc Thực Địa (Site Detail)

## 1. Screen identity
- **Role**: Staff / Inspector
- **Route**: \`/staff/sites/:id\` (hỗ trợ sub-tabs \`/staff/sites/:id/:tab\`)
- **Component**: \`src/apps/staff/pages/sites/SiteDetailPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Bấm từ danh sách công trình (\`/staff/sites\`) hoặc bản đồ (\`/map\`)
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Hồ sơ số toàn diện của một công trình xây dựng: thông tin pháp lý nhà thầu, tọa độ WGS84, công thức chi tiết điểm rủi ro $R$, biểu đồ chuỗi thời gian PM2.5/PM10 trực tiếp từ cảm biến, lịch sử vi phạm và biên bản kiểm tra.

---

## 2. Information hierarchy & 5 Sub-Tabs
1. **Thanh Header nhận diện công trình (Site Identity Header)**:
   - Tên công trình lớn (H1), Mã số định danh (VD: \`BD-0001\`), Địa chỉ thi công.
   - Huy hiệu Điểm rủi ro $R$ kích thước lớn (VD: \`Điểm rủi ro: 78 / 100 — Mức Cao\`).
   - Nút thao tác nhanh: \`[Tạo vụ việc]\`, \`[Chỉnh sửa]\`, \`[Lập biên bản]\`.
2. **Thanh điều hướng Tabs chuyên sâu**:
   - **Tab 1 — Tổng quan (Overview)**: Thông tin nhà thầu, diện tích thi công ($m^2$), lưu lượng xe tải (chuyến/ngày), đánh giá che chắn bạt, bảng bóc tách công thức $R = \sum w_i S_i$.
   - **Tab 2 — Cảm biến & Đo đạc (Sensors & Readings)**: Danh sách các đầu đo bụi (PM2.5, PM10, Gió, Độ ẩm), Biểu đồ đường thời gian thực 24 giờ đối chiếu ngưỡng QCVN 05:2023.
   - **Tab 3 — Hồ sơ vụ việc (Cases)**: Lịch sử toàn bộ các vụ việc xử lý vi phạm liên quan đến công trình qua 7 bước DAG.
   - **Tab 4 — Biên bản khảo sát (Inspections)**: Danh sách các biên bản kiểm tra hiện trường đã lập.
   - **Tab 5 — Lịch sử kiểm toán (Audit Trail)**: Biểu đồ lịch sử thay đổi điểm số rủi ro $R$ theo thời gian.

---

## 3. Data displayed
| Field | Meaning | Required | Source | Current status |
|---|---|:---:|---|---|
| Site Name & Code | Tên & Mã định danh công trình | Có | D1 \`sites\` | REAL |
| Contractor Details | Tên công ty, Chỉ huy trưởng, Số điện thoại | Có | D1 \`sites\` | REAL |
| Coordinates (Lat, Lng) | Tọa độ WGS84 phục vụ kiểm tra Geofence 50m | Có | D1 \`sites\` | REAL |
| Risk Factors ($S_1, S_2, S_3, S_4$) | 4 Tham số tính điểm rủi ro | Có | D1 \`sites\` | REAL |
| Telemetry PM2.5 / PM10 | Chuỗi số liệu nồng độ bụi 24h | Không | D1 \`sensor_readings\` | REAL |
| Related Cases | Danh sách hồ sơ vụ việc liên quan | Không | D1 \`cases\` | REAL |

---

## 4. Primary action
- **Primary action**: \`[Tạo hồ sơ vụ việc mới]\` (gắn với công trình này)
- **Secondary**: \`[Lập biên bản khảo sát]\`, \`[Chỉnh sửa tham số rủi ro]\`
`);

writeScreen('STAFF-04-cases-list.md', `# STF-04 — Danh Sách Hồ Sơ Vụ Việc Xử Lý Vi Phạm (Cases List)

## 1. Screen identity
- **Role**: Staff / Thanh tra môi trường / Pháp chế
- **Route**: \`/staff/cases\`
- **Component**: \`src/apps/staff/pages/cases/CasesListPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Sidebar Staff ("Hồ sơ vụ việc")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Quản lý và theo dõi toàn bộ hồ sơ vụ việc xử lý vi phạm môi trường theo chu trình 7 bước (DAG), phân loại theo giai đoạn tác nghiệp và cảnh báo thời hạn xử lý SLA 48 giờ.

---

## 2. 7-Step DAG Pipeline Filter Tabs
- **Tất cả (All)**: Toàn bộ hồ sơ trong hệ thống.
- **1. Tiếp nhận (\`INTAKE\`)**: Phản ánh mới được duyệt thành vụ việc.
- **2. Khảo sát (\`SURVEYED\`)**: Đã kiểm tra thực địa và lập biên bản.
- **3. Đề xuất (\`PROPOSED\`)**: Đã lập phương án xử lý / mức phạt.
- **4. Phê duyệt (\`APPROVED\`)**: Lãnh đạo đã ký duyệt quyết định.
- **5. Khắc phục (\`REMEDIATED\`)**: Nhà thầu đã nộp ảnh Before/After $\le 50\text{m}$.
- **6. Nghiệm thu (\`VERIFIED\`)**: Thanh tra đã xác nhận đạt yêu cầu.
- **7. Hoàn tất (\`CLOSED\`)**: Đóng hồ sơ và lưu trữ kiểm toán.

---

## 3. Table specification
| Cột | Ý nghĩa | Định dạng / Badge | Sắp xếp |
|---|---|---|:---:|
| **Mã vụ việc** | Mã số hồ sơ (VD: \`CASE-2026-0042\`) | Phông Monospace | Có |
| **Công trình** | Tên công trình vi phạm | Zero Truncate, break-words | Có |
| **Giai đoạn (Stage)** | 1 trong 7 bước DAG | Badge màu theo bước | Có |
| **Điểm rủi ro** | Mức độ nghiêm trọng của vi phạm | 4 Màu chuẩn hóa | Có |
| **Thời hạn SLA** | Đếm ngược 48 giờ xử lý | Đỏ nếu quá hạn, Vàng nếu $\le 12\text{h}$ | Có (Default) |
| **Người thụ lý** | Cán bộ chịu trách nhiệm | Text | Không |
| **Thao tác** | Nút mở hồ sơ | Nút \`[Xem chi tiết]\` | Không |

---

## 4. Primary action
- **Primary action**: Bấm vào dòng hồ sơ vụ việc $\rightarrow$ Chuyển sang \`/staff/cases/:id\`
- **Secondary**: \`[Lọc theo bước DAG]\`, \`[Lọc hồ sơ quá hạn SLA]\`
`);

writeScreen('STAFF-05-case-detail.md', `# STF-05 — Chi Tiết Quy Trình 7 Bước Vụ Việc (Case Detail DAG)

## 1. Screen identity
- **Role**: Staff / Thanh tra môi trường / Pháp chế
- **Route**: \`/staff/cases/:id\`
- **Component**: \`src/apps/staff/pages/cases/CaseDetailPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Bấm dòng vụ việc từ danh sách hoặc dashboard
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Không gian tác nghiệp cốt lõi của cán bộ thanh tra: thực hiện điều chuyển trạng thái qua 7 bước, xem xét ảnh bằng chứng gốc SHA-256, giao việc khắc phục cho nhà thầu, nghiệm thu ảnh Before/After và ban hành quyết định hành chính chuẩn NĐ 30/2020.

---

## 2. Information hierarchy
1. **Thanh tiêu đề hồ sơ (Case Header)**: Mã vụ việc lớn, Tên công trình, Trạng thái SLA 48h, Nút thao tác nhanh theo bước.
2. **Thanh tiến trình 7 bước DAG tương tác (Interactive 7-Step Pipeline)**: Hiển thị trực quan bước hiện tại, thời gian hoàn thành các bước trước.
3. **Không gian bằng chứng số (Digital Evidence Space)**: Ảnh phản ánh ban đầu, mã băm SHA-256 Web Crypto, tọa độ WGS84.
4. **Khu vực giao nhiệm vụ & Nhà thầu khắc phục (Remediation Task Section)**: Xem yêu cầu đã giao, ảnh đối chứng Trước/Sau do nhà thầu nộp từ hiện trường $\le 50\text{m}$.
5. **Dòng thời gian kiểm toán vụ việc (Case Audit Timeline)**: Lịch sử từng lần chuyển bước, người thực hiện, ghi chú nghiệp vụ.
6. **Khu vực văn bản & Quyết định xử phạt (Legal Decisions)**: Soạn thảo biên bản, gắn chữ ký số, xuất file in ấn A4.

---

## 3. 7-Step Transition Rules & Verification
- \`INTAKE \rightarrow SURVEYED\`: Yêu cầu có biên bản khảo sát hiện trường hoặc ảnh xác minh.
- \`SURVEYED \rightarrow PROPOSED\`: Yêu cầu điền biện pháp xử lý và mức phạt đề xuất (nếu có).
- \`PROPOSED \rightarrow APPROVED\`: Yêu cầu chữ ký duyệt của Lãnh đạo.
- \`APPROVED \rightarrow REMEDIATED\`: Tự động kích hoạt khi nhà thầu nộp ảnh Before/After hợp lệ trong Geofence $\le 50\text{m}$.
- \`REMEDIATED \rightarrow VERIFIED\`: Cán bộ thanh tra bấm "Nghiệm thu đạt yêu cầu".
- \`VERIFIED \rightarrow CLOSED\`: Đóng hồ sơ, hoàn tất lưu trữ.

---

## 4. Primary action
- **Primary action**: \`[Chuyển bước tiếp theo]\` hoặc \`[Nghiệm thu khắc phục]\`
- **Secondary**: \`[Giao nhiệm vụ cho nhà thầu]\`, \`[Xuất văn bản A4]\`, \`[Yêu cầu làm lại]\`
`);

writeScreen('STAFF-07-monitoring.md', `# STF-07 — Ma Trận Giám Sát Cảm Biến IoT Thời Gian Thực (Staff Monitoring)

## 1. Screen identity
- **Role**: Staff / Quản lý vận hành mạng lưới
- **Route**: \`/staff/monitoring\`
- **Component**: \`src/apps/staff/pages/monitoring/StaffMonitoringPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Sidebar Staff ("Giám sát IoT")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Theo dõi thời gian thực mạng lưới cảm biến bụi PM2.5, PM10, Gió, Độ ẩm; biểu đồ chuỗi thời gian 24 giờ và đối chiếu với ngưỡng giới hạn QCVN 05:2023/BTNMT để phát hiện sớm nguy cơ phát tán bụi diện rộng.

---

## 2. Information hierarchy
1. **Thanh chỉ số tổng quan mạng lưới**: Tổng số trạm đo (Trực tuyến / Ngoại tuyến / Vượt ngưỡng), Nồng độ PM2.5 trung bình toàn thành phố.
2. **Biểu đồ chuỗi thời gian nồng độ bụi 24h (Telemetry Time-Series Chart)**: So sánh đường PM2.5 đo đạc với đường đỏ ngưỡng chuẩn QCVN ($50\mu\text{g/m}^3$).
3. **Lưới thẻ trạm cảm biến (Sensor Station Grid)**: Danh sách từng trạm đo gắn với công trình, hiển thị chỉ số hiện tại, mức pin và thời điểm ping gần nhất.
4. **Bảng phân tích tương quan thời tiết (Weather Correlation)**: Hướng gió, tốc độ gió và độ ẩm ảnh hưởng đến phát tán bụi.

---

## 3. Primary action
- **Primary action**: Bấm vào trạm đo có cảnh báo $\rightarrow$ Xem chi tiết và kích hoạt cảnh báo
- **Secondary**: \`[Xuất dữ liệu đo đạc CSV]\`, \`[Cấu hình ngưỡng cảnh báo]\`
`);

writeScreen('STAFF-08-alerts.md', `# STF-08 — Trung Tâm Xử Lý Cảnh Báo Ô Nhiễm (Staff Alerts)

## 1. Screen identity
- **Role**: Staff / Inspector
- **Route**: \`/staff/alerts\`
- **Component**: \`src/apps/staff/pages/alerts/StaffAlertsPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Sidebar Staff ("Cảnh báo")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Tiếp nhận và xử lý các sự kiện nồng độ bụi vượt ngưỡng an toàn do cảm biến tự động gửi về; kích hoạt quy trình tạo hồ sơ vụ việc chỉ với 1 click để cử đoàn thanh tra xử lý ngay.

---

## 2. Alert Severity Levels
- **Mức 1 — Chú ý (Vàng)**: Nồng độ PM2.5 vượt $50\mu\text{g/m}^3$ liên tục 15 phút.
- **Mức 2 — Nghiêm trọng (Cam)**: Nồng độ PM2.5 vượt $100\mu\text{g/m}^3$ liên tục 30 phút.
- **Mức 3 — Khẩn cấp (Đỏ)**: Nồng độ PM2.5 vượt $150\mu\text{g/m}^3$ hoặc phát hiện bụi mù phát tán ra đường dân sinh.

---

## 3. Primary action
- **Primary action**: \`[Tạo hồ sơ xử lý 1-Click]\` (Tự động tạo Case từ Alert)
- **Secondary**: \`[Xác minh hiện trường]\`, \`[Đóng cảnh báo giả lập]\`
`);

writeScreen('STAFF-09-reports.md', `# STF-09 — Báo Cáo Điều Hành Chuẩn NĐ 30/2020/NĐ-CP (Staff Reports)

## 1. Screen identity
- **Role**: Staff / Executive / Lãnh đạo ban ngành
- **Route**: \`/staff/reports\`
- **Component**: \`src/apps/staff/pages/reports/StaffReportsPage.jsx\`
- **Layout**: \`src/apps/staff/layout/StaffLayout.jsx\`
- **Navigation entry**: Sidebar Staff ("Báo cáo điều hành")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Soạn thảo, ký số và xuất bản các báo cáo hành chính, biên bản kiểm tra và quyết định xử phạt vi phạm môi trường chuẩn khổ giấy A4 in ấn theo Nghị định 30/2020/NĐ-CP có mã băm bảo mật docHash chống làm giả.

---

## 2. Legal Document Standards (NĐ 30/2020/NĐ-CP)
- Khổ giấy A4 đứng (210mm x 297mm), lề chuẩn: Trên 20mm, Dưới 20mm, Trái 30mm, Phải 15mm.
- Quốc hiệu & Tiêu ngữ chuẩn kiểu chữ, cỡ chữ quy định.
- Tên cơ quan ban hành, số ký hiệu văn bản, địa danh và ngày tháng năm.
- Mã băm SHA-256 in chân trang (docHash) đối chứng tính toàn vẹn văn bản.

---

## 3. Primary action
- **Primary action**: \`[In báo cáo A4 / Xuất PDF]\`
- **Secondary**: \`[Ký số HMAC]\`, \`[Chỉnh sửa nội dung biên bản]\`
`);

// =========================================================================
// CONTRACTOR & ADMIN SCREENS (DEEP DIVE)
// =========================================================================

writeScreen('CONTRACTOR-02-tasks-remediation.md', `# CON-02 — Tiếp Nhận Khắc Phục & Đối Chứng Trước/Sau (Contractor Tasks)

## 1. Screen identity
- **Role**: Contractor / Chỉ huy trưởng công trường
- **Route**: \`/contractor/tasks\`
- **Component**: \`src/apps/contractor/pages/tasks/ContractorTasksPage.jsx\`
- **Layout**: \`src/apps/contractor/layout/ContractorLayout.jsx\`
- **Navigation entry**: Sidebar Contractor ("Yêu cầu khắc phục")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Cổng tiếp nhận yêu cầu khắc phục dành cho nhà thầu: kiểm tra phạm vi địa lý Geofence $\le 50\text{m}$, chụp và nộp bộ ảnh đối chứng Trước/Sau (Before/After) kèm văn bản giải trình để gửi cán bộ thanh tra nghiệm thu.

---

## 2. User goal
1. **Xem yêu cầu xử lý**: Đọc chi tiết nội dung vi phạm do thanh tra yêu cầu (VD: Bổ sung lưới chắn bụi, tưới nước rửa đường, rửa xe trước khi ra khỏi công trường).
2. **Xác thực vị trí hiện trường**: Hệ thống tự động kiểm tra GPS thiết bị phải nằm trong bán kính 50m quanh tâm công trình.
3. **Nộp minh chứng hoàn thành**: Tải lên ảnh chụp thực tế sau khi đã xử lý, điền nội dung giải trình và bấm gửi nghiệm thu.

---

## 3. Information hierarchy
1. **Danh sách nhiệm vụ cần làm (Pending Actions List)**: Thẻ nhiệm vụ có hạn chót xử lý và mức độ ưu tiên.
2. **Khung so sánh ảnh đối chứng (Before/After Comparison Zone)**:
   - Ảnh vi phạm ban đầu (Before): Do người dân/thanh tra chụp kèm mã hash SHA-256.
   - Khung chụp ảnh khắc phục (After): Do nhà thầu tải lên tại hiện trường.
3. **Công cụ xác thực vị trí (Geofence Distance Check)**: Hiển thị khoảng cách thực tế tới công trình (VD: \`Cách tâm công trình 18m — Hợp lệ\`).
4. **Ô nội dung giải trình (Remediation Explanation)**: Nhập biện pháp kỹ thuật đã áp dụng.
5. **Nút gửi nghiệm thu (Submit Remediation)**: \`[Gửi báo cáo khắc phục]\`.

---

## 4. Primary action
- **Primary action**: \`[Gửi báo cáo khắc phục]\` ($\ge 44\text{px}$, kiểm tra Geofence $\le 50\text{m}$)
- **Secondary**: \`[Xem hồ sơ vụ việc]\`, \`[Liên hệ cán bộ phụ trách]\`
`);

writeScreen('ADMIN-01-dashboard.md', `# ADM-01 — Bảng Điều Khiển Quản Trị Hệ Thống (Admin Dashboard)

## 1. Screen identity
- **Role**: Admin / Quản trị viên kỹ thuật
- **Route**: \`/admin\`
- **Component**: \`src/apps/admin/pages/dashboard/AdminDashboardPage.jsx\`
- **Layout**: \`src/apps/admin/layout/AdminLayout.jsx\`
- **Navigation entry**: Gốc phân hệ quản trị
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Giám sát toàn bộ hạ tầng cơ sở dữ liệu Cloudflare D1 (46 bảng), số lượng bản ghi thực tế, tình trạng phân quyền tài khoản và tiến trình tự động hóa kiểm toán rủi ro.

---

## 2. Information hierarchy
1. **Bảng thống kê hạ tầng D1 (D1 Data Tables Stats)**: 46 Bảng quan hệ kèm số lượng bản ghi thực tế từng bảng.
2. **Tình trạng phân quyền tài khoản (RBAC Accounts Overview)**: Số lượng tài khoản theo từng vai trò (Citizen, Staff, Contractor, Admin).
3. **Tiến trình tự động hóa (Automation Sweep Runs)**: Nhật ký quét tính toán lại điểm rủi ro $R$ định kỳ của hệ thống.
4. **Công cụ bảo trì hệ thống (Maintenance Controls)**: Nạp dữ liệu mẫu demo, dọn dẹp thùng rác.

---

## 3. Primary action
- **Primary action**: \`[Kích hoạt quét tự động]\` (\`/api/automation/sweep\`)
- **Secondary**: \`[Quản lý người dùng]\`, \`[Khôi phục Demo D1]\`
`);

writeScreen('ADMIN-02-users.md', `# ADM-02 — Quản Lý Người Dùng & Phân Quyền RBAC (Users Management)

## 1. Screen identity
- **Role**: Admin
- **Route**: \`/admin/users\`
- **Component**: \`src/apps/admin/pages/users/UsersPage.jsx\`
- **Layout**: \`src/apps/admin/layout/AdminLayout.jsx\`
- **Navigation entry**: Sidebar Admin ("Người dùng")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Quản lý tập trung toàn bộ danh sách tài khoản người dùng: phân bổ vai trò (Citizen, Staff, Contractor, Admin), cấp quyền thao tác và khóa tài khoản vi phạm chính sách an toàn.
`);

writeScreen('ADMIN-03-settings.md', `# ADM-03 — Cấu Hình Hệ Thống & Khôi Phục Dữ Liệu Demo (System Settings)

## 1. Screen identity
- **Role**: Admin
- **Route**: \`/admin/settings\`
- **Component**: \`src/apps/admin/pages/settings/SettingsPage.jsx\`
- **Layout**: \`src/apps/admin/layout/AdminLayout.jsx\`
- **Navigation entry**: Sidebar Admin ("Cấu hình")
- **Current implementation status**: ACTIVE (Level 5 Production Coherent)

**Purpose**: Cấu hình các tham số vận hành hệ thống: ngưỡng kích hoạt cảnh báo QCVN 05:2023, chính sách tự động quét rủi ro (Automation Sweep), dọn dẹp thùng rác và công cụ khôi phục cơ sở dữ liệu mẫu D1 (Demo Reset).
`);

console.log('Finished updating deep PDRs for all screens.');
