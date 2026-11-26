import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { InlineMarkdown } from './inline-markdown'

const html = (text: string) => renderToStaticMarkup(<InlineMarkdown text={text} />)

describe('InlineMarkdown', () => {
  it('renders a bold scope followed by text without looping', () => {
    expect(html('**status**: Schedule maintenances (#394)')).toBe(
      '<strong class="font-semibold text-foreground">status</strong>: Schedule maintenances (#394)',
    )
  })

  it('renders several nested tokens in one bullet', () => {
    const out = html('**web**: Use `ft_ik_` keys, see [the *docs*](https://example.com)')
    expect(out).toContain('<strong class="font-semibold text-foreground">web</strong>')
    expect(out).toContain('<code')
    expect(out).toContain('<em>docs</em>')
    expect(out).toContain('href="https://example.com"')
  })

  it('keeps plain text as it is', () => {
    expect(html('Nothing to format')).toBe('Nothing to format')
  })
})
