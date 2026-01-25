import { auth, getSession } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
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

	return svelteKitHandler({ event, resolve, auth, building });
};
