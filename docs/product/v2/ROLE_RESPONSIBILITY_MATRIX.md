# ROLE RESPONSIBILITY MATRIX (RACI) — DUSTGUARD VN V2
## Ma Trận Phân Quyền & Trách Nhiệm Giữa 5 Nhóm Tác Nhân

> **Quy ước RACI**:  
> - **R (Responsible)**: Người trực tiếp thực hiện hành động.  
> - **A (Accountable)**: Người chịu trách nhiệm phê duyệt / quyết định cuối cùng.  
> - **C (Consulted)**: Người được tham vấn / cung cấp dữ liệu bổ trợ.  
> - **I (Informed)**: Người nhận thông báo kết quả.

---

## 1. BẢNG PHÂN CÔNG TRÁCH NHIỆM THEO 7 BƯỚC VÒNG ĐỜI

| Bước Vòng Đời | Hành Động Cụ Thể | Public / Citizen | Staff (Hiện trường) | Contractor (Nhà thầu) | Admin (Điều phối) |
|---|---|:---:|:---:|:---:|:---:|
| **1. SIGNAL** | Ghi nhận phản ánh hiện trường (Ảnh, GPS, Danh mục) | **R** | C | - | **I** |
| | Cảm biến IoT truyền dữ liệu vượt ngưỡng | C | - | - | **I** |
| **2. TRIAGE** | Xem xét lý do cần chú ý (Trường học, PM2.5, Phản ánh) | I | C | - | **R / A** |
| | Khởi tạo Vụ việc mới (`Case`) từ Tín hiệu | - | - | - | **R / A** |
| **3. INSPECT** | Khảo sát thực địa, chụp ảnh Before & Checklist QCVN | - | **R** | I | **A** |
| | Gửi biên bản kiểm tra & đề xuất phương án xử lý | - | **R** | - | **A** |
| **4. DISPATCH** | Ban hành Yêu cầu khắc phục (Biện pháp + Hạn SLA 24h) | I | C | **I** | **R / A** |
| | Phân công đơn vị thi công phụ trách | - | - | **I** | **R / A** |
| **5. ACTION** | Triển khai dập bụi (Phun sương, quây lưới, quét đường) | - | - | **R** | I |
| | Chụp ảnh After có định vị Geofence & Nộp minh chứng | - | - | **R** | I |
| **6. VERIFY** | Tái kiểm thực địa sau 24h-48h & Đo lại PM2.5 | C | **R** | C | **A** |
| | Đánh giá Đạt chuẩn / Yêu cầu làm lại | - | **R** | I | **A** |
| **7. OUTCOME** | Duyệt đóng vụ việc & Ban hành kết luận | **I** | I | **I** | **R / A** |
| | Xuất biên bản A4 lưu trữ pháp lý / Báo cáo SLA | - | C | C | **R / A** |

---

## 2. MA TRẬN PHÂN QUYỀN TRUY CẬP DỮ LIỆU (DATA ACCESS MATRIX)

| Thực Thể Dữ Liệu | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|
| **Tín hiệu phản ánh cá nhân** | Toàn quyền (Tạo, Xem của mình) | Đọc | Không | Toàn quyền |
| **Bản đồ chất lượng không khí công khai** | Đọc | Đọc | Đọc | Đọc & Quản trị |
| **Nhiệm vụ khảo sát ca trực** | Không | Đọc & Cập nhật kết quả | Không | Toàn quyền (Giao việc) |
| **Lệnh khắc phục môi trường** | Xem trạng thái tóm tắt | Xem biên bản | Đọc & Nộp ảnh After | Toàn quyền |
| **Bằng chứng Before/After** | Xem ảnh đối chứng công khai | Chụp Before & Tái kiểm | Chụp After | Toàn quyền kiểm toán |
| **Checklist 10 tiêu chuẩn QCVN 18** | Không | Đánh giá thực địa | Xem các mục chưa đạt | Xem & Phê duyệt |
| **Biên bản A4 chuẩn NĐ 30/2020** | Không | Xem nháp | Xem bản bàn giao | Ký duyệt & Xuất PDF/Word |
| **Quản trị người dùng & Ngưỡng SLA** | Không | Không | Không | Toàn quyền |
