import { drizzle } from 'drizzle-orm/bun-sql';
import { env } from '$env/dynamic/private';

import * as schema from './schema';
export const db = drizzle(env.DATABASE_URL, { schema });
