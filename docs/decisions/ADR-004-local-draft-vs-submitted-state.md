# ADR-004: PHÂN ĐỊNH TRẠNG THÁI BẢN NHÁP (LOCAL DRAFT) VÀ DỮ LIỆU ĐÃ GỬI (SUBMITTED)

- **Trạng thái**: Đã phê duyệt (Approved)
- **Ngày quyết định**: 06/09/2026
- **Tác giả**: Trưởng nhóm Trải nghiệm người dùng (UX) DustGuard VN

---

## 1. Bối cảnh (Context)
Các biểu mẫu thực địa (như báo bụi của người dân, báo cáo giải trình của nhà thầu, phiếu thanh tra hiện trường) thường dài và đòi hỏi nhiều thông tin. Khi người dùng thao tác ngoài trời bằng điện thoại di động, sự cố mất mạng hoặc vô tình đóng trình duyệt có thể làm mất dữ liệu. Tuy nhiên, nếu lưu tạm thời mà không hiển thị rõ ràng, người dùng có thể nhầm lẫn rằng thông tin "đã được gửi tới cơ quan chức năng".

## 2. Quyết định (Decision)
1. Áp dụng cơ chế **Draft Autosave** với debounce 500ms vào `localStorage` cho toàn bộ các biểu mẫu dài:
   - `CreateReportPage.tsx` (`dustguard_draft_citizen_report`)
   - `ContractorRemediationPage.tsx` (`dustguard_draft_remediation_${id}`)
   - `FieldInspectionPage.tsx` (`dustguard_draft_inspection_${id}`)
2. Phân định rạch ròi 2 trạng thái trên giao diện:
   - Trạng thái 1: *"Đã lưu bản nháp trên thiết bị lúc HH:mm:ss"* (Kèm nút bấm Xóa nháp làm lại).
   - Trạng thái 2: *"Đã tiếp nhận vào hệ thống điều hành"* (Chỉ xuất hiện sau khi máy chủ phản hồi 200/201 OK).
3. Khi người dùng nộp thành công, hệ thống bắt buộc phải dọn dẹp bản nháp trên thiết bị (`localStorage.removeItem`).

## 3. Lý do lựa chọn (Why)
- Nâng cao trải nghiệm người dùng thực địa, chống thất thoát công sức.
- Ngăn chặn sự hiểu lầm pháp lý: Bản nháp trên máy chưa phát sinh trách nhiệm xử lý của cơ quan nhà nước.

## 4. Hệ quả (Consequences)
- Tích cực: 100% người dùng không bị mất dữ liệu khi gián đoạn kết nối.
- Cần kiểm soát: Dung lượng lưu trữ bản nháp phải nhỏ (< 50KB), không lưu file nhị phân ảnh thô vào `localStorage`.
