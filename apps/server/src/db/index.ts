import { sqliteClient, dbPath } from './sqlite-client.js';
import * as schema from './schema.js';

export { sqliteClient, dbPath, schema };
export const db = sqliteClient;

