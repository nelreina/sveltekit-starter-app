<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let { data, children } = $props();

	async function handleSignOut() {
		await authClient.signOut();
		if (data.keycloakLogoutUrl) {
			window.location.href = data.keycloakLogoutUrl;
		} else {
			window.location.href = '/login';
		}
	}
</script>

<nav>
	<button onclick={handleSignOut}>Sign Out</button>
</nav>

{@render children()}

<style>
	nav {
		display: flex;
		justify-content: end;
	}
</style>
