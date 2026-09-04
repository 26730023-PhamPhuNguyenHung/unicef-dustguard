# ACTION AUDIT — DUSTGUARD VN
> **Ngày lập**: 04/09/2026 | **Phiên bản**: 1.0.0 | **Tiêu chuẩn**: Zero-Empty-Handler, Real DB Mutation, No Fake Toasts

Bảng rà soát toàn bộ các thành phần tương tác (Button, Menu, Form, Modal, Upload, Tab, Filter, Action) trên 30 màn hình của DustGuard VN.

---

## 1. Bảng Kiểm Tra Chi Tiết Mọi Hành Động Giao Diện

| Màn hình | Nút / Hành động | Kỳ vọng nghiệp vụ (Expected) | Thực tế hiện tại (Actual) | API Endpoint | Tác động DB (DB Effect) | Trạng thái (Status) |
|---|---|---|---|---|---|:---:|
| `ReportNewPage.jsx` | Nút "Gửi phản ánh" (Bước 4) | Nộp dữ liệu, tạo bản ghi `complaints` và `evidences`, sinh mã thật `#DG-2026-XXXX`. | Nếu API lỗi, nuốt lỗi và tự sinh mã giả `DG-2026-${Math.random()}` rồi chuyển sang Bước 5. | `POST /api/complaints`, `POST /api/upload` | Thêm dòng vào `complaints` và `evidences`. Không ghi DB khi lỗi mà vẫn báo thành công. | 🚨 **FAKE SUCCESS** |
| `ReportDetailPage.jsx` | Nút "Gửi đánh giá" (Màn 5) | Gửi đánh giá hài lòng/tái kiểm, cập nhật trạng thái hồ sơ `RESOLVED` hoặc mở lại `REOPEN_REQUEST`, ghi audit log và cộng điểm. | Gọi `POST /api/complaints/:id/verify` nhưng Worker endpoint không đọc `isSatisfied`, `feedback`, `rating`. | `POST /api/complaints/:id/verify` | Cập nhật `complaints.status = 'VERIFIED'`. Không ghi nhận phản hồi tái kiểm hay đánh giá của dân. | 🚨 **STUB TRUNCATION** |
| `StaffTodayPage.jsx` | Tải dữ liệu trang | Hiển thị nhiệm vụ thực tế hôm nay của cán bộ từ D1. | `/api/staff/tasks` 404, nuốt lỗi và sinh dữ liệu giả với khoảng cách và điểm rủi ro ngẫu nhiên. | `GET /api/staff/tasks` | Đọc bảng `tasks` và `cases`. | 🚨 **BROKEN / MOCK FALLBACK** |
| `TasksListPage.jsx` | Nút "Lịch tuần" | Mở modal hoặc chuyển trang xem lịch công tác tuần. | `onClick={() => alert('Mở lịch công tác tuần')}`. | Không có | Không | 🚨 **FAKE ALERT** |
| `TasksListPage.jsx` | Đổi tab / Lọc / Phân trang | Tải danh sách nhiệm vụ theo tiêu chí từ D1. | Bị 404 trên Worker do endpoint chưa được mount vào Worker router. | `GET /api/staff/tasks/list` | Đọc `tasks`. | 🚨 **404 BROKEN ROUTE** |
| `TasksListPage.jsx` | Tạo nhiệm vụ mới | Lưu nhiệm vụ mới vào bảng `tasks` của D1. | Bị 404 trên Worker. | `POST /api/staff/tasks/create` | Ghi `tasks`. | 🚨 **404 BROKEN ROUTE** |
| `TaskDetailPage.jsx` | Lưu checklist 10 tiêu chí | Cập nhật trạng thái từng tiêu chí vào CSDL D1. | Bị 404 trên Worker. | `PUT /api/staff/tasks/:id/checklist` | Ghi `tasks.checklist_data`. | 🚨 **404 BROKEN ROUTE** |
| `TaskDetailPage.jsx` | Lưu ảnh minh chứng | Tải ảnh lên R2, ghi băm SHA-256 vào bảng `evidences` D1. | Bị 404 trên Worker. | `POST /api/staff/tasks/:id/evidence` | Ghi `evidences`. | 🚨 **404 BROKEN ROUTE** |
| `TaskDetailPage.jsx` | Hoàn thành nhiệm vụ | Đổi trạng thái nhiệm vụ `COMPLETED`, đồng bộ hồ sơ `cases`. | Bị 404 trên Worker. | `POST /api/staff/tasks/:id/complete` | Ghi `tasks` và `cases`. | 🚨 **404 BROKEN ROUTE** |
| `FieldChecklistPage.jsx` | Nút "Tiếp tục: Chụp bằng chứng" | Lưu tiến độ kiểm tra hiện trường vào D1. | Chỉ lưu vào `localStorage` (`inspection_checklist_${id}`). | Chưa gọi API | Không lưu D1 | ⚠️ **LOCALSTORAGE STUB** |
| `FieldEvidencePage.jsx` | Nút "Ghi âm ghi chú" (Mic) | Chuyển giọng nói tiếng Việt thành văn bản. | Nếu trình duyệt không hỗ trợ, chạy `setTimeout` giả lập điền văn bản cố định. | Không có | Không | 🚨 **SIMULATION STUB** |
| `FieldEvidencePage.jsx` | Nút "Tiếp tục: Kết luận" | Lưu danh sách ảnh và băm SHA-256 vào D1. | Chỉ lưu vào `localStorage` (`inspection_evidence_${id}`). | Chưa gọi `/api/upload` | Không lưu D1 | ⚠️ **LOCALSTORAGE STUB** |
| `FieldConclusionPage.jsx` | Nút "Lưu kết luận kiểm tra" | Cập nhật hồ sơ vụ việc, giao việc nhà thầu và tạo audit log trong D1. | Gọi `PATCH /cases/${taskId}` (sai ID), catch nuốt lỗi rồi `alert` thành công giả. | `PATCH /api/cases/:id` | Thất bại do 404 nhưng người dùng vẫn thấy alert thành công. | 🚨 **FAKE SUCCESS ALERT** |
| `SitesListPage.jsx` | Nút "Mẫu Excel" | Tải file mẫu nhập liệu công trình Excel. | `onClick={() => alert('Mẫu Excel nhập danh sách...')}`. | Không có | Không | 🚨 **FAKE ALERT** |
| `SitesListPage.jsx` | Nút "Xuất dữ liệu" | Xuất file danh sách công trình CSV/Excel. | `onClick={() => alert('Đang xuất danh sách...')}`. | Không có | Không | 🚨 **FAKE ALERT** |
| `SiteDetailPage.jsx` | Nút "Xem biên bản" | Mở nhiệm vụ kiểm tra hoặc biên bản tương ứng. | `onClick={() => alert(`Xem biên bản ${insp.id}`)}`. | Không có | Không | 🚨 **FAKE ALERT** |
| `SiteDetailPage.jsx` | Nút "Tạo quyết định mới" | Chuyển sang Document Studio soạn thảo văn bản Nghị định 30. | `onClick={() => alert('Tạo quyết định / văn bản mới')}`. | Không có | Không | 🚨 **FAKE ALERT** |
| `SiteDetailPage.jsx` | Nút "Xem văn bản" | Mở bản xem trước văn bản pháp lý. | `onClick={() => alert(`Xem văn bản ${doc.id}`)}`. | Không có | Không | 🚨 **FAKE ALERT** |
| `StaffAssignmentPage.jsx` | Nút "Xác nhận phân công" | Gán cán bộ thanh tra vào hồ sơ và cập nhật `IN_PROGRESS` trong D1. | Trong khối catch, hiển thị `alert('Phân công thành công (phiên demo)')`. | `PATCH /api/cases/:id` | Báo thành công giả khi backend lỗi. | 🚨 **FAKE SUCCESS ALERT** |
| `CaseDetailPage.jsx` | Bảng việc cần làm (Dòng 626) | Hiển thị các công việc từ D1. | Fallback hardcode 3 công việc mẫu nếu thiếu dữ liệu. | `GET /api/cases/:id` | Đọc `cases`. | ⚠️ **MOCK FALLBACK** |
| `ContractorCompliancePage.jsx` | Tải dữ liệu trang | Hiển thị tỷ lệ tuân thủ SLA, số đợt kiểm tra và lịch sử khắc phục thực tế của nhà thầu. | 100% dữ liệu cứng tĩnh trong mã nguồn, không gọi bất kỳ API nào. | Không có | Không | 🚨 **100% STATIC MOCK** |
| `CommunityObservePage.jsx` | Nút "Gửi quan sát hiện trường" | Lưu ghi nhận vào D1, cộng giờ tình nguyện. | Dùng `.catch(() => null)` và `setSuccess(true); // Graceful fallback` khi thất bại. | `POST /api/complaints` | Không ghi nhận khi lỗi nhưng vẫn báo cộng điểm. | 🚨 **FAKE SUCCESS** |
| `CommunityMissionsPage.jsx` | Tải trang & nhận nhiệm vụ | Lấy danh sách chiến dịch đang mở từ D1, cho phép đăng ký tham gia. | 100% dữ liệu tĩnh trong mảng `COMMUNITY_MISSIONS`, nút bấm không lưu D1. | Chưa nối API | Không | 🚨 **100% STATIC MOCK** |
| `CommunityImpactPage.jsx` | Tải trang bảng tác động | Thống kê số liệu CLB và bảng thi đua thực tế từ D1. | 100% dữ liệu tĩnh trong mảng `COMMUNITY_CLUBS`, số liệu 18, 24, 680h hardcoded. | Chưa nối `/api/community/impact` | Không | 🚨 **100% STATIC MOCK** |
