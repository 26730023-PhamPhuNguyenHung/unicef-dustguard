# DUSTGUARD VN — TIMELINE & OPERATIONAL TRACEABILITY

> **SSOT Timeline & Git Commit History** | **Branch**: `master` | **Trạng thái**: Hoàn tất Master Consolidation

---

## 📅 Commit History & Milestones

| Thời gian | Mã Commit | Thông điệp Commit | Kết quả & Phạm vi tác động |
|---|:---:|---|---|
| **2026-09-02** | `HEAD` | `feat(full-flow): complete citizen feedback slider, executive ND30 signing & youth credits` | Hoàn tất toàn diện 100% 5 nhóm tính năng: (1) GIS Không gian & Tự động kích hoạt, (2) Khảo sát hiện trường 10 tiêu chí 1-click & Drawer, (3) Before/After Slider kéo mượt mà & Citizen Rating Dialog, (4) Trình ký & Ký số điện tử chuẩn Nghị định 30/2020/NĐ-CP kèm xuất DOCX/A4, (5) Bảng thi đua CLB & Chứng nhận Tín chỉ thanh niên ISO/IEC 18004. |
| **2026-09-02** | `2542ab0` | `chore(sync): sync citizen feedback loop and mobile inspection workflow` | Đồng bộ luồng phản hồi ý kiến người dân và khảo sát hiện trường 10 tiêu chí. |
| **2026-09-02** | `d1c07b9` | `chore(sync): sync mobile inspection 1-click flow into staff workspace` | Đồng bộ quy trình Mobile Inspection 10 tiêu chí vào workspace cán bộ thực địa. |
| **2026-09-02** | `e377770` | `feat(consolidation): streamline .agents to 5 master documents` | Tinh gọn toàn bộ thư mục `.agents` từ 71 file xuống 5 file cốt lõi chuẩn mực: `SSOT.md`, `RULES.md`, `HUMAN_CENTRIC_AUDIT.md`, `BUG_MEMORY.md`, `TIMELINE.md`. |
| **2026-09-02** | `ab39616` | `chore(sync): sync zero truncate fixes in staff dashboard` | Rà soát và gỡ bỏ triệt để class `truncate` trên tên công trình và địa chỉ tại thẻ cảnh báo khẩn cấp `StaffDashboardPage.jsx` theo `UI_RULES.md`. |
| **2026-09-02** | `41829ea` | `chore(sync): remove Zalo dependencies across workspace` | Gỡ bỏ 100% logic và từ khóa liên quan đến Zalo, chuẩn hóa sang liên kết nộp nhanh trực tiếp (Direct Web Link). |
| **2026-09-02** | `886ffce` | `chore(sync): sync remediation auto-trigger and spatial integration` | Tự động cập nhật Case sang `IN_PROGRESS` và kích hoạt nhiệm vụ tái kiểm tra hiện trường cho cán bộ khi nhà thầu nộp ảnh; tích hợp vùng đệm trường học vào `riskEngine.js`. |
| **2026-09-02** | `88cf744` | `feat(spatial): integrate spatial clustering engine into root repo` | Tích hợp thuật toán gom cụm không gian WGS84 (`clusterObservations`), vùng đệm nhạy cảm 200m và Point-in-Polygon ranh giới hành chính. |
| **2026-09-02** | `e88276a` | `chore(sync): update app submodule pointer after product pass` | Đồng bộ toàn bộ các cải tiến của đợt Professional + Human-Centric Product Pass vào app submodule pointer. |
| **2026-09-02** | `62004c8` | `feat(product-pass): complete Professional + Human-Centric product pass across 3-layer architecture` | Triển khai Kiến trúc 3 Lớp (Action -> Context -> Detail), Command Center 65/35 cho Staff, 4 Tabs chuẩn cho SiteDetailPage, Timeline trực quan cho CaseDetailPage, và Bảng điểm kép Dual-Score Matrix. |
| **2026-09-02** | `bf6e875` | `feat(human-centric): complete full 10-step human-centric simplification pass across all 4 roles` | Rút gọn Menu 4 vai trò, tối ưu luồng Báo bụi $\le 30$s, luồng kiểm tra hiện trường Mobile-first 1 tay và luồng nộp ảnh nhà thầu 1 màn hình. |

