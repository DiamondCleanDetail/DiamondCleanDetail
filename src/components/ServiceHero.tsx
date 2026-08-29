"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function ServiceHero({
  eyebrow,
  title,
  tagline,
  video,
  image,
  mobileImage,
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  video?: string | null;
  image?: string | null;
  /** Swapped in for `image` below the sm breakpoint — for art-directed
   * backgrounds (e.g. a composite) that need a different crop on a tall,
   * narrow viewport instead of just cropping the same wide image harder. */
  mobileImage?: string | null;
}) {
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

  const hasMedia = Boolean(video || image);
  const poster = video ? video.replace(/\.mp4$/, "-poster.jpg") : undefined;

  return (
    <section className="relative overflow-hidden min-h-[55vh] sm:min-h-[65vh] flex items-end sm:items-center">
      {video ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={video}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : image ? (
        mobileImage ? (
          <>
            <Image
              src={mobileImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover sm:hidden"
            />
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover hidden sm:block"
            />
          </>
        ) : (
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        )
      ) : null}

      {hasMedia && (
        <>
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
        </>
      )}

      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:py-24 w-full">
        <Link href="/services" className="text-sm text-muted hover:text-foreground transition-colors">
          &larr; All Services
        </Link>
        <motion.span
          data-motion
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const }}
          className="block text-[10px] sm:text-xs uppercase tracking-widest text-muted mt-3"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          data-motion
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] as const }}
          className="text-3xl sm:text-5xl font-bold tracking-tight mt-3"
        >
          {title}
        </motion.h1>
        <motion.p
          data-motion
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.2, 0.8, 0.2, 1] as const }}
          className="text-base sm:text-lg text-muted mt-3 max-w-2xl"
        >
          {tagline}
        </motion.p>
      </div>
    </section>
  );
}
