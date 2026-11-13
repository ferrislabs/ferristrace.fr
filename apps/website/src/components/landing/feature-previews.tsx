import { cn } from '@cometrace/ui'
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react'

/**
 * Small, static mock-ups of the product. They are drawn in the page's own
 * tokens so they follow the theme, and are hidden from assistive tech: the
 * text next to them carries the meaning.
 */

const traceRows = [
  {
    name: 'GET /api/checkout',
    service: 'gateway',
    offset: 0,
    width: 100,
    color: 'bg-service-1',
    ms: '1.24s',
  },
  { name: 'cart.load', service: 'cart', offset: 3, width: 14, color: 'bg-service-2', ms: '172ms' },
  {
    name: 'payments.charge',
    service: 'payments',
    offset: 19,
    width: 76,
    color: 'bg-service-3',
    ms: '960ms',
    error: true,
  },
  {
    name: 'psp.authorize',
    service: 'payments',
    offset: 22,
    width: 71,
    color: 'bg-service-3',
    ms: '902ms',
    error: true,
  },
  {
    name: 'db.query orders',
    service: 'orders',
    offset: 95,
    width: 4,
    color: 'bg-service-4',
    ms: '41ms',
  },
]

export function TracePreview({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('font-mono text-[11px]', className)}>
      {traceRows.map((row, i) => (
        <div
          key={row.name}
          className="flex h-7 items-center gap-3 border-b border-border/60 last:border-0"
        >
          <span
            className={cn(
              'w-40 shrink-0 truncate',
              row.error ? 'text-destructive' : 'text-foreground',
            )}
            style={{ paddingLeft: `${Math.min(i, 3) * 10}px` }}
          >
            {row.name}
          </span>
          <div className="relative h-4 flex-1">
            <div
              className={cn(
                'absolute top-1/2 h-2.5 -translate-y-1/2',
                row.color,
                row.error && 'outline-1 outline-offset-1 outline-destructive',
              )}
              style={{ left: `${row.offset}%`, width: `${row.width}%` }}
            />
          </div>
          <span className="w-12 shrink-0 text-right text-faint-foreground">{row.ms}</span>
        </div>
      ))}
    </div>
  )
}

const logLines = [
  { time: '14:32:06.912', level: 'info', text: 'cart.load ok items=3' },
  { time: '14:32:07.104', level: 'warn', text: 'psp latency 840ms, retrying' },
  { time: '14:32:08.064', level: 'error', text: 'payments.charge: deadline exceeded', trace: true },
  { time: '14:32:08.070', level: 'info', text: 'order 9f2c rolled back' },
  { time: '14:32:09.331', level: 'error', text: 'payments.charge: deadline exceeded', trace: true },
]

const levelColor: Record<string, string> = {
  info: 'text-severity-info-foreground',
  warn: 'text-severity-warn-foreground',
  error: 'text-severity-error-foreground',
}

export function LogsPreview({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('space-y-1 font-mono text-[11px]', className)}>
      {logLines.map((line) => (
        <div
          key={line.time}
          className={cn(
            'flex items-center gap-2.5 px-2 py-1',
            line.level === 'error' && 'bg-severity-error-background',
          )}
        >
          <span className="shrink-0 text-faint-foreground">{line.time}</span>
          <span className={cn('w-10 shrink-0 uppercase', levelColor[line.level])}>
            {line.level}
          </span>
          <span className="truncate text-muted-foreground">{line.text}</span>
          {line.trace ? <span className="ml-auto shrink-0 text-primary">trace →</span> : null}
        </div>
      ))}
    </div>
  )
}

const pods = [
  'ok',
  'ok',
  'ok',
  'ok',
  'ok',
  'ok',
  'ok',
  'ok',
  'warn',
  'ok',
  'ok',
  'ok',
  'ok',
  'ok',
  'ok',
  'ok',
  'crash',
  'ok',
] as const

export function InfraPreview({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between font-pixel text-[10px] uppercase tracking-[0.08em] text-faint-foreground">
        <span>cluster prod-eu · 3 nodes</span>
        <span>18 pods</span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {pods.map((state, i) => (
          <span
            key={i}
            className={cn(
              'h-5',
              state === 'ok' && 'bg-success-text/25',
              state === 'warn' && 'bg-severity-warn-foreground/50',
              state === 'crash' && 'animate-pulse bg-destructive',
            )}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 border border-severity-error-border bg-severity-error-background px-2 py-1.5 font-mono text-[11px] text-severity-error-foreground">
        <span className="size-1.5 shrink-0 bg-destructive" />
        <span className="truncate">checkout-7f9c · CrashLoopBackOff · deploy v2.14</span>
      </div>
    </div>
  )
}

export function IncidentPreview({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('border border-border bg-background p-4', className)}>
      <div className="flex items-center gap-2 font-pixel text-[10px] uppercase tracking-[0.08em] text-faint-foreground">
        <span>INC-482</span>
        <span>·</span>
        <span>14:32:07</span>
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <span className="bg-destructive px-1.5 py-0.5 font-pixel text-[10px] uppercase tracking-[0.08em] text-white">
          Firing
        </span>
        <span className="truncate text-[13px] font-medium">Checkout p99 above 1s</span>
      </div>
      <dl className="mt-3 space-y-1 font-mono text-[11px]">
        <div className="flex gap-2">
          <dt className="w-16 text-faint-foreground">severity</dt>
          <dd>SEV-2</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 text-faint-foreground">on-call</dt>
          <dd>@marie</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 text-faint-foreground">evidence</dt>
          <dd>1 trace · 42 logs · 2 metrics</dd>
        </div>
      </dl>
      <span className="mt-3 inline-flex items-center gap-1 border border-border px-2 py-1 font-pixel text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        Open timeline <ArrowRight className="size-3" />
      </span>
    </div>
  )
}

const llmCalls = [
  { model: 'gpt-5 · chat', tokens: '12.4k', cost: '$0.31', width: 92, color: 'bg-service-1' },
  { model: 'claude · triage', tokens: '8.1k', cost: '$0.12', width: 61, color: 'bg-service-2' },
  { model: 'embed · search', tokens: '2.0k', cost: '$0.01', width: 22, color: 'bg-service-3' },
]

export function AiPreview({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('space-y-2.5 font-mono text-[11px]', className)}>
      {llmCalls.map((call) => (
        <div key={call.model}>
          <div className="flex items-center justify-between text-faint-foreground">
            <span className="text-foreground">{call.model}</span>
            <span>
              {call.tokens} tok · {call.cost}
            </span>
          </div>
          <div className="mt-1 h-1.5 bg-muted">
            <div className={cn('h-full', call.color)} style={{ width: `${call.width}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MetricsPreview({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('font-mono text-[11px]', className)}>
      <div className="flex items-center justify-between text-faint-foreground">
        <span>http.server.duration p99</span>
        <span className="text-destructive">1.24s</span>
      </div>
      <svg
        viewBox="0 0 200 60"
        fill="none"
        preserveAspectRatio="none"
        className="mt-2 h-20 w-full text-primary"
      >
        <line
          x1="0"
          y1="22"
          x2="200"
          y2="22"
          stroke="currentColor"
          strokeOpacity={0.3}
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points="0,50 15,48 30,51 45,46 60,49 75,45 90,47 105,44 120,46 135,40 150,30 160,12 170,8 185,10 200,9"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

export function AgentPreview({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('border border-border bg-background p-4 font-mono text-[11px]', className)}
    >
      <div className="flex items-center gap-2 text-[13px] font-medium">
        <KeyRound className="size-3.5 text-primary" />
        triage-agent
        <span className="ml-auto inline-flex items-center gap-1 bg-success-text/10 px-2 py-0.5 font-pixel text-[10px] uppercase tracking-[0.08em] text-success-text">
          <ShieldCheck className="size-3" />
          FerrisKey
        </span>
      </div>
      <dl className="mt-3 space-y-1">
        <div className="flex gap-2">
          <dt className="w-14 text-faint-foreground">scope</dt>
          <dd>project:checkout · read</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-14 text-faint-foreground">expires</dt>
          <dd>in 12h</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-14 text-faint-foreground">audit</dt>
          <dd>14 reads · 1 incident note</dd>
        </div>
      </dl>
    </div>
  )
}
