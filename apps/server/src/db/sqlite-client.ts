import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { DatabaseRepository, QueryResultInfo } from '@dustguard/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Thư mục data ở root repo
const dataDir = path.resolve(__dirname, '../../../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const dbPath = path.join(dataDir, 'dustguard-community.db');

export class SQLiteClient implements DatabaseRepository {
  private db: DatabaseSync;

  constructor(filePath: string = dbPath) {
    this.db = new DatabaseSync(filePath);
    // Bật WAL và foreign keys
    this.db.exec('PRAGMA journal_mode = WAL;');
    this.db.exec('PRAGMA foreign_keys = ON;');
  }

  exec(sql: string): void {
    this.db.exec(sql);
  }

  prepare(sql: string) {
    return this.db.prepare(sql);
  }

  all<T = any>(sql: string, params: any[] = []): T[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  query<T = any>(sql: string, params: any[] = []): T[] {
    return this.all<T>(sql, params);
  }

  get<T = any>(sql: string, params: any[] = []): T | undefined {
    const stmt = this.db.prepare(sql);
    return stmt.get(...params) as T | undefined;
  }

  run(sql: string, params: any[] = []): QueryResultInfo {
    const stmt = this.db.prepare(sql);
    return stmt.run(...params);
  }

  transaction<T>(fn: () => T): T {
    this.db.exec('BEGIN TRANSACTION;');
    try {
      const result = fn();
      this.db.exec('COMMIT;');
      return result;
    } catch (err) {
      this.db.exec('ROLLBACK;');
      throw err;
    }
  }

  close(): void {
    this.db.close();
  }
}

export const sqliteClient = new SQLiteClient();
export const dbRepository: DatabaseRepository = sqliteClient;
