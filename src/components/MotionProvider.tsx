"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";

/** Site-wide framer-motion config: `reducedMotion="user"` disables the
 * transform half of every animation (slides, scale) for anyone whose OS asks
 * for reduced motion, while opacity fades still work. Without this, every
 * FadeIn/Stagger on the site ignored that preference. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  // Disarms the dead-man's switch set in layout.tsx. Reaching this effect
  // means React mounted, so framer-motion will clear the opacity:0 itself and
  // the fallback would only cut the animations short. If we never get here,
  // the timer fires and the page becomes readable anyway.
  useEffect(() => {
    const w = window as typeof window & { __dcdMotion?: ReturnType<typeof setTimeout> };
    if (w.__dcdMotion) {
      clearTimeout(w.__dcdMotion);
      w.__dcdMotion = undefined;
    }
    // Deliberately not removing the class if it already fired. A slow device
    // that hydrates after the timer has everything on screen already; taking
    // the override away would re-hide every below-the-fold section until it
    // was scrolled to. Losing the animations for one page load is the better
    // half of that trade.
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
