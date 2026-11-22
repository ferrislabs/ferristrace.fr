import { cn } from '@cometrace/ui'
import { PixelSprite } from '../pixel/pixel-sprite'
import { cometCrab } from '../pixel/sprites'

/** The FerrisTrace mark: the pixel comet crab, as on ferrislabs.fr. */
export function FerrisMark({ className }: { className?: string }) {
  return <PixelSprite sprite={cometCrab} className={cn('aspect-[13/8] h-auto w-6', className)} />
}
