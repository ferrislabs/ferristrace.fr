import { useState } from 'react'
import { cn } from '@cometrace/ui'
import { Server } from 'lucide-react'

type PodState = 'running' | 'pending' | 'crash'

interface Pod {
  id: string
  service: string
  version: string
  state: PodState
  restarts: number
  cpu: number
  memory: number
  note: string
}

const pod = (
  id: string,
  service: string,
  version: string,
  state: PodState = 'running',
  restarts = 0,
  cpu = 22,
  memory = 38,
  note = 'Serving traffic, with no error spans in the last hour.',
): Pod => ({ id, service, version, state, restarts, cpu, memory, note })

const nodes: Array<{ name: string; pods: Pod[] }> = [
  {
    name: 'node-a',
    pods: [
      pod('gateway-5d8f', 'gateway', 'v1.9'),
      pod('cart-77c1', 'cart', 'v3.2', 'running', 0, 31, 44),
      pod(
        'checkout-7f9c',
        'checkout',
        'v2.14',
        'crash',
        14,
        96,
        91,
        'In CrashLoopBackOff since deploy v2.14. It runs out of memory at boot and has restarted 14 times. The last trace shows the config loader allocating 1.8 GiB.',
      ),
      pod('search-1a2b', 'search', 'v5.0', 'running', 0, 48, 52),
    ],
  },
  {
    name: 'node-b',
    pods: [
      pod('gateway-9a3e', 'gateway', 'v1.9'),
      pod(
        'checkout-2b4d',
        'checkout',
        'v2.14',
        'pending',
        3,
        12,
        20,
        'Stuck in Pending, waiting for memory on node-b. It runs v2.14, like the pod that keeps crashing.',
      ),
      pod('orders-6c0f', 'orders', 'v4.1', 'running', 0, 18, 29),
      pod('payments-3e8a', 'payments', 'v7.3', 'running', 0, 40, 47),
    ],
  },
  {
    name: 'node-c',
    pods: [
      pod(
        'checkout-c41e',
        'checkout',
        'v2.13',
        'running',
        0,
        27,
        35,
        'Still on v2.13 and healthy. Next to the v2.14 pods, it makes the new deploy look guilty.',
      ),
      pod('cart-0d9b', 'cart', 'v3.2'),
      pod('payments-f71c', 'payments', 'v7.3', 'running', 0, 36, 41),
      pod('notifier-8e2a', 'notifier', 'v1.0', 'running', 0, 9, 14),
    ],
  },
]

const stateStyle: Record<PodState, string> = {
  running: 'border-success-text/30 bg-success-text/10',
  pending: 'border-severity-warn-border bg-severity-warn-background',
  crash: 'border-severity-error-border bg-severity-error-background',
}

const stateDot: Record<PodState, string> = {
  running: 'bg-success-text',
  pending: 'bg-severity-warn-foreground',
  crash: 'bg-destructive animate-pulse',
}

const deploys = ['all', 'v2.14', 'v2.13'] as const

/**
 * A small cluster: pick a pod to see what it runs and why it is unhealthy,
 * or filter by deploy to see which version a problem follows.
 */
export function ClusterMap() {
  const [selectedId, setSelectedId] = useState('checkout-7f9c')
  const [deploy, setDeploy] = useState<(typeof deploys)[number]>('all')
  const selected = nodes.flatMap((n) => n.pods).find((p) => p.id === selectedId)!

  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <p className="font-mono text-[12px] text-muted-foreground">
          cluster prod-eu · 3 nodes · 12 pods
        </p>
        <div
          className="flex items-center gap-1 border border-border p-0.5"
          role="group"
          aria-label="Highlight a checkout deploy"
        >
          {deploys.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={deploy === d}
              onClick={() => setDeploy(d)}
              className={cn(
                'px-2.5 py-1 font-mono text-[11px] transition-colors',
                deploy === d
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent',
              )}
            >
              {d === 'all' ? 'all deploys' : `checkout ${d}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {nodes.map((node) => (
            <div key={node.name} className="border border-dashed border-border p-3">
              <p className="flex items-center gap-1.5 font-mono text-[11px] text-faint-foreground">
                <Server className="size-3" aria-hidden="true" />
                {node.name}
              </p>
              <ul className="mt-2 space-y-1.5">
                {node.pods.map((p) => {
                  const dimmed =
                    deploy !== 'all' && !(p.service === 'checkout' && p.version === deploy)
                  const active = p.id === selected.id
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelectedId(p.id)}
                        className={cn(
                          'flex w-full items-center gap-2 border px-2 py-1.5 text-left font-mono text-[11px] transition-all',
                          stateStyle[p.state],
                          active && 'ring-2 ring-primary',
                          dimmed && 'opacity-30',
                        )}
                      >
                        <span className={cn('size-1.5 shrink-0', stateDot[p.state])} />
                        <span className="truncate">{p.id}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div
          key={selected.id}
          aria-live="polite"
          className="problem-panel border-t border-border bg-surface-tint p-5 lg:border-l lg:border-t-0"
        >
          <p className="font-mono text-[11px] text-faint-foreground">
            {selected.service} · {selected.version}
          </p>
          <h3 className="mt-0.5 font-mono text-sm font-semibold">{selected.id}</h3>
          <dl className="mt-4 grid grid-cols-3 gap-2 font-mono text-[12px]">
            <Stat label="status" value={selected.state} danger={selected.state !== 'running'} />
            <Stat
              label="restarts"
              value={String(selected.restarts)}
              danger={selected.restarts > 0}
            />
            <Stat label="memory" value={`${selected.memory}%`} danger={selected.memory > 85} />
          </dl>
          <div className="mt-4 space-y-2">
            <Meter label="cpu" value={selected.cpu} />
            <Meter label="memory" value={selected.memory} />
          </div>
          <p className="mt-5 border border-primary/30 bg-primary/5 p-3 text-sm leading-6">
            {selected.note}
          </p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="border border-border bg-card p-2">
      <dt className="text-[10px] text-faint-foreground">{label}</dt>
      <dd className={cn('mt-0.5', danger && 'text-destructive')}>{value}</dd>
    </div>
  )
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px]">
      <span className="w-12 text-faint-foreground">{label}</span>
      <span className="h-1.5 flex-1 bg-muted">
        <span
          className={cn(
            'block h-full transition-all duration-500',
            value > 85 ? 'bg-destructive' : 'bg-primary',
          )}
          style={{ width: `${value}%` }}
        />
      </span>
      <span className="w-8 text-right">{value}%</span>
    </div>
  )
}
