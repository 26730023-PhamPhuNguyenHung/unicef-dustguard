# DUSTGUARD VN — LESSONS LEARNED & TECHNICAL KNOWLEDGE BASE

> **Kho lưu trữ kinh nghiệm, bài học kiến trúc và phòng chống lỗi kỹ thuật (Anti-Regression)**  
> *Cập nhật sau mỗi chu trình phát triển tính năng mới thành công.*

---

## 📅 Bài học từ Dự án: DustGuard Operations (2026-09-05)

### 0. Final Production Hardening: Khép Vòng Chu Trình 2-Side & Thiết Lập Chốt Chặn Nghiệp Vụ Thực Tế
- **Vấn đề**:
  - Khi bóc tách API response, sự không thống nhất giữa việc trả về mảng trực tiếp `res.data = [...]` và việc frontend kỳ vọng đối tượng bọc `res.cases = [...]` dễ dẫn đến việc màn hình hiển thị rỗng (0 items) dù cơ sở dữ liệu có đầy đủ dữ liệu (Bug Kanban rỗng tại `CaseCoordinationPage.tsx`).
  - Sử dụng chuỗi giả lập `Math.random()` để fallback khi tính toán mã băm SHA-256 (tại `crypto.ts`) gây tổn hại nghiêm trọng đến tính liêm chính của bằng chứng số (evidence integrity).
  - Nguy cơ đóng khống hồ sơ trên giấy (Paper compliance): Nếu không có chốt chặn nghiệp vụ (Business Invariant Gate), cán bộ có thể đóng vụ việc trước khi có kết luận thẩm tra pháp lý hoặc trước khi nhà thầu thực sự khắc phục vi phạm.
- **Giải pháp chuẩn hóa**:
  1. **Nguyên tắc "Be Conservative in What You Send, Liberal in What You Accept"**:
     - Frontend phải luôn xử lý cả 2 trường hợp: `Array.isArray(res) ? res : res.cases || []`.
     - Backend schema validation phải chấp nhận cả tên trường cũ và mới (`newStatus` và `status`) để ngăn ngừa lỗi gãy luồng đột ngột.
  2. **Liêm chính Mật mã Tuyệt đối (Zero Pseudo-Randomness)**:
     - Triển khai thuật toán băm SHA-256 thuần (`sha256Pure`) chuẩn FIPS 180-4 để đảm bảo dù Web Crypto API có bị trình duyệt chặn, file tải lên vẫn luôn được tính mã băm từ mảng byte thật 100%.
  3. **Chốt Chặn Nghiệp Vụ Bắt Buộc (Business Invariant Gates)**:
     - Tại `cases.router.ts`: Chặn đứng hành động đóng hồ sơ nếu chưa có kết luận thẩm tra pháp lý chính thức (`status = 'REVIEWED'`) từ chuyên viên pháp chế và toàn bộ yêu cầu khắc phục chưa được nghiệm thu (`status = 'VERIFIED'`).

### 1. Migration 02: Cổng Đăng Nhập 2 Phía & Bảo Toàn Deep-Link Theo Năng Lực (Capabilities)
- **Vấn đề**:
  - Giao diện đăng nhập cũ hiển thị 4-5 nút chọn role cố định (`citizen`, `member`, `moderator`, `admin`), biến sản phẩm thành một tập hợp các app rời rạc thay vì một nền tảng thống nhất.
  - Khi người dùng truy cập một liên kết được chia sẻ (deep-link như `/reports/detail/123` hoặc `/tasks`), hệ thống cũ hoặc hiển thị trang Forbidden 403 ngay lập tức khi chưa đăng nhập, hoặc sau khi đăng nhập bị ép buộc quay về trang chủ dashboard mặc định, làm mất trắng ngữ cảnh công việc của người dùng.
  - Tư duy tạo một CSDL Auth dùng chung thứ ba (SSO giả mạo) thường bị cám dỗ nhưng sẽ làm vỡ ranh giới kiến trúc độc lập giữa phân hệ Civic công cộng và phân hệ Pháp lý nghiệp vụ nội bộ.
- **Giải pháp chuẩn hóa**:
  1. **Gateway Thông Minh (Product Gateway Pattern)**:
     - Trang `/login` chỉ đóng vai trò phân luồng thị giác giữa 2 không gian chính: Phía Cộng đồng (Side A) và Đơn vị Xử lý (Side B).
     - Không can thiệp hay gộp CSDL Auth: Side A tiếp tục sử dụng JWT từ `apps/server`, Side B sử dụng JWT/Session từ `dustguard-operations`.
  2. **Bảo Toàn Deep-Link & Phân Giải Năng Lực Chuẩn**:
     - Trong `ProtectedRoute`, phân biệt dứt khoát mã HTTP: Nếu chưa đăng nhập (401), điều hướng về `/login` kèm `state: { from: location }`. Chỉ hiển thị `<ForbiddenPage>` khi người dùng ĐÃ đăng nhập nhưng THIẾU năng lực thực thi.
     - Sau khi đăng nhập thành công, kiểm tra `requestedPath`: Nếu có URL deep-link hợp lệ, lập tức trả người dùng về đúng trang đó. Nếu không có, hàm `resolveCommunityHome()` hoặc `resolveOperationsHome()` sẽ phân giải trang đích tối ưu theo gói năng lực cao nhất mà tài khoản sở hữu.
  3. **Xóa Sổ Cổng Role-Picker**:
     - Nút đăng nhập nhanh (Quick Login) chỉ phục vụ môi trường kiểm thử/demo và được tổ chức theo cấp độ năng lực thực tế, không dùng để định nghĩa kiến trúc sản phẩm.

### 1. Không Đồng Nhất "Side" Với "Role" & Chuẩn Hóa Phân Quyền Theo Năng Lực (Capabilities)
- **Vấn đề**:
  - Codebase cũ bị nhầm lẫn nghiêm trọng giữa **Phía trải nghiệm sản phẩm (Product Side)** và **Vai trò người dùng (User Role)**, dẫn đến việc tạo ra 5-6 web apps riêng rẽ (`/citizen`, `/staff`, `/contractor`, `/executive`, `/community`, `/admin`).
  - Phân quyền kiểu cũ phụ thuộc vào kiểm tra chuỗi URL `isRoleAllowedForPath(role, path)` hoặc `if (user.role === 'staff')` rải rác khắp nơi, làm xuất hiện các cổng portal thừa thãi (như `/contractor/*` trong khi nhà thầu chỉ cần liên kết Quick-Token) và các route trùng lặp nặng nề (`/staff/cases` song song với `/cases`).
  - Dữ liệu bị phân mảnh: Một bên gọi là `complaints`, một bên gọi là `reports`; cán bộ đi kiểm tra thì gọi là `task` gây nhầm với nhiệm vụ của thanh niên tình nguyện.
- **Giải pháp chuẩn hóa**:
  1. **Tách bạch rõ rệt giữa Product Side và Capabilities**:
     - Hệ thống chỉ có **2 Phía (2 Sides)**: **Side A (Community)** và **Side B (Professional)**.
     - Role không phải là ứng dụng độc lập, mà là một **gói Năng lực (Bundle of Capabilities)**. Ví dụ: `staff` sở hữu `case:triage`, `inspection:create`, `action:create`...
     - Cấm tuyệt đối kiểm tra `role` cứng trên giao diện; mọi component/nút bấm đều kiểm tra qua `can('action:name')`.
  2. **Giao thức Bàn giao Có trách nhiệm (Institutional Handoff)**:
     - Không cố gộp 2 CSDL thành một monolith cồng kềnh; tách biệt `dustguard-community.db` (Public/Civic) và `dustguard-operations.db` (Nội bộ/Pháp lý).
     - Cầu nối duy nhất là endpoint webhook idempotent: `POST /api/integrations/community/cases` kèm mã băm SHA-256 payload hash để chống trùng lặp.
  3. **Phân định rõ ràng các cặp thực thể dễ nhầm lẫn**:
     - `Report != Case`: Phản ánh ban đầu của cá nhân người dân khác với Hồ sơ vụ việc được gom nhóm.
     - `Observation != Inspection`: Quan sát cảm quan của cộng đồng khác với Thanh tra công vụ theo 10 tiêu chuẩn QCVN 18/BXD của cán bộ.

### 1. Tinh Chỉnh Sắc Nét Section Thực Trạng ("Phản ánh không khó. Theo dõi đến kết quả mới khó.") (2026-09-05)
- **Vấn đề**:
  - Thẻ vấn đề bên trái trông bị mờ/disabled, văn bản chìm vào nền kem do thiếu container background riêng biệt, text phụ có độ tương phản quá thấp (`#475569`).
  - Tiêu đề dòng 2 bị áp màu xám slate (`#64748B`), làm yếu đi thông điệp cốt lõi và nhận diện thương hiệu màu đỏ DustGuard.
  - Animation GSAP entrance ban đầu nối tiếp qua timeline quá chậm (>1.2s), khiến trong quá trình cuộn nhanh, thẻ cuối cùng bị "kẹt" ở trạng thái tweening dở dang với opacity thấp, tạo cảm giác thẻ bị vô hiệu hóa có chủ ý.
- **Giải pháp chuẩn hóa**:
  1. **Tuyệt đối không dùng Opacity tổng thể để tạo phân cấp thị giác**:
     - Mọi card container duy trì `opacity: 1`.
     - Phân cấp được tạo bởi màu nền ngà ấm (`rgba(255, 255, 255, 0.90)` cho card 01 & 03; `#FFF9F6` cho card 02), viền nhẹ `rgba(145, 110, 90, 0.20)` và shadow ấm `0 10px 30px rgba(40,25,15,0.045)`.
     - Số hiệu đặt trong circular badge 32px nền trắng, số đỏ `#C72A20` font-mono đậm; icon đỏ trong hộp bo góc tinh tế.
     - Tiêu đề near-black `#15171C`, văn bản `#524A43` đảm bảo độ tương phản cao, đọc rõ ràng dưới mọi điều kiện ánh sáng.
  2. **Đồng bộ màu sắc thương hiệu Civic Red**:
     - Dòng 2 tiêu đề: `text-[#C72A20]` font-black, chặt chẽ với `tracking-[-0.035em]` và `leading-[1.04]`.
     - Màu xanh lá chỉ dùng duy nhất cho phản hồi thành công/nghiệm thu (bước 04 và thanh xác thực cuối), không biến thành màu chủ đạo thứ hai.
  3. **Kỷ luật GSAP Entrance Animation**:
     - Sử dụng `gsap.fromTo` với thời gian ngắn gọn (<0.45s) và stagger nhẹ (0.06s).
     - Luôn đính kèm `clearProps: 'transform,opacity'` trong callback hoàn tất tween để trả lại CSS thuần túy cho trình duyệt, chống hiện tượng inline opacity làm mờ phần tử vĩnh viễn.

### 1. Red-Led Civic Palette & High-Impact GSAP Live Case Engine (2026-09-05)
- **Vấn đề**:
  - Landing page bị cảm giác "dull gray / blue-gray" lạnh lẽo, corporate và generic do dùng quá nhiều màu xám slate (`#64748B`, `#475569`) ở tiêu đề dòng 2 ("Theo dõi đến kết quả mới khó"), làm suy yếu năng lượng của thương hiệu.
  - Animation GSAP ban đầu chỉ là fade-in/slide-up thông thường, thẻ hồ sơ nhìn như một card tĩnh được gán animation sau khi xong layout, thiếu concept "Live Case Engine" và không tạo được khoảnh khắc "wow".
  - Đường line nối và các phản ứng thị giác giữa các bước còn rời rạc.
- **Giải pháp chuẩn hóa**:
  1. **Hệ màu Red-Led Civic Palette ấm & Tương phản cao**:
     - Warm Background: `#FBF7F2`, Surface: `#FFFCF8`, Borders: `#E7DED6`.
     - Deep Ink Text: `#111827`, Warm Muted Text: `#6B5F58` và `#7A6B62` (loại bỏ hoàn toàn cold slate gray).
     - Red Accent độc tôn: `#B42318` (chính), `#991B1B` (hover/viền đậm), `#FDE8E6` (nền badge nhẹ). Tỷ lệ vàng: **75% warm neutral, 20% deep ink, 5% red accent**.
     - Xóa bỏ hoàn toàn chữ xám lớn làm emphasis ở tiêu đề dòng 2 (Hero & Section 2 chuyển sang màu đỏ DustGuard `#B42318`). Xanh lá chỉ dùng duy nhất cho trạng thái verified/thành công.
  2. **Live Case Engine — Kịch bản chuyển động có hồn (Choreography ~4.8s)**:
     - 0.20s: Điểm sự cố đô thị (`● GPS 20.9852° N`) xuất hiện kèm 1 vòng pulse duy nhất (`scale: 0.6 -> 2.2, opacity: 0.35 -> 0`).
     - 0.55s: *The Red Signal Trace* — Đường vẽ SVG đỏ mảnh thanh thoát uốn cong từ điểm sự cố nối trực tiếp vào đầu hồ sơ case.
     - 0.90s: Vỏ thẻ hồ sơ trồi lên (`y: 26 -> 0`, `opacity: 0 -> 1`), mã `DG-2026-OP-014` khóa cứng vào CSDL (tracking expansion).
     - 1.55s - 2.35s: Các bước 01 Phát hiện $\to$ 02 Tiếp nhận (chip "Đã chuyển xử lý" trượt vào, header border nháy đỏ nhẹ) $\to$ 03 Khắc phục (lớp khói bụi giảm độ đục, marker can thiệp hiện lên).
     - 2.80s: Màn wipe Before $\to$ After bằng clip-path chất lượng cao (1.1s) với nền mặt đường sạch trung tính, không biến thành hộp xanh nhân tạo.
     - 3.80s - 4.55s: 04 Tái kiểm hoàn tất, viền Card chuyển mượt sang xanh verified `#A7F3D0`, badge bung nở với `back.out(1.4)` và 1 vòng ripple xanh, nhãn chân thẻ: *"Đã hoàn tất bước tái kiểm"*.
  3. **Section 2 Broken Flow vs Closed Loop Trace**:
     - Quy trình cũ: Ảnh $\to$ Tin nhắn $\to$ Excel $\to$ đường SVG vẽ dừng lại để lộ khoảng đứt gãy trước dấu `? (Mất dấu)`.
     - Quy trình DustGuard: Đường SVG đỏ liền mạch nối trọn vẹn 3 chặng Tọa độ $\to$ Phân công $\to$ Tái kiểm.
  4. **Desktop Parallax Siêu Tốc Bằng `gsap.quickTo()`**:
     - Không setState trong sự kiện mousemove; dùng `gsap.quickTo()` cho tọa độ X/Y với độ dịch tối đa 2px (card), 5px (lưới bản đồ) và 4px (pin tín hiệu), giữ chuẩn 60fps mượt mà.

### 2. Kỹ Thuật Dàn Dựng GSAP Cho Civic-Tech Storytelling (Living Case Story)
- **Vấn đề**:
  - Các khối minh chứng dạng hai hộp tĩnh màu vàng (Trước) và xanh (Sau) dễ làm mất đi tính liên tục của quy trình; người dùng phải tự đọc chữ và so sánh thủ công trong đầu.
  - Animation CSS đơn thuần khó đồng bộ mượt mà giữa tiến trình dòng thời gian (4 bước) và chuyển động quét hiện trường (wipe reveal).
  - Nguy cơ memory leak hoặc xung đột DOM nếu không dọn dẹp (revert) các tween GSAP khi component React re-render.
- **Giải pháp chuẩn hóa**:
  1. **GSAP Context & Cleanup Chặt Chẽ**:
     - Luôn bọc toàn bộ chuỗi animation trong `const ctx = gsap.context(() => { ... }, containerRef)` và `return () => ctx.revert()` trong `useEffect()`.
     - Tôn trọng `window.matchMedia('(prefers-reduced-motion: reduce)').matches`: nếu người dùng bật giảm chuyển động, lập tức áp dụng trạng thái hoàn tất bằng `gsap.set()`, tránh chạy tween không mong muốn.
  2. **Orchestration Timeline & Clip-Path Wipe**:
     - Gom Before và After vào một khung hình trực quan dùng chung (`Evidence Stage`), After nằm đè lên Before với `clipPath: inset(0% 100% 0% 0%)`.
     - Đồng bộ thanh tiến trình 4 nodes: `Phát hiện (0.6s) → Tiếp nhận (1.2s) → Khắc phục (1.8s) → Tái kiểm & Wipe (2.4s - 3.3s)`.
     - Kèm vạch quét phát sáng (`scanLineRef`) trôi dọc theo mép wipe tạo hiệu ứng phân tích trắc địa chân thực.
  3. **Trao Quyền Chủ Động So Sánh Cho Người Dùng (Manual Comparison)**:
     - Sau khi animation tự động chạy xong 1 lần duy nhất, kích hoạt nút bấm `[↺ Xem lúc phát hiện]` $\leftrightarrow$ `[↺ Xem sau xử lý]` cho phép người dùng click để wipe qua lại tức thời bằng GSAP tween (`duration: 0.55s, ease: 'power2.inOut'`).
  4. **Ambient Drift & Bounded Pointer Parallax**:
     - Lớp nền lưới tọa độ contour đô thị (`civic-grid`) trôi nhẹ nhàng 10px trong 20s (`repeat: -1, yoyo: true`), tạo chiều sâu không gian cao cấp.
     - Hiệu ứng parallax theo con trỏ chuột desktop khống chế nghiêm ngặt trong giới hạn tối đa $\pm 4$px và xoay $\pm 0.3^\circ$, tránh biến dạng 3D thô thiển.

### 2. Thiết Kế Landing Page Civic-Tech Đẳng Cấp Đi Thi (Visual Quality First & Editorial Storytelling)
- **Vấn đề**:
  - Landing page ban đầu bị ảnh hưởng bởi tư duy Dashboard/Admin Panel: nhồi nhét quá nhiều border, thẻ card nhỏ, badge, KPI cards vụn (4 thẻ SLA / Bằng chứng / Tín chỉ / Kết quả) làm nghẹt thở first viewport.
  - Header quá dài với nhiều menu ngang cồng kềnh và border pill bao quanh.
  - Evidence card bên phải lạm dụng icon tam giác cảnh báo khổng lồ trong ô trống, không tạo được cảm giác hiện trường thực tế.
  - Các số liệu chưa có nguồn tin cậy bị biến thành fact cứng nhắc ("vượt 3.6 lần", "100% bảo chứng") gây rủi ro cam kết sai (Overclaiming).
- **Giải pháp chuẩn hóa**:
  1. **Quy luật 58% Content / 42% Visual cho Hero Desktop**:
     - Cột trái: H1 lớn clamp(56px, 5vw, 72px) làm Focal Point thị giác số 1, highlight có chủ đích cụm *"Theo dõi đến khi"*, copy 2 dòng súc tích, CTAs rõ ràng và Trust Row siêu nhẹ dạng text icon (loại bỏ 100% 4 KPI cards).
     - Cột phải: Thẻ *Case Story Card* độc bản (`DG-2026-OP-014`) làm Focal Point số 2, mô phỏng sinh động hiện trường Before (xe ben phát tán bụi) $\rightarrow$ sau 48h khắc phục After (trạm rửa xe, tưới ẩm, biên bản thanh tra).
  2. **Editorial Layout Thay Vì Cards Rời Rạc**:
     - *Thực trạng (Problem)*: 3 phát biểu đánh số `01`, `02`, `03` tương phản trực tiếp với sơ đồ đứt gãy truyền thống (*Ảnh → Tin nhắn → Excel → ?*) so với quy trình khép kín của DustGuard.
     - *Hành trình (Process)*: Timeline 5 chặng ngang lớn trên Desktop, dọc trên Mobile, điểm nhấn màu đỏ ở bước Tái kiểm.
     - *Phân vai (Roles)*: 4 portrait blocks với compact mock UI cho từng vai trò, không dùng ma trận tab phức tạp.
     - *Nguyên tắc tin cậy (Trust)*: 3 tuyên ngôn minh bạch, ẩn chi tiết kỹ thuật (SHA-256) vào chú thích đối soát, không khoe khoang thuật ngữ kỹ thuật.
     - *Pilot CTA*: Thiết kế dạng banner tinh gọn kèm compact modal popup, loại bỏ form dài gây ngán ngẩm trên trang chính.
  3. **Tối Ưu Hóa Mobile First & Chống Rớt Chữ**:
     - Thêm `whitespace-nowrap shrink-0` cho mã định danh vụ việc và status badge để mã không bao giờ bị cắt đôi giữa chừng.
     - Đặt `w-full sm:w-auto` và min-height 48px cho các CTA buttons để thao tác ngón cái đạt chuẩn tiếp cận civic tech.
     - Giữ nguyên tắc sống còn: nền ấm `#FBF9F5`, chữ đậm `#0F172A`, điểm nhấn đỏ `#B42318`, tuyệt đối cấm glassmorphism.

### 2. Loại Bỏ Phụ Thuộc Seed & Thiết Kế Database Rỗng Như Một First-Class State (2026-09-05)
- **Vấn đề**:
  - Nhiều hệ thống web hoạt động trơn tru trong quá trình phát triển nhờ dữ liệu seed mẫu sẵn có (`case-013`, `case-001`, `TASK-018`, `FND-01`, `user_tran`), nhưng lập tức sụp đổ hoặc vỡ giao diện khi khởi tạo trên môi trường sản xuất thực tế với cơ sở dữ liệu rỗng.
  - Các modal, drawer hoặc rule engine fallback về mã cứng (`case-013`, `FND-01`), tạo ra cảm giác "giả mạo thành công" (fake success), gây sai lệch dữ liệu thanh tra thực tế.
  - Form tạo user mặc định điền mật khẩu cố định (`password123`) hoặc API không có cơ chế chặn tái khởi tạo dẫn đến rủi ro chiếm quyền (Takeover).
- **Giải pháp chuẩn hóa**:
  1. **Database Rỗng Là First-Class State**:
     - Khi `user_count === 0`, toàn bộ UI tự động nhận diện hệ thống mới tinh, hiển thị Operational Banner hướng dẫn và chuyển hướng đến `/setup` để khởi tạo Super Admin đầu tiên.
     - Sau khi tài khoản đầu tiên được kích hoạt, khóa vĩnh viễn endpoint `/api/auth/bootstrap` với mã 403 Forbidden.
  2. **Zero-Seed Empty States & Actionable CTAs**:
     - Mọi danh mục chính (`/cases`, `/projects`, `/contractors`, `/evidence`, `/tasks`) đều có Empty State rõ ràng với CTA tạo thực thể đầu tiên (không bao giờ để màn hình trắng hay báo lỗi).
     - Cho phép tải lên bằng chứng trực tiếp qua giao diện (`EvidencePage`, `LegalWorkspacePage`) và niêm phong mã băm SHA-256 đối soát trực tiếp tệp trên đĩa cứng.
  3. **Xử Lý Hồ Sơ Thiếu Dữ Kiện Thực Tế (Zero-Hallucination)**:
     - Khi hồ sơ mới tạo chưa có biên bản thanh tra hay số liệu đo đạc, engine phân tích pháp lý phải trả về `conclusion_level = 'INSUFFICIENT_EVIDENCE'` hoặc `'INSUFFICIENT_DATA'`.
     - Tuyệt đối cấm máy tự suy đoán hay kết luận `HUMAN_CONFIRMED` khi chưa có chữ ký bút phê của cán bộ thẩm quyền.
     - Liệt kê minh bạch các nhóm dữ kiện còn thiếu và cung cấp nút bấm trực tiếp tạo nhiệm vụ kiểm tra hiện trường.
  4. **Kiểm Thử E2E Tự Động Hóa Từ DB Rỗng**:
     - Xây dựng test suite 12 bước chạy trên DB mới tạo hoàn toàn (migration-only): Khởi tạo -> Bootstrap -> Đăng nhập -> Tạo Nhà thầu -> Tạo Dự án -> Tạo Vụ việc -> Tải bằng chứng ảnh -> Phân tích pháp lý -> Tạo Task -> Đối soát SQLite D1 SSOT.

### 2. Phân Tách 4 Lớp Giao Diện Hỗ Trợ Quyết Định & Tách Bạch Rule Engine Khỏi AI Assistant (2026-09-05)
- **Vấn đề**:
  - Popup cũ `FACT-CLAIM-case-013` chỉ thuần túy hiển thị record trong DB (ID kỹ thuật, loại CLAIM, timestamp, nút Đóng), không trả lời được các câu hỏi then chốt của cán bộ: *Ai nói? Nói điều gì? Có đáng tin không? Hệ thống đã kiểm tra tự động gì? Liên quan gì đến kết luận? Cán bộ cần làm gì tiếp?*
  - Nguy cơ "gắn chữ AI vào rule engine": Các phép kiểm tra có ảnh hay chưa, GPS < 50m, hash SHA-256 có khớp không, IoT có dữ liệu không, deadline quá hạn... thực chất là **deterministic SQL/rule engine**, việc gắn nhãn "AI" làm hệ thống kém đáng tin và tốn kém vô ích.
- **Giải pháp chuẩn hóa**:
  1. **Khóa 4 lớp giao diện chuyên biệt**:
     - *A. Quick Preview Modal (500–620px)*: Xem nhanh, trả lời 5 câu hỏi của cán bộ, đẩy raw ID xuống footer, có dominant CTAs `[Xem đầy đủ]` và `[Tạo xác minh →]`.
     - *B. Evidence Detail Drawer (560–640px)*: Điều tra chuyên sâu bằng chứng số với ảnh lớn, mã băm SHA-256 đối soát đĩa cứng, bảng đối chiếu 4 chiều thực địa (Thời điểm, Vị trí, Người gửi, Hiện trường) và liên kết đồ thị vụ việc (FND/REQ/TASK).
     - *C. Action Modal (~520px)*: Đơn nhiệm cho 1 hành động (giao việc xác minh, SLA 48h tự động, phân công cán bộ, checklist 3 tiêu chí).
     - *D. Decision Workspace Drawer (750–850px)*: Bàn làm việc ra quyết định với 5 bước nhận thức có cấu trúc (*Nhận định → Căn cứ pháp lý → Chứng cứ → Dữ kiện còn thiếu → Đề xuất hệ thống kèm "Tại sao? [Xem lập luận]"*) và ký duyệt lưu vết D1.
  2. **Tách bạch hoàn toàn Rule Engine và AI Intelligence**:
     - Đổi nút hành động thành `✦ Phân tích hồ sơ`.
     - Thay thế điểm đơn độc `Data Confidence: 16%` thành: **Mức độ đầy đủ hồ sơ (Data Completeness)** tính toán xác thực từ CSDL (`2 / 6 nhóm dữ kiện đã có (33%)`) + **Đánh giá Trợ lý (AI Assessment)** riêng biệt (`Mức chắc chắn: Trung bình`).
     - Bổ sung phát hiện mâu thuẫn dữ kiện (*AI Contradiction Detection*) và 3 Ưu tiên hành động tiếp theo.
     - 3 màu trạng thái nhận thức: `● FACT` (slate), `● AI SUGGESTION` (indigo), `● VERIFIED` (emerald).

### 2. Kiến Trúc Express Router Sub-mount & Tránh Lỗi Lặp Đường Dẫn (Route Doubling Bug)
- **Vấn đề**: Khi mount một router vào một path tiền tố trong file server chính:
  ```typescript
  // index.ts
  app.use('/api/cases', casesRouter);
  ```
  Nếu bên trong `casesRouter` (hoặc các sub-router như `legalRouter`, `inspectionsRouter`) lại định nghĩa:
  ```typescript
  router.post('/cases/:id/legal/analyze', ...);
  ```
  Đường dẫn thực tế khi gọi từ Client sẽ bị gấp đôi thành `/api/cases/cases/:id/legal/analyze`, dẫn đến lỗi **404 Cannot POST**.
- **Giải pháp chuẩn hóa**:
  Mọi sub-router mount dưới `/api/cases` phải nhận dạng root của nó là `/:id/...`:
  ```typescript
  // legal.router.ts (được mount tại /api/cases)
  router.post('/:id/legal/analyze', ...);
  router.post('/:id/legal/review', ...);
  ```
  Luôn audit bảng định tuyến (Route Table) trước khi tích hợp Frontend.

---

### 2. Node.js 24 Native SQLite (`node:sqlite`) Parameter Binding với Kiểu Dữ Liệu Phức Tạp
- **Vấn đề**: Module native `DatabaseSync` của Node 24 kiểm tra kiểu dữ liệu nghiêm ngặt hơn các thư viện cũ (như `better-sqlite3`). Khi truyền một JavaScript Array (ví dụ danh sách `evidence_asset_ids: string[]`) trực tiếp vào prepared statement:
  ```typescript
  stmt.run(id, caseId, evidenceIds); // ❌ Throw: TypeError: Provided value cannot be bound to SQLite parameter
  ```
- **Giải pháp chuẩn hóa**:
  Mọi trường quan hệ nhiều-nhiều hoặc mảng nhúng (embedded arrays/JSON objects) bắt buộc phải serialize qua `JSON.stringify(val || [])` trước khi bind vào câu lệnh SQL:
  ```typescript
  stmt.run(id, caseId, JSON.stringify(evidenceIds || [])); // ✅ Chuẩn SQLite TEXT
  ```

---

### 3. Tìm Kiếm Toàn Văn SQLite FTS5 (Full-Text Search) Địa Phương
- **Vấn đề**: Tìm kiếm FTS5 trên SQLite rất nhạy cảm với các ký tự đặc biệt (dấu ngoặc, dấu gạch ngang, toán tử boolean). Nếu người dùng nhập chuỗi tìm kiếm thô có ký tự đặc biệt, câu lệnh `MATCH ?` có thể quăng ngoại lệ cú pháp SQL FTS5.
- **Giải pháp chuẩn hóa**:
  Làm sạch từ khóa tìm kiếm, loại bỏ ký tự điều khiển FTS5 trước khi truy vấn, hoặc bọc từng từ khóa trong ngoặc kép với wildcard prefix:
  ```typescript
  const sanitized = query.replace(/['"*^()]/g, ' ').trim();
  const ftsQuery = sanitized.split(/\s+/).filter(Boolean).map(w => `"${w}"*`).join(' OR ');
  ```

---

### 4. Đảm Bảo Mobile Viewport 390x844 Không Bị Tràn Ngang (`noOverflow: true`)
- **Vấn đề**: Các component Header, Topbar, hoặc Flex container có chứa văn bản dài (như Tiêu đề vụ việc, Tên công trình) có thể đẩy container rộng hơn `390px`, gây thanh cuộn ngang khó chịu trên điện thoại.
- **Giải pháp chuẩn hóa**:
  1. Thêm `min-w-0 flex-1` cho container văn bản trong flexbox.
  2. Áp dụng `truncate` hoặc `line-clamp-1` kết hợp `text-wrap: pretty`.
  3. Kiểm tra bằng lệnh: `node scripts/verify-responsive.js` chạy qua 5 viewports từ $390\text{px}$ đến $1440\text{px}$ đạt 75/75 test pass.

---

### 5. SQLite Concurrency & Chống Khóa Cơ Sở Dữ Liệu (`PRAGMA busy_timeout = 5000`)
- **Vấn đề**: Khi chạy `tsx watch` tự động restart server hoặc khi các tiến trình test chạy song song với backend, SQLite WAL mode có thể quăng lỗi `ERR_SQLITE_ERROR (errcode: 261): database is locked` nếu thời gian chờ mặc định là 0ms.
- **Giải pháp chuẩn hóa**:
  Luôn cấu hình `PRAGMA busy_timeout = 5000;` ngay sau khi khởi tạo kết nối `DatabaseSync`:
  ```typescript
  export const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA busy_timeout = 5000;');
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  ```

---

### 6. Chuẩn Hóa Giá Trị Enum Trước Ràng Buộc SQLite `CHECK`
- **Vấn đề**: Schema SQLite định nghĩa nghiêm ngặt `CHECK (section_type IN ('Chapter', 'Article', 'Clause', 'Point', 'Section'))`. Trong khi đó, bộ phân tích regex hoặc giao diện người dùng có thể gửi lên chuỗi in hoa (`'ARTICLE'`) hoặc tiếng Việt (`'ĐIỀU'`), gây lỗi `CHECK constraint failed`.
- **Giải pháp chuẩn hóa**:
  Viết hàm helper `normalizeSectionType()` chuyển đổi trước khi insert vào CSDL:
  ```typescript
  function normalizeSectionType(type: string): string {
    const upper = (type || '').toUpperCase();
    if (upper.includes('CHƯƠNG') || upper === 'CHAPTER') return 'Chapter';
    if (upper.includes('MỤC') || upper === 'SECTION') return 'Section';
    if (upper.includes('ĐIỀU') || upper === 'ARTICLE') return 'Article';
    if (upper.includes('KHOẢN') || upper === 'CLAUSE') return 'Clause';
    if (upper.includes('ĐIỂM') || upper === 'POINT') return 'Point';
    return 'Article';
  }
  ```

---

### 7. Tương Thích Hai Tầng Client Unwrapping (`return data.data ?? data`)
- **Vấn đề**: Khi HTTP client bóc tách `data.data ?? data`, phản hồi trả về dạng mảng thô `[...]`. Nếu mã nguồn trang web truy cập cứng `res.devices` hoặc `res.rules`, giá trị sẽ là `undefined` làm bảng hiển thị 0 bản ghi rỗng.
- **Giải pháp chuẩn hóa**:
  1. Phía Server trả về cả `data` chuẩn lẫn các thuộc tính tiện ích tương thích ngược: `{ success: true, data: processed, devices: processed }`.
  2. Phía Client luôn kiểm tra kiểu mảng trước:
     ```typescript
     const list = Array.isArray(res) ? res : res.devices || res.data || [];
     ```

---

### 8. Thao Tác Windows PowerShell với Ký Tự `@` trong CLI
- **Vấn đề**: Trong môi trường PowerShell trên Windows, cú pháp `@e16` bị nhận diện là toán tử mảng/splatting của PowerShell, dẫn đến việc nuốt mất tham số khi truyền vào lệnh `agent-browser click @e16`.
- **Giải pháp chuẩn hóa**:
  Luôn bọc các selector có ký tự `@` trong cặp dấu nháy kép: `agent-browser click "@e16"`.  3. Thêm cấu hình toàn cục `overflow-x: hidden` tại `body` và `html`.
  4. Xác minh tự động qua `agent-browser`:
     ```javascript
     document.documentElement.scrollWidth <= window.innerWidth // Bắt buộc true
     ```

---

### 5. Spawn Child Process Khởi Động Dev Server Trên Windows PowerShell
- **Vấn đề**: Lệnh `npx` trên Windows là `npx.cmd`. Nếu gọi `spawn('npx', ...)` mà không có `{ shell: true }` sẽ quăng lỗi `ENOENT: spawn npx ENOENT`.
- **Giải pháp chuẩn hóa**:
  Luôn kiểm tra platform hoặc truyền `{ shell: true }`:
  ```javascript
  const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  spawn(npxCmd, args, { stdio: 'inherit', shell: true });
  ```

---

### 6. Nguyên Tắc Cốt Lõi Về Logic Nghiệp Vụ (Domain Logic Invariants)
- **BUILD PASS != FEATURE PASS** và **TEST PASS != PRODUCT PASS**.
- Một tính năng chỉ hoàn tất khi:
  1. Logic đầu vào - đầu ra phù hợp nghiệp vụ thực tế (Ví dụ: Cổng kiểm tra 4 điều kiện khắt khe trước khi Đóng vụ việc: phải hoàn tất thanh tra, hết yêu cầu khắc phục, có biên bản pháp chế, và có tóm tắt lý do đóng).
  2. Dữ liệu ghi nhận bền vững vào CSDL SQLite SSOT thật (Reload F5 không mất dữ liệu).
  3. Kiểm chứng trực quan qua trình duyệt thực tế không có lỗi console, không gãy giao diện.

---

### 9. Cơ Chế Xác Thực Khi Mở Tab Mới Bằng window.open() (Decision Pack / Tài Liệu In Ấn)
- **Vấn đề**: Khi người dùng click nút xuất hồ sơ in ấn hoặc Decision Pack sử dụng `window.open('/api/...', '_blank')`, trình duyệt gửi request GET độc lập và không thể đính kèm tiêu đề HTTP `Authorization: Bearer <token>` lưu trong localStorage. Nếu middleware backend chỉ kiểm tra header Authorization, request sẽ bị chặn với mã lỗi 401 Unauthorized.
- **Giải pháp chuẩn hóa**:
  1. Cho phép `authMiddleware` nhận diện token qua tham số query `?token=<jwt>` hoặc `?auth_token=<jwt>` đối với các route tài liệu view trực tiếp.
  2. Ở phía Frontend, khi gọi `window.open()`, chủ động trích xuất token từ localStorage và đính kèm vào URL.
  3. Hỗ trợ cơ chế phân quyền định dạng thông minh: trả về `text/html; charset=utf-8` khi trình duyệt mở trực tiếp (`Accept: text/html`) và trả về JSON có cấu trúc khi gọi qua API (`Accept: application/json` hoặc `?format=json`).

---

### 10. Xung Đột Dữ Liệu Khi Chạy Nhiều File Test Cùng Lúc Trên File SQLite Duy Nhất
- **Vấn đề**: `node:test` theo mặc định thực thi các file test (`tests/*.test.js`) song song (parallel). Khi nhiều file test cùng gọi hàm `seedDatabase()` trong hook `before()`, các tiến trình đồng thời thực thi lệnh `DROP TABLE` và `INSERT INTO users`, gây lỗi `UNIQUE constraint failed: users.email` hoặc để lại dữ liệu rác từ bài test trước (`human_decisions` không được drop).
- **Giải pháp chuẩn hóa**:
  1. Khi chạy test suite trên SQLite file cục bộ, luôn thêm cờ `--test-concurrency=1` trong lệnh test (`npx tsx --test --test-concurrency=1 ...`).
  2. Mọi bảng mới thêm vào schema (`analysis_runs`, `human_decisions`) bắt buộc phải được khai báo ngay vào mảng bảng cần DROP trong hàm `seedDatabase()` để đảm bảo môi trường kiểm thử hoàn toàn độc lập (idempotent & isolated).

---

### 11. Chuỗi Dữ Kiện Nguồn Gốc (Provenance Model) & Ngữ Nghĩa Thực Tế
- **Nguyên tắc cốt lõi**: `SOURCE → FACT → EVIDENCE → INFERENCE → HUMAN DECISION`.
- AI không phải là nguồn dữ liệu và không phải là người ra quyết định.
- **Phân định rõ ràng**:
  - `COMMUNITY_CLAIM`: semantic_type = `CLAIM`, verification_state = `UNVERIFIED`. Tuyệt đối không hiển thị phản ánh cộng đồng như dữ kiện đã xác nhận.
  - `INSPECTION_OBSERVATION`: semantic_type = `OBSERVATION`. Ghi nhận từ cán bộ thực địa.
  - `IOT_ANOMALY`: semantic_type = `TELEMETRY`. Chỉ là tín hiệu viễn thám gợi ý khảo sát, cấm tự động suy luận thành vi phạm pháp luật.
  - `EVIDENCE_ASSET`: semantic_type = `DOCUMENT`. Phải qua kiểm tra đối chiếu mã băm SHA-256 với tệp thực tế trên đĩa cứng mới đạt `integrity_state = 'VERIFIED'`. Tệp bị can thiệp sẽ mang trạng thái `TAMPERED` hoặc `FILE_MISSING` và bị loại bỏ khỏi căn cứ pháp lý.
  - `HUMAN_DECISION`: Chỉ khi có bản ghi hợp lệ do cán bộ con người ký duyệt mới được phép mang `semantic_type = 'HUMAN_DECISION'` và đưa mức kết luận lên `HUMAN_CONFIRMED`.

---

### 13. Vận Hành Hoàn Toàn Độc Lập Khỏi Seed (Zero-Seed Production Operability)
- **Vấn đề**:
  1. Khi xóa hoặc không chạy `seed.ts`, hệ thống có thể bị sập do: thiếu tài khoản quản trị đầu tiên để đăng nhập; các dropdown chọn nhà thầu/công trình không có dữ liệu và không có màn hình thêm mới; các bảng dashboard ném lỗi vì giả định dữ liệu luôn tồn tại; mẫu biên bản thanh tra bị mất.
  2. Trong Node.js ESM, các lệnh `import ... from ...` tĩnh luôn bị hoisted lên đầu tệp trước mọi dòng code chạy thực thi. Do đó nếu gán `process.env.DB_PATH = '...'` trong file test, `connection.ts` vẫn đọc biến môi trường cũ nếu bị import tĩnh ở top-level.
- **Giải pháp chuẩn hóa**:
  1. **Phân tách Cấu hình Hệ thống Luật định (Category D)**: Toàn bộ văn bản quy phạm (Luật BVMT, NĐ 45/2022, QCVN 05:2023, QĐ 29/2021) và mẫu biên bản thanh tra được trích xuất thành Cấu hình Hệ thống (`systemConfig.ts`) và tự động nạp qua migrations, phân biệt tuyệt đối với Dữ liệu Tác nghiệp Demo (`seed.ts`).
  2. **Bootstrap Wizard An Toàn (`/setup` & `POST /api/auth/bootstrap`)**: Cho phép tạo Super Admin khi DB rỗng (`is_initialized = false`) và tự động khóa vĩnh viễn (403 Forbidden) ngay sau khi có ít nhất 1 người dùng.
  3. **Tự Tạo Đầy Đủ Thực Thể Qua UI**: Xây dựng đầy đủ màn hình và API cho Nhà thầu (`/contractors`), Công trình xây dựng (`/projects`), Cổng tiếp nhận báo cáo dân cư công khai (`POST /api/signals/public-report`), Chuyển hóa tin báo thành vụ việc (`POST /api/signals/:id/create-case`), và Đăng ký thiết bị IoT (`POST /api/iot/devices`).
  4. **Dynamic Import trong Isolated Tests**: Trong các bài test cơ sở dữ liệu cô lập, luôn đặt `process.env.DB_PATH = isolatedPath;` trước, sau đó dùng `await import('./connection.js')` và `await import('./migrate.js')` để đảm bảo kết nối SQLite trỏ đúng file database cô lập.

---

### 14. Phân Tách Khởi Tạo Cấu Hình Luật Định Khỏi Dữ Liệu Demo & Responsive Tablet 768px
- **Vấn đề**:
  1. Khi chạy hàm `seedDatabase()`, nếu `runMigrations()` tự động gọi `ensureSystemConfiguration()`, các văn bản pháp luật mẫu sẽ được chèn trước. Sau đó hàm seed tiếp tục chèn cùng ID đó, dẫn đến lỗi `UNIQUE constraint failed: legal_documents.id`.
  2. Tại độ phân giải Tablet 768px (`md` breakpoint), thanh tìm kiếm toàn cục rộng 448px (`md:block`) kích hoạt cùng lúc với logo (260px) và thông tin tài khoản (220px), đẩy chiều rộng header lên 826px, gây lỗi tràn ngang 58px.
- **Giải pháp chuẩn hóa**:
  1. Thêm tham số `runMigrations(initSystemConfig = true)`. Khi gọi từ `seedDatabase()`, truyền `runMigrations(false)` để việc seeding chịu trách nhiệm nạp dữ liệu một lần duy nhất, sạch sẽ và nhất quán.
  2. Tại thanh Header, chuyển thanh tìm kiếm dạng mở rộng sang kích hoạt từ `lg:block` ($\ge 1024\text{px}$) và giữ nút icon tìm kiếm nhỏ gọn tại `lg:hidden`, giúp Tablet 768px hiển thị hoàn hảo (`scrollWidth: 753px <= 768px`) và đạt 75/75 test responsive pass 100%.

---

### 15. UI Quality Watch Không Chặn (Non-Blocking) & Tuân Thủ Chuẩn Touch Target Di Động Civic Tech
- **Vấn đề**:
  1. Trong quá trình phát triển chức năng cốt lõi (Core Business Domain) và kiểm thử trình duyệt, nếu dừng quy trình mỗi khi gặp lỗi UI phụ sẽ làm vỡ mạch và chậm tiến độ. Tuy nhiên, nếu bỏ qua hoàn toàn, các lỗi như text clipping, nút bấm bị đè hoặc touch target quá nhỏ ($< 44\text{px}$) trên mobile sẽ tồn đọng đến khi ra thực địa ngoài nắng.
  2. Tại trang `LegalWorkspacePage`, các tab điều hướng (`matrix`, `worksheet`, `checklist`) ban đầu được định dạng `py-1.5 px-2`, dẫn tới chiều cao nút bấm thực tế chỉ đạt $28\text{px}$ trên viewport di động ($430\times 932$).
- **Giải pháp chuẩn hóa**:
  1. **Cơ chế Watch Non-Blocking**: Thực hiện ghi nhận toàn bộ bất thường giao diện vào `artifacts/ui-anomalies.json` theo ma trận 5 viewports ($390\times 844$, $430\times 932$, $768\times 1024$, $1366\times 768$, $1440\times 900$) qua headless `agent-browser` mà không ngắt luồng nghiệp vụ.
  2. **UI Cleanup Pass Sau Khi Logic Pass**: Sau khi toàn bộ test logic và nghiệp vụ đạt 100%, tiến hành rà soát file `ui-anomalies.json` và sửa tận gốc (Root Cause):
     - Nâng cấp các nút tab thành `min-h-[44px] py-2.5 px-3 touch-target flex items-center justify-center gap-1.5`.
     - Tối ưu nhãn trên mobile: Ẩn bớt từ dài trên màn hình nhỏ và hiển thị đầy đủ trên màn hình lớn (`<span className="hidden sm:inline">...</span><span className="sm:hidden">...</span>`).
### 16. Kiến Trúc Workspace-First, Shell Chuẩn Hóa & Tối Ưu Màn Hình Laptop 14-inch (Windows Scale 125%)
- **Bối cảnh & Vấn đề**:
  1. Bố cục 3 cột cố định trên Desktop (Sidebar + Cột Dữ kiện hồ sơ 300px + Cột Thẩm tra trung tâm + Cột Dữ kiện thiếu & Quyết định 320px) bên trong container `max-w-7xl` làm vùng làm việc trung tâm bị ép chặt xuống chỉ còn ~450px trên màn hình laptop 14-inch (viewport ~1280–1366px).
  2. Giao diện bị chia vụn bởi quá nhiều viền lồng viền (boxes within boxes), thanh dev role switcher nằm tách biệt trên đỉnh chiếm diện tích, các chuỗi raw UUID dài (`[FACT-ITEM-ii-...]`) gây tràn khung và phân tán sự chú ý của cán bộ tác nghiệp.
- **Giải pháp chuẩn hóa (Workspace-First Architecture)**:
  1. **Application Shell Linh hoạt**:
     - Header cố định 56px (`h-14`), loại bỏ hoàn toàn dev bar bên trên.
     - Tích hợp bộ chuyển đổi vai trò (`RoleSwitcher`) dạng dropdown nhỏ gọn ngay trên Header.
     - Sidebar đáp ứng đa tầng: `< 1200px`: 68px icon mode (tự động ẩn text, căn giữa icon, tooltip hover); `1200–1439px`: 196px; `≥ 1440px`: 216px.
     - Loại bỏ giới hạn `max-w-7xl`, content sử dụng 100% không gian còn lại (`flex-1 min-w-0 w-full`).
  2. **Main Legal Canvas Duy Nhất (≥ 800px usable width)**:
     - Trên màn hình 14-inch (1280x800 và 1366x768), canvas làm việc chính đạt chiều rộng thực tế từ **1069px đến 1155px** (vượt xa mức tối thiểu 800px).
  3. **Chuyển Đổi Phân Hệ Phụ Thành Drawers & Popovers**:
     - *Dữ kiện hồ sơ*: Chuyển thành `SideDrawer` (380–420px) kích hoạt qua nút `[Bằng chứng · 12]`, overlay lên nội dung và không làm co giãn canvas chính.
     - *Dữ kiện còn thiếu*: Chuyển thành `SideDrawer` kích hoạt qua nhãn cảnh báo `[⚠ Thiếu 3 dữ kiện]` đặt cạnh header.
     - *Quyết định cán bộ*: Chuyển thành `BottomActionBar` ghim đáy (sticky) hiển thị trạng thái kết luận, độ tin cậy dữ liệu và nút chính `[Ra quyết định →]` mở `DecisionModal` phê duyệt ký duyệt có thẩm quyền (Human-in-the-loop).
  4. **Thẻ Nhận Định & Nhãn Nguồn Thân Thiện**:
     - Thay thế toàn bộ chuỗi raw UUID thô bằng thẻ nguồn nghiệp vụ thân thiện: `[Hiện trường 1]`, `[IoT 1]`, `[Bằng chứng 1]`, kèm 2 hành động tác nghiệp trực tiếp `[Xem bằng chứng]` và `[Đối chiếu căn cứ]`.
  5. **Bộ Primitives Chuẩn Hóa**:
     - Xuất khẩu thống nhất các thành phần: `PageHeader`, `RecordHeader`, `RecordNavigation`, `RecordWorkspace`, `RecordContent`, `Workspace`, `ListWorkspace`, `InvestigationWorkspace`, `FormWorkspace`, `DashboardGrid`, `SideDrawer`, `BottomActionBar`, `DecisionModal`.
- **Kết quả Kiểm chứng**:
  - 87/87 API & domain tests **PASS 100%**.
  - 75/75 responsive matrix combinations **PASS 100%**.
  - 0 console error, 0 horizontal scroll, giao diện sáng màu high-contrast, zero-glassmorphism.

