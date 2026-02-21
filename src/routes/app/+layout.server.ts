import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { getKeycloakIssuer } from '$lib/server/realm';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const realm = locals.realm;
	let keycloakLogoutUrl = null;

	if (realm && (env.KEYCLOAK_LOGOUT_ENABLED === true || env.KEYCLOAK_LOGOUT_ENABLED === 'true')) {
		const issuer = getKeycloakIssuer(realm);
		keycloakLogoutUrl = `${issuer}/protocol/openid-connect/logout?post_logout_redirect_uri=${url.origin}&client_id=${env.KEYCLOAK_CLIENT_ID}`;
	}

	return {
		user: locals.user,
		session: locals.session,
		keycloak: locals.keycloak,
		keycloakLogoutUrl,
		realm
	};
};
