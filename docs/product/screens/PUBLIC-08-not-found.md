# PUB-08 — Trang Báo Lỗi 404 & Cổng Phục Hồi Thông Minh (404 Not Found & Recovery)

---

## 1. Screen Identity

| Thuộc tính | Giá trị SSOT |
|---|---|
| **Mã màn hình** | `PUB-08` |
| **Tên tiếng Việt** | Trang Không Tìm Thấy (Lỗi 404) & Cổng Phục Hồi Điều Hướng Thông Minh |
| **Tên tiếng Anh** | 404 Page Not Found & Role-Aware Smart Recovery Gateway |
| **Route URL** | `*` (Catch-all Fallback Route cho mọi đường dẫn không hợp lệ) |
| **Component Path** | `app/src/modules/public/NotFound.jsx` |
| **Layout** | Public Centered Card Layout (Thẻ căn giữa chiều dọc và ngang `min-h-[70vh]`, không gây vỡ giao diện chung) |
| **Quyền truy cập (Role)** | Mọi đối tượng (Khách vãng lai, Công dân, Cán bộ, Nhà thầu, Lãnh đạo) |
| **Trạng thái Production** | **ACTIVE** (Level 5 Production Coherent — Điều hướng thông minh theo Auth Role, Sáng màu không Glassmorphism) |

---

## 2. Mục Đích & Giá Trị Thực Tế tại Đô Thị Việt Nam

### 2.1. Giải quyết bài toán gì trong bối cảnh thực tế Việt Nam?
Trong quá trình vận hành hệ thống thông tin dân sự tại các đô thị như **Hà Nội** và **TP. Hồ Chí Minh**, người dân và cán bộ thường xuyên chia sẻ các liên kết hồ sơ qua các kênh:
- Nhóm Zalo khu dân cư / Ban quản trị chung cư (Vành đai 3, KĐT Ngoại Giao Đoàn, KĐT An Phú).
- Tin nhắn SMS thông báo tiến độ từ Cổng 1022 hoặc ứng dụng Công dân Thủ đô số iHanoi.
- Các đường dẫn rút gọn đính kèm trong biên bản kiểm tra hiện trường hoặc mã QR trên biển báo công trình.

**Các rủi ro thường gặp**:
1. **Rơi vào "ngõ cụt" (Dead End)**: Người dùng nhấp vào link cũ đã hết hạn, gõ sai địa chỉ URL trên điện thoại khi đang ở ngoài hiện trường nắng gió, hoặc phiên làm việc của cán bộ bị chuyển đổi.
2. **Mất dấu không gian làm việc**: Các trang 404 thông thường chỉ có một nút duy nhất là "Về trang chủ" `/`. Điều này gây ức chế lớn cho Cán bộ thanh tra hoặc Chỉ huy trưởng công trường, vì họ phải đăng nhập lại hoặc mất công bấm qua nhiều tầng menu để tìm lại bảng điều khiển tác nghiệp của mình.
3. **Thiếu lối thoát cứu hộ khẩn cấp**: Người dân đang muốn gửi phản ánh gấp về một vụ việc xe ben gây bụi mù mịt nhưng gặp lỗi 404 sẽ dễ dàng từ bỏ nếu không có đường dẫn khẩn cấp đưa họ vào ngay màn hình chụp ảnh camera.

### 2.2. Giá trị đột phá của Trang 404 DustGuard VN
- **Phục hồi thông minh theo vai trò (Role-Aware Recovery)**: Kiểm tra trạng thái xác thực `useAuth()` trong thời gian thực. Khi người dùng bấm `[Quay về trang chính]`, hệ thống tự động nhận diện quyền hạn:
  - Nếu là **Cán bộ thanh tra (`staff`)** $\rightarrow$ Đưa ngay về `/staff` (Bảng quản lý vụ việc).
  - Nếu là **Lãnh đạo / Ban Quản trị (`executive` / `admin`)** $\rightarrow$ Đưa về `/executive` (Trung tâm điều hành).
  - Nếu là **Nhà thầu xây dựng (`contractor`)** $\rightarrow$ Đưa về `/contractor` (Nhiệm vụ khắc phục).
  - Nếu là **Người dân (`citizen`)** $\rightarrow$ Đưa về `/citizen` (Cổng thông tin công dân).
  - Nếu là **Khách vãng lai chưa đăng nhập** $\rightarrow$ Đưa về Trang chủ `/`.
- **Cung cấp 3 lối tắt cứu hộ dân sự thiết thực nhất**: Cổng thông tin công dân, Gửi phản ánh khẩn cấp kèm định vị GPS và Tài liệu tiêu chuẩn kỹ thuật thiết bị IoT.
- **Thiết kế Civic High-Contrast thân thiện**: Nền kem sáng `#FDFBF7`, chữ đen mực rõ nét, biểu tượng tam giác cảnh báo màu đỏ son `#9F241F`, tuyệt đối không dùng glassmorphism gây lóa mắt ngoài trời.

### 2.3. Bảng so sánh Trang 404 thông thường vs DustGuard VN
| Tiêu chí | Trang 404 thông thường (Cũ) | Trang 404 của DustGuard VN (Mới & Đột phá) |
|---|---|---|
| **Điều hướng quay về** | Chỉ có 1 nút "Về trang chủ" `/` chung chung | Tự động phân tích Role để đưa về đúng Workspace tác nghiệp |
| **Gợi ý liên kết** | Để trống hoặc hiển thị dòng mã lỗi kỹ thuật khó hiểu | Gợi ý 3 liên kết dân sự thiết thực (Cổng dân, Báo cáo gấp, Hướng dẫn IoT) |
| **Cứu hộ khẩn cấp** | Không hỗ trợ gửi phản ánh | Nút tắt 1-chạm mở ngay Form phản ánh hiện trường 30s |
| **Giao diện & Tương phản** | Dễ bị nền tối/mờ làm khó đọc trên di động | Sáng màu, tương phản cao, thẻ bo góc 24px sang trọng, zero blur |

### 2.4. Quy tắc 10 Giây (10-Second Screen Rule)
Trong 10 giây đầu tiên:
1. Người dùng nhận biết ngay trạng thái: `404 Not Found` — `Không tìm thấy trang yêu cầu`.
2. Đọc nhanh 3 liên kết gợi ý trong khung kem nhạt.
3. Bấm ngay nút nổi bật `[Quay về trang chính]` để tiếp tục công việc của mình mà không bị gián đoạn.

---

## 3. Đối Tượng Người Dùng & Hành Trình Thao Tác (User Journey)

### 3.1. Chân dung người dùng gặp lỗi 404
1. **Chị Hoàng Mai (Cư dân KĐT An Phú, TP. Thủ Đức)**: Nhấp vào một liên kết chia sẻ trong nhóm Zalo cư dân nhưng đường dẫn bị thiếu ký tự $\rightarrow$ Màn hình 404 hiện ra $\rightarrow$ Bấm liên kết *"Gửi phản ánh khẩn cấp"* để mở form báo cáo vi phạm bụi ngay lập tức.
2. **Đồng chí Nguyễn Văn Tuấn (Cán bộ Thanh tra Môi trường Quận Cầu Giấy)**: Đang dùng máy tính bảng kiểm tra hiện trường tại đường Nguyễn Văn Huyên, mở link lưu tạm bị sai route $\rightarrow$ Bấm `[Quay về trang chính]` $\rightarrow$ Hệ thống tự động chuyển về `/staff` để đồng chí tiếp tục lập biên bản.

### 3.2. Sơ đồ luồng hành trình phục hồi thông minh (Recovery Journey Flow)

```text
[Người dùng truy cập đường dẫn không tồn tại (VD: /unknown-site-url)]
                                 │
                                 ▼
                [Màn hình 404 Not Found hiển thị]
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
 [Bấm "Quay về trang chính"]    [Bấm "Cổng công dân"]  [Bấm 1 trong 3 liên kết gợi ý]
         │                       │                       ├──> Cổng thông tin công dân (/citizen)
         ▼                       ▼                       ├──> Gửi phản ánh khẩn cấp (/citizen/report)
   Hệ thống kiểm tra             Chuyển tới /citizen     └──> Hướng dẫn thiết bị IoT (/docs/sensor-guide)
   User Role hiện tại:
         ├── Chưa đăng nhập (Guest) ───> Về Trang chủ (/)
         ├── Staff (Cán bộ) ───────────> Về Cổng Cán bộ (/staff)
         ├── Executive / Admin ────────> Về Trung tâm Điều hành (/executive)
         ├── Contractor (Nhà thầu) ────> Về Không gian Nhà thầu (/contractor)
         └── Citizen (Công dân) ───────> Về Cổng Công dân (/citizen)
```

---

## 4. Bố Cục Giao Diện & Wireframe ASCII Chi Tiết Từng Khối

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MAIN CONTAINER (min-h-[70vh] flex items-center justify-center px-4 py-12)                        │
│                                                                                                  │
│   ┌────────────────────────────────────────────────────────────────────────────────────────┐     │
│   │ THẺ TRUNG TÂM (w-full max-w-lg rounded-3xl border border-ink-900/10 bg-white p-6 sm:p-8)│     │
│   │                                                                                        │     │
│   │                       ┌───────────────────────┐                                        │     │
│   │                       │  [ ▲ Icon Cảnh Báo ]  │  (h-20 w-20 rounded-full bg-seal-50)   │     │
│   │                       │   Màu đỏ son #9F241F  │                                        │     │
│   │                       └───────────────────────┘                                        │     │
│   │                                                                                        │     │
│   │                   [ 404 NOT FOUND ] (Pill badge đỏ son)                                │     │
│   │                                                                                        │     │
│   │                   Không tìm thấy trang yêu cầu                                         │     │
│   │                                                                                        │     │
│   │         Đường dẫn bạn vừa truy cập không tồn tại hoặc đã được                          │     │
│   │         thay đổi cấu trúc trong hệ thống DustGuard VN.                                 │     │
│   │                                                                                        │     │
│   │       ┌────────────────────────────────────────────────────────────────────────┐       │     │
│   │       │ KHUNG GỢI Ý LIÊN KẾT NHANH (bg-cream-50 rounded-2xl p-4 border)        │       │     │
│   │       │ Gợi ý liên kết nhanh:                                                  │       │     │
│   │       │ • Cổng thông tin công dân - Tra cứu & gửi phản ánh                     │       │     │
│   │       │ • Gửi phản ánh khẩn cấp - Kèm tọa độ GIS & ảnh hiện trường             │       │     │
│   │       │ • Hướng dẫn thiết bị IoT - Cảm biến & tiêu chuẩn chống gian lận        │       │     │
│   │       └────────────────────────────────────────────────────────────────────────┘       │     │
│   │                                                                                        │     │
│   │       ┌────────────────────────────────────┬───────────────────────────────────┐       │     │
│   │       │ [ Quay về trang chính ]            │ [ Cổng công dân ]                 │       │     │
│   │       │ (Nền đen mực #231B14, chữ trắng)   │ (Nền trắng viền xám, chữ đen mực) │       │     │
│   │       │ Min height: 44px                   │ Min height: 44px                  │       │     │
│   │       └────────────────────────────────────┴───────────────────────────────────┘       │     │
│   │                                                                                        │     │
│   └────────────────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Dữ Liệu & State / API Contract

### 5.1. Context & Hook Dependencies
```javascript
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
```

### 5.2. Logic Phục Hồi Thông Minh Theo Vai Trò (`handleGoHome`)
```javascript
const NotFound = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoHome = () => {
    // Trường hợp 1: Khách vãng lai chưa đăng nhập -> Về Landing Page
    if (!user) {
      navigate('/');
      return;
    }

    // Trường hợp 2: Người dùng đã đăng nhập -> Điều hướng theo phân quyền RBAC
    const role = user.role;
    if (role === 'staff') {
      navigate('/staff');
    } else if (role === 'executive' || role === 'admin' || role === 'demo_admin') {
      navigate('/executive');
    } else if (role === 'contractor') {
      navigate('/contractor');
    } else {
      navigate('/citizen');
    }
  };

  // ...
};
```

### 5.3. Định Tuyến SSOT & Fallback Route
Trong tệp cấu hình định tuyến hệ thống (`routes.jsx`):
- Tuyến đường `path: "*"` được đặt ở cuối cùng của danh sách routes để bắt tất cả các request không khớp và render component `NotFound.jsx`.
- Link `/docs/sensor-guide` được tự động chuyển hướng (Redirect) về `/guide` thông qua router SSOT, ngăn chặn tình trạng đứt gãy liên kết tài liệu.

---

## 6. Hành Động Cốt Lõi (Core Actions & Interactions)

| Đối tượng giao diện | Nhãn nút / Liên kết | Màu sắc & Token | Kích thước Touch Target | Hành vi thực thi | Phân quyền |
|---|---|---|:---:|---|---|
| **Primary Action** | `[Quay về trang chính]` | Nền đen mực `bg-ink-900`, `!text-white`, bo góc `rounded-xl` | Chiều cao min $44\text{px}$, px-6, flex-1 | Kích hoạt `handleGoHome()` chuyển tới Workspace theo Role | Mọi đối tượng |
| **Secondary Action** | `[Cổng công dân]` | Nền trắng `bg-white`, viền xám `border-ink-900/15`, chữ đen mực | Chiều cao min $44\text{px}$, px-6, flex-1 | Điều hướng trực tiếp tới `/citizen` | Mọi đối tượng |
| **Gợi ý 1** | Link "Cổng thông tin công dân" | Chữ xanh `text-accent-700 hover:text-accent-900`, gạch chân | Chiều cao dòng chuẩn, dễ chạm | Điều hướng tới `/citizen` | Mọi đối tượng |
| **Gợi ý 2** | Link "Gửi phản ánh khẩn cấp" | Chữ xanh `text-accent-700 hover:text-accent-900`, gạch chân | Chiều cao dòng chuẩn, dễ chạm | Điều hướng tới `/citizen/report` | Mọi đối tượng |
| **Gợi ý 3** | Link "Hướng dẫn thiết bị IoT" | Chữ xanh `text-accent-700 hover:text-accent-900`, gạch chân | Chiều cao dòng chuẩn, dễ chạm | Điều hướng tới `/docs/sensor-guide` (tự động redirect `/guide`) | Mọi đối tượng |

---

## 7. Quy Chuẩn UI/UX & Responsive (Civic High-Contrast)

### 7.1. Bảng màu & Kiểu dáng (High-Contrast Civic Tech)
- **Nền tổng thể**: `#FDFBF7` (Màu kem công vụ sáng, dịu mắt ngoài trời).
- **Thẻ Card nội dung**: Nền trắng nguyên bản `#FFFFFF`, viền xám nhẹ `border-ink-900/10`, đổ bóng mềm `shadow-soft`.
- **Icon & Badge 404**: Màu đỏ son đậm `#9F241F` trên nền kem hồng `#FEF2F2` (`bg-seal-50`).
- **Chữ chính**: Màu mực sẫm `#231B14` (`text-ink-900`) bảo đảm tỷ lệ tương phản $\ge 7:1$ theo tiêu chuẩn WCAG AAA.
- **TUYỆT ĐỐI CẤM**: Không dùng `backdrop-blur-*`, không dùng nền trong suốt làm giảm độ tương phản của văn bản.

### 7.2. Responsive Viewports SSOT
- **Mobile (360px – 430px)**:
  - Thẻ chiếm toàn bộ chiều ngang màn hình (`w-full`) với padding `p-6`.
  - Cụm 2 nút hành động xếp chồng dọc (`flex-col`), mỗi nút chiếm trọn chiều rộng và có chiều cao tối thiểu $\ge 44\text{px}$ thuận tiện bấm bằng một tay.
- **Tablet & Laptop (768px – 1366px)**:
  - Thẻ giới hạn chiều rộng tối đa `max-w-lg` (512px) căn giữa hoàn hảo.
  - Cụm 2 nút hành động dàn hàng ngang (`flex-row`) cân đối.
- **Desktop lớn (1920px)**:
  - Bố cục trung tâm ổn định, khoảng cách lề trên dưới `py-12` thanh thoát.

---

## 8. Bẫy Lỗi Thường Gặp & Hướng Dẫn Kiểm Thử

### 8.1. Các bẫy lỗi cần phòng ngừa (Forensic Checklist)
1. **Lỗi Null Pointer khi User chưa đăng nhập**: Luôn kiểm tra `if (!user)` trước khi truy cập `user.role` trong hàm `handleGoHome` để tránh ứng dụng bị crash trắng (White Screen).
2. **Lỗi Đứt Gãy Liên Kết Tài Liệu**: Link `/docs/sensor-guide` phải luôn được định tuyến an toàn về `/guide` thông qua hệ thống Router SSOT.
3. **Lỗi Đè Màu Chữ Nút Bấm Chính**: Nút Primary bắt buộc khai báo `!text-white` để tránh bị CSS toàn cục ghi đè màu chữ đen trên nền đen khi tích hợp.

### 8.2. Lệnh kiểm thử nhanh trên PowerShell CLI (< 0.5s)
```powershell
# 1. Kiểm tra tính toàn vẹn của Router và Fallback Route (*)
node --test app/tests/landing-ssot-guard.test.js

# 2. Kiểm tra toàn bộ luồng Edge Routes và phản hồi 404 Problem Details
node --test app/tests/worker-full-edge-routes.test.js

# 3. Kiểm tra bảo mật và xác thực người dùng
node --test app/tests/auth-user-management-audit.test.js
```
