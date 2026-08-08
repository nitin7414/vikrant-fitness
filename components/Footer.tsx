"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

interface FooterProps {
  forceRender?: boolean;
}

export function Footer({ forceRender = false }: FooterProps) {
  const pathname = usePathname();

  if (pathname === "/" && !forceRender) {
    return null;
  }
  return (
    <footer className="border-t border-zinc-800 bg-[#09090b] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 md:grid-cols-2">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#bef264] text-zinc-950 shadow-md shadow-[#bef264]/20">
                <Dumbbell className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                VIKRANT <span className="text-[#bef264]">FITNESS</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              Science-backed personal training, customized body transformations, and sustainable nutrition coaching designed for long-term health and peak physique performance.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
                { icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
                { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-[#bef264] hover:text-[#bef264] hover:bg-zinc-800 transition"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-[#bef264] transition flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-[#bef264]" /> Home Overview
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#bef264] transition flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-[#bef264]" /> Training Programs & Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#bef264] transition flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-[#bef264]" /> About Coach Vikrant
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="hover:text-[#bef264] transition flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-[#bef264]" /> 1-on-1 Consultation Booking
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#bef264] transition flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-[#bef264]" /> Sign In / Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Core Offerings</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="text-zinc-300 font-medium">1-on-1 Elite Personal Coaching</li>
              <li className="text-zinc-300 font-medium">Rapid Fat Loss & Recomp Protocol</li>
              <li className="text-zinc-300 font-medium">Hypertrophy & Strength Blueprint</li>
              <li className="text-zinc-300 font-medium">Precision Nutrition & Macro Plan</li>
              <li className="text-zinc-300 font-medium">Online Form Check & Biomechanics Audit</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#bef264] mt-0.5" />
                <span>coach@vikrantfitness.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#bef264] mt-0.5" />
                <span>+1 (800) 987-6543</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#bef264] mt-0.5" />
                <span>Global Online Coaching & Virtual Studio</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Vikrant Fitness. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-400 cursor-pointer">Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
