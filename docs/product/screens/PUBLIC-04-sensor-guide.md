# PUB-04 — Cẩm Nang Chế Tạo Trạm Đo Bụi Giá Rẻ 500k

## 1. SCREEN CONTRACT
- **Status**: `CURRENT`
- **Route**: `/guide` (và alias `/docs/sensor-guide`)
- **Primary Role**: CLB Maker / Kỹ sư IoT / Sinh viên kỹ thuật (`maker` / `public`)
- **Secondary Roles**: Người dân quan tâm đến thiết bị tự lắp
- **Current Component**: `SensorGuide.jsx` (`app/src/modules/public/SensorGuide.jsx`)
- **Layout**: Public Header & Footer
- **Primary Job**: Xem tài liệu hướng dẫn kỹ thuật nguồn mở (Open Source Hardware) để tự lắp ráp một trạm đo bụi chi phí thấp (chỉ 500.000 VNĐ) kết nối vào mạng lưới DustGuard.
- **Success Condition**: Người dùng xem được danh mục linh kiện (BOM), sơ đồ nối dây (Pinout) và tải được mã nguồn firmware nạp cho vi điều khiển ESP32.

---

## 2. WHY THIS SCREEN EXISTS
- Xóa bỏ rào cản chi phí hàng chục triệu đồng của các trạm đo thương mại: trao quyền cho cộng đồng sinh viên, câu lạc bộ sáng tạo và người dân tự chế tạo thiết bị đo bụi chuẩn, giá rẻ để mở rộng mạng lưới quan trắc không khí khắp các khu dân cư.

---

## 3. ENTRY / EXIT / NAVIGATION
- **Entry Points**: Menu "Cẩm nang trạm đo" trên Header, link từ footer của Landing Page (`/`).
- **Exit Points**:
  - Bấm "Tải mã nguồn Firmware" $\rightarrow$ Mở kho mã nguồn GitHub.
  - Bấm "Kết nối trạm của bạn" $\rightarrow$ Mở form đăng ký trạm đo mới.
- **Navigation Item**: Navigation Bar item "Cẩm nang 500k" (icon Cpu/Tool).

---

## 4. USER & PERMISSION CONTRACT
| Action | Public | Citizen | Staff | Contractor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xem toàn bộ cẩm nang hướng dẫn** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Tải sơ đồ mạch & mã nguồn** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Đăng ký trạm đo mới vào hệ thống**| ❌ | ✅ | ✅ | ❌ | ✅ |

---

## 5. PRIMARY USER FLOW
```text
Mở /guide 
→ Xem danh mục linh kiện cần mua (Tổng chi phí: ~500.000 VNĐ):
   1. Bo mạch ESP32 NodeMCU (~120k)
   2. Cảm biến bụi laser Plantower PMS7003 (~320k)
   3. Cảm biến nhiệt độ/độ ẩm DHT22 (~60k)
→ Xem sơ đồ nối dây chân GPIO trực quan (Pinout diagram)
→ Tải firmware nạp qua cáp USB
→ Bật nguồn và kết nối WiFi trạm đo vào DustGuard Network
```

---

## 6. INFORMATION HIERARCHY
1. **Guide Header**: Tiêu đề "Cẩm Nang Chế Tạo Trạm Đo Bụi 500k", nút "Tải mã nguồn GitHub".
2. **Bill of Materials (BOM Table)**: Bảng linh kiện chi tiết, mức giá thị trường và link tham khảo mua hàng tại Việt Nam.
3. **Wiring & Assembly Steps (Sơ Đồ Nối Dây)**:
   - Sơ đồ mạch điện tử rõ nét.
   - Hướng dẫn chế tạo vỏ hộp chống nước ngoài trời bằng ống nhựa PVC.
4. **Firmware Flashing Guide (Hướng Dẫn Nạp Code)**:
   - Các bước nạp code qua trình duyệt (Web Serial Flasher) không cần cài đặt phần mềm phức tạp.
5. **Community Showcase**: Hình ảnh các trạm đo do sinh viên và người dân tự chế tạo thực tế.

---

## 7. CONTENT CONTRACT
- **Page Title**: `Cẩm Nang Trạm Đo 500k` (≤ 5 từ)
- **Primary CTA**: `Tải mã nguồn` (≤ 3 từ)
- **Tính chính xác kỹ thuật**: Thông số chân cắm GPIO (RX2/TX2, VCC 5V, GND) phải hoàn toàn chính xác.

---

## 8. DATA CONTRACT
- **Data Source**: Tài liệu hướng dẫn kỹ thuật tĩnh (Static Open-Source Hardware Documentation).
- **Firmware Endpoint**: Tích hợp liên kết GitHub repository nguồn mở.

---

## 9. ACCEPTANCE CRITERIA
- [ ] Bảng danh mục linh kiện rõ ràng, giá cả thực tế tại thị trường Việt Nam.
- [ ] Sơ đồ nối dây hiển thị sắc nét trên cả màn hình di động và máy tính.
- [ ] Nút tải mã nguồn dẫn đúng đến repository mã nguồn mở.

---

## 10. IMPLEMENTATION STATUS
- **CURRENT**: Hướng dẫn chế tạo đầy đủ, bảng linh kiện BOM, sơ đồ nối dây, hướng dẫn cấu hình WiFi.
- **PARTIAL**: Trình nạp code trực tiếp qua Web Serial API trên trình duyệt.
- **PROPOSED**: Bản vẽ 3D in vỏ hộp nhựa (.STL) chia sẻ miễn phí cho máy in 3D.
