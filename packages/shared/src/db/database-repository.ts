/**
 * DustGuard VN — Universal Database Repository Boundary SSOT
 * Architecture: Adapter pattern abstracting Local SQLite (Dev/Test) vs Cloudflare D1 (Production Edge)
 */

export interface QueryResultInfo {
  changes: number | bigint;
  lastInsertRowid: number | bigint;
}

export interface DatabaseRepository {
  /**
   * Run a SQL query returning all matching rows
   */
  query<T = any>(sql: string, params?: any[]): Promise<T[]> | T[];

  /**
   * Run a SQL query returning the first matching row or undefined
   */
  get<T = any>(sql: string, params?: any[]): Promise<T | undefined> | (T | undefined);

  /**
   * Run a mutating SQL statement (INSERT, UPDATE, DELETE)
   */
  run(sql: string, params?: any[]): Promise<QueryResultInfo> | QueryResultInfo;

  /**
   * Execute raw SQL statements (schema migrations, pragma)
   */
  exec(sql: string): Promise<void> | void;

  /**
   * Run an atomic transaction
   */
  transaction<T>(fn: () => T | Promise<T>): Promise<T> | T;
}

/**
 * Local SQLite Repository (for Node.js dev and unit tests)
 * Wraps node:sqlite DatabaseSync or better-sqlite3
 */
export class LocalSQLiteRepository implements DatabaseRepository {
  private db: any;

  constructor(sqliteInstance: any) {
    this.db = sqliteInstance;
  }

  query<T = any>(sql: string, params: any[] = []): T[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  get<T = any>(sql: string, params: any[] = []): T | undefined {
    const stmt = this.db.prepare(sql);
    return stmt.get(...params) as T | undefined;
  }

  run(sql: string, params: any[] = []): QueryResultInfo {
    const stmt = this.db.prepare(sql);
    return stmt.run(...params);
  }

  exec(sql: string): void {
    this.db.exec(sql);
  }

  transaction<T>(fn: () => T): T {
    if (typeof this.db.transaction === 'function' && this.db.transaction.length === 1) {
      const tx = this.db.transaction(fn);
      return tx();
    }
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
}

/**
 * Cloudflare D1 Repository (for Cloudflare Workers Production)
 * Wraps Cloudflare D1Database binding (env.DB)
 */
export class CloudflareD1Repository implements DatabaseRepository {
  private d1: any;

  constructor(d1Binding: any) {
    this.d1 = d1Binding;
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const stmt = this.d1.prepare(sql).bind(...params);
    const result = await stmt.all();
    return (result.results || []) as T[];
  }

  async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    const stmt = this.d1.prepare(sql).bind(...params);
    const row = await stmt.first();
    return (row || undefined) as T | undefined;
  }

  async run(sql: string, params: any[] = []): Promise<QueryResultInfo> {
    const stmt = this.d1.prepare(sql).bind(...params);
    const res = await stmt.run();
    return {
      changes: res.meta?.changes ?? 0,
      lastInsertRowid: res.meta?.last_row_id ?? 0
    };
  }

  async exec(sql: string): Promise<void> {
    await this.d1.exec(sql);
  }

  async transaction<T>(fn: () => Promise<T> | T): Promise<T> {
    // Cloudflare D1 supports atomic statements via batch()
    // For general closures, execute sequentially
    return await fn();
  }
}
