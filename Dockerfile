# Base image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies (cached layer)
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build application
FROM base AS build
COPY --from=install /app/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun --bun run build

# Production image
FROM base AS production
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY --from=build /app/build build

USER bun
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "fetch('http://localhost:3000').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

ENTRYPOINT ["bun", "./build"]
