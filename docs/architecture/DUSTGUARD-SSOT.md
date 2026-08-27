# DUSTGUARD-SSOT.md — Master Architecture Single Source of Truth

> **DustGuard VN**: Nền tảng CivicTech giúp cộng đồng thanh thiếu niên và người dân ghi nhận, đối chứng và theo dõi các vấn đề môi trường (bụi công trình) bằng dữ liệu có cấu trúc; hỗ trợ thẩm tra, giám sát tuân thủ và chuyển giao minh bạch tới các kênh xử lý hiện hữu (1022, iHanoi).

---

## 🗺️ 1. Architecture SSOT Document Index
Hệ thống tài liệu kiến trúc chuẩn hoá được liên kết chặt chẽ:
1. 🧭 [**ROUTE-REGISTRY.md**](./ROUTE-REGISTRY.md) — Danh mục toàn bộ 121 route, actor, layout, auth & endpoint tương ứng.
2. 🌳 [**PAGE-COMPONENT-GRAPH.md**](./PAGE-COMPONENT-GRAPH.md) — Cây Component Tree cho từng trang, phân định Canonical Shared vs Domain-specific.
3. 📦 [**COMPONENT-SSOT.md**](./COMPONENT-SSOT.md) — Từ điển Component duy nhất (Primitives, Composite, Layout, Domain, Form, DataTable).
4. 🗄️ [**DATA-ENTITY-GRAPH.md**](./DATA-ENTITY-GRAPH.md) — Sơ đồ thực thể dữ liệu D1 SQLite (Mermaid ERD) và State Machines chuẩn.
5. 🔌 [**API-PAGE-MATRIX.md**](./API-PAGE-MATRIX.md) — Ma trận ánh xạ API Endpoints ➔ Pages ➔ Permissions ➔ D1 Tables.
6. 🛡️ [**CRUD-PERMISSION-MATRIX.md**](./CRUD-PERMISSION-MATRIX.md) — Ma trận phân quyền CRUD 5 vai trò (Public, Citizen, Operator/Staff, Contractor, Executive/Admin).
7. 🎨 [**DESIGN-SYSTEM.md**](./DESIGN-SYSTEM.md) — Design Tokens, Civic High-Contrast, Defensive CSS, Table SSOT, Mobile Guidelines.
8. 📊 [**AUDIT-STATUS.md**](./AUDIT-STATUS.md) — Bảng theo dõi tiến độ kiểm toán & chuẩn hoá từng route.

---

## 🏛️ 2. Core Architectural Pillars & Invariants
1. **D1 SQLite is Persistent SSOT**: Cơ sở dữ liệu Cloudflare D1 (`prisma/dev.db`, `env.DB`) là nguồn dữ liệu duy nhất. Không dùng localStorage làm database giả lập.
2. **Observation != Case**: Ghi nhận (Observation / Complaint) là phát hiện ban đầu từ hiện trường; Vụ việc (Case) là hồ sơ điều phối đa bên có vòng đời theo dõi dài hạn.
3. **Zero-IoT Resilience**: Nền tảng vận hành 100% khi không có cảm biến IoT (chuẩn hoá trọng số tính điểm ưu tiên `sum(score * w) / sum(w)`).
4. **AI is Assistant, Not Judge**: AI hỗ trợ chuẩn hoá thông tin, trích xuất dữ liệu ảnh, tóm tắt pháp lý và đề xuất thứ tự ưu tiên; không bao giờ tự ý áp đặt chế tài hành chính.
5. **Light Mode High-Contrast Civic Tech**: Nền kem sáng (`#FDFBF7`), chữ mực đậm (`#231b14`), xanh ngọc (`#0d6f64`), đỏ dấu mộc (`#9f241f`). Tuyệt đối **KHÔNG Glassmorphism** (`backdrop-blur-*`). Touch targets $\ge 44\text{px}$.
6. **One Concept = One Canonical Component**: Mỗi thành phần UI chỉ tồn tại một định nghĩa duy nhất tại `src/shared/components/` hoặc `src/components/`.

---

## 🔄 3. End-to-End Civic Action Loop
```text
[Công dân / TNV] ➔ Gửi ảnh GPS (Hash SHA-256) ➔ [Hàng đợi Thẩm tra Staff] ➔ Xác minh 4 kết quả
                                                         │
       ┌─────────────────────────────────────────────────┴───────────────────────────────┐
       ▼                                                                                 ▼
[Tạo Case Theo Dõi] ➔ [Cổng Nhà Thầu Khắc Phục (Geofence <= 50m)] ➔ [Đối Chứng Before/After] ➔ [Chuyển Giao 1022 / iHanoi]
```
