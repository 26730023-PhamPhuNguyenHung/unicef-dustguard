# Contract Audit & Client/Server Normalization — DustGuard VN

Tất cả các tầng giao tiếp Client ↔ Edge Hono ↔ D1 SQLite đều được kiểm tra theo chuẩn Contract SSOT:

| Layer Boundary | Contract Expectation | Actual Payload Shape | Handling Strategy | Audit Status |
|---|---|---|---|---|
| **Staff API Dashboard** | Frontend expects `{ totalSites, activeCases, pendingAlerts, ... }` | Backend returns `{ data: { totalSites, activeCases, ... } }` | `staff-api.js` unwrap `data` và trả về safe defaults | `CONTRACT_OK` |
| **Sites Collection** | Frontend expects `Site[]` array | Backend returns `{ data: Site[], total, page }` | `request.js` / `staff-api.js` chuẩn hóa `data ?? []` | `CONTRACT_OK` |
| **Cases List & Detail** | Frontend expects `Case[]` và `CaseDetail` object | Backend returns `{ data: Case[] }` & `{ data: CaseDetail }` | `staff-api.js` unwrap an toàn, không để crash render | `CONTRACT_OK` |
| **Alerts Collection** | Frontend expects `Alert[]` array | Backend returns `{ data: Alert[], count }` | `staff-api.js` unwrap `data` về array, map risk level | `CONTRACT_OK` |
| **Contractor Tasks** | Frontend expects `Task[]` array | Backend returns `{ data: Task[], stats }` | `contractor-api.js` normalize `data.tasks ?? []` | `CONTRACT_OK` |
| **Youth Credits Stats** | Frontend expects `{ totalHours, credits, activities: [] }` | Backend returns `{ hours, credits, activities: [] }` | `youth-credits.js` normalize và tính toán deterministic | `CONTRACT_OK` |
| **Storage Uploads** | Frontend expects `{ url, key, hash }` | Backend returns `{ success: true, url, key, sha256_hash }` | `storage.routes.js` đồng bộ tên trường `hash` & `sha256_hash` | `CONTRACT_OK` |

## RFC 7807 Problem Details Standard:
- Mọi lỗi backend (400, 401, 403, 404, 500) trả về chuẩn RFC 7807:
  ```json
  {
    "type": "https://dustguard.vn/errors/not-found",
    "title": "Resource Not Found",
    "status": 404,
    "detail": "Không tìm thấy hồ sơ hoặc tài nguyên yêu cầu.",
    "instance": "/api/cases/99999"
  }
  ```
- Client layer (`request.js`) tự động bắt status $\ge 400$, trích xuất `detail` hiển thị Toast tiếng Việt, không để lộ crash technical stack trace lên UI.
