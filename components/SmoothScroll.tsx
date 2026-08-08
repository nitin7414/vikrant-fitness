"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current || !contentRef.current) return;

    // Register plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // Create ScrollSmoother instance according to GSAP v3 docs
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2, // Time (in seconds) to catch up to native scroll position
      effects: true, // Look for data-speed and data-lag attributes
      smoothTouch: 0.1, // Smooth scrolling on touch/mobile devices ("regardless of device")
      normalizeScroll: true, // Prevents mobile browser address bar jumps & synchronizes scroll
      ignoreMobileResize: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef} className="w-full overflow-hidden">
      <div id="smooth-content" ref={contentRef} className="w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
