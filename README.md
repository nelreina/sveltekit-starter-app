# SvelteKit + Bun Starter with Better-Auth & Keycloak

A production-ready starter kit for building secure, data-driven applications with SvelteKit and Bun.js runtime.

## Tech Stack

- **SvelteKit 2** + **Svelte 5** - Full-stack web framework with modern reactivity
- **Bun.js** - Fast JavaScript runtime and package manager
- **Better-Auth** + **Keycloak** - Enterprise OAuth2 authentication
- **Drizzle ORM** + **PostgreSQL** - Type-safe database access with migrations
- **Redis** - Caching via Bun native client
- **AG Grid Community** - Enterprise-grade data grid

## Features

- Enterprise authentication with Keycloak OAuth2
- Protected routes with automatic session handling
- Database ready with Drizzle ORM migrations
- Redis caching layer
- AG Grid data visualization with 1000+ row example
- Svelte remote functions (experimental)
- Multi-stage Docker build for production

## Prerequisites

- [Bun](https://bun.sh/) installed
- PostgreSQL database
- Redis server
- Keycloak realm configured with a client

## Getting Started

1. **Clone and install dependencies**

```bash
bun install
```

2. **Configure environment variables**

Copy `env_template` to `.env` and fill in your values:

```bash
cp env_template .env
```

3. **Run database migrations**

```bash
bun run db:push
```

4. **Start development server**

```bash
bun --bun run dev
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `BETTER_AUTH_SECRET` | Secret for signing tokens | Random secure string |
| `BETTER_AUTH_URL` | Base URL of your app | `http://localhost:5173` |
| `KEYCLOAK_ISSUER` | Keycloak realm URL | `https://keycloak.example.com/realms/myrealm` |
| `KEYCLOAK_CLIENT_ID` | OAuth client ID | `my-app` |
| `KEYCLOAK_CLIENT_SECRET` | OAuth client secret | From Keycloak console |
| `KEYCLOAK_LOGOUT_ENABLED` | Enable single logout (optional) | `true` |

## Development Commands

```bash
bun --bun run dev        # Start dev server
bun --bun run build      # Production build
bun --bun run preview    # Preview production build

# Database
bun run db:generate      # Generate migrations
bun run db:migrate       # Apply migrations
bun run db:push          # Push schema to database
bun run db:studio        # Open Drizzle Studio UI

# Code quality
bun run check            # Type check
bun run lint             # Lint code
bun run format           # Format code
```

## Project Structure

```
src/
├── lib/
│   ├── components/      # Reusable components (AgGrid)
│   ├── server/
│   │   ├── auth.ts      # Better-Auth configuration
│   │   ├── db/          # Drizzle schema and client
│   │   └── redis/       # Redis client
│   └── auth-client.ts   # Client-side auth utilities
├── routes/
│   ├── app/             # Protected routes
│   ├── login/           # Authentication entry
│   ├── sales/           # AG Grid example page
│   └── +page.svelte     # Home page
└── hooks.server.ts      # Session handling
drizzle/                 # Database migrations
```

## Docker Deployment

Build and run with Docker Compose:

```bash
docker compose up -d
```

Or build the image directly:

```bash
docker build -t sveltekit-starter .
docker run -p 3000:3000 --env-file .env sveltekit-starter
```

## Experimental Features

This starter uses experimental Svelte features:

- **Svelte Async** - Async component support
- **Remote Functions** - Server functions callable from client via `query()` wrapper

## License

MIT
