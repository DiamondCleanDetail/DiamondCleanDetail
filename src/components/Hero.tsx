"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // MotionConfig quiets the framer animations for reduced-motion users,
    // but it has no reach into a raw <video autoPlay> — this background kept
    // moving for exactly the people who asked nothing on the page to move.
    // Paused, the poster frame stands in as a static hero.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
      return;
    }
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.55;
    }
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-center">
      {/* Video + its scrim layers fade out together as one unit toward the
          bottom, revealing the page's own background underneath — this
          guarantees a seamless dissolve regardless of what's in the last
          frame of video, instead of relying on a second overlay trying to
          color-match the page background. */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 92%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 92%)",
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/hero.mp4"
          poster="/video/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Dark scrim for legibility */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 text-center w-full">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const }}
          className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted mb-3 sm:mb-4"
        >
          ✦ A Cut Above Every Car Wash
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const }}
          className="text-4xl sm:text-5xl font-bold tracking-tight"
        >
          Your Car, <span className="chrome-text">Detailed Right.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] as const }}
          className="mt-3 sm:mt-4 text-sm sm:text-base text-muted max-w-xl mx-auto text-balance"
        >
          Premium mobile detailing, paint protection, and ceramic coatings.
          See your options, visualize the results, and book online in
          minutes.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.2, 0.8, 0.2, 1] as const }}
          className="mt-6 sm:mt-8 flex justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/booking"
            className="chrome-btn transition-colors px-6 py-3 rounded-lg font-semibold"
          >
            Book a Detail
          </Link>
          <Link
            href="/services"
            className="border border-border/80 bg-black/20 backdrop-blur-sm hover:border-muted transition-colors px-6 py-3 rounded-lg font-medium"
          >
            View Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
