import { DOCS_PUBLISHED, docs } from '../components/landing/links'

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
  ['/getting-started/concepts', 'Concepts'],
  ['/sending-data/opentelemetry-sdks', 'OpenTelemetry SDKs'],
  ['/sending-data/opentelemetry-collector', 'OpenTelemetry Collector'],
  ['/sending-data/otlp-over-http', 'OTLP over HTTP'],
  ['/sending-data/ingest-keys', 'Ingest keys'],
  ['/using-ferristrace/traces', 'Traces'],
  ['/using-ferristrace/logs', 'Logs'],
  ['/using-ferristrace/metrics', 'Metrics'],
  ['/using-ferristrace/keyboard-shortcuts', 'Keyboard shortcuts'],
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
  ...DOCS_PAGES.map(([path, title]) => ({ path, href: docs(path), title })),
]

/**
 * What the 404 may actually offer. The full list stays whole so the test that
 * holds it against the docs sidebar keeps working; this is the view that
 * drops the docs pages while they would answer 404 themselves, which would
 * send the reader from one dead end to another.
 */
export const suggestibleRoutes: Route[] = DOCS_PUBLISHED
  ? routes
  : routes.filter((route) => route.local)
