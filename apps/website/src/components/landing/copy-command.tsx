import { useEffect, useRef, useState } from 'react'
import { Button, Tooltip, TooltipContent, TooltipTrigger, cn } from '@cometrace/ui'
import { Check, Copy } from 'lucide-react'

interface CopyCommandProps {
  /** Lines shown verbatim. A leading "$ " is a prompt and is not copied. */
  lines: string[]
  /** Accessible name of the copy button, e.g. "Copy the docker run command". */
  label: string
  className?: string
}

export function CopyCommand({ lines, label, className }: CopyCommandProps) {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeout.current !== null) window.clearTimeout(timeout.current)
    }
  }, [])

  async function copy() {
    const text = lines.map((line) => line.replace(/^\$ /, '')).join('\n')

    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // No clipboard permission: the command stays selectable in the block.
      return
    }

    setCopied(true)
    if (timeout.current !== null) window.clearTimeout(timeout.current)
    timeout.current = window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('relative min-w-0 rounded-md border border-border bg-card', className)}>
      <pre className="overflow-x-auto px-4 py-3.5 pr-28 font-mono text-[13px] leading-6 text-foreground">
        <code>
          {lines.map((line) => (
            <span key={line} className="block whitespace-pre">
              {line}
            </span>
          ))}
        </code>
      </pre>

      <div className="absolute right-2 top-2 rounded-md bg-card">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copy}
              aria-label={label}
              className={cn('h-8 gap-1.5 px-2 font-semibold', copied && 'text-success-text')}
            >
              {copied ? (
                <>
                  <Check aria-hidden="true" />
                  <span className="text-xs">Copied</span>
                </>
              ) : (
                <Copy aria-hidden="true" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      </div>

      <span aria-live="polite" className="sr-only">
        {copied ? 'Copied' : ''}
      </span>
    </div>
  )
}
