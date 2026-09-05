# DUSTGUARD VN — FINAL DEFECT LOG (NHẬT KÝ LỖI & KHẮC PHỤC TRIỆT ĐỂ)
> **Ngày cập nhật**: 2026-09-05  
> **Nguyên tắc**: Sửa tận gốc nguyên nhân (Root Cause Fix), không che giấu lỗi, retest bằng kiểm thử thực tế.

---

## BẢNG GHI NHẬN LỖI ĐÃ PHÁT HIỆN & ĐÃ KHẮC PHỤC

| ID | Mức độ (Severity) | Phía (Side) | Tuyến đường (Route) | Tác tử (Actor) | Hành vi kỳ vọng (Expected) | Hành vi thực tế (Actual) | Nguyên nhân gốc rễ (Root Cause) | Tập tin đã sửa (Files) | Trạng thái (Status) |
|---|---|---|---|---|---|---|---|---|---|
| **DEF-01** | **P0** | Operations | `/login` | Staff / Admin | Đăng nhập thành công và điều hướng tức thời theo năng lực | Báo lỗi TypeScript trong IDE: `Property 'role' does not exist on type 'never'` | Interface `AuthContextType.login` trả về `Promise<void>` và hàm `login` không có lệnh `return res.user`. | `dustguard-operations/apps/web/src/context/AuthContext.tsx` | **FIXED** (tsc pass 100%) |
| **DEF-02** | **P1** | Community | `/reports/new` | Citizen / Member | Mã băm SHA-256 của file tải lên phải là mã băm nhị phân thật 100% | Sử dụng timestamp kết hợp `Math.random()` khi Web Crypto API lỗi hoặc bị chặn. | Thiếu bộ tính SHA-256 thuần (pure JS SHA-256 fallback) trong `crypto.ts`. | `apps/web/src/utils/crypto.ts` | **FIXED** (sha256Pure FIPS 180-4) |
| **DEF-03** | **P1** | Operations | `/cases/:id/legal` | Legal Reviewer | Không gian thẩm tra pháp lý công bố minh bạch bản chất tham khảo chuyên môn | Tồn tại biến `confidencePercent` giả lập `Math.round((confidence || 0.44) * 100)` | Mã nguồn sót biến dead code và thiếu disclaimer quy chế thẩm tra. | `dustguard-operations/apps/web/src/pages/LegalWorkspacePage.tsx` | **FIXED** (Disclaimer added, fake confidence removed) |
| **DEF-04** | **P0** | Community | `/moderator/cases` | Moderator | Bảng điều phối hiển thị đầy đủ danh sách các vụ việc theo 5 cột trạng thái | Cả 5 cột đều hiển thị 0 vụ việc mặc dù CSDL có nhiều vụ việc đang mở | `CaseCoordinationPage.tsx` bóc tách `res.cases` trong khi API `GET /api/cases` trả về mảng `data: cases` trực tiếp. | `apps/web/src/pages/CaseCoordinationPage.tsx` | **FIXED** (Array.isArray fallback) |
| **DEF-05** | **P0** | Community | `/moderator/cases` | Moderator | Modal cập nhật trạng thái gửi dữ liệu hợp lệ lên máy chủ | Máy chủ trả lỗi `400 Validation Error: newStatus is required` | `CaseCoordinationPage.tsx` gửi field `status` thay vì `newStatus` theo đúng `updateCaseStatusSchema`. | `apps/server/src/routes/moderator.routes.ts`, `apps/web/src/pages/CaseCoordinationPage.tsx` | **FIXED** (Contract alignment) |
| **DEF-06** | **P1** | Operations | `/iot` | Operations Staff | Giao diện mạng lưới cảm biến công bố đúng giai đoạn thử nghiệm phần cứng | Trang hiển thị như hệ thống đã phủ sóng toàn bộ hiện trường | Thiết bị ESP32 + APM2000 đang trong giai đoạn thử nghiệm chế tạo pilot. | `dustguard-operations/apps/web/src/pages/IotDevicesPage.tsx` | **FIXED** (Pilot badge added) |
