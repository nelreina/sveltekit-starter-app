import type { LayoutServerLoad } from './$types';
import { KEYCLOAK_LOGOUT_ENABLED, KEYCLOAK_ISSUER, KEYCLOAK_CLIENT_ID } from '$env/static/private';
export const load: LayoutServerLoad = async ({ locals, url }) => {
	const keycloakLogoutUrl =
		KEYCLOAK_LOGOUT_ENABLED === 'true'
			? `${KEYCLOAK_ISSUER}/protocol/openid-connect/logout?post_logout_redirect_uri=${url.origin}&client_id=${KEYCLOAK_CLIENT_ID}`
			: null;

	return {
		user: locals.user,
		session: locals.session,
		keycloakLogoutUrl
	};
};
