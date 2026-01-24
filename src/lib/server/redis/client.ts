import { RedisClient } from 'bun';
import { building } from '$app/environment';
import { env } from '$env/dynamic/private';

const client = new RedisClient(env.REDIS_URL);

if (!building) await client.connect();

export { client as redis };
