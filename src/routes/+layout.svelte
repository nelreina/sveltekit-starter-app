<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div data-sveltekit-preload-data="off">
	<nav>
		<a href={resolve('/')}>Home</a>
		<a href={resolve('/app')}>Start</a>
	</nav>
	<main>
		{@render children()}
	</main>
</div>

<style>
	main {
		margin-top: 2em;
	}
</style>
