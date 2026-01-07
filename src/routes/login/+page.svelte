<script lang="ts">
	import { authClient } from '$lib/auth-client';

	async function loginWithKeycloak() {
		await authClient.signIn.oauth2({
			providerId: 'keycloak',
			callbackURL: '/app'
		});
	}
</script>

<h1>Login</h1>
<button onclick={loginWithKeycloak}>Sign in with Keycloak</button>
