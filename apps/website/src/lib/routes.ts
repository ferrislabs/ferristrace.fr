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
  ['/getting-started/quickstart-self-host', 'Quickstart: self-host'],
  ['/getting-started/quickstart-cloud', 'Quickstart: Cloud'],
  ['/getting-started/concepts', 'Concepts'],
  ['/sending-data/opentelemetry-sdks', 'OpenTelemetry SDKs'],
  ['/sending-data/opentelemetry-collector', 'OpenTelemetry Collector'],
  ['/sending-data/otlp-over-http', 'OTLP over HTTP'],
  ['/sending-data/ingest-keys', 'Ingest keys'],
  ['/using-cometrace/traces', 'Traces'],
  ['/using-cometrace/logs', 'Logs'],
  ['/using-cometrace/metrics', 'Metrics'],
  ['/using-cometrace/keyboard-shortcuts', 'Keyboard shortcuts'],
  ['/administration/members-and-roles', 'Members and roles'],
  ['/administration/projects', 'Projects'],
  ['/administration/retention', 'Retention'],
  ['/administration/single-sign-on', 'Single sign-on (OIDC)'],
  ['/administration/backups-and-upgrades', 'Backups and upgrades'],
  ['/api/api-tokens', 'Api tokens'],
  ['/api/query-api-reference', 'Query API reference'],
  ['/reference/configuration', 'Configuration'],
  ['/reference/ports', 'Ports'],
  ['/reference/changelog', 'Changelog'],
]

export const routes: Route[] = [
  { path: '/', href: '/', title: 'Home', local: true },
  { path: '/changelog', href: '/changelog', title: 'Changelog', local: true },
  { path: '/pricing', href: '/pricing', title: 'Pricing', local: true },
  ...[...products, ...solutions].map(({ href, title }) => ({ path: href, href, title, local: true })),
  ...DOCS_PAGES.map(([path, title]) => ({ path, href: docs(path), title })),
]
