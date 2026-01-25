import { betterAuth } from 'better-auth';
import { genericOAuth, keycloak } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import type { RequestEvent } from '@sveltejs/kit';
import pg from 'pg';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { account } from '$lib/server/db/schema'; // Your account table schema
import { eq, and } from 'drizzle-orm';

const pool = new pg.Pool({
	connectionString: env.DATABASE_URL
});

export const auth = betterAuth({
	database: pool,
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
	const session = await auth.api.getSession({
		headers: event.request.headers
	});
	const kcloak = {};
	const keycloakAccount = await db
		.select()
		.from(account)
		.where(and(eq(account.userId, session.user.id), eq(account.providerId, 'keycloak')))
		.limit(1);
	// console.log(keycloakAccount);
	if (keycloakAccount) {
		kcloak.keycloakJWTToken = keycloakAccount[0]?.accessToken;
		kcloak.keycloakRefreshToken = keycloakAccount[0]?.refreshToken;
	} else {
		console.log('No account found!');
	}
	console.log({ keycloak: kcloak });
	return { ...session, keycloak: kcloak };
};
export const isAuthorized = async (event: RequestEvent) => {
	return !!(await getSession(event));
};

export const getUser = async (event: RequestEvent) => {
	const session = await getSession(event);
	return session?.user;
};
