/**
 * Search and social metadata for every indexable page, in one place: the
 * pages read their <head> from here, the sitemap lists these paths, and the
 * thumbnail integration draws one social card per entry.
 *
 * Paths end with a slash because nginx redirects to that form: a canonical
 * URL must not point at a redirect.
 *
 * Plain data on purpose (no React, no icons), so astro.config.ts can import it.
 */
export interface PageMeta {
  path: string
  /** The <title>, before the " · FerrisTrace" suffix. */
  title: string
  /** Meta description: what the page answers, around 150 characters. */
  description: string
  /** The social card: a small label above a large headline. */
  card: { eyebrow: string; headline: string }
  /** Relative weight in the sitemap, 0 to 1. */
  priority: number
}

export const pages: PageMeta[] = [
  {
    path: '/',
    title: 'Open-source observability, incidents and AI agents',
    description:
      'Traces, logs, metrics, incidents and LLM calls from a single open-source container, built on OpenTelemetry, with FerrisKey limiting what AI agents can reach.',
    card: { eyebrow: 'Open-source observability', headline: 'Find what broke. Fix it and go back to bed.' },
    priority: 1,
  },
  {
    path: '/product/observability/',
    title: 'Traces, logs and metrics',
    description:
      'Follow a request across every service and read its logs and metrics on the same screen. Built on OpenTelemetry, open source.',
    card: { eyebrow: 'Traces, logs & metrics', headline: "Stop guessing why it's slow. Look at the request." },
    priority: 0.9,
  },
  {
    path: '/product/infrastructure/',
    title: 'Kubernetes infrastructure',
    description:
      'See Kubernetes pods, nodes and deploys next to the services running on them, and find which deploy broke what.',
    card: { eyebrow: 'Infrastructure', headline: 'Know which pod broke it, and which deploy shipped it.' },
    priority: 0.9,
  },
  {
    path: '/product/incidents/',
    title: 'Incident response',
    description:
      'Run alerts, on-call and postmortems in the same tool as your traces and logs, so the evidence is already in the incident.',
    card: { eyebrow: 'Incident response', headline: 'Run the incident where the evidence already is.' },
    priority: 0.9,
  },
  {
    path: '/product/ai-observability/',
    title: 'AI and LLM observability',
    description:
      'See what each LLM call cost, how many tokens it used and how long it took, broken down by feature and customer.',
    card: { eyebrow: 'AI observability', headline: 'Know what every LLM call costs, and why.' },
    priority: 0.9,
  },
  {
    path: '/product/ai-agents/',
    title: 'AI agents secured by FerrisKey',
    description:
      'AI agents investigate your telemetry with scoped, expiring FerrisKey tokens, and every action they take lands in the audit log.',
    card: { eyebrow: 'AI agents · FerrisKey', headline: 'Let AI agents investigate. Keep the keys to production.' },
    priority: 0.9,
  },
  {
    path: '/solutions/startups/',
    title: 'Observability for startups',
    description:
      'Traces, logs, metrics and incidents from one container, for teams that do not have an SRE yet. Free to self-host.',
    card: { eyebrow: 'For startups', headline: 'Watch production properly before you can afford an SRE.' },
    priority: 0.8,
  },
  {
    path: '/solutions/enterprises/',
    title: 'Self-hosted observability for enterprises',
    description:
      'Observability on your own infrastructure, with OpenID Connect sign-in, an audit log and AI agents limited by FerrisKey.',
    card: { eyebrow: 'For enterprises', headline: 'Observability you run inside your own perimeter.' },
    priority: 0.8,
  },
  {
    path: '/solutions/platform-teams/',
    title: 'Observability for platform and SRE teams',
    description:
      'Product teams set up their own observability while you watch every cluster and run incidents in the same tool.',
    card: { eyebrow: 'For platform & SRE teams', headline: 'Stop being the help desk for every dashboard request.' },
    priority: 0.8,
  },
  {
    path: '/solutions/ai-teams/',
    title: 'Observability for AI product teams',
    description:
      'Track the cost, tokens and latency of every LLM call, and give AI agents scoped access through FerrisKey.',
    card: { eyebrow: 'For AI product teams', headline: 'Ship LLM features knowing what each call costs.' },
    priority: 0.8,
  },
  {
    path: '/pricing/',
    title: 'Pricing',
    description:
      'Every plan includes every feature. Self-hosting is free under Apache 2.0, and Cloud is free during the beta.',
    card: { eyebrow: 'Pricing', headline: 'Every plan gets every feature. You pick who runs the servers.' },
    priority: 0.7,
  },
  {
    path: '/changelog/',
    title: 'Changelog',
    description:
      'Every release of FerrisTrace. Self-hosted and Cloud run the same versions; Cloud workspaces get each release on its publication day.',
    card: { eyebrow: 'Changelog', headline: 'Every release of FerrisTrace, as it ships.' },
    priority: 0.5,
  },
]

export function pageMeta(path: string): PageMeta {
  const meta = pages.find((p) => p.path === path)
  if (!meta) throw new Error(`No page metadata for ${path}: add it to src/lib/pages.ts`)
  return meta
}

/** Where the thumbnail integration writes the card of a page. */
export function cardPath(path: string): string {
  return `${path}thumbnail.png`
}
