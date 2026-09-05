import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 BẮT ĐẦU KIỂM TOÁN HIỆU NĂNG TRUY VẤN (EXPLAIN QUERY PLAN & INDEX AUDIT)...');

// 1. Kiểm toán Side A (Community DB)
const dbPathA = path.join(rootDir, 'data', 'dustguard-community.db');
const dbA = new DatabaseSync(dbPathA);

console.log('\n--- [SIDE A: DUSTGUARD COMMUNITY DB] ---');
const tablesA = dbA.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map(r => r.name);
console.log('Danh mục bảng Side A:', tablesA);

const queriesA = [
  {
    name: 'Danh sách phản ánh phân trang kèm quận huyện & trạng thái',
    sql: `EXPLAIN QUERY PLAN SELECT * FROM reports WHERE status = 'submitted' AND district = 'Quận 7' ORDER BY created_at DESC LIMIT 20`
  },
  {
    name: 'Liên kết vụ việc và báo cáo (Case Reports N-N)',
    sql: `EXPLAIN QUERY PLAN SELECT * FROM case_reports WHERE case_id = 'case_01' AND report_id = 'rep_01'`
  },
  {
    name: 'Hàng đợi kiểm duyệt điều phối viên',
    sql: `EXPLAIN QUERY PLAN SELECT r.* FROM reports r WHERE r.status IN ('submitted', 'reviewing') ORDER BY r.created_at ASC`
  },
  {
    name: 'Thống kê quan sát hiện trường theo vụ việc',
    sql: `EXPLAIN QUERY PLAN SELECT * FROM observations WHERE case_id = 'case_01' ORDER BY observed_at DESC`
  }
];

for (const q of queriesA) {
  console.log(`\n📌 Truy vấn: ${q.name}`);
  const plan = dbA.prepare(q.sql).all();
  console.log(plan.map(p => `   -> detail: ${p.detail}`).join('\n'));
}

// 2. Kiểm toán Side B (Operations DB)
const dbPathB = path.join(rootDir, 'dustguard-operations', 'data', 'dustguard-operations.db');
const dbB = new DatabaseSync(dbPathB);

console.log('\n--- [SIDE B: DUSTGUARD OPERATIONS DB] ---');
const tablesB = dbB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map(r => r.name);
console.log('Danh mục bảng Side B:', tablesB);

const queriesB = [
  {
    name: 'Lọc danh sách vụ việc theo trạng thái & cán bộ thụ lý (Indexed Filter)',
    sql: `EXPLAIN QUERY PLAN SELECT c.* FROM cases c WHERE c.status = 'NEW' AND c.assigned_staff_id = 'usr-staff-1' ORDER BY c.created_at DESC`
  },
  {
    name: 'Tra cứu toàn văn điều khoản pháp luật FTS5 (BM25 Index)',
    sql: `EXPLAIN QUERY PLAN SELECT fts.id, fts.heading FROM legal_sections_fts fts WHERE legal_sections_fts MATCH 'bụi OR "che chắn"' ORDER BY rank LIMIT 10`
  },
  {
    name: 'Tổng hợp đợt kiểm tra hiện trường theo vụ việc',
    sql: `EXPLAIN QUERY PLAN SELECT i.* FROM inspections i WHERE i.case_id = 'case-023' ORDER BY i.created_at DESC`
  },
  {
    name: 'Kiểm tra tệp bằng chứng hiện trường theo mã băm SHA-256 (Index Optimization)',
    sql: `EXPLAIN QUERY PLAN SELECT * FROM evidence_assets WHERE sha256 = '438c3971c474661c74cb1f2c4d1b4d0bda8c5c7fad79bcc1fdae2d3f9a31eef7'`
  },
  {
    name: 'Lọc lệnh khắc phục vi phạm quá hạn SLA 48h (Index Optimization)',
    sql: `EXPLAIN QUERY PLAN SELECT ca.* FROM corrective_actions ca WHERE ca.status IN ('OPEN', 'IN_PROGRESS') AND ca.due_at < datetime('now')`
  },
  {
    name: 'Lọc lệnh khắc phục vi phạm theo case_id',
    sql: `EXPLAIN QUERY PLAN SELECT * FROM corrective_actions WHERE case_id = 'case-023'`
  }
];

for (const q of queriesB) {
  console.log(`\n📌 Truy vấn: ${q.name}`);
  const plan = dbB.prepare(q.sql).all();
  console.log(plan.map(p => `   -> detail: ${p.detail}`).join('\n'));
}

console.log('\n✅ HOÀN TẤT KIỂM TOÁN EXPLAIN QUERY PLAN TRÊN CẢ 2 PHÂN HỆ!');
