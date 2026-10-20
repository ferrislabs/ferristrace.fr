import { Switch, ToggleGroup, ToggleGroupItem } from '@explainer/ui'
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
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-border py-4">
      <ToggleGroup
        type="single"
        value={type}
        aria-label="Filter by change type"
        // Radix clears the value when the pressed item is pressed again.
        onValueChange={(next) => onTypeChange((next || 'all') as FilterType)}
      >
        {FILTER_TYPES.map((value) => (
          <ToggleGroupItem key={value} value={value} aria-pressed={type === value}>
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
          className="rounded-sm text-accent-text underline underline-offset-2 hover:no-underline"
        >
          Upgrade guide
        </a>
      </p>
    </div>
  )
}
