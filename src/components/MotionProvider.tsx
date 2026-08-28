"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Site-wide framer-motion config: `reducedMotion="user"` disables the
 * transform half of every animation (slides, scale) for anyone whose OS asks
 * for reduced motion, while opacity fades still work. Without this, every
 * FadeIn/Stagger on the site ignored that preference. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
