import crypto from 'node:crypto';
import { query, run, queryOne } from '../../db/connection.js';

export interface AutomationContext {
  case_id?: string;
  case_code?: string;
  assigned_staff_id?: string;
  due_days?: number;
  priority?: string;
  title?: string;
  message?: string;
  [key: string]: any;
}

export function dispatchAutomationEvent(
  eventType: string,
  triggerEntityType: string,
  triggerEntityId: string,
  payload: AutomationContext
): { rulesTriggered: number; runs: string[] } {
  const matchingRules = query<any>(
    `SELECT * FROM automation_rules WHERE event_type = ? AND enabled = 1`,
    [eventType]
  );

  const runIds: string[] = [];

  for (const rule of matchingRules) {
    const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const startedAt = new Date().toISOString();

    try {
      let conditions: any = {};
      try {
        conditions = JSON.parse(rule.conditions_json);
      } catch (e) {
        conditions = {};
      }

      // Evaluate conditions
      let shouldExecute = true;
      for (const [k, v] of Object.entries(conditions)) {
        if (payload[k] !== undefined && payload[k] !== v) {
          // If boolean or equality check fails
          if (typeof v === 'boolean' && Boolean(payload[k]) !== v) {
            shouldExecute = false;
            break;
          }
        }
      }

      if (!shouldExecute) {
        run(
          `INSERT INTO automation_runs (id, rule_id, trigger_entity_type, trigger_entity_id, status, input_json, result_json, started_at, completed_at)
           VALUES (?, ?, ?, ?, 'SKIPPED', ?, '{"reason": "Conditions did not match"}', ?, datetime('now'))`,
          [runId, rule.id, triggerEntityType, triggerEntityId, JSON.stringify(payload), startedAt]
        );
        continue;
      }

      let actions: any[] = [];
      try {
        actions = JSON.parse(rule.actions_json);
      } catch (e) {
        actions = [];
      }

      const executedActions: any[] = [];

      for (const action of actions) {
        if (action.type === 'CREATE_TASK') {
          const taskId = `task-auto-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          const dueDays = action.due_days || 1;
          const assignedTo = payload.assigned_staff_id || 'usr-staff-1';
          const title = action.title || `Tác vụ tự động cho ${triggerEntityType}`;
          const desc = action.description || `Tạo tự động từ quy tắc ${rule.name}`;
          const priority = action.priority || 'NORMAL';

          run(
            `INSERT INTO tasks (id, case_id, title, description, source, source_entity_type, source_entity_id, assigned_to, status, priority, due_at, created_at)
             VALUES (?, ?, ?, ?, 'AUTOMATION', ?, ?, ?, 'OPEN', ?, datetime('now', '+${dueDays} days'), datetime('now'))`,
            [taskId, payload.case_id || null, title, desc, triggerEntityType, triggerEntityId, assignedTo, priority]
          );
          executedActions.push({ action: 'CREATE_TASK', taskId });
        } else if (action.type === 'CREATE_NOTIFICATION') {
          const notifId = `notif-auto-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          const targetUser = payload.assigned_staff_id || 'usr-staff-1';
          const title = action.title || 'Thông báo tự động từ hệ thống';
          const msg = action.message || `Sự kiện ${eventType} đã kích hoạt cho ${triggerEntityType} #${triggerEntityId}`;
          const link = payload.case_id ? `/cases/${payload.case_id}` : '/tasks';

          run(
            `INSERT INTO notifications (id, user_id, type, title, message, link, read, created_at)
             VALUES (?, ?, 'AUTOMATION', ?, ?, ?, 0, datetime('now'))`,
            [notifId, targetUser, title, msg, link]
          );
          executedActions.push({ action: 'CREATE_NOTIFICATION', notifId });
        } else if (action.type === 'NOTIFY_SUPERVISOR') {
          const supervisors = query<any>(`SELECT id FROM users WHERE role = 'supervisor' AND active = 1`);
          for (const sup of supervisors) {
            const notifId = `notif-sup-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
            run(
              `INSERT INTO notifications (id, user_id, type, title, message, link, read, created_at)
               VALUES (?, ?, 'ESCALATION', 'Cảnh báo giám sát tự động', ?, ?, 0, datetime('now'))`,
              [notifId, sup.id, action.message || `Cảnh báo cho ${triggerEntityType} #${triggerEntityId}`, payload.case_id ? `/cases/${payload.case_id}` : '/supervisor/workload']
            );
          }
          executedActions.push({ action: 'NOTIFY_SUPERVISOR', count: supervisors.length });
        }
      }

      run(
        `INSERT INTO automation_runs (id, rule_id, trigger_entity_type, trigger_entity_id, status, input_json, result_json, started_at, completed_at)
         VALUES (?, ?, ?, ?, 'SUCCESS', ?, ?, ?, datetime('now'))`,
        [runId, rule.id, triggerEntityType, triggerEntityId, JSON.stringify(payload), JSON.stringify(executedActions), startedAt]
      );
      runIds.push(runId);
    } catch (err: any) {
      run(
        `INSERT INTO automation_runs (id, rule_id, trigger_entity_type, trigger_entity_id, status, input_json, error_message, started_at, completed_at)
         VALUES (?, ?, ?, ?, 'FAILED', ?, ?, ?, datetime('now'))`,
        [runId, rule.id, triggerEntityType, triggerEntityId, JSON.stringify(payload), err.message || 'Automation execution error', startedAt]
      );
    }
  }

  return { rulesTriggered: matchingRules.length, runs: runIds };
}
