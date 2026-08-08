"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Dumbbell, Calendar, LogOut, User, ArrowRight, Sparkles, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Hide top header on scroll down
        setIsVisible(false);
        setMobileMenuOpen(false);
      } else {
        // Re-appear on scroll up or at top
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/", id: "01" },
    { name: "Services", href: "/services", id: "02" },
    { name: "About Me", href: "/about", id: "03" },
    { name: "1 to 1 Consultation", href: "/consultation", id: "04" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* MAIN STICKY TOP HEADER */}
      <header
        className={`sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group z-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#bef264] text-zinc-950 shadow-lg shadow-[#bef264]/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                VIKRANT <span className="text-[#bef264] font-extrabold">FITNESS</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400">
                Elite Coaching & Transformation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-5 py-2 backdrop-blur-md shadow-inner shrink-0">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 text-xs font-bold transition-all rounded-full whitespace-nowrap ${
                    active
                      ? "text-[#bef264] bg-zinc-800/80 shadow-sm"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800/40"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#bef264] rounded-full blur-[1px]"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Profile */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/consultation"
              className="flex items-center gap-2 rounded-full bg-[#bef264] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition-all shadow-lg shadow-[#bef264]/20 active:scale-95 whitespace-nowrap"
            >
              Contact Us
            </Link>

            {status === "authenticated" && session?.user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-700 transition">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-7 w-7 rounded-full object-cover ring-2 ring-[#bef264]/50"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-[#bef264]/20 text-[#bef264] flex items-center justify-center font-bold text-xs">
                      {session.user.name?.[0] || "U"}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate font-medium text-xs">
                    {session.user.name?.split(" ")[0] || "Client"}
                  </span>
                </button>

                {/* User Dropdown */}
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-3 py-2 border-b border-zinc-800 text-xs">
                    <p className="font-semibold text-white">{session.user.name}</p>
                    <p className="text-zinc-400 truncate text-[11px]">{session.user.email}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-zinc-800 transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-xs font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white transition whitespace-nowrap"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* ANIMATED STYLISH HAMBURGER BUTTON */}
          <div className="flex lg:hidden items-center gap-2 z-50">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`relative flex flex-col justify-center items-center h-11 w-11 rounded-2xl border transition-all duration-300 shadow-md ${
                mobileMenuOpen
                  ? "bg-zinc-900 border-[#bef264] shadow-[0_0_15px_rgba(190,242,100,0.3)]"
                  : "bg-zinc-900/90 border-zinc-800/90 hover:border-[#bef264]/50"
              }`}
              aria-label="Toggle Navigation Menu"
            >
              <div className="relative w-6 h-5 flex flex-col justify-between items-center">
                {/* Top Bar */}
                <span
                  className={`w-6 h-[2.5px] bg-[#bef264] rounded-full transition-all duration-300 transform origin-center ${
                    mobileMenuOpen ? "rotate-45 translate-y-[9px]" : ""
                  }`}
                />
                {/* Middle Bar */}
                <span
                  className={`w-4 h-[2px] bg-white rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0 scale-0" : "opacity-90"
                  }`}
                />
                {/* Bottom Bar */}
                <span
                  className={`w-6 h-[2.5px] bg-[#bef264] rounded-full transition-all duration-300 transform origin-center ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* 
        INDEPENDENT FULL-SCREEN MOBILE OVERLAY (SIBLING TO HEADER TO PREVENT CONTAINING BLOCK OVERLAPS)
      */}
      <div
        className={`fixed inset-0 z-[100] bg-[#09090b] text-white flex flex-col justify-between lg:hidden px-6 pt-24 pb-8 overflow-y-auto transition-all duration-300 ease-out ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-6 pointer-events-none"
        }`}
      >
        {/* Overlay Top Bar with Logo & Close Button */}
        <div className="absolute top-0 left-0 right-0 h-20 px-6 flex items-center justify-between border-b border-zinc-800/80 bg-[#09090b] z-10">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#bef264] text-zinc-950 shadow-md">
              <Dumbbell className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-black text-white">
              VIKRANT <span className="text-[#bef264]">FITNESS</span>
            </span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-900 border border-[#bef264] text-[#bef264] shadow-[0_0_12px_rgba(190,242,100,0.3)]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links List */}
        <div className="space-y-4 pt-4 my-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264] mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Let's Go</span>
          </div>

          <div className="flex flex-col gap-3">
            {navLinks.map((link, idx) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    transitionDelay: `${mobileMenuOpen ? idx * 70 + 60 : 0}ms`,
                  }}
                  className={`group relative flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 ${
                    mobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                  } ${
                    active
                      ? "bg-zinc-900 border-[#bef264] text-[#bef264] shadow-[0_0_20px_rgba(190,242,100,0.2)]"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#bef264]">
                      {link.id}
                    </span>
                    <span className="text-lg font-extrabold tracking-tight uppercase">
                      {link.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {active && (
                      <span className="px-3 py-0.5 rounded-full bg-[#bef264] text-zinc-950 text-[10px] font-black uppercase">
                        Active
                      </span>
                    )}
                    <ArrowRight className="h-5 w-5 text-[#bef264] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions in Drawer */}
        <div className="pt-6 border-t border-zinc-800/80 space-y-3">
          <Link
            href="/consultation"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-[#bef264] py-4 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-[0_0_25px_rgba(190,242,100,0.35)] hover:bg-[#a3e635] transition active:scale-95"
          >
            <Calendar className="h-4 w-4" />
            Book 1-on-1 Consultation
          </Link>

          {status === "authenticated" && session?.user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full text-center rounded-2xl border border-red-500/30 bg-red-500/10 py-3.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition"
            >
              Sign Out ({session.user.name?.split(" ")[0]})
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 py-3.5 text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-800 transition"
            >
              <User className="h-4 w-4 text-[#bef264]" />
              Sign In / Sign Up with Google
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
