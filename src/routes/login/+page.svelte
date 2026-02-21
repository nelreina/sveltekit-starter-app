<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let { data } = $props();
	const providers = data.providers;

	async function loginWithKeycloak() {
		await authClient.signIn.oauth2({
			providerId: 'keycloak',
			callbackURL: '/app'
		});
	}

	async function loginWithGithub() {
		await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/app'
		});
	}

	async function loginWithGoogle() {
		await authClient.signIn.social({
			provider: 'google',
			callbackURL: '/app'
		});
	}

	const providerConfig: Record<string, { label: string; emoji: string; handler: () => void; color: string }> = {
		keycloak: { label: 'Keycloak', emoji: '🔑', handler: loginWithKeycloak, color: 'bg-gray-700 hover:bg-gray-600' },
		github: { label: 'GitHub', emoji: '🐙', handler: loginWithGithub, color: 'bg-gray-800 hover:bg-gray-700' },
		google: { label: 'Google', emoji: '🔵', handler: loginWithGoogle, color: 'bg-blue-600 hover:bg-blue-500' }
	};
</script>

<div class="flex min-h-[60vh] items-center justify-center">
	<div class="w-full max-w-sm space-y-6">
		<h1 class="text-center text-3xl font-bold text-white">Sign In</h1>
		<div class="space-y-3">
			{#each providers as provider}
				{@const config = providerConfig[provider]}
				{#if config}
					<button
						onclick={config.handler}
						class="flex w-full items-center justify-center gap-3 rounded-xl {config.color} px-6 py-3 text-lg font-medium text-white transition-colors"
					>
						<span class="text-xl">{config.emoji}</span>
						Sign in with {config.label}
					</button>
				{/if}
			{/each}
		</div>
	</div>
</div>
