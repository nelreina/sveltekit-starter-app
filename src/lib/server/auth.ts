import { betterAuth } from 'better-auth';
import { genericOAuth, keycloak } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import type { RequestEvent } from '@sveltejs/kit';
import { Database } from 'bun:sqlite';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { account } from '$lib/server/db/schema';
import { extractKeycloakRoles } from '$lib/server/utils';
import { eq, and } from 'drizzle-orm';

const sqlite = new Database(env.DATABASE_URL || './data/app.db');

export const auth = betterAuth({
	database: sqlite,
	session: {
		expiresIn: env.BETTER_AUTH_SESSION_EXPIRES_IN, // 8 hours
		updateAge: env.BETTER_AUTH_SESSION_UPDATE_AGE, // every hour
		cookieCache: {
			enabled: false // Every request checks DB
		}
	},
	plugins: [
		sveltekitCookies(getRequestEvent),
		genericOAuth({
			config: [
				keycloak({
					clientId: env.KEYCLOAK_CLIENT_ID,
					clientSecret: env.KEYCLOAK_CLIENT_SECRET,
					issuer: env.KEYCLOAK_ISSUER,
					scopes: ['openid', 'profile', 'roles']
				})
			]
		})
	]
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
		if (keycloakAccount) {
			const jwtToken = keycloakAccount[0]?.accessToken;
			kcloak.jwtToken = jwtToken;
			kcloak.refreshToken = keycloakAccount[0]?.refreshToken;
			session.user.roles = extractKeycloakRoles(jwtToken);
		} else {
			console.log('No account found!');
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
