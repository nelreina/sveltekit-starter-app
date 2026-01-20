import { RedisClient } from 'bun';
import { REDIS_URL } from '$env/static/private';
import { building } from '$app/environment';

const client = new RedisClient(REDIS_URL);

if (!building) await client.connect();

export { client as redis };
