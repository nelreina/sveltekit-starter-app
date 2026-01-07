# Project Progress

## Stack
- SvelteKit + Bun.js runtime
- Better-Auth + Keycloak (authentication)
- Drizzle ORM (database)
- Redis (Bun native client)

## Experimental Features
- Svelte async
- Svelte remote functions

## Environment Variables
- `DATABASE_URL` - database connection string
- `REDIS_URL` - Redis connection string
- `BETTER_AUTH_SECRET` - secret for signing tokens
- `BETTER_AUTH_URL` - base URL of app
- `KEYCLOAK_ISSUER` - Keycloak realm URL
- `KEYCLOAK_CLIENT_ID` - OAuth client ID
- `KEYCLOAK_CLIENT_SECRET` - OAuth client secret

## Docker
- Multi-stage Dockerfile (optimized for production)
- `compose.yaml` reads env vars from `.env` or shell

```bash
# Build and run
docker compose up -d
```

## Completed
- [x] Created starter page with project info and env vars
- [x] Added Dockerfile (multi-stage, health check, non-root user)
- [x] Added compose.yaml
