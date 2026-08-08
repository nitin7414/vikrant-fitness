"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Award,
  ShieldCheck,
  Dumbbell,
  Users,
  Target,
  HeartPulse,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Star,
  HelpCircle,
  Zap,
  Check,
  User,
  Flame,
  AlertCircle,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MOCK_TRAINER,
  MOCK_SERVICES,
  MOCK_TESTIMONIALS,
  MOCK_FAQS,
  MOCK_PACKAGES,
} from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExploreContentProps {
  onOpenWizard?: () => void;
}

export function ExploreContent({ onOpenWizard }: ExploreContentProps) {
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");

  // Inline Lead-Capture Form State (Section 8)
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadGoal, setLeadGoal] = useState("Fat Loss & Shredding");
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const revealElements = document.querySelectorAll(".gsap-reveal-explore");
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
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

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;
    setLeadSubmitting(true);
    setTimeout(() => {
      setLeadSubmitting(false);
      setLeadSuccess(true);
    }, 800);
  };

  const handleFloatingCta = () => {
    if (onOpenWizard) {
      onOpenWizard();
    } else {
      const ctaSec = document.getElementById("explore-final-cta");
      if (ctaSec) {
        ctaSec.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-[#bef264] selection:text-zinc-950 overflow-hidden">
      {/* Ambient Radial Backlight Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#bef264]/10 rounded-full blur-[160px] pointer-events-none -z-0" />

      {/* 
        ========================================================================
        SECTION 1: MINI HERO / INTRO STRIP
        Condensed version of landing hero (trainer name, tagline, small physique visual)
        ========================================================================
      */}
      <section className="relative pt-12 pb-16 border-b border-zinc-800/80 bg-[#09090b]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 sm:p-10 rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="space-y-4 max-w-2xl text-left z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-4 py-1.5 text-xs font-bold text-[#bef264]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>EXPLORE THE WORLD OF MUSCLE BUILDERS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                COACH <span className="text-[#bef264]">VIKRANT</span>
              </h1>
              <p className="text-zinc-300 text-sm sm:text-base font-semibold leading-relaxed">
                {MOCK_TRAINER.title} — Science-backed hypertrophy, tailored fat loss protocols, and 1-on-1 personal accountability.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-zinc-400 pt-1">
                <span className="flex items-center gap-1.5 text-[#bef264]">
                  <CheckCircle2 className="h-4 w-4" /> 8+ Yrs Experience
                </span>
                <span className="flex items-center gap-1.5 text-[#bef264]">
                  <CheckCircle2 className="h-4 w-4" /> 1,250+ Clients Trained
                </span>
                <span className="flex items-center gap-1.5 text-[#bef264]">
                  <CheckCircle2 className="h-4 w-4" /> 98% Success Rate
                </span>
              </div>
            </div>

            {/* Small Physique Visual */}
            <div className="relative shrink-0 z-10">
              <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-2xl overflow-hidden border-2 border-[#bef264]/50 shadow-[0_0_30px_rgba(190,242,100,0.25)]">
                <img
                  src="/dp-image3.jpg"
                  alt="Coach Vikrant"
                  className="h-full w-full object-cover object-top filter brightness-95"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 2: ABOUT THE TRAINER
        Credentials, certifications, years of experience, personal story/mission
        ========================================================================
      */}
      <section className="py-20 border-b border-zinc-800/80 bg-[#09090b] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto gsap-reveal-explore">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
              <Award className="h-3.5 w-3.5" />
              <span>HEAD COACH CREDENTIALS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              About Coach <span className="text-[#bef264]">Vikrant</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Dedicated to helping individuals achieve peak physical transformation through evidence-based biomechanics and sustainable nutrition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center gsap-reveal-explore">
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/70 space-y-2 hover:border-[#bef264]/40 transition shadow-xl">
              <Users className="h-8 w-8 text-[#bef264] mx-auto" />
              <p className="text-4xl font-black text-white">{MOCK_TRAINER.clientsTrained}+</p>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Active Clients</p>
            </div>
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/70 space-y-2 hover:border-[#bef264]/40 transition shadow-xl">
              <Target className="h-8 w-8 text-[#bef264] mx-auto" />
              <p className="text-4xl font-black text-white">{MOCK_TRAINER.successRate}%</p>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Success Benchmark</p>
            </div>
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/70 space-y-2 hover:border-[#bef264]/40 transition shadow-xl">
              <Dumbbell className="h-8 w-8 text-[#bef264] mx-auto" />
              <p className="text-4xl font-black text-white">{MOCK_TRAINER.experienceYears}+ Yrs</p>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Dedicated Experience</p>
            </div>
            <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/70 space-y-2 hover:border-[#bef264]/40 transition shadow-xl">
              <HeartPulse className="h-8 w-8 text-[#bef264] mx-auto" />
              <p className="text-4xl font-black text-white">{MOCK_TRAINER.transformationsCompleted}+</p>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Body Recomps</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gsap-reveal-explore">
            {MOCK_TRAINER.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/70 flex items-start gap-4 hover:border-[#bef264]/60 transition-all duration-300 shadow-xl"
              >
                <ShieldCheck className="h-6 w-6 text-[#bef264] shrink-0 mt-1" />
                <span className="text-xs font-black text-zinc-200 leading-relaxed uppercase tracking-wide">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 3: TRANSFORMATION PROOF
        Before/after images, client results, progress stats
        ========================================================================
      */}
      <section className="py-24 bg-zinc-900/30 border-b border-zinc-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto gsap-reveal-explore">
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
            {MOCK_TRAINER.transformations.map((t) => (
              <div
                key={t.id}
                className="gsap-reveal-explore rounded-3xl border border-zinc-800/90 bg-zinc-900/80 p-6 flex flex-col justify-between space-y-6 shadow-xl hover:border-[#bef264]/40 transition"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden border border-zinc-800">
                    <div className="relative">
                      <img src={t.imageBefore} alt="Before" className="h-44 w-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-zinc-950/90 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        BEFORE
                      </span>
                    </div>
                    <div className="relative">
                      <img src={t.imageAfter} alt="After" className="h-44 w-full object-cover" />
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

      {/* 
        ========================================================================
        SECTION 4: SERVICES / TRAINING STYLES
        1:1 coaching, group sessions, online plans, nutrition coaching cards
        ========================================================================
      */}
      <section className="py-24 bg-[#09090b] border-b border-zinc-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto gsap-reveal-explore">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
              <Zap className="h-3.5 w-3.5" />
              <span>TRAINING STYLES & PROGRAMS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              Services & <span className="text-[#bef264]">Coaching Plans</span>
            </h2>
            <p className="text-zinc-400 text-sm">
              Customized training splits engineered for progressive overload and metabolic health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_SERVICES.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="gsap-reveal-explore group relative flex flex-col rounded-3xl border border-zinc-800 bg-zinc-900/80 overflow-hidden hover:border-[#bef264]/60 transition-all duration-300 shadow-xl"
              >
                <div className="h-48 overflow-hidden relative">
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
                    Book Consultation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 5: PACKAGES / PRICING
        Clear tiers with pricing and features per package
        ========================================================================
      */}
      <section className="py-24 bg-zinc-900/40 border-b border-zinc-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto gsap-reveal-explore">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>TRANSPARENT PRICING</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              Coaching <span className="text-[#bef264]">Packages & Tiers</span>
            </h2>
            <p className="text-zinc-400 text-sm">Select the level of guidance and accountability that fits your goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`gsap-reveal-explore rounded-3xl p-8 flex flex-col justify-between space-y-8 relative overflow-hidden transition-all duration-300 shadow-2xl ${
                  pkg.popular
                    ? "bg-zinc-900 border-2 border-[#bef264] shadow-[0_0_30px_rgba(190,242,100,0.2)] scale-105"
                    : "bg-zinc-900/80 border border-zinc-800 hover:border-[#bef264]/50"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-[#bef264] text-zinc-950 font-black text-[10px] uppercase tracking-wider px-4 py-1 rounded-bl-xl shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#bef264] uppercase tracking-widest">{pkg.duration}</span>
                    <h3 className="text-2xl font-black text-white mt-1 uppercase">{pkg.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{pkg.tagline}</p>
                  </div>

                  <div className="py-4 border-y border-zinc-800/80 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">${pkg.price}</span>
                    <span className="text-xs text-zinc-400">USD / {pkg.duration}</span>
                  </div>

                  <ul className="space-y-3 text-xs text-zinc-300">
                    {pkg.features.map((feat: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#bef264] mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/consultation"
                  className={`w-full text-center rounded-2xl py-3.5 text-xs font-black uppercase tracking-wider transition shadow-md ${
                    pkg.popular
                      ? "bg-[#bef264] text-zinc-950 hover:bg-[#a3e635] shadow-[0_0_20px_rgba(190,242,100,0.35)]"
                      : "bg-zinc-800 text-white hover:bg-[#bef264] hover:text-zinc-950"
                  }`}
                >
                  {pkg.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 6: TESTIMONIALS / REVIEWS
        Placed RIGHT AFTER PRICING to reduce purchase hesitation
        ========================================================================
      */}
      <section className="py-24 bg-[#09090b] border-b border-zinc-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto gsap-reveal-explore">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
              <Star className="h-3.5 w-3.5 fill-[#bef264]" />
              <span>CLIENT REVIEWS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              What Clients <span className="text-[#bef264]">Say</span>
            </h2>
            <p className="text-zinc-400 text-sm">Real feedback from verified personal coaching clients.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="gsap-reveal-explore rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col justify-between space-y-6 shadow-xl hover:border-[#bef264]/50 transition"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#bef264]">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#bef264]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#bef264] bg-[#bef264]/10 border border-[#bef264]/30 px-2.5 py-0.5 rounded-full">
                      {t.transformationTag}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed italic">"{t.comment}"</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                  <img src={t.avatar} alt={t.clientName} className="h-10 w-10 rounded-full object-cover ring-2 ring-[#bef264]" />
                  <div>
                    <h4 className="font-extrabold text-white text-xs">{t.clientName}</h4>
                    <p className="text-[10px] text-zinc-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 7: FAQ
        Cancellation policy, beginner-friendliness, equipment needed, contract terms
        ========================================================================
      */}
      <section className="py-24 bg-zinc-900/30 border-b border-zinc-800/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto gsap-reveal-explore">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              Got <span className="text-[#bef264]">Questions?</span>
            </h2>
            <p className="text-zinc-400 text-sm">Everything you need to know before locking in your coaching roadmap.</p>
          </div>

          <div className="space-y-4 gsap-reveal-explore">
            {MOCK_FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/90 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-[#bef264] transition cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-[#bef264] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 8: FINAL CTA / CONTACT / LEAD-CAPTURE FORM
        Reuse same lead-capture form style as landing page "Start My Transformation"
        ========================================================================
      */}
      <section id="explore-final-cta" className="py-24 bg-[#09090b] relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12 gsap-reveal-explore">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-4 py-1.5 text-xs font-bold text-[#bef264]">
              <ShieldCheck className="h-4 w-4" />
              <span>START YOUR PHYSICAL OVERHAUL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              Ready to Build Your <span className="text-[#bef264]">Best Physique?</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Submit your details below to request a 1-on-1 strategy call directly with Coach Vikrant.
            </p>
          </div>

          {leadSuccess ? (
            <div className="rounded-3xl border border-[#bef264]/50 bg-zinc-900 p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-md max-w-xl mx-auto">
              <div className="h-16 w-16 rounded-full bg-[#bef264]/20 text-[#bef264] border border-[#bef264]/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(190,242,100,0.3)]">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase">Application Received!</h3>
                <p className="text-xs text-zinc-300">
                  Thank you, <span className="font-bold text-[#bef264]">{leadName}</span>. Coach Vikrant will contact you via Email & WhatsApp within 24 hours.
                </p>
              </div>
              <button
                onClick={() => setLeadSuccess(false)}
                className="rounded-full bg-[#bef264] px-8 py-3 text-xs font-black uppercase text-zinc-950 hover:bg-[#a3e635] transition"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-10 space-y-6 shadow-2xl max-w-xl mx-auto backdrop-blur-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Alex Turner"
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base sm:text-xs text-white placeholder-zinc-600 focus:border-[#bef264] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base sm:text-xs text-white placeholder-zinc-600 focus:border-[#bef264] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Primary Fitness Goal *</label>
                  <select
                    value={leadGoal}
                    onChange={(e) => setLeadGoal(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base sm:text-xs text-white focus:border-[#bef264] focus:outline-none transition"
                  >
                    <option value="Fat Loss & Shredding">Fat Loss & Shredding</option>
                    <option value="Hypertrophy Muscle Gain">Hypertrophy Muscle Gain</option>
                    <option value="Body Recomposition">Body Recomposition</option>
                    <option value="1-on-1 Elite Personal Coaching">1-on-1 Elite Personal Coaching</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={leadSubmitting}
                className="w-full rounded-full bg-[#bef264] py-4 text-xs font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition shadow-[0_0_30px_rgba(190,242,100,0.35)] active:scale-95 cursor-pointer"
              >
                {leadSubmitting ? "Submitting Inquiry..." : "Start My Transformation"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 
        ========================================================================
        STICKY / FLOATING CTA BUTTON (VISIBLE THROUGHOUT SCROLL)
        ========================================================================
      */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 animate-bounce hover:animate-none">
        <button
          onClick={handleFloatingCta}
          className="flex items-center gap-2 rounded-full bg-[#bef264] px-6 py-3 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-[0_0_30px_rgba(190,242,100,0.45)] hover:bg-[#a3e635] transition-all active:scale-95 cursor-pointer border border-zinc-950"
        >
          <Sparkles className="h-4 w-4 text-zinc-950" />
          <span>Start My Transformation</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
