# Deployment

Both public sites run as static nginx containers on the k3s cluster
`cassini.nebulabs.org`, behind Traefik with Let's Encrypt certificates from
cert-manager.

| Site           | Host                                     | Image                        |
| -------------- | ---------------------------------------- | ---------------------------- |
| `apps/website` | `ferristrace.dev`, `www.ferristrace.dev` | `ghcr.io/ferrislabs/website` |
| `apps/docs`    | `docs.ferristrace.dev`                   | `ghcr.io/ferrislabs/docs`    |

## How a deploy happens

Nothing in this repository builds or publishes the images any more: the two
deploy workflows were removed. What is left is the desired state.

1. An image is published to GHCR under `ghcr.io/ferrislabs/<app>`.
2. `newTag` in `deploy/k8s/<app>/kustomization.yaml` is set to it, on `main`.
3. ArgoCD, which watches `main`, applies the commit.

Nothing here talks to the cluster, so no kubeconfig leaves it and GitHub needs
no network path to the API server. The deployed state is exactly what `main`
says it is.

**Rollback** is `git revert` on the bump commit — ArgoCD syncs the previous
tag back. The images are kept by digest, so the rollback never rebuilds.

## Layout

```
deploy/
  k8s/website/     Deployment + Service + Ingress, image tag pinned in git
  k8s/docs/        same
  argocd/          AppProject + the two Applications (applied once, by hand)
```

## Repository configuration

Actions variables (`gh variable list`):

| Variable             | Value                                               |
| -------------------- | --------------------------------------------------- |
| `PUBLIC_WEBSITE_URL` | `https://ferristrace.dev`                           |
| `PUBLIC_DOCS_URL`    | `off` while the docs are unpublished, else the host |

Both `PUBLIC_*` values are baked into the static output at build time
(canonical URLs, cross-app navigation), so changing one needs a rebuild.

## Cluster prerequisites

These are set up once, outside git, because they hold credentials:

- **`ferristrace-website-repo`** Secret in `argocd` — the read-only GitHub
  deploy key ArgoCD reads `main` with.
- **`ghcr`** Secret in `ferristrace` — a dockerconfigjson pull secret for the
  private GHCR packages. Rotate it before the token expires, or deploys stop
  being able to pull:

  ```sh
  kubectl -n ferristrace create secret docker-registry ghcr \
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
