"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Dumbbell, Sparkles, X, ArrowRight, Zap } from "lucide-react";
import { ServiceProgram } from "@/lib/types";
import { MOCK_SERVICES } from "@/lib/data";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceProgram[]>(MOCK_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<ServiceProgram | null>(null);

  useEffect(() => {
    fetchServices(selectedCategory);
  }, [selectedCategory]);

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
    <div className="min-h-screen bg-zinc-950 pt-28 sm:pt-32 pb-16 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
            <Zap className="h-3.5 w-3.5" />
            <span>Coaching & Training Programs</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            SELECT YOUR <span className="text-amber-400">TRANSFORMATION</span> PATH
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Every program is structured around proven training principles, customized nutrition plans, and direct accountability with Coach Vikrant.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20 scale-105"
                  : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-amber-500/40 transition duration-300 shadow-xl relative overflow-hidden"
            >
              {service.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-white">{service.title}</h3>
                    <span className="text-xs text-amber-400 font-semibold">{service.duration} Program</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{service.subtitle}</p>

                <div className="py-2 border-y border-zinc-800/80 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">${service.price}</span>
                  <span className="text-xs text-zinc-400">USD / {service.duration}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">What's Included:</p>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                <button
                  onClick={() => setSelectedService(service)}
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 py-3 text-xs font-bold text-zinc-200 transition"
                >
                  View Details & Ideal For
                </button>
                <Link
                  href={`/consultation?service=${service.id}`}
                  className="flex-1 text-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 py-3 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-md transition"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Dialog for Detail View */}
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-2xl">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  {selectedService.category}
                </span>
                <h3 className="text-2xl font-black text-white">{selectedService.title}</h3>
                <p className="text-xs text-zinc-400">{selectedService.subtitle}</p>
              </div>

              <div className="space-y-4 text-sm text-zinc-300">
                <div>
                  <h4 className="font-bold text-white mb-1">Full Overview:</h4>
                  <p className="leading-relaxed text-xs text-zinc-300">{selectedService.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <h4 className="font-bold text-amber-400 mb-1 text-xs uppercase tracking-wider">Ideal Candidate:</h4>
                  <p className="text-xs text-zinc-300">{selectedService.idealFor}</p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2 text-xs">Included Deliverables:</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {selectedService.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
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
                  className="flex-1 text-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-md"
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
