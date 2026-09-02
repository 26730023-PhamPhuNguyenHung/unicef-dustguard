# DUSTGUARD — PRODUCT DISCOVERY & REQUIREMENTS DOCUMENT
## Codebase-First / Runtime-Verified / No-Assumption PDR

> Mục đích của tài liệu này:
> 1. Khám phá chính xác DustGuard hiện tại đang có gì.
> 2. Xác định đâu là tính năng thật, tính năng demo, tính năng chết và tính năng chưa nối.
> 3. Kiểm tra sự đồng nhất giữa Landing Page → các phân hệ → API → dữ liệu → trạng thái nghiệp vụ.
> 4. Sau khi hiểu hệ thống mới được phép đề xuất và triển khai thay đổi.
>
> Đây KHÔNG phải tài liệu mô tả trước kiến trúc hay feature.
> Repository và ứng dụng đang chạy mới là Source of Truth.

---

# 0. NGUYÊN TẮC TUYỆT ĐỐI

## 0.1. Không suy diễn

KHÔNG tự giả định:

- framework
- database
- ORM
- backend
- API architecture
- auth library
- hosting
- storage
- queue
- cron
- AI provider
- map provider
- route
- role
- permission
- schema
- table
- feature
- workflow
- trạng thái nghiệp vụ
- terminology
- component architecture

Mọi kết luận phải được tìm thấy từ:

1. code đang tồn tại
2. config thực tế
3. package/dependency thực tế
4. migration/schema thực tế
5. route thực tế
6. API handler thực tế
7. UI đang chạy
8. browser Network
9. database/runtime nếu project cho phép truy cập
10. test hiện hữu

Nếu chưa xác minh được:

ghi:

`UNKNOWN — NEED VERIFICATION`

Tuyệt đối không điền bằng phỏng đoán.

---

# 1. SOURCE OF TRUTH

Khi có mâu thuẫn, ưu tiên theo thứ tự sau.

## Level 1 — Runtime behavior

Ứng dụng thực sự làm gì khi chạy.

Kiểm tra bằng browser + DevTools.

## Level 2 — Backend / API / persistence

Dữ liệu thực sự được đọc, ghi, sửa, xóa ở đâu.

## Level 3 — Source code

Implementation thực tế.

## Level 4 — Automated tests

Các invariant đã được project kiểm thử.

## Level 5 — Documentation

README, markdown, docs, comments.

## Level 6 — UI text

Text đang hiển thị chỉ là một manh mối.

Không được coi một nút có mặt trên UI là bằng chứng feature đã tồn tại.

---

# 2. MỤC TIÊU CUỐI CÙNG

Sau quá trình discovery, hệ thống phải có một mô hình thống nhất:

```text
PRODUCT
   ↓
ROLE
   ↓
ROUTE
   ↓
SCREEN
   ↓
USER ACTION
   ↓
API / SERVICE
   ↓
BUSINESS RULE
   ↓
DATA
   ↓
STATE CHANGE
   ↓
AUDIT / HISTORY
   ↓
UPDATED UI
```

Agent phải tìm được chuỗi này cho từng nghiệp vụ quan trọng.

Nếu chuỗi bị đứt ở đâu thì đánh dấu chính xác ở đó.

---

# 3. STRUCTURE OF DISCOVERY DOCS

```text
docs/
├── PRODUCT_CURRENT_STATE.md
├── PRODUCT_GRAPH.md
├── PRODUCT_REALITY_MATRIX.md
├── PRODUCT_INVARIANTS.md
├── SYSTEM_AUDIT.md
│
├── discovery/
│   ├── CODEBASE_MAP.md
│   ├── TECH_STACK_ACTUAL.md
│   ├── ROUTE_INVENTORY.md
│   ├── ROLE_PERMISSION_MATRIX.md
│   ├── FEATURE_INVENTORY.md
│   ├── DATA_MODEL_ACTUAL.md
│   └── API_INVENTORY.md
│
└── audit/
    ├── CONTRACT_AUDIT.md
    ├── LANDING_PRODUCT_PARITY.md
    ├── TERMINOLOGY_MAP.md
    ├── DATA_PROVENANCE.md
    ├── CRUD_MATRIX.md
    ├── UI_CONSISTENCY.md
    └── BUG_BACKLOG.md
```
