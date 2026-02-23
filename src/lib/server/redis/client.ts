import { RedisClient } from 'bun';
import { building } from '$app/environment';
import { env } from '$env/dynamic/private';

let client: RedisClient;

if (!building) {
	client = new RedisClient(env.REDIS_URL);
	await client.connect();
}

export { client as redis };
