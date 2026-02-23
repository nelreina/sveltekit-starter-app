import { betterAuth } from 'better-auth';
import { genericOAuth, keycloak } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import type { RequestEvent } from '@sveltejs/kit';
import { Database } from 'bun:sqlite';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import { db } from '$lib/server/db';
import { account } from '$lib/server/db/schema';
import { extractKeycloakRoles } from '$lib/server/utils';
import { eq, and } from 'drizzle-orm';

const sqlite = building ? null : new Database(env.DATABASE_URL || './data/app.db');

/**
 * Create a better-auth instance configured for a specific Keycloak realm.
 * Called dynamically after realm lookup resolves the realm + secret.
 */
export function createAuthForRealm(realmId: string, clientSecret: string, issuer: string) {
	return betterAuth({
		database: sqlite,
		session: {
			expiresIn: env.BETTER_AUTH_SESSION_EXPIRES_IN,
			updateAge: env.BETTER_AUTH_SESSION_UPDATE_AGE,
			cookieCache: {
				enabled: false
			}
		},
		plugins: [
			sveltekitCookies(getRequestEvent),
			genericOAuth({
				config: [
					keycloak({
						clientId: env.KEYCLOAK_CLIENT_ID,
						clientSecret,
						issuer,
						scopes: ['openid', 'profile', 'roles']
					})
				]
			})
		]
	});
}

/**
 * Default auth instance — used for session validation (reads from DB, realm-agnostic).
 * The Keycloak plugin here uses placeholder values since it's only used for session ops,
 * not for initiating OAuth flows.
 * Lazily initialized to avoid URL validation errors during build.
 */
let _auth: ReturnType<typeof betterAuth> | null = null;

export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
	get(_target, prop) {
		if (!_auth) {
			_auth = betterAuth({
				database: sqlite!,
				session: {
					expiresIn: env.BETTER_AUTH_SESSION_EXPIRES_IN,
					updateAge: env.BETTER_AUTH_SESSION_UPDATE_AGE,
					cookieCache: {
						enabled: false
					}
				},
				plugins: [
					sveltekitCookies(getRequestEvent),
					genericOAuth({
						config: [
							keycloak({
								clientId: env.KEYCLOAK_CLIENT_ID,
								clientSecret: 'placeholder',
								issuer: `${env.KEYCLOAK_URL}/realms/placeholder`,
								scopes: ['openid', 'profile', 'roles']
							})
						]
					})
				]
			});
		}
		return (_auth as any)[prop];
	}
});

export const getSession = async (event: RequestEvent) => {
	const kcloak = {};
	const session = await auth.api.getSession({
		headers: event.request.headers
	});
	if (session) {
		const keycloakAccount = await db
			.select()
			.from(account)
			.where(and(eq(account.userId, session.user.id), eq(account.providerId, 'keycloak')))
			.limit(1);
		if (keycloakAccount?.length) {
			const jwtToken = keycloakAccount[0]?.accessToken;
			kcloak.jwtToken = jwtToken;
			kcloak.refreshToken = keycloakAccount[0]?.refreshToken;
			session.user.roles = extractKeycloakRoles(jwtToken);
		}
		return { ...session, keycloak: kcloak };
	}
};

export const isAuthorized = async (event: RequestEvent) => {
	return !!(await getSession(event));
};

export const getUser = async (event: RequestEvent) => {
	const session = await getSession(event);
	return session?.user;
};
