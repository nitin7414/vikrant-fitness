"use client";

import React, { useState, useEffect } from "react";
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
import { MOCK_SERVICES, MOCK_TRAINER } from "@/lib/data";
import { WizardPortal } from "@/components/WizardPortal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  // Page visibility state: hide bottom sections by default until "Explore the World of Muscle Builders" is clicked
  const [showBottomSections, setShowBottomSections] = useState(false);

  // Transformation Questionnaire Wizard State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Steps 1 to 4

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "26",
    weightKg: "75",
    targetWeightKg: "70",
    fitnessGoal: "Fat Loss & Muscle Shredding",
    workoutDays: "4-5 Days / Week",
  });

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
      heroTl.to("#stat-badge-3", { x: -30, y: 25, rotate: -12, ease: "none" }, 0);
      heroTl.to("#stat-badge-4", { x: 30, y: 25, rotate: 12, ease: "none" }, 0);

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

  // Handle Explore Muscle Builders click
  const handleExploreClick = () => {
    setShowBottomSections(true);
    setTimeout(() => {
      const targetSec = document.getElementById("bottom-sections");
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
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
                src="/dp-image3.jpg"
                alt="Coach Vikrant Transformation"
                className="h-[420px] sm:h-[500px] md:h-[540px] w-auto max-w-[90vw] object-cover object-top rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-zinc-800/80 group-hover:border-[#bef264]/40 transition-all duration-500"
              />
              {/* Soft bottom & edge gradient blend into dark background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#09090b] via-transparent via-60% to-transparent pointer-events-none" />
            </div>

            {/* STAT CARD 1: TOP-LEFT (Hours 1.5) */}
            <div
              id="stat-badge-1"
              className="absolute -top-2 left-0 sm:-left-12 z-30 -rotate-6 hover:rotate-0 transition-all duration-300 bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-2xl flex flex-col items-center space-y-1 w-24 sm:w-28 cursor-pointer hover:border-[#bef264]/60"
              data-lag="0.04"
            >
              <div className="h-9 w-9 rounded-xl bg-[#bef264] text-zinc-950 flex items-center justify-center shadow-md">
                <Clock className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-medium text-zinc-400">Hours</span>
              <span className="text-base font-black text-white leading-none">1.5</span>
            </div>

            {/* STAT CARD 2: TOP-RIGHT (Poses 20) */}
            <div
              id="stat-badge-2"
              className="absolute -top-2 right-0 sm:-right-12 z-30 rotate-6 hover:rotate-0 transition-all duration-300 bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-2xl flex flex-col items-center space-y-1 w-24 sm:w-28 cursor-pointer hover:border-[#bef264]/60"
              data-lag="0.06"
            >
              <div className="h-9 w-9 rounded-xl bg-[#bef264] text-zinc-950 flex items-center justify-center shadow-md">
                <Activity className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-medium text-zinc-400">Poses</span>
              <span className="text-base font-black text-white leading-none">20</span>
            </div>

            {/* STAT CARD 3: BOTTOM-LEFT (Kcal 550) */}
            <div
              id="stat-badge-3"
              className="absolute bottom-8 left-0 sm:-left-12 z-30 -rotate-6 hover:rotate-0 transition-all duration-300 bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-2xl flex flex-col items-center space-y-1 w-24 sm:w-28 cursor-pointer hover:border-[#bef264]/60"
              data-lag="0.08"
            >
              <div className="h-9 w-9 rounded-xl bg-[#bef264] text-zinc-950 flex items-center justify-center shadow-md">
                <Flame className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-medium text-zinc-400">Kcal</span>
              <span className="text-base font-black text-white leading-none">550</span>
            </div>

            {/* STAT CARD 4: BOTTOM-RIGHT (Sets 5) */}
            <div
              id="stat-badge-4"
              className="absolute bottom-8 right-0 sm:-right-12 z-30 rotate-6 hover:rotate-0 transition-all duration-300 bg-zinc-900/90 border border-zinc-800/90 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-2xl flex flex-col items-center space-y-1 w-24 sm:w-28 cursor-pointer hover:border-[#bef264]/60"
              data-lag="0.10"
            >
              <div className="h-9 w-9 rounded-xl bg-[#bef264] text-zinc-950 flex items-center justify-center shadow-md">
                <Dumbbell className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-medium text-zinc-400">Sets</span>
              <span className="text-base font-black text-white leading-none">5</span>
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

        {/* 3. BOTTOM ACTION BAR: FLEX LAYOUT WITH "LET'S START" & "EXPLORE THE WORLD OF MUSCLE BUILDERS" */}
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
              <p className="text-base font-black text-white leading-none">12k+</p>
              <p className="text-[11px] font-medium text-zinc-400">Happy Spirits</p>
            </div>
          </div>

          {/* 
            FLEX ACTION BUTTONS (JUSTIFY-AROUND / JUSTIFY-BETWEEN)
            1. "Let's Start >>>" (Opens God-Like Questionnaire Wizard)
            2. "Explore the World of Muscle Builders" (Reveals Lower Sections)
          */}
          <div className="flex flex-wrap items-center justify-around gap-4 w-full md:w-auto">
            {/* Button 1: Let's Start */}
            <button
              onClick={() => {
                setWizardOpen(true);
                setCurrentStep(1);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 rounded-full bg-[#bef264] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition-all shadow-[0_0_30px_rgba(190,242,100,0.35)] active:scale-95 group"
            >
              <span>Let's Start</span>
              <div className="flex items-center text-zinc-950 font-bold text-sm tracking-tighter group-hover:translate-x-1 transition-transform">
                &gt;&gt;&gt;
              </div>
            </button>

            {/* Button 2: Explore the World of Muscle Builders */}
          </div>
        </div>
      </section>


      {/* 
        ========================================================================
        DYNAMICALLY REVEALED LOWER PAGE SECTIONS
        (Only rendered when user clicks "Explore the World of Muscle Builders")
        ========================================================================
      */}
      {showBottomSections && (
        <div id="bottom-sections" className="animate-fadeIn">
          {/* FEATURED SERVICES SECTION */}
          <section className="py-24 bg-[#09090b] border-b border-zinc-800/80 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center space-y-3 max-w-3xl mx-auto gsap-reveal" data-speed="clamp(0.95)">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>CUSTOMIZED TRANSFORMATIONS</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                  Tailored <span className="text-[#bef264]">Training Programs</span>
                </h2>
                <p className="text-zinc-400 text-sm">
                  Engineered with science-backed hypertrophy protocols & tailored nutrition strategy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_SERVICES.slice(0, 3).map((service, idx) => (
                  <div
                    key={service.id}
                    data-speed={idx % 2 === 0 ? "clamp(1.03)" : "clamp(0.98)"}
                    data-lag={(idx * 0.05).toString()}
                    className="gsap-reveal group relative flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-[#bef264]/60 transition-all duration-300 shadow-xl"
                  >
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                      />
                      <div className="absolute top-4 right-4 bg-zinc-950/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#bef264] border border-zinc-800">
                        {service.duration}
                      </div>
                      {service.popular && (
                        <div className="absolute top-4 left-4 bg-[#bef264] text-zinc-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                          Most Popular
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-xl font-extrabold text-white group-hover:text-[#bef264] transition">
                          {service.title}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{service.subtitle}</p>

                        <div className="pt-2">
                          <span className="text-3xl font-black text-white">${service.price}</span>
                          <span className="text-xs text-zinc-400 ml-1">/ {service.duration}</span>
                        </div>

                        <ul className="space-y-2 pt-2 border-t border-zinc-800/80 text-xs text-zinc-300">
                          {service.features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-[#bef264] mt-0.5 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link
                        href="/consultation"
                        className="w-full text-center rounded-2xl bg-zinc-800 hover:bg-[#bef264] hover:text-zinc-950 py-3 text-xs font-black uppercase tracking-wider text-zinc-200 transition shadow-md"
                      >
                        Enroll / Book Consultation
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4 gsap-reveal">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#bef264] hover:underline transition"
                >
                  View All Coaching Packages <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* TRANSFORMATION PROOF SHOWCASE */}
          <section className="py-24 bg-zinc-900/30 border-b border-zinc-800/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center space-y-3 max-w-3xl mx-auto gsap-reveal" data-speed="clamp(0.95)">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
                  <Award className="h-3.5 w-3.5" />
                  <span>VERIFIED RESULTS</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                  Real Client <span className="text-[#bef264]">Transformations</span>
                </h2>
                <p className="text-zinc-400 text-sm">See how everyday individuals achieved extraordinary physique changes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {MOCK_TRAINER.transformations.map((t, idx) => (
                  <div
                    key={t.id}
                    data-speed="clamp(1.02)"
                    data-lag={(idx * 0.08).toString()}
                    className="gsap-reveal rounded-3xl border border-zinc-800/90 bg-zinc-900/80 p-6 flex flex-col justify-between space-y-6 shadow-xl hover:border-[#bef264]/40 transition"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden border border-zinc-800">
                        <div className="relative">
                          <img src={t.imageBefore} alt="Before" className="h-40 w-full object-cover" />
                          <span className="absolute bottom-2 left-2 bg-zinc-950/90 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded">
                            BEFORE
                          </span>
                        </div>
                        <div className="relative">
                          <img src={t.imageAfter} alt="After" className="h-40 w-full object-cover" />
                          <span className="absolute bottom-2 right-2 bg-[#bef264] text-zinc-950 text-[10px] font-extrabold px-2 py-0.5 rounded">
                            AFTER
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-white text-base">{t.clientName}</h3>
                        <p className="text-xs text-[#bef264] font-semibold">{t.duration} Transformation</p>
                      </div>

                      <p className="text-xs italic text-zinc-300 leading-relaxed">"{t.quote}"</p>
                    </div>

                    <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
                      <span>Weight Shift:</span>
                      <span className="font-bold text-[#bef264]">
                        {t.weightLostKg ? `-${t.weightLostKg} kg fat` : ""} {t.muscleGainedKg ? `+${t.muscleGainedKg} kg muscle` : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FINAL CONSULTATION CTA BANNER */}
          <section className="py-24 bg-gradient-to-b from-[#09090b] via-zinc-950 to-[#09090b] text-white relative">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8 gsap-reveal" data-speed="clamp(0.95)">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-4 py-1.5 text-xs font-bold text-[#bef264]">
                <ShieldCheck className="h-4 w-4" />
                <span>LIMITED WEEKLY CONSULTATION SLOTS</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight">
                Ready to Build Your <span className="text-[#bef264]">Best Physique?</span>
              </h2>

              <p className="text-zinc-400 text-base max-w-2xl mx-auto leading-relaxed">
                Book a 1-on-1 strategy call directly with Coach Vikrant to audit your body composition, optimize your training structure, and lock in your custom roadmap.
              </p>

              <div>
                <Link
                  href="/consultation"
                  className="inline-flex items-center gap-3 rounded-full bg-[#bef264] px-10 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition shadow-[0_0_40px_rgba(190,242,100,0.35)] active:scale-95"
                >
                  Book 1-on-1 Strategy Session
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
    </>
  );
}
