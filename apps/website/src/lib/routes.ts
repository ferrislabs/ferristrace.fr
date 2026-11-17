import { products, solutions } from '../components/landing/catalog'
import { docs } from '../components/landing/links'

/**
 * The routes the 404 page is allowed to suggest. Only pages that exist.
 *
 * `local: true` marks a page in this app, which routes.test.ts checks against
 * src/pages. The docs entries mirror the sidebar of apps/docs, and the same
 * test checks each one against its MDX file, so neither list can drift into
 * suggesting a page that was removed.
 *
 * `path` is what the reader sees and what the matcher scores against; `href`
 * is where the link goes, which for the docs is another origin.
 */
export interface Route {
  path: string
  href: string
  title: string
  local?: boolean
}

const DOCS_PAGES: Array<[path: string, title: string]> = [
  ['/getting-started/introduction', 'Introduction'],
  ['/getting-started/concepts', 'Core concepts'],
  ['/getting-started/quickstart-self-host', 'Quickstart: Docker Compose'],
  ['/getting-started/kubernetes-helm', 'Deploy on Kubernetes (Helm)'],
  ['/sending-data/ingest-keys', 'Ingest keys'],
  ['/sending-data/opentelemetry-sdks', 'OpenTelemetry SDKs'],
  ['/sending-data/opentelemetry-collector', 'OpenTelemetry Collector'],
  ['/sending-data/otlp-protocol', 'OTLP endpoints & wire format'],
  ['/exploring/overview-and-navigation', 'Home, navigation & shortcuts'],
  ['/exploring/query-language', 'Query language & filters'],
  ['/exploring/traces', 'Traces & spans'],
  ['/exploring/logs', 'Logs'],
  ['/exploring/metrics', 'Metrics'],
  ['/exploring/services-and-backend', 'Services, releases & backend views'],
  ['/exploring/issues', 'Issues & exceptions'],
  ['/exploring/infrastructure', 'Infrastructure & Kubernetes'],
  ['/exploring/dashboards', 'Dashboards'],
  ['/ai-and-cost/llm-observability', 'LLM observability'],
  ['/ai-and-cost/cost-meter', 'Cost meter & usage'],
  ['/incident-response/alerts', 'Alert rules & channels'],
  ['/incident-response/incidents', 'Incidents'],
  ['/incident-response/on-call', 'On-call & paging'],
  ['/incident-response/postmortems', 'Postmortems'],
  ['/incident-response/status-pages', 'Public status pages'],
  ['/ai-agents-and-mcp/ai-agents', 'AI agents'],
  ['/ai-agents-and-mcp/mcp-gateway', 'MCP server & policy gateway'],
  ['/administration/authentication-oidc', 'Authentication & FerrisKey (OIDC)'],
  ['/administration/projects', 'Organisations & projects'],
  ['/administration/members-and-roles', 'Members, teams & roles'],
  ['/administration/retention-and-cold-storage', 'Retention & cold storage'],
  ['/administration/backups-and-upgrades', 'Backups, export & upgrades'],
  ['/reference/api-authentication', 'API keys & authentication'],
  ['/reference/http-api', 'HTTP API reference'],
  ['/reference/cli', 'CLI reference'],
  ['/reference/configuration', 'Configuration & environment variables'],
  ['/reference/ports-and-architecture', 'Ports, containers & architecture'],
]

export const routes: Route[] = [
  { path: '/', href: '/', title: 'Home', local: true },
  { path: '/changelog', href: '/changelog', title: 'Changelog', local: true },
  { path: '/pricing', href: '/pricing', title: 'Pricing', local: true },
  ...[...products, ...solutions].map(({ href, title }) => ({ path: href, href, title, local: true })),
  ...DOCS_PAGES.map(([path, title]) => ({ path, href: docs(path), title })),
]
