import bcrypt from 'bcryptjs';
import { sqliteClient } from './sqlite-client.js';
import { runMigrations } from './migrate.js';

export function runSeed(): void {
  console.log('🌱 Đang nạp seed data cho DustGuard Community...');
  
  // Đảm bảo bảng đã tồn tại
  runMigrations();

  const passwordHash = bcrypt.hashSync('DustGuard123!', 10);
  const now = new Date().toISOString();
  const subDays = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
  const subHours = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();

  // 1. Seed Users (16 users)
  const usersData = [
    {
      id: 'usr_citizen',
      email: 'citizen@dustguard.local',
      fullName: 'Nguyễn Văn Dân',
      phone: '0901234567',
      role: 'citizen',
      district: 'Quận 7',
      ward: 'Tân Phong',
      bio: 'Người dân sinh sống tại khu vực Phú Mỹ Hưng, quan tâm đến chất lượng không khí.',
      displayIdentity: 'name'
    },
    {
      id: 'usr_member',
      email: 'member@dustguard.local',
      fullName: 'Trần Thị Tình Nguyện',
      phone: '0902345678',
      role: 'community_member',
      district: 'TP. Thủ Đức',
      ward: 'Thảo Điền',
      bio: 'Thành viên CLB Môi Trường Thanh Niên, thường xuyên hỗ trợ xác minh thực địa.',
      displayIdentity: 'name'
    },
    {
      id: 'usr_moderator',
      email: 'moderator@dustguard.local',
      fullName: 'Lê Hoàng Điều Phối',
      phone: '0903456789',
      role: 'moderator',
      district: 'Bình Thạnh',
      ward: 'Phường 25',
      bio: 'Điều phối viên mạng lưới tình nguyện viên và nhóm cộng đồng địa bàn TP.HCM.',
      displayIdentity: 'name'
    },
    {
      id: 'usr_admin',
      email: 'admin@dustguard.local',
      fullName: 'Phạm Quản Trị Hệ Thống',
      phone: '0904567890',
      role: 'admin',
      district: 'Quận 1',
      ward: 'Bến Nghé',
      bio: 'Quản trị viên nền tảng DustGuard Community.',
      displayIdentity: 'name'
    },
    // Thêm 12 người dùng cộng đồng khác
    { id: 'usr_05', email: 'an.tran@example.com', fullName: 'Trần Bình An', phone: '0911000001', role: 'citizen', district: 'Quận 7', ward: 'Tân Phú' },
    { id: 'usr_06', email: 'bao.le@example.com', fullName: 'Lê Gia Bảo', phone: '0911000002', role: 'community_member', district: 'Bình Thạnh', ward: 'Phường 19' },
    { id: 'usr_07', email: 'chi.nguyen@example.com', fullName: 'Nguyễn Kim Chi', phone: '0911000003', role: 'citizen', district: 'TP. Thủ Đức', ward: 'Hiệp Phú' },
    { id: 'usr_08', email: 'dung.pham@example.com', fullName: 'Phạm Tiến Dũng', phone: '0911000004', role: 'community_member', district: 'Quận 2', ward: 'An Phú' },
    { id: 'usr_09', email: 'em.vo@example.com', fullName: 'Võ Thúy Em', phone: '0911000005', role: 'citizen', district: 'Quận 4', ward: 'Phường 3' },
    { id: 'usr_10', email: 'giang.do@example.com', fullName: 'Đỗ Trường Giang', phone: '0911000006', role: 'citizen', district: 'Bình Chánh', ward: 'Bình Hưng' },
    { id: 'usr_11', email: 'hoa.hoang@example.com', fullName: 'Hoàng Quỳnh Hoa', phone: '0911000007', role: 'community_member', district: 'TP. Thủ Đức', ward: 'Linh Chiểu' },
    { id: 'usr_12', email: 'khang.dang@example.com', fullName: 'Đặng Minh Khang', phone: '0911000008', role: 'citizen', district: 'Quận 1', ward: 'Đa Kao' },
    { id: 'usr_13', email: 'linh.bui@example.com', fullName: 'Bùi Mỹ Linh', phone: '0911000009', role: 'citizen', district: 'Quận 7', ward: 'Tân Hưng' },
    { id: 'usr_14', email: 'nam.ngo@example.com', fullName: 'Ngô Hoài Nam', phone: '0911000010', role: 'citizen', district: 'Bình Thạnh', ward: 'Phường 22' },
    { id: 'usr_15', email: 'phuc.ly@example.com', fullName: 'Lý Gia Phúc', phone: '0911000011', role: 'community_member', district: 'TP. Thủ Đức', ward: 'Tăng Nhơn Phú A' },
    { id: 'usr_16', email: 'quynh.vu@example.com', fullName: 'Vũ Như Quỳnh', phone: '0911000012', role: 'citizen', district: 'Quận 3', ward: 'Võ Thị Sáu' }
  ];

  for (const u of usersData) {
    sqliteClient.run(`
      INSERT OR REPLACE INTO users (id, email, phone, password_hash, full_name, role, district, ward, bio, display_identity, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      u.id, 
      u.email, 
      u.phone, 
      passwordHash, 
      u.fullName, 
      u.role, 
      u.district, 
      u.ward || '', 
      u.bio || 'Cư dân tích cực theo dõi môi trường.', 
      u.displayIdentity || 'anonymous', 
      subDays(30), 
      now
    ]);
  }

  // 2. Seed 4 Communities
  const communitiesData = [
    {
      id: 'comm_thuduc',
      name: 'Cộng đồng Không khí sạch Thủ Đức',
      slug: 'thu-duc-clean-air',
      description: 'Mạng lưới người dân và sinh viên theo dõi bụi phát tán từ các đại công trình hạ tầng và vành đai TP. Thủ Đức.',
      district: 'TP. Thủ Đức',
      ward: 'Thảo Điền',
      createdBy: 'usr_moderator',
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'comm_binhthanh',
      name: 'Green Youth Bình Thạnh',
      slug: 'binh-thanh-green-youth',
      description: 'Nhóm thanh niên xung kích giám sát bụi đường và xe bồn chở vật liệu quanh trục Nguyễn Hữu Cảnh và Điện Biên Phủ.',
      district: 'Bình Thạnh',
      ward: 'Phường 25',
      createdBy: 'usr_moderator',
      coverUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'comm_quan7',
      name: 'Cộng đồng Môi trường Quận 7',
      slug: 'quan-7-environment',
      description: 'Nhóm cư dân chia sẻ và đối chiếu tín hiệu bụi từ các công trình xây dựng dọc đại lộ Nguyễn Văn Linh và Nguyễn Hữu Thọ.',
      district: 'Quận 7',
      ward: 'Tân Phong',
      createdBy: 'usr_moderator',
      coverUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'comm_sinhvien',
      name: 'Sinh viên vì Không khí sạch',
      slug: 'sinh-vien-khong-khi-sach',
      description: 'CLB sinh viên các trường Đại học khu vực ĐHQG TP.HCM phối hợp quan sát và lập dữ liệu hiện trường.',
      district: 'TP. Thủ Đức',
      ward: 'Linh Trung',
      createdBy: 'usr_member',
      coverUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60'
    }
  ];

  for (const c of communitiesData) {
    sqliteClient.run(`
      INSERT OR REPLACE INTO communities (id, name, slug, description, cover_url, district, ward, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [c.id, c.name, c.slug, c.description, c.coverUrl, c.district, c.ward, c.createdBy, subDays(25), now]);

    // Thêm các thành viên vào nhóm
    for (const u of usersData.slice(0, 8)) {
      sqliteClient.run(`
        INSERT OR IGNORE INTO community_members (id, community_id, user_id, role, joined_at)
        VALUES (?, ?, ?, ?, ?)
      `, [`cm_${c.id}_${u.id}`, c.id, u.id, u.id === c.createdBy ? 'coordinator' : 'member', subDays(20)]);
    }
  }

  // 3. Seed Cases (15 cases phong phú xung quanh TP.HCM)
  // Trong đó case đầu tiên là sample case DG-C-2026-0842 theo đúng mục 17
  const casesData = [
    {
      id: 'case_0842',
      caseCode: 'DG-C-2026-0842',
      title: 'Bụi phát sinh quanh khu vực công trình Nguyễn Văn Linh',
      summary: 'Hoạt động san lấp và xe ben chở đất cát không rửa bánh khi ra khỏi cổng công trình làm phát tán bụi mù mịt sang làn xe máy.',
      category: 'dust',
      latitude: 10.7301,
      longitude: 106.7082,
      address: 'Đoạn giao Nguyễn Văn Linh & Nguyễn Thị Thập, Phường Tân Phú',
      ward: 'Tân Phú',
      district: 'Quận 7',
      status: 'in_progress',
      priority: 'urgent',
      signalCount: 6,
      uniqueReporterCount: 5,
      firstReportedAt: subDays(4),
      lastActivityAt: subHours(3),
      createdBy: 'usr_moderator'
    },
    {
      id: 'case_0002',
      caseCode: 'DG-C-2026-0112',
      title: 'Vật liệu tập kết ven đường Xô Viết Nghệ Tĩnh gây bụi dày',
      summary: 'Các đống cát đá phục vụ sửa chữa vỉa hè để lộ thiên không bạt che chắn, gió cuốn bụi vào nhà dân và quán ăn ven đường.',
      category: 'construction_material',
      latitude: 10.8035,
      longitude: 106.7118,
      address: 'Gần ngã tư Đài Liệt Sĩ, Xô Viết Nghệ Tĩnh',
      ward: 'Phường 26',
      district: 'Bình Thạnh',
      status: 'community_verifying',
      priority: 'attention',
      signalCount: 4,
      uniqueReporterCount: 3,
      firstReportedAt: subDays(6),
      lastActivityAt: subHours(12),
      createdBy: 'usr_moderator'
    },
    {
      id: 'case_0003',
      caseCode: 'DG-C-2026-0158',
      title: 'Xe chở phế thải xây dựng rơi vãi trên đường Mai Chí Thọ',
      summary: 'Đoàn xe ben chở đất thải từ khu đô thị mới không phủ kín bạt, làm đất rơi thành vệt dài gây bụi trắng xóa khi xe cộ lưu thông.',
      category: 'road_dust',
      latitude: 10.7812,
      longitude: 106.7345,
      address: 'Trục Mai Chí Thọ hướng về Hầm Thủ Thiêm',
      ward: 'An Phú',
      district: 'TP. Thủ Đức',
      status: 'forwarded',
      priority: 'urgent',
      signalCount: 8,
      uniqueReporterCount: 6,
      firstReportedAt: subDays(10),
      lastActivityAt: subDays(1),
      createdBy: 'usr_moderator'
    },
    {
      id: 'case_0004',
      caseCode: 'DG-C-2026-0205',
      title: 'Bãi phế thải xây dựng tự phát tại đường Song Hành',
      summary: 'Tập kết gạch vụn và xà bần tràn ra lề đường, người dân đi ngang qua hít phải bụi xi măng độc hại.',
      category: 'illegal_dumping',
      latitude: 10.8245,
      longitude: 106.7621,
      address: 'Đường Song Hành Xa Lộ Hà Nội, gần Metro',
      ward: 'Trường Thọ',
      district: 'TP. Thủ Đức',
      status: 'resolved',
      priority: 'normal',
      signalCount: 5,
      uniqueReporterCount: 4,
      firstReportedAt: subDays(18),
      lastActivityAt: subDays(2),
      resolvedAt: subDays(2),
      createdBy: 'usr_moderator'
    },
    {
      id: 'case_0005',
      caseCode: 'DG-C-2026-0220',
      title: 'Công trình chung cư cao tầng phát tán bụi sơn và cát',
      summary: 'Không dựng lưới bao che đầy đủ ở các tầng cao từ tầng 15 trở lên, bụi rơi trực tiếp xuống khu dân cư bên dưới.',
      category: 'dust',
      latitude: 10.7415,
      longitude: 106.7154,
      address: 'Đường Nguyễn Thị Thập, Khu dân cư Him Lam',
      ward: 'Tân Hưng',
      district: 'Quận 7',
      status: 'confirmed_signal',
      priority: 'attention',
      signalCount: 5,
      uniqueReporterCount: 4,
      firstReportedAt: subDays(5),
      lastActivityAt: subHours(8),
      createdBy: 'usr_moderator'
    },
    {
      id: 'case_0006',
      caseCode: 'DG-C-2026-0245',
      title: 'Bụi phát tán từ điểm hạ xà bần tại chân cầu Sài Gòn',
      summary: 'Máy xúc bốc dỡ phế liệu không phun nước dập bụi lúc giữa trưa gây khói bụi mờ mịt quanh dạ cầu.',
      category: 'dust',
      latitude: 10.7998,
      longitude: 106.7265,
      address: 'Dạ cầu Sài Gòn, bờ Bình Thạnh',
      ward: 'Phường 22',
      district: 'Bình Thạnh',
      status: 'new',
      priority: 'normal',
      signalCount: 2,
      uniqueReporterCount: 2,
      firstReportedAt: subHours(18),
      lastActivityAt: subHours(5),
      createdBy: 'usr_member'
    },
    {
      id: 'case_0007',
      caseCode: 'DG-C-2026-0290',
      title: 'Đào đường lắp ống cấp nước để bụi kéo dài',
      summary: 'Đoạn đường đào xong lấp tạm bằng đá cấp phối nhưng không tưới nước, xe buýt chạy qua tạo luồng bụi cuốn cao.',
      category: 'road_dust',
      latitude: 10.7712,
      longitude: 106.6987,
      address: 'Đường Nguyễn Thị Minh Khai, góc Trương Định',
      ward: 'Võ Thị Sáu',
      district: 'Quận 3',
      status: 'in_progress',
      priority: 'normal',
      signalCount: 3,
      uniqueReporterCount: 3,
      firstReportedAt: subDays(7),
      lastActivityAt: subDays(1),
      createdBy: 'usr_moderator'
    },
    {
      id: 'case_0008',
      caseCode: 'DG-C-2026-0310',
      title: 'Bãi cát san lấp không che phủ gió lộng ven sông Sài Gòn',
      summary: 'Bãi cát diện tích lớn ven sông gặp gió to thổi bụi cát bay thẳng vào khu trường mầm non gần đó.',
      category: 'construction_material',
      latitude: 10.8123,
      longitude: 106.7456,
      address: 'Đường số 36, Khu phố 6, Linh Đông',
      ward: 'Linh Đông',
      district: 'TP. Thủ Đức',
      status: 'community_verifying',
      priority: 'attention',
      signalCount: 3,
      uniqueReporterCount: 3,
      firstReportedAt: subDays(3),
      lastActivityAt: subHours(6),
      createdBy: 'usr_member'
    },
    {
      id: 'case_0009',
      caseCode: 'DG-C-2026-0340',
      title: 'Cắt gạch vỉa hè không thu gom bụi khô',
      summary: 'Đội thi công dùng máy cắt đá khô tại chỗ không che chắn và không tưới nước, khói bụi trắng bao trùm người đi bộ.',
      category: 'dust',
      latitude: 10.7689,
      longitude: 106.6890,
      address: 'Đường Nguyễn Trãi, gần chợ Bến Thành',
      ward: 'Bến Thành',
      district: 'Quận 1',
      status: 'resolved',
      priority: 'normal',
      signalCount: 4,
      uniqueReporterCount: 4,
      firstReportedAt: subDays(15),
      lastActivityAt: subDays(4),
      resolvedAt: subDays(4),
      createdBy: 'usr_moderator'
    },
    {
      id: 'case_0010',
      caseCode: 'DG-C-2026-0388',
      title: 'Trạm trộn bê tông di động làm vương vãi vữa khô',
      summary: 'Vữa xi măng khô rơi vãi ra mặt đường tạo thành lớp bụi mịn rất nguy hiểm khi trời hanh khô.',
      category: 'road_dust',
      latitude: 10.7256,
      longitude: 106.7210,
      address: 'Đường Huỳnh Tấn Phát, gần cầu Phú Mỹ',
      ward: 'Tân Thuận Đông',
      district: 'Quận 7',
      status: 'confirmed_signal',
      priority: 'attention',
      signalCount: 4,
      uniqueReporterCount: 3,
      firstReportedAt: subDays(8),
      lastActivityAt: subDays(2),
      createdBy: 'usr_moderator'
    },
    {
      id: 'case_0011',
      caseCode: 'DG-C-2026-0412',
      title: 'Xe chở đất làm rơi vãi đất sét khô tại Đỗ Xuân Hợp',
      summary: 'Đất sét rơi từ thùng xe gặp nắng gắt vỡ vụn thành bụi bay mù mịt khi các xe tải lớn đi qua.',
      category: 'road_dust',
      latitude: 10.8201,
      longitude: 106.7789,
      address: 'Đoạn đường Đỗ Xuân Hợp, Phước Long B',
      ward: 'Phước Long B',
      district: 'TP. Thủ Đức',
      status: 'in_progress',
      priority: 'urgent',
      signalCount: 7,
      uniqueReporterCount: 5,
      firstReportedAt: subDays(9),
      lastActivityAt: subHours(10),
      createdBy: 'usr_moderator'
    },
    {
      id: 'case_0012',
      caseCode: 'DG-C-2026-0430',
      title: 'Công trình tháo dỡ nhà cũ không dùng lưới dập bụi',
      summary: 'Đập tường nhà 3 tầng không phun sương tạo đám mây bụi bao trùm toàn bộ hẻm dân cư.',
      category: 'dust',
      latitude: 10.8010,
      longitude: 106.6980,
      address: 'Hẻm 120 đường Bạch Đằng',
      ward: 'Phường 24',
      district: 'Bình Thạnh',
      status: 'forwarded',
      priority: 'urgent',
      signalCount: 6,
      uniqueReporterCount: 5,
      firstReportedAt: subDays(6),
      lastActivityAt: subDays(1),
      createdBy: 'usr_moderator'
    },
    {
      id: 'case_0013',
      caseCode: 'DG-C-2026-0450',
      title: 'Bãi rửa xe bồn xây dựng xả bùn ra đường',
      summary: 'Bùn đất sau khi khô bốc thành bụi dày đặc tại lối ra vào của công trình dự án lớn.',
      category: 'road_dust',
      latitude: 10.7512,
      longitude: 106.7111,
      address: 'Đường Nguyễn Văn Linh, đoạn gần Cầu Đa Khoa',
      ward: 'Tân Phú',
      district: 'Quận 7',
      status: 'new',
      priority: 'normal',
      signalCount: 1,
      uniqueReporterCount: 1,
      firstReportedAt: subHours(12),
      lastActivityAt: subHours(12),
      createdBy: 'usr_citizen'
    },
    {
      id: 'case_0014',
      caseCode: 'DG-C-2026-0480',
      title: 'Cải tạo công viên bờ sông làm phát tán cát bụi',
      summary: 'Máy san nền hoạt động không che chắn bờ kè làm cát bay sang các tòa nhà chung cư đối diện.',
      category: 'dust',
      latitude: 10.7915,
      longitude: 106.7215,
      address: 'Khu vực công viên dạ cầu Thủ Thiêm',
      ward: 'Phường 22',
      district: 'Bình Thạnh',
      status: 'closed',
      priority: 'normal',
      signalCount: 3,
      uniqueReporterCount: 3,
      firstReportedAt: subDays(22),
      lastActivityAt: subDays(12),
      resolvedAt: subDays(14),
      createdBy: 'usr_moderator'
    },
    {
      id: 'case_0015',
      caseCode: 'DG-C-2026-0500',
      title: 'Tập kết bao xi măng rách tại công trình nhà phố',
      summary: 'Các vỏ bao xi măng còn thừa vứt bừa bãi ngoài vỉa hè bị gió thổi làm bột xi măng phát tán.',
      category: 'construction_material',
      latitude: 10.8350,
      longitude: 106.7580,
      address: 'Đường Đặng Văn Bi, Trường Thọ',
      ward: 'Trường Thọ',
      district: 'TP. Thủ Đức',
      status: 'archived',
      priority: 'normal',
      signalCount: 2,
      uniqueReporterCount: 2,
      firstReportedAt: subDays(40),
      lastActivityAt: subDays(30),
      resolvedAt: subDays(30),
      createdBy: 'usr_moderator'
    }
  ];

  for (const c of casesData) {
    sqliteClient.run(`
      INSERT OR REPLACE INTO cases (
        id, case_code, title, summary, category, latitude, longitude, address, ward, district, status, priority,
        signal_count, unique_reporter_count, first_reported_at, last_activity_at, resolved_at, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      c.id, c.caseCode, c.title, c.summary, c.category, c.latitude, c.longitude, c.address, c.ward || '', c.district,
      c.status, c.priority, c.signalCount, c.uniqueReporterCount, c.firstReportedAt, c.lastActivityAt, c.resolvedAt || null,
      c.createdBy, c.firstReportedAt, c.lastActivityAt
    ]);
  }

  // 4. Seed Reports (32 reports)
  const sampleReports: any[] = [
    // Reports liên quan case 0842 (Sample case mục 17)
    {
      id: 'rep_0842_1',
      reportCode: 'DG-C-2026-0001',
      reporterId: 'usr_citizen',
      title: 'Bụi công trình Nguyễn Văn Linh mù mịt vào giờ cao điểm',
      description: 'Chiều nào đi làm về qua đoạn này cũng bị bụi bay cay xè mắt, công trình xe tải ra vào liên tục không có vòi xịt nước.',
      category: 'dust',
      latitude: 10.7302,
      longitude: 106.7081,
      address: 'Giao lộ Nguyễn Văn Linh & Nguyễn Thị Thập',
      district: 'Quận 7',
      ward: 'Tân Phú',
      observedAt: subDays(4),
      status: 'verified',
      severityObservation: 'high',
      caseId: 'case_0842'
    },
    {
      id: 'rep_0842_2',
      reportCode: 'DG-C-2026-0002',
      reporterId: 'usr_05',
      title: 'Xe chở đất từ khu dự án làm rơi vãi đất cát ra đường',
      description: 'Nhiều xe tải cơi nới thùng không che chắn cẩn thận làm cát đổ thành vệt dài tại làn xe máy.',
      category: 'road_dust',
      latitude: 10.7305,
      longitude: 106.7085,
      address: 'Trước cổng dự án lô đất Nguyễn Văn Linh',
      district: 'Quận 7',
      ward: 'Tân Phú',
      observedAt: subDays(4),
      status: 'verified',
      severityObservation: 'medium',
      caseId: 'case_0842'
    },
    {
      id: 'rep_0842_3',
      reportCode: 'DG-C-2026-0003',
      reporterId: 'usr_13',
      title: 'Bụi phát tán làm giảm tầm nhìn của người tham gia giao thông',
      description: 'Lượng bụi phát tán mạnh vào buổi trưa khi gió to, các phương tiện đi qua phải bật đèn sương mù.',
      category: 'dust',
      latitude: 10.7300,
      longitude: 106.7078,
      address: 'Đoạn đường Nguyễn Văn Linh hướng về cầu Tân Thuận',
      district: 'Quận 7',
      ward: 'Tân Phú',
      observedAt: subDays(3),
      status: 'verified',
      severityObservation: 'high',
      caseId: 'case_0842'
    }
  ];

  // Thêm 29 reports khác trải đều các quận
  for (let i = 4; i <= 32; i++) {
    const caseIndex = (i % casesData.length);
    const targetCase = casesData[caseIndex];
    const isLinked = i % 4 !== 0; // Một số report chưa link để moderator verify
    const repStatus = isLinked ? 'verified' : (i % 2 === 0 ? 'submitted' : 'reviewing');
    
    sampleReports.push({
      id: `rep_${1000 + i}`,
      reportCode: `DG-C-2026-${String(i).padStart(4, '0')}`,
      reporterId: usersData[i % usersData.length].id,
      title: `Phản ánh bụi phát sinh tại khu vực ${targetCase.district} (#${i})`,
      description: `Ghi nhận tình trạng khói bụi từ hoạt động thi công và vận chuyển vật liệu tại địa bàn ${targetCase.address}. Kính mong cộng đồng hỗ trợ theo dõi.`,
      category: targetCase.category,
      latitude: targetCase.latitude + (Math.random() - 0.5) * 0.005,
      longitude: targetCase.longitude + (Math.random() - 0.5) * 0.005,
      address: targetCase.address,
      district: targetCase.district,
      ward: targetCase.ward || 'Phường trung tâm',
      observedAt: subDays(Math.floor(i / 2)),
      status: repStatus,
      severityObservation: (i % 3 === 0 ? 'high' : (i % 2 === 0 ? 'medium' : 'low')),
      caseId: isLinked ? targetCase.id : null
    });
  }

  for (const r of sampleReports) {
    sqliteClient.run(`
      INSERT OR REPLACE INTO reports (
        id, report_code, reporter_id, title, description, category, latitude, longitude, address, ward, district,
        observed_at, status, severity_observation, case_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      r.id, r.reportCode, r.reporterId, r.title, r.description, r.category, r.latitude, r.longitude, r.address,
      r.ward, r.district, r.observedAt, r.status, r.severityObservation, r.caseId, r.observedAt, r.observedAt
    ]);

    // Bổ sung ảnh minh chứng demo cho report
    const dummyHash = `a1b2c3d4e5f6${r.id}9876543210abcdef`;
    sqliteClient.run(`
      INSERT OR REPLACE INTO report_media (
        id, report_id, uploaded_by, file_name, file_path, mime_type, file_size, sha256_hash, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      `med_${r.id}`, 
      r.id, 
      r.reporterId, 
      'hien_truong_bui.jpg', 
      'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=60',
      'image/jpeg', 
      1024 * 350, 
      dummyHash, 
      r.observedAt
    ]);

    // Nếu đã link vào case, thêm vào bảng nối case_reports
    if (r.caseId) {
      sqliteClient.run(`
        INSERT OR IGNORE INTO case_reports (id, case_id, report_id, linked_by, created_at)
        VALUES (?, ?, ?, ?, ?)
      `, [`cr_${r.caseId}_${r.id}`, r.caseId, r.id, 'usr_moderator', r.observedAt]);
    }
  }

  // 5. Seed Timeline Updates cho Case 0842 (Theo đúng sample case mục 17)
  const timelineData = [
    {
      caseId: 'case_0842',
      updateType: 'community_update',
      title: 'Phản ánh đầu tiên được ghi nhận',
      content: 'Cộng đồng tiếp nhận phản ánh đầu tiên của người dân về tình trạng bụi tại nút giao Nguyễn Văn Linh.',
      createdAt: subDays(4)
    },
    {
      caseId: 'case_0842',
      updateType: 'community_update',
      title: 'Nhiều tín hiệu tương tự được bổ sung',
      content: 'Hai phản ánh tương tự kèm hình ảnh hiện trường được gửi đến từ cư dân lân cận.',
      createdAt: subDays(3)
    },
    {
      caseId: 'case_0842',
      updateType: 'community_update',
      title: 'Cộng đồng bổ sung hình ảnh thực địa',
      content: 'Thành viên tình nguyện ghi nhận xe tải không rửa lốp khi rời công trình.',
      createdAt: subDays(2)
    },
    {
      caseId: 'case_0842',
      updateType: 'moderator_note',
      title: 'Điều phối viên xác thực vụ việc',
      content: 'Điều phối viên tổng hợp các báo cáo và xác nhận tín hiệu rõ ràng, tạo hồ sơ theo dõi tập trung.',
      createdAt: subDays(1)
    },
    {
      caseId: 'case_0842',
      updateType: 'status_change',
      title: 'Chuyển sang trạng thái đang theo dõi xử lý',
      content: 'Đã liên hệ ban quản lý công trình nhắc nhở tăng cường tưới nước giảm bụi và che bạt xe vận chuyển.',
      createdAt: subHours(3)
    }
  ];

  for (let i = 0; i < timelineData.length; i++) {
    const t = timelineData[i];
    sqliteClient.run(`
      INSERT OR REPLACE INTO case_updates (id, case_id, update_type, title, content, created_by, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [`upd_${t.caseId}_${i}`, t.caseId, t.updateType, t.title, t.content, 'usr_moderator', 1, t.createdAt]);
  }

  // 6. Seed Confirmations ("Tôi cũng ghi nhận" - 80+ records)
  for (let i = 0; i < casesData.length; i++) {
    const c = casesData[i];
    // Cho mỗi case khoảng 4-8 confirmations
    const count = i === 0 ? 14 : Math.min(usersData.length, (i % 6) + 4);
    for (let u = 0; u < count; u++) {
      const user = usersData[u];
      sqliteClient.run(`
        INSERT OR IGNORE INTO confirmations (id, case_id, user_id, created_at)
        VALUES (?, ?, ?, ?)
      `, [`conf_${c.id}_${user.id}`, c.id, user.id, subHours(u * 5 + 1)]);
    }
  }

  // 7. Seed Observations (40+ records)
  const obsTypes = ['still_present', 'reduced', 'resolved', 'additional_evidence', 'cannot_confirm'] as const;
  const obsComments = [
    'Tôi vừa đi ngang lúc 16h, bụi vẫn còn khá nhiều ở làn xe máy.',
    'Sáng nay thấy có xe bồn tưới nước mặt đường, bụi đã giảm bớt một phần.',
    'Công trình đã che bạt xanh phía ngoài, tình hình có cải thiện hơn tuần trước.',
    'Bổ sung ảnh chụp từ tầng 5 chung cư đối diện, thấy bụi phát tán mạnh.',
    'Lúc 11h ghé qua không thấy xe tải hoạt động nữa, tạm thời sạch sẽ.'
  ];

  for (let i = 0; i < 42; i++) {
    const targetCase = casesData[i % casesData.length];
    const user = usersData[i % usersData.length];
    const obsType = obsTypes[i % obsTypes.length];
    const comment = obsComments[i % obsComments.length];
    const obsId = `obs_${100 + i}`;
    
    sqliteClient.run(`
      INSERT OR REPLACE INTO observations (id, case_id, user_id, observation_type, comment, observed_at, latitude, longitude, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [obsId, targetCase.id, user.id, obsType, comment, subHours(i * 3 + 2), targetCase.latitude, targetCase.longitude, subHours(i * 3 + 2)]);

    if (i % 2 === 0) {
      sqliteClient.run(`
        INSERT OR REPLACE INTO observation_media (id, observation_id, file_path, mime_type, file_size, sha256_hash, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        `obs_med_${obsId}`,
        obsId,
        'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=60',
        'image/jpeg',
        1024 * 200,
        `obs_hash_${obsId}`,
        subHours(i * 3 + 2)
      ]);
    }
  }

  // 8. Seed Verification Tasks (12 tasks)
  const tasksData = [
    {
      id: 'task_01',
      caseId: 'case_0842',
      title: 'Kiểm tra tình trạng rửa lốp xe ben tại cổng công trình Nguyễn Văn Linh',
      description: 'Xác nhận xem công trình đã bố trí vòi rửa xe và nhân viên xịt bánh xe trước khi ra khỏi cổng hay chưa.',
      taskType: 'field_check',
      latitude: 10.7301,
      longitude: 106.7082,
      address: 'Đoạn giao Nguyễn Văn Linh & Nguyễn Thị Thập',
      status: 'open',
      assignedTo: null
    },
    {
      id: 'task_02',
      caseId: 'case_0002',
      title: 'Chụp ảnh cập nhật che phủ bạt đống cát đá tại Xô Viết Nghệ Tĩnh',
      description: 'Chụp hình ảnh minh chứng mới nhất để đối chiếu sau khi đơn vị thi công cam kết phủ bạt.',
      taskType: 'photo_update',
      latitude: 10.8035,
      longitude: 106.7118,
      address: 'Gần ngã tư Đài Liệt Sĩ, Xô Viết Nghệ Tĩnh, Bình Thạnh',
      status: 'claimed',
      assignedTo: 'usr_member'
    },
    {
      id: 'task_03',
      caseId: 'case_0003',
      title: 'Kiểm tra vệt đất rơi vãi trên làn xe máy Mai Chí Thọ',
      description: 'Đối chiếu xem đơn vị dọn vệ sinh đã quét sạch lớp bùn đất khô hay chưa.',
      taskType: 'status_check',
      latitude: 10.7812,
      longitude: 106.7345,
      address: 'Trục Mai Chí Thọ hướng về Hầm Thủ Thiêm',
      status: 'completed',
      assignedTo: 'usr_06'
    },
    {
      id: 'task_04',
      caseId: 'case_0005',
      title: 'Chụp góc rộng lưới bao che chung cư cao tầng Him Lam',
      description: 'Ghi lại hình ảnh các tầng cao xem lưới chống bụi đã được kéo kín toàn bộ hay chưa.',
      taskType: 'photo_update',
      latitude: 10.7415,
      longitude: 106.7154,
      address: 'Đường Nguyễn Thị Thập, Khu dân cư Him Lam, Q7',
      status: 'open',
      assignedTo: null
    },
    {
      id: 'task_05',
      caseId: 'case_0008',
      title: 'Kiểm tra bãi cát san lấp ven sông Linh Đông lúc gió chiều',
      description: 'Quan sát hướng gió và mức độ cát bay về phía khu dân cư và trường học lân cận.',
      taskType: 'field_check',
      latitude: 10.8123,
      longitude: 106.7456,
      address: 'Đường số 36, Linh Đông, TP. Thủ Đức',
      status: 'open',
      assignedTo: null
    }
  ];

  for (const t of tasksData) {
    sqliteClient.run(`
      INSERT OR REPLACE INTO verification_tasks (
        id, case_id, title, description, task_type, latitude, longitude, address, assigned_to, status, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      t.id, t.caseId, t.title, t.description, t.taskType, t.latitude, t.longitude, t.address,
      t.assignedTo, t.status, 'usr_moderator', subDays(2), now
    ]);

    if (t.status === 'completed') {
      sqliteClient.run(`
        INSERT OR REPLACE INTO task_submissions (id, task_id, user_id, result, note, submitted_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        `sub_${t.id}`,
        t.id,
        t.assignedTo || 'usr_member',
        'confirmed',
        'Đã kiểm tra hiện trường, đơn vị đã cho quét sạch lớp đất khô và không còn phát sinh bụi mù.',
        subHours(4)
      ]);
    }
  }

  // 9. Seed Community Posts & Comments
  for (const c of communitiesData) {
    const postId = `post_${c.id}_1`;
    sqliteClient.run(`
      INSERT OR REPLACE INTO posts (id, community_id, author_id, post_type, title, content, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      postId,
      c.id,
      c.createdBy,
      'announcement',
      `Kế hoạch phối hợp theo dõi các điểm nóng bụi quý này tại ${c.district}`,
      'Chào các thành viên, chúng ta sẽ tập trung hỗ trợ ghi nhận và xác minh các tín hiệu bụi từ các trục đường chính. Hãy cùng nhau bổ sung quan sát khi có dịp đi qua nhé!',
      'published',
      subDays(5),
      subDays(5)
    ]);

    sqliteClient.run(`
      INSERT OR REPLACE INTO comments (id, post_id, user_id, content, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [`cmt_${postId}_1`, postId, 'usr_citizen', 'Rất hoan nghênh sáng kiến này, mình sẽ chú ý chụp ảnh các điểm quanh khu vực mình ở.', 'visible', subDays(4), subDays(4)]);
  }

  // 10. Seed Notifications (20+ notifications)
  for (let i = 0; i < 20; i++) {
    const user = usersData[i % 4]; // Ưu tiên 4 user chính
    sqliteClient.run(`
      INSERT OR REPLACE INTO notifications (id, user_id, type, title, message, entity_type, entity_id, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      `notif_${i}`,
      user.id,
      i % 2 === 0 ? 'case_update' : 'observation',
      i % 2 === 0 ? 'Vụ việc bạn theo dõi vừa có cập nhật mới' : 'Có quan sát mới tại khu vực của bạn',
      i % 2 === 0 ? 'Công trình Nguyễn Văn Linh đã bổ sung biện pháp dọn dẹp mặt đường.' : 'Thành viên cộng đồng vừa đăng ảnh xác thực hiện trường.',
      'case',
      'case_0842',
      i > 10 ? 1 : 0,
      subHours(i * 4 + 1)
    ]);
  }

  // 11. Seed Saved Cases
  sqliteClient.run(`
    INSERT OR IGNORE INTO saved_cases (id, case_id, user_id, created_at)
    VALUES ('save_1', 'case_0842', 'usr_citizen', '${subDays(3)}'),
           ('save_2', 'case_0002', 'usr_citizen', '${subDays(2)}'),
           ('save_3', 'case_0003', 'usr_citizen', '${subDays(1)}')
  `);

  // 12. Seed User Contributions
  sqliteClient.run(`
    INSERT OR IGNORE INTO user_contributions (id, user_id, type, entity_id, status, created_at)
    VALUES ('uc_1', 'usr_citizen', 'report', 'rep_0842_1', 'accepted', '${subDays(4)}'),
           ('uc_2', 'usr_citizen', 'confirmation', 'conf_case_0842_usr_citizen', 'accepted', '${subDays(3)}'),
           ('uc_3', 'usr_citizen', 'observation', 'obs_100', 'accepted', '${subDays(2)}')
  `);

  // 13. Seed Audit Logs
  sqliteClient.run(`
    INSERT OR IGNORE INTO audit_logs (id, actor_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
    VALUES 
      ('aud_1', 'usr_citizen', 'LOGIN', 'user', 'usr_citizen', '{"role":"citizen"}', '127.0.0.1', '${subDays(4)}'),
      ('aud_2', 'usr_citizen', 'CREATE_REPORT', 'report', 'rep_0842_1', '{"title":"Bụi công trình Nguyễn Văn Linh"}', '127.0.0.1', '${subDays(4)}'),
      ('aud_3', 'usr_moderator', 'VERIFY_REPORT', 'report', 'rep_0842_1', '{"action":"create_case"}', '127.0.0.1', '${subDays(3)}'),
      ('aud_4', 'usr_moderator', 'CREATE_CASE', 'case', 'case_0842', '{"code":"DG-C-2026-0842"}', '127.0.0.1', '${subDays(3)}'),
      ('aud_5', 'usr_moderator', 'CHANGE_CASE_STATUS', 'case', 'case_0842', '{"old":"new","new":"in_progress"}', '127.0.0.1', '${subHours(3)}')
  `);

  console.log('✅ Đã nạp thành công toàn bộ Seed Data phong phú cho DustGuard Community!');
}

// Cho phép chạy trực tiếp từ CLI
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  runSeed();
}
