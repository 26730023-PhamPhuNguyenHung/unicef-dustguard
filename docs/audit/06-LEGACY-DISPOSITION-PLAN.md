# DUSTGUARD VN — AUDIT 06: LEGACY DISPOSITION & MIGRATION PLAN
## Kế Hoạch Định Đoạt Số Phận Module Cũ (Legacy Disposition) & Lộ Trình Chuyển Đổi

> **Mã tài liệu**: `DG-AUDIT-06-LEGACY-DISPOSITION-PLAN`  
> **Thời điểm kiểm toán**: 05/09/2026  
> **Mục tiêu**: Định đoạt dứt khoát số phận của từng module, router, trang và tệp mã nguồn kế thừa (`app/`), loại bỏ toàn bộ trạng thái mơ hồ UNKNOWN; vạch ra lộ trình chuyển đổi từng lát cắt dọc (Vertical Slice) để đảm bảo không làm gián đoạn hệ thống.

---

## 1. NGUYÊN TẮC CHUYỂN DỊCH (MIGRATION PRINCIPLES)

1. **`REUSE > MOVE > ADAPT > DELETE > REWRITE`**: Tối đa hóa tái sử dụng mã nguồn và kiểm thử sẵn có, chỉ xóa bỏ khi module mới đã thay thế hoàn toàn và có bằng chứng nghiệm thu thực tế.
2. **Không Big-Bang Rewrite**: Chuyển đổi theo từng lát cắt dọc nghiệp vụ (Vertical Slices: UI $\to$ API $\to$ Use Case $\to$ DB $\to$ Test).
3. **Tuyệt đối không để tồn tại trạng thái UNKNOWN**: Mọi module phải được gán 1 trong 6 nhãn:
   - **`KEEP`**: Giữ nguyên đang là thành phần chủ lực.
   - **`ADAPT`**: Điều chỉnh nhỏ để tích hợp vào kiến trúc mới.
   - **`MERGE`**: Hợp nhất chức năng vào module chuẩn tắc tương đương.
   - **`REDIRECT`**: Giữ URL cũ làm cầu nối chuyển hướng 301/React Navigate sang URL chuẩn mới.
   - **`DEPRECATE`**: Đánh dấu không khuyến nghị sử dụng, đóng băng code.
   - **`DELETE`**: Xóa bỏ mã rác, mã chết, component mồ côi (orphan).

---

## 2. BẢNG ĐỊNH ĐOẠT SỐ PHẬN MODULE CŨ (LEGACY DISPOSITION TABLE)

| Module / Thư mục cũ | Vai trò cũ | Năng lực nghiệp vụ | Quyết định (Decision) | Phân hệ / Chủ thể mới | Phụ thuộc chuyển dịch (Migration Dependency) |
|---|---|---|:---:|---|---|
| **`app/src/apps/citizen/`** | `citizen` | Gửi phản ánh, xem bản đồ, theo dõi vụ việc | **MERGE & REDIRECT** | `apps/web/src/pages/` (`/reports`, `/reports/new`, `/cases/:id`) | Đã hoàn thành 100% trong `apps/web`. Cấu hình redirect `/citizen/*` sang `/reports/*`. |
| **`app/src/apps/community/`** | `community` | Mạng lưới CLB, nhận nhiệm vụ khảo sát, điểm tình nguyện | **MERGE & REDIRECT** | `apps/web/src/pages/` (`/communities`, `/tasks`, `/contributions`) | Đã hoàn thành 100% trong `apps/web`. Cấu hình redirect `/community/*` sang `/tasks`. |
| **`app/src/apps/staff/pages/cases/`** | `staff` | Quản lý hồ sơ vụ việc thanh tra | **MERGE & REDIRECT** | `dustguard-operations/apps/web/src/pages/` (`/cases`, `/cases/:id`) | `dustguard-operations` có FTS5 Legal AI và cổng 4 điều kiện đóng hồ sơ vượt trội hơn. Chuyển hướng `/staff/cases` sang cổng Operations. |
| **`app/src/apps/staff/pages/today/`** | `staff` | Bàn làm việc di động 1 tay của cán bộ | **KEEP & ADAPT** | Tích hợp vào `dustguard-operations/apps/web/src/pages/FieldInspectionPage.tsx` | Giữ nguyên logic checklist 10 tiêu chí QCVN 18 để phục vụ cán bộ tác nghiệp ngoài nắng. |
| **`app/src/apps/staff/pages/tasks/`** | `staff` | Nhiệm vụ kiểm tra công trường | **MERGE** | `dustguard-operations/apps/web/src/pages/InspectionListPage.tsx` | Hợp nhất vào module `Inspections` của Side B. |
| **`app/src/apps/contractor/`** | `contractor` | Portal dành riêng cho nhà thầu | **DEPRECATE & REPLACE** | `dustguard-operations` Quick-Token Remediation (`/actions/:id/remediation`) | Xóa bỏ khái niệm portal đăng nhập riêng cho contractor; thay bằng link Quick-Token xác thực Geofence $\le 50\text{m}$. |
| **`app/src/apps/executive/`** | `executive` | Dashboard lãnh đạo, ký số duyệt báo cáo NĐ 30/2020 | **MERGE & ADAPT** | `dustguard-operations` (`/dashboard`, `/reports`) | Chuyển toàn bộ báo cáo tổng hợp sang Operations Dashboard. |
| **`app/src/apps/admin/`** | `admin` | Quản trị tài khoản và audit logs | **MERGE** | `apps/web/src/pages/Admin*` & `dustguard-operations/apps/web/src/pages/Admin*` | Phân quyền quản trị được chia đều cho 2 Side theo đúng phạm vi quản lý. |
| **`app/src/modules/documents/`** | Document Studio | Soạn thảo văn bản hành chính NĐ 30/2020 | **KEEP & ADAPT** | Tích hợp thành tính năng Export của Side B (`dustguard-operations/apps/web/src/pages/ReportsPage.tsx`) | Giữ lại bộ mẫu văn bản A4 và parser DOCX để xuất hồ sơ xử phạt vi phạm. |
| **`app/src/components/PolicyIntelligence/`** | Policy DB | Thư viện tra cứu luật môi trường | **DEPRECATE & REPLACE** | `dustguard-operations/apps/web/src/pages/LegalLibraryPage.tsx` | Thay thế hoàn toàn bằng thư viện SQLite FTS5 toàn văn của Side B. |

---

## 3. LỘ TRÌNH 5 LÁT CẮT DỌC (VERTICAL SLICE MIGRATION ROADMAP)

```
┌────────────────────────────────────────────────────────────────────────┐
│ SLICE 1: GHI NHẬN & XÁC THỰC CỘNG ĐỒNG (COMMUNITY INTAKE)             │
│ Citizen/Youth -> Report -> Media SHA-256 -> Confirmation -> Verified   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ SLICE 2: BÀN GIAO CÓ TRÁCH NHIỆM (INSTITUTIONAL HANDOFF)               │
│ Moderator Forward -> POST /api/integrations/community/cases (Idempotent)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ SLICE 3: ĐIỀU PHỐI & THANH TRA CÔNG VỤ (PROFESSIONAL ENFORCEMENT)     │
│ Supervisor Assign -> Staff Field Inspection (QCVN 18 Checklist)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ SLICE 4: KHẮC PHỤC NHÀ THẦU & NGHIỆM THU (REMEDIATION & CLOSURE GATE) │
│ Action Quick-Token -> Geofence ≤ 50m Proof -> 4-Condition Closure Gate │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ SLICE 5: ĐỒNG BỘ KẾT QUẢ & CÔNG NHẬN TÁC ĐỘNG (COMMUNITY IMPACT)      │
│ Operations Resolved -> Community Case Updated -> Youth Credit Issued   │
└────────────────────────────────────────────────────────────────────────┘
```

### Chi tiết các lát cắt:
- **Slice 1 (Đã hoàn thiện 100%)**: Luồng người dân nộp phản ánh tại `apps/web` (Port 3000), backend `apps/server` (Port 3001), lưu vào `data/dustguard-community.db`.
- **Slice 2 (Điểm kết nối cốt lõi)**: Kích hoạt webhook từ `apps/server` sang `dustguard-operations` khi Moderator chuyển case sang trạng thái `'forwarded'`.
- **Slice 3 (Đã hoàn thiện 100%)**: Cán bộ tiếp nhận case tại `dustguard-operations` (Port 3002), lập kế hoạch và chấm điểm 10 tiêu chí kiểm tra hiện trường.
- **Slice 4 (Đã hoàn thiện 100%)**: Ban hành lệnh khắc phục cho nhà thầu, xác thực Geofence 50m và kiểm soát 4 điều kiện đóng hồ sơ an toàn.
- **Slice 5 (Giai đoạn hoàn thiện)**: Khi Case đóng tại Side B, cập nhật thông báo về Side A để người dân và thanh niên nhìn thấy kết quả xử lý minh bạch.
