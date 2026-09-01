# DUSTGUARD VN — LEGACY CODEBASE FREEZE SNAPSHOT

> **TRẠNG THÁI: ĐÃ ĐÓNG BĂNG (FROZEN)**
> 
> Thư mục này đại diện cho trạng thái snapshot của codebase trước đợt Clean Rebuild (theo đặc tả `DUSTGUARD_CLEAN_REBUILD_SPECS.md`).

---

## 1. Quy Tắc Bất Biến Với Thư Mục Legacy

1. **CHỈ ĐỌC & ĐỐI CHIẾU (READ-ONLY & REGRESSION REFERENCE)**:
   - Dùng để chạy regression tests và so sánh tính tương đương về nghiệp vụ (Parity Check).
2. **TUYỆT ĐỐI CẤM THÊM CODE MỚI VÀO ĐÂY**:
   - Mọi tính năng mới, route mới, UI mới, API mới bắt buộc phải được triển khai trong `apps/`, `packages/`, hoặc `infrastructure/`.
3. **CẤM IMPORT NGƯỢC (ZERO REVERSE IMPORTS)**:
   - Không một module nào trong `apps/` hoặc `packages/` được phép `import ... from 'legacy/...'` hoặc `from '../app/...'`.

---

## 2. Thông Tin Snapshot

- **Thời điểm đóng băng**: 2026-09-01
- **Mã commit cơ sở**: `cd523b7` (Citizen flow polish & health pass 100%)
- **Hệ thống chạy song song**: `app/` (Legacy monolithic client + worker) tiếp tục chạy cho đến khi toàn bộ 5 Vertical Slices mới được nghiệm thu hoàn tất.
