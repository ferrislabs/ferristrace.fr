/**
 * Every destination used by the marketing pages, in one place.
 *
 * The docs are a separate app on their own origin, so their links are
 * prefixed with PUBLIC_DOCS_URL the way the rest of the repo does cross-app
 * links. Their URL shape is the docs engine's:
 * /{locale}/{project}/{group}/{page}.
 *
 * What is still unknown stays a visible bracketed placeholder rather than
 * being invented: the container registry, the licence and the legal entity.
 */
const ORG = 'https://github.com/Comettrace'

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
  return `${DOCS_ORIGIN}/en/cometrace${path}`
}

export const links = {
  docs: docs('/getting-started/introduction'),
  selfHost: '/#self-host',
  cloud: '/#cloud',
  changelog: '/changelog',
  /** The core repository: what a visitor clicking "GitHub" is after. */
  github: `${ORG}/Cometrace`,
  sponsor: 'https://github.com/sponsors/Comettrace',
  signIn: '/sign-in',
  startOnCloud: '/sign-up',
  selfHostGuide: docs('/getting-started/quickstart-self-host'),
  status: '/status',
  security: '/security',
} as const
