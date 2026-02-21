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

// Parse enabled providers from env
const enabledProviders = (env.AUTH_PROVIDERS || '')
	.split(',')
	.map((p) => p.trim().toLowerCase())
	.filter(Boolean);

// Build social providers config
const socialProviders: Record<string, object> = {};

if (enabledProviders.includes('github')) {
	socialProviders.github = {
		clientId: env.GITHUB_CLIENT_ID,
		clientSecret: env.GITHUB_CLIENT_SECRET
	};
}

if (enabledProviders.includes('google')) {
	socialProviders.google = {
		clientId: env.GOOGLE_CLIENT_ID,
		clientSecret: env.GOOGLE_CLIENT_SECRET
	};
}

// Build plugins list
const plugins: ReturnType<typeof sveltekitCookies | typeof genericOAuth>[] = [
	sveltekitCookies(getRequestEvent)
];

if (enabledProviders.includes('keycloak')) {
	plugins.push(
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
	);
}

export const auth = betterAuth({
	database: sqlite,
	session: {
		expiresIn: env.BETTER_AUTH_SESSION_EXPIRES_IN,
		updateAge: env.BETTER_AUTH_SESSION_UPDATE_AGE,
		cookieCache: {
			enabled: false
		}
	},
	socialProviders,
	plugins
});

export const getEnabledProviders = () => enabledProviders;

export const getSession = async (event: RequestEvent) => {
	const kcloak = {};
	const session = await auth.api.getSession({
		headers: event.request.headers
	});
	if (session) {
		if (enabledProviders.includes('keycloak')) {
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
