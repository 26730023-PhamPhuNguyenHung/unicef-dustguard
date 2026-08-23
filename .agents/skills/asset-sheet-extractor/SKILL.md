---
name: asset-sheet-extractor
description: Quy trình chuẩn trích xuất, khử nền lossless (bảo toàn 100% mảng đặc bên trong, chống rỗng nét/vỡ hạt) và tổ chức thư viện asset độc lập từ các reference sheets; phân định rõ giữa image asset tĩnh và UI components (Text logo, Button, Metric chip).
---

# Asset Sheet Extractor — Lossless UI & Graphic Asset Extraction Skill

Skill này hướng dẫn quy trình trích xuất tài nguyên đồ họa (illustrations, icons, patterns, ornaments, connectors, charts, badges) từ các tấm sheet ảnh tổng hợp (reference sheets) sang các asset độc lập, chuẩn web, không bị vỡ hạt, không bị rỗng lòng nhân vật, và phân định rõ ràng giữa file ảnh tĩnh với code UI components.

---

## 1. Nguyên Tắc Cốt Lõi (Invariants)

1. **Lossless Alpha Matting (Không làm rỗng ruột nhân vật)**:
   - Nền cần khử là nền **bên ngoài** bao quanh asset (Outer Canvas Background).
   - Tuyệt đối **KHÔNG** dùng công thức toán khử màu toàn cục trên mọi pixel khiến lòng áo, khuôn mặt, mảng nhà, màn hình máy tính hay lòng icon bị rỗng hoặc trong suốt nhầm.
   - Sử dụng **Connected Components / Floodfill từ 4 cạnh viền** để chỉ tách lớp nền ngoài cùng.

2. **Chống gắt nét và nhiễu viền (Anti-Sharpening & Anti-Fringing)**:
   - Tuyệt đối **KHÔNG** chia giá trị RGB cho alpha nhỏ (`(arr - (1-a)*bg)/a`) vì gây bùng nổ nhiễu hạt và răng cưa viền.
   - Giữ nguyên 100% giá trị RGB gốc của artwork, chỉ áp dụng chuyển tiếp mờ dần tuyến tính (linear alpha fade) ở vùng rìa tiếp giáp (3px – 20px delta).

3. **Phân Định Image Asset vs UI Component**:
   - **Lưu thành Image Asset (.webp / .png / .svg)**: Hình minh họa (people, scenes, cities, devices), Icon đơn, Pattern, Dải sóng (waves), Dividers, Connectors, Biểu đồ tĩnh.
   - **Tạo thành React/HTML/CSS Component**: Logo chữ (Wordmark), Nút bấm (CTA Buttons có text/icon), Thẻ chỉ số (Metric Chip Cards). Không bake text động vào file ảnh bitmap.

4. **Padding & Bounding Box**:
   - Luôn chừa padding an toàn (3px - 5px) xung quanh artwork để không bị cắt cụt viền.

---

## 2. Quy Trình 5 Bước Thực Hiện

### Bước 1: Đo đạc & Lập lưới tọa độ (Measurement Grid)
Tạo ảnh lưới đo 50px / 100px trên ảnh sheet để xác định tọa độ chính xác của từng vùng / card:

```python
import cv2

def make_grid(img_path, out_path):
    img = cv2.imread(img_path)
    h, w = img.shape[:2]
    dbg = img.copy()
    for x in range(0, w, 50):
        color = (0, 0, 255) if x % 100 == 0 else (220, 220, 220)
        cv2.line(dbg, (x, 0), (x, h), color, 1 if x % 100 != 0 else 2)
        if x % 100 == 0:
            cv2.putText(dbg, str(x), (x + 2, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)
    for y in range(0, h, 50):
        color = (0, 0, 255) if y % 100 == 0 else (220, 220, 220)
        cv2.line(dbg, (0, y), (w, y), color, 1 if y % 100 != 0 else 2)
        if y % 100 == 0:
            cv2.putText(dbg, str(y), (5, y + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)
    cv2.imwrite(out_path, dbg)
```

---

### Bước 2: Thuật toán khử nền Lossless (Outer-Connected Alpha Matting)

```python
import cv2
import numpy as np
from PIL import Image
from scipy.ndimage import label

def clean_alpha_extract(bgr_img, bg_tol=18.0, low_tol=3.0, pad=4):
    """
    Khử nền mượt mà:
    - Tìm màu nền thực tế từ 4 cạnh viền.
    - Tìm vùng nền ngoài cùng thông qua connected components tiếp giáp viền.
    - Giữ nguyên alpha=255 và RGB gốc cho mọi mảng bên trong.
    - Chuyển tiếp alpha mượt mà ở rìa ngoài cùng.
    """
    h, w = bgr_img.shape[:2]
    
    # 1. Lấy mẫu màu nền từ viền
    borders = np.concatenate([
        bgr_img[0, :], bgr_img[-1, :], bgr_img[:, 0], bgr_img[:, -1]
    ], axis=0)
    bg_color = np.median(borders, axis=0)
    
    # 2. Khoảng cách màu tới nền
    diff = np.linalg.norm(bgr_img.astype(np.float32) - bg_color, axis=2)
    
    # 3. Phân vùng liên thông (chỉ lấy vùng chạm viền ngoài)
    is_bg_candidate = (diff < bg_tol)
    labeled, num_features = label(is_bg_candidate)
    
    border_labels = set(np.unique(labeled[0, :])) | \
                    set(np.unique(labeled[-1, :])) | \
                    set(np.unique(labeled[:, 0])) | \
                    set(np.unique(labeled[:, -1]))
    border_labels.discard(0)
    
    exterior_bg = np.isin(labeled, list(border_labels))
    
    # 4. Tạo kênh Alpha
    alpha = np.ones((h, w), dtype=np.float32) * 255.0
    
    # Nền ngoài tuyệt đối
    pure_bg = exterior_bg & (diff <= low_tol)
    alpha[pure_bg] = 0.0
    
    # Vùng viền chuyển tiếp (mịn viền)
    trans_zone = exterior_bg & (diff > low_tol) & (diff < bg_tol)
    alpha[trans_zone] = ((diff[trans_zone] - low_tol) / (bg_tol - low_tol)) * 255.0
    
    # 5. Đóng gói RGBA và Auto-crop padding
    rgb = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2RGB)
    rgba = np.dstack([rgb, np.clip(alpha, 0, 255).astype(np.uint8)])
    pil_img = Image.fromarray(rgba, mode="RGBA")
    
    bbox = pil_img.getbbox()
    if bbox:
        x0 = max(0, bbox[0] - pad)
        y0 = max(0, bbox[1] - pad)
        x1 = min(pil_img.width, bbox[2] + pad)
        y1 = min(pil_img.height, bbox[3] + pad)
        pil_img = pil_img.crop((x0, y0, x1, y1))
        
    return pil_img
```

---

### Bước 3: Cấu Trúc Thư Mục Chuẩn Hoá

Tổ chức các file xuất theo cây phân cấp nghiệp vụ rõ ràng:

```text
public/assets/<project_name>/
├── brand/          # Logo mark, biểu tượng thương hiệu
├── people/         # Minh họa con người, hành động, tình nguyện
├── community/      # Role badges (huy hiệu vai trò), đội nhóm
├── city/           # Phong cảnh đô thị, skyline, cầu, cây xanh
├── iot/            # Cảm biến, trạm quan trắc, kiosk hiển thị
├── icons/          # Thư viện icon đơn lẻ (chuẩn 24px - 64px)
├── patterns/       # Dải sóng, lưới hạt halftone, tia bụi, divider
├── connectors/     # Mũi tên, đường nối quy trình 1-5, loop
├── charts/         # Đồ thị cột, đường sparkline, donut charts
├── badges/         # Pill badges, status chips, radar badges
└── compositions/   # Banner kết hợp tổng thể (Skyline + Wave + IoT)
```

---

### Bước 4: Tạo Tự Động Contact Sheet & HTML Preview

Xuất file ảnh tổng hợp `assets-preview.png` và `assets-preview.html` để kiểm tra trực quan toàn bộ assets trong 1 khung nhìn:

- Mỗi asset nằm trong một ô (cell) có nền tương phản rõ ràng.
- Ghi rõ tên file `kebab-case`, kích thước pixel `(WxH)` và dung lượng file `(KB)`.

---

### Bước 5: Viết React Component Thay Cho UI Bitmaps

Khi gặp các element UI chứa text hoặc nút bấm, chuyển đổi thành component:

```jsx
// Ví dụ: MetricChipCard.jsx
export function MetricChipCard({ iconSrc, label, value, badgeText }) {
  return (
    <div className="inline-flex items-center gap-3 px-3.5 py-2.5 bg-white border border-ink-900/10 rounded-xl shadow-xs">
      <div className="w-9 h-9 rounded-lg bg-cream-50 flex items-center justify-center">
        <img src={iconSrc} alt="" width="20" height="20" className="object-contain" />
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold text-ink-500 uppercase">{label}</span>
        <span className="text-base font-black text-ink-900 leading-tight">{value}</span>
      </div>
      {badgeText && <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">{badgeText}</span>}
    </div>
  );
}
```

---

## 3. Checklist Kiểm Tra Chất Lượng (Quality Control)

- [ ] Các chi tiết màu trắng/vàng nhạt bên trong nhân vật (áo, mặt, mũ) có bị thủng nền không? *(Phải 100% đặc).*
- [ ] Có bị răng cưa / viền đỏ nhiễu hạt do công thức làm nét sai không? *(Phải mịn tự nhiên).*
- [ ] Không sót heading, số thứ tự, hay tên category từ sheet gốc lọt vào file crop.
- [ ] Các icon được lưu thành từng file riêng biệt, không gộp 2 icon vào 1 file.
- [ ] Mọi đường dẫn trong code frontend (`landingAssets.js` / JSX) đều tồn tại 100% trên ổ đĩa.
- [ ] Chạy kiểm thử hệ thống không bị gãy vỡ UI.
