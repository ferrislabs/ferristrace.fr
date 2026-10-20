import { describe, it, expect } from 'vitest'
import { resolvePageAccess } from './access'

const meta = {
  'cometrace/default/en/deployment': { auth: { enabled: true, roles: ['devops'] } },
  'cometrace/default/en/deployment/secret': { auth: { enabled: true, roles: ['devops', 'admin'] } },
}

describe('resolvePageAccess', () => {
  it('is public when neither frontmatter nor ancestors declare auth', () => {
    expect(resolvePageAccess('cometrace/default/en/getting-started.mdx', undefined, meta)).toEqual({
      enabled: false,
      roles: [],
    })
  })

  it('inherits auth from the nearest ancestor folder', () => {
    expect(resolvePageAccess('cometrace/default/en/deployment/vercel.mdx', undefined, meta)).toEqual({
      enabled: true,
      roles: ['devops'],
    })
  })

  it('nearest ancestor wins over a shallower one', () => {
    expect(
      resolvePageAccess('cometrace/default/en/deployment/secret/keys.mdx', undefined, meta),
    ).toEqual({ enabled: true, roles: ['devops', 'admin'] })
  })

  it('page frontmatter overrides inheritance', () => {
    expect(
      resolvePageAccess('cometrace/default/en/deployment/vercel.mdx', { enabled: true, roles: ['admin'] }, meta),
    ).toEqual({ enabled: true, roles: ['admin'] })
  })

  it('frontmatter can opt a page out of a protected folder', () => {
    expect(
      resolvePageAccess('cometrace/default/en/deployment/vercel.mdx', { enabled: false }, meta),
    ).toEqual({ enabled: false, roles: [] })
  })

  it('enabled with no roles means any authenticated user', () => {
    expect(
      resolvePageAccess('cometrace/default/en/dashboard.mdx', { enabled: true }, meta),
    ).toEqual({ enabled: true, roles: [] })
  })
})
