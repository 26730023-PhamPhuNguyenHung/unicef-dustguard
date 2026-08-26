# SSOT TIMELINE & GIT COMMIT TRACEABILITY MATRIX

> **Mục đích**: Lưu giữ mốc thời gian phát triển (Timeline), gắn kết trực tiếp với các Git Commits và mốc kiểm thử để đảm bảo tính minh bạch, truy xuất nguồn gốc 100% (Traceability).

---

## 📅 Timeline & Commit Log

| Mốc Thời Gian | Commit Hash | Phạm Vi / Scope | Mô Tả Thay Đổi & Giá Trị Nghiệp Vụ | Trạng Thái Kiểm Thử |
|---|---|---|---|---|
| **2026-08-26** | `16b23ae` | `chore(submodule)` | Đồng bộ con trỏ `app` với `dev.db` và schema mới nhất | 25/25 Pass |
| **2026-08-26** | `ffdf46d` | `feat(executive-map-ssot)` | Tái cấu trúc Executive Command Center & Spatial Map SSoT toàn diện trên tất cả các portals | 43/43 Pass |
| **2026-08-26** | `335949d` | `feat(staff)` | Di chuyển Staff portal sang SpatialMap SSOT chung và hợp nhất Priority Queue | 43/43 Pass |
| **2026-08-26** | `cc88661` | `feat(spatial)` | Xây dựng Canonical WGS84 spatial adapter, D1 schema indexes & test suite 6/6 pass | 43/43 Pass |
| **2026-08-26** | `6f934d6` | `docs(qa)` | Cập nhật Active Context và Lessons Learned cho Subagent Fix 10 | Docs Updated |
| **2026-08-26** | `0c94c6a` | `feat(domain)` | Chuẩn hóa Dust Risk Engine và cơ chế Zero-IoT Resilience (chia trọng số 90%) | 38/38 Pass |
| **2026-08-26** | `a34f286` | `chore(subagent-09)` | Dọn dẹp map tàn dư và xóa bỏ 100% fake mock data trong catch blocks | 42/42 Pass |
| **2026-08-26** | `f158371` | `fix(executive)` | Chuẩn hóa Operations API với truy vấn D1 SQL thực tế và clean DTOs | 40/40 Pass |
| **2026-08-26** | `6c19be6` | `fix(dev-runner)` | Khắc phục lỗi spawn EINVAL trên Windows PowerShell và lọc target D1 audit | 40/40 Pass |
| **2026-08-26** | `ab76876` | `docs(lessons)` | Bổ sung quy chuẩn Community Portal và Tín chỉ ngoại khóa thanh niên (20h = 4.0 tín chỉ) | Docs Updated |
| **2026-08-26** | `c61544d` | `feat(contractor)` | Cập nhật Contractor Portal với kiểm tra Geofence 50m và quy trình nghiệm thu Before/After | 40/40 Pass |
| **2026-08-26** | `cb1bbef` | `feat(executive)` | Audit Executive Dashboard & Spatial GIS Map Hub theo chuẩn Phường/Xã và ký duyệt số D1 | 40/40 Pass |
| **2026-08-26** | `010bc2e` | `chore(cron)` | Vô hiệu hóa cron automation ngầm qua kill-switch để tiết kiệm Cloudflare Free Tier | Gate Pass |
| **2026-08-26** | `b7dac5d` | `feat(automation)` | Thêm toggles Active/Dry-run/Disabled và API điều khiển tự động hóa | Gate Pass |
| **2026-08-26** | `d47f36d` | `feat(automation)` | Tái thiết kế Free-first Cron & Soft SLA Engine với D1 bounded sweeps | Gate Pass |
| **2026-08-26** | `5ada340` | `feat(map)` | Đồng bộ layout single-screen viewport fit cho bản đồ GIS | 38/38 Pass |
| **2026-08-26** | `54d7d9f` | `feat(citizen)` | Cập nhật Citizen Portal tập trung trải nghiệm phản ánh và theo dõi minh chứng | 38/38 Pass |
| **2026-08-26** | `c23de93` | `feat(map)` | Tích hợp Unified Public Spatial Intelligence Hub vào DustGuard | 38/38 Pass |
| **2026-08-26** | `f557b9e` | `refactor(geo-domain)` | Chuẩn hóa đơn vị hành chính theo Phường/Xã (Ward SSOT) | 38/38 Pass |

---

## 🎯 Quy Trình Cập Nhật Timeline Sau Mỗi Feature
1. Viết code & kiểm thử đạt `verify:quick` 100%.
2. Cập nhật dòng mới vào `TIMELINE.md` với commit hash và mô tả ngắn gọn.
3. Commit qua git CLI với chuẩn Conventional Commits (`feat(...)`, `fix(...)`, `refactor(...)`, `docs(...)`).
