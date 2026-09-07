import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const now = new Date();
const isoNow = now.toISOString();
const hMinus1 = new Date(Date.now() - 3600 * 1000).toISOString();
const hMinus4 = new Date(Date.now() - 4 * 3600 * 1000).toISOString();
const hMinus12 = new Date(Date.now() - 12 * 3600 * 1000).toISOString();
const dMinus1 = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
const dMinus2 = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
const dMinus3 = new Date(Date.now() - 72 * 3600 * 1000).toISOString();

console.log('🌱 [Seed Pipeline] Khởi tạo dữ liệu demo 6 Case thực tế chuẩn hóa theo Pipeline...');

const cases = [
  // 1. Case NEW
  {
    caseId: 'cas_pipeline_001',
    caseCode: 'DG-C-2026-1001',
    reportId: 'rep_pipeline_001',
    reportCode: 'DG-R-2026-1001',
    title: 'Bụi phát tán từ công trường cải tạo mặt đường Nguyễn Văn Linh',
    summary: 'Xe ben ra vào liên tục không rửa sạch bánh xe, gây bụi mù mịt suốt 300m đường dân sinh. Đã ghi nhận tín hiệu và tạo hồ sơ theo dõi.',
    category: 'road_dust',
    address: 'Đoạn đường Nguyễn Văn Linh, Phường Tân Thuận Tây',
    district: 'Quận 7',
    lat: 10.7825,
    lng: 106.6980,
    status: 'new',
    opsStatus: 'NEW',
    priority: 'normal',
    opsPriority: 'NORMAL',
    staffId: null,
    staffName: null,
    reporterId: 'usr_citizen',
    createdTime: hMinus1,
    timeline: [
      { event: 'CASE_CREATED', stage: 'INTAKE', desc: 'Người dân gửi phản ánh hiện trường. Hệ thống tự động đối soát vị trí và lập hồ sơ theo dõi #DG-C-2026-1001.', time: hMinus1 }
    ]
  },

  // 2. Case NEEDS_EVIDENCE
  {
    caseId: 'cas_pipeline_002',
    caseCode: 'DG-C-2026-1002',
    reportId: 'rep_pipeline_002',
    reportCode: 'DG-R-2026-1002',
    title: 'Tập kết cát sỏi lộ thiên không che phủ bạt tại KDC Nam Long',
    summary: 'Đống vật liệu xây dựng lớn tập kết sát vỉa hè, gió thổi bụi bay vào khu vực dân cư. Cần bổ sung thêm hình ảnh góc rộng để đánh giá quy mô.',
    category: 'construction_material',
    address: 'Đường Trần Trọng Cung, Phường Tân Thuận Đông',
    district: 'Quận 7',
    lat: 10.7745,
    lng: 106.7120,
    status: 'community_verifying',
    opsStatus: 'TRIAGED',
    priority: 'normal',
    opsPriority: 'NORMAL',
    staffId: null,
    staffName: null,
    reporterId: 'usr_citizen',
    createdTime: hMinus4,
    timeline: [
      { event: 'CASE_CREATED', stage: 'INTAKE', desc: 'Tiếp nhận thông tin phản ánh về bãi tập kết cát không che chắn.', time: hMinus4 },
      { event: 'EVIDENCE_REQUESTED', stage: 'TRIAGE', desc: 'Hồ sơ đã được phân loại sơ bộ. Cần bổ sung thêm hình ảnh hiện trường góc chụp rõ ràng hơn.', time: hMinus1 }
    ]
  },

  // 3. Case READY_FOR_ASSIGNMENT (Khẩn cấp / Ưu tiên cao)
  {
    caseId: 'cas_pipeline_003',
    caseCode: 'DG-C-2026-1003',
    reportId: 'rep_pipeline_003',
    reportCode: 'DG-R-2026-1003',
    title: 'Bụi phát tán đặc quánh gần Trường Tiểu học Lê Văn Tám',
    summary: 'Công trình đào đắp hố móng không lắp rào chắn bụi, cự ly chỉ cách cổng trường học 45m. Nhiều phụ huynh cùng ghi nhận trong buổi sáng.',
    category: 'dust',
    address: 'Đường Huỳnh Tấn Phát, Phường Tân Thuận Đông',
    district: 'Quận 7',
    lat: 10.7680,
    lng: 106.7250,
    status: 'confirmed_signal',
    opsStatus: 'TRIAGED',
    priority: 'urgent',
    opsPriority: 'URGENT',
    staffId: null,
    staffName: null,
    reporterId: 'usr_member',
    createdTime: hMinus12,
    timeline: [
      { event: 'CASE_CREATED', stage: 'INTAKE', desc: 'Ghi nhận tín hiệu bụi gần khu vực trường học qua 4 lượt phản ánh liên tiếp.', time: hMinus12 },
      { event: 'PRIORITY_EVALUATED', stage: 'EVALUATION', desc: 'Đánh giá Dust Risk Score đạt 86/100 (cự ly gần trường học < 50m). Sẵn sàng phân công cán bộ thanh tra.', time: hMinus4 }
    ]
  },

  // 4. Case ASSIGNED (Đã phân công cán bộ)
  {
    caseId: 'cas_pipeline_004',
    caseCode: 'DG-C-2026-1004',
    reportId: 'rep_pipeline_004',
    reportCode: 'DG-R-2026-1004',
    title: 'Bụi đá và xi măng từ trạm trộn bê tông Phú Mỹ',
    summary: 'Trạm trộn hoạt động trong giờ cao điểm làm phát tán bụi xi măng ra đường Hoàng Quốc Việt. Đã phân công cán bộ chuyên trách phụ trách.',
    category: 'dust',
    address: 'Đường Hoàng Quốc Việt, Phường Phú Mỹ',
    district: 'Quận 7',
    lat: 10.7410,
    lng: 106.7150,
    status: 'forwarded',
    opsStatus: 'ASSIGNED',
    priority: 'urgent',
    opsPriority: 'HIGH',
    staffId: 'usr_ops_field',
    staffName: 'Cán bộ Hiện trường',
    reporterId: 'usr_citizen',
    createdTime: dMinus1,
    timeline: [
      { event: 'CASE_CREATED', stage: 'INTAKE', desc: 'Người dân gửi hình ảnh trạm trộn xả bụi.', time: dMinus1 },
      { event: 'STAFF_ASSIGNED', stage: 'ASSIGNMENT', desc: 'Lãnh đạo điều phối phân công Cán bộ Hiện trường (usr_ops_field) thụ lý.', time: hMinus12 }
    ]
  },

  // 5. Case IN_PROGRESS (Đang xử lý hiện trường)
  {
    caseId: 'cas_pipeline_005',
    caseCode: 'DG-C-2026-1005',
    reportId: 'rep_pipeline_005',
    reportCode: 'DG-R-2026-1005',
    title: 'Bụi tháo dỡ công trình nhà xưởng số 154 Bùi Văn Ba',
    summary: 'Tháo dỡ kết cấu cũ phát sinh bụi gạch vữa. Cán bộ đã xuống hiện trường lập biên bản và yêu cầu đơn vị thi công bố trí xe bồn tưới nước.',
    category: 'dust',
    address: '154 Bùi Văn Ba, Phường Tân Thuận Đông',
    district: 'Quận 7',
    lat: 10.7620,
    lng: 106.7320,
    status: 'in_progress',
    opsStatus: 'INSPECTION_IN_PROGRESS',
    priority: 'normal',
    opsPriority: 'NORMAL',
    staffId: 'usr_ops_staff1',
    staffName: 'Cán bộ Giám sát',
    reporterId: 'usr_member',
    createdTime: dMinus2,
    timeline: [
      { event: 'CASE_CREATED', stage: 'INTAKE', desc: 'Tiếp nhận phản ánh bụi từ công trình tháo dỡ.', time: dMinus2 },
      { event: 'STAFF_ASSIGNED', stage: 'ASSIGNMENT', desc: 'Chuyển thông tin tới cán bộ phụ trách địa bàn.', time: dMinus1 },
      { event: 'INSPECTION_CONDUCTED', stage: 'PROCESSING', desc: 'Cán bộ kiểm tra thực địa. Nhà thầu đã cam kết quây bạt kín và bổ sung vòi phun sương.', time: hMinus4 }
    ]
  },

  // 6. Case RESOLVED (Đã có kết quả & Nghiệm thu)
  {
    caseId: 'cas_pipeline_006',
    caseCode: 'DG-C-2026-1006',
    reportId: 'rep_pipeline_006',
    reportCode: 'DG-R-2026-1006',
    title: 'Bụi xe chở đất đá tuyến đường Nguyễn Thị Thập',
    summary: 'Tình trạng bụi đã được kiểm soát triệt để. Nhà thầu đã lắp đặt cầu rửa xe tự động tại cổng ra và tổ chức xe bồn quét rửa đường 3 lượt/ngày.',
    category: 'road_dust',
    address: 'Đoạn ngã tư Nguyễn Thị Thập - Nguyễn Văn Linh',
    district: 'Quận 7',
    lat: 10.7710,
    lng: 106.7050,
    status: 'resolved',
    opsStatus: 'READY_TO_CLOSE',
    priority: 'normal',
    opsPriority: 'NORMAL',
    staffId: 'usr_ops_field',
    staffName: 'Cán bộ Hiện trường',
    reporterId: 'usr_citizen',
    createdTime: dMinus3,
    timeline: [
      { event: 'CASE_CREATED', stage: 'INTAKE', desc: 'Ghi nhận phản ánh bụi kéo dài trên đường Nguyễn Thị Thập.', time: dMinus3 },
      { event: 'STAFF_ASSIGNED', stage: 'ASSIGNMENT', desc: 'Phân công cán bộ kiểm tra phối hợp với ban quản lý dự án.', time: dMinus2 },
      { event: 'REMEDIATION_SUBMITTED', stage: 'REMEDIATION', desc: 'Nhà thầu gửi báo cáo khắc phục: Đã lắp trạm rửa xe và quây bạt phủ 100%.', time: dMinus1 },
      { event: 'CASE_RESOLVED', stage: 'RESULT', desc: 'Nghiệm thu thực tế đạt chuẩn môi trường không khí QCVN 05. Hồ sơ hoàn tất kết quả.', time: hMinus1 }
    ]
  }
];

let sql = `-- ==============================================================================
-- DUSTGUARD VN — SEED SHOWCASE PIPELINE (6 CASES THỰC TẾ)
-- ==============================================================================
`;

// Đảm bảo có users và ops_users chuẩn
sql += `
INSERT OR IGNORE INTO users (id, email, password_hash, full_name, role, status, district, ward, created_at, updated_at)
VALUES 
  ('usr_citizen', 'citizen@dustguard.vn', '$2a$10$wN1kCqX6fN98wJk6bN8Z0OH3vX.J8O8J8O8J8O8J8O8J8O8J8O8J8', 'Nguyễn Văn Dân', 'citizen', 'active', 'Quận 7', 'Tân Thuận Tây', '${isoNow}', '${isoNow}'),
  ('usr_member', 'member@dustguard.vn', '$2a$10$wN1kCqX6fN98wJk6bN8Z0OH3vX.J8O8J8O8J8O8J8O8J8O8J8O8J8', 'Trần Thị Tình Nguyện', 'community_member', 'active', 'Quận 7', 'Tân Thuận Đông', '${isoNow}', '${isoNow}');
`;

for (const c of cases) {
  // 1. Cases (Side A)
  sql += `
INSERT OR REPLACE INTO cases (
  id, case_code, title, summary, category, latitude, longitude,
  address, ward, district, city, status, priority, signal_count,
  unique_reporter_count, first_reported_at, last_activity_at,
  created_by, created_at, updated_at
) VALUES (
  '${c.caseId}', '${c.caseCode}', '${c.title.replace(/'/g, "''")}', '${c.summary.replace(/'/g, "''")}',
  '${c.category}', ${c.lat}, ${c.lng}, '${c.address.replace(/'/g, "''")}', 'Tân Thuận Tây',
  '${c.district}', 'TP. Hồ Chí Minh', '${c.status}', '${c.priority}', 1, 1,
  '${c.createdTime}', '${isoNow}', 'usr_citizen', '${c.createdTime}', '${isoNow}'
);
`;

  // 2. Reports (Observation ban đầu)
  sql += `
INSERT OR REPLACE INTO reports (
  id, report_code, reporter_id, title, description, category, latitude, longitude,
  address, ward, district, city, observed_at, visibility, status, severity_observation,
  source, case_id, created_at, updated_at
) VALUES (
  '${c.reportId}', '${c.reportCode}', 'usr_citizen', '${c.title.replace(/'/g, "''")}',
  '${c.summary.replace(/'/g, "''")}', '${c.category}', ${c.lat}, ${c.lng},
  '${c.address.replace(/'/g, "''")}', 'Tân Thuận Tây', '${c.district}', 'TP. Hồ Chí Minh',
  '${c.createdTime}', 'public', '${c.status === 'new' ? 'submitted' : c.status === 'resolved' ? 'verified' : 'reviewing'}',
  '${c.priority === 'urgent' ? 'high' : 'medium'}', 'citizen', '${c.caseId}',
  '${c.createdTime}', '${isoNow}'
);
`;

  // 3. Liên kết case_reports
  sql += `
INSERT OR REPLACE INTO case_reports (id, case_id, report_id, linked_by, created_at)
VALUES ('cr_${c.caseId.substring(4)}', '${c.caseId}', '${c.reportId}', 'usr_citizen', '${c.createdTime}');
`;

  // 4. Ops Cases (Side B)
  sql += `
INSERT OR REPLACE INTO ops_cases (
  id, case_code, title, description, location_text, district, latitude, longitude,
  source, source_reference, source_report_count, status, priority,
  assigned_staff_id, created_at, updated_at
) VALUES (
  '${c.caseId}', '${c.caseCode}', '${c.title.replace(/'/g, "''")}', '${c.summary.replace(/'/g, "''")}',
  '${c.address.replace(/'/g, "''")}', '${c.district}', ${c.lat}, ${c.lng},
  'COMMUNITY', '${c.reportId}', 1, '${c.opsStatus}', '${c.opsPriority}',
  ${c.staffId ? `'${c.staffId}'` : 'NULL'}, '${c.createdTime}', '${isoNow}'
);
`;

  // 5. Cross Side Handoffs
  sql += `
INSERT OR REPLACE INTO cross_side_handoffs (
  id, community_case_id, operations_case_id, case_code, status, forwarded_by, forwarded_at, synced_at
) VALUES (
  'csh_${c.caseId.substring(4)}', '${c.caseId}', '${c.caseId}', '${c.caseCode}',
  'FORWARDED', 'usr_citizen', '${c.createdTime}', '${isoNow}'
);
`;

  // 6. Phân công cán bộ nếu có
  if (c.staffId) {
    sql += `
INSERT OR REPLACE INTO ops_staff_assignments (
  id, case_id, staff_user_id, assigned_by, assignment_type, status, assigned_at
) VALUES (
  'sa_${c.caseId.substring(4)}', '${c.caseId}', '${c.staffId}', 'usr_ops_admin', 'PRIMARY', 'ACTIVE', '${c.createdTime}'
);
`;
  }

  // 7. Timeline events
  for (let idx = 0; idx < c.timeline.length; idx++) {
    const ev = c.timeline[idx];
    sql += `
INSERT OR REPLACE INTO ops_case_timeline (
  id, case_id, event_type, actor_name, actor_role, stage, description, created_at
) VALUES (
  'otl_${c.caseId.substring(4)}_${idx}', '${c.caseId}', '${ev.event}', 'Hệ thống DustGuard',
  'SYSTEM', '${ev.stage}', '${ev.desc.replace(/'/g, "''")}', '${ev.time}'
);
`;
  }
}

const tempFile = path.join(rootDir, 'temp_pipeline_seed.sql');
fs.writeFileSync(tempFile, sql, 'utf8');

try {
  console.log('📦 Đang nạp vào D1 remote database...');
  execSync('npx wrangler d1 execute dustguard-production --remote --file=temp_pipeline_seed.sql', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('✅ Đã nạp thành công 6 Case Pipeline vào D1 Cloudflare Edge!');
} catch (err) {
  console.warn('⚠️ Nạp D1 remote gặp lỗi hoặc đang chạy offline:', err.message);
}

try {
  const { DatabaseSync } = await import('node:sqlite');
  const localDbPath = path.join(rootDir, 'data', 'dustguard-community.db');
  if (fs.existsSync(localDbPath)) {
    const db = new DatabaseSync(localDbPath);
    db.exec(sql);
    db.close();
    console.log('✅ Đã nạp thành công 6 Case Pipeline vào local SQLite (dustguard-community.db)!');
  }
} catch (err) {
  console.warn('⚠️ Nạp local SQLite gặp lỗi:', err.message);
} finally {
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
}
