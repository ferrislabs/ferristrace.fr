/**
 * The routes the 404 page is allowed to suggest. Only pages that exist: the
 * website's own pages, and the destinations the site itself links to.
 *
 * `local: true` means the route is a page in this app, which
 * routes.test.ts checks against src/pages so this list cannot drift.
 * The rest live in the docs and app deployments.
 *
 * When the Cometrace docs land, extend this from their sidebar rather than
 * by hand, so a suggestion can never point at a page that was removed.
 */
export interface Route {
  path: string
  title: string
  local?: boolean
}

export const routes: Route[] = [
  { path: '/', title: 'Home', local: true },
  { path: '/changelog', title: 'Changelog', local: true },
  { path: '/docs', title: 'Documentation' },
  { path: '/docs/self-host', title: 'Self-host guide' },
  { path: '/docs/upgrades', title: 'Upgrade guide' },
  { path: '/sign-in', title: 'Sign in' },
  { path: '/sign-up', title: 'Start on Cloud' },
  { path: '/status', title: 'Status' },
  { path: '/security', title: 'Security' },
]
