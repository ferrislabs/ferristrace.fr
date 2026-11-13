import { Switch, ToggleGroup, ToggleGroupItem } from '@cometrace/ui'
import { links } from './links'

export const FILTER_TYPES = ['all', 'added', 'changed', 'fixed', 'security'] as const
export type FilterType = (typeof FILTER_TYPES)[number]

const LABELS: Record<FilterType, string> = {
  all: 'All',
  added: 'Added',
  changed: 'Changed',
  fixed: 'Fixed',
  security: 'Security',
}

interface FilterBarProps {
  type: FilterType
  breakingOnly: boolean
  onTypeChange: (type: FilterType) => void
  onBreakingChange: (breakingOnly: boolean) => void
}

export function FilterBar({ type, breakingOnly, onTypeChange, onBreakingChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-border px-5 py-4 sm:px-8">
      <ToggleGroup
        className="max-w-full flex-wrap gap-0"
        type="single"
        value={type}
        aria-label="Filter by change type"
        // Radix clears the value when the pressed item is pressed again.
        onValueChange={(next) => onTypeChange((next || 'all') as FilterType)}
      >
        {FILTER_TYPES.map((value) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-pressed={type === value}
            className="-ml-px -mt-px h-9 border border-border bg-card px-3.5 font-pixel text-[10px] font-normal uppercase tracking-[0.08em] first:ml-0 hover:bg-foreground/[0.04] data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:relative"
          >
            {LABELS[value]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="flex items-center gap-2.5">
        <Switch id="breaking-only" checked={breakingOnly} onCheckedChange={onBreakingChange} />
        <label htmlFor="breaking-only" className="cursor-pointer text-sm text-foreground">
          Breaking changes only
        </label>
      </div>

      <p className="ml-auto text-sm text-muted-foreground">
        Running an older version?{' '}
        <a
          href={links.upgradeGuide}
          className="text-accent-text underline underline-offset-2 hover:no-underline"
        >
          Upgrade guide
        </a>
      </p>
    </div>
  )
}
