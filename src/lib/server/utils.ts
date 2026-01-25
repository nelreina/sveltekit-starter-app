function decodeJwtPayload(token: string): Record<string, unknown> | null {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;
		const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
		return JSON.parse(payload);
	} catch {
		return null;
	}
}

/**
 * Extract roles from Keycloak JWT token
 * Keycloak stores roles in realm_access.roles and resource_access.{client}.roles
 */
export function extractKeycloakRoles(token: string): string[] {
	const payload = decodeJwtPayload(token);
	if (!payload) return [];

	const roles: string[] = [];

	// Get realm-level roles
	const realmAccess = payload.realm_access as { roles?: string[] } | undefined;
	if (realmAccess?.roles) {
		roles.push(...realmAccess.roles);
	}

	// Filter out Keycloak default roles that aren't relevant
	const ignoredRoles = ['offline_access', 'uma_authorization', 'default-roles-greenlight'];
	return roles.filter((role) => !ignoredRoles.includes(role));
}
