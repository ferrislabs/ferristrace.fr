/**
 * Every destination used by the landing page, in one place. What is still
 * unknown stays a visible bracketed placeholder rather than being invented:
 * the container registry, the licence and the legal entity.
 */
const ORG = 'https://github.com/Comettrace'

export const links = {
  docs: '/docs',
  selfHost: '#self-host',
  cloud: '#cloud',
  changelog: '/changelog',
  /** The core repository: what a visitor clicking "GitHub" is after. */
  github: `${ORG}/Cometrace`,
  org: ORG,
  sponsor: 'https://github.com/sponsors/Comettrace',
  signIn: '/sign-in',
  startOnCloud: '/sign-up',
  selfHostGuide: '/docs/self-host',
  status: '/status',
  security: '/security',
} as const
