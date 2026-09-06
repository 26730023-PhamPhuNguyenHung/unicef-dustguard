import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { get, query, run } from '../../db/connection.js';
import { requireAuth } from '../../middleware/auth.js';

export const projectsRouter = Router();

// GET /api/projects - List projects
projectsRouter.get('/', requireAuth, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { district, status, search } = req.query;
    let sql = `
      SELECT p.*,
             count(DISTINCT c.id) as cases_count,
             count(DISTINCT d.id) as iot_devices_count
      FROM projects p
      LEFT JOIN cases c ON c.project_id = p.id
      LEFT JOIN iot_devices d ON d.project_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (district) {
      sql += ` AND p.district = ?`;
      params.push(district);
    }
    if (status) {
      sql += ` AND p.status = ?`;
      params.push(status);
    }
    if (search) {
      sql += ` AND (p.name LIKE ? OR p.code LIKE ? OR p.address LIKE ? OR p.contractor_name LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const projects = query(sql, params);
    res.json({ success: true, projects, total: projects.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id - Get project detail
projectsRouter.get('/:id', requireAuth, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const project = get(`SELECT * FROM projects WHERE id = ? OR code = ?`, [id, id]);
    if (!project) {
      res.status(404).json({ error: 'Không tìm thấy công trình xây dựng' });
      return;
    }

    const cases = query(`SELECT * FROM cases WHERE project_id = ? ORDER BY created_at DESC`, [project.id]);
    const iot_devices = query(`SELECT * FROM iot_devices WHERE project_id = ? ORDER BY created_at DESC`, [project.id]);

    res.json({ success: true, project, cases, iot_devices });
  } catch (err) {
    next(err);
  }
});

// POST /api/projects - Create new project
projectsRouter.post('/', requireAuth, (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      code,
      address,
      district = req.body.ward || req.body.district || 'Láng Thượng',
      province = 'Hà Nội',
      latitude = 21.0205,
      longitude = 105.8078,
      contractor_id,
      contractor_name,
      project_owner,
      status = 'ACTIVE',
      start_date,
      end_date,
      notes,
    } = req.body;

    if (!name || !address) {
      res.status(400).json({ error: 'Tên công trình, địa chỉ và quận/huyện là bắt buộc' });
      return;
    }

    // Auto-generate project code if not provided
    const countRow = get<{ c: number }>(`SELECT count(*) as c FROM projects`);
    const projectCode = code || `CT-${String((countRow?.c || 0) + 1).padStart(3, '0')}`;
    const projectId = `prj-${crypto.randomUUID().substring(0, 8)}`;

    // Resolve contractor name if contractor_id provided
    let resolvedContractorName = contractor_name;
    if (contractor_id && !resolvedContractorName) {
      const cRow = get<{ name: string }>(`SELECT name FROM contractors WHERE id = ?`, [contractor_id]);
      if (cRow) resolvedContractorName = cRow.name;
    }

    run(
      `INSERT INTO projects (id, code, name, address, district, province, latitude, longitude, contractor_id, contractor_name, project_owner, status, start_date, end_date, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        projectId,
        projectCode,
        name,
        address,
        district,
        province,
        Number(latitude) || null,
        Number(longitude) || null,
        contractor_id || null,
        resolvedContractorName || null,
        project_owner || null,
        status,
        start_date || null,
        end_date || null,
        notes || null,
      ]
    );

    const project = get(`SELECT * FROM projects WHERE id = ?`, [projectId]);
    res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/projects/:id - Update project
projectsRouter.patch('/:id', requireAuth, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existing = get(`SELECT * FROM projects WHERE id = ?`, [id]);
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy công trình' });
      return;
    }

    const { name, address, district, status, notes, contractor_id, contractor_name, project_owner } = req.body;

    run(
      `UPDATE projects
       SET name = COALESCE(?, name),
           address = COALESCE(?, address),
           district = COALESCE(?, district),
           status = COALESCE(?, status),
           notes = COALESCE(?, notes),
           contractor_id = COALESCE(?, contractor_id),
           contractor_name = COALESCE(?, contractor_name),
           project_owner = COALESCE(?, project_owner),
           updated_at = datetime('now')
       WHERE id = ?`,
      [name, address, district, status, notes, contractor_id, contractor_name, project_owner, id]
    );

    const updated = get(`SELECT * FROM projects WHERE id = ?`, [id]);
    res.json({ success: true, project: updated });
  } catch (err) {
    next(err);
  }
});
