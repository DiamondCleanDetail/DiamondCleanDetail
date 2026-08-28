/** How far a horizontal drag must travel, in pixels, to count as a swipe. */
export const SWIPE_DISTANCE_PX = 60;
/** ...or how fast it must be moving when released, in pixels per second. */
export const SWIPE_VELOCITY_PX_PER_S = 400;

/**
 * Which way a finished drag should page: -1 for the previous item, 1 for the
 * next, 0 to stay where it is.
 *
 * Distance *or* speed qualifies. Distance alone would ignore the short, quick
 * flick most people actually make on a phone; speed alone would page on a
 * twitch. A gesture that clears neither is a nudge, and snaps back.
 */
export function swipeDirection(offsetX: number, velocityX: number): -1 | 0 | 1 {
  const farEnough = Math.abs(offsetX) > SWIPE_DISTANCE_PX;
  const fastEnough = Math.abs(velocityX) > SWIPE_VELOCITY_PX_PER_S;
  if (!farEnough && !fastEnough) return 0;
  // Take the sign from whichever test passed — on a flick the finger has
  // barely moved, so the offset's sign is noise.
  const direction = farEnough ? offsetX : velocityX;
  // Dragging leftwards pulls the next item into view.
  return direction < 0 ? 1 : -1;
}
