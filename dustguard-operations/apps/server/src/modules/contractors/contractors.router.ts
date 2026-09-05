import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { get, query, run } from '../../db/connection.js';
import { requireAuth } from '../../middleware/auth.js';

export const contractorsRouter = Router();

// GET /api/contractors - List contractors
contractorsRouter.get('/', requireAuth, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    let sql = `
      SELECT c.*,
             count(DISTINCT p.id) as projects_count,
             count(DISTINCT cs.id) as active_cases_count
      FROM contractors c
      LEFT JOIN projects p ON p.contractor_id = c.id
      LEFT JOIN cases cs ON (cs.contractor_id = c.id OR cs.contractor_name = c.name) AND cs.status != 'CLOSED'
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ` AND (c.name LIKE ? OR c.contact_person LIKE ? OR c.phone LIKE ? OR c.tax_id LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ` GROUP BY c.id ORDER BY c.created_at DESC`;

    const contractors = query(sql, params);
    res.json({ success: true, contractors, total: contractors.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/contractors/:id - Get contractor detail
contractorsRouter.get('/:id', requireAuth, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const contractor = get(`SELECT * FROM contractors WHERE id = ?`, [id]);
    if (!contractor) {
      res.status(404).json({ error: 'Không tìm thấy nhà thầu' });
      return;
    }

    const projects = query(`SELECT * FROM projects WHERE contractor_id = ? ORDER BY created_at DESC`, [id]);
    const cases = query(
      `SELECT * FROM cases WHERE contractor_id = ? OR contractor_name = ? ORDER BY created_at DESC`,
      [id, contractor.name]
    );

    res.json({ success: true, contractor, projects, cases });
  } catch (err) {
    next(err);
  }
});

// POST /api/contractors - Create contractor
contractorsRouter.post('/', requireAuth, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, contact_person, phone, email, address, tax_id, notes } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Tên nhà thầu / đơn vị thi công là bắt buộc' });
      return;
    }

    const contractorId = `ctr-${crypto.randomUUID().substring(0, 8)}`;

    run(
      `INSERT INTO contractors (id, name, contact_person, phone, email, address, tax_id, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [contractorId, name.trim(), contact_person || null, phone || null, email || null, address || null, tax_id || null, notes || null]
    );

    const contractor = get(`SELECT * FROM contractors WHERE id = ?`, [contractorId]);
    res.status(201).json({ success: true, contractor });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/contractors/:id - Update contractor
contractorsRouter.patch('/:id', requireAuth, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existing = get(`SELECT * FROM contractors WHERE id = ?`, [id]);
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy nhà thầu' });
      return;
    }

    const { name, contact_person, phone, email, address, tax_id, notes } = req.body;

    run(
      `UPDATE contractors
       SET name = COALESCE(?, name),
           contact_person = COALESCE(?, contact_person),
           phone = COALESCE(?, phone),
           email = COALESCE(?, email),
           address = COALESCE(?, address),
           tax_id = COALESCE(?, tax_id),
           notes = COALESCE(?, notes),
           updated_at = datetime('now')
       WHERE id = ?`,
      [name, contact_person, phone, email, address, tax_id, notes, id]
    );

    const updated = get(`SELECT * FROM contractors WHERE id = ?`, [id]);
    res.json({ success: true, contractor: updated });
  } catch (err) {
    next(err);
  }
});
