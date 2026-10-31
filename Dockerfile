# syntax=docker/dockerfile:1
#
# Multi-stage build for any Ferristrace app.
#
#   docker build --build-arg APP=website -t ferristrace-website .
#   docker build --build-arg APP=docs    -t ferristrace-docs .
#
# The build stages run on Debian, not Alpine: astro's image pipeline (sharp),
# the thumbnail package (@resvg/resvg-js) and the docs search index (pagefind)
# all pull prebuilt native binaries, and the glibc ones are the better-tested
# path. Only the nginx runtime ships, so the build image size is irrelevant.

# --- Stage 1: install the workspace ---
FROM node:22-bookworm-slim AS deps
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

# Every manifest in the workspace, so pnpm resolves the full dependency graph.
# Omitting one makes `workspace:*` links dangle and the build fails much later
# with a missing module.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/docs/package.json          apps/docs/
COPY apps/website/package.json       apps/website/
COPY packages/auth/package.json      packages/auth/
COPY packages/config/package.json    packages/config/
COPY packages/mdx/package.json       packages/mdx/
COPY packages/thumbnail/package.json packages/thumbnail/
COPY packages/ui/package.json        packages/ui/
RUN pnpm install --frozen-lockfile

# --- Stage 2: build the target app ---
# Inherits the installed node_modules in place; copying them by hand breaks
# pnpm's symlink farm.
FROM deps AS builder
ARG APP=website
# Astro bakes these into the static output (canonical URLs, cross-app nav),
# so they have to be present at build time, not at run time.
ARG PUBLIC_WEBSITE_URL
ARG PUBLIC_DOCS_URL
ENV PUBLIC_WEBSITE_URL=$PUBLIC_WEBSITE_URL \
    PUBLIC_DOCS_URL=$PUBLIC_DOCS_URL
COPY . .
# The landing reads the repository's star, contributor and commit counts from
# the GitHub API at build time. Anonymous calls are capped at 60 an hour per
# machine and one build spends five, so CI passes a token. It arrives as a
# BuildKit secret, not a build arg: an arg is written into the image history
# for anyone who pulls it. Without the secret the file is simply absent, the
# calls go out anonymously and the counts fall back to their placeholders.
RUN --mount=type=secret,id=github_token GITHUB_TOKEN_FILE=/run/secrets/github_token pnpm --filter @ferristrace/${APP} build

# --- Stage 3: serve ---
FROM nginx:1.28.0-alpine3.21-slim AS runtime
ARG APP=website
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/apps/${APP}/dist /usr/share/nginx/html
# nginx.conf listens on 8080, not 80.
EXPOSE 8080
