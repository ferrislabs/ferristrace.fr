# Deployment

Both public sites run as static nginx containers on the k3s cluster
`cassini.nebulabs.org`, behind Traefik with Let's Encrypt certificates from
cert-manager.

| Site | Host | Image |
| --- | --- | --- |
| `apps/website` | `cometrace.dev`, `www.cometrace.dev` | `ghcr.io/comettrace/website` |
| `apps/docs` | `docs.cometrace.dev` | `ghcr.io/comettrace/docs` |

## How a deploy happens

1. A push to `main` touching an app (or `packages/**`, `Dockerfile`,
   `nginx.conf`, `pnpm-lock.yaml`) runs `.github/workflows/deploy-k3s.yml`.
2. It builds that app's image and pushes it to GHCR as `sha-<commit>`.
3. A single follow-up job rewrites `newTag` in `deploy/k8s/<app>/kustomization.yaml`
   and commits that back to `main`.
4. ArgoCD, which watches `main`, applies the commit.

The workflow never talks to the cluster, so no kubeconfig leaves the cluster
and the GitHub side needs no network path to the API server. The deployed
state is exactly what `main` says it is.

**Rollback** is `git revert` on the bump commit — ArgoCD syncs the previous
tag back. The images are kept by digest, so the rollback never rebuilds.

## Layout

```
deploy/
  k8s/website/     Deployment + Service + Ingress, image tag pinned by CI
  k8s/docs/        same
  argocd/          AppProject + the two Applications (applied once, by hand)
```

## Repository configuration

Actions variables (`gh variable list`):

| Variable | Value |
| --- | --- |
| `DEPLOY_TARGET` | `k3s` — also what keeps the Cloudflare path in `deploy.yml` off |
| `PUBLIC_WEBSITE_URL` | `https://cometrace.dev` |
| `PUBLIC_DOCS_URL` | `https://docs.cometrace.dev` |

Both `PUBLIC_*` values are baked into the static output at build time
(canonical URLs, cross-app navigation), so changing one needs a rebuild.

## Cluster prerequisites

These are set up once, outside git, because they hold credentials:

- **`cometrace-website-repo`** Secret in `argocd` — the read-only GitHub
  deploy key ArgoCD reads `main` with.
- **`ghcr`** Secret in `cometrace` — a dockerconfigjson pull secret for the
  private GHCR packages. Rotate it before the token expires, or deploys stop
  being able to pull:

  ```sh
  kubectl -n cometrace create secret docker-registry ghcr \
    --docker-server=ghcr.io \
    --docker-username=<github-user> \
    --docker-password=<PAT with read:packages> \
    --dry-run=client -o yaml | kubectl apply -f -
  ```

## Notes

- `nginx.conf` listens on **8080**, not 80. The Service maps 80 to it.
- The Dockerfile's build stages run on Debian, not Alpine: sharp, resvg and
  pagefind all pull native binaries and the glibc builds are better tested.
- `.dockerignore` uses `**/node_modules`. Plain `node_modules` only matches
  the context root in Docker's pattern syntax, which let the host's nested
  `node_modules` overwrite the ones installed in the image.
