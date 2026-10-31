import { cn } from '@ferristrace/ui'

interface TraceRow {
  name: string
  depth: 0 | 1 | 2 | 3
  left: number
  width: number
  service: 1 | 2 | 3 | 4 | 5 | 6
  error?: boolean
  duration: string
}

const rows: TraceRow[] = [
  { name: 'POST /api/checkout', depth: 0, left: 0, width: 100, service: 1, duration: '1.284 s' },
  { name: 'auth.verify_token', depth: 1, left: 0, width: 2, service: 5, duration: '18 ms' },
  { name: 'checkout.create_order', depth: 1, left: 2, width: 97, service: 2, duration: '1.245 s' },
  { name: 'inventory.reserve', depth: 2, left: 2, width: 14, service: 3, duration: '180 ms' },
  { name: 'payments.charge', depth: 2, left: 17, width: 76, service: 4, error: true, duration: '975 ms' },
  { name: 'POST psp/charge', depth: 3, left: 18, width: 75, service: 4, error: true, duration: '960 ms' },
  { name: 'notifier.enqueue', depth: 2, left: 93, width: 4, service: 6, duration: '45 ms' },
]

/** The faint rule every 20 %, painted rather than placed as seven elements. */
const timeline = {
  backgroundImage: 'linear-gradient(to right, var(--border-subtle) 1px, transparent 1px)',
  backgroundSize: '20% 100%',
}

/** Marks an error without relying on colour: the bar is ringed, the name red. */
const errorRing = '0 0 0 2px var(--card), 0 0 0 3.5px var(--destructive)'

const label =
  'Example trace: POST /api/checkout took 1.284 seconds; payments.charge failed after 960 milliseconds when the payment provider timed out.'

/**
 * Drawn in HTML rather than captured: it stays sharp at any zoom, follows the
 * theme, and costs no image. It reads to assistive tech as one labelled
 * picture, so the rows below are hidden from it.
 */
export function TraceCard() {
  return (
    <div
      role="img"
      aria-label={label}
      className="overflow-hidden rounded-[2px] border border-border bg-card"
    >
      <div
        aria-hidden="true"
        className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 text-sm"
      >
        <span className="rounded-[2px] border border-destructive px-1.5 py-0.5 text-[12px] font-medium text-destructive-text">
          2 errors
        </span>
        <span className="font-semibold">POST /api/checkout</span>
        <span className="font-mono text-[12px] text-faint-foreground">
          4bf92f35&hellip;4736 · 1.284 s
        </span>
        <span className="ml-auto hidden text-faint-foreground md:inline">
          payments.charge: psp timed out after 960 ms
        </span>
      </div>

      {rows.map((row) => (
        <div
          key={row.name}
          aria-hidden="true"
          className="grid h-[34px] grid-cols-[128px_minmax(0,1fr)_0px] items-center border-t border-border-subtle md:grid-cols-[240px_minmax(0,1fr)_90px]"
        >
          <span
            className={cn(
              'truncate font-mono text-[13px]',
              row.error ? 'text-destructive-text' : 'text-muted-foreground',
            )}
            style={{ paddingLeft: `${16 + row.depth * 14}px` }}
          >
            {row.name}
          </span>

          <span className="relative h-[34px]" style={timeline}>
            <span
              className="absolute top-[11px] h-3 min-w-[3px] rounded-[2px]"
              style={{
                left: `${row.left}%`,
                width: `${row.width}%`,
                background: `var(--service-${row.service})`,
                boxShadow: row.error ? errorRing : undefined,
              }}
            />
          </span>

          <span className="hidden pr-4 text-right font-mono text-[12px] text-faint-foreground md:block">
            {row.duration}
          </span>
        </div>
      ))}
    </div>
  )
}
