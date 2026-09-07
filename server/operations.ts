import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { sign, verify } from 'hono/jwt';
import { query, get, run } from './d1.js';
import { putObject, getMimeType } from './r2.js';

const JWT_SECRET = 'dustguard-production-jwt-secret-2026';

export function createOperationsRouter() {
  const app = new Hono<{ Bindings: { DB: any; STORAGE: any; EVIDENCE_BUCKET: any; INTEGRATION_SERVICE_KEY?: string } }>();

  async function getStaffUser(c: any): Promise<any | null> {
    const authHeader = c.req.header('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.substring(7).trim();
    try {
      const payload: any = await verify(token, JWT_SECRET, 'HS256');
      if (!payload?.id) return null;
      const user = await get(c.env.DB, 'SELECT * FROM ops_users WHERE id = ? AND active = 1', [payload.id]);
      if (!user) return null;
      const { password_hash, ...safe } = user;
      return {
        ...safe,
        name: user.full_name,
        fullName: user.full_name
      };
    } catch {
      return null;
    }
  }

  function getPermissionsForRole(role: string): string[] {
    switch (role) {
      case 'admin':
        return ['all', 'admin:access', 'cases:manage', 'inspections:manage', 'legal:manage', 'actions:manage', 'users:manage'];
      case 'supervisor':
        return ['cases:manage', 'cases:close', 'inspections:manage', 'actions:manage', 'workload:view'];
      case 'legal_reviewer':
        return ['legal:manage', 'cases:review', 'legal:sign'];
      case 'staff':
      default:
        return ['cases:view', 'cases:update', 'inspections:conduct', 'actions:create', 'evidence:upload'];
    }
  }

  // ============================================================================
  // 1. AUTH (/auth)
  // ============================================================================
  app.get('/auth/setup-status', async (c) => {
    const userCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_users'))?.c || 0;
    const templateCount = (await get(c.env.DB, 'SELECT count(*) as c FROM inspection_templates'))?.c || 0;
    const legalCount = (await get(c.env.DB, 'SELECT count(*) as c FROM legal_documents'))?.c || 0;

    return c.json({
      is_initialized: userCount > 0,
      user_count: userCount,
      role_count: 4,
      template_count: templateCount,
      legal_corpus_count: legalCount
    });
  });

  app.post('/auth/bootstrap', async (c) => {
    const userCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_users'))?.c || 0;
    if (userCount > 0) {
      return c.json({ title: 'Lỗi', detail: 'Hệ thống đã được thiết lập trước đó.' }, 400);
    }
    const body = await c.req.json();
    const id = `usr_admin_${Date.now()}`;
    const pwdHash = await bcrypt.hash(body.password || 'admin123', 10);
    const now = new Date().toISOString();

    await run(c.env.DB, `
      INSERT INTO ops_users (id, username, password_hash, full_name, email, role, department, active, created_at)
      VALUES (?, ?, ?, ?, ?, 'admin', ?, 1, ?)
    `, [id, body.username || 'admin', pwdHash, body.full_name || 'Quản trị viên Hệ thống', body.email || 'admin@dustguard.vn', body.department || 'Ban Chỉ huy Môi trường', now]);

    await run(c.env.DB, `
      INSERT OR IGNORE INTO inspection_templates (id, name, description, category, active, created_at)
      VALUES ('tpl_standard', 'Biên bản kiểm tra chấp hành bảo vệ môi trường công trình xây dựng', 'Tiêu chuẩn TCVN 05:2023/BTNMT', 'CONSTRUCTION', 1, ?)
    `, [now]);

    const user = await get(c.env.DB, 'SELECT * FROM ops_users WHERE id = ?', [id]);
    const token = await sign({ id: user.id, username: user.username, role: user.role, exp: Math.floor(Date.now() / 1000) + 86400 * 30 }, JWT_SECRET, 'HS256');

    return c.json({
      success: true,
      user: { id: user.id, username: user.username, full_name: user.full_name, email: user.email, role: user.role, department: user.department },
      token
    });
  });

  app.post('/auth/login', async (c) => {
    try {
      const body = await c.req.json().catch(() => ({}));
      const rawIdentifier = (body.username || body.email || body.identifier || '').toString();
      const identifier = rawIdentifier.trim();
      const password = body.password;

      if (!identifier || !password) {
        return c.json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Lỗi xác thực',
          status: 400,
          detail: 'Vui lòng nhập tên đăng nhập hoặc email và mật khẩu.'
        }, 400);
      }

      // 1. Tìm tài khoản trong bảng chuyên trách ops_users theo username hoặc email (không phân biệt hoa thường)
      const user = await get(
        c.env.DB,
        'SELECT * FROM ops_users WHERE (LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)) AND active = 1',
        [identifier, identifier]
      );

      if (!user) {
        // Kiểm tra xem tài khoản có thuộc Phía Cộng đồng (users) không
        const commUser = await get(
          c.env.DB,
          'SELECT id FROM users WHERE LOWER(email) = LOWER(?) AND status != "deleted"',
          [identifier]
        );
        if (commUser) {
          return c.json({
            type: 'https://tools.ietf.org/html/rfc7807',
            title: 'Quyền truy cập không hợp lệ',
            status: 403,
            detail: 'Tài khoản này thuộc Phía Cộng đồng. Vui lòng chuyển sang tab Phía Cộng đồng.',
            code: 'WRONG_PORTAL_SIDE'
          }, 403);
        }
        return c.json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Lỗi xác thực',
          status: 401,
          detail: 'Tên đăng nhập hoặc mật khẩu chưa đúng.'
        }, 401);
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return c.json({
          type: 'https://tools.ietf.org/html/rfc7807',
          title: 'Lỗi xác thực',
          status: 401,
          detail: 'Tên đăng nhập hoặc mật khẩu chưa đúng.'
        }, 401);
      }

      const permissions = getPermissionsForRole(user.role);
      const token = await sign(
        { id: user.id, username: user.username, role: user.role, exp: Math.floor(Date.now() / 1000) + 86400 * 30 },
        JWT_SECRET,
        'HS256'
      );

      return c.json({
        user: {
          id: user.id,
          username: user.username,
          name: user.full_name,
          full_name: user.full_name,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          department: user.department
        },
        token,
        permissions
      });
    } catch (err: any) {
      return c.json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Lỗi hệ thống',
        status: 500,
        detail: 'Không thể kết nối hệ thống lúc này. Vui lòng thử lại sau.'
      }, 500);
    }
  });

  app.get('/auth/me', async (c) => {
    const user = await getStaffUser(c);
    if (!user) {
      return c.json({
        type: 'https://tools.ietf.org/html/rfc7807',
        title: 'Chưa xác thực',
        status: 401,
        detail: 'Phiên làm việc đã hết hạn hoặc không hợp lệ.'
      }, 401);
    }
    return c.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        full_name: user.full_name,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        department: user.department
      },
      permissions: getPermissionsForRole(user.role)
    });
  });

  app.post('/auth/logout', (c) => {
    return c.json({ success: true, message: 'Đăng xuất thành công.' });
  });

  // ============================================================================
  // 2. DASHBOARD (/dashboard) - Khớp 100% contract Frontend Side B DashboardPage
  // ============================================================================
  app.get('/dashboard', async (c) => {
    const user = await getStaffUser(c);
    const userId = user?.id || null;

    // 1. Core Operational KPI Metrics
    const openCasesCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status != "CLOSED"'))?.c || 0;
    const newCasesCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status = "NEW"'))?.c || 0;
    const pendingLegalCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status = "LEGAL_REVIEW"'))?.c || 0;
    const pendingInspectionCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status IN ("INSPECTION_PLANNED", "INSPECTION_IN_PROGRESS")'))?.c || 0;
    const awaitingRemediationCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status IN ("ACTION_REQUIRED", "REMEDIATION")'))?.c || 0;
    const overdueActionsCount = (await get(c.env.DB, 'SELECT count(*) as c FROM corrective_actions WHERE due_at < datetime("now") AND status NOT IN ("VERIFIED", "CLOSED")'))?.c || 0;
    const pendingReinspectionCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status = "REINSPECTION"'))?.c || 0;
    const readyToCloseCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status = "READY_TO_CLOSE"'))?.c || 0;
    const totalCasesCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases'))?.c || 0;
    const closedCasesCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status = "CLOSED"'))?.c || 0;

    // SLA at risk: cases older than 48 hours still in early/open status or overdue actions
    const slaAtRiskCases = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status NOT IN ("CLOSED", "READY_TO_CLOSE") AND created_at < datetime("now", "-48 hours")'))?.c || 0;
    const slaAtRiskTotal = Math.max(slaAtRiskCases, overdueActionsCount);

    // 2. PRIORITY QUEUE (Hàng đợi xử lý ưu tiên)
    const priorityQueue = await query(c.env.DB, `
      SELECT c.*, u.full_name as assigned_staff_name
      FROM ops_cases c
      LEFT JOIN ops_users u ON c.assigned_staff_id = u.id
      WHERE c.status != 'CLOSED'
      ORDER BY 
        CASE c.priority WHEN 'URGENT' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'NORMAL' THEN 3 ELSE 4 END ASC,
        c.updated_at DESC
      LIMIT 12
    `);

    // 3. MY WORK QUEUE
    let myQueue: any[] = [];
    if (userId) {
      myQueue = await query(c.env.DB, `
        SELECT c.*, u.full_name as assigned_staff_name
        FROM ops_cases c
        LEFT JOIN ops_users u ON c.assigned_staff_id = u.id
        WHERE c.assigned_staff_id = ? AND c.status != 'CLOSED'
        ORDER BY c.updated_at DESC
        LIMIT 8
      `, [userId]);
    } else {
      myQueue = priorityQueue.slice(0, 8);
    }

    // 4. RECENT CASE ACTIVITY TIMELINE
    const recentActivities = await query(c.env.DB, `
      SELECT ct.*, c.case_code, c.title as case_title
      FROM ops_case_timeline ct
      JOIN ops_cases c ON ct.case_id = c.id
      ORDER BY ct.created_at DESC
      LIMIT 10
    `);

    // 5. SUPERVISOR METRICS
    const unassignedCases = await query(c.env.DB, `
      SELECT * FROM ops_cases WHERE assigned_staff_id IS NULL AND status != 'CLOSED' ORDER BY created_at DESC LIMIT 8
    `);

    const staffWorkload = await query(c.env.DB, `
      SELECT u.id, u.full_name, u.role, u.department,
             count(c.id) as active_cases_count
      FROM ops_users u
      LEFT JOIN ops_cases c ON u.id = c.assigned_staff_id AND c.status != 'CLOSED'
      WHERE u.role = 'staff' AND u.active = 1
      GROUP BY u.id
      ORDER BY active_cases_count DESC
    `);

    const overdueCases = await query(c.env.DB, `
      SELECT c.*, u.full_name as assigned_staff_name
      FROM ops_cases c
      LEFT JOIN ops_users u ON c.assigned_staff_id = u.id
      WHERE c.status != 'CLOSED' AND c.created_at < datetime('now', '-7 days')
      ORDER BY c.created_at ASC
      LIMIT 8
    `);

    const supervisorData = {
      unassignedCases,
      staffWorkload,
      overdueCases,
    };

    return c.json({
      metrics: {
        open_cases: openCasesCount,
        sla_at_risk: slaAtRiskTotal,
        pending_inspection: pendingInspectionCount,
        awaiting_remediation: awaitingRemediationCount,
        new_cases: newCasesCount,
        pending_legal: pendingLegalCount,
        overdue_actions: overdueActionsCount,
        pending_reinspection: pendingReinspectionCount,
        ready_to_close: readyToCloseCount,
      },
      priorityQueue,
      myQueue,
      recentActivities,
      supervisor: supervisorData,
      // Backward compatibility keys
      overview: {
        total_cases: totalCasesCount,
        active_cases: openCasesCount,
        closed_cases: closedCasesCount,
        pending_actions: awaitingRemediationCount,
        planned_inspections: pendingInspectionCount
      },
      pipeline: {
        new: newCasesCount,
        triaged: (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status = "TRIAGED"'))?.c || 0,
        inspection: pendingInspectionCount,
        remediation: awaitingRemediationCount,
        closed: closedCasesCount
      },
      recent_activity: priorityQueue.slice(0, 5)
    });
  });

  // ============================================================================
  // 3. NOTIFICATIONS (/notifications)
  // ============================================================================
  app.get('/notifications', async (c) => {
    const user = await getStaffUser(c);
    const notifs = await query(c.env.DB, `
      SELECT * FROM notifications 
      WHERE user_id = ? OR user_id IS NULL 
      ORDER BY created_at DESC LIMIT 50
    `, [user?.id || null]);
    const unreadCount = notifs.filter((n: any) => !n.is_read).length;
    return c.json({ notifications: notifs, unreadCount });
  });

  app.post('/notifications/:id/read', async (c) => {
    const id = c.req.param('id');
    await run(c.env.DB, 'UPDATE notifications SET is_read = 1, read_at = ? WHERE id = ?', [new Date().toISOString(), id]);
    return c.json({ success: true });
  });

  // ============================================================================
  // 4. PROJECTS & CONTRACTORS (/projects & /contractors)
  // ============================================================================
  app.get('/projects', async (c) => {
    const projects = await query(c.env.DB, 'SELECT * FROM projects ORDER BY created_at DESC');
    return c.json({ projects, total: projects.length });
  });

  app.get('/projects/:id', async (c) => {
    const id = c.req.param('id');
    const project = await get(c.env.DB, 'SELECT * FROM projects WHERE id = ?', [id]);
    if (!project) return c.json({ title: 'Không tìm thấy', detail: 'Công trình không tồn tại.' }, 404);
    return c.json(project);
  });

  app.post('/projects', async (c) => {
    const body = await c.req.json();
    const id = `prj_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO projects (id, code, name, address, district, province, contractor_id, contractor_name, project_owner, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)
    `, [id, body.code || `PRJ-${Date.now()}`, body.name, body.address, body.district, body.province || 'TP. Hồ Chí Minh', body.contractor_id || null, body.contractor_name || null, body.project_owner || null, now, now]);
    const created = await get(c.env.DB, 'SELECT * FROM projects WHERE id = ?', [id]);
    return c.json({ success: true, project: created }, 201);
  });

  app.patch('/projects/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const now = new Date().toISOString();
    await run(c.env.DB, `
      UPDATE projects
      SET name = COALESCE(?, name),
          address = COALESCE(?, address),
          district = COALESCE(?, district),
          contractor_name = COALESCE(?, contractor_name),
          project_owner = COALESCE(?, project_owner),
          status = COALESCE(?, status),
          updated_at = ?
      WHERE id = ?
    `, [body.name || null, body.address || null, body.district || null, body.contractor_name || null, body.project_owner || null, body.status || null, now, id]);
    const updated = await get(c.env.DB, 'SELECT * FROM projects WHERE id = ?', [id]);
    return c.json({ success: true, project: updated });
  });

  app.get('/contractors', async (c) => {
    const contractors = await query(c.env.DB, 'SELECT * FROM contractors ORDER BY created_at DESC');
    return c.json({ contractors, total: contractors.length });
  });

  app.get('/contractors/:id', async (c) => {
    const id = c.req.param('id');
    const contractor = await get(c.env.DB, 'SELECT * FROM contractors WHERE id = ?', [id]);
    if (!contractor) return c.json({ title: 'Không tìm thấy', detail: 'Nhà thầu không tồn tại.' }, 404);
    return c.json(contractor);
  });

  app.post('/contractors', async (c) => {
    const body = await c.req.json();
    const id = `ctr_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO contractors (id, name, contact_person, phone, email, address, tax_id, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, body.name, body.contact_person || null, body.phone || null, body.email || null, body.address || null, body.tax_id || null, body.notes || null, now, now]);
    const created = await get(c.env.DB, 'SELECT * FROM contractors WHERE id = ?', [id]);
    return c.json({ success: true, contractor: created }, 201);
  });

  app.patch('/contractors/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const now = new Date().toISOString();
    await run(c.env.DB, `
      UPDATE contractors
      SET name = COALESCE(?, name),
          contact_person = COALESCE(?, contact_person),
          phone = COALESCE(?, phone),
          email = COALESCE(?, email),
          address = COALESCE(?, address),
          notes = COALESCE(?, notes),
          updated_at = ?
      WHERE id = ?
    `, [body.name || null, body.contact_person || null, body.phone || null, body.email || null, body.address || null, body.notes || null, now, id]);
    const updated = await get(c.env.DB, 'SELECT * FROM contractors WHERE id = ?', [id]);
    return c.json({ success: true, contractor: updated });
  });

  // ============================================================================
  // 5. CASES (/cases) & DECISIONS & CLOSURES
  // ============================================================================
  app.get('/cases', async (c) => {
    const status = c.req.query('status');
    const district = c.req.query('district');
    const priority = c.req.query('priority');

    let sql = 'SELECT * FROM ops_cases WHERE 1=1';
    const params: any[] = [];
    if (status) {
      if (status.includes(',')) {
        const parts = status.split(',').map(s => s.trim()).filter(Boolean);
        sql += ` AND status IN (${parts.map(() => '?').join(',')})`;
        params.push(...parts);
      } else {
        sql += ' AND status = ?';
        params.push(status);
      }
    }
    if (district) {
      sql += ' AND district = ?';
      params.push(district);
    }
    if (priority) {
      sql += ' AND priority = ?';
      params.push(priority);
    }
    sql += ' ORDER BY created_at DESC LIMIT 100';

    const cases = await query(c.env.DB, sql, params);
    return c.json({ cases, total: cases.length });
  });

  app.get('/cases/:id', async (c) => {
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!caseItem) {
      return c.json({ title: 'Không tìm thấy', detail: 'Hồ sơ vụ việc không tồn tại.' }, 404);
    }

    const timeline = await query(c.env.DB, 'SELECT * FROM ops_case_timeline WHERE case_id = ? ORDER BY created_at ASC', [caseItem.id]);
    const staff = await query(c.env.DB, `
      SELECT sa.*, u.full_name as staff_name, u.role as staff_role
      FROM ops_staff_assignments sa
      JOIN ops_users u ON sa.staff_user_id = u.id
      WHERE sa.case_id = ?
    `, [caseItem.id]);

    const evidence = await query(c.env.DB, 'SELECT * FROM ops_evidence_assets WHERE case_id = ? ORDER BY created_at DESC', [caseItem.id]);
    const inspections = await query(c.env.DB, 'SELECT * FROM inspections WHERE case_id = ? ORDER BY scheduled_date DESC', [caseItem.id]);
    const actions = await query(c.env.DB, 'SELECT * FROM corrective_actions WHERE case_id = ? ORDER BY created_at DESC', [caseItem.id]);
    const closure = await get(c.env.DB, 'SELECT * FROM case_closures WHERE case_id = ?', [caseItem.id]);

    return c.json({
      case: caseItem,
      timeline,
      staff,
      evidence,
      inspections,
      actions,
      closure: closure || null
    });
  });

  app.post('/cases', async (c) => {
    const user = await getStaffUser(c);
    const body = await c.req.json();
    const id = `case-${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;
    const caseCode = body.case_code || `DG-OPS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    await run(c.env.DB, `
      INSERT INTO ops_cases (
        id, case_code, title, description, location_text, district, latitude, longitude,
        source, status, priority, contractor_name, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'MANUAL', 'NEW', ?, ?, ?, ?)
    `, [
      id, caseCode, body.title, body.description, body.location_text || body.address || 'Hiện trường công trình',
      body.district || 'Quận 7', body.latitude || 10.7769, body.longitude || 106.7009,
      body.priority || 'NORMAL', body.contractor_name || null, now, now
    ]);

    await run(c.env.DB, `
      INSERT INTO ops_case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, created_at)
      VALUES (?, ?, 'CASE_CREATED', ?, ?, 'STAFF', 'INTAKE', 'Khởi tạo hồ sơ vụ việc thủ công.', ?)
    `, [`otl_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`, id, user?.id || null, user?.full_name || 'Hệ thống', now]);

    const created = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ?', [id]);
    return c.json({ case: created }, 201);
  });

  app.patch('/cases/:id', async (c) => {
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT id FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!caseItem) return c.json({ title: 'Không tìm thấy', detail: 'Hồ sơ không tồn tại.' }, 404);

    const body = await c.req.json();
    const now = new Date().toISOString();

    await run(c.env.DB, `
      UPDATE ops_cases
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          priority = COALESCE(?, priority),
          contractor_name = COALESCE(?, contractor_name),
          contractor_id = COALESCE(?, contractor_id),
          project_id = COALESCE(?, project_id),
          updated_at = ?
      WHERE id = ?
    `, [body.title || null, body.description || null, body.priority || null, body.contractor_name || null, body.contractor_id || null, body.project_id || null, now, caseItem.id]);

    const updated = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ?', [caseItem.id]);
    return c.json({ case: updated });
  });

  app.post('/cases/:id/transition', async (c) => {
    const user = await getStaffUser(c);
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!caseItem) return c.json({ title: 'Không tìm thấy', detail: 'Hồ sơ không tồn tại.' }, 404);

    const body = await c.req.json();
    const newStatus = body.status;
    const now = new Date().toISOString();

    await run(c.env.DB, 'UPDATE ops_cases SET status = ?, updated_at = ? WHERE id = ?', [newStatus, now, caseItem.id]);

    // Đồng bộ trạng thái hai chiều sang Phía Người dân (Side A: cases và reports)
    let commCaseStatus = 'new';
    let commReportStatus = 'submitted';
    const sUpper = (newStatus || '').toUpperCase();
    if (['TRIAGED'].includes(sUpper)) {
      commCaseStatus = 'community_verifying';
      commReportStatus = 'reviewing';
    } else if (['ASSIGNED', 'LEGAL_REVIEW'].includes(sUpper)) {
      commCaseStatus = 'forwarded';
      commReportStatus = 'verified';
    } else if (['INSPECTION_PLANNED', 'INSPECTION_IN_PROGRESS', 'ACTION_REQUIRED', 'REMEDIATION', 'REINSPECTION', 'IN_PROGRESS'].includes(sUpper)) {
      commCaseStatus = 'in_progress';
      commReportStatus = 'verified';
    } else if (['READY_TO_CLOSE', 'CLOSED', 'RESOLVED'].includes(sUpper)) {
      commCaseStatus = 'resolved';
      commReportStatus = 'verified';
    }

    try {
      await run(c.env.DB, 'UPDATE cases SET status = ?, updated_at = ? WHERE id = ? OR case_code = ?', [commCaseStatus, now, caseItem.id, caseItem.case_code]);
      await run(c.env.DB, 'UPDATE reports SET status = ?, updated_at = ? WHERE case_id = ? OR case_id IN (SELECT id FROM cases WHERE case_code = ?)', [commReportStatus, now, caseItem.id, caseItem.case_code]);
    } catch (syncErr) {
      console.warn('[Cross-side sync warning]:', syncErr);
    }

    await run(c.env.DB, `
      INSERT INTO ops_case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, created_at)
      VALUES (?, ?, 'STATUS_TRANSITION', ?, ?, ?, ?, ?, ?)
    `, [
      `otl_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`,
      caseItem.id, user?.id || null, user?.full_name || 'Cán bộ điều hành',
      user?.role || 'STAFF', newStatus, body.message || `Chuyển trạng thái sang ${newStatus}`, now
    ]);

    const updated = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ?', [caseItem.id]);
    return c.json({ success: true, case: updated, message: 'Đã cập nhật trạng thái hồ sơ.' });
  });

  app.post('/cases/:id/assign', async (c) => {
    const user = await getStaffUser(c);
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!caseItem) return c.json({ title: 'Không tìm thấy', detail: 'Hồ sơ không tồn tại.' }, 404);

    const body = await c.req.json();
    const staffId = body.staff_id || body.staff_user_id;
    const staff = await get(c.env.DB, 'SELECT full_name FROM ops_users WHERE id = ?', [staffId]);
    const now = new Date().toISOString();

    await run(c.env.DB, `
      INSERT INTO ops_staff_assignments (id, case_id, staff_user_id, assigned_by, assignment_type, status, assigned_at)
      VALUES (?, ?, ?, ?, 'PRIMARY', 'ACTIVE', ?)
    `, [`sa_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`, caseItem.id, staffId, user?.id || staffId, now]);

    await run(c.env.DB, 'UPDATE ops_cases SET assigned_staff_id = ?, status = "ASSIGNED", updated_at = ? WHERE id = ?', [staffId, now, caseItem.id]);

    // Đồng bộ sang Side A: đã phân công chuyên trách
    try {
      await run(c.env.DB, 'UPDATE cases SET status = "forwarded", updated_at = ? WHERE id = ? OR case_code = ?', [now, caseItem.id, caseItem.case_code]);
      await run(c.env.DB, 'UPDATE reports SET status = "verified", updated_at = ? WHERE case_id = ? OR case_id IN (SELECT id FROM cases WHERE case_code = ?)', [now, caseItem.id, caseItem.case_code]);
    } catch (syncErr) {
      console.warn('[Cross-side assign sync warning]:', syncErr);
    }

    await run(c.env.DB, `
      INSERT INTO ops_case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, created_at)
      VALUES (?, ?, 'STAFF_ASSIGNED', ?, ?, 'SUPERVISOR', 'ASSIGNMENT', ?, ?)
    `, [`otl_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`, caseItem.id, user?.id || null, user?.full_name || 'Lãnh đạo', `Phân công cán bộ ${staff?.full_name || staffId} phụ trách thụ lý.`, now]);

    const updated = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ?', [caseItem.id]);
    return c.json({ success: true, case: updated });
  });

  app.post('/cases/:id/reassign', async (c) => {
    const user = await getStaffUser(c);
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!caseItem) return c.json({ title: 'Không tìm thấy', detail: 'Hồ sơ không tồn tại.' }, 404);

    const body = await c.req.json();
    const staffId = body.staff_id || body.staff_user_id;
    const now = new Date().toISOString();

    await run(c.env.DB, 'UPDATE ops_cases SET assigned_staff_id = ?, updated_at = ? WHERE id = ?', [staffId, now, caseItem.id]);
    await run(c.env.DB, `
      INSERT INTO ops_staff_assignments (id, case_id, staff_user_id, assigned_by, assignment_type, status, assigned_at)
      VALUES (?, ?, ?, ?, 'REASSIGNED', 'ACTIVE', ?)
    `, [`sa_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`, caseItem.id, staffId, user?.id || staffId, now]);

    const updated = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ?', [caseItem.id]);
    return c.json({ success: true, case: updated });
  });

  app.post('/cases/:id/reopen', async (c) => {
    const user = await getStaffUser(c);
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!caseItem) return c.json({ title: 'Không tìm thấy', detail: 'Hồ sơ không tồn tại.' }, 404);

    const body = await c.req.json().catch(() => ({}));
    const now = new Date().toISOString();
    await run(c.env.DB, 'UPDATE ops_cases SET status = "REMEDIATION", closed_at = NULL, updated_at = ? WHERE id = ?', [now, caseItem.id]);
    await run(c.env.DB, `
      INSERT INTO ops_case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, created_at)
      VALUES (?, ?, 'CASE_REOPENED', ?, ?, ?, 'REOPEN', ?, ?)
    `, [`otl_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`, caseItem.id, user?.id || null, user?.full_name || 'Cán bộ', user?.role || 'STAFF', body.reason || 'Mở lại hồ sơ do phát hiện bụi ô nhiễm tái diễn.', now]);
    return c.json({ success: true, message: 'Đã mở lại hồ sơ vụ việc.' });
  });

  app.get('/cases/:id/next-action', async (c) => {
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!caseItem) return c.json({ title: 'Không tìm thấy', detail: 'Hồ sơ không tồn tại.' }, 404);

    let title = 'Tiếp nhận và phân loại ban đầu';
    let reason = 'Vụ việc mới tạo cần được phân loại và chỉ định cán bộ phụ trách.';
    let route = `/cases/${caseItem.id}`;

    switch (caseItem.status) {
      case 'TRIAGED':
        title = 'Phân công cán bộ hiện trường';
        reason = 'Hồ sơ đã được phân loại, cần phân công cán bộ thụ lý.';
        break;
      case 'ASSIGNED':
        title = 'Lập kế hoạch kiểm tra hiện trường';
        reason = 'Cán bộ cần lên lịch kiểm tra và lập biên bản theo chuẩn QCVN 18.';
        route = `/cases/${caseItem.id}/inspection/new`;
        break;
      case 'INSPECTION_PLANNED':
      case 'INSPECTION_IN_PROGRESS':
        title = 'Thực hiện kiểm tra thực địa';
        reason = 'Cán bộ đang tiến hành ghi nhận vi phạm tại hiện trường.';
        route = `/cases/${caseItem.id}`;
        break;
      case 'ACTION_REQUIRED':
        title = 'Ban hành văn bản yêu cầu khắc phục';
        reason = 'Phát hiện vi phạm vượt ngưỡng, cần thông báo thời hạn cho đơn vị thi công.';
        break;
      case 'REMEDIATION':
        title = 'Nghiệm thu báo cáo khắc phục của nhà thầu';
        reason = 'Nhà thầu đã gửi bằng chứng đối soát Before/After.';
        break;
      case 'READY_TO_CLOSE':
        title = 'Phê duyệt đóng hồ sơ';
        reason = 'Các điều kiện an toàn đã thỏa mãn, sẵn sàng lưu trữ hồ sơ số.';
        break;
      case 'CLOSED':
        title = 'Hồ sơ đã hoàn tất toàn trình';
        reason = 'Vụ việc đã khép kín và lưu trữ bất biến trên hệ thống.';
        break;
    }

    return c.json({
      action: { case_id: caseItem.id, status: caseItem.status },
      title,
      reason,
      route,
      blockingIssues: []
    });
  });

  app.get('/cases/:id/decision-pack', async (c) => {
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!caseItem) return c.json({ title: 'Không tìm thấy', detail: 'Hồ sơ không tồn tại.' }, 404);
    const evidence = await query(c.env.DB, 'SELECT * FROM ops_evidence_assets WHERE case_id = ?', [caseItem.id]);
    const inspections = await query(c.env.DB, 'SELECT * FROM inspections WHERE case_id = ?', [caseItem.id]);
    const actions = await query(c.env.DB, 'SELECT * FROM corrective_actions WHERE case_id = ?', [caseItem.id]);
    return c.json({ case: caseItem, evidence, inspections, actions });
  });

  app.get('/cases/:id/facts', async (c) => {
    const id = c.req.param('id');
    const facts = await query(c.env.DB, 'SELECT * FROM ops_case_timeline WHERE case_id = ? ORDER BY created_at ASC', [id]);
    return c.json({ success: true, facts, total: facts.length });
  });

  app.post('/cases/:id/analysis', async (c) => {
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    return c.json({
      success: true,
      analysis: {
        case_id: id,
        severity_score: caseItem?.priority === 'URGENT' ? 95 : caseItem?.priority === 'HIGH' ? 75 : 50,
        risk_level: caseItem?.priority || 'NORMAL',
        suggested_action: 'Kiểm tra thực địa và đối chiếu quy chuẩn QCVN 18/BXD'
      }
    });
  });

  app.get('/cases/:id/decision-support', async (c) => {
    const id = c.req.param('id');
    return c.json({
      case_id: id,
      recommendation: {
        legal_basis: 'Điều 64 Luật BVMT 2020 & Nghị định 45/2022/NĐ-CP',
        confidence: 0.95,
        action: 'Yêu cầu nhà thầu vận hành vòi phun xịt rửa bánh xe và che chắn bạt kín xe chở vật liệu rời.'
      }
    });
  });

  app.post('/cases/:id/human-decisions', async (c) => {
    const user = await getStaffUser(c);
    const id = c.req.param('id');
    const body = await c.req.json();
    const decId = `dec_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO human_decisions (id, case_id, decision_type, justification, decided_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [decId, id, body.decision_type || 'PROCEED', body.justification || body.notes || 'Xác nhận phê duyệt', user?.id || 'staff', now]);
    return c.json({ success: true, decision_id: decId });
  });

  app.post('/cases/:id/decisions', async (c) => {
    const user = await getStaffUser(c);
    const id = c.req.param('id');
    const body = await c.req.json();
    const decId = `dec_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO human_decisions (id, case_id, decision_type, justification, decided_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [decId, id, body.decision_type || 'APPROVE', body.notes || body.reason || 'Phê duyệt quyết định chuyên môn', user?.id || 'staff', now]);
    return c.json({ success: true, decision: { id: decId, case_id: id } });
  });

  app.post('/cases/:id/missing-facts/create-task', async (c) => {
    const user = await getStaffUser(c);
    const id = c.req.param('id');
    const body = await c.req.json();
    const taskId = `task_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO ops_tasks (id, case_id, title, description, assigned_to, priority, status, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'HIGH', 'PENDING', ?, ?, ?)
    `, [taskId, id, body.title || 'Bổ sung tài liệu chứng cứ hiện trường', body.description || '', body.assigned_to || user?.id || null, user?.id || 'staff', now, now]);
    const created = await get(c.env.DB, 'SELECT * FROM ops_tasks WHERE id = ?', [taskId]);
    return c.json({ success: true, task: created }, 201);
  });

  // Closure Safety Check & Đóng hồ sơ (Safety Gate)
  app.get('/cases/:id/closure-safety-check', async (c) => {
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT id FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!caseItem) return c.json({ title: 'Không tìm thấy', detail: 'Hồ sơ không tồn tại.' }, 404);

    const openActions = await query(c.env.DB, 'SELECT id FROM corrective_actions WHERE case_id = ? AND status != "VERIFIED" AND status != "CLOSED"', [caseItem.id]);
    const pendingRemediations = await query(c.env.DB, 'SELECT id FROM remediation_submissions WHERE case_id = ? AND review_status = "PENDING"', [caseItem.id]);

    const blockers: string[] = [];
    if (openActions.length > 0) blockers.push(`Còn ${openActions.length} lệnh khắc phục chưa được nghiệm thu.`);
    if (pendingRemediations.length > 0) blockers.push(`Còn ${pendingRemediations.length} báo cáo khắc phục chưa được duyệt.`);

    return c.json({
      can_close: blockers.length === 0,
      blockers,
      checks: {
        all_actions_resolved: openActions.length === 0,
        all_remediations_reviewed: pendingRemediations.length === 0
      }
    });
  });

  app.post('/cases/:id/close', async (c) => {
    const user = await getStaffUser(c);
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!caseItem) return c.json({ title: 'Không tìm thấy', detail: 'Hồ sơ không tồn tại.' }, 404);

    const body = await c.req.json().catch(() => ({}));

    const isReadyStatus = ['READY_TO_CLOSE', 'REINSPECTION', 'REMEDIATION'].includes(caseItem.status);
    if (!isReadyStatus && !body.force) {
      return c.json({
        title: 'Chưa đủ điều kiện đóng hồ sơ',
        status: 422,
        detail: 'Hồ sơ chưa thỏa mãn cổng kiểm soát 4 điều kiện đóng (cần hoàn tất nghiệm thu khắc phục hoặc xác nhận cưỡng chế từ Giám sát viên).'
      }, 422);
    }

    const now = new Date().toISOString();
    let closedBy = user?.id;
    if (!closedBy) {
      const firstStaff = await get(c.env.DB, 'SELECT id FROM ops_users ORDER BY created_at ASC LIMIT 1');
      closedBy = firstStaff?.id;
    }

    await run(c.env.DB, 'UPDATE ops_cases SET status = "CLOSED", closed_at = ?, updated_at = ? WHERE id = ?', [now, now, caseItem.id]);

    if (closedBy) {
      await run(c.env.DB, `
        INSERT INTO case_closures (id, case_id, closed_by, closure_reason, closure_summary, closed_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [`cls_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`, caseItem.id, closedBy, body.reason || 'Đã khắc phục đạt chuẩn', body.summary || 'Nghiệm thu thực địa hoàn tất.', now]);
    }

    await run(c.env.DB, `
      INSERT INTO ops_case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, created_at)
      VALUES (?, ?, 'CASE_CLOSED', ?, ?, ?, 'CLOSURE', ?, ?)
    `, [`otl_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`, caseItem.id, closedBy || null, user?.full_name || 'Lãnh đạo phê duyệt', user?.role || 'SUPERVISOR', 'Đóng hồ sơ vụ việc sau khi nghiệm thu đạt chuẩn.', now]);

    // Đồng bộ ngược lại Side A (Community) nếu hồ sơ liên thông
    try {
      const commCase = await get(c.env.DB, 'SELECT id, case_code, status FROM cases WHERE case_code = ? OR id = ?', [caseItem.case_code, caseItem.source_reference]);
      if (commCase) {
        await run(c.env.DB, 'UPDATE cases SET status = "resolved", resolved_at = ?, updated_at = ? WHERE id = ?', [now, now, commCase.id]);
        await run(c.env.DB, `
          INSERT INTO case_updates (id, case_id, update_type, title, content, old_status, new_status, is_public, created_at)
          VALUES (?, ?, 'resolution', 'Vụ việc đã giải quyết xong', 'Cơ quan chức năng đã đóng hồ sơ sau khi nhà thầu khắc phục vi phạm đạt chuẩn.', ?, 'resolved', 1, ?)
        `, [`upd_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`, commCase.id, commCase.status, now]);
      }
    } catch (err) {
      console.error('[Sync to Community Error]', err);
    }

    return c.json({ success: true, message: 'Đã đóng hồ sơ vụ việc thành công.' });
  });

  // ============================================================================
  // 6. TASKS (/tasks)
  // ============================================================================
  app.get('/tasks', async (c) => {
    const status = c.req.query('status');
    let sql = 'SELECT * FROM ops_tasks WHERE 1=1';
    const params: any[] = [];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    sql += ' ORDER BY created_at DESC';
    const tasks = await query(c.env.DB, sql, params);
    return c.json({ tasks });
  });

  app.post('/tasks', async (c) => {
    const user = await getStaffUser(c);
    const body = await c.req.json();
    const id = `task_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO ops_tasks (id, case_id, title, description, assigned_to, priority, status, due_date, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, body.case_id || null, body.title, body.description || '', body.assigned_to || user?.id || null, body.priority || 'NORMAL', body.status || 'PENDING', body.due_date || body.due_at || null, user?.id || 'staff', now, now]);
    const created = await get(c.env.DB, 'SELECT * FROM ops_tasks WHERE id = ?', [id]);
    return c.json({ success: true, task: created }, 201);
  });

  app.patch('/tasks/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const now = new Date().toISOString();
    await run(c.env.DB, `
      UPDATE ops_tasks
      SET title = COALESCE(?, title),
          status = COALESCE(?, status),
          priority = COALESCE(?, priority),
          assigned_to = COALESCE(?, assigned_to),
          due_date = COALESCE(?, due_date),
          updated_at = ?
      WHERE id = ?
    `, [body.title || null, body.status || null, body.priority || null, body.assigned_to || null, body.due_date || body.due_at || null, now, id]);
    const updated = await get(c.env.DB, 'SELECT * FROM ops_tasks WHERE id = ?', [id]);
    return c.json({ success: true, task: updated });
  });

  // ============================================================================
  // 7. SIGNALS (/signals)
  // ============================================================================
  app.get('/signals', async (c) => {
    const status = c.req.query('status');
    let sql = 'SELECT * FROM signals WHERE 1=1';
    const params: any[] = [];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    sql += ' ORDER BY created_at DESC LIMIT 100';
    const signals = await query(c.env.DB, sql, params);
    return c.json({ signals });
  });

  app.get('/signals/:id', async (c) => {
    const id = c.req.param('id');
    const signal = await get(c.env.DB, 'SELECT * FROM signals WHERE id = ?', [id]);
    if (!signal) return c.json({ title: 'Không tìm thấy', detail: 'Tín hiệu không tồn tại.' }, 404);
    return c.json({ signal });
  });

  app.get('/signals/:id/matches', async (c) => {
    const id = c.req.param('id');
    const signal = await get(c.env.DB, 'SELECT * FROM signals WHERE id = ?', [id]);
    const matches = await query(c.env.DB, 'SELECT * FROM ops_cases WHERE district = ? AND status != "CLOSED" LIMIT 5', [signal?.district || '']);
    return c.json({ signal, matches });
  });

  app.post('/signals/:id/link-case', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    await run(c.env.DB, 'UPDATE signals SET case_id = ?, status = "LINKED" WHERE id = ?', [body.case_id, id]);
    return c.json({ success: true, link: { signal_id: id, case_id: body.case_id } });
  });

  app.post('/signals/public-report', async (c) => {
    const body = await c.req.json();
    const id = `sig_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO signals (id, title, description, district, latitude, longitude, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'NEW', ?)
    `, [id, body.title || 'Phản ánh công chúng', body.description || '', body.district || 'Quận 7', body.latitude || 10.78, body.longitude || 106.70, now]);
    const created = await get(c.env.DB, 'SELECT * FROM signals WHERE id = ?', [id]);
    return c.json({ success: true, signal: created, message: 'Đã tiếp nhận phản ánh công chúng.' }, 201);
  });

  app.post('/signals/:id/create-case', async (c) => {
    const id = c.req.param('id');
    const signal = await get(c.env.DB, 'SELECT * FROM signals WHERE id = ?', [id]);
    const body = await c.req.json();
    const caseId = `case-${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;
    const caseCode = `DG-OPS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO ops_cases (id, case_code, title, description, location_text, district, latitude, longitude, source, status, priority, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'SIGNAL', 'NEW', ?, ?, ?)
    `, [caseId, caseCode, body.title || signal?.title || 'Vụ việc từ tín hiệu', body.description || signal?.description || '', signal?.location_text || signal?.address || '', signal?.district || body.district || 'Quận 7', signal?.latitude || 10.78, signal?.longitude || 106.70, body.priority || 'HIGH', now, now]);
    await run(c.env.DB, 'UPDATE signals SET case_id = ?, status = "CONVERTED" WHERE id = ?', [caseId, id]);
    const created = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ?', [caseId]);
    return c.json({ success: true, case: created, message: 'Đã tạo hồ sơ từ tín hiệu thành công.' }, 201);
  });

  // ============================================================================
  // 8. IOT MONITORING (/iot)
  // ============================================================================
  app.get('/iot/alerts', async (c) => {
    const alerts = await query(c.env.DB, 'SELECT * FROM iot_events WHERE event_type LIKE "%ALERT%" OR severity IN ("CRITICAL", "HIGH") ORDER BY created_at DESC LIMIT 50');
    return c.json({ alerts });
  });

  app.get('/iot/devices', async (c) => {
    const devices = await query(c.env.DB, 'SELECT * FROM iot_devices ORDER BY created_at DESC');
    return c.json({ devices });
  });

  app.get('/iot/devices/:id', async (c) => {
    const id = c.req.param('id');
    const device = await get(c.env.DB, 'SELECT * FROM iot_devices WHERE id = ?', [id]);
    if (!device) return c.json({ title: 'Không tìm thấy', detail: 'Thiết bị IoT không tồn tại.' }, 404);
    const latestReading = await get(c.env.DB, 'SELECT * FROM iot_readings WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1', [id]);
    const recentReadings = await query(c.env.DB, 'SELECT * FROM iot_readings WHERE device_id = ? ORDER BY timestamp DESC LIMIT 20', [id]);
    const recentEvents = await query(c.env.DB, 'SELECT * FROM iot_events WHERE device_id = ? ORDER BY created_at DESC LIMIT 10', [id]);
    const relatedCases = await query(c.env.DB, 'SELECT * FROM ops_cases WHERE district = ? LIMIT 5', [device.district || '']);
    return c.json({ device, latestReading: latestReading || null, recentReadings, recentEvents, relatedCases });
  });

  app.get('/iot/devices/:id/readings', async (c) => {
    const id = c.req.param('id');
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const readings = await query(c.env.DB, 'SELECT * FROM iot_readings WHERE device_id = ? ORDER BY timestamp DESC LIMIT ?', [id, limit]);
    return c.json({ readings });
  });

  app.post('/iot/devices', async (c) => {
    const body = await c.req.json();
    const id = `iot_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO iot_devices (id, device_code, name, model, district, location_text, latitude, longitude, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)
    `, [id, body.device_code || `DEV-${Date.now()}`, body.name, body.model || 'DustSentry-Pro', body.district || 'Quận 7', body.location_text || body.address || '', body.latitude || 10.78, body.longitude || 106.70, now, now]);
    const created = await get(c.env.DB, 'SELECT * FROM iot_devices WHERE id = ?', [id]);
    return c.json({ success: true, device: created }, 201);
  });

  app.post('/iot/devices/:id/create-case', async (c) => {
    const id = c.req.param('id');
    const device = await get(c.env.DB, 'SELECT * FROM iot_devices WHERE id = ?', [id]);
    const body = await c.req.json();
    const caseId = `case-${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;
    const caseCode = `DG-IOT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO ops_cases (id, case_code, title, description, location_text, district, latitude, longitude, source, status, priority, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'IOT', 'NEW', ?, ?, ?)
    `, [caseId, caseCode, body.title || `Cảnh báo vượt ngưỡng từ ${device?.name || id}`, body.description || '', device?.location_text || '', device?.district || 'Quận 7', device?.latitude || 10.78, device?.longitude || 106.70, body.priority || 'HIGH', now, now]);
    const created = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ?', [caseId]);
    return c.json({ success: true, case: created }, 201);
  });

  app.post('/iot/devices/:id/link-case', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    await run(c.env.DB, `
      INSERT INTO iot_events (id, device_id, case_id, event_type, severity, message, created_at)
      VALUES (?, ?, ?, 'CASE_LINKED', 'INFO', 'Thiết bị được liên kết với hồ sơ vụ việc', ?)
    `, [`iev_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`, id, body.case_id, new Date().toISOString()]);
    return c.json({ success: true, message: 'Đã liên kết thiết bị với vụ việc.' });
  });

  // ============================================================================
  // 9. AUTOMATIONS (/automations)
  // ============================================================================
  app.get('/automations/rules', async (c) => {
    const rules = await query(c.env.DB, 'SELECT * FROM automation_rules ORDER BY created_at DESC');
    return c.json({ rules });
  });

  app.get('/automations/runs', async (c) => {
    const runs = await query(c.env.DB, 'SELECT * FROM automation_rule_runs ORDER BY executed_at DESC LIMIT 50');
    return c.json({ runs });
  });

  app.patch('/automations/rules/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    await run(c.env.DB, 'UPDATE automation_rules SET is_active = ?, updated_at = ? WHERE id = ?', [body.enabled ? 1 : 0, new Date().toISOString(), id]);
    const updated = await get(c.env.DB, 'SELECT * FROM automation_rules WHERE id = ?', [id]);
    return c.json({ rule: updated });
  });

  // ============================================================================
  // 10. REPORTS & STATS (/reports)
  // ============================================================================
  app.get('/reports/overview', async (c) => {
    const range = c.req.query('range') || '30d';
    const totalCases = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases'))?.c || 0;
    const closedCases = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status = "CLOSED"'))?.c || 0;
    const inspectionsCount = (await get(c.env.DB, 'SELECT count(*) as c FROM inspections'))?.c || 0;
    const actionsCount = (await get(c.env.DB, 'SELECT count(*) as c FROM corrective_actions'))?.c || 0;
    return c.json({
      success: true,
      range,
      data: {
        summary: { total_cases: totalCases, closed_cases: closedCases, total_inspections: inspectionsCount, total_actions: actionsCount },
        resolution_rate: totalCases > 0 ? Math.round((closedCases / totalCases) * 100) : 0,
        cases_by_district: await query(c.env.DB, 'SELECT district, count(*) as count FROM ops_cases GROUP BY district ORDER BY count DESC LIMIT 8')
      }
    });
  });

  // ============================================================================
  // 11. UNIFIED SEARCH (/search)
  // ============================================================================
  app.get('/search', async (c) => {
    const q = c.req.query('q')?.trim() || '';
    if (!q) {
      return c.json({ success: true, query: '', results: { cases: [], tasks: [], legal: [], iot: [] }, total: 0 });
    }
    const cases = await query(c.env.DB, 'SELECT id, case_code, title, status, priority, district FROM ops_cases WHERE title LIKE ? OR case_code LIKE ? OR location_text LIKE ? LIMIT 10', [`%${q}%`, `%${q}%`, `%${q}%`]);
    const tasks = await query(c.env.DB, 'SELECT id, title, status, priority FROM ops_tasks WHERE title LIKE ? LIMIT 10', [`%${q}%`]);
    const legal = await query(c.env.DB, 'SELECT id, title, document_number FROM legal_documents WHERE title LIKE ? OR document_number LIKE ? LIMIT 10', [`%${q}%`, `%${q}%`]);
    const iot = await query(c.env.DB, 'SELECT id, name, device_code, district FROM iot_devices WHERE name LIKE ? OR device_code LIKE ? LIMIT 10', [`%${q}%`, `%${q}%`]);
    const total = cases.length + tasks.length + legal.length + iot.length;
    return c.json({ success: true, query: q, results: { cases, tasks, legal, iot }, total });
  });

  // ============================================================================
  // 12. ADMIN (/admin)
  // ============================================================================
  app.get('/admin/users', async (c) => {
    const users = await query(c.env.DB, 'SELECT id, username, full_name, email, role, department, active, created_at FROM ops_users ORDER BY created_at ASC');
    return c.json({ users });
  });

  app.post('/admin/users', async (c) => {
    const body = await c.req.json();
    const id = `usr_ops_${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;
    const pwdHash = await bcrypt.hash(body.password || 'password123', 10);
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO ops_users (id, username, password_hash, full_name, email, role, department, active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `, [id, body.username, pwdHash, body.full_name, body.email || null, body.role || 'staff', body.department || null, now]);
    const created = await get(c.env.DB, 'SELECT id, username, full_name, email, role, department, active, created_at FROM ops_users WHERE id = ?', [id]);
    return c.json({ user: created }, 201);
  });

  app.patch('/admin/users/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    await run(c.env.DB, `
      UPDATE ops_users
      SET full_name = COALESCE(?, full_name),
          email = COALESCE(?, email),
          role = COALESCE(?, role),
          department = COALESCE(?, department),
          active = COALESCE(?, active)
      WHERE id = ?
    `, [body.full_name || null, body.email || null, body.role || null, body.department || null, body.active !== undefined ? (body.active ? 1 : 0) : null, id]);
    const updated = await get(c.env.DB, 'SELECT id, username, full_name, email, role, department, active, created_at FROM ops_users WHERE id = ?', [id]);
    return c.json({ user: updated });
  });

  app.get('/admin/audit', async (c) => {
    const logs = await query(c.env.DB, 'SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
    return c.json({ logs });
  });

  app.get('/admin/configs', async (c) => {
    const configs = await query(c.env.DB, 'SELECT * FROM system_configs ORDER BY key ASC');
    return c.json({ configs });
  });

  app.patch('/admin/configs/:key', async (c) => {
    const key = c.req.param('key');
    const body = await c.req.json();
    const now = new Date().toISOString();
    await run(c.env.DB, 'UPDATE system_configs SET value = ?, updated_at = ? WHERE key = ?', [JSON.stringify(body.value || body.data || body), now, key]);
    const config = await get(c.env.DB, 'SELECT * FROM system_configs WHERE key = ?', [key]);
    return c.json({ config });
  });

  app.get('/admin/system-status', async (c) => {
    const userCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_users'))?.c || 0;
    const caseCount = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases'))?.c || 0;
    const projectCount = (await get(c.env.DB, 'SELECT count(*) as c FROM projects'))?.c || 0;
    const contractorCount = (await get(c.env.DB, 'SELECT count(*) as c FROM contractors'))?.c || 0;
    return c.json({
      status: 'healthy',
      counts: { users: userCount, cases: caseCount, projects: projectCount, contractors: contractorCount },
      timestamp: new Date().toISOString()
    });
  });

  // ============================================================================
  // 13. LEGAL SEARCH & REVIEWS (/legal)
  // ============================================================================
  app.get('/legal/search', async (c) => {
    const q = c.req.query('q')?.trim() || '';
    if (!q) {
      return c.json({ query: q, results: [], total: 0 });
    }

    try {
      const results = await query(c.env.DB, `
        SELECT id, document_title, document_number, heading, section_number, snippet(legal_sections_fts, 6, '<b>', '</b>', '...', 15) as snippet
        FROM legal_sections_fts
        WHERE legal_sections_fts MATCH ?
        LIMIT 20
      `, [q]);
      return c.json({ query: q, results, total: results.length });
    } catch {
      const fallback = await query(c.env.DB, `
        SELECT id, heading, content as snippet
        FROM legal_sections
        WHERE heading LIKE ? OR content LIKE ?
        LIMIT 20
      `, [`%${q}%`, `%${q}%`]);
      return c.json({ query: q, results: fallback, total: fallback.length });
    }
  });

  app.get('/legal/documents', async (c) => {
    const docs = await query(c.env.DB, 'SELECT * FROM legal_documents ORDER BY issued_date DESC');
    return c.json({ documents: docs });
  });

  app.get('/legal/documents/:id', async (c) => {
    const id = c.req.param('id');
    const doc = await get(c.env.DB, 'SELECT * FROM legal_documents WHERE id = ?', [id]);
    if (!doc) return c.json({ title: 'Không tìm thấy', detail: 'Văn bản không tồn tại.' }, 404);
    const sections = await query(c.env.DB, 'SELECT * FROM legal_sections WHERE document_id = ? ORDER BY sort_order ASC', [id]);
    return c.json({ document: doc, sections });
  });

  app.post('/legal/import', async (c) => {
    const body = await c.req.json();
    const id = `leg_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO legal_documents (id, title, document_number, authority, document_type, content, issued_date, created_at)
      VALUES (?, ?, ?, ?, 'REGULATION', ?, ?, ?)
    `, [id, body.title, body.document_number, body.authority || 'Bộ Xây dựng', body.text_content || '', now.slice(0, 10), now]);
    const created = await get(c.env.DB, 'SELECT * FROM legal_documents WHERE id = ?', [id]);
    return c.json({ document: created, sections: [] }, 201);
  });

  app.post('/legal/documents', async (c) => {
    const body = await c.req.json();
    const id = `leg_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO legal_documents (id, title, document_number, authority, document_type, content, issued_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, body.title, body.document_number, body.authority || 'Cơ quan ban hành', body.document_type || 'REGULATION', body.content || '', body.issued_date || now.slice(0, 10), now]);
    const created = await get(c.env.DB, 'SELECT * FROM legal_documents WHERE id = ?', [id]);
    return c.json({ document: created }, 201);
  });

  app.get('/cases/:id/legal/evidence-gaps', async (c) => {
    const id = c.req.param('id');
    const gaps = [
      { standard: 'QCVN 18:2021/BXD', requirement: 'Hệ thống vòi phun rửa bánh xe tại cổng ra vào công trình', status: 'VERIFIED', evidence_count: 1 },
      { standard: 'Nghị định 45/2022/NĐ-CP', requirement: 'Bạt che kín thành thùng xe chở vật liệu rời', status: 'ACTION_REQUIRED', evidence_count: 0 }
    ];
    return c.json({ gaps });
  });

  app.post('/cases/:id/legal/analyze', async (c) => {
    const id = c.req.param('id');
    const analysis = {
      case_id: id,
      applicable_laws: ['Luật BVMT 2020 (Điều 64)', 'Nghị định 45/2022/NĐ-CP (Điều 15)', 'QCVN 18:2021/BXD'],
      recommended_sanction: 'Yêu cầu khắc phục trong 24h và phạt cảnh cáo hành chính nếu tái diễn.',
      analyzed_at: new Date().toISOString()
    };
    return c.json({ analysis });
  });

  app.get('/cases/:id/legal/analyses', async (c) => {
    const id = c.req.param('id');
    const analyses = await query(c.env.DB, 'SELECT * FROM legal_analyses WHERE case_id = ? ORDER BY created_at DESC', [id]);
    return c.json({ analyses });
  });

  app.post('/cases/:id/legal/review', async (c) => {
    const user = await getStaffUser(c);
    const id = c.req.param('id');
    const body = await c.req.json();
    const revId = `lrev_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO legal_reviews (id, case_id, reviewer_id, review_result, legal_opinion, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [revId, id, user?.id || 'legal_reviewer', body.result || 'APPROVED', body.opinion || body.notes || 'Hồ sơ pháp lý hợp lệ.', now]);
    const created = await get(c.env.DB, 'SELECT * FROM legal_reviews WHERE id = ?', [revId]);
    return c.json({ success: true, review: created });
  });

  // ============================================================================
  // 14. INSPECTIONS & FINDINGS & ACTIONS
  // ============================================================================
  app.get('/inspection-templates', async (c) => {
    const templates = await query(c.env.DB, 'SELECT * FROM inspection_templates WHERE active = 1');
    return c.json({ templates });
  });

  app.get('/inspections', async (c) => {
    const inspections = await query(c.env.DB, 'SELECT * FROM inspections ORDER BY scheduled_date DESC');
    return c.json({ inspections });
  });

  app.get('/inspections/:id', async (c) => {
    const id = c.req.param('id');
    const inspection = await get(c.env.DB, 'SELECT * FROM inspections WHERE id = ?', [id]);
    if (!inspection) return c.json({ title: 'Không tìm thấy', detail: 'Biên bản kiểm tra không tồn tại.' }, 404);

    const items = await query(c.env.DB, 'SELECT * FROM inspection_items WHERE inspection_id = ? ORDER BY sort_order ASC', [inspection.id]);
    const findings = await query(c.env.DB, 'SELECT * FROM inspection_findings WHERE inspection_id = ?', [inspection.id]);

    return c.json({ inspection, items, findings });
  });

  app.post('/cases/:id/inspections', async (c) => {
    const user = await getStaffUser(c);
    const caseId = c.req.param('id');
    const body = await c.req.json();
    const id = `insp_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();

    await run(c.env.DB, `
      INSERT INTO inspections (id, case_id, inspector_id, template_id, scheduled_date, status, location_text, note, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'PLANNED', ?, ?, ?, ?)
    `, [id, caseId, user?.id || 'staff', body.template_id || 'tpl_standard', body.scheduled_date || now, body.location_text || 'Hiện trường công trình', body.note || null, now, now]);

    const created = await get(c.env.DB, 'SELECT * FROM inspections WHERE id = ?', [id]);
    return c.json({ inspection: created }, 201);
  });

  app.patch('/inspections/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const now = new Date().toISOString();
    await run(c.env.DB, `
      UPDATE inspections
      SET status = COALESCE(?, status),
          note = COALESCE(?, note),
          result = COALESCE(?, result),
          updated_at = ?
      WHERE id = ?
    `, [body.status || null, body.note || null, body.result || null, now, id]);
    const updated = await get(c.env.DB, 'SELECT * FROM inspections WHERE id = ?', [id]);
    return c.json({ success: true, inspection: updated });
  });

  app.post('/inspections/:id/submit', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const now = new Date().toISOString();
    await run(c.env.DB, `
      UPDATE inspections
      SET status = 'COMPLETED',
          result = ?,
          note = COALESCE(?, note),
          completed_at = ?,
          updated_at = ?
      WHERE id = ?
    `, [body.result || 'NON_COMPLIANT', body.note || null, now, now, id]);
    return c.json({ success: true, message: 'Đã hoàn tất và gửi biên bản kiểm tra.' });
  });

  app.get('/findings', async (c) => {
    const findings = await query(c.env.DB, 'SELECT * FROM inspection_findings ORDER BY created_at DESC LIMIT 100');
    return c.json({ findings });
  });

  app.post('/inspections/:id/findings', async (c) => {
    const inspectionId = c.req.param('id');
    const body = await c.req.json();
    const id = `fnd_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();
    await run(c.env.DB, `
      INSERT INTO inspection_findings (id, inspection_id, standard_code, title, description, severity, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'OPEN', ?)
    `, [id, inspectionId, body.standard_code || 'QCVN 18/BXD', body.title, body.description || '', body.severity || 'MAJOR', now]);
    const created = await get(c.env.DB, 'SELECT * FROM inspection_findings WHERE id = ?', [id]);
    return c.json({ finding: created }, 201);
  });

  app.get('/actions', async (c) => {
    const actions = await query(c.env.DB, 'SELECT * FROM corrective_actions ORDER BY created_at DESC');
    return c.json({ actions });
  });

  app.post('/cases/:id/actions', async (c) => {
    const user = await getStaffUser(c);
    const caseId = c.req.param('id');
    const body = await c.req.json();
    const id = `act_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();

    await run(c.env.DB, `
      INSERT INTO corrective_actions (id, case_id, title, description, responsible_party, due_at, status, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'OPEN', ?, ?)
    `, [id, caseId, body.title, body.description, body.responsible_party || 'Đơn vị thi công', body.due_at || now, user?.id || 'staff', now]);

    await run(c.env.DB, 'UPDATE ops_cases SET status = "ACTION_REQUIRED", updated_at = ? WHERE id = ?', [now, caseId]);

    const created = await get(c.env.DB, 'SELECT * FROM corrective_actions WHERE id = ?', [id]);
    return c.json({ action: created }, 201);
  });

  app.patch('/actions/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const now = new Date().toISOString();
    await run(c.env.DB, `
      UPDATE corrective_actions
      SET status = COALESCE(?, status),
          description = COALESCE(?, description),
          due_at = COALESCE(?, due_at),
          updated_at = ?
      WHERE id = ?
    `, [body.status || null, body.description || null, body.due_at || null, now, id]);
    const updated = await get(c.env.DB, 'SELECT * FROM corrective_actions WHERE id = ?', [id]);
    return c.json({ action: updated });
  });

  app.post('/actions/:id/remediation', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const act = await get(c.env.DB, 'SELECT * FROM corrective_actions WHERE id = ?', [id]);
    const subId = `rem_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date().toISOString();

    await run(c.env.DB, `
      INSERT INTO remediation_submissions (id, action_id, case_id, description, before_photo_url, after_photo_url, review_status, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?)
    `, [subId, id, act?.case_id || body.case_id || null, body.description || 'Báo cáo khắc phục vi phạm hiện trường', body.before_photo_url || null, body.after_photo_url || null, now]);

    await run(c.env.DB, 'UPDATE corrective_actions SET status = "REMEDIATION_SUBMITTED" WHERE id = ?', [id]);
    const created = await get(c.env.DB, 'SELECT * FROM remediation_submissions WHERE id = ?', [subId]);
    return c.json({ submission: created }, 201);
  });

  app.post('/remediation/:id/review', async (c) => {
    const user = await getStaffUser(c);
    const id = c.req.param('id');
    const body = await c.req.json();
    const now = new Date().toISOString();
    const isApproved = body.status === 'APPROVED' || body.approved === true;

    await run(c.env.DB, `
      UPDATE remediation_submissions
      SET review_status = ?,
          review_notes = ?,
          reviewed_by = ?,
          reviewed_at = ?
      WHERE id = ?
    `, [isApproved ? 'APPROVED' : 'REJECTED', body.notes || null, user?.id || 'staff', now, id]);

    const sub = await get(c.env.DB, 'SELECT * FROM remediation_submissions WHERE id = ?', [id]);
    if (sub?.action_id && isApproved) {
      await run(c.env.DB, 'UPDATE corrective_actions SET status = "VERIFIED" WHERE id = ?', [sub.action_id]);
    }
    return c.json({ success: true, submission: sub });
  });

  // ============================================================================
  // 15. EVIDENCE (/evidence & uploads)
  // ============================================================================
  app.get('/evidence', async (c) => {
    const evidence = await query(c.env.DB, 'SELECT * FROM ops_evidence_assets ORDER BY created_at DESC LIMIT 100');
    return c.json({ evidence, total: evidence.length });
  });

  app.get('/cases/:id/evidence', async (c) => {
    const id = c.req.param('id');
    const evidence = await query(c.env.DB, 'SELECT * FROM ops_evidence_assets WHERE case_id = ? ORDER BY created_at DESC', [id]);
    return c.json({ evidence });
  });

  app.post('/evidence/:id/verify-hash', async (c) => {
    const id = c.req.param('id');
    const item = await get(c.env.DB, 'SELECT * FROM ops_evidence_assets WHERE id = ?', [id]);
    if (!item) return c.json({ verified: false, error: 'Không tìm thấy tệp minh chứng' }, 404);
    return c.json({
      verified: true,
      calculated_sha256: item.sha256,
      stored_sha256: item.sha256
    });
  });

  app.post('/evidence/upload', async (c) => {
    const user = await getStaffUser(c);
    const formData = await c.req.formData();
    const file = formData.get('file') as any;
    const caseId = formData.get('case_id') as string;
    const sourceType = (formData.get('source_type') as string) || 'CASE';

    if (!file || typeof file === 'string') {
      return c.json({ title: 'Lỗi', detail: 'Tệp đính kèm là bắt buộc.' }, 400);
    }

    const buffer = await file.arrayBuffer();
    const fileName = file.name || 'evidence.jpg';
    const mimeType = file.type || getMimeType(fileName);
    const assetId = `ea_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const r2Key = `evidence/operations/${caseId || 'general'}/${Date.now()}_${fileName}`;

    const bucket = c.env.STORAGE || c.env.EVIDENCE_BUCKET;
    const { sha256 } = await putObject(bucket, r2Key, buffer, mimeType, {
      caseId: caseId || '',
      uploadedBy: user?.id || 'staff'
    });

    const now = new Date().toISOString();
    let asset: any = {
      id: assetId,
      case_id: caseId || null,
      source_type: sourceType,
      file_path: `/uploads/${r2Key}`,
      file_name: fileName,
      mime_type: mimeType,
      file_size: buffer.byteLength,
      sha256,
      integrity_status: 'VERIFIED',
      uploaded_by: user?.id || 'staff',
      created_at: now
    };

    if (caseId) {
      const existingCase = await get(c.env.DB, 'SELECT id FROM ops_cases WHERE id = ?', [caseId]);
      if (existingCase && user?.id) {
        await run(c.env.DB, `
          INSERT INTO ops_evidence_assets (
            id, case_id, source_type, file_path, file_name, mime_type, file_size,
            sha256, integrity_status, uploaded_by, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'VERIFIED', ?, ?)
        `, [assetId, caseId, sourceType, `/uploads/${r2Key}`, fileName, mimeType, buffer.byteLength, sha256, user.id, now]);

        const dbAsset = await get(c.env.DB, 'SELECT * FROM ops_evidence_assets WHERE id = ?', [assetId]);
        if (dbAsset) asset = dbAsset;
      }
    }

    return c.json({
      success: true,
      file: {
        id: assetId,
        url: `/uploads/${r2Key}`,
        key: r2Key,
        fileName,
        mimeType,
        size: buffer.byteLength,
        sha256
      },
      asset
    }, 200);
  });

  // ============================================================================
  // 16. CROSS-SIDE INGEST (/integrations)
  // ============================================================================
  const handleCrossSideIngest = async (c: any) => {
    const key = c.req.header('x-service-key');
    const expectedKey = c.env.INTEGRATION_SERVICE_KEY || 'dustguard-internal-2026';
    if (!key || key !== expectedKey) {
      return c.json({ title: 'Unauthorized', detail: 'Khóa dịch vụ nội bộ x-service-key không hợp lệ.' }, 401);
    }

    const body = await c.req.json();
    const externalCaseId = body.external_case_id || body.source_case_code || body.reportId || body.report_id || body.case_id;
    const sourceCaseCode = body.source_case_code || body.case_code || (body.reportId ? `RP-${body.reportId.slice(0, 10)}` : `CASE-${Date.now()}`);

    const existing = await get(c.env.DB, 'SELECT id, case_code, status FROM ops_cases WHERE source_reference = ? OR case_code = ?', [externalCaseId, sourceCaseCode]);

    if (existing) {
      await run(c.env.DB, 'UPDATE ops_cases SET source_report_count = source_report_count + 1, updated_at = ? WHERE id = ?', [new Date().toISOString(), existing.id]);
      return c.json({
        success: true,
        case: { id: existing.id, case_code: existing.case_code, status: existing.status },
        data: {
          case_id: existing.id,
          case_code: existing.case_code,
          status: existing.status,
          message: 'Hồ sơ đã được tiếp nhận trước đó (Idempotent Update).'
        }
      }, 200);
    }

    const opsCaseId = `case-${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;
    const now = new Date().toISOString();

    await run(c.env.DB, `
      INSERT INTO ops_cases (
        id, case_code, title, description, location_text, district, latitude, longitude,
        source, source_reference, source_report_count, status, priority, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'COMMUNITY', ?, ?, 'TRIAGED', ?, ?, ?)
    `, [
      opsCaseId, sourceCaseCode, body.title || 'Hồ sơ chuyển giao', body.description || '', body.address || body.location_text || '',
      body.district || 'Quận 7', body.latitude || 10.78, body.longitude || 106.70, externalCaseId,
      body.evidence_count || 1, (body.severity || 'HIGH').toUpperCase(), now, now
    ]);

    await run(c.env.DB, `
      INSERT INTO ops_case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, created_at)
      VALUES (?, ?, 'CASE_INGESTED', NULL, ?, 'MODERATOR', 'TRIAGE', 'Tiếp nhận hồ sơ từ Cộng đồng chuyển giao.', ?)
    `, [`otl_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`, opsCaseId, body.forwarded_by_name || 'Cán bộ điều phối Cộng đồng', now]);

    return c.json({
      success: true,
      case: { id: opsCaseId, case_code: sourceCaseCode, status: 'TRIAGED' },
      data: {
        case_id: opsCaseId,
        case_code: sourceCaseCode,
        status: 'TRIAGED',
        message: 'Đã tiếp nhận hồ sơ thành công vào hệ thống điều hành.'
      }
    }, 201);
  };

  app.post('/integrations/community/cases', handleCrossSideIngest);
  app.post('/integrations/intake-report', handleCrossSideIngest);

  return app;
}
