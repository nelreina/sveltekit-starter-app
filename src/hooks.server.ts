import { auth, getSession, createAuthForRealm } from '$lib/server/auth';
import { getClientSecret, getKeycloakIssuer } from '$lib/server/realm';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Read realm from cookie and make it globally available
	const realmId = event.cookies.get('__realm');
	event.locals.realm = realmId || null;

	// Get session and populate locals
	const session = await getSession(event);

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
		event.locals.keycloak = session.keycloak;
	}

	// Protect /app/* routes
	if (event.url.pathname.startsWith('/app')) {
		if (!session) {
			throw redirect(303, '/login');
		}
	}

	// For better-auth API routes, use realm-specific auth if realm is set
	if (event.url.pathname.startsWith('/api/auth') && realmId) {
		const clientSecret = await getClientSecret(realmId);
		if (clientSecret) {
			const issuer = getKeycloakIssuer(realmId);
			const realmAuth = createAuthForRealm(realmId, clientSecret, issuer);
			return svelteKitHandler({ event, resolve, auth: realmAuth, building });
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
