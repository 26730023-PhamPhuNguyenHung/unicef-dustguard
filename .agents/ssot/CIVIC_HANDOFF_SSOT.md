# CIVIC HANDOFF & TÍCH HỢP SSOT — DUSTGUARD VN

> **Chức danh SSOT**: Chuyên gia Civic Handoff & Tích hợp (Civic Handoff Specialist)  
> **Sứ mệnh cốt lõi**: Chuẩn hóa quy trình chuyển giao bằng chứng môi trường cộng đồng (Civic Handoff), định vị điểm tích hợp công vụ và tạo lập hồ sơ thực chứng có cấu trúc phục vụ đối thoại xây dựng giữa cộng đồng, nhà thầu và chính quyền địa phương.

---

## ⚡ 1. Ba Nguyên Tắc Cốt Lõi Tối Thượng (3 Core Invariants)

### 1.1. Loại Bỏ Tư Duy Áp Đặt & Chế Tài — Thay Bằng Ngôn Ngữ Thực Chứng Xây Dựng
* **Cấm tuyệt đối**: Cụm từ mang tính cưỡng chế, áp đặt quyền lực nhà nước như *"buộc công trình phải..."*, *"xử phạt chế tài..."*, *"quyết định xử lý..."*.
* **Cụm từ chuẩn hóa bắt buộc (Canonical Statement)**:
  > **"giúp cộng đồng tạo chuỗi bằng chứng trước–sau, vị trí và dòng thời gian rõ ràng; từ đó một vấn đề có thể được theo dõi tốt hơn và, khi cần, được chuyển tới đơn vị có trách nhiệm xử lý."**

### 1.2. Định Vị 1022 / iHanoi là ĐIỂM TÍCH HỢP (Integration Points)
* DustGuard **không thay thế** các hệ thống tiếp nhận hành chính chính thức của Nhà nước (Cổng Dịch vụ công 1022, Ứng dụng Công dân số iHanoi, Bộ phận Một cửa).
* 1022 và iHanoi là **ĐIỂM TÍCH HỢP kết nối case**: DustGuard cung cấp một gói dữ liệu thực chứng có cấu trúc (Structured Civic Dossier kèm mã truy xuất và mã băm SHA-256) để công dân gửi hoặc đính kèm vào 1022/iHanoi, giúp cán bộ tiếp nhận có ngay đầy đủ bằng chứng đối chứng trước–sau và vị trí chính xác mà không phải đi thẩm tra lại từ đầu.

### 1.3. Chuẩn Hóa Structured Civic Dossier Phục Vụ Đối Thoại Xây Dựng
* Hồ sơ không phải là "đơn khiếu nại gay gắt" hay "biên bản xử phạt hành chính", mà là **Hồ sơ Thực chứng Cộng đồng (Structured Civic Dossier)** chuẩn khổ A4 giúp các bên cùng ngồi lại đối thoại minh bạch trên cơ sở dữ liệu khách quan.

---

## 📄 2. Cấu Trúc Chuẩn 4 Khối Của Structured Civic Dossier (A4 Standard)

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│              BỘ HỒ SƠ THỰC CHỨNG CỘNG ĐỒNG (STRUCTURED CIVIC DOSSIER)           │
│           Phục vụ Đối thoại Xây dựng • Định vị Điểm Tích hợp 1022/iHanoi        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 1: BỐI CẢNH HIỆN TRƯỜNG & KHU VỰC NHẠY CẢM LÂN CẬN (CONTEXT & GEOFENCE)    │
│  • Mã hồ sơ duy nhất (SSOT Case Code: #CASE-YYYY-XXXX).                         │
│  • Tọa độ WGS84, địa chỉ thực tế, phường/quận/tỉnh thành.                       │
│  • Điểm ưu tiên rủi ro học đường (CPS 0–100) & khoảng cách điểm trường lân cận. │
│  • Tiêu chuẩn kỹ thuật môi trường tham chiếu (QCVN 05:2023/BTNM, QCVN 18).     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 2: CHUỖI MINH CHỨNG KỸ THUẬT SỐ TRƯỚC–SAU (TAMPER-EVIDENT EVIDENCE)        │
│  • Ảnh chụp hiện trường có tem thời gian ISO-8601 và tọa độ GPS thực địa.       │
│  • Mã băm toàn vẹn SHA-256 (64 ký tự hex) bảo đảm không bị chỉnh sửa giả mạo.   │
│  • Cặp ảnh đối chứng Trước (Before) và Sau khắc phục (After).                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 3: DÒNG THỜI GIAN THEO DÕI LẶP LẠI (FOLLOW-UP TIMELINE 24H/48H)            │
│  • Nhật ký kiểm tra lại định kỳ của CLB thanh niên và cộng đồng dân cư.         │
│  • Trạng thái chuyển biến thực tế: BETTER (Đã cải thiện) / UNCHANGED / WORSE.   │
│  • Ghi chú khách quan về chuyển biến tại công trình.                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 4: ĐỀ XUẤT KHẮC PHỤC XÂY DỰNG & ĐIỂM TÍCH HỢP CHUYỂN GIAO                  │
│  • Khuyến nghị kỹ thuật: Lưới chắn bụi, phun sương dập bụi, trạm rửa xe tải.    │
│  • Điểm tích hợp: Cổng 1022, Ứng dụng iHanoi, UBND Phường, Ban Quản lý Dự án.   │
│  • Mã niêm phong số xác thực toàn vẹn dữ liệu số (SHA-256 Stamp).               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 3. Giao Thức & Định Dạng Gói Tích Hợp (1022 & iHanoi Payload Schema)

Khi xuất gói dữ liệu gửi sang Tổng đài 1022 hoặc Ứng dụng iHanoi, hệ thống tạo payload JSON chuẩn:

```json
{
  "caseCode": "CASE-2026-0420",
  "source": "DustGuard VN Civic Platform",
  "integrationType": "1022_iHanoi_Connect",
  "role": "Integration point for structured evidence (does not replace official system)",
  "location": {
    "address": "Số 45 Đường Trần Hưng Đạo, đối diện cổng trường Tiểu học Dĩ An",
    "ward": "Phường Dĩ An",
    "city": "Bình Dương",
    "gpsCoordinates": "10.8983, 106.7724"
  },
  "summary": "Bụi thi công gần Trường Tiểu học Dĩ An trong giờ cao điểm học sinh đến trường",
  "constructivePurpose": "giúp cộng đồng tạo chuỗi bằng chứng trước–sau, vị trí và dòng thời gian rõ ràng; từ đó một vấn đề có thể được theo dõi tốt hơn và, khi cần, được chuyển tới đơn vị có trách nhiệm xử lý.",
  "priorityScore": 84,
  "evidenceCount": 4,
  "evidenceHashes": [
    {
      "title": "Xe tải chở đất đá ra vào cổng công trình",
      "sha256": "9f241f48a9b23c5e88d107a63456bcf291823d4e08c1a27e31b671a9382101fb",
      "gps": "10.8982, 106.7725"
    }
  ],
  "followUpRounds": 3,
  "verificationUrl": "https://dustguard.vn/community/cases/case_school_dian_01"
}
```

---

## 🔄 4. Máy Trạng Thái Hồ Sơ Chuyển Giao (Handoff State Machine)

Hồ sơ chuyển giao tuân thủ nghiêm ngặt máy trạng thái bất biến trong Cloudflare D1:

```text
PREPARED (Chuẩn bị hồ sơ)
   │
   ├──► SUBMITTED (Đã gửi tới Điểm Tích Hợp 1022 / iHanoi / Email UBND)
   │       │
   │       ├──► RECEIVED (Cơ quan / Đơn vị tiếp nhận hồ sơ)
   │       │       │
   │       │       ├──► ACKNOWLEDGED (Xác nhận phản hồi tiếp nhận)
   │       │       │       │
   │       │       │       ├──► ACTION_IN_PROGRESS (Đang phối hợp khắc phục hiện trường)
   │       │       │       │       │
   │       │       │       │       └──► COMPLETED (Khắc phục hoàn tất, đối chứng đạt chuẩn)
   │       │       │       │               │
   │       │       │       │               └──► CLOSED (Lưu trữ hồ sơ)
   │       │       │       │
   │       │       │       └──► REJECTED (Hồ sơ không thuộc phạm vi xử lý)
   │       │       │
   │       │       └──► CANCELLED (Hủy do đã tự giải quyết nội bộ)
   │       │
   │       └──► REJECTED / CANCELLED
   │
   └──► CANCELLED
```

---

## 📊 5. Ma Trận Kênh Chuyển Giao (Handoff Channels Matrix)

| Kênh Chuyển Giao | Mã Định Danh | Vai Trò & Điểm Tích Hợp | Thể Thức Tiếp Nhận |
|---|---|---|---|
| **Tổng đài 1022** | `PORTAL_1022` | **Điểm Tích Hợp**: Cổng Dịch vụ công & Tổng đài 1022 các tỉnh/thành | Web Portal / API Dispatch / Gói JSON |
| **Ứng dụng iHanoi** | `APP_IHANOI` | **Điểm Tích Hợp**: Cổng Công dân Thủ đô số iHanoi | App Deep-link / Đính kèm Case Code & SHA-256 |
| **Email Phối Hợp** | `EMAIL` | Kênh liên hệ công vụ tới UBND Phường & Tổ Môi trường địa bàn | Email A4 Structured Dossier kèm tệp đính kèm |
| **Bộ phận Một Cửa / Ban QLDA** | `MOT_CUA` | Bàn giao trực tiếp tại văn phòng tiếp dân hoặc Ban Chỉ huy công trường | Bản in A4 đối thoại xây dựng có mã QR tra cứu |
| **Đường dây nóng** | `HOTLINE` | Phản ánh nhanh trường hợp khẩn cấp có nguy cơ sụp đổ / bụi mù mịt | Cung cấp mã case để tra cứu ngay hiện trạng |

---

## 🧪 6. Tiêu Chuẩn Kiểm Thử Định Kỳ (Verification DoD)
1. **Targeted Unit Test**: `node --test app/tests/civic-handoff-integration.test.js` pass trong < 0.3s.
2. **Deterministic Hash**: Canonical packet sản sinh mã SHA-256 giống hệt nhau không phụ thuộc thứ tự key.
3. **No Coercive Words**: Tuyệt đối không chứa từ ngữ mang tính trừng phạt trong mọi template và giao diện.
4. **Integration Positioning**: 100% tài liệu và màn hình định vị rõ ràng 1022/iHanoi là Điểm Tích Hợp, không thay thế cơ quan nhà nước.
