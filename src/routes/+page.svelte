<script lang="ts">
</script>

<h1>Starter Kit</h1>

<h2>Stack</h2>
<ul>
	<li>SvelteKit</li>
	<li>Bun.js runtime</li>
	<li>Better-Auth (authentication)</li>
	<li>Keycloak (identity provider)</li>
	<li>Drizzle ORM (database)</li>
</ul>

<h2>Experimental Features</h2>
<ul>
	<li><code>svelte async</code> - async component support</li>
	<li><code>svelte remote functions</code> - server functions callable from client</li>
</ul>

<h2>Environment Variables</h2>

<h3>Database</h3>
<ul>
	<li><code>DATABASE_URL</code> - database connection string</li>
	<li><code>REDIS_URL</code> - Redis connection string (Bun native client)</li>
</ul>

<h3>Better-Auth</h3>
<ul>
	<li><code>BETTER_AUTH_SECRET</code> - secret for signing tokens</li>
	<li><code>BETTER_AUTH_URL</code> - base URL of your app</li>
</ul>

<h3>Keycloak</h3>
<ul>
	<li><code>KEYCLOAK_ISSUER</code> - Keycloak realm URL</li>
	<li><code>KEYCLOAK_CLIENT_ID</code> - OAuth client ID</li>
	<li><code>KEYCLOAK_CLIENT_SECRET</code> - OAuth client secret</li>
</ul>

<hr />
