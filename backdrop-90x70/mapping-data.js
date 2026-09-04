/**
 * DUSTGUARD VN — BACKDROP 90x70CM TEXT MAPPING DATA (SSOT)
 * Hỗ trợ cả nạp trực tiếp qua thẻ <script> (file:// protocol) lẫn ES Module (http:// protocol).
 */

const BACKDROP_DATA = {
  header: {
    partnerTitle: "Các đơn vị đồng hành & bảo trợ",
    logos: [
      { name: "Bộ Nông nghiệp và Môi trường", label: "Bộ Nông nghiệp và Môi trường" },
      { name: "UNICEF", label: "unicef vì mọi trẻ em" },
      { name: "Nông nghiệp & Môi trường", label: "Nông nghiệp & Môi trường" },
      { name: "Đoàn TNCS Hồ Chí Minh", label: "Đoàn TNCS Hồ Chí Minh" },
      { name: "VSDS", label: "VSDS - Trung tâm Hỗ trợ và Phát triển Sinh viên Việt Nam" }
    ]
  },

  brand: {
    name: "DustGuard VN",
    subName: "Nền tảng giám sát bụi công trình & môi trường",
    pillars: [
      { icon: "🧪", text: "Dữ liệu sạch" },
      { icon: "⚙️", text: "Quy trình rõ ràng" },
      { icon: "🤝", text: "Cộng đồng đồng hành" }
    ],
    handwritingSlogan: "Không khí sạch là quyền của mọi trẻ em"
  },

  blocks: {
    // KHỐI 1: VẤN ĐỀ
    block1: {
      number: "1",
      title: "VẤN ĐỀ",
      items: [
        { icon: "👥", text: "Bụi công trình ảnh hưởng sức khỏe cộng đồng" },
        { icon: "📊", text: "Thiếu dữ liệu tin cậy để theo dõi và đánh giá" },
        { icon: "❗", text: "Phản ánh chưa được xử lý kịp thời" },
        { icon: "📄", text: "Thiếu minh bạch, khó theo dõi" }
      ]
    },

    // KHỐI 2: GIẢI PHÁP
    block2: {
      number: "2",
      title: "GIẢI PHÁP",
      items: [
        { icon: "💡", text: "Kết hợp IoT + AI + Cộng đồng" },
        { icon: "📈", text: "Tự động thu thập & phân tích tín hiệu" },
        { icon: "❗", text: "Ưu tiên xử lý theo rủi ro (nội bộ)" },
        { icon: "⏱️", text: "Theo dõi tiến độ & phản hồi" }
      ]
    },

    // KHỐI 3: ĐỐI TƯỢNG LỢI ÍCH
    block3: {
      number: "3",
      title: "ĐỐI TƯỢNG LỢI ÍCH",
      items: [
        { role: "Cơ quan quản lý", icon: "🏛️", desc: "Ra quyết định hiệu quả" },
        { role: "Người dân", icon: "👥", desc: "Dễ phản ánh, dễ theo dõi" },
        { role: "Trường học", icon: "🏫", desc: "Giáo dục môi trường, Lan tỏa hành động xanh" },
        { role: "Nhà thầu", icon: "👷", desc: "Tuân thủ quy định, Giảm rủi ro vi phạm" }
      ]
    },

    // KHỐI 4: QUY TRÌNH VẬN HÀNH
    block4: {
      number: "4",
      title: "QUY TRÌNH VẬN HÀNH",
      steps: [
        { num: 1, label: "Tiếp nhận phản ánh", icon: "📱" },
        { num: 2, label: "Phân tích tín hiệu", icon: "🤖" },
        { num: 3, label: "Phân công xử lý", icon: "📋" },
        { num: 4, label: "Theo dõi tiến độ", icon: "🔍" },
        { num: 5, label: "Ghi nhận kết quả", icon: "✅" }
      ],
      caption: "Danh sách ưu tiên & Bảng điều hành trực quan"
    },

    // KHỐI 5: ĐIỂM ƯU TIÊN XỬ LÝ
    block5: {
      number: "5",
      title: "ĐIỂM ƯU TIÊN XỬ LÝ (MINH HOẠ)",
      score: "87",
      scoreLabel: "Ưu tiên: Cao",
      levels: [
        { level: "Cao", desc: "Tín hiệu mạnh", color: "#9F241F" },
        { level: "Trung bình", desc: "Tín hiệu vừa", color: "#EA580C" },
        { level: "Thấp", desc: "Tín hiệu yếu", color: "#0284C7" }
      ],
      note: "ⓘ Điểm dùng để hỗ trợ sắp xếp ưu tiên, không thay thế kết luận tại hiện trường."
    },

    // KHỐI 6: THIẾT BỊ IOT ĐƠN GIẢN
    block6: {
      number: "6",
      title: "THIẾT BỊ IOT ĐƠN GIẢN",
      specs: [
        { icon: "⚙️", text: "Cảm biến bụi PM2.5 / PM10" },
        { icon: "📶", text: "Kết nối Wi-Fi / 4G" },
        { icon: "⚡", text: "Nguồn điện ổn định" },
        { icon: "📐", text: "Thiết kế nhỏ gọn" },
        { icon: "🛠️", text: "Dễ triển khai & bảo trì" }
      ]
    },

    // KHỐI 7: TÁC ĐỘNG DỰ KIẾN
    block7: {
      number: "7",
      title: "TÁC ĐỘNG DỰ KIẾN (ĐỊNH TÍNH)",
      impacts: [
        { icon: "🎯", title: "Phát hiện sớm điểm cần ưu tiên" },
        { icon: "🤝", title: "Hỗ trợ phối hợp xử lý nhanh hơn" },
        { icon: "📊", title: "Tăng minh bạch và khả năng theo dõi" },
        { icon: "🌿", title: "Góp phần bảo vệ sức khỏe cộng đồng" }
      ]
    },

    // KHỐI 8: SO SÁNH GIẢI PHÁP
    block8: {
      number: "8",
      title: "SO SÁNH GIẢI PHÁP",
      columns: ["Tiêu chí", "Cách làm truyền thống", "DustGuard VN"],
      rows: [
        { criteria: "Thu thập dữ liệu", traditional: "Thủ công, gián đoạn", dustguard: "Tự động, liên tục", good: true },
        { criteria: "Độ bao phủ", traditional: "Hạn chế", dustguard: "Rộng hơn", good: true },
        { criteria: "Phản ánh & xử lý", traditional: "Chậm, thủ công", dustguard: "Nhanh, theo quy trình", good: true },
        { criteria: "Minh bạch", traditional: "Thấp", dustguard: "Cao", good: true },
        { criteria: "Hỗ trợ ra quyết định", traditional: "Hạn chế", dustguard: "Dựa trên tín hiệu", good: true },
        { criteria: "Chi phí dài hạn", traditional: "Hiệu quả thấp", dustguard: "Tối ưu & bền vững", good: true }
      ]
    },

    // KHỐI 9: HIỆN TRẠNG & KẾ HOẠCH KẾT NỐI
    block9: {
      number: "9",
      title: "HIỆN TRẠNG & KẾ HOẠCH KẾT NỐI",
      phases: [
        { num: 1, text: "Đã hoàn thành nghiên cứu & định hình sản phẩm" },
        { num: 2, text: "Có prototype nền tảng & quy trình vận hành" },
        { num: 3, text: "Đang lên kế hoạch kết nối các bên liên quan" },
        { num: 4, text: "Ví dụ kết nối: iHanoi, cơ quan quản lý,..." }
      ],
      goalNote: "Mục tiêu: Chuẩn hóa dữ liệu, quy trình và đầu ra trước giai đoạn pilot."
    },

    // KHỐI 10: BỀN VỮNG
    block10: {
      number: "10",
      title: "BỀN VỮNG",
      points: [
        { icon: "🛡️", text: "Dữ liệu chính xác, đáng tin cậy" },
        { icon: "⚙️", text: "Công nghệ đơn giản, dễ mở rộng" },
        { icon: "👥", text: "Cộng đồng cùng tham gia" },
        { icon: "🌿", text: "Hướng tới thành phố xanh và phát triển bền vững" }
      ]
    },

    // KHỐI 11: LỘ TRÌNH
    block11: {
      number: "11",
      title: "LỘ TRÌNH",
      milestones: [
        { time: "Q4/2026", text: "Hoàn thiện nền tảng & thử nghiệm mở rộng" },
        { time: "Q1/2027", text: "Kết nối & phối hợp các cơ quan liên quan" },
        { time: "Q2/2027", text: "Mở rộng quy mô & đánh giá hiệu quả" }
      ]
    }
  },

  footer: {
    qrBox: {
      title: "QUÉT MÃ",
      subtitle: "Tìm hiểu dự án",
      target: "DustGuard VN →",
      link: "https://dustguard.vn"
    },
    brandLine: {
      name: "DustGuard VN",
      slogan: "Dữ liệu sạch — Quy trình rõ — Cộng đồng mạnh — Vì tương lai xanh"
    }
  }
};

// Gán vào global window cho trình duyệt
if (typeof window !== 'undefined') {
  window.DEFAULT_BACKDROP_DATA = BACKDROP_DATA;
}

// Hỗ trợ CommonJS nếu chạy trong Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_BACKDROP_DATA: BACKDROP_DATA };
}
