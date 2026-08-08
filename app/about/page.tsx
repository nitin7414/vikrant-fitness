"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Calendar,
  ArrowRight,
  HeartPulse,
  Target,
  Users,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOCK_TRAINER } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const revealElements = document.querySelectorAll(".gsap-reveal");
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, scale: 0.97 },
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 pt-28 sm:pt-32 pb-20 overflow-hidden select-none">
      {/* Ambient Backlight Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#bef264]/10 rounded-full blur-[150px] pointer-events-none -z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
        {/* HERO INTRO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 gsap-reveal" data-speed="clamp(0.96)">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-4 py-1.5 text-xs font-bold text-[#bef264]">
              <Award className="h-3.5 w-3.5" />
              <span>MEET YOUR HEAD COACH</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-tight">
              COACH <span className="text-[#bef264]">VIKRANT</span>
            </h1>

            <p className="text-lg font-bold text-zinc-200">
              {MOCK_TRAINER.title}
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed">
              {MOCK_TRAINER.bio}
            </p>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs sm:text-sm italic text-zinc-300 border-l-4 border-l-[#bef264]">
              "I believe physical fitness is not a 30-day challenge—it is the foundational pillar of mental resilience, confidence, and long-term health. My methodology combines strict exercise biomechanics with sustainable, real-world nutrition strategies."
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/consultation"
                className="flex items-center gap-3 rounded-full bg-[#bef264] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition-all shadow-[0_0_30px_rgba(190,242,100,0.35)] active:scale-95 group cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span>Book 1-on-1 Strategy Session</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 gsap-reveal" data-speed="clamp(1.02)">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl group hover:border-[#bef264]/50 transition duration-500">
              <div className="absolute inset-0 bg-[#bef264]/15 blur-2xl rounded-full scale-90 -z-10" />
              <img
                src="/dp-image3.jpg"
                alt="Coach Vikrant"
                className="w-full h-[500px] object-cover object-top filter brightness-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent via-60% to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Coach Vikrant</p>
                  <p className="text-[11px] text-[#bef264]">Elite Body Recomp Specialist</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#bef264] text-zinc-950 flex items-center justify-center font-bold text-xs">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS & CREDENTIALS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center gsap-reveal">
          <div className="p-6 rounded-3xl border border-zinc-800/80 bg-zinc-900/60 space-y-2 hover:border-[#bef264]/40 transition shadow-xl">
            <Users className="h-8 w-8 text-[#bef264] mx-auto" />
            <p className="text-4xl font-black text-white">{MOCK_TRAINER.clientsTrained}+</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Active Clients</p>
          </div>
          <div className="p-6 rounded-3xl border border-zinc-800/80 bg-zinc-900/60 space-y-2 hover:border-[#bef264]/40 transition shadow-xl">
            <Target className="h-8 w-8 text-[#bef264] mx-auto" />
            <p className="text-4xl font-black text-white">{MOCK_TRAINER.successRate}%</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Success Benchmark</p>
          </div>
          <div className="p-6 rounded-3xl border border-zinc-800/80 bg-zinc-900/60 space-y-2 hover:border-[#bef264]/40 transition shadow-xl">
            <Dumbbell className="h-8 w-8 text-[#bef264] mx-auto" />
            <p className="text-4xl font-black text-white">{MOCK_TRAINER.experienceYears}+ Yrs</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Dedicated Experience</p>
          </div>
          <div className="p-6 rounded-3xl border border-zinc-800/80 bg-zinc-900/60 space-y-2 hover:border-[#bef264]/40 transition shadow-xl">
            <HeartPulse className="h-8 w-8 text-[#bef264] mx-auto" />
            <p className="text-4xl font-black text-white">{MOCK_TRAINER.transformationsCompleted}+</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Body Recomps</p>
          </div>
        </div>

        {/* CERTIFICATIONS */}
        <div className="space-y-8 gsap-reveal">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>VERIFIED CREDENTIALS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Certifications & <span className="text-[#bef264]">Expertise</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_TRAINER.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-zinc-800/90 bg-zinc-900/70 flex items-start gap-4 hover:border-[#bef264]/60 transition-all duration-300 shadow-xl"
              >
                <ShieldCheck className="h-6 w-6 text-[#bef264] shrink-0 mt-1" />
                <span className="text-xs font-extrabold text-zinc-200 leading-relaxed uppercase tracking-wide">{cert}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COACHING PHILOSOPHY */}
        <div className="p-8 sm:p-12 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-[#09090b] to-zinc-900 space-y-8 gsap-reveal shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>PILLARS OF SUCCESS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              My Coaching <span className="text-[#bef264]">Philosophy</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_TRAINER.philosophy.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#bef264]/40 transition">
                <CheckCircle2 className="h-5 w-5 text-[#bef264] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="text-center py-16 rounded-3xl border border-[#bef264]/40 bg-zinc-900/80 space-y-6 gsap-reveal shadow-[0_0_50px_rgba(190,242,100,0.1)]">
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Ready to Work 1-on-1 With <span className="text-[#bef264]">Coach Vikrant?</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Book a dedicated consultation session today to discuss your goals, schedule, and custom transformation strategy.
          </p>
          <div>
            <Link
              href="/consultation"
              className="inline-flex items-center gap-3 rounded-full bg-[#bef264] px-10 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition shadow-[0_0_40px_rgba(190,242,100,0.35)] active:scale-95"
            >
              Book 1-on-1 Consultation <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
