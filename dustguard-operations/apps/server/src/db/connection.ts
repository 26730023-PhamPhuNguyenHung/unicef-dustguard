import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the dustguard-operations root directory
function findProjectRoot(): string {
  let cur = __dirname;
  while (cur && cur !== path.dirname(cur)) {
    if (fs.existsSync(path.join(cur, 'data')) && fs.existsSync(path.join(cur, 'apps'))) {
      return cur;
    }
    // Also check if dustguard-operations exists inside current dir
    if (fs.existsSync(path.join(cur, 'dustguard-operations', 'data'))) {
      return path.join(cur, 'dustguard-operations');
    }
    cur = path.dirname(cur);
  }
  return path.resolve(process.cwd());
}

const PROJECT_ROOT = findProjectRoot();
const DATA_DIR = path.join(PROJECT_ROOT, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'dustguard-operations.db');

export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode and foreign keys for high-performance and strict data integrity
db.exec('PRAGMA busy_timeout = 5000;');
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA synchronous = NORMAL;');

// node:sqlite's DatabaseSync throws ("Provided value cannot be bound to SQLite
// parameter N") when a bound parameter is `undefined` — unlike most other
// sqlite drivers, it does not silently coerce it to NULL. Every route handler
// in this codebase that does `const { optionalField } = req.body` and passes
// it straight into a parameterized query (very common with COALESCE(?, col)
// partial-update patterns) relies on "not provided" meaning NULL, so we
// normalize undefined -> null once here rather than at every call site.
function sanitizeParams(params: any[]): any[] {
  return params.map(p => (p === undefined ? null : p));
}

export function query<T = any>(sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql);
  return stmt.all(...sanitizeParams(params)) as T[];
}

export function get<T = any>(sql: string, params: any[] = []): T | undefined {
  const stmt = db.prepare(sql);
  return stmt.get(...sanitizeParams(params)) as T | undefined;
}

export const queryOne = get;

export function run(sql: string, params: any[] = []) {
  const stmt = db.prepare(sql);
  return stmt.run(...sanitizeParams(params));
}

export function exec(sql: string): void {
  db.exec(sql);
}

export function transaction<T>(fn: () => T): T {
  db.exec('BEGIN TRANSACTION;');
  try {
    const result = fn();
    db.exec('COMMIT;');
    return result;
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export interface DatabaseRepository {
  query<T = any>(sql: string, params?: any[]): Promise<T[]> | T[];
  get<T = any>(sql: string, params?: any[]): Promise<T | undefined> | (T | undefined);
  run(sql: string, params?: any[]): Promise<{ changes: number | bigint; lastInsertRowid: number | bigint }> | { changes: number | bigint; lastInsertRowid: number | bigint };
  exec(sql: string): Promise<void> | void;
  transaction<T>(fn: () => T | Promise<T>): Promise<T> | T;
}

export const dbRepository: DatabaseRepository = {
  query,
  get,
  run,
  exec,
  transaction
};
