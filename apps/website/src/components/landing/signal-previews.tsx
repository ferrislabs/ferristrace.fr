import { Badge, cn } from '@cometrace/ui'
import { CircleX, Info, OctagonX, TriangleAlert } from 'lucide-react'

const spans = [
  { offset: 0, width: 100, color: 'bg-service-1', error: false },
  { offset: 2, width: 97, color: 'bg-service-2', error: false },
  { offset: 17, width: 76, color: 'bg-service-3', error: true },
  { offset: 93, width: 4, color: 'bg-service-4', error: false },
]

export function WaterfallPreview() {
  return (
    <div className="space-y-2.5" aria-hidden="true">
      {spans.map((span) => (
        <div key={`${span.offset}-${span.width}`} className="w-full">
          <div
            className={cn(
              'h-1.5 rounded-sm',
              span.color,
              span.error && 'outline-1 outline-offset-1 outline-destructive',
            )}
            style={{ marginLeft: `${span.offset}%`, width: `${span.width}%` }}
          />
        </div>
      ))}
    </div>
  )
}

const severities = [
  {
    label: 'info',
    Icon: Info,
    className:
      'border-severity-info-border bg-severity-info-background text-severity-info-foreground',
  },
  {
    label: 'warn',
    Icon: TriangleAlert,
    className:
      'border-severity-warn-border bg-severity-warn-background text-severity-warn-foreground',
  },
  {
    label: 'error',
    Icon: CircleX,
    className:
      'border-severity-error-border bg-severity-error-background text-severity-error-foreground',
  },
  {
    label: 'fatal',
    Icon: OctagonX,
    className:
      'border-severity-fatal-border bg-severity-fatal-background text-severity-fatal-foreground',
  },
]

export function SeverityPreview() {
  return (
    <div className="flex flex-wrap gap-2">
      {severities.map(({ label, Icon, className }) => (
        <Badge key={label} variant="outline" className={cn('font-mono font-medium', className)}>
          <Icon aria-hidden="true" />
          {label}
        </Badge>
      ))}
    </div>
  )
}

export function SparklinePreview() {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-9 w-full text-primary"
    >
      <polyline
        points="1,26 13,24 25,27 37,22 49,25 61,21 73,24 85,20 97,23 109,19 121,21 133,14 145,8 159,3"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
