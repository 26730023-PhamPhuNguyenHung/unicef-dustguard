# Hệ Thống Quản Lý Lỗi & Khuyết Tật (Bug System) — DustGuard VN

Mọi lỗi nghiêm trọng phát hiện trong quá trình phát triển hoặc kiểm thử phải được lập hồ sơ tại thư mục này theo mẫu [`BUG_TEMPLATE.md`](file:///d:/07-Competitions-Hackathons/unicef-dustguard/.specify/bugs/BUG_TEMPLATE.md).

## Quy trình xử lý lỗi 7 bước:
```text
REPRODUCE → ISOLATE → ROOT CAUSE → SMALLEST SAFE FIX → FOCUSED TEST → REAL APP VERIFY → REGRESSION CHECK
```

Nguyên tắc bất di bất dịch: **Sửa nguyên nhân gốc rễ, tuyệt đối không che giấu triệu chứng (Fix root cause, not screenshot)**.
