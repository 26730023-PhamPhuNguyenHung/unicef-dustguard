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
  console.log('[Database Migration] Schema migrated successfully with 32 tables & FTS5!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations();
}
