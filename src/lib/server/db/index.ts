import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

import * as schema from './schema';

let db: ReturnType<typeof drizzle<typeof schema>>;

if (!building) {
	const sqlite = new Database(env.DATABASE_URL || './data/app.db');
	sqlite.exec('PRAGMA journal_mode = WAL;');
	db = drizzle(sqlite, { schema });
}

export { db };
