import { RedisClient } from 'bun';
import { REDIS_URL } from '$env/static/private';

const client = new RedisClient(REDIS_URL);
await client.connect();

export { client as redis };
