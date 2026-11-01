import { useState } from 'react'
import { cn } from '@cometrace/ui'
import { ArrowDown, ArrowUp, GitCompareArrows } from 'lucide-react'

interface Metric {
  label: string
  unit: string
  before: number
  after: number
  /** Whether a higher value is better. Cost and latency are not. */
  higherIsBetter?: boolean
}

interface Release {
  id: string
  feature: string
  change: string
  from: string
  to: string
  metrics: Metric[]
  verdict: string
  good: boolean
}

const releases: Release[] = [
  {
    id: 'support',
    feature: 'support-bot',
    change: 'Longer system prompt',
    from: 'prompt v12',
    to: 'prompt v13',
    metrics: [
      { label: 'cost / 1k requests', unit: '$', before: 4.1, after: 6.9 },
      { label: 'input tokens', unit: '', before: 2400, after: 4300 },
      { label: 'p95 latency', unit: 's', before: 2.1, after: 2.3 },
      { label: 'thumbs up', unit: '%', before: 81, after: 82, higherIsBetter: true },
    ],
    verdict: 'v13 costs 68 % more and buys one point of satisfaction. The extra 1,900 tokens come from the new examples block, so trim that before rolling out.',
    good: false,
  },
  {
    id: 'summary',
    feature: 'ticket-summary',
    change: 'Smaller model',
    from: 'large · chat',
    to: 'small · chat',
    metrics: [
      { label: 'cost / 1k requests', unit: '$', before: 3.2, after: 0.6 },
      { label: 'input tokens', unit: '', before: 1800, after: 1800 },
      { label: 'p95 latency', unit: 's', before: 3.4, after: 1.1 },
      { label: 'thumbs up', unit: '%', before: 77, after: 76, higherIsBetter: true },
    ],
    verdict: 'About five times cheaper and three times faster, for one point less satisfaction. Ship it.',
    good: true,
  },
  {
    id: 'search',
    feature: 'search-answer',
    change: 'Retrieval top-k 5 → 20',
    from: 'top-k 5',
    to: 'top-k 20',
    metrics: [
      { label: 'cost / 1k requests', unit: '$', before: 2.5, after: 5.8 },
      { label: 'input tokens', unit: '', before: 3100, after: 9800 },
      { label: 'p95 latency', unit: 's', before: 1.9, after: 4.6 },
      { label: 'thumbs up', unit: '%', before: 70, after: 71, higherIsBetter: true },
    ],
    verdict: 'Four times the chunks bought one point of satisfaction and more than doubled p95. The retrieval span shows most of them are near-duplicates.',
    good: false,
  },
]

function format(value: number, unit: string) {
  if (unit === '$') return `$${value.toFixed(2)}`
  if (unit === 's') return `${value.toFixed(1)} s`
  if (unit === '%') return `${value} %`
  return value.toLocaleString('en-US')
}

/**
 * Before and after a change to an AI feature: a new prompt, a smaller model,
 * more retrieval. The numbers come from the spans of real requests, so the
 * comparison is one click, not a spreadsheet.
 */
export function ReleaseCompare() {
  const [releaseId, setReleaseId] = useState(releases[0].id)
  const release = releases.find((r) => r.id === releaseId)!

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-3" role="group" aria-label="Pick a change">
        {releases.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-pressed={r.id === release.id}
            onClick={() => setReleaseId(r.id)}
            className={cn(
              'rounded-md px-3 py-1.5 text-left transition-colors',
              r.id === release.id ? 'bg-primary/10 ring-1 ring-primary/40' : 'hover:bg-accent',
            )}
          >
            <span className="block font-mono text-[11px] text-faint-foreground">{r.feature}</span>
            <span className="block text-[13px] font-semibold">{r.change}</span>
          </button>
        ))}
      </div>

      <div key={release.id} className="problem-panel p-5">
        <p className="flex flex-wrap items-center gap-2 font-mono text-[12px]">
          <GitCompareArrows className="size-3.5 text-faint-foreground" aria-hidden="true" />
          <span className="rounded border border-border bg-section-alt px-1.5 py-0.5">{release.from}</span>
          <span className="text-faint-foreground">→</span>
          <span className="rounded border border-primary/40 bg-primary/5 px-1.5 py-0.5">{release.to}</span>
          <span className="text-faint-foreground">· last 24 h, 18k requests each</span>
        </p>

        <table className="mt-5 w-full text-[13px]">
          <thead>
            <tr className="text-left font-mono text-[11px] text-faint-foreground">
              <th scope="col" className="pb-2 font-normal">
                metric
              </th>
              <th scope="col" className="pb-2 font-normal">
                {release.from} vs {release.to}
              </th>
              <th scope="col" className="pb-2 text-right font-normal">
                change
              </th>
            </tr>
          </thead>
          <tbody>
            {release.metrics.map((m) => {
              const max = Math.max(m.before, m.after) || 1
              const delta = ((m.after - m.before) / m.before) * 100
              const worse = m.higherIsBetter ? delta < -2 : delta > 2
              const better = m.higherIsBetter ? delta > 2 : delta < -2
              return (
                <tr key={m.label} className="border-t border-border">
                  <th scope="row" className="w-[28%] py-2.5 pr-3 text-left font-mono text-[12px] font-normal">
                    {m.label}
                  </th>
                  <td className="py-2.5">
                    <Bar value={m.before} max={max} label={format(m.before, m.unit)} muted />
                    <Bar value={m.after} max={max} label={format(m.after, m.unit)} />
                  </td>
                  <td
                    className={cn(
                      'w-20 py-2.5 text-right font-mono text-[12px]',
                      worse && 'text-destructive',
                      better && 'text-success-text',
                      !worse && !better && 'text-muted-foreground',
                    )}
                  >
                    <span className="inline-flex items-center gap-0.5">
                      {Math.abs(delta) < 1 ? null : delta > 0 ? (
                        <ArrowUp className="size-3" aria-hidden="true" />
                      ) : (
                        <ArrowDown className="size-3" aria-hidden="true" />
                      )}
                      {Math.abs(delta) < 1 ? '=' : `${Math.abs(Math.round(delta))} %`}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <p
          aria-live="polite"
          className={cn(
            'mt-5 rounded-md border p-3 text-sm leading-6',
            release.good ? 'border-success-text/30 bg-success-text/10' : 'border-primary/30 bg-primary/5',
          )}
        >
          {release.verdict}
        </p>
      </div>
    </div>
  )
}

function Bar({ value, max, label, muted }: { value: number; max: number; label: string; muted?: boolean }) {
  return (
    <span className="flex items-center gap-2 py-0.5">
      <span className="h-1.5 flex-1 rounded-full bg-muted">
        <span
          className={cn('ai-bar block h-full rounded-full', muted ? 'bg-faint-foreground/50' : 'bg-primary')}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </span>
      <span className={cn('w-16 font-mono text-[11px]', muted && 'text-muted-foreground')}>{label}</span>
    </span>
  )
}
