import type { ReactNode } from 'react'

/**
 * Renders the inline markdown a changelog bullet is allowed to carry: code
 * spans, links and emphasis. Block syntax is deliberately not supported, so a
 * bullet can never introduce its own heading or list into the page.
 */

// Code spans come first so their contents are never re-parsed.
const TOKEN = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_/g

/** Only schemes that cannot execute. Anything else renders as plain text. */
function safeHref(href: string): string | null {
  if (/^(https?:|mailto:)/i.test(href)) return href
  if (/^[./#]/.test(href)) return href
  return null
}

function render(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null

  TOKEN.lastIndex = 0
  while ((match = TOKEN.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const key = `${keyPrefix}-${match.index}`

    if (match[1] !== undefined) {
      nodes.push(
        <code
          key={key}
          className="border border-border bg-muted px-1 py-0.5 font-mono text-[0.85em]"
        >
          {match[1]}
        </code>,
      )
    } else if (match[2] !== undefined && match[3] !== undefined) {
      const href = safeHref(match[3])
      const label = render(match[2], key)
      nodes.push(
        href ? (
          <a
            key={key}
            href={href}
            className="text-accent-text underline underline-offset-2 hover:no-underline"
            {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          >
            {label}
          </a>
        ) : (
          <span key={key}>{label}</span>
        ),
      )
    } else if (match[4] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {render(match[4], key)}
        </strong>,
      )
    } else {
      const emphasis = match[5] ?? match[6]
      if (emphasis !== undefined) nodes.push(<em key={key}>{render(emphasis, key)}</em>)
    }

    last = match.index + match[0].length
  }

  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function InlineMarkdown({ text, idPrefix = 'md' }: { text: string; idPrefix?: string }) {
  return <>{render(text, idPrefix)}</>
}
