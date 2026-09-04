import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { get, query, run, transaction } from '../../db/connection.js';
import { AuthRequest, requireAuth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/rbac.js';
import {
  InspectionCreateSchema,
  InspectionSubmitSchema,
  Inspection,
  InspectionItem,
  InspectionTemplate,
} from '../../shared.js';

export const templatesRouter = Router();

templatesRouter.get('/', (req, res) => {
  const templates = query<InspectionTemplate>(
    `SELECT * FROM inspection_templates WHERE active = 1 ORDER BY created_at DESC`
  );

  const enriched = templates.map(t => {
    const items = query(
      `SELECT iti.*, ls.section_number as legal_section_number, ls.heading as legal_heading
       FROM inspection_template_items iti
       LEFT JOIN legal_sections ls ON iti.legal_section_id = ls.id
       WHERE iti.template_id = ?
       ORDER BY iti.sort_order ASC`,
      [t.id]
    );
    return { ...t, items };
  });

  res.json({ templates: enriched });
});

export const inspectionsRouter = Router();

// Sub-route /templates
inspectionsRouter.use('/templates', templatesRouter);

// GET /api/inspections - List all inspections
inspectionsRouter.get('/', requireAuth, (req: AuthRequest, res) => {
  const { case_id, inspector_id, status } = req.query;

  let sql = `
    SELECT i.*, c.case_code, c.title as case_title, u.full_name as inspector_name, it.name as template_name
    FROM inspections i
    JOIN cases c ON i.case_id = c.id
    JOIN users u ON i.inspector_id = u.id
    JOIN inspection_templates it ON i.template_id = it.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (case_id && typeof case_id === 'string') {
    sql += ` AND i.case_id = ?`;
    params.push(case_id);
  }
  if (inspector_id && typeof inspector_id === 'string') {
    sql += ` AND i.inspector_id = ?`;
    params.push(inspector_id);
  }
  if (status && typeof status === 'string') {
    sql += ` AND i.status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY i.scheduled_date DESC, i.created_at DESC`;

  const inspections = query(sql, params);
  res.json({ inspections });
});

// GET /api/inspections/:id - Detail view with items, findings, and evidence
inspectionsRouter.get('/:id', requireAuth, (req, res) => {
  const { id } = req.params;

  const inspection = get(
    `SELECT i.*, c.case_code, c.title as case_title, c.district, c.contractor_name, u.full_name as inspector_name, it.name as template_name
     FROM inspections i
     JOIN cases c ON i.case_id = c.id
     JOIN users u ON i.inspector_id = u.id
     JOIN inspection_templates it ON i.template_id = it.id
     WHERE i.id = ?`,
    [id]
  );

  if (!inspection) {
    res.status(404).json({ error: 'Không tìm thấy đợt kiểm tra' });
    return;
  }

  const items = query<InspectionItem>(
    `SELECT ii.*, iti.required, iti.description,
            ls.section_number as legal_section_number, ls.heading as legal_heading,
            ea.file_path as evidence_file_path, ea.file_name as evidence_file_name
     FROM inspection_items ii
     LEFT JOIN inspection_template_items iti ON ii.template_item_id = iti.id
     LEFT JOIN legal_sections ls ON ii.legal_section_id = ls.id
     LEFT JOIN evidence_assets ea ON ii.evidence_asset_id = ea.id
     WHERE ii.inspection_id = ?
     ORDER BY ii.sort_order ASC`,
    [id]
  );

  const findings = query(
    `SELECT f.*, ls.section_number as legal_section_number, ls.heading as legal_heading,
            ea.file_path as evidence_file_path
     FROM inspection_findings f
     LEFT JOIN legal_sections ls ON f.legal_section_id = ls.id
     LEFT JOIN evidence_assets ea ON f.evidence_asset_id = ea.id
     WHERE f.inspection_id = ?
     ORDER BY f.created_at DESC`,
    [id]
  );

  res.json({ inspection, items, findings });
});

// POST /api/cases/:id/inspections - Plan and schedule new inspection
inspectionsRouter.post('/:id/inspections', requirePermission('inspection:create'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const data = InspectionCreateSchema.parse({ ...req.body, case_id: id });

    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [id]);
    if (!targetCase) {
      res.status(404).json({ error: 'Không tìm thấy hồ sơ vụ việc' });
      return;
    }

    const template = get(`SELECT * FROM inspection_templates WHERE id = ?`, [data.template_id]);
    if (!template) {
      res.status(400).json({ error: 'Mẫu biên bản kiểm tra không tồn tại' });
      return;
    }

    const inspectionId = `insp-${crypto.randomUUID().substring(0, 8)}`;

    transaction(() => {
      run(
        `INSERT INTO inspections (id, case_id, inspector_id, template_id, inspection_type, scheduled_date, status, location_text, note, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'PLANNED', ?, ?, datetime('now'), datetime('now'))`,
        [
          inspectionId,
          id,
          req.user!.id,
          data.template_id,
          data.inspection_type,
          data.scheduled_date,
          data.location_text,
          data.note || null,
        ]
      );

      // Copy template items to inspection items
      const templateItems = query(
        `SELECT * FROM inspection_template_items WHERE template_id = ? ORDER BY sort_order ASC`,
        [data.template_id]
      );

      for (const ti of templateItems) {
        run(
          `INSERT INTO inspection_items (id, inspection_id, template_item_id, label, legal_section_id, status, sort_order)
           VALUES (?, ?, ?, ?, ?, 'UNKNOWN', ?)`,
          [`ii-${crypto.randomUUID()}`, inspectionId, ti.id, ti.label, ti.legal_section_id, ti.sort_order]
        );
      }

      // Advance case status to INSPECTION_PLANNED if applicable
      if (['ASSIGNED', 'LEGAL_REVIEW', 'ACTION_REQUIRED', 'REMEDIATION'].includes(targetCase.status)) {
        run(`UPDATE cases SET status = 'INSPECTION_PLANNED', updated_at = datetime('now') WHERE id = ?`, [id]);
      }

      // Timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'INSPECTION_SCHEDULED', ?, ?, ?, 'INSPECTION', ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          id,
          req.user!.id,
          req.user!.full_name,
          req.user!.role,
          `Đã lập kế hoạch kiểm tra hiện trường vào ngày ${data.scheduled_date} theo mẫu "${template.name}".`,
          JSON.stringify({ inspection_id: inspectionId, type: data.inspection_type }),
        ]
      );

      // Audit log
      run(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
         VALUES (?, ?, 'INSPECTION_CREATED', 'INSPECTION', ?, ?, ?, datetime('now'))`,
        [
          `aud-${crypto.randomUUID()}`,
          req.user!.id,
          inspectionId,
          JSON.stringify({ case_id: id, template_id: data.template_id }),
          req.ip || '127.0.0.1',
        ]
      );
    });

    const created = get(`SELECT * FROM inspections WHERE id = ?`, [inspectionId]);
    res.status(201).json({ inspection: created });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/inspections/:id - Update field inspection checklist items (draft mode)
inspectionsRouter.patch('/:id', requirePermission('inspection:perform'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { items, note } = req.body;

    const inspection = get(`SELECT * FROM inspections WHERE id = ?`, [id]);
    if (!inspection) {
      res.status(404).json({ error: 'Không tìm thấy đợt kiểm tra' });
      return;
    }

    transaction(() => {
      // Mark inspection IN_PROGRESS
      run(
        `UPDATE inspections SET status = 'IN_PROGRESS', note = COALESCE(?, note), updated_at = datetime('now') WHERE id = ?`,
        [note, id]
      );

      // Update items
      if (Array.isArray(items)) {
        for (const it of items) {
          run(
            `UPDATE inspection_items
             SET status = COALESCE(?, status),
                 note = COALESCE(?, note),
                 evidence_asset_id = COALESCE(?, evidence_asset_id)
             WHERE id = ? AND inspection_id = ?`,
            [it.status, it.note, it.evidence_asset_id, it.item_id || it.id, id]
          );
        }
      }
    });

    const updated = get(`SELECT * FROM inspections WHERE id = ?`, [id]);
    res.json({ success: true, inspection: updated });
  } catch (err) {
    next(err);
  }
});

// POST /api/inspections/:id/submit - Final submission with required items validation
inspectionsRouter.post('/:id/submit', requirePermission('inspection:submit'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { items, note, override_reason } = InspectionSubmitSchema.parse(req.body);

    const inspection = get<any>(`SELECT * FROM inspections WHERE id = ?`, [id]);
    if (!inspection) {
      res.status(404).json({ error: 'Không tìm thấy đợt kiểm tra' });
      return;
    }

    // Check required items
    const requiredItems = query(
      `SELECT ii.id, ii.label, iti.required
       FROM inspection_items ii
       LEFT JOIN inspection_template_items iti ON ii.template_item_id = iti.id
       WHERE ii.inspection_id = ? AND (iti.required = 1 OR iti.required IS NULL)`,
      [id]
    );

    const answeredMap = new Map(items.map(it => [it.item_id, it.status]));

    const unansweredRequired = requiredItems.filter(ri => {
      const st = answeredMap.get(ri.id);
      return !st || st === 'UNKNOWN';
    });

    if (unansweredRequired.length > 0 && (!override_reason || override_reason.trim().length < 5)) {
      res.status(400).json({
        type: 'https://dustguard.gov.vn/errors/inspection-required',
        title: 'Chưa hoàn tất các tiêu chí bắt buộc',
        status: 400,
        detail: `Còn ${unansweredRequired.length} tiêu chí bắt buộc chưa được đánh giá (${unansweredRequired.map(r => r.label).join('; ')}). Nếu muốn bỏ qua, bắt buộc phải nhập lý do ngoại lệ (Override Reason).`,
      });
      return;
    }

    transaction(() => {
      // Update each item status
      for (const it of items) {
        run(
          `UPDATE inspection_items
           SET status = ?, note = ?, evidence_asset_id = ?
           WHERE id = ? AND inspection_id = ?`,
          [it.status, it.note || null, it.evidence_asset_id || null, it.item_id, id]
        );
      }

      // Mark inspection as COMPLETED
      run(
        `UPDATE inspections
         SET status = 'COMPLETED',
             performed_at = datetime('now'),
             note = COALESCE(?, note),
             override_reason = ?,
             updated_at = datetime('now')
         WHERE id = ?`,
        [note || null, override_reason || null, id]
      );

      // Auto-generate findings for FAIL items
      const failedItems = query(
        `SELECT ii.*, ls.id as legal_id, iti.label as item_label
         FROM inspection_items ii
         LEFT JOIN inspection_template_items iti ON ii.template_item_id = iti.id
         LEFT JOIN legal_sections ls ON ii.legal_section_id = ls.id
         WHERE ii.inspection_id = ? AND ii.status = 'FAIL'`,
        [id]
      );

      for (const fi of failedItems) {
        const findingId = `fnd-${crypto.randomUUID().substring(0, 8)}`;
        run(
          `INSERT INTO inspection_findings (id, inspection_id, case_id, category, finding, severity, legal_section_id, evidence_asset_id, staff_note, created_at)
           VALUES (?, ?, ?, 'Vi phạm kiểm soát bụi', ?, 'MEDIUM', ?, ?, ?, datetime('now'))`,
          [
            findingId,
            id,
            inspection.case_id,
            `Tiêu chuẩn không đạt: ${fi.label}`,
            fi.legal_id || null,
            fi.evidence_asset_id || null,
            fi.note || 'Cán bộ phát hiện không đạt chuẩn quy chuẩn môi trường',
          ]
        );
      }

      // Propose and advance Case status
      const nextCaseStatus = failedItems.length > 0 ? 'ACTION_REQUIRED' : 'READY_TO_CLOSE';
      run(
        `UPDATE cases SET status = ?, updated_at = datetime('now') WHERE id = ?`,
        [nextCaseStatus, inspection.case_id]
      );

      // Timeline event
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'INSPECTION_SUBMITTED', ?, ?, ?, 'INSPECTION', ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          inspection.case_id,
          req.user!.id,
          req.user!.full_name,
          req.user!.role,
          `Hoàn thành biên bản kiểm tra hiện trường. Kết quả: ${failedItems.length} tiêu chí không đạt. Vụ việc chuyển sang "${nextCaseStatus}".`,
          JSON.stringify({ inspection_id: id, failed_count: failedItems.length, override: !!override_reason }),
        ]
      );

      // Audit log
      run(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
         VALUES (?, ?, 'INSPECTION_SUBMITTED', 'INSPECTION', ?, ?, ?, datetime('now'))`,
        [
          `aud-${crypto.randomUUID()}`,
          req.user!.id,
          id,
          JSON.stringify({ case_id: inspection.case_id, failed_count: failedItems.length }),
          req.ip || '127.0.0.1',
        ]
      );
    });

    res.json({
      success: true,
      message: 'Nộp biên bản kiểm tra thành công.',
    });
  } catch (err) {
    next(err);
  }
});
