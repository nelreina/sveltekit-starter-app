import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { env } from '$env/dynamic/private';

import * as schema from './schema';

const sqlite = new Database(env.DATABASE_URL || './data/app.db');
sqlite.exec('PRAGMA journal_mode = WAL;');

export const db = drizzle(sqlite, { schema });
