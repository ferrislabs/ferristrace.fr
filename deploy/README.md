# Deployment

Both public sites run as static nginx containers on the k3s node `sd-93359`
(163.172.34.223), behind the shared Envoy `public` Gateway. ArgoCD deploys
the Helm charts in `charts/`.

| Site | Host | Image | Workflow |
| --- | --- | --- | --- |
| `apps/website` | `ferristrace.dev` (`www.` redirects to it) | `ghcr.io/ferristrace/ferristrace-website` | `.github/workflows/docker.yaml` |
| `apps/docs` | `docs.ferristrace.dev` | `ghcr.io/ferristrace/ferristrace-docs` | `.github/workflows/docker-docs.yaml` |

## How a deploy happens

1. A push to `main` touching a site runs its workflow (`docker.yaml` for
   `apps/website`, `docker-docs.yaml` for `apps/docs`).
2. It builds the image for amd64 and arm64 (`Dockerfile` or `Dockerfile.docs`)
   and pushes it to GHCR as `sha-<7 chars>`.
3. The `update-values` job writes that tag into the corresponding chart's
   `values-production.yaml` and commits it to `main` (`[skip ci]`).
4. ArgoCD, which watches `main`, syncs the chart.

The workflows never talk to the cluster. The deployed state is whatever `main`
says it is.

**Rollback** is `git revert` on the `chore(website): deploy sha-…` or
`chore(docs): deploy sha-…` commit. ArgoCD syncs the previous tag back without
rebuilding anything.

A `v1.2.3` tag publishes `:1.2.3` and `:latest` but does not deploy.

## Layout

```
charts/ferristrace-website/   Deployment, Service, HTTPRoutes, PDB, NetworkPolicy
  values.yaml                 safe defaults
  values-production.yaml      host, Gateway listeners, image tag (written by CI)
charts/ferristrace-docs/      Deployment, Service, HTTPRoutes, PDB, NetworkPolicy
  values.yaml                 safe defaults
  values-production.yaml      host, Gateway listener, image tag (written by CI)
deploy/argocd/                AppProjects + Applications (applied once, by hand)
```

## Cluster prerequisites

Set up once, outside this repository:

- **Gateway listeners.** `ferristrace-https` (`ferristrace.dev`),
  `ferristrace-www-https` (`www.ferristrace.dev`), and `ferristrace-docs-https`
  (`docs.ferristrace.dev`) on the `public` Gateway, in `cluster/gateway.yaml`
  of the infra repository. cert-manager issues the certificates over HTTP-01
  through the `letsencrypt` ClusterIssuer, so all names must resolve to the
  node first.
- **DNS** (Cloudflare): `ferristrace.dev`, `www.ferristrace.dev`, and
  `docs.ferristrace.dev` as A records to 163.172.34.223, DNS only (no proxy),
  or HTTP-01 cannot complete.
- **GHCR packages** `ferristrace/ferristrace-website` and
  `ferristrace/ferristrace-docs` set to public. The charts have no pull secret;
  a private package ends in `ImagePullBackOff`.

## First deploy

1. Push to `main` and wait for the corresponding workflow (`docker` or
   `docker-docs`): it commits the first tag.
2. Apply the ArgoCD manifests:

   ```sh
   # Website
   kubectl apply -f deploy/argocd/appproject-ferristrace-website.yaml
   kubectl apply -f deploy/argocd/application-ferristrace-website.yaml

   # Docs
   kubectl apply -f deploy/argocd/appproject-ferristrace-docs.yaml
   kubectl apply -f deploy/argocd/application-ferristrace-docs.yaml
   ```

The Application is applied after the first build on purpose: the chart refuses
an empty `image.tag`.

## Checking a change to a chart

```sh
helm lint charts/ferristrace-website -f charts/ferristrace-website/values-production.yaml
helm template ferristrace-website charts/ferristrace-website \
  -f charts/ferristrace-website/values-production.yaml -n ferristrace

helm lint charts/ferristrace-docs -f charts/ferristrace-docs/values-production.yaml --set image.tag=sha-0000000
helm template ferristrace-docs charts/ferristrace-docs \
  -f charts/ferristrace-docs/values-production.yaml --set image.tag=sha-0000000 -n ferristrace
```

## Repository configuration

Actions variables, all optional (`gh variable list`):

| Variable | Default |
| --- | --- |
| `PUBLIC_WEBSITE_URL` | `https://ferristrace.dev` |
| `PUBLIC_DOCS_URL` | `https://docs.ferristrace.dev` |

Both are baked into the static output at build time (canonical URLs, links
between the website and docs), so changing one needs a rebuild.

## Notes

- `nginx.conf` listens on **8080** and writes only under `/tmp`, so the pod
  runs as uid 101 with a read-only root filesystem. The Service maps 80 to it.
- The changelog workflow pushes with `GITHUB_TOKEN`, which does not start other
  workflows. A changelog sync alone does not redeploy: the next push to the
  site picks it up.
