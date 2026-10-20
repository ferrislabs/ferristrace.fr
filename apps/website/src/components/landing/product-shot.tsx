import { Image } from 'lucide-react'
import { Container } from './shared'

export interface Shot {
  src: string
  width: number
  height: number
}

interface ProductShotProps {
  /** Resolved at build time from public/screenshots/ by pages/index.astro. */
  light?: Shot
  dark?: Shot
}

const alt =
  "The Cometrace trace detail view: a waterfall of spans on the left, the selected span's attributes, events and resource on the right."

export function ProductShot({ light, dark }: ProductShotProps) {
  return (
    <section aria-label="The trace view" className="pb-20">
      <Container>
        <div className="overflow-hidden rounded-xl border border-border shadow-lg">
          {light ? <Shots light={light} dark={dark} /> : <Placeholder />}
        </div>

        <p className="mx-auto mt-4 max-w-[680px] text-center text-sm leading-6 text-faint-foreground">
          The trace view: waterfall on the left, the selected span's attributes, events and resource
          on the right.
        </p>
      </Container>
    </section>
  )
}

function Shots({ light, dark }: { light: Shot; dark?: Shot }) {
  // Without a dark file the light one has to serve both themes, so it keeps no
  // swap class and stays visible either way.
  if (!dark) {
    return (
      <img
        src={light.src}
        width={light.width}
        height={light.height}
        alt={alt}
        className="block h-auto w-full"
      />
    )
  }

  return (
    <>
      <img
        src={light.src}
        width={light.width}
        height={light.height}
        alt={alt}
        className="shot-light block h-auto w-full"
      />
      <img
        src={dark.src}
        width={dark.width}
        height={dark.height}
        alt={alt}
        className="shot-dark block h-auto w-full"
      />
    </>
  )
}

function Placeholder() {
  return (
    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 bg-muted">
      <Image className="size-6 text-faint-foreground" aria-hidden="true" />
      <span className="px-6 text-center font-mono text-xs text-muted-foreground">
        Drop the trace view screenshots in public/screenshots to replace this.
      </span>
    </div>
  )
}
