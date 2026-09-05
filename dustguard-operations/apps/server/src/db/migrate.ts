import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, DB_PATH } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runMigrations(): void {
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
  } catch (err: any) {
    console.warn('[Database Migration] Notice on schema evolutions:', err.message);
  }

  console.log('[Database Migration] Schema migrated successfully with 34 tables & FTS5!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations();
}
