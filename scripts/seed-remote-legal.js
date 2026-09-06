import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const legalSql = `
-- Seed Legal Documents
INSERT OR IGNORE INTO legal_documents (id, title, document_number, authority, issued_date, effective_date, status, source_url, created_at)
VALUES
('doc-nd45-2022', 'Quy định về xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường', '45/2022/NĐ-CP', 'Chính phủ', '2022-07-07', '2022-08-25', 'ACTIVE', 'https://vanban.chinhphu.vn', datetime('now')),
('doc-qcvn-05-2023', 'Quy chuẩn kỹ thuật quốc gia về chất lượng không khí xung quanh', 'QCVN 05:2023/BTNMT', 'Bộ Tài nguyên và Môi trường', '2023-04-14', '2023-06-01', 'ACTIVE', 'https://monre.gov.vn', datetime('now')),
('doc-qd-29-ubnd', 'Quy định về quản lý và kiểm soát bụi tại các công trình xây dựng trên địa bàn TP. Hồ Chí Minh', '29/2021/QĐ-UBND', 'Ủy ban nhân dân TP. Hồ Chí Minh', '2021-08-30', '2021-09-10', 'ACTIVE', 'https://hochiminhcity.gov.vn', datetime('now'));

-- Seed Legal Sections
INSERT OR IGNORE INTO legal_sections (id, document_id, section_type, section_number, heading, content)
VALUES
('sec-nd45-20', 'doc-nd45-2022', 'Article', 'Điều 20', 'Vi phạm quy định về xả khí thải, phát tán bụi vượt quy chuẩn kỹ thuật môi trường', 'Phạt tiền từ 20.000.000 đồng đến 50.000.000 đồng đối với hành vi phát tán bụi có thông số ô nhiễm vượt quy chuẩn kỹ thuật môi trường xung quanh từ 1,1 đến dưới 1,5 lần. Buộc áp dụng biện pháp khắc phục tình trạng ô nhiễm môi trường trong thời hạn không quá 48 giờ.'),
('sec-qcvn-dust-limits', 'doc-qcvn-05-2023', 'Section', 'Mục 2.2', 'Giá trị giới hạn các thông số bụi trong không khí xung quanh', 'Giá trị giới hạn tối đa cho phép nồng độ bụi trong không khí xung quanh: Bụi tổng số (TSP) trung bình 24 giờ là 200 µg/m³, trung bình 1 giờ là 300 µg/m³; Bụi mịn PM10 trung bình 24 giờ là 100 µg/m³; Bụi siêu mịn PM2.5 trung bình 24 giờ là 50 µg/m³.'),
('sec-qd29-8', 'doc-qd-29-ubnd', 'Article', 'Điều 8', 'Yêu cầu lắp đặt hệ thống phun sương và rào chắn dập bụi', 'Tất cả các dự án xây dựng công trình dân dụng, hạ tầng kỹ thuật có diện tích sàn xây dựng trên 1.000 m² hoặc giáp ranh khu dân cư phải trang bị hệ thống phun sương dập bụi tự động dọc theo hàng rào bao che và hoạt động liên tục trong các khung giờ thi công cao điểm.');

-- Populate FTS5 Index
INSERT INTO legal_sections_fts (id, document_id, section_number, heading, content)
SELECT id, document_id, section_number, heading, content FROM legal_sections
WHERE id NOT IN (SELECT id FROM legal_sections_fts);
`;

const tempSqlPath = path.join(rootDir, 'temp_legal_seed.sql');
fs.writeFileSync(tempSqlPath, legalSql, 'utf8');

console.log('📜 Đang nạp cơ sở tri thức Pháp lý vào Remote D1 dustguard-production...');
try {
  execSync('npx wrangler d1 execute dustguard-production --remote --file=temp_legal_seed.sql', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('✅ Nạp dữ liệu pháp lý vào Remote D1 thành công!');
} finally {
  if (fs.existsSync(tempSqlPath)) {
    fs.unlinkSync(tempSqlPath);
  }
}
