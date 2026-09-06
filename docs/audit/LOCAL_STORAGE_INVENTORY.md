# DUSTGUARD VN — LOCAL STORAGE & CLIENT STORAGE INVENTORY

> **Mã tài liệu**: `DG-AUDIT-LOCAL-STORAGE-01`  
> **Thời điểm kiểm kê**: 06/09/2026  
> **Nguyên tắc**: **KHÔNG DÙNG LOCALSTORAGE LÀM CƠ SỞ DỮ LIỆU CHÍNH; CHỈ DÙNG CHO DRAFT CHƯA GỬI, TOKEN PHIÊN VÀ UI PREFERENCE.**

---

## 1. BẢNG KIỂM KÊ CHI TIẾT CÁC KHÓA (KEYS) CLIENT STORAGE TẠI RUNTIME

| Khóa (Storage Key) | Mục đích sử dụng | Phân hệ / Tệp sử dụng | Có chứa PII? | Thời gian sống (TTL) | Có thể xóa an toàn? | Đồng bộ Server? | Đánh giá rủi ro |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| **`dustguard_token`** | Lưu token xác thực phiên làm việc (Bearer JWT). | `apps/web/src/context/AuthContext.tsx`<br>`dustguard-operations/apps/web/src/context/AuthContext.tsx` | Không | Đến khi đăng xuất hoặc hết hạn | Có (User đăng xuất) | Xác thực trên từng request | **Thấp** (Token có hạn, xóa sạch khi logout). |
| **`dg-lang`** | Tùy chọn hiển thị ngôn ngữ người dùng (`vi` / `en`). | `apps/web/src/pages/LandingPage.tsx` | Không | Vĩnh viễn trên trình duyệt | Có (Tự fallback về `vi`) | Không | **Không rủi ro**. |
| **`dustguard_draft_citizen_report`** | Tự động lưu bản nháp biểu mẫu báo bụi công dân (chống mất dữ liệu khi lỡ tải lại trang). | `apps/web/src/pages/CreateReportPage.tsx` | Không (chỉ tọa độ & mô tả thô) | Đến khi người dùng gửi thành công hoặc bấm "Xóa nháp" | Có | Đồng bộ lên D1 khi bấm "Gửi phản ánh" | **Thấp** (Tự hủy ngay khi submit thành công). |
| **`dustguard_draft_remediation_${id}`** | Tự động lưu bản nháp nội dung giải trình và khắc phục vi phạm của đơn vị thi công. | `apps/web/src/pages/contractor/ContractorRemediationPage.tsx` | Không | Đến khi nhà thầu nộp báo cáo hoàn thành | Có | Đồng bộ lên Side B khi nộp báo cáo | **Thấp** (Tự hủy ngay khi submit thành công). |
| **`dustguard_draft_inspection_${id}`** | Tự động lưu bản nháp phiếu kiểm tra thực địa QCVN 18 của cán bộ thanh tra hiện trường. | `dustguard-operations/apps/web/src/pages/FieldInspectionPage.tsx` | Không | Đến khi cán bộ hoàn tất lập biên bản | Có | Đồng bộ lên D1 khi bấm Lưu biên bản | **Thấp** (Tự hủy ngay khi lưu biên bản). |
| **`dustguard_dev_user_id`** | Hỗ trợ chuyển đổi nhanh vai trò kiểm thử cục bộ trong môi trường dev. | `dustguard-operations/apps/web/src/context/AuthContext.tsx` | Không | Xóa ngay khi người dùng đăng nhập chính thức | Có | Không | **Thấp** (Bị xóa triệt để khi đăng nhập tài khoản thật). |

---

## 2. KẾT QUẢ RÀ SOÁT VÀ XỬ LÝ KHÓA CŨ (LEGACY STORAGE PURGE)

1. **Khóa trong thư mục legacy (`app/`)**:
   - Các khóa lịch sử như `dg_applied_citation`, `dg_case_draft_${siteId}`, `dg_citizen_my_reports` chỉ tồn tại trong phân hệ JSX cũ, **hoàn toàn không được tham chiếu hay nạp vào phân hệ TypeScript TSX 2 Phía mới (`apps/web` và `dustguard-operations/apps/web`)**.
2. **Cam kết phân định 4 tầng Storage**:
   - **Database (SQLite/D1)**: Nguồn chân lý duy nhất (SSOT) cho mọi dữ liệu nghiệp vụ, quan hệ, trạng thái và mốc thời gian.
   - **Object Storage (R2 / File Storage)**: Lưu trữ ảnh chụp hiện trường, tài liệu đính kèm, chứng chỉ số và biên bản PDF.
   - **LocalStorage**: Tuyệt đối không lưu trữ dữ liệu nghiệp vụ chính; chỉ lưu bản nháp tạm thời và token xác thực phiên.
   - **Memory**: Trạng thái hiển thị tức thời của các thành phần giao diện người dùng.
