import { useState } from 'react'
import { cn } from '@cometrace/ui'
import { CircleX, Info, TriangleAlert } from 'lucide-react'

interface Span {
  id: string
  name: string
  service: string
  depth: number
  offset: number
  width: number
  ms: string
  color: string
  error?: boolean
  attributes: Array<[string, string]>
  logs: Array<{ level: 'info' | 'warn' | 'error'; text: string }>
  insight: string
}

const spans: Span[] = [
  {
    id: 'gateway',
    name: 'POST /api/checkout',
    service: 'gateway',
    depth: 0,
    offset: 0,
    width: 100,
    ms: '1.24s',
    color: 'bg-service-1',
    attributes: [
      ['http.status_code', '502'],
      ['user.plan', 'pro'],
      ['k8s.pod.name', 'gateway-5d8f'],
    ],
    logs: [{ level: 'warn', text: 'upstream payments answered 502 after 1.2s' }],
    insight: 'The user waited 1.24 s and got an error. The gateway is only the messenger.',
  },
  {
    id: 'cart',
    name: 'cart.load',
    service: 'cart',
    depth: 1,
    offset: 2,
    width: 14,
    ms: '172ms',
    color: 'bg-service-2',
    attributes: [
      ['cart.items', '3'],
      ['db.system', 'postgresql'],
      ['cache.hit', 'true'],
    ],
    logs: [{ level: 'info', text: 'cart loaded from cache, 3 items' }],
    insight: 'Cache hit in 172 ms. The cart is fine, look elsewhere.',
  },
  {
    id: 'charge',
    name: 'payments.charge',
    service: 'payments',
    depth: 1,
    offset: 18,
    width: 78,
    ms: '960ms',
    color: 'bg-service-3',
    error: true,
    attributes: [
      ['payment.provider', 'psp-eu'],
      ['retry.count', '2'],
      ['deploy.version', 'v2.14'],
    ],
    logs: [
      { level: 'warn', text: 'psp latency 840ms, retrying (1/2)' },
      { level: 'error', text: 'deadline exceeded after 960ms' },
    ],
    insight: 'Payments retried the provider twice, and only since deploy v2.14. Most of the 1.24 s is spent here.',
  },
  {
    id: 'psp',
    name: 'psp.authorize',
    service: 'payments',
    depth: 2,
    offset: 21,
    width: 73,
    ms: '902ms',
    color: 'bg-service-3',
    error: true,
    attributes: [
      ['http.url', 'psp-eu/authorize'],
      ['http.timeout_ms', '300'],
      ['net.peer.region', 'eu-west'],
    ],
    logs: [{ level: 'error', text: 'timeout 300ms exceeded, connection reset' }],
    insight: 'Here is the cause. v2.14 lowered the provider timeout to 300 ms, so every slow answer triggers a retry.',
  },
  {
    id: 'orders',
    name: 'db.insert orders',
    service: 'orders',
    depth: 1,
    offset: 96,
    width: 3,
    ms: '41ms',
    color: 'bg-service-4',
    attributes: [
      ['db.system', 'postgresql'],
      ['db.rows', '0'],
      ['tx.rolled_back', 'true'],
    ],
    logs: [{ level: 'info', text: 'order 9f2c rolled back' }],
    insight: 'The order rolled back cleanly, so there is no data to repair.',
  },
]

const levelIcon = { info: Info, warn: TriangleAlert, error: CircleX }
const levelClass = {
  info: 'text-severity-info-foreground',
  warn: 'text-severity-warn-foreground',
  error: 'text-severity-error-foreground',
}

/**
 * A slow checkout, explorable: pick a span and its attributes, its logs and
 * what it tells you appear next to it. That is the product's main loop.
 */
export function TraceExplorer() {
  const [selectedId, setSelectedId] = useState('charge')
  const selected = spans.find((span) => span.id === selectedId) ?? spans[0]

  return (
    <div className="grid overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between font-mono text-[11px] text-faint-foreground">
          <span>trace 4bf92f35 · 5 spans · 3 services</span>
          <span>0 ─── 1.24s</span>
        </div>
        <ul className="mt-3 space-y-1" aria-label="Spans of the trace">
          {spans.map((span) => {
            const active = span.id === selected.id
            return (
              <li key={span.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(span.id)}
                  className={cn(
                    'flex h-9 w-full items-center gap-3 rounded-md px-2 text-left font-mono text-[12px] transition-colors',
                    active ? 'bg-accent ring-1 ring-primary/40' : 'hover:bg-accent/60',
                  )}
                >
                  <span
                    className={cn(
                      'w-36 shrink-0 truncate sm:w-44',
                      span.error ? 'text-destructive' : 'text-foreground',
                    )}
                    style={{ paddingLeft: `${span.depth * 12}px` }}
                  >
                    {span.name}
                  </span>
                  <span className="relative h-3 flex-1">
                    <span
                      className={cn(
                        'absolute inset-y-0 rounded-sm transition-opacity',
                        span.color,
                        !active && 'opacity-70',
                        span.error && 'outline-1 outline-offset-1 outline-destructive',
                      )}
                      style={{ left: `${span.offset}%`, width: `${span.width}%` }}
                    />
                  </span>
                  <span className="w-12 shrink-0 text-right text-faint-foreground">{span.ms}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div
        key={selected.id}
        aria-live="polite"
        className="problem-panel border-t border-border bg-section-alt p-5 lg:border-l lg:border-t-0"
      >
        <p className="font-mono text-[11px] text-faint-foreground">{selected.service}</p>
        <h3 className="mt-0.5 font-mono text-sm font-semibold">{selected.name}</h3>

        <dl className="mt-4 space-y-1.5 font-mono text-[12px]">
          {selected.attributes.map(([key, value]) => (
            <div key={key} className="flex gap-3">
              <dt className="w-32 shrink-0 text-faint-foreground">{key}</dt>
              <dd className="truncate">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-faint-foreground">
          Logs of this span
        </p>
        <ul className="mt-2 space-y-1.5">
          {selected.logs.map((log) => {
            const Icon = levelIcon[log.level]
            return (
              <li key={log.text} className="flex items-start gap-2 font-mono text-[12px]">
                <Icon className={cn('mt-0.5 size-3.5 shrink-0', levelClass[log.level])} aria-hidden="true" />
                <span className="text-muted-foreground">{log.text}</span>
              </li>
            )
          })}
        </ul>

        <p className="mt-5 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm leading-6">
          {selected.insight}
        </p>
      </div>
    </div>
  )
}
