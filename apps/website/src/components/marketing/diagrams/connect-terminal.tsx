import { useEffect, useState } from 'react'
import { cn } from '@cometrace/ui'
import { Play, RotateCcw } from 'lucide-react'

const env = [
  'export OTEL_EXPORTER_OTLP_ENDPOINT=https://your-server:4318',
  'export OTEL_EXPORTER_OTLP_HEADERS="authorization=Bearer cmt_ik_…"',
  'export OTEL_SERVICE_NAME=checkout',
]

type Signal = [kind: 'trace' | 'log' | 'metric', text: string]

interface Stack {
  id: string
  label: string
  lines: string[]
  signals: Signal[]
}

const stacks: Stack[] = [
  {
    id: 'node',
    label: 'Node.js',
    lines: [
      'npm install @opentelemetry/auto-instrumentations-node',
      ...env,
      'node --require @opentelemetry/auto-instrumentations-node/register app.js',
    ],
    signals: [
      ['trace', 'POST /api/checkout · 182 ms · 9 spans'],
      ['trace', 'pg.query SELECT orders · 41 ms'],
      ['log', 'info  order created  trace_id=4bf9…'],
      ['trace', 'GET /api/cart · 23 ms · 4 spans'],
    ],
  },
  {
    id: 'python',
    label: 'Python',
    lines: [
      'pip install opentelemetry-distro opentelemetry-exporter-otlp',
      'opentelemetry-bootstrap -a install',
      ...env,
      'export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf',
      'opentelemetry-instrument python app.py',
    ],
    signals: [
      ['trace', 'POST /checkout · 204 ms · 7 spans'],
      ['log', 'warning  retrying payment  trace_id=a01c…'],
      ['trace', 'redis GET cart:4471 · 2 ms'],
      ['trace', 'GET /health · 1 ms'],
    ],
  },
  {
    id: 'java',
    label: 'Java',
    lines: [
      'curl -LO https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar',
      ...env,
      'java -javaagent:opentelemetry-javaagent.jar -jar app.jar',
    ],
    signals: [
      ['trace', 'POST /checkout · 231 ms · 12 spans'],
      ['metric', 'jvm.memory.used · 412 MiB'],
      ['trace', 'JDBC SELECT orders · 38 ms'],
      ['metric', 'http.server.request.duration · p95 240 ms'],
    ],
  },
  {
    id: 'collector',
    label: 'Collector',
    lines: [
      'exporters:',
      '  otlphttp/ferristrace:',
      '    endpoint: https://your-server:4318',
      '    headers:',
      '      authorization: Bearer cmt_ik_…',
      'service:',
      '  pipelines:',
      '    traces:  { exporters: [otlphttp/ferristrace] }',
      '    logs:    { exporters: [otlphttp/ferristrace] }',
      '    metrics: { exporters: [otlphttp/ferristrace] }',
    ],
    signals: [
      ['metric', 'k8s.pod.cpu.usage · checkout-7f9c · 0.4 cores'],
      ['log', 'error  OOMKilled  pod=search-2c1d'],
      ['trace', 'POST /api/checkout · 182 ms · 9 spans'],
      ['metric', 'k8s.node.memory.available · node-b · 1.2 GiB'],
    ],
  },
]

const kindStyle = {
  trace: 'bg-primary/10 text-primary',
  log: 'bg-severity-warn-background text-severity-warn-foreground',
  metric: 'bg-success-text/10 text-success-text',
} as const

const ARRIVE_MS = 450

/**
 * The real setup for each stack, then what shows up in FerrisTrace once it
 * runs. No FerrisTrace SDK: these are the stock OpenTelemetry commands.
 */
export function ConnectTerminal() {
  const [stackId, setStackId] = useState(stacks[0].id)
  const [arrived, setArrived] = useState(0)
  const [running, setRunning] = useState(false)
  const stack = stacks.find((s) => s.id === stackId)!

  useEffect(() => {
    if (!running) return
    if (arrived >= stack.signals.length) {
      setRunning(false)
      return
    }
    const t = window.setTimeout(() => setArrived((n) => n + 1), arrived === 0 ? 700 : ARRIVE_MS)
    return () => window.clearTimeout(t)
  }, [running, arrived, stack.signals.length])

  const pick = (id: string) => {
    setStackId(id)
    setArrived(0)
    setRunning(false)
  }

  const run = () => {
    setArrived(0)
    setRunning(true)
  }

  const done = arrived === stack.signals.length

  return (
    <div className="overflow-hidden border border-border bg-card">
      <div
        className="flex flex-wrap items-center gap-1 border-b border-border p-2"
        role="group"
        aria-label="Your stack"
      >
        {stacks.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={s.id === stack.id}
            onClick={() => pick(s.id)}
            className={cn(
              'px-3 py-1.5 text-[13px] font-medium transition-colors',
              s.id === stack.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex min-w-0 flex-col bg-surface-tint p-4">
          <pre
            key={stack.id}
            className="problem-panel min-w-0 flex-1 overflow-x-auto font-mono text-[12px] leading-6"
          >
            {stack.lines.map((line) => (
              <div key={line} className="whitespace-pre">
                {stack.id === 'collector' ? null : (
                  <span className="select-none text-faint-foreground">$ </span>
                )}
                {line}
              </div>
            ))}
          </pre>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="inline-flex items-center gap-1.5 bg-primary px-3 py-1.5 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {done ? (
                <RotateCcw className="size-3.5" aria-hidden="true" />
              ) : (
                <Play className="size-3.5" aria-hidden="true" />
              )}
              {done ? 'Run again' : running ? 'Starting…' : 'Run it'}
            </button>
            <span className="text-[12px] text-muted-foreground">
              Stock OpenTelemetry. Your code stays as it is.
            </span>
          </div>
        </div>

        <div className="border-t border-border p-4 lg:border-l lg:border-t-0">
          <p className="flex items-center justify-between font-mono text-[11px] text-faint-foreground">
            <span>FerrisTrace · live</span>
            <span className={cn('flex items-center gap-1.5', arrived > 0 && 'text-success-text')}>
              <span
                className={cn(
                  'size-1.5',
                  arrived > 0 ? 'animate-pulse bg-success-text' : 'bg-faint-foreground/50',
                )}
              />
              {arrived > 0 ? 'receiving' : 'waiting for data'}
            </span>
          </p>
          <ul className="mt-3 space-y-1.5" aria-live="polite">
            {stack.signals.slice(0, arrived).map(([kind, text]) => (
              <li
                key={text}
                className="problem-step flex items-center gap-2 border border-border px-2 py-1.5 font-mono text-[11px]"
              >
                <span className={cn('w-12 shrink-0 px-1 text-center text-[10px]', kindStyle[kind])}>
                  {kind}
                </span>
                <span className="truncate">{text}</span>
              </li>
            ))}
          </ul>
          {arrived === 0 ? (
            <p className="mt-6 text-center text-[13px] text-muted-foreground">
              Press &quot;Run it&quot; to start the service.
            </p>
          ) : null}
          {done ? (
            <p className="problem-step mt-4 border border-primary/30 bg-primary/5 p-3 text-sm leading-6">
              That took under a minute. The traces, logs and metrics arrive already linked by trace
              id.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
