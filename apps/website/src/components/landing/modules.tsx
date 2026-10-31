import {
  AlignLeft,
  Bell,
  Bug,
  CircleCheck,
  Container as ContainerIcon,
  Hexagon,
  Image as ImageIcon,
  LineChart,
  Tag,
  Text,
  type LucideIcon,
} from 'lucide-react'
import { Band, Column } from './frame'
import { H2, Intro } from './ui'
import type { Shot } from './shot'

interface Module {
  label: string
  Icon: LucideIcon
  /** Designed, not shipped. Drawn flat, with the word spelled out. */
  soon?: boolean
}

const modules: Module[] = [
  { label: 'Traces', Icon: AlignLeft },
  { label: 'Logs', Icon: Text },
  { label: 'Metrics', Icon: LineChart },
  { label: 'Issues', Icon: Bug },
  { label: 'Alerts', Icon: Bell },
  { label: 'Status page', Icon: CircleCheck },
  { label: 'Releases', Icon: Tag },
  { label: 'Kubernetes', Icon: Hexagon, soon: true },
  { label: 'Docker', Icon: ContainerIcon, soon: true },
]

const alt =
  "The FerrisTrace trace detail view: a waterfall of spans coloured by service, with the selected span's attributes, events and resource beside it."

export function Modules({ shotLight, shotDark }: { shotLight?: Shot; shotDark?: Shot }) {
  return (
    <Band tint labelledBy="modules-title">
      <Column className="py-[88px]">
        <H2 id="modules-title">What&rsquo;s in it</H2>
        <Intro className="mt-5">
          Every view links to the others by trace id, service and release.
        </Intro>

        <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(({ label, Icon, soon }) => (
            <li
              key={label}
              className={`flex h-[46px] items-center gap-2.5 rounded-[2px] px-3.5 text-[15px] ${
                soon ? 'text-faint-foreground' : 'border border-border bg-card'
              }`}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
              {soon ? (
                <span className="ml-auto font-mono text-[10.5px] tracking-[0.12em]">SOON</span>
              ) : null}
            </li>
          ))}
        </ul>

        {/*
         * The frame takes the capture's own shape, read from the PNG header in
         * pages/index.astro. A fixed ratio would crop a screenshot that does
         * not match it — these are 1904×942, and a 1440/1000 frame would cut a
         * third of the width away, sidebar and attributes panel included.
         * Without a file it falls back to the ratio the section is drawn for.
         */}
        <figure className="mt-12">
          <div
            className="w-full overflow-hidden border border-border bg-card"
            style={{
              aspectRatio: shotLight ? `${shotLight.width} / ${shotLight.height}` : '1440 / 1000',
            }}
          >
            {shotLight ? (
              <>
                <img
                  src={shotLight.src}
                  width={shotLight.width}
                  height={shotLight.height}
                  alt={alt}
                  className="shot-light block size-full object-cover object-top"
                />
                {shotDark ? (
                  <img
                    src={shotDark.src}
                    width={shotDark.width}
                    height={shotDark.height}
                    alt={alt}
                    className="shot-dark block size-full object-cover object-top"
                  />
                ) : null}
              </>
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-2 bg-muted">
                <ImageIcon className="size-5 text-faint-foreground" aria-hidden="true" />
                <span className="px-6 text-center font-mono text-xs text-muted-foreground">
                  Drop the trace view screenshots in public/screenshots.
                </span>
              </div>
            )}
          </div>
        </figure>
      </Column>
    </Band>
  )
}
