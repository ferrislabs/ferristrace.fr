import { Switch, ToggleGroup, ToggleGroupItem } from '@ferristrace/ui'
import { links } from './links'

/** One per GroupType the parser produces, in Keep a Changelog order. A type
 *  missing here is a section nobody can filter down to. */
export const FILTER_TYPES = [
  'all',
  'added',
  'changed',
  'deprecated',
  'removed',
  'fixed',
  'security',
] as const
export type FilterType = (typeof FILTER_TYPES)[number]

const LABELS: Record<FilterType, string> = {
  all: 'All',
  added: 'Added',
  changed: 'Changed',
  deprecated: 'Deprecated',
  removed: 'Removed',
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
        {/* No aria-pressed here: Radix renders role="radio" with aria-checked,
            and aria-pressed is not allowed on that role. */}
        {FILTER_TYPES.map((value) => (
          <ToggleGroupItem key={value} value={value}>
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

      {/* The whole sentence goes while the docs are unpublished: asking the
          question without being able to answer it only strands the reader. */}
      {links.upgradeGuide ? (
        <p className="ml-auto text-sm text-muted-foreground">
          Running an older version?{' '}
          <a
            href={links.upgradeGuide}
            className="rounded-sm text-accent-text underline underline-offset-2 hover:no-underline"
          >
            Upgrade guide
          </a>
        </p>
      ) : null}
    </div>
  )
}
