import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';
export const load: LayoutServerLoad = async ({ locals, url }) => {

console.log('Layout server load called');
console.log('KEYCLOAK_ISSUER:', env.KEYCLOAK_ISSUER);
console.log('KEYCLOAK_LOGOUT_ENABLED:', env.KEYCLOAK_LOGOUT_ENABLED);

const keycloakLogoutUrl =
  env.KEYCLOAK_LOGOUT_ENABLED === true
    ? `${env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?post_logout_redirect_uri=${url.origin}&client_id=${env.KEYCLOAK_CLIENT_ID}`
    : null;

return {
  user: locals.user,
  session: locals.session,
  keycloakLogoutUrl
};
};
