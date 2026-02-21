import { env } from '$env/dynamic/private';
import { redis } from '$lib/server/redis/client';

/**
 * Look up the realm for a given user ID via the external lookup service.
 * Returns the realm name/id or null if not found.
 */
export async function lookupRealm(userId: string): Promise<string | null> {
	try {
		const res = await fetch(`${env.REALM_LOOKUP_URL}/${encodeURIComponent(userId)}`);
		if (!res.ok) return null;
		const data = await res.json();
		return data.realm || data.realmId || data.realm_id || null;
	} catch (e) {
		console.error('Realm lookup failed:', e);
		return null;
	}
}

/**
 * Get the Keycloak client secret for a given realm from Redis.
 * Key pattern: ${REDIS_CONFIG_PREFIX}:${KEYCLOAK_CLIENT_ID}:<realmId>
 */
export async function getClientSecret(realmId: string): Promise<string | null> {
	const key = `${env.REDIS_CONFIG_PREFIX}:${env.KEYCLOAK_CLIENT_ID}:${realmId}`;
	const secret = await redis.get(key);
	return secret;
}

/**
 * Build the Keycloak issuer URL for a given realm.
 */
export function getKeycloakIssuer(realmId: string): string {
	return `${env.KEYCLOAK_BASE_URL}/realms/${realmId}`;
}
