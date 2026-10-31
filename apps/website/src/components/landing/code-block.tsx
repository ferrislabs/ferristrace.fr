import { useEffect, useRef, useState } from 'react'
import { cn } from '@ferristrace/ui'
import { Check, Copy } from 'lucide-react'

/**
 * A command the reader is meant to run. It wraps rather than scrolling
 * sideways, so nothing is hidden at 360 px, and the copy button appears on
 * hover and on keyboard focus.
 */
export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<number | null>(null)

  useEffect(() => () => {
    if (timeout.current !== null) window.clearTimeout(timeout.current)
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // No clipboard permission: the text stays selectable in the block.
      return
    }
    setCopied(true)
    if (timeout.current !== null) window.clearTimeout(timeout.current)
    timeout.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('group relative rounded-[2px] bg-muted', className)}>
      {/* Wraps on spaces at any width, and only breaks inside a token when
          the token itself is wider than the block — which is what keeps a
          long image name readable instead of split after two letters. */}
      <pre className="overflow-hidden whitespace-pre-wrap [overflow-wrap:break-word] px-[14px] py-3 pr-11 font-mono text-[12px] leading-5 text-foreground">
        <code>{code}</code>
      </pre>

      <button
        type="button"
        onClick={copy}
        aria-label="Copy command"
        className={cn(
          'absolute right-1.5 top-1.5 inline-flex size-7 items-center justify-center rounded-[2px] text-muted-foreground opacity-0 transition hover:bg-background hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100',
          copied && 'text-success-text opacity-100',
        )}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>

      <span aria-live="polite" className="sr-only">
        {copied ? 'Copied' : ''}
      </span>
    </div>
  )
}
