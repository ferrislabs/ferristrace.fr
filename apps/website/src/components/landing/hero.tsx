import { useEffect, useRef, useState } from 'react'
import { cn } from '@ferristrace/ui'
import { Check, Copy } from 'lucide-react'
import { GithubMark } from './github-mark'
import { Column } from './frame'
import { TraceCard } from './trace-card'
import { LinkButton } from './ui'
import { links } from './links'

const COMMAND = `docker run -p 8080:8080 -p 4318:4318 ${links.image}`

interface HeroProps {
  /** Star count read at build time. Hidden outright when the fetch failed. */
  stars?: number
  /** Latest release, for the meta line. Falls back to its placeholder. */
  version?: string
}

/** 1200 becomes "1.2k"; anything under a thousand is written out. */
function short(n: number): string {
  return n < 1000 ? String(n) : `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
}

export function Hero({ stars, version }: HeroProps) {
  return (
    <section aria-labelledby="hero-title">
      <Column>
        <div className="flex flex-col items-center gap-6 pb-14 pt-14 text-center md:pt-[104px]">
          <p className="font-mono text-[12.5px] text-faint-foreground">
            Open source · Apache 2.0 ·{' '}
            <a
              href={links.changelog}
              className="rounded-[2px] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {version ? `v${version}` : 'v[X.Y.Z]'}
            </a>
          </p>

          <h1
            id="hero-title"
            className="max-w-[900px] font-display text-[46px] font-semibold leading-[46px] md:text-[80px] md:leading-[80px]"
          >
            Your traces, logs and metrics. On your server.
          </h1>

          <p className="max-w-[600px] text-[19px] leading-[29px] text-muted-foreground">
            Observability for OpenTelemetry in one container. Every log line is linked to its
            trace.
          </p>

          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <LinkButton href={links.docs}>Get started</LinkButton>
            <LinkButton
              variant="outline"
              href={links.github}
              target="_blank"
              rel="noreferrer noopener"
            >
              <GithubMark />
              Star on GitHub
              {stars === undefined ? null : (
                <span className="font-mono text-[12px] font-normal text-faint-foreground">
                  {short(stars)}
                </span>
              )}
            </LinkButton>
          </div>

          <CommandLine />
        </div>

        <div className="pb-[72px]">
          <TraceCard />
        </div>
      </Column>
    </section>
  )
}

/**
 * One line, never wrapped: the command is long and a pill that reflows twice
 * stops reading as something you paste. It ends in an ellipsis and the button
 * copies the whole of it.
 */
function CommandLine() {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timeout.current !== null) window.clearTimeout(timeout.current)
    },
    [],
  )

  async function copy() {
    try {
      await navigator.clipboard.writeText(COMMAND)
    } catch {
      // No clipboard permission: the command stays selectable in the line.
      return
    }
    setCopied(true)
    if (timeout.current !== null) window.clearTimeout(timeout.current)
    timeout.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-4 inline-flex h-[46px] max-w-full items-center gap-3 rounded-[2px] border border-border bg-sidebar pl-4 pr-1.5 text-[12px] md:text-[13.5px]">
      <span aria-hidden="true" className="text-faint-foreground">
        $
      </span>

      {/* min-w-0 is what lets the ellipsis happen: a flex item will not shrink
          below its content width without it, and the content never wraps. */}
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono">
        {COMMAND}
      </span>

      <button
        type="button"
        onClick={copy}
        aria-label="Copy command"
        className={cn(
          'inline-flex size-[34px] shrink-0 items-center justify-center rounded-[2px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          copied && 'text-success-text',
        )}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>

      <span aria-live="polite" className="sr-only">
        {copied ? 'Copied' : ''}
      </span>
    </div>
  )
}
