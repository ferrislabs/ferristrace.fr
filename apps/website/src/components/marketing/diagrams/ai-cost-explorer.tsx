import { useState } from 'react'
import { cn } from '@cometrace/ui'

interface Row {
  label: string
  cost: number
  tokens: string
  p95: string
  /** Shown when the bar is picked: what the visitor learns from it. */
  finding: string
  spike?: boolean
}

const views = {
  feature: {
    label: 'Feature',
    rows: [
      {
        label: 'support-chat',
        cost: 412,
        tokens: '18.2M',
        p95: '2.1s',
        finding:
          'More than half the spend. Long conversations resend the whole history on every turn.',
      },
      {
        label: 'ticket-summary',
        cost: 268,
        tokens: '9.4M',
        p95: '4.8s',
        spike: true,
        finding: 'Doubled on Tuesday: a prompt change added 6k tokens of examples to every call.',
      },
      {
        label: 'semantic-search',
        cost: 54,
        tokens: '31.0M',
        p95: '0.3s',
        finding: 'Lots of tokens, small bill. Embeddings are cheap, so leave this one alone.',
      },
      {
        label: 'release-notes',
        cost: 21,
        tokens: '0.6M',
        p95: '6.2s',
        finding: 'Slow, but it only runs once per deploy.',
      },
    ],
  },
  model: {
    label: 'Model',
    rows: [
      {
        label: 'large · chat',
        cost: 586,
        tokens: '21.0M',
        p95: '3.9s',
        spike: true,
        finding:
          'The large model writes summaries that the small one handled just as well in tests.',
      },
      {
        label: 'small · chat',
        cost: 115,
        tokens: '6.6M',
        p95: '1.2s',
        finding: 'Cheap and fast. A good place to move the summary feature.',
      },
      {
        label: 'embed · v3',
        cost: 54,
        tokens: '31.0M',
        p95: '0.3s',
        finding: 'Search embeddings. The cost has been flat for weeks.',
      },
    ],
  },
  customer: {
    label: 'Customer',
    rows: [
      {
        label: 'acme-corp',
        cost: 301,
        tokens: '12.8M',
        p95: '2.6s',
        spike: true,
        finding: 'One integration calls the summary endpoint in a loop. Worth a rate limit.',
      },
      {
        label: 'globex',
        cost: 188,
        tokens: '8.1M',
        p95: '2.2s',
        finding: 'About what you would expect for its plan.',
      },
      {
        label: 'initech',
        cost: 142,
        tokens: '19.7M',
        p95: '1.1s',
        finding: 'Mostly search traffic. Plenty of tokens, not much money.',
      },
      {
        label: 'others (214)',
        cost: 124,
        tokens: '18.6M',
        p95: '2.0s',
        finding: '214 smaller customers, none of them doing anything odd.',
      },
    ],
  },
} satisfies Record<string, { label: string; rows: Row[] }>

type ViewKey = keyof typeof views

/**
 * Where the AI bill comes from, sliced three ways. Picking a bar explains it:
 * the point is the finding, not the chart.
 */
export function AiCostExplorer() {
  const [view, setView] = useState<ViewKey>('feature')
  const [picked, setPicked] = useState(1)
  const rows: Row[] = views[view].rows
  const max = Math.max(...rows.map((r) => r.cost))
  const selected = rows[Math.min(picked, rows.length - 1)]
  const total = rows.reduce((sum, r) => sum + r.cost, 0)

  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <p className="font-mono text-[12px] text-muted-foreground">
          LLM spend · last 7 days · <span className="text-foreground">${total}</span>
        </p>
        <div
          className="flex items-center gap-1 border border-border p-0.5"
          role="group"
          aria-label="Group spend by"
        >
          {(Object.keys(views) as ViewKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => {
                setView(key)
                setPicked(views[key].rows.findIndex((r: Row) => r.spike))
              }}
              className={cn(
                'px-2.5 py-1 text-xs font-medium transition-colors',
                view === key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent',
              )}
            >
              By {views[key].label.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <ul className="space-y-2 p-5" aria-label={`Spend by ${views[view].label.toLowerCase()}`}>
          {rows.map((row, i) => (
            <li key={`${view}-${row.label}`}>
              <button
                type="button"
                aria-pressed={i === picked}
                onClick={() => setPicked(i)}
                className={cn(
                  'w-full p-2 text-left transition-colors',
                  i === picked ? 'bg-accent ring-1 ring-primary/40' : 'hover:bg-accent/60',
                )}
              >
                <span className="flex items-center justify-between font-mono text-[12px]">
                  <span className="flex items-center gap-2">
                    {row.label}
                    {row.spike ? (
                      <span className="bg-severity-error-background px-1.5 text-[10px] text-severity-error-foreground">
                        spike
                      </span>
                    ) : null}
                  </span>
                  <span className="text-muted-foreground">${row.cost}</span>
                </span>
                <span className="mt-1.5 block h-2 bg-muted">
                  <span
                    className={cn(
                      'ai-bar block h-full',
                      row.spike ? 'bg-destructive' : 'bg-primary',
                    )}
                    style={{ width: `${(row.cost / max) * 100}%` }}
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div
          key={`${view}-${selected.label}`}
          aria-live="polite"
          className="problem-panel border-t border-border bg-surface-tint p-5 lg:border-l lg:border-t-0"
        >
          <h3 className="font-mono text-sm font-semibold">{selected.label}</h3>
          <dl className="mt-4 grid grid-cols-3 gap-2 font-mono text-[12px]">
            <div className="border border-border bg-card p-2">
              <dt className="text-[10px] text-faint-foreground">cost</dt>
              <dd>${selected.cost}</dd>
            </div>
            <div className="border border-border bg-card p-2">
              <dt className="text-[10px] text-faint-foreground">tokens</dt>
              <dd>{selected.tokens}</dd>
            </div>
            <div className="border border-border bg-card p-2">
              <dt className="text-[10px] text-faint-foreground">p95</dt>
              <dd>{selected.p95}</dd>
            </div>
          </dl>
          <p className="mt-5 border border-primary/30 bg-primary/5 p-3 text-sm leading-6">
            {selected.finding}
          </p>
        </div>
      </div>
    </div>
  )
}
