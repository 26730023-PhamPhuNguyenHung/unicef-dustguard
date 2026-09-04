import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { get, query, run } from '../../db/connection.js';
import { AuthRequest, requireAuth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/rbac.js';
import { FindingCreateSchema } from '../../shared.js';

export const findingsRouter = Router();

// GET /api/findings - List findings across cases
findingsRouter.get('/', requireAuth, (req, res) => {
  const { case_id, severity } = req.query;

  let sql = `
    SELECT f.*, c.case_code, c.title as case_title, ls.section_number as legal_section_number,
           ea.file_path as evidence_file_path
    FROM inspection_findings f
    JOIN cases c ON f.case_id = c.id
    LEFT JOIN legal_sections ls ON f.legal_section_id = ls.id
    LEFT JOIN evidence_assets ea ON f.evidence_asset_id = ea.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (case_id && typeof case_id === 'string') {
    sql += ` AND f.case_id = ?`;
    params.push(case_id);
  }
  if (severity && typeof severity === 'string') {
    sql += ` AND f.severity = ?`;
    params.push(severity);
  }

  sql += ` ORDER BY f.created_at DESC`;
  const findings = query(sql, params);
  res.json({ findings });
});

// POST /api/inspections/:id/findings - Create new finding
findingsRouter.post('/:id/findings', requirePermission('action:create'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const data = FindingCreateSchema.parse({ ...req.body, inspection_id: id });

    const inspection = get<any>(`SELECT * FROM inspections WHERE id = ?`, [id]);
    if (!inspection) {
      res.status(404).json({ error: 'Không tìm thấy đợt kiểm tra' });
      return;
    }

    const findingId = `fnd-${crypto.randomUUID().substring(0, 8)}`;
    run(
      `INSERT INTO inspection_findings (id, inspection_id, case_id, category, finding, severity, legal_section_id, evidence_asset_id, staff_note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        findingId,
        id,
        inspection.case_id,
        data.category,
        data.finding,
        data.severity,
        data.legal_section_id || null,
        data.evidence_asset_id || null,
        data.staff_note || null,
      ]
    );

    const created = get(`SELECT * FROM inspection_findings WHERE id = ?`, [findingId]);
    res.status(201).json({ finding: created });
  } catch (err) {
    next(err);
  }
});
