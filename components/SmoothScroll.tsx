"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

/** Route scroll reset helper — ensures page focus and scroll start from top (0, 0) on navigation */
function RouteScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable browser automatic scroll restoration to avoid conflict with route changes
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetToTop = () => {
      // 1. Reset native browser window scroll
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      // 2. Reset GSAP ScrollSmoother instance if initialized
      try {
        const smoother =
          (window as any).gsap?.plugins?.ScrollSmoother?.get?.() ||
          ScrollSmoother.get();
        if (smoother) {
          smoother.scrollTo(0, false);
        }
      } catch {}
    };

    // Immediate scroll reset
    resetToTop();

    // Secondary reset after next-tick layout paint & ScrollTrigger refresh
    const timer = setTimeout(() => {
      resetToTop();
      try {
        ScrollTrigger.refresh();
      } catch {}
    }, 60);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current || !contentRef.current) return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Register plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // Create ScrollSmoother instance according to GSAP v3 docs
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2, // Time (in seconds) to catch up to native scroll position
      effects: true, // Look for data-speed and data-lag attributes
      smoothTouch: 0.1, // Smooth scrolling on touch/mobile devices
      normalizeScroll: true, // Prevents mobile browser address bar jumps & synchronizes scroll
      ignoreMobileResize: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef} className="w-full overflow-hidden">
      <Suspense fallback={null}>
        <RouteScrollReset />
      </Suspense>
      <div id="smooth-content" ref={contentRef} className="w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
