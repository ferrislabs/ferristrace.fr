import { useState } from 'react'
import { cn } from '@cometrace/ui'
import { BellRing, GitCommitHorizontal, Terminal } from 'lucide-react'

type Health = 'ok' | 'burning' | 'down' | 'absent'

interface Cell {
  health: Health
  /** Error budget left this month, in percent. */
  budget: number
  deploys: number
  pods: number
  note: string
  incident?: string
}

const clusters = ['prod-eu-1', 'prod-us-1', 'staging'] as const
type Cluster = (typeof clusters)[number]

const ok = (budget: number, deploys: number, pods: number): Cell => ({
  health: 'ok',
  budget,
  deploys,
  pods,
  note: 'Within its SLO. Nobody needs to look at it today.',
})

const absent: Cell = {
  health: 'absent',
  budget: 0,
  deploys: 0,
  pods: 0,
  note: 'Not deployed on this cluster.',
}

const fleet: Array<{ team: string; namespace: string; slo: string; cells: Record<Cluster, Cell> }> =
  [
    {
      team: 'checkout',
      namespace: 'checkout',
      slo: '99.9 % of requests under 400 ms',
      cells: {
        'prod-eu-1': {
          health: 'burning',
          budget: 8,
          deploys: 3,
          pods: 12,
          incident: 'INC-212',
          note: 'Since the 14:02 sync it has burned error budget 6× faster than allowed. INC-212 paged the checkout on-call, so you can stay asleep.',
        },
        'prod-us-1': ok(71, 1, 9),
        staging: ok(100, 7, 3),
      },
    },
    {
      team: 'payments',
      namespace: 'payments',
      slo: '99.95 % of charges succeed',
      cells: { 'prod-eu-1': ok(64, 0, 8), 'prod-us-1': ok(58, 0, 8), staging: ok(100, 2, 2) },
    },
    {
      team: 'search',
      namespace: 'search',
      slo: '99 % of queries under 250 ms',
      cells: {
        'prod-eu-1': ok(42, 1, 6),
        'prod-us-1': {
          health: 'down',
          budget: 0,
          deploys: 1,
          pods: 6,
          incident: 'INC-209',
          note: 'Budget gone. Two of the six pods were OOMKilled on node pool spot-b. INC-209 belongs to the search team, but the node pool is your problem.',
        },
        staging: absent,
      },
    },
    {
      team: 'identity',
      namespace: 'identity',
      slo: '99.99 % of sign-ins succeed',
      cells: { 'prod-eu-1': ok(93, 0, 4), 'prod-us-1': ok(90, 0, 4), staging: ok(100, 1, 1) },
    },
    {
      team: 'ml-platform',
      namespace: 'inference',
      slo: '95 % of predictions under 1 s',
      cells: { 'prod-eu-1': absent, 'prod-us-1': ok(27, 2, 5), staging: ok(100, 4, 2) },
    },
  ]

const views = [
  { id: 'health', label: 'Health' },
  { id: 'budget', label: 'Error budget' },
  { id: 'deploys', label: 'Deploys today' },
] as const
type View = (typeof views)[number]['id']

const healthStyle: Record<Health, string> = {
  ok: 'border-success-text/30 bg-success-text/10',
  burning: 'border-severity-warn-border bg-severity-warn-background',
  down: 'border-severity-error-border bg-severity-error-background',
  absent: 'border-dashed border-border bg-transparent text-faint-foreground',
}

const healthLabel: Record<Health, string> = {
  ok: 'healthy',
  burning: 'burning',
  down: 'exhausted',
  absent: 'none',
}

/**
 * The fleet as a platform team sees it: every team on every cluster, with
 * the SLO each one owns. Pick a cell to see who gets paged and why.
 */
export function FleetMatrix() {
  const [view, setView] = useState<View>('health')
  const [selected, setSelected] = useState<{ team: string; cluster: Cluster }>({
    team: 'checkout',
    cluster: 'prod-eu-1',
  })
  const row = fleet.find((r) => r.team === selected.team)!
  const cell = row.cells[selected.cluster]

  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-tint px-4 py-3">
        <p className="flex min-w-0 items-center gap-2 font-mono text-[12px]">
          <Terminal className="size-3.5 shrink-0 text-faint-foreground" aria-hidden="true" />
          <span className="truncate">
            <span className="text-faint-foreground">$ </span>kubectl apply -k
            deploy/ferristrace-collector
          </span>
          <span className="hidden shrink-0 text-success-text sm:inline">
            ✓ 3 clusters · 13 namespaces
          </span>
        </p>
        <div
          className="flex items-center gap-1 border border-border bg-card p-0.5"
          role="group"
          aria-label="What the cells show"
        >
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={view === v.id}
              onClick={() => setView(v.id)}
              className={cn(
                'px-2.5 py-1 text-[12px] font-medium transition-colors',
                view === v.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent',
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-[420px] border-separate border-spacing-1.5 font-mono text-[12px]">
            <thead>
              <tr>
                <th scope="col" className="text-left text-[11px] font-normal text-faint-foreground">
                  team
                </th>
                {clusters.map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className="text-left text-[11px] font-normal text-faint-foreground"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fleet.map((r) => (
                <tr key={r.team}>
                  <th scope="row" className="pr-2 text-left font-semibold">
                    {r.team}
                  </th>
                  {clusters.map((c) => {
                    const cl = r.cells[c]
                    const active = selected.team === r.team && selected.cluster === c
                    return (
                      <td key={c}>
                        <button
                          type="button"
                          aria-pressed={active}
                          aria-label={`${r.team} on ${c}: ${healthLabel[cl.health]}`}
                          onClick={() => setSelected({ team: r.team, cluster: c })}
                          className={cn(
                            'flex h-10 w-full items-center gap-2 border px-2 text-left transition-all',
                            healthStyle[cl.health],
                            active && 'ring-2 ring-primary',
                          )}
                        >
                          <CellContent cell={cl} view={view} />
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          key={`${selected.team}-${selected.cluster}`}
          aria-live="polite"
          className="problem-panel border-t border-border bg-surface-tint p-5 lg:border-l lg:border-t-0"
        >
          <p className="font-mono text-[11px] text-faint-foreground">
            {selected.cluster} · ns/{row.namespace}
          </p>
          <h3 className="mt-0.5 text-[15px] font-semibold">{row.team}</h3>
          <p className="mt-1 text-[12px] text-muted-foreground">SLO: {row.slo}</p>

          {cell.health === 'absent' ? null : (
            <>
              <div className="mt-4">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-faint-foreground">error budget left</span>
                  <span className={cn(cell.budget < 15 && 'text-destructive')}>
                    {cell.budget} %
                  </span>
                </div>
                <span className="mt-1 block h-1.5 bg-muted">
                  <span
                    className={cn(
                      'block h-full transition-all duration-500',
                      cell.budget < 15 ? 'bg-destructive' : 'bg-primary',
                    )}
                    style={{ width: `${cell.budget}%` }}
                  />
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 font-mono text-[12px]">
                <div className="border border-border bg-card p-2">
                  <dt className="text-[10px] text-faint-foreground">pods</dt>
                  <dd className="mt-0.5">{cell.pods}</dd>
                </div>
                <div className="border border-border bg-card p-2">
                  <dt className="flex items-center gap-1 text-[10px] text-faint-foreground">
                    <GitCommitHorizontal className="size-3" aria-hidden="true" />
                    deploys today
                  </dt>
                  <dd className="mt-0.5">{cell.deploys}</dd>
                </div>
              </dl>
            </>
          )}

          {cell.incident ? (
            <p className="mt-4 flex items-center gap-2 border border-severity-error-border bg-severity-error-background px-3 py-2 text-[12px] text-severity-error-foreground">
              <BellRing className="size-3.5 shrink-0" aria-hidden="true" />
              {cell.incident} · paged @{row.team}-oncall
            </p>
          ) : null}

          <p className="mt-4 border border-primary/30 bg-primary/5 p-3 text-sm leading-6">
            {cell.note}
          </p>
        </div>
      </div>
    </div>
  )
}

function CellContent({ cell, view }: { cell: Cell; view: View }) {
  if (cell.health === 'absent') return <span className="text-[11px]">—</span>
  if (view === 'budget')
    return (
      <span className="flex w-full items-center gap-2">
        <span className="h-1 flex-1 bg-foreground/10">
          <span
            className={cn('block h-full', cell.budget < 15 ? 'bg-destructive' : 'bg-success-text')}
            style={{ width: `${cell.budget}%` }}
          />
        </span>
        <span className="w-8 text-right text-[11px]">{cell.budget}%</span>
      </span>
    )
  if (view === 'deploys')
    return (
      <span className="flex items-center gap-0.5" aria-label={`${cell.deploys} deploys`}>
        {cell.deploys === 0 ? (
          <span className="text-[11px] text-faint-foreground">0</span>
        ) : (
          Array.from({ length: cell.deploys }, (_, i) => (
            <span key={i} className="size-1.5 bg-primary" />
          ))
        )}
      </span>
    )
  return (
    <>
      <span
        className={cn(
          'size-1.5 shrink-0',
          cell.health === 'ok' && 'bg-success-text',
          cell.health === 'burning' && 'animate-pulse bg-severity-warn-foreground',
          cell.health === 'down' && 'animate-pulse bg-destructive',
        )}
      />
      <span className="truncate text-[11px]">{healthLabel[cell.health]}</span>
    </>
  )
}
