"use client";

import { useEffect, useState } from "react";

// True once the viewport aspect ratio reaches ~9:16 (portrait mobile).
const PORTRAIT_MOBILE_QUERY = "(max-aspect-ratio: 9/16)";

export function useResponsiveBackground() {
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(PORTRAIT_MOBILE_QUERY);
    const update = () => setIsPortraitMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    window.addEventListener("orientationchange", update);
    return () => {
      mql.removeEventListener("change", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return isPortraitMobile;
}
