# syntax=docker/dockerfile:1

# The Ferristace website: built with Astro, served by nginx on 8080.
#
#   docker build -t ferristace-website .
#   docker run --rm -p 8080:8080 ferristace-website
#
# The PUBLIC_* build arguments are read at build time, not at container start:
# the site is static.

# --- Dependencies: only what the website needs ----------------------------
FROM node:22-alpine AS deps
# The pnpm version comes from the packageManager field of package.json.
RUN corepack enable
WORKDIR /app

# Manifests first, so this layer is reused until a dependency changes.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/website/package.json apps/website/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/thumbnail/package.json packages/thumbnail/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --filter "@cometrace/website..."

# --- Build -----------------------------------------------------------------
FROM deps AS build
# The packages extend the root tsconfig.
COPY tsconfig.json ./
COPY apps/website apps/website
COPY packages/config packages/config
COPY packages/thumbnail packages/thumbnail
COPY packages/ui packages/ui

ARG PUBLIC_WEBSITE_URL
ARG PUBLIC_DOCS_URL
ENV PUBLIC_WEBSITE_URL=${PUBLIC_WEBSITE_URL} \
    PUBLIC_DOCS_URL=${PUBLIC_DOCS_URL}

RUN pnpm --filter @cometrace/website build

# --- Runtime ---------------------------------------------------------------
FROM nginx:1.28.0-alpine3.21-slim AS runtime
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/apps/website/dist /usr/share/nginx/html

# nginx writes only under /tmp (see nginx.conf), so it runs as a plain user
# with a read-only root filesystem.
USER 101
EXPOSE 8080
