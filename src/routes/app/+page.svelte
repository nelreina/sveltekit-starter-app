<script lang="ts">
	import { resolve } from '$app/paths';
	let { data } = $props();
</script>

<nav>
	<!-- <a href={resolve('/app')}>Reports</a> -->
</nav>

<h3>App Dashboard</h3>
<pre>{JSON.stringify(data, null, 2)}</pre>

<style>
	nav {
		margin-bottom: 2rem;
	}
</style>
