import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, DB_PATH } from './connection.js';
import { ensureSystemConfiguration } from './systemConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runMigrations(initSystemConfig = true): void {
  console.log(`[Database Migration] Running migrations on ${DB_PATH}...`);
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');
  
  db.exec(sql);

  // Safe schema evolutions
  try {
    const tableInfo = db.prepare(`PRAGMA table_info(tasks)`).all() as Array<{ name: string }>;
    const hasTaskType = tableInfo.some(col => col.name === 'task_type');
    if (!hasTaskType) {
      db.exec(`ALTER TABLE tasks ADD COLUMN task_type TEXT NOT NULL DEFAULT 'GENERAL';`);
      console.log('[Database Migration] Added task_type column to tasks table.');
    }

    const evidenceTableInfo = db.prepare(`PRAGMA table_info(evidence_assets)`).all() as Array<{ name: string }>;
    const hasIntegrityStatus = evidenceTableInfo.some(col => col.name === 'integrity_status');
    if (!hasIntegrityStatus) {
      db.exec(`ALTER TABLE evidence_assets ADD COLUMN integrity_status TEXT NOT NULL DEFAULT 'UNVERIFIED';`);
      console.log('[Database Migration] Added integrity_status column to evidence_assets table.');
    }
    const casesTableInfo = db.prepare(`PRAGMA table_info(cases)`).all() as Array<{ name: string }>;
    if (!casesTableInfo.some(col => col.name === 'project_id')) {
      db.exec(`ALTER TABLE cases ADD COLUMN project_id TEXT REFERENCES projects(id) ON DELETE SET NULL;`);
      console.log('[Database Migration] Added project_id column to cases table.');
    }
    if (!casesTableInfo.some(col => col.name === 'contractor_id')) {
      db.exec(`ALTER TABLE cases ADD COLUMN contractor_id TEXT REFERENCES contractors(id) ON DELETE SET NULL;`);
      console.log('[Database Migration] Added contractor_id column to cases table.');
    }

    const iotTableInfo = db.prepare(`PRAGMA table_info(iot_devices)`).all() as Array<{ name: string }>;
    if (!iotTableInfo.some(col => col.name === 'project_id')) {
      db.exec(`ALTER TABLE iot_devices ADD COLUMN project_id TEXT REFERENCES projects(id) ON DELETE SET NULL;`);
      console.log('[Database Migration] Added project_id column to iot_devices table.');
    }

    const humanDecTableInfo = db.prepare(`PRAGMA table_info(human_decisions)`).all() as Array<{ name: string }>;
    if (!humanDecTableInfo.some(col => col.name === 'supersedes_decision_id')) {
      db.exec(`ALTER TABLE human_decisions ADD COLUMN supersedes_decision_id TEXT REFERENCES human_decisions(id) ON DELETE SET NULL;`);
      console.log('[Database Migration] Added supersedes_decision_id column to human_decisions table.');
    }
    if (!humanDecTableInfo.some(col => col.name === 'references_json')) {
      db.exec(`ALTER TABLE human_decisions ADD COLUMN references_json TEXT;`);
      console.log('[Database Migration] Added references_json column to human_decisions table.');
    }

    // Indexes on hot foreign-key/lookup columns that had no index at all
    // (found during Side B production audit — legal_reviews.case_id in
    // particular is queried on every case-close attempt).
    db.exec(`CREATE INDEX IF NOT EXISTS idx_legal_reviews_case ON legal_reviews(case_id);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_legal_analyses_case ON legal_analyses(case_id);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_case_closures_case ON case_closures(case_id);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_remediation_action ON remediation_submissions(corrective_action_id);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_remediation_case ON remediation_submissions(case_id);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_contractors_name ON contractors(name);`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_inspection_items_inspection ON inspection_items(inspection_id);`);

    // Older demo seeds accidentally persisted SQLite expressions such as
    // "datetime('now', '+1 days')" as plain text. They are not dates and
    // cause the task queue to render "Invalid Date". Repair only those known
    // malformed values, preserving every genuine due date.
    db.exec(`
      UPDATE tasks
      SET due_at = datetime(COALESCE(created_at, 'now'), '+1 day')
      WHERE due_at LIKE 'datetime(%'
    `);
  } catch (err: any) {
    console.warn('[Database Migration] Notice on schema evolutions:', err.message);
  }

  // Initialize statutory system configurations if empty
  if (initSystemConfig) {
    try {
      ensureSystemConfiguration();
    } catch (err: any) {
      console.warn('[Database Migration] Notice on system config initialization:', err.message);
    }
  }

  console.log('[Database Migration] Schema migrated successfully with 36 tables & FTS5!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations();
}
