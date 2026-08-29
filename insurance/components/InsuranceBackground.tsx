"use client";

import Image from "next/image";
import { useResponsiveBackground } from "../hooks/useResponsiveBackground";
import bgDefault from "../image/Bg Laptop.png";
import bgMobile from "../image/Bg Laptop.png";

/**
 * 4K Bright Natural Background Component per PRD §15 & §26.
 * Uses BG_3.png for desktop/tablet and BG_2.png for portrait mobile.
 * Unoptimized raw rendering in a bright, clean, airy light-theme presentation.
 */
export function InsuranceBackground() {
  const isPortraitMobile = useResponsiveBackground();
  const activeBg = isPortraitMobile ? bgMobile : bgDefault;

  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none select-none">
      <Image
        src={activeBg}
        alt="Crop Farm 4K Background"
        fill
        priority
        quality={100}
        unoptimized
        sizes="100vw"
        className="object-cover object-center w-full h-full brightness-105"
      />
      {/* Bright, clean ambient daylight overlay */}
      <div className="absolute inset-0 bg-white/10 pointer-events-none" />
    </div>
  );
}
