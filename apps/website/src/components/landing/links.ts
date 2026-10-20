/**
 * Every destination used by the marketing pages, in one place.
 *
 * The docs are a separate app deployed on its own origin, so their links are
 * prefixed with PUBLIC_DOCS_URL the way the rest of the repo does it. Their
 * URL shape is the docs engine's: /{locale}/{project}/{group}/{page}.
 *
 * What is still unknown stays a visible bracketed placeholder rather than
 * being invented: the container registry, the licence and the legal entity.
 */
const ORG = 'https://github.com/Comettrace'

const DOCS_ORIGIN = import.meta.env.PUBLIC_DOCS_URL ?? ''

/** `docs('/getting-started/introduction')` -> the full cross-app URL. */
export function docs(path = ''): string {
  return `${DOCS_ORIGIN}/en/cometrace${path}`
}

export const links = {
  docs: docs('/getting-started/introduction'),
  docsHome: docs(),
  selfHost: '/#self-host',
  cloud: '/#cloud',
  changelog: '/changelog',
  /** The core repository: what a visitor clicking "GitHub" is after. */
  github: `${ORG}/Cometrace`,
  org: ORG,
  sponsor: 'https://github.com/sponsors/Comettrace',
  signIn: '/sign-in',
  startOnCloud: '/sign-up',
  selfHostGuide: docs('/getting-started/quickstart-self-host'),
  status: '/status',
  security: '/security',
} as const
