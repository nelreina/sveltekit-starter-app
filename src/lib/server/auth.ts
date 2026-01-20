import { betterAuth } from 'better-auth';
import { genericOAuth, keycloak } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import type { RequestEvent } from '@sveltejs/kit';
import pg from 'pg';
import {
	DATABASE_URL,
	KEYCLOAK_CLIENT_ID,
	KEYCLOAK_CLIENT_SECRET,
	KEYCLOAK_ISSUER,
	BETTER_AUTH_SESSION_UPDATE_AGE,
	BETTER_AUTH_SESSION_EXPIRES_IN
} from '$env/static/private';

const pool = new pg.Pool({
	connectionString: DATABASE_URL
});

export const auth = betterAuth({
	database: pool,
	session: {
  expiresIn: BETTER_AUTH_SESSION_EXPIRES_IN , // 8 hours
  updateAge: BETTER_AUTH_SESSION_UPDATE_AGE, // every hour
  cookieCache: {
    enabled: false // Every request checks DB
  }
}
	plugins: [
		sveltekitCookies(getRequestEvent),
		genericOAuth({
			config: [
				keycloak({
					clientId: KEYCLOAK_CLIENT_ID,
					clientSecret: KEYCLOAK_CLIENT_SECRET,
					issuer: KEYCLOAK_ISSUER,
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
	return session;
};
export const isAuthorized = async (event: RequestEvent) => {
	return !!(await getSession(event));
};

export const getUser = async (event: RequestEvent) => {
	const session = await getSession(event);
	return session?.user;
};
