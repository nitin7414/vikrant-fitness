import React from "react";
import Link from "next/link";
import { Award, ShieldCheck, Dumbbell, Sparkles, CheckCircle2, Calendar, ArrowRight, HeartPulse, Target, Users } from "lucide-react";
import { MOCK_TRAINER } from "@/lib/data";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-28 sm:pt-32 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
        {/* HERO INTRO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
              <Award className="h-3.5 w-3.5" />
              <span>Meet Your Head Coach</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              COACH <span className="text-amber-400">VIKRANT</span>
            </h1>

            <p className="text-lg font-semibold text-zinc-300">
              {MOCK_TRAINER.title}
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed">
              {MOCK_TRAINER.bio}
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed">
              "I believe that physical fitness is not a temporary 30-day challenge—it is the foundational pillar of mental resilience, confidence, and longevity. My methodology combines strict exercise biomechanics with sustainable, real-world nutrition strategies."
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/consultation"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-md hover:from-amber-400 hover:to-amber-300 transition"
              >
                <Calendar className="h-4 w-4" />
                Book 1-on-1 Strategy Session
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop"
                alt="Vikrant Profile"
                className="w-full h-[450px] object-cover object-center filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* METRICS & CREDENTIALS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <Users className="h-8 w-8 text-amber-400 mx-auto" />
            <p className="text-3xl font-black text-white">{MOCK_TRAINER.clientsTrained}+</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Active Clients</p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <Target className="h-8 w-8 text-amber-400 mx-auto" />
            <p className="text-3xl font-black text-white">{MOCK_TRAINER.successRate}%</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Success Benchmark</p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <Dumbbell className="h-8 w-8 text-amber-400 mx-auto" />
            <p className="text-3xl font-black text-white">{MOCK_TRAINER.experienceYears}+ Yrs</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Dedicated Experience</p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-2">
            <HeartPulse className="h-8 w-8 text-amber-400 mx-auto" />
            <p className="text-3xl font-black text-white">{MOCK_TRAINER.transformationsCompleted}+</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Body Recomps</p>
          </div>
        </div>

        {/* CERTIFICATIONS */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Verified Credentials</h2>
            <p className="text-3xl font-black text-white">Certifications & Expertise</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_TRAINER.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 flex items-start gap-4 hover:border-amber-500/40 transition"
              >
                <ShieldCheck className="h-6 w-6 text-amber-400 shrink-0 mt-1" />
                <span className="text-xs font-bold text-zinc-200 leading-relaxed">{cert}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COACHING PHILOSOPHY */}
        <div className="p-8 sm:p-12 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Pillars of Success</h2>
            <p className="text-3xl font-black text-white">My Coaching Philosophy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_TRAINER.philosophy.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="text-center py-12 rounded-3xl border border-amber-500/30 bg-amber-500/10 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white">Ready to Work 1-on-1 With Coach Vikrant?</h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto">
            Book a dedicated consultation session today to discuss your goals, schedule, and custom transformation strategy.
          </p>
          <div>
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-lg"
            >
              Book 1-on-1 Consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
