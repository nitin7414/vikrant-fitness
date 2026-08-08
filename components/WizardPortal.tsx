"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  X,
  User,
  Flame,
  Award,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
interface FormData {
  name: string;
  email: string;
  age: string;
  weightKg: string;
  targetWeightKg: string;
  fitnessGoal: string;
  workoutDays: string;
}

interface WizardPortalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  getProgressPercentage: () => number;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Cinematic Intro — plays ONCE when wizard opens
   Phase 0 → "intro"  : lime circle bursts open
   Phase 1 → "words"  : dramatic text on lime screen
   Phase 2 → "reveal" : dark curtain sweeps down, form appears
   Phase 3 → "done"   : animation dismounted, form visible
───────────────────────────────────────────────────────────────────────────── */
type IntroPhase = "intro" | "words" | "reveal" | "done";

/* ─────────────────────────────────────────────────────────────────────────────
   NumberWheel — iOS-style drum-roll picker
   • Drag up/down to scroll through values
   • Center item snaps and glows in lime
   • +/- tap buttons on sides
───────────────────────────────────────────────────────────────────────────── */
const ITEM_H = 44; // height of each row in the drum
const VISIBLE = 3;  // rows shown (centre = selected)

function NumberWheel({
  value,
  onChange,
  min,
  max,
  unit,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
  label: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  // y offset: 0 = centre item is `value`
  // dragging UP increases value, dragging DOWN decreases
  const valueToY = (v: number) => -(v - min) * ITEM_H;
  const yToValue = (y: number) => clamp(Math.round(-y / ITEM_H) + min);

  const [dragY, setDragY] = React.useState(valueToY(value));
  const [isDragging, setIsDragging] = React.useState(false);

  // Keep dragY in sync when value changes from outside
  React.useEffect(() => {
    if (!isDragging) setDragY(valueToY(value));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isDragging]);

  const containerH = ITEM_H * VISIBLE;
  const totalItems = max - min + 1;
  const minY = -(totalItems - 1) * ITEM_H;
  const maxY = 0;

  const handleDragEnd = (_: unknown, info: { offset: { y: number } }) => {
    const raw = dragY + info.offset.y;
    const snapped = Math.round(raw / ITEM_H) * ITEM_H;
    const clamped = Math.min(maxY, Math.max(minY, snapped));
    setDragY(clamped);
    onChange(yToValue(clamped));
    setIsDragging(false);
  };

  const step = (dir: 1 | -1) => {
    const next = clamp(value + dir);
    onChange(next);
    setDragY(valueToY(next));
  };

  return (
    <div style={{
      background: "#111113",
      border: "2px solid #27272a",
      borderRadius: "20px",
      padding: "16px 20px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      userSelect: "none",
    }}>
      {/* Label */}
      <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#52525b" }}>{label}</span>

      {/* Drum */}
      <div style={{
        position: "relative",
        width: "100%",
        height: `${containerH}px`,
        overflow: "hidden",
        cursor: "grab",
      }}>
        {/* Selection highlight band */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: 0, right: 0,
          height: `${ITEM_H}px`,
          transform: "translateY(-50%)",
          background: "rgba(190,242,100,0.07)",
          borderTop: "1px solid rgba(190,242,100,0.25)",
          borderBottom: "1px solid rgba(190,242,100,0.25)",
          borderRadius: "10px",
          pointerEvents: "none",
          zIndex: 2,
        }} />

        {/* Top fade */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: `${ITEM_H * 1.8}px`,
          background: "linear-gradient(to bottom, #111113 0%, transparent 100%)",
          zIndex: 3, pointerEvents: "none",
        }} />
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: `${ITEM_H * 1.8}px`,
          background: "linear-gradient(to top, #111113 0%, transparent 100%)",
          zIndex: 3, pointerEvents: "none",
        }} />

        {/* Draggable list */}
        <motion.div
          drag="y"
          dragConstraints={{ top: minY - ITEM_H * 2, bottom: maxY + ITEM_H * 2 }}
          dragElastic={0.12}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          animate={{ y: dragY + ITEM_H * Math.floor(VISIBLE / 2) }}
          transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 32 }}
          style={{ position: "absolute", width: "100%", willChange: "transform" }}
        >
          {Array.from({ length: totalItems }, (_, i) => {
            const num = min + i;
            const isSelected = num === value;
            const dist = Math.abs(num - value);
            return (
              <div
                key={num}
                onClick={() => { onChange(num); setDragY(valueToY(num)); }}
                style={{
                  height: `${ITEM_H}px`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isSelected ? "38px" : dist === 1 ? "26px" : "20px",
                  fontWeight: 900,
                  color: isSelected ? "#bef264" : dist === 1 ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.1)",
                  textShadow: isSelected ? "0 0 20px rgba(190,242,100,0.7)" : "none",
                  transition: "color 0.2s, font-size 0.2s, text-shadow 0.2s",
                  cursor: "pointer",
                }}
              >
                {num}
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Unit + +/- controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={() => step(-1)}
          style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1e1e21", border: "1px solid #3f3f46", color: "#a1a1aa", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, transition: "all 0.15s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#bef264"; (e.currentTarget as HTMLElement).style.color = "#bef264"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#3f3f46"; (e.currentTarget as HTMLElement).style.color = "#a1a1aa"; }}
        >−</button>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#52525b", letterSpacing: "0.05em" }}>{unit}</span>
        <button
          onClick={() => step(1)}
          style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1e1e21", border: "1px solid #3f3f46", color: "#a1a1aa", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, transition: "all 0.15s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#bef264"; (e.currentTarget as HTMLElement).style.color = "#bef264"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#3f3f46"; (e.currentTarget as HTMLElement).style.color = "#a1a1aa"; }}
        >+</button>
      </div>
    </div>
  );
}

function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<IntroPhase>("intro");

  useEffect(() => {
    // Phase timeline
    const t1 = setTimeout(() => setPhase("words"),  500);   // circle done → show text
    const t2 = setTimeout(() => setPhase("reveal"), 1600);  // text done → curtain
    const t3 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2500); // curtain done → hand off

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* ── LAYER 1: Lime circle burst ── */}
      <AnimatePresence>
        {(phase === "intro" || phase === "words") && (
          <motion.div
            key="lime-circle"
            initial={{ scale: 0, borderRadius: "50%", opacity: 1 }}
            animate={{ scale: 30, borderRadius: "0%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              scale: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.25, delay: 0.1 },
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "120px",
              height: "120px",
              marginLeft: "-60px",
              marginTop: "-60px",
              background: "#bef264",
              transformOrigin: "center center",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── LAYER 2: Lime full-screen bg for text phase ── */}
      <AnimatePresence>
        {phase === "words" && (
          <motion.div
            key="lime-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.1 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "#bef264",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {/* Main dramatic word */}
            <motion.p
              initial={{ y: 80, opacity: 0, filter: "blur(12px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -60, opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(56px, 14vw, 140px)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "-0.04em",
                color: "#09090b",
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              It&apos;s Time.
            </motion.p>

            {/* Sub tagline */}
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(13px, 2vw, 20px)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                color: "rgba(9,9,11,0.55)",
                margin: 0,
              }}
            >
              Let&apos;s Build Your Empire
            </motion.p>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                marginTop: "12px",
                height: "3px",
                width: "clamp(60px, 10vw, 120px)",
                background: "#09090b",
                borderRadius: "99px",
                transformOrigin: "center",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LAYER 3: Dark curtain sweeps DOWN from top ── */}
      <AnimatePresence>
        {(phase === "reveal" || phase === "done") && (
          <motion.div
            key="dark-curtain"
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              background: "#09090b",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main WizardPortal
───────────────────────────────────────────────────────────────────────────── */
export function WizardPortal({
  isOpen,
  onClose,
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  getProgressPercentage,
}: WizardPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false); // true after intro animation completes

  useEffect(() => { setMounted(true); }, []);

  // Reset showForm whenever wizard opens so intro always plays
  useEffect(() => {
    if (isOpen) {
      setShowForm(false);
    }
  }, [isOpen]);

  // Lock ALL scroll layers when wizard open
  useEffect(() => {
    if (!isOpen) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      const sw = document.getElementById("smooth-wrapper");
      if (sw) sw.style.overflow = "";
      return;
    }
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const sw = document.getElementById("smooth-wrapper");
    if (sw) sw.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      const s = document.getElementById("smooth-wrapper");
      if (s) s.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const progress = getProgressPercentage();

  const QUOTES: Record<number, string> = {
    1: "About time you showed up! Let's build your empire 💪",
    2: "You're already ahead of 90% of people. Keep going!",
    3: "We're almost there — this is the big one! 🔥",
    4: "Absolute beast mode. Your protocol is locked in! 🏆",
  };

  const portalContent = (
    <>
      {/* Cinematic intro — plays until showForm = true */}
      {!showForm && (
        <CinematicIntro onComplete={() => setShowForm(true)} />
      )}

      {/* Wizard Form Shell — always in DOM so portal is present, but animated in */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="wizard-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 99999,
              background: "#09090b",
              display: "flex",
              flexDirection: "column",
              height: "100dvh",
              width: "100vw",
              overflow: "hidden",
              color: "white",
              fontFamily: "inherit",
            }}
          >
            {/* ══ TOP PROGRESS HEADER ══ */}
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                flexShrink: 0,
                background: "#0d0d10",
                borderBottom: "1px solid rgba(63,63,70,0.7)",
                padding: "16px 24px 14px",
              }}
            >
              {/* Row 1 — step dots + label + close */}
              <div style={{
                maxWidth: "672px", margin: "0 auto",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    {[1, 2, 3, 4].map((s) => (
                      <motion.div
                        key={s}
                        animate={{
                          width: s === currentStep ? "32px" : "10px",
                          background: s <= currentStep ? "#bef264" : "#3f3f46",
                          boxShadow: s === currentStep
                            ? "0 0 12px 3px rgba(190,242,100,0.65)"
                            : "none",
                        }}
                        transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
                        style={{ borderRadius: "999px", height: "10px" }}
                      />
                    ))}
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, fontFamily: "monospace",
                    color: "#71717a", textTransform: "uppercase", letterSpacing: "0.12em",
                  }}>
                    Step {currentStep} of 4
                  </span>
                </div>

                <button
                  onClick={onClose}
                  style={{
                    height: "36px", width: "36px", borderRadius: "10px",
                    background: "#18181b", border: "1px solid #27272a",
                    color: "#71717a", display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(190,242,100,0.6)";
                    (e.currentTarget as HTMLElement).style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#27272a";
                    (e.currentTarget as HTMLElement).style.color = "#71717a";
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Row 2 — Progress bar */}
              <div style={{ maxWidth: "672px", margin: "0 auto" }}>
                <div style={{
                  height: "12px", width: "100%", background: "#18181b",
                  borderRadius: "999px", border: "1px solid #27272a",
                  overflow: "hidden", padding: "2px",
                }}>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                    style={{
                      height: "100%", borderRadius: "999px",
                      background: "linear-gradient(90deg, #bef264 0%, #a3e635 50%, #bef264 100%)",
                      boxShadow: "0 0 20px 4px rgba(190,242,100,0.8)",
                    }}
                  />
                </div>

                {/* Row 3 — quote + percent */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginTop: "8px", paddingLeft: "2px", paddingRight: "2px",
                  }}
                >
                  <p style={{ fontSize: "11px", fontWeight: 700, fontStyle: "italic", color: "#bef264", margin: 0 }}>
                    &ldquo;{QUOTES[currentStep]}&rdquo;
                  </p>
                  <span style={{
                    fontSize: "13px", fontWeight: 900, color: "#bef264",
                    fontVariantNumeric: "tabular-nums", marginLeft: "12px", flexShrink: 0,
                  }}>
                    {progress}%
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* ══ SLIDE CONTENT ══ */}
            <div style={{
              flex: 1, overflow: "hidden", display: "flex",
              alignItems: "center", justifyContent: "center", padding: "32px 24px",
            }}>
              <div style={{ width: "100%", maxWidth: "672px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* ─── SLIDE 1 ─── */}
                    {currentStep === 1 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: "6px",
                            borderRadius: "999px", border: "1px solid rgba(190,242,100,0.3)",
                            background: "rgba(190,242,100,0.1)", padding: "4px 12px", width: "fit-content",
                          }}>
                            <User size={13} color="#bef264" />
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#bef264", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                              Step 1 — Personal Identification
                            </span>
                          </div>
                          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, textTransform: "uppercase", color: "white", letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>
                            What Should We <span style={{ color: "#bef264" }}>Call You?</span>
                          </h2>
                          <p style={{ color: "#71717a", fontSize: "14px", margin: 0 }}>Your name kicks off your personalized transformation roadmap.</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#52525b", marginBottom: "8px" }}>Full Name *</label>
                            <input
                              autoFocus
                              type="text"
                              placeholder="e.g. Vikrant Singh"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              style={{ width: "100%", background: "#18181b", border: "2px solid #27272a", borderRadius: "16px", padding: "16px 24px", fontSize: "22px", fontWeight: 700, color: "white", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                              onFocus={(e) => (e.target.style.borderColor = "#bef264")}
                              onBlur={(e) => (e.target.style.borderColor = "#27272a")}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#52525b", marginBottom: "8px" }}>Email (For Roadmap Delivery)</label>
                            <input
                              type="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              style={{ width: "100%", background: "#18181b", border: "2px solid #27272a", borderRadius: "16px", padding: "14px 24px", fontSize: "17px", fontWeight: 500, color: "white", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                              onFocus={(e) => (e.target.style.borderColor = "#bef264")}
                              onBlur={(e) => (e.target.style.borderColor = "#27272a")}
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={!formData.name.trim()}
                            onClick={() => setCurrentStep(2)}
                            style={{
                              display: "flex", alignItems: "center", gap: "10px",
                              borderRadius: "999px", background: formData.name.trim() ? "#bef264" : "#3f3f46",
                              border: "none", padding: "14px 28px", fontSize: "12px", fontWeight: 900,
                              textTransform: "uppercase", letterSpacing: "0.1em",
                              color: formData.name.trim() ? "#09090b" : "#71717a",
                              cursor: formData.name.trim() ? "pointer" : "not-allowed",
                              boxShadow: formData.name.trim() ? "0 0 30px rgba(190,242,100,0.4)" : "none",
                              transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                            }}
                          >
                            Next: Physical Metrics <ChevronRight size={16} strokeWidth={3} />
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* ─── SLIDE 2 ─── */}
                    {currentStep === 2 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "999px", border: "1px solid rgba(190,242,100,0.3)", background: "rgba(190,242,100,0.1)", padding: "4px 12px", width: "fit-content" }}>
                            <Flame size={13} color="#bef264" />
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#bef264", textTransform: "uppercase", letterSpacing: "0.08em" }}>Step 2 — Physical Metrics</span>
                          </div>
                          <h2 style={{ fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 900, textTransform: "uppercase", color: "white", letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>
                            Age &amp; <span style={{ color: "#bef264" }}>Body Weight</span>
                          </h2>

                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <NumberWheel
                            label="Age (Years)"
                            value={parseInt(formData.age) || 26}
                            min={16}
                            max={80}
                            unit="yrs"
                            onChange={(v) => setFormData({ ...formData, age: String(v) })}
                          />
                          <NumberWheel
                            label="Weight (KG)"
                            value={parseInt(formData.weightKg) || 75}
                            min={40}
                            max={200}
                            unit="kg"
                            onChange={(v) => setFormData({ ...formData, weightKg: String(v) })}
                          />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <NavBtn onClick={() => setCurrentStep(1)} dir="back" />
                          <NavBtn onClick={() => setCurrentStep(3)} label="Next: Fitness Target" />
                        </div>
                      </div>
                    )}

                    {/* ─── SLIDE 3 ─── */}
                    {currentStep === 3 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "999px", border: "1px solid rgba(190,242,100,0.3)", background: "rgba(190,242,100,0.1)", padding: "4px 12px", width: "fit-content" }}>
                            <Award size={13} color="#bef264" />
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#bef264", textTransform: "uppercase", letterSpacing: "0.08em" }}>Step 3 — Transformation Objective</span>
                          </div>
                          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, textTransform: "uppercase", color: "white", letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>
                            Pick Your <span style={{ color: "#bef264" }}>Primary Goal</span>
                          </h2>
                          <p style={{ color: "#71717a", fontSize: "14px", margin: 0 }}>This defines your entire training and nutrition protocol.</p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                          {[
                            { title: "Fat Loss & Shredding", desc: "Deficit protocol, lean-out" },
                            { title: "Hypertrophy Muscle Gain", desc: "Progressive overload, size" },
                            { title: "Body Recomposition", desc: "Simultaneous cut & build" },
                          ].map((goal, idx) => {
                            const sel = formData.fitnessGoal === goal.title;
                            return (
                              <motion.div
                                key={idx}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setFormData({ ...formData, fitnessGoal: goal.title })}
                                style={{
                                  cursor: "pointer", padding: "18px", borderRadius: "14px",
                                  border: sel ? "2px solid #bef264" : "2px solid #27272a",
                                  background: sel ? "#18181b" : "rgba(24,24,27,0.5)",
                                  boxShadow: sel ? "0 0 24px rgba(190,242,100,0.3)" : "none",
                                  display: "flex", flexDirection: "column", gap: "10px",
                                  transition: "border 0.25s, box-shadow 0.25s, background 0.25s",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 700, color: "#bef264" }}>0{idx + 1}</span>
                                  {sel && <Check size={14} color="#bef264" />}
                                </div>
                                <div>
                                  <h4 style={{ fontWeight: 900, fontSize: "13px", color: "white", margin: 0 }}>{goal.title}</h4>
                                  <p style={{ fontSize: "11px", color: "#52525b", margin: "4px 0 0" }}>{goal.desc}</p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <NavBtn onClick={() => setCurrentStep(2)} dir="back" />
                          <NavBtn onClick={() => setCurrentStep(4)} label="Generate Protocol" icon={<Sparkles size={15} />} />
                        </div>
                      </div>
                    )}

                    {/* ─── SLIDE 4 ─── */}
                    {currentStep === 4 && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", textAlign: "center" }}>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          style={{ display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "999px", border: "1px solid rgba(190,242,100,0.4)", background: "rgba(190,242,100,0.12)", padding: "6px 16px" }}
                        >
                          <Sparkles size={14} color="#bef264" />
                          <span style={{ fontSize: "11px", fontWeight: 900, color: "#bef264", textTransform: "uppercase", letterSpacing: "0.1em" }}>Protocol Generated — You&apos;re Unstoppable</span>
                        </motion.div>

                        <h2 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, textTransform: "uppercase", color: "white", letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>
                          Let&apos;s Go, <span style={{ color: "#bef264" }}>{formData.name}!</span>
                        </h2>

                        <div style={{ background: "#18181b", border: "2px solid rgba(190,242,100,0.35)", borderRadius: "20px", padding: "24px", maxWidth: "520px", width: "100%", textAlign: "left", boxShadow: "0 0 40px rgba(190,242,100,0.1)" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #27272a", paddingBottom: "12px", marginBottom: "16px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#52525b" }}>Client Profile</span>
                            <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 900, color: "#bef264" }}>✦ READY</span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                            <div>
                              <p style={{ fontSize: "11px", color: "#52525b", margin: "0 0 4px" }}>Goal</p>
                              <p style={{ fontSize: "13px", fontWeight: 900, color: "white", margin: 0 }}>{formData.fitnessGoal}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: "11px", color: "#52525b", margin: "0 0 4px" }}>Metrics</p>
                              <p style={{ fontSize: "13px", fontWeight: 900, color: "white", margin: 0 }}>{formData.age} yrs · {formData.weightKg} kg</p>
                            </div>
                          </div>
                          <div style={{ background: "rgba(0,0,0,0.5)", border: "1px solid #27272a", borderRadius: "12px", padding: "14px", fontSize: "12px", color: "#71717a", lineHeight: 1.6 }}>
                            <span style={{ fontWeight: 700, color: "#bef264" }}>⚡ Next step: </span>
                            Coach Vikrant will personally audit your profile and build your custom macro + training blueprint on the call.
                          </div>
                        </div>

                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Link
                            href={`/consultation?name=${encodeURIComponent(formData.name)}&service=${encodeURIComponent(formData.fitnessGoal)}`}
                            onClick={onClose}
                            style={{ display: "inline-flex", alignItems: "center", gap: "10px", borderRadius: "999px", background: "#bef264", padding: "16px 36px", fontSize: "14px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#09090b", textDecoration: "none", boxShadow: "0 0 40px rgba(190,242,100,0.5)" }}
                          >
                            Book My 1-on-1 Consultation Now
                            <ArrowRight size={18} />
                          </Link>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return createPortal(portalContent, document.body);
}

/* ─── Small helper nav buttons ─── */
function NavBtn({
  onClick,
  label,
  icon,
  dir,
}: {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  dir?: "back";
}) {
  if (dir === "back") {
    return (
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "999px", background: "#18181b", border: "1px solid #27272a", padding: "12px 20px", fontSize: "12px", fontWeight: 700, color: "#71717a", cursor: "pointer" }}
      >
        <ArrowLeft size={14} /> Back
      </motion.button>
    );
  }
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: "10px", borderRadius: "999px", background: "#bef264", border: "none", padding: "14px 28px", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#09090b", cursor: "pointer", boxShadow: "0 0 30px rgba(190,242,100,0.4)" }}
    >
      {label} {icon}
    </motion.button>
  );
}
