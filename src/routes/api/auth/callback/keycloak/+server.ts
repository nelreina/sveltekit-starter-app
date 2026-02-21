import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createAuthForRealm } from '$lib/server/auth';
import { getClientSecret, getKeycloakIssuer } from '$lib/server/realm';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';

/**
 * Keycloak OAuth callback handler.
 * Reads realm from cookie, builds a realm-specific auth instance,
 * and delegates to better-auth for token exchange.
 */
export const GET: RequestHandler = async (event) => {
	const realmId = event.cookies.get('__realm');
	if (!realmId) {
		throw redirect(303, '/login?error=no_realm');
	}

	const clientSecret = await getClientSecret(realmId);
	if (!clientSecret) {
		throw redirect(303, '/login?error=config_error');
	}

	const issuer = getKeycloakIssuer(realmId);
	const realmAuth = createAuthForRealm(realmId, clientSecret, issuer);

	return svelteKitHandler({ event, resolve: async ({ event }) => new Response(), auth: realmAuth, building });
};
