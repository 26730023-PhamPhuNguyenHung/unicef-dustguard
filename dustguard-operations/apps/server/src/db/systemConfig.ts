import { db } from './connection.js';

export const SYSTEM_LEGAL_DOCUMENTS = [
  {
    id: 'doc-bvmt-2020',
    title: 'Luật Bảo vệ Môi trường 2020',
    document_number: '72/2020/QH14',
    authority: 'Quốc hội Nước CHXHCN Việt Nam',
    issued_date: '2020-11-17',
    effective_date: '2022-01-01',
    status: 'ACTIVE',
    source_url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=202157',
    sections: [
      {
        id: 'sec-bvmt-64',
        section_type: 'Article',
        section_number: 'Điều 64',
        heading: 'Bảo vệ môi trường trong hoạt động xây dựng',
        content:
          '1. Quy hoạch xây dựng phải phù hợp với quy hoạch bảo vệ môi trường. Cơ quan, tổ chức, cá nhân khi thi công công trình xây dựng phải có biện pháp che chắn, không để phát tán bụi, tiếng ồn, độ rung, ánh sáng vượt quy chuẩn kỹ thuật môi trường; thu gom, xử lý nước thải, bùn thải và chất thải rắn xây dựng theo quy định. 2. Phương tiện vận chuyển vật liệu xây dựng rời phải được che đậy kín; rửa sạch bánh xe trước khi rời công trường đi vào đường giao thông công cộng.',
      },
      {
        id: 'sec-bvmt-102',
        section_type: 'Article',
        section_number: 'Điều 102',
        heading: 'Kiểm soát ô nhiễm không khí và giám sát bụi phát tán',
        content:
          '1. Cơ sở sản xuất, kinh doanh, dịch vụ, công trình xây dựng có phát sinh bụi, khí thải lưu lượng lớn phải lắp đặt hệ thống quan trắc khí thải tự động, liên tục và truyền số liệu trực tiếp về cơ quan quản lý môi trường cấp tỉnh. 2. Bắt buộc thực hiện các biện pháp giảm thiểu bụi tại nguồn và dập bụi trong suốt thời gian thi công.',
      },
      {
        id: 'sec-bvmt-160',
        section_type: 'Article',
        section_number: 'Điều 160',
        heading: 'Trách nhiệm tiếp nhận, xác minh và xử lý phản ánh của người dân về môi trường',
        content:
          '1. Cơ quan quản lý nhà nước về bảo vệ môi trường các cấp có trách nhiệm tổ chức hệ thống tiếp nhận, xác minh, xử lý kịp thời thông tin phản ánh, kiến nghị của tổ chức, cá nhân, cộng đồng dân cư về bảo vệ môi trường. 2. Kết quả kiểm tra, xử lý vi phạm phải được công khai minh bạch cho người dân.',
      },
    ],
  },
  {
    id: 'doc-nd-45-2022',
    title: 'Nghị định quy định về xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường',
    document_number: '45/2022/NĐ-CP',
    authority: 'Chính phủ',
    issued_date: '2022-07-07',
    effective_date: '2022-08-25',
    status: 'ACTIVE',
    source_url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=206126',
    sections: [
      {
        id: 'sec-nd45-15-1a',
        section_type: 'Point',
        section_number: 'Điểm a Khoản 1 Điều 15',
        heading: 'Hành vi không che chắn công trình xây dựng để bụi phát tán',
        content:
          'Phạt tiền từ 10.000.000 đồng đến 15.000.000 đồng đối với hành vi không che chắn hoặc che chắn không bảo đảm yêu cầu kỹ thuật để bụi, vật liệu xây dựng rơi vãi, phát tán ra môi trường xung quanh trong quá trình thi công xây dựng công trình.',
      },
      {
        id: 'sec-nd45-15-1b',
        section_type: 'Point',
        section_number: 'Điểm b Khoản 1 Điều 15',
        heading: 'Hành vi không rửa xe trước khi rời công trường xây dựng',
        content:
          'Phạt tiền từ 15.000.000 đồng đến 25.000.000 đồng đối với hành vi không có trạm rửa xe hoặc không thực hiện rửa sạch bùn đất trên bánh xe và phương tiện vận chuyển trước khi rời công trường thi công đi vào đường giao thông công cộng, gây bụi bẩn đường phố.',
      },
      {
        id: 'sec-nd45-20',
        section_type: 'Article',
        section_number: 'Điều 20',
        heading: 'Vi phạm quy định về xả khí thải, phát tán bụi vượt quy chuẩn kỹ thuật môi trường',
        content:
          'Phạt tiền từ 20.000.000 đồng đến 50.000.000 đồng đối với hành vi phát tán bụi có thông số ô nhiễm vượt quy chuẩn kỹ thuật môi trường xung quanh từ 1,1 đến dưới 1,5 lần. Buộc áp dụng biện pháp khắc phục tình trạng ô nhiễm môi trường trong thời hạn không quá 48 giờ.',
      },
    ],
  },
  {
    id: 'doc-qcvn-05-2023',
    title: 'Quy chuẩn kỹ thuật quốc gia về chất lượng không khí xung quanh',
    document_number: 'QCVN 05:2023/BTNMT',
    authority: 'Bộ Tài nguyên và Môi trường',
    issued_date: '2023-04-15',
    effective_date: '2023-09-12',
    status: 'ACTIVE',
    source_url: 'https://monre.gov.vn',
    sections: [
      {
        id: 'sec-qcvn-tsp',
        section_type: 'Section',
        section_number: 'Mục 2.2',
        heading: 'Giá trị giới hạn các thông số bụi trong không khí xung quanh',
        content:
          'Nồng độ giới hạn thông số Tổng bụi lơ lửng (TSP) trung bình 1 giờ là 300 µg/m³; trung bình 24 giờ là 200 µg/m³. Bụi mịn PM10 trung bình 24 giờ là 100 µg/m³. Bụi siêu mịn PM2.5 trung bình 24 giờ là 50 µg/m³.',
      },
    ],
  },
  {
    id: 'doc-qd-29-2021',
    title: 'Quy định về quản lý và giảm thiểu bụi trong hoạt động xây dựng tại TP.HCM',
    document_number: '29/2021/QĐ-UBND',
    authority: 'Ủy ban Nhân dân TP. Hồ Chí Minh',
    issued_date: '2021-08-30',
    effective_date: '2021-09-10',
    status: 'ACTIVE',
    source_url: 'https://hochiminhcity.gov.vn',
    sections: [
      {
        id: 'sec-qd29-8',
        section_type: 'Article',
        section_number: 'Điều 8',
        heading: 'Yêu cầu lắp đặt hệ thống phun sương và rào chắn dập bụi',
        content:
          'Tất cả các dự án xây dựng công trình dân dụng, hạ tầng kỹ thuật có diện tích sàn xây dựng trên 1.000 m² hoặc giáp ranh khu dân cư phải trang bị hệ thống phun sương dập bụi tự động dọc theo hàng rào bao che và hoạt động liên tục trong các khung giờ thi công cao điểm.',
      },
    ],
  },
];

export const SYSTEM_INSPECTION_TEMPLATES = [
  {
    id: 'tmpl-build-site',
    name: 'Biên bản kiểm tra Kiểm soát Bụi Công trình Xây dựng Đô thị',
    description: 'Áp dụng cho mọi công trình xây dựng dân dụng, thương mại và hạ tầng giao thông đô thị',
    category: 'CONSTRUCTION',
    items: [
      {
        id: 't-item-1',
        label: 'Lắp đặt lưới chắn bụi kín toàn bộ mặt tiền và chu vi tiếp giáp dân cư',
        description: 'Lưới tối thiểu 2-3 lớp, không rách rưới, phủ từ tầng thi công xuống đất',
        required: 1,
        legal_section_id: 'sec-nd45-15-1a',
        sort_order: 1,
      },
      {
        id: 't-item-2',
        label: 'Trạm rửa xe và cầu rửa tự động hoạt động hiệu quả tại cổng ra vào',
        description: 'Phương tiện vận chuyển bùn đất được xịt rửa sạch trước khi lăn bánh ra đường',
        required: 1,
        legal_section_id: 'sec-nd45-15-1b',
        sort_order: 2,
      },
      {
        id: 't-item-3',
        label: 'Vận hành hệ thống phun sương dập bụi tự động dọc hàng rào',
        description: 'Đang hoạt động trong suốt quá trình cẩu tháp, xúc đổ đất cát',
        required: 1,
        legal_section_id: 'sec-qd29-8',
        sort_order: 3,
      },
      {
        id: 't-item-4',
        label: 'Che đậy bạt kín đối với bãi tập kết vật liệu rời (cát, xi măng, xà bần)',
        description: 'Không để vật liệu rời trần phát tán bụi theo gió',
        required: 1,
        legal_section_id: 'sec-bvmt-64',
        sort_order: 4,
      },
      {
        id: 't-item-5',
        label: 'Xe bồn và xe tải chở vật liệu có phủ bạt kín thùng xe',
        description: 'Không chở quá tải, vật liệu không rơi vãi',
        required: 1,
        legal_section_id: 'sec-bvmt-64',
        sort_order: 5,
      },
      {
        id: 't-item-6',
        label: 'Vệ sinh sạch sẽ mặt đường công cộng bán kính 100m quanh cổng dự án',
        description: 'Không đọng vệt bùn đất khô hình thành bụi mịn',
        required: 0,
        legal_section_id: null,
        sort_order: 6,
      },
    ],
  },
  {
    id: 'tmpl-transport',
    name: 'Biên bản kiểm tra Phương tiện Vận chuyển Đất đá & Vật liệu Xây dựng',
    description: 'Kiểm tra đột xuất đoàn xe tải phục vụ san lấp và dự án giao thông',
    category: 'TRANSPORT',
    items: [
      {
        id: 't-item-7',
        label: 'Bạt phủ kín thùng xe 100% không bay bụi trên đường vận chuyển',
        description: 'Bạt trùm qua mép thùng thành xe',
        required: 1,
        legal_section_id: 'sec-bvmt-64',
        sort_order: 1,
      },
      {
        id: 't-item-8',
        label: 'Lốp xe sạch bùn đất khi di chuyển trên tuyến đường đô thị',
        description: 'Đã rửa sạch tại bãi trước khi xuất bến',
        required: 1,
        legal_section_id: 'sec-nd45-15-1b',
        sort_order: 2,
      },
      {
        id: 't-item-9',
        label: 'Không chở vật liệu quá thành thùng quy định',
        description: 'Tuân thủ tải trọng',
        required: 1,
        legal_section_id: null,
        sort_order: 3,
      },
    ],
  },
];

export function ensureSystemConfiguration(): void {
  // 1. Ensure legal corpus system configuration exists
  const legalDocCount = (db.prepare(`SELECT count(*) as c FROM legal_documents`).get() as { c: number })?.c || 0;
  if (legalDocCount === 0) {
    console.log('[System Config] Initializing statutory Vietnamese environmental legal corpus & FTS5 index...');
    for (const doc of SYSTEM_LEGAL_DOCUMENTS) {
      db.prepare(
        `INSERT INTO legal_documents (id, title, document_number, authority, issued_date, effective_date, status, source_url, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
      ).run(doc.id, doc.title, doc.document_number, doc.authority, doc.issued_date, doc.effective_date, doc.status, doc.source_url);

      for (const sec of doc.sections) {
        db.prepare(
          `INSERT INTO legal_sections (id, document_id, section_type, section_number, heading, content)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).run(sec.id, doc.id, sec.section_type, sec.section_number, sec.heading, sec.content);

        db.prepare(
          `INSERT INTO legal_sections_fts (id, document_id, document_title, document_number, heading, section_number, content)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).run(sec.id, doc.id, doc.title, doc.document_number, sec.heading, sec.section_number, sec.content);
      }
    }
  }

  // 2. Ensure regulatory inspection templates system configuration exists
  const tmplCount = (db.prepare(`SELECT count(*) as c FROM inspection_templates`).get() as { c: number })?.c || 0;
  if (tmplCount === 0) {
    console.log('[System Config] Initializing statutory inspection templates and checklist items...');
    for (const tmpl of SYSTEM_INSPECTION_TEMPLATES) {
      db.prepare(
        `INSERT INTO inspection_templates (id, name, description, category, active, created_at)
         VALUES (?, ?, ?, ?, 1, datetime('now'))`
      ).run(tmpl.id, tmpl.name, tmpl.description, tmpl.category);

      for (const itm of tmpl.items) {
        db.prepare(
          `INSERT INTO inspection_template_items (id, template_id, label, description, required, legal_section_id, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).run(itm.id, tmpl.id, itm.label, itm.description, itm.required, itm.legal_section_id, itm.sort_order);
      }
    }
  }
}
