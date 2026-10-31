/**
 * Every destination used by the marketing pages, in one place.
 *
 * The docs are a separate app on their own origin, so their links are
 * prefixed with PUBLIC_DOCS_URL the way the rest of the repo does cross-app
 * links. Their URL shape is the docs engine's:
 * /{locale}/{project}/{group}/{page}.
 *
 * Every coordinate here is one the project actually publishes: the repository
 * the remote points at, the registry the release workflow pushes to. No page
 * may name an address that does not answer.
 */
const ORG = 'https://github.com/ferrislabs'

/**
 * The image the release workflow publishes, registry included. Change it here
 * and every command on the page follows.
 */
export const IMAGE = 'ghcr.io/ferrislabs/ferristrace'

/**
 * Without this, every docs link silently becomes a relative path on the
 * marketing domain, where no docs exist. Dev falls back to the port in
 * .env.example; a production build refuses to ship broken links.
 */
function docsOrigin(): string {
  const configured = import.meta.env.PUBLIC_DOCS_URL

  if (configured) return String(configured).replace(/\/$/, '')

  if (import.meta.env.PROD) {
    throw new Error(
      'PUBLIC_DOCS_URL is not set. Every docs link would point at the marketing ' +
        'domain, which does not serve the docs. Set it in .env or in the host.',
    )
  }

  return 'http://localhost:4321'
}

const DOCS_ORIGIN = docsOrigin()

/** `docs('/getting-started/introduction')` -> the full cross-app URL. */
export function docs(path = ''): string {
  return `${DOCS_ORIGIN}/en/ferristrace${path}`
}

/** The repository as the header and the repo card name it. */
export const REPO_SLUG = 'ferrislabs/ferristrace'

export const links = {
  docs: docs('/getting-started/introduction'),
  selfHost: '/#self-host',
  changelog: '/changelog',
  /** The core repository: what a visitor clicking "GitHub" is after. */
  github: `${ORG}/ferristrace`,
  sponsor: 'https://github.com/sponsors/ferrislabs',
  selfHostGuide: docs('/getting-started/quickstart-self-host'),
  /**
   * The repository's own policy. This domain serves no /security page, and a
   * footer link that 404s is worse than one that leaves the site.
   */
  security: `${ORG}/ferristrace/blob/main/SECURITY.md`,
  /** Where the brief sends 'Open an issue'. */
  newIssue: `${ORG}/ferristrace/issues/new`,
  /** The published image, registry included. */
  image: IMAGE,
  /** Left undefined keeps the placeholder visible rather than a dead link. */
  discord: 'https://discord.gg/VXVT9AXQqZ' as string | undefined,
  quickstart: docs('/getting-started/quickstart-self-host'),
} as const
