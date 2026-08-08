"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Activity,
  Flame,
  Dumbbell,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Award,
  ShieldCheck,
  X,
  User,
  Compass,
  Check,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { MOCK_SERVICES, MOCK_TRAINER } from "@/lib/data";
import { WizardPortal } from "@/components/WizardPortal";
import { ExploreContent } from "@/components/ExploreContent";
import { Footer } from "@/components/Footer";
import { useAssessmentStore } from "@/lib/assessmentStore";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

function HomeContent() {
  // Page visibility state: hide bottom sections by default until "Explore the World of Muscle Builders" is clicked
  const [showBottomSections, setShowBottomSections] = useState(false);

  // Transformation Questionnaire Wizard State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Steps 1 to 4

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "26",
    weightKg: "75",
    targetWeightKg: "70",
    fitnessGoal: "Fat Loss & Muscle Shredding",
    workoutDays: "4-5 Days / Week",
  });

  // Support ?reopen=true&step=N from Consultation page "Edit Assessment" button
  const searchParams = useSearchParams();
  const storeData = useAssessmentStore((s) => s);

  useEffect(() => {
    // Rehydrate the Zustand store (skipHydration=true means we must do this manually)
    useAssessmentStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const reopen = searchParams.get("reopen");
    const stepParam = searchParams.get("step");
    if (reopen === "true" && storeData.name) {
      // Pre-fill form data from the store
      setFormData({
        name: storeData.name,
        email: storeData.email,
        phone: storeData.phone,
        age: storeData.age,
        weightKg: storeData.weightKg,
        targetWeightKg: storeData.targetWeightKg,
        fitnessGoal: storeData.fitnessGoal,
        workoutDays: storeData.workoutDays,
      });
      // Open wizard at the saved step (default to step 3 — goals — so they can adjust in reverse order)
      const targetStep = stepParam ? Math.min(Math.max(parseInt(stepParam, 10), 1), 4) : 3;
      setCurrentStep(targetStep);
      setWizardOpen(true);
      // Clean the URL params without a full navigation
      window.history.replaceState({}, "", "/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. HERO SCROLL-TRIGGER TIMELINE SCRUB
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Headline subtle upward shift & fade
      heroTl.to(
        "#hero-headline",
        {
          y: -70,
          opacity: 0.25,
          scale: 0.98,
          ease: "none",
        },
        0
      );

      // Central Athlete Image subtle scale & depth
      heroTl.to(
        "#hero-image",
        {
          scale: 1.06,
          y: 40,
          ease: "none",
        },
        0
      );

      // Orbiting Stat Badges Radial Spread
      heroTl.to("#stat-badge-1", { x: -30, y: -25, rotate: -12, ease: "none" }, 0);
      heroTl.to("#stat-badge-2", { x: 30, y: -25, rotate: 12, ease: "none" }, 0);
      heroTl.to("#stat-badge-3", { y: 20, ease: "none" }, 0);

      // 2. SECTION CARDS SMOOTH REVEAL ANIMATIONS (When bottom sections are visible)
      if (showBottomSections) {
        const revealElements = document.querySelectorAll(".gsap-reveal");
        revealElements.forEach((el) => {
          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: 50,
              scale: 0.97,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
    });

    return () => ctx.revert();
  }, [showBottomSections]);

  // Scroll lock is now handled inside WizardPortal itself

  // Handle Explore Muscle Builders click (One-click reveal + smooth scroll)
  const handleExploreClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setShowBottomSections(true);

    const scrollToTarget = () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
        const smoother = ScrollSmoother.get();
        const targetSec = document.getElementById("bottom-sections");
        if (smoother && targetSec) {
          smoother.scrollTo(targetSec, true, "top top");
        } else if (targetSec) {
          targetSec.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    requestAnimationFrame(() => {
      setTimeout(scrollToTarget, 60);
    });
  };

  // Handle Let's Start click (One-click open questionnaire wizard)
  const handleStartClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setWizardOpen(true);
    setCurrentStep(1);
  };

  // Calculate Progress Percentage for Top Bar (Starts at 10%, goes to 100%)
  const getProgressPercentage = () => {
    switch (currentStep) {
      case 1:
        return 10;
      case 2:
        return 40;
      case 3:
        return 75;
      case 4:
        return 100;
      default:
        return 10;
    }
  };

  return (
    <>
      {/* WIZARD PORTAL — renders directly into document.body, OUTSIDE the GSAP transform tree */}
      <WizardPortal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        formData={formData}
        setFormData={setFormData}
        getProgressPercentage={getProgressPercentage}
      />

      <div className="flex flex-col min-h-screen bg-[#09090b] text-zinc-100 selection:bg-[#bef264] selection:text-zinc-950">
      {/* 
        HERO SECTION:
        - Top Typography Banner: "Sculpt Your Body, Elevate Your Spirit"
        - Centered Athlete Image (dp-image3.jpg) nestled cleanly below headline
        - 4 Orbiting Stat Cards (Hours 1.5, Poses 20, Kcal 550, Sets 5)
        - Side vertical labels PREV & NEXT
        - Bottom Row: Left 12k+ Happy Spirits | Right Flex Row with "Let's Start >>>" and "Explore the World of Muscle Builders"
      */}
      <section
        id="hero-section"
        className="relative min-h-[92vh] w-full flex flex-col justify-between overflow-hidden bg-[#09090b] pt-24 sm:pt-28 pb-8 border-b border-zinc-800/60 select-none"
      >
        {/* Ambient Radial Backlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#bef264]/10 rounded-full blur-[150px] pointer-events-none -z-0" />

        {/* 1. TOP TYPOGRAPHY BANNER */}
        <div
          id="hero-headline"
          className="relative z-10 text-center max-w-7xl mx-auto px-4 space-y-2 pt-2 transition-transform"
          data-speed="clamp(0.96)"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-none drop-shadow-xl">
            Sculpt <span className="text-[#bef264]">Your Body,</span>
          </h1>
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-zinc-100 uppercase tracking-tight leading-none opacity-95 drop-shadow-xl">
            Elevate <span className="text-[#bef264]">Your Spirit</span>
          </h2>
        </div>

        {/* 2. CENTRAL HERO ZONE: dp-image3.jpg WITH 4 STAT CARDS */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 flex items-center justify-between my-4">
          {/* Left Vertical Control */}
          <div className="hidden lg:flex flex-col items-center space-y-2 text-zinc-400 font-mono text-xs tracking-widest font-bold">
            <span className="[writing-mode:vertical-lr] rotate-180 uppercase tracking-widest text-zinc-400">
              P R E V
            </span>
            <ChevronDown className="h-4 w-4 text-[#bef264] animate-bounce" />
          </div>

          {/* Central Image Wrapper with dp-image3.jpg */}
          <div className="relative mx-auto flex justify-center items-center my-2" data-speed="clamp(1.02)">
            {/* Ambient Image Backlight */}
            <div className="absolute inset-0 bg-[#bef264]/15 blur-3xl rounded-full scale-95 -z-10" />

            {/* Central Subject Image: dp-image3.jpg */}
            <div id="hero-image" className="relative group transition-transform">
              <img
                src="/dp-image.jpg"
                alt="Coach Vikrant Transformation"
                className="h-[420px] sm:h-[500px] md:h-[540px] w-auto max-w-[90vw] object-cover object-top rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-zinc-800/80 group-hover:border-[#bef264]/40 transition-all duration-500"
              />
              {/* Soft bottom & edge gradient blend into dark background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#09090b] via-transparent via-60% to-transparent pointer-events-none" />
            </div>

            {/* STAT CARD 1: TOP-LEFT (Session Time - Slow Motion Tilt Animation & Responsive Bounds) */}
            <div
              id="stat-badge-1"
              className="absolute top-2 left-2 sm:-top-2 sm:-left-8 md:-top-4 md:-left-14 z-30 animate-tilt-slow-left transition-all duration-300 bg-zinc-900/95 border border-zinc-800/90 backdrop-blur-xl px-3.5 py-2.5 sm:px-5 sm:py-4 rounded-2xl shadow-2xl flex flex-col items-center justify-center space-y-1 sm:space-y-1.5 w-28 sm:w-36 min-w-[100px] sm:min-w-[130px] cursor-pointer hover:border-[#bef264]/60 hover:scale-105"
              data-lag="0.04"
            >
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-[#bef264] text-zinc-950 flex items-center justify-center shadow-md shrink-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-center leading-tight">Session Time</span>
              <span className="text-xs sm:text-base font-black text-white leading-none">1.5 Hrs</span>
            </div>

            {/* STAT CARD 2: TOP-RIGHT (Key Poses - Slow Motion Tilt Animation & Responsive Bounds) */}
            <div
              id="stat-badge-2"
              className="absolute top-2 right-2 sm:-top-2 sm:-right-8 md:-top-4 md:-right-14 z-30 animate-tilt-slow-right transition-all duration-300 bg-zinc-900/95 border border-zinc-800/90 backdrop-blur-xl px-3.5 py-2.5 sm:px-5 sm:py-4 rounded-2xl shadow-2xl flex flex-col items-center justify-center space-y-1 sm:space-y-1.5 w-28 sm:w-36 min-w-[100px] sm:min-w-[130px] cursor-pointer hover:border-[#bef264]/60 hover:scale-105"
              data-lag="0.06"
            >
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-[#bef264] text-zinc-950 flex items-center justify-center shadow-md shrink-0">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-center leading-tight">Key Poses</span>
              <span className="text-xs sm:text-base font-black text-white leading-none">20+</span>
            </div>

            {/* MERGED STAT CARD: BOTTOM (Burned 550 Kcal & Target 5 Sets - Contained & Slow Motion Float) */}
            <div
              id="stat-badge-3"
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-30 animate-float-slow-center transition-all duration-300 bg-zinc-900/95 border border-zinc-800/90 backdrop-blur-xl px-3.5 py-2.5 sm:px-7 sm:py-4 rounded-2xl shadow-2xl flex items-center justify-between sm:justify-center gap-2.5 sm:gap-6 cursor-pointer hover:border-[#bef264]/60 w-[calc(100%-1.5rem)] max-w-[360px] sm:max-w-none"
              data-lag="0.08"
            >
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#bef264] text-zinc-950 flex items-center justify-center shadow-md shrink-0">
                  <Flame className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Burned</span>
                  <span className="text-xs sm:text-sm font-black text-white leading-tight mt-0.5 sm:mt-1">550 Kcal</span>
                </div>
              </div>

              <div className="h-7 sm:h-8 w-[1px] bg-zinc-800 shrink-0 mx-0.5 sm:mx-0" />

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#bef264] text-zinc-950 flex items-center justify-center shadow-md shrink-0">
                  <Dumbbell className="h-4 w-4 stroke-[2.5]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Target</span>
                  <span className="text-xs sm:text-sm font-black text-white leading-tight mt-0.5 sm:mt-1">5 Sets</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Vertical Control */}
          <div className="hidden lg:flex flex-col items-center space-y-2 text-zinc-400 font-mono text-xs tracking-widest font-bold">
            <span className="[writing-mode:vertical-lr] uppercase tracking-widest text-zinc-400">
              N E X T
            </span>
            <ChevronDown className="h-4 w-4 text-[#bef264] animate-bounce" />
          </div>
        </div>

        {/* 3. BOTTOM ACTION BAR: FLEX LAYOUT WITH EQUAL HEIGHT SINGLE-LINE BUTTONS */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
          {/* Bottom Left Social Proof */}
          <div className="flex items-center gap-3 bg-zinc-900/70 border border-zinc-800/80 px-4 py-2.5 rounded-2xl backdrop-blur-md shrink-0">
            <div className="flex -space-x-3">
              <img
                src="/dp-image.jpg"
                alt="Client 1"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-zinc-950"
              />
              <img
                src="/dp-image2.jpg"
                alt="Client 2"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-zinc-950"
              />
              <img
                src="/dp-image3.jpg"
                alt="Client 3"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-zinc-950 ring-offset-1 ring-offset-[#bef264]"
              />
            </div>
            <div>
              <p className="text-base font-black text-white leading-none">100+</p>
              <p className="text-[11px] font-medium text-zinc-400">Happy Clients</p>
            </div>
          </div>

          {/* 
            FLEX ACTION BUTTONS (EQUAL HEIGHT & SINGLE-LINE LABELS)
            1. "Transform Now >>>" (Opens Transformation Questionnaire Wizard)
            2. "Explore" (Reveals Lower Sections)
          */}
          <div className="flex flex-wrap items-center justify-around gap-4 w-full md:w-auto">
            {/* Button 1: Transform Now */}
            <button
              type="button"
              onClick={handleStartClick}
              aria-label="Start Transformation Wizard"
              className="flex-1 md:flex-none h-12 flex items-center justify-center gap-3 rounded-full bg-[#bef264] px-8 text-xs font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition-all shadow-[0_0_30px_rgba(190,242,100,0.35)] active:scale-95 group cursor-pointer whitespace-nowrap"
            >
              <span>Ready to Transform?</span>
              <div className="flex items-center text-zinc-950 font-bold text-sm tracking-tighter group-hover:translate-x-1 transition-transform">
                &gt;&gt;&gt;
              </div>
            </button>

            {/* Button 2: Explore */}
            <button
              type="button"
              onClick={handleExploreClick}
              aria-label="Explore the World of Muscle Builders"
              className="flex-1 md:flex-none h-12 flex items-center justify-center gap-2 rounded-full border border-[#bef264]/40 bg-zinc-900/90 px-8 text-xs font-black uppercase tracking-wider text-white hover:bg-[#bef264] hover:text-zinc-950 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(190,242,100,0.25)] active:scale-95 group cursor-pointer whitespace-nowrap"
            >
              <Compass className="h-4 w-4 text-[#bef264] group-hover:text-zinc-950 transition-colors" />
              <span>Explore</span>
            </button>
          </div>
        </div>
      </section>


      {/* 
        ========================================================================
        DYNAMICALLY REVEALED EXPLORE SECTIONS (IN EXACT ORDER: 1 TO 8)
        (Rendered when user clicks "Explore")
        ========================================================================
      */}
      {showBottomSections && (
        <div id="bottom-sections" className="animate-fadeIn">
          <ExploreContent onOpenWizard={handleStartClick} />
          <Footer forceRender />
        </div>
      )}
    </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
