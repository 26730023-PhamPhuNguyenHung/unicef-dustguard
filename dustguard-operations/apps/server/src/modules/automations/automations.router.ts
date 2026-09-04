import { Router, Request, Response } from 'express';
import { query, queryOne, run } from '../../db/connection.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireCapability } from '../../middleware/rbac.js';

export const automationsRouter = Router();

// 1. List Automation Rules
automationsRouter.get(
  '/rules',
  requireAuth,
  requireCapability('automation:view'),
  (req: Request, res: Response) => {
    const rules = query<any>(`SELECT * FROM automation_rules ORDER BY created_at DESC`);
    res.json({
      success: true,
      data: rules.map(r => ({
        ...r,
        conditions: JSON.parse(r.conditions_json || '{}'),
        actions: JSON.parse(r.actions_json || '[]'),
      })),
    });
  }
);

// 2. Create Automation Rule
automationsRouter.post(
  '/rules',
  requireAuth,
  requireCapability('automation:manage'),
  (req: Request, res: Response) => {
    const { name, event_type, conditions, actions, enabled = 1 } = req.body;
    if (!name || !event_type) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Tên quy tắc và loại sự kiện là bắt buộc' },
      });
      return;
    }

    const id = `rule-${Date.now()}`;
    run(
      `INSERT INTO automation_rules (id, name, event_type, conditions_json, actions_json, enabled, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [id, name, event_type, JSON.stringify(conditions || {}), JSON.stringify(actions || []), enabled ? 1 : 0]
    );

    const created = queryOne<any>(`SELECT * FROM automation_rules WHERE id = ?`, [id]);
    res.status(201).json({ success: true, data: created });
  }
);

// 3. Update Automation Rule (Toggle or edit)
automationsRouter.patch(
  '/rules/:id',
  requireAuth,
  requireCapability('automation:manage'),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const rule = queryOne<any>(`SELECT * FROM automation_rules WHERE id = ?`, [id]);
    if (!rule) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy quy tắc' } });
      return;
    }

    const { enabled, name, conditions, actions } = req.body;
    const newEnabled = enabled !== undefined ? (enabled ? 1 : 0) : rule.enabled;
    const newName = name || rule.name;
    const newConditions = conditions ? JSON.stringify(conditions) : rule.conditions_json;
    const newActions = actions ? JSON.stringify(actions) : rule.actions_json;

    run(
      `UPDATE automation_rules
       SET enabled = ?, name = ?, conditions_json = ?, actions_json = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [newEnabled, newName, newConditions, newActions, id]
    );

    const updated = queryOne<any>(`SELECT * FROM automation_rules WHERE id = ?`, [id]);
    res.json({ success: true, data: updated });
  }
);

// 4. Get Automation Runs (Audit history)
automationsRouter.get(
  '/runs',
  requireAuth,
  requireCapability('automation:view'),
  (req: Request, res: Response) => {
    const runs = query<any>(
      `SELECT ar.*, r.name as rule_name, r.event_type
       FROM automation_runs ar
       LEFT JOIN automation_rules r ON ar.rule_id = r.id
       ORDER BY ar.started_at DESC
       LIMIT 100`
    );

    res.json({
      success: true,
      data: runs.map(r => ({
        ...r,
        input: JSON.parse(r.input_json || '{}'),
        result: r.result_json ? JSON.parse(r.result_json) : null,
      })),
    });
  }
);
