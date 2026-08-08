"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Dumbbell, Sparkles, X, ArrowRight, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceProgram } from "@/lib/types";
import { MOCK_SERVICES } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceProgram[]>(MOCK_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<ServiceProgram | null>(null);

  useEffect(() => {
    fetchServices(selectedCategory);
  }, [selectedCategory]);

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
  }, [services]);

  const fetchServices = async (category: string) => {
    try {
      const url = category === "all" ? "/api/services" : `/api/services?category=${category}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setServices(json.data);
      }
    } catch {
      // Fallback to local filtering
      if (category === "all") setServices(MOCK_SERVICES);
      else setServices(MOCK_SERVICES.filter((s) => s.category === category));
    }
  };

  const categories = [
    { id: "all", label: "All Programs" },
    { id: "coaching", label: "1-on-1 Coaching" },
    { id: "fat-loss", label: "Fat Loss & Shred" },
    { id: "muscle-gain", label: "Muscle Gain" },
    { id: "nutrition", label: "Nutrition & Habits" },
  ];

  return (
    <div className="relative min-h-screen bg-[#09090b] pt-28 sm:pt-32 pb-20 text-zinc-100 overflow-hidden select-none">
      {/* Ambient Radial Backlight Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#bef264]/10 rounded-full blur-[150px] pointer-events-none -z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto gsap-reveal" data-speed="clamp(0.95)">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-4 py-1.5 text-xs font-bold text-[#bef264]">
            <Zap className="h-3.5 w-3.5" />
            <span>COACHING & TRAINING PROGRAMS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
            SELECT YOUR <span className="text-[#bef264]">TRANSFORMATION</span> PATH
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Every program is structured around proven training principles, customized nutrition plans, and direct accountability with Coach Vikrant.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 gsap-reveal">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#bef264] text-zinc-950 shadow-[0_0_20px_rgba(190,242,100,0.35)] scale-105"
                  : "border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-[#bef264]/50 hover:bg-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={service.id}
              data-speed={idx % 2 === 0 ? "clamp(1.02)" : "clamp(0.98)"}
              className="gsap-reveal rounded-3xl border border-zinc-800/90 bg-zinc-900/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#bef264]/60 transition-all duration-300 shadow-2xl relative overflow-hidden group"
            >
              {service.popular && (
                <div className="absolute top-4 right-4 bg-[#bef264] text-zinc-950 font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md z-10">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#bef264]/10 border border-[#bef264]/30 text-[#bef264] flex items-center justify-center font-bold">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-[#bef264] transition">
                      {service.title}
                    </h3>
                    <span className="text-xs text-[#bef264] font-semibold">{service.duration} Program</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{service.subtitle}</p>

                <div className="py-3 border-y border-zinc-800/80 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">${service.price}</span>
                  <span className="text-xs text-zinc-400">USD / {service.duration}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">What's Included:</p>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#bef264] mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
                <button
                  onClick={() => setSelectedService(service)}
                  className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 py-3 text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer"
                >
                  View Details
                </button>
                <Link
                  href={`/consultation?service=${service.id}`}
                  className="flex-1 text-center rounded-2xl bg-[#bef264] hover:bg-[#a3e635] py-3 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-[0_0_20px_rgba(190,242,100,0.25)] transition active:scale-95"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Dialog for Detail View */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900/95 p-6 sm:p-8 space-y-6 shadow-2xl">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#bef264] bg-[#bef264]/10 border border-[#bef264]/30 px-3 py-1 rounded-full inline-block">
                  {selectedService.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">{selectedService.title}</h3>
                <p className="text-xs text-zinc-400">{selectedService.subtitle}</p>
              </div>

              <div className="space-y-4 text-sm text-zinc-300">
                <div>
                  <h4 className="font-bold text-white mb-1 text-xs uppercase tracking-wider">Full Overview:</h4>
                  <p className="leading-relaxed text-xs text-zinc-300">{selectedService.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <h4 className="font-bold text-[#bef264] mb-1 text-xs uppercase tracking-wider">Ideal Candidate:</h4>
                  <p className="text-xs text-zinc-300">{selectedService.idealFor}</p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider">Included Deliverables:</h4>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {selectedService.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#bef264]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                <div className="text-left">
                  <p className="text-2xl font-black text-white">${selectedService.price}</p>
                  <p className="text-[10px] text-zinc-400">{selectedService.duration}</p>
                </div>
                <Link
                  href={`/consultation?service=${selectedService.id}`}
                  onClick={() => setSelectedService(null)}
                  className="flex-1 text-center rounded-full bg-[#bef264] hover:bg-[#a3e635] py-3.5 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-[0_0_30px_rgba(190,242,100,0.35)] transition active:scale-95"
                >
                  Proceed to Book / Enroll
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
