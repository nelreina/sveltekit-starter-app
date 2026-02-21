import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { lookupRealm, getClientSecret, getKeycloakIssuer } from '$lib/server/realm';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { userId } = await request.json();

	if (!userId || typeof userId !== 'string') {
		throw error(400, 'userId is required');
	}

	const realmId = await lookupRealm(userId.trim());
	if (!realmId) {
		throw error(404, 'No realm found for this user');
	}

	const clientSecret = await getClientSecret(realmId);
	if (!clientSecret) {
		throw error(500, 'Could not resolve realm configuration');
	}

	// Store realm in a secure cookie for the auth flow and app-wide access
	cookies.set('__realm', realmId, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 // 24 hours
	});

	return json({ realm: realmId });
};
