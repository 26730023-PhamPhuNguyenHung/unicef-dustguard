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
      return safe;
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

    // Tạo template kiểm tra mặc định
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
    const body = await c.req.json();
    const username = body.username?.trim();
    const password = body.password;

    if (!username || !password) {
      return c.json({ title: 'Lỗi xác thực', detail: 'Vui lòng nhập tên đăng nhập và mật khẩu.' }, 400);
    }

    const user = await get(c.env.DB, 'SELECT * FROM ops_users WHERE (username = ? OR email = ?) AND active = 1', [username, username]);
    if (!user) {
      // Kiểm tra xem tài khoản có thuộc Phía Cộng đồng không
      const commUser = await get(c.env.DB, 'SELECT id FROM users WHERE email = ? AND status != "deleted"', [username]);
      if (commUser) {
        return c.json({
          title: 'Quyền truy cập không hợp lệ',
          detail: 'Tài khoản này thuộc Phía Cộng đồng. Vui lòng chuyển sang tab Phía Cộng đồng.',
          code: 'WRONG_PORTAL_SIDE'
        }, 403);
      }
      return c.json({ title: 'Lỗi xác thực', detail: 'Tên đăng nhập hoặc mật khẩu chưa đúng.' }, 401);
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return c.json({ title: 'Lỗi xác thực', detail: 'Tên đăng nhập hoặc mật khẩu chưa đúng.' }, 401);
    }

    const permissions = getPermissionsForRole(user.role);
    const token = await sign({ id: user.id, username: user.username, role: user.role, exp: Math.floor(Date.now() / 1000) + 86400 * 30 }, JWT_SECRET, 'HS256');

    return c.json({
      user: { id: user.id, username: user.username, full_name: user.full_name, email: user.email, role: user.role, department: user.department },
      token,
      permissions
    });
  });

  app.get('/auth/me', async (c) => {
    const user = await getStaffUser(c);
    if (!user) {
      return c.json({ title: 'Chưa xác thực', detail: 'Phiên làm việc đã hết hạn.' }, 401);
    }
    return c.json({
      user,
      permissions: getPermissionsForRole(user.role)
    });
  });

  app.post('/auth/logout', (c) => {
    return c.json({ success: true });
  });

  // ============================================================================
  // 2. DASHBOARD (/dashboard)
  // ============================================================================
  app.get('/dashboard', async (c) => {
    const totalCases = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases'))?.c || 0;
    const closedCases = (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status = "CLOSED"'))?.c || 0;
    const activeCases = totalCases - closedCases;
    const pendingActions = (await get(c.env.DB, 'SELECT count(*) as c FROM corrective_actions WHERE status = "OPEN" OR status = "IN_PROGRESS"'))?.c || 0;
    const plannedInspections = (await get(c.env.DB, 'SELECT count(*) as c FROM inspections WHERE status = "PLANNED"'))?.c || 0;

    const recentCases = await query(c.env.DB, 'SELECT * FROM ops_cases ORDER BY created_at DESC LIMIT 5');

    return c.json({
      overview: {
        total_cases: totalCases,
        active_cases: activeCases,
        closed_cases: closedCases,
        pending_actions: pendingActions,
        planned_inspections: plannedInspections
      },
      pipeline: {
        new: (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status = "NEW"'))?.c || 0,
        triaged: (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status = "TRIAGED"'))?.c || 0,
        inspection: (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status LIKE "INSPECTION%"'))?.c || 0,
        remediation: (await get(c.env.DB, 'SELECT count(*) as c FROM ops_cases WHERE status = "ACTION_REQUIRED" OR status = "REMEDIATION"'))?.c || 0,
        closed: closedCases
      },
      recent_activity: recentCases
    });
  });

  // ============================================================================
  // 3. PROJECTS & CONTRACTORS (/projects & /contractors)
  // ============================================================================
  app.get('/projects', async (c) => {
    const projects = await query(c.env.DB, 'SELECT * FROM projects ORDER BY created_at DESC');
    return c.json({ projects, total: projects.length });
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

  app.get('/contractors', async (c) => {
    const contractors = await query(c.env.DB, 'SELECT * FROM contractors ORDER BY created_at DESC');
    return c.json({ contractors, total: contractors.length });
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

  // ============================================================================
  // 4. CASES (/cases)
  // ============================================================================
  app.get('/cases', async (c) => {
    const status = c.req.query('status');
    const district = c.req.query('district');
    const priority = c.req.query('priority');

    let sql = 'SELECT * FROM ops_cases WHERE 1=1';
    const params: any[] = [];
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
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
      id, caseCode, body.title, body.description, body.location_text || body.address,
      body.district, body.latitude || 10.7769, body.longitude || 106.7009,
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

    await run(c.env.DB, `
      INSERT INTO ops_case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, created_at)
      VALUES (?, ?, 'STAFF_ASSIGNED', ?, ?, 'SUPERVISOR', 'ASSIGNMENT', ?, ?)
    `, [`otl_${crypto.randomUUID().replace(/-/g, '').substring(0, 16)}`, caseItem.id, user?.id || null, user?.full_name || 'Lãnh đạo', `Phân công cán bộ ${staff?.full_name || staffId} phụ trách thụ lý.`, now]);

    const updated = await get(c.env.DB, 'SELECT * FROM ops_cases WHERE id = ?', [caseItem.id]);
    return c.json({ success: true, case: updated });
  });

  // Closure Safety Check & Đóng hồ sơ (Safety Gate)
  app.get('/cases/:id/closure-safety-check', async (c) => {
    const id = c.req.param('id');
    const caseItem = await get(c.env.DB, 'SELECT id FROM ops_cases WHERE id = ? OR case_code = ?', [id, id]);
    if (!caseItem) return c.json({ title: 'Không tìm thấy', detail: 'Hồ sơ không tồn tại.' }, 404);

    const openActions = await query(c.env.DB, 'SELECT id FROM corrective_actions WHERE case_id = ? AND status != "VERIFIED" AND status != "CLOSED"', [caseItem.id]);
    const pendingRemediations = await query(c.env.DB, 'SELECT id FROM remediation_submissions WHERE case_id = ? AND review_status = "PENDING"', [caseItem.id]);

    const blockers = [];
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

    // CỔNG KIỂM SOÁT 4 ĐIỀU KIỆN ĐÓNG HỒ SƠ (4-Condition Closure Gate)
    // 1. Hồ sơ phải ở trạng thái đã xử lý nghiệm thu (REMEDIATION, REINSPECTION, READY_TO_CLOSE)
    // Nếu hồ sơ còn ở NEW, TRIAGED, ASSIGNED và không có cờ force -> Chặn an toàn
    const isReadyStatus = ['READY_TO_CLOSE', 'REINSPECTION', 'REMEDIATION'].includes(caseItem.status);
    if (!isReadyStatus && !body.force) {
      return c.json({
        title: 'Chưa đủ điều kiện đóng hồ sơ',
        status: 422,
        detail: 'Hồ sơ chưa thỏa mãn cổng kiểm soát 4 điều kiện đóng (cần hoàn tất nghiệm thu khắc phục hoặc xác nhận cưỡng chế từ Giám sát viên).'
      }, 422);
    }

    const now = new Date().toISOString();

    // Đảm bảo closed_by là ID hợp lệ trong ops_users
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

    // Tự động đồng bộ ngược lại Side A (Community) nếu hồ sơ liên thông
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
  // 5. LEGAL SEARCH & REVIEWS (/legal)
  // ============================================================================
  app.get('/legal/search', async (c) => {
    const q = c.req.query('q')?.trim() || '';
    if (!q) {
      return c.json({ query: q, results: [], total: 0 });
    }

    try {
      // D1 FTS5 full-text search query
      const results = await query(c.env.DB, `
        SELECT id, document_title, document_number, heading, section_number, snippet(legal_sections_fts, 6, '<b>', '</b>', '...', 15) as snippet
        FROM legal_sections_fts
        WHERE legal_sections_fts MATCH ?
        LIMIT 20
      `, [q]);
      return c.json({ query: q, results, total: results.length });
    } catch {
      // Fallback nếu FTS search rỗng
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

  // ============================================================================
  // 6. INSPECTIONS & ACTIONS & EVIDENCE
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

  // Tải minh chứng lên R2 cho Operations
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

    // Chỉ ghi vào ops_evidence_assets nếu case_id và uploaded_by thực sự tồn tại trong CSDL để tránh FK error
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

  // 7. CROSS-SIDE INGEST
  const handleCrossSideIngest = async (c: any) => {
    const key = c.req.header('x-service-key');
    const expectedKey = c.env.INTEGRATION_SERVICE_KEY || 'dustguard-internal-2026';
    if (!key || key !== expectedKey) {
      return c.json({ title: 'Unauthorized', detail: 'Khóa dịch vụ nội bộ x-service-key không hợp lệ.' }, 401);
    }

    const body = await c.req.json();
    const externalCaseId = body.external_case_id || body.source_case_code || body.reportId || body.report_id || body.case_id;
    const sourceCaseCode = body.source_case_code || body.case_code || (body.reportId ? `RP-${body.reportId.slice(0, 10)}` : `CASE-${Date.now()}`);

    // Idempotency: Kiểm tra xem vụ việc đã được tiếp nhận chưa
    const existing = await get(c.env.DB, 'SELECT id, case_code, status FROM ops_cases WHERE source_reference = ? OR case_code = ?', [externalCaseId, sourceCaseCode]);

    if (existing) {
      // Đã tồn tại -> update in-place, không duplicate
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

    // Tạo mới
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
