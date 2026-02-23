#!/usr/bin/env bun
/**
 * Initialize project: create SQLite DB + better-auth tables
 * Run: bun run init
 */

import { existsSync, copyFileSync, mkdirSync } from 'fs';
import { $ } from 'bun';

const DATA_DIR = './data';
const ENV_FILE = '.env';
const ENV_EXAMPLE = '.env.example';

// 1. Create data directory
if (!existsSync(DATA_DIR)) {
	mkdirSync(DATA_DIR, { recursive: true });
	console.log('📁 Created data/ directory');
} else {
	console.log('📁 data/ directory exists');
}

// 2. Copy .env.example → .env if needed
if (!existsSync(ENV_FILE) && existsSync(ENV_EXAMPLE)) {
	copyFileSync(ENV_EXAMPLE, ENV_FILE);
	console.log('📄 Copied .env.example → .env (edit with your values)');
} else if (!existsSync(ENV_FILE)) {
	console.log('⚠️  No .env or .env.example found');
} else {
	console.log('📄 .env already exists');
}

// 3. Create empty DB file if it doesn't exist (drizzle-kit needs it)
// Read .env manually since we're outside SvelteKit
const envContent = existsSync('.env') ? await Bun.file('.env').text() : '';
const dbMatch = envContent.match(/^DATABASE_URL=(.+)$/m);
const dbPath = dbMatch?.[1]?.trim() || './data/app.db';
if (!existsSync(dbPath)) {
	Bun.write(dbPath, '');
	console.log(`🗄️  Created empty DB at ${dbPath}`);
}

// 4. Create tables via Drizzle migrate
console.log('🗄️  Creating tables...');
const { Database } = await import('bun:sqlite');
const { drizzle } = await import('drizzle-orm/bun-sqlite');
const { migrate } = await import('drizzle-orm/bun-sqlite/migrator');

// Generate migrations first
await $`bunx drizzle-kit generate`.quiet();

// Apply migrations
const sqlite = new Database(dbPath);
sqlite.exec('PRAGMA journal_mode = WAL;');
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: './drizzle' });

// Verify
const tables = sqlite.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '%drizzle%' ORDER BY name").all() as {name: string}[];
console.log(`🗄️  Created ${tables.length} tables: ${tables.map(t => t.name).join(', ')}`);

console.log('\n✅ Project initialized! Run: bun dev');
