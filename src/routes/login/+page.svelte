<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let { data } = $props();

	let userId = $state('');
	let loading = $state(false);
	let error = $state(data.error || '');
	let realmResolved = $state(false);
	let realmName = $state('');

	const errorMessages: Record<string, string> = {
		no_realm: 'Session expired. Please enter your User ID again.',
		config_error: 'Realm configuration error. Contact your administrator.'
	};

	async function lookupRealm() {
		if (!userId.trim()) return;
		loading = true;
		error = '';

		try {
			const res = await fetch('/api/realm-lookup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: userId.trim() })
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				error = data.message || 'User not found. Please check your User ID.';
				loading = false;
				return;
			}

			const { realm } = await res.json();
			realmName = realm;
			realmResolved = true;

			// Auto-redirect to Keycloak
			await authClient.signIn.oauth2({
				providerId: 'keycloak',
				callbackURL: '/app'
			});
		} catch (e) {
			error = 'Something went wrong. Please try again.';
			loading = false;
		}
	}

	function reset() {
		realmResolved = false;
		realmName = '';
		userId = '';
		error = '';
	}
</script>

<div class="flex min-h-[60vh] items-center justify-center">
	<div class="w-full max-w-sm space-y-6">
		<h1 class="text-center text-3xl font-bold text-white">Sign In</h1>

		{#if error}
			<div class="rounded-xl bg-red-900/50 border border-red-700 px-4 py-3 text-sm text-red-200">
				{errorMessages[error] || error}
			</div>
		{/if}

		{#if !realmResolved}
			<!-- Step 1: User ID input -->
			<form onsubmit={(e) => { e.preventDefault(); lookupRealm(); }} class="space-y-4">
				<div>
					<label for="userId" class="block text-sm font-medium text-gray-300 mb-1">User ID</label>
					<input
						id="userId"
						type="text"
						bind:value={userId}
						placeholder="Enter your User ID"
						disabled={loading}
						class="w-full rounded-xl border border-gray-600 bg-gray-800 px-4 py-3 text-base text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
					/>
				</div>
				<button
					type="submit"
					disabled={loading || !userId.trim()}
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
				>
					{#if loading}
						<span class="animate-spin">⏳</span> Looking up...
					{:else}
						Continue →
					{/if}
				</button>
			</form>
		{:else}
			<!-- Step 2: Redirecting to Keycloak -->
			<div class="text-center space-y-4">
				<div class="text-lg text-gray-300">
					Redirecting to <span class="font-semibold text-white">{realmName}</span> login...
				</div>
				<div class="animate-spin text-3xl">🔄</div>
				<button
					onclick={reset}
					class="text-sm text-gray-500 hover:text-gray-300 transition-colors"
				>
					← Use a different User ID
				</button>
			</div>
		{/if}
	</div>
</div>
