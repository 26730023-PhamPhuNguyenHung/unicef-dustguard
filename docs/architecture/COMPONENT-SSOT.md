# COMPONENT-SSOT.md — Component Single Source of Truth Registry

> Tất cả các component trong hệ thống đều phải tuân thủ chuẩn Civic High-Contrast, không dùng Glassmorphism, touch target tối thiểu 44px, chữ đọc rõ ràng trên mọi độ phân giải.

---

## 🧱 1. Primitive UI Components

| Component | Canonical File | Props Chuẩn | Variants | Touch Target |
|---|---|---|---|---|
| **Button** | `src/shared/components/ui/Button.jsx` | `variant, size, isLoading, icon, children, disabled, onClick` | `primary` (seal red), `secondary` (teal), `outline`, `ghost`, `danger` | $\ge 44\text{px}$ |
| **Input** | `src/shared/components/ui/Input.jsx` | `label, error, helperText, leftIcon, rightIcon, required, disabled` | `default`, `error`, `disabled` | $\ge 44\text{px}$ |
| **Select** | `src/shared/components/ui/Select.jsx` | `label, options, value, onChange, error, placeholder, required` | `default`, `error` | $\ge 44\text{px}$ |
| **Textarea** | `src/shared/components/ui/Textarea.jsx` | `label, rows, error, helperText, required, disabled, value, onChange` | `default`, `error` | $\ge 44\text{px}$ |
| **StatusBadge** | `src/shared/components/ui/StatusBadge.jsx` | `status, label, variant, size, showDot` | `success` (teal), `warning` (amber), `danger` (red), `info` (blue), `neutral` | Auto |
| **Skeleton** | `src/shared/components/ui/Skeleton.jsx` | `className, variant (text/circle/rect)` | `shimmer`, `pulse` | N/A |

---

## 📦 2. Composite UI Components

| Component | Canonical File | Mô Tả Nghiệp Vụ & Chức Năng |
|---|---|---|
| **Card** | `src/shared/components/ui/Card.jsx` | Container bao bọc nội dung có viền sắc nét, nền kem sáng `#FFFFFF`, đổ bóng mềm `shadow-sm`, không có blur mờ. |
| **MetricCard** | `src/shared/components/ui/MetricCard.jsx` | Hiển thị chỉ số KPI (Số liệu to bản, nhãn rõ ràng, badge xu hướng tăng/giảm, icon ngữ cảnh, min-w-0 chống vỡ hạt). |
| **DataTable** | `src/shared/components/ui/DataTable.jsx` | Bảng dữ liệu chuẩn SSOT: Sticky header, Column min-width, không truncate nội dung quan trọng, Mobile card fallback. |
| **EmptyState** | `src/shared/components/ui/EmptyState.jsx` | Trạng thái rỗng chân thực (Icon minh họa, Tiêu đề, Mô tả thân thiện và nút hành động CTA). Không fake dữ liệu. |
| **LoadingState** | `src/shared/components/ui/LoadingState.jsx` | Vòng quay spinner mượt mà kèm thông điệp tải trang, hỗ trợ ARIA live role status. |
| **PageContainer** | `src/shared/components/PageContainer.jsx` | Wrapper chuẩn layout (max-w-7xl, px-4 sm:px-6 lg:px-8, chống tràn ngang overflow-x-hidden). |

---

## 🏛️ 3. Domain-Specific Components

| Component | Vị Trí File | Domain Nghiệp Vụ |
|---|---|---|
| **PriorityScoreCard** | `src/components/risk/PriorityScoreCard.jsx` | Hiển thị điểm ưu tiên 0-100 kèm các thẻ giải thích minh bạch (PM2.5, Trường học, Báo cáo dân, Lịch sử). |
| **EvidenceGallery** | `src/components/evidence/EvidenceGallery.jsx` | Bộ sưu tập ảnh bằng chứng có nhãn SHA-256 tamper-evident, đối chứng Before vs After. |
| **UploadZone** | `src/components/upload/UploadZone.jsx` | Vùng tải ảnh tự động nén < 300KB, xóa EXIF nhạy cảm và tính toán mã băm SHA-256. |
| **SpatialMap** | `src/components/map/SpatialMap.jsx` | Bản đồ địa không gian MapLibre 6 lớp (Sensors, Sites, Hotspots, Geofence trường học 300m, Boundaries). |
| **OperatorVerificationModal** | `src/modules/staff/components/OperatorVerificationModal.jsx` | Modal 4 kết quả thẩm tra hồ sơ của Điều phối viên. |
| **RegulationAssistantModal** | `src/modules/staff/components/RegulationAssistantModal.jsx` | Modal tra cứu nhanh quy chuẩn QCVN 05:2023, QCVN 18:2021, QĐ 48/2024. |
| **QRCodeSvg** | `src/shared/components/QRCodeSvg.jsx` | Mã QR ISO/IEC 18004 Vector SVG phục vụ xác thực tín chỉ và đối chứng vụ việc. |
