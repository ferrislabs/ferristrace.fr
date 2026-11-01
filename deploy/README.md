# Deployment

The website runs as a static nginx container on the k3s node `sd-93359`
(163.172.34.223), behind the shared Envoy `public` Gateway. ArgoCD deploys
the Helm chart in `charts/ferristrace-website`.

| Site | Host | Image |
| --- | --- | --- |
| `apps/website` | `ferristrace.dev` (`www.` redirects to it) | `ghcr.io/ferrislabs/ferristrace-website` |

## How a deploy happens

1. A push to `main` touching the site (`apps/website/**`, `packages/**`,
   `Dockerfile`, `nginx.conf`, the lockfile) runs `.github/workflows/docker.yaml`.
2. It builds the image for amd64 and arm64 and pushes it to GHCR as
   `sha-<7 chars>`.
3. The `update-values` job writes that tag into
   `charts/ferristrace-website/values-production.yaml` and commits it to `main`
   (`[skip ci]`).
4. ArgoCD, which watches `main`, syncs the chart.

The workflow never talks to the cluster. The deployed state is whatever `main`
says it is.

**Rollback** is `git revert` on the `chore(website): deploy sha-…` commit.
ArgoCD syncs the previous tag back without rebuilding anything.

A `v1.2.3` tag publishes `:1.2.3` and `:latest` but does not deploy.

## Layout

```
charts/ferristrace-website/   Deployment, Service, HTTPRoutes, PDB, NetworkPolicy
  values.yaml                 safe defaults
  values-production.yaml      host, Gateway listeners, image tag (written by CI)
deploy/argocd/                AppProject + Application (applied once, by hand)
```

## Cluster prerequisites

Set up once, outside this repository:

- **Gateway listeners.** `ferristrace-https` (ferristrace.dev) and
  `ferristrace-www-https` (www.ferristrace.dev) on the `public` Gateway, in
  `cluster/gateway.yaml` of the infra repository. cert-manager issues both
  certificates over HTTP-01 through the `letsencrypt` ClusterIssuer, so both
  names must resolve to the node first.
- **DNS** (Cloudflare): `ferristrace.dev` and `www.ferristrace.dev` as A records
  to 163.172.34.223, DNS only (no proxy), or HTTP-01 cannot complete.
- **GHCR package** `ferrislabs/ferristrace-website` set to public. The chart
  has no pull secret; a private package ends in `ImagePullBackOff`.

## First deploy

1. Push to `main` and wait for the `docker` workflow: it commits the first tag.
2. Apply the ArgoCD manifests:

   ```sh
   kubectl apply -f deploy/argocd/appproject-ferristrace-website.yaml
   kubectl apply -f deploy/argocd/application-ferristrace-website.yaml
   ```

The Application is applied after the first build on purpose: the chart refuses
an empty `image.tag`.

## Checking a change to the chart

```sh
helm lint charts/ferristrace-website -f charts/ferristrace-website/values-production.yaml
helm template ferristrace-website charts/ferristrace-website \
  -f charts/ferristrace-website/values-production.yaml -n ferristrace
```

## Repository configuration

Actions variables, all optional (`gh variable list`):

| Variable | Default |
| --- | --- |
| `PUBLIC_WEBSITE_URL` | `https://ferristrace.dev` |
| `PUBLIC_DOCS_URL` | `https://docs.ferristrace.dev` |

Both are baked into the static output at build time (canonical URLs, links to
the docs), so changing one needs a rebuild.

## Notes

- `nginx.conf` listens on **8080** and writes only under `/tmp`, so the pod
  runs as uid 101 with a read-only root filesystem. The Service maps 80 to it.
- The changelog workflow pushes with `GITHUB_TOKEN`, which does not start other
  workflows. A changelog sync alone does not redeploy: the next push to the
  site picks it up.
