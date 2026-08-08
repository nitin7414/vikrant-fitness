"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Trophy,
  PartyPopper,
  Phone,
  RefreshCw,
} from "lucide-react";

import { NumberWheel } from "@/components/NumberWheel";
import { useAssessmentStore } from "@/lib/assessmentStore";

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
interface FormData {
  name: string;
  email: string;
  phone: string;
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

type IntroPhase = "intro" | "words" | "reveal" | "done";

function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<IntroPhase>("intro");

  useEffect(() => {
    // Phase timeline
    const t1 = setTimeout(() => setPhase("words"), 500);
    const t2 = setTimeout(() => setPhase("reveal"), 1600);
    const t3 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
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
      <AnimatePresence>
        {phase !== "done" && (
          <>
            {phase === "intro" && (
              <motion.div
                key="lime-circle"
                initial={{ scale: 0, borderRadius: "100%" }}
                animate={{ scale: 25, borderRadius: "0%" }}
                transition={{ duration: 0.75, ease: [0.86, 0, 0.07, 1] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#bef264",
                  transformOrigin: "center center",
                }}
              />
            )}

            {(phase === "words" || phase === "reveal") && (
              <motion.div
                key="lime-screen"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#bef264",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                }}
              >
                <div style={{ textAlign: "center", maxWidth: "600px" }}>
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "#09090b",
                      color: "#bef264",
                      padding: "6px 16px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "16px",
                    }}
                  >
                    <Sparkles size={14} /> VIKRANT FITNESS PROTOCOL
                  </motion.div>

                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    style={{
                      fontSize: "clamp(32px, 6vw, 64px)",
                      fontWeight: 900,
                      color: "#09090b",
                      textTransform: "uppercase",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      margin: 0,
                    }}
                  >
                    READY FOR <br /> TRANSFORMATION
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "rgba(9,9,11,0.7)",
                      marginTop: "12px",
                      margin: "12px 0 0",
                    }}
                  >
                    Initializing customized body assessment wizard...
                  </motion.p>
                </div>
              </motion.div>
            )}

            {phase === "reveal" && (
              <motion.div
                key="dark-curtain"
                initial={{ y: "-100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#09090b",
                  zIndex: 2,
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const QUOTES: Record<number, string> = {
  1: "First step is half the battle won. Let's make it count.",
  2: "Data defines direction. Set your baseline precisely.",
  3: "Clear goals produce clear results. Own your ambition.",
  4: "Absolute beast mode. Your protocol is locked in! 🏆",
};

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
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null); // null = not submitted yet
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const setAssessment = useAssessmentStore((s) => s.setAssessment);
  const clearAssessment = useAssessmentStore((s) => s.clearAssessment);

  /** Submit wizard data to the universal /api/consultation endpoint */
  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Not provided",
          age: formData.age,
          gender: "Not specified",
          fitnessGoal: `${formData.fitnessGoal} (${formData.workoutDays})`,
          activityLevel: formData.workoutDays,
          medicalConditions: "None reported",
          preferredDate: new Date().toISOString().split("T")[0],
          preferredTime: "Flexible / 1-on-1 Call",
          notes: `Current: ${formData.weightKg}kg → Target: ${formData.targetWeightKg}kg`,
          source: "wizard",
        }),
      });
      const json = await res.json();
      const id =
        json?.data?.id ??
        `VF-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingId(id);
      // Persist to Zustand store + clear after save so next visit is fresh
      setAssessment(formData);
    } catch {
      setBookingId(`VF-${Math.floor(100000 + Math.random() * 900000)}`);
      setAssessment(formData);
    } finally {
      setSubmitting(false);
    }
  }, [formData, setAssessment]);

  /** Reset everything so the user can start a fresh consultation */
  const handleBookAnother = () => {
    clearAssessment();
    setBookingId(null);
    setCurrentStep(1);
    setFormData({
      name: "",
      email: "",
      phone: "",
      age: "26",
      weightKg: "75",
      targetWeightKg: "70",
      fitnessGoal: "",
      workoutDays: "4-5 Days / Week",
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background body scroll & pause GSAP ScrollSmoother when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      try {
        const smoother = (window as any).gsap?.plugins?.ScrollSmoother?.get?.();
        if (smoother) smoother.paused(true);
      } catch {}
      setShowForm(false);
    } else {
      document.body.style.overflow = "";
      try {
        const smoother = (window as any).gsap?.plugins?.ScrollSmoother?.get?.();
        if (smoother) smoother.paused(false);
      } catch {}
      setShowForm(false);
    }
    return () => {
      document.body.style.overflow = "";
      try {
        const smoother = (window as any).gsap?.plugins?.ScrollSmoother?.get?.();
        if (smoother) smoother.paused(false);
      } catch {}
    };
  }, [isOpen]);

  // Reset scroll position to top on every step change
  useEffect(() => {
    scrollContainerRef.current?.scrollTo(0, 0);
  }, [currentStep]);

  if (!mounted || !isOpen) return null;

  const progress = getProgressPercentage();

  // Common Nav Button component
  const NavBtn = ({
    onClick,
    disabled = false,
    label = "Next",
    icon = <ArrowRight size={15} />,
    dir = "forward",
  }: {
    onClick: () => void;
    disabled?: boolean;
    label?: string;
    icon?: React.ReactNode;
    dir?: "forward" | "back";
  }) => {
    const isBack = dir === "back";
    return (
      <motion.button
        type="button"
        whileHover={{ scale: disabled ? 1 : 1.03 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        onClick={onClick}
        disabled={disabled}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          borderRadius: "999px",
          padding: "12px 24px",
          fontSize: "13px",
          fontWeight: 900,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          cursor: disabled ? "not-allowed" : "pointer",
          border: isBack ? "2px solid #cbd5e1" : "none",
          background: isBack
            ? "#ffffff"
            : disabled
            ? "#cbd5e1"
            : "linear-gradient(90deg, #bef264 0%, #84cc16 100%)",
          color: "#09090b",
          boxShadow: isBack
            ? "none"
            : disabled
            ? "none"
            : "0 4px 20px rgba(132, 204, 22, 0.4)",
          opacity: disabled ? 0.6 : 1,
          transition: "all 0.2s ease",
        }}
      >
        {isBack && <ArrowLeft size={15} />}
        <span>{label}</span>
        {!isBack && icon}
      </motion.button>
    );
  };

  const portalContent = (
    <>
      {/* Cinematic intro — plays until showForm = true */}
      {!showForm && <CinematicIntro onComplete={() => setShowForm(true)} />}

      {/* FULL-SCREEN OVERLAY — slides up from bottom */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="wizard-overlay-container"
            ref={scrollContainerRef}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%", transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] } }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99999,
              background:
                "linear-gradient(135deg, #ffffff 0%, #f8fafc 45%, #ecfccb 100%)",
              color: "#09090b",
              overflow: "hidden",
              height: "100dvh",
              maxHeight: "100dvh",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Ambient lime glow — decorative, fixed to overlay */}
            <div
              style={{
                position: "fixed",
                top: "5%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "700px",
                height: "400px",
                background:
                  "radial-gradient(circle, rgba(190,242,100,0.14) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* ── CLOSE BUTTON — top-right of the full-screen surface ── */}
            <button
              onClick={onClose}
              aria-label="Close form"
              style={{
                position: "fixed",
                top: "16px",
                right: "16px",
                zIndex: 100001,
                height: "40px",
                width: "40px",
                borderRadius: "12px",
                background: "#09090b",
                border: "1px solid #27272a",
                color: "#bef264",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#84cc16";
                (e.currentTarget as HTMLElement).style.color = "#09090b";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#09090b";
                (e.currentTarget as HTMLElement).style.color = "#bef264";
              }}
            >
              <X size={18} />
            </button>

            {/* ══ INNER CONTENT CARD — full width, no max-width on outer shell ══ */}
            <div
              style={{
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                zIndex: 1,
              }}
            >
            {/* ══ HEADER (STEPS & PROGRESS) — fixed at top of overlay ══ */}
            <div
              style={{
                flexShrink: 0,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid #e2e8f0",
                padding: "16px 24px 14px",
                position: "relative",
                zIndex: 10,
              }}
            >
                {/* Row 1 — step dots + label (close button is fixed top-right) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    paddingRight: "52px", /* leave room for the fixed close btn */
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      {[1, 2, 3, 4].map((s) => (
                        <motion.div
                          key={s}
                          animate={{
                            width: s === currentStep ? "32px" : "10px",
                            background: s <= currentStep ? "#84cc16" : "#cbd5e1",
                            boxShadow:
                              s === currentStep
                                ? "0 0 10px 2px rgba(132, 204, 22, 0.6)"
                                : "none",
                          }}
                          transition={{
                            duration: 0.45,
                            ease: [0.65, 0, 0.35, 1],
                          }}
                          style={{ borderRadius: "999px", height: "10px" }}
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        fontFamily: "monospace",
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                      }}
                    >
                      Step {currentStep} of 4
                    </span>
                  </div>
                </div>

                {/* Row 2 — Progress bar */}
                <div>
                  <div
                    style={{
                      height: "10px",
                      width: "100%",
                      background: "#e2e8f0",
                      borderRadius: "999px",
                      overflow: "hidden",
                      padding: "2px",
                    }}
                  >
                    <motion.div
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                      style={{
                        height: "100%",
                        borderRadius: "999px",
                        background:
                          "linear-gradient(90deg, #bef264 0%, #84cc16 100%)",
                        boxShadow: "0 0 12px 2px rgba(132, 204, 22, 0.7)",
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        fontStyle: "italic",
                        color: "#4d7c0f",
                        margin: 0,
                      }}
                    >
                      &ldquo;{QUOTES[currentStep]}&rdquo;
                    </p>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 900,
                        color: "#3f6212",
                        fontVariantNumeric: "tabular-nums",
                        marginLeft: "12px",
                        flexShrink: 0,
                      }}
                    >
                      {progress}%
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* ══ STEP CONTENT — inner scroll container ══ */}
              <div
                ref={scrollContainerRef}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  overflowX: "hidden",
                  WebkitOverflowScrolling: "touch",
                  overscrollBehaviorY: "contain",
                  padding: "clamp(20px, 4vw, 40px) clamp(16px, 5vw, 48px) 80px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    maxWidth: "860px",
                    width: "100%",
                    margin: "0 auto",
                  }}
                >
                {/* ══ CELEBRATION SUCCESS SCREEN ══ */}
                <AnimatePresence mode="wait">
                  {bookingId ? (
                    <motion.div
                      key="success-screen"
                      initial={{ opacity: 0, scale: 0.92, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.88 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "28px",
                        textAlign: "center",
                        padding: "8px 0 16px",
                        position: "relative",
                      }}
                    >
                      {/* Confetti particles */}
                      {[...Array(24)].map((_, i) => {
                        const colors = ["#bef264","#84cc16","#facc15","#fb923c","#f472b6","#60a5fa","#a78bfa"];
                        const color = colors[i % colors.length];
                        const angle = (i / 24) * 360;
                        const distance = 90 + Math.random() * 80;
                        const x = Math.cos((angle * Math.PI) / 180) * distance;
                        const y = Math.sin((angle * Math.PI) / 180) * distance;
                        const size = 6 + Math.random() * 8;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                            animate={{
                              opacity: 0,
                              x,
                              y,
                              scale: 0.2,
                              rotate: Math.random() * 720 - 360,
                            }}
                            transition={{
                              duration: 1.1 + Math.random() * 0.6,
                              delay: Math.random() * 0.3,
                              ease: "easeOut",
                            }}
                            style={{
                              position: "absolute",
                              top: "50px",
                              left: "50%",
                              width: size,
                              height: size,
                              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                              background: color,
                              pointerEvents: "none",
                              zIndex: 10,
                            }}
                          />
                        );
                      })}

                      {/* Trophy burst */}
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 14, delay: 0.1 }}
                        style={{
                          width: "88px",
                          height: "88px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #bef264 0%, #84cc16 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 0 0 12px rgba(190,242,100,0.18), 0 0 0 24px rgba(190,242,100,0.08)",
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        <motion.div
                          animate={{ rotate: [0, -10, 10, -8, 8, 0] }}
                          transition={{ delay: 0.5, duration: 0.7, ease: "easeInOut" }}
                        >
                          <Trophy size={44} color="#09090b" strokeWidth={2.2} />
                        </motion.div>
                      </motion.div>

                      {/* Headline */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25, duration: 0.45 }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "#09090b",
                            color: "#bef264",
                            borderRadius: "999px",
                            padding: "5px 16px",
                            fontSize: "11px",
                            fontWeight: 900,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          <PartyPopper size={13} /> You&apos;re In — Beast Mode Activated
                        </motion.div>

                        <motion.h2
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35, duration: 0.45 }}
                          style={{
                            fontSize: "clamp(28px, 5vw, 48px)",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            color: "#09090b",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.05,
                            margin: 0,
                          }}
                        >
                          We&apos;ve Got You,{" "}
                          <span style={{ color: "#65a30d" }}>{formData.name}! 🔥</span>
                        </motion.h2>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.45, duration: 0.4 }}
                          style={{ fontSize: "13px", color: "#475569", fontWeight: 600, margin: 0 }}
                        >
                          Coach Vikrant will personally reach out within 24 hours to kick off your transformation.
                        </motion.p>
                      </div>

                      {/* Booking confirmation card */}
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.45 }}
                        style={{
                          background: "#ffffff",
                          border: "2px solid #84cc16",
                          borderRadius: "20px",
                          padding: "20px 24px",
                          maxWidth: "460px",
                          width: "100%",
                          textAlign: "left",
                          boxShadow: "0 10px 30px rgba(132,204,22,0.18)",
                        }}
                      >
                        {/* Card header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "14px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b" }}>Booking Confirmed</span>
                          <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 900, color: "#4d7c0f", background: "#ecfccb", padding: "2px 10px", borderRadius: "999px" }}>
                            {bookingId}
                          </span>
                        </div>

                        {/* Details grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" }}>
                          {[
                            { label: "Name", value: formData.name },
                            { label: "Goal", value: formData.fitnessGoal },
                            { label: "Baseline", value: `${formData.age} yrs · ${formData.weightKg} kg` },
                            { label: "Target", value: `${formData.targetWeightKg} kg` },
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <span style={{ display: "block", fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: "2px" }}>{label}</span>
                              <strong style={{ color: "#09090b", fontSize: "12px" }}>{value || "—"}</strong>
                            </div>
                          ))}
                        </div>

                        {/* Contact info */}
                        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#475569" }}>
                            <Phone size={12} color="#84cc16" />
                            <span>{formData.phone || "Not provided"}</span>
                          </div>
                          <div style={{ fontSize: "11px", color: "#475569" }}>
                            📧 {formData.email}
                          </div>
                        </div>

                        {/* Next step note */}
                        <div style={{ marginTop: "14px", padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", fontSize: "11px", color: "#166534", lineHeight: 1.5 }}>
                          <strong>⚡ What&apos;s next:</strong> Coach Vikrant will review your profile and reach out via WhatsApp
                          {formData.phone ? ` (${formData.phone})` : ""} &amp; email within 24 hours to schedule your 1-on-1 strategy call.
                        </div>
                      </motion.div>

                      {/* Action buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.4 }}
                        style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "400px" }}
                      >
                        {/* Book another */}
                        <div style={{ padding: "16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                          <div style={{ textAlign: "left" }}>
                            <p style={{ fontSize: "12px", fontWeight: 800, color: "#09090b", margin: 0 }}>Need another consultation?</p>
                            <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0 0", fontWeight: 500 }}>Book for a friend or a different goal</p>
                          </div>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleBookAnother}
                            style={{
                              flexShrink: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              borderRadius: "999px",
                              padding: "9px 18px",
                              fontSize: "11px",
                              fontWeight: 900,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              background: "#09090b",
                              color: "#bef264",
                              border: "none",
                              cursor: "pointer",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          >
                            <RefreshCw size={13} /> Yes, Book Again
                          </motion.button>
                        </div>

                        {/* Close */}
                        <button
                          type="button"
                          onClick={onClose}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#94a3b8",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            padding: "4px",
                          }}
                        >
                          Close &amp; Return to Homepage
                        </button>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* ══ STEP SLIDES (only shown when no booking yet) ══ */}
                {!bookingId && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >

                    {/* ─── SLIDE 1 ─── */}
                    {currentStep === 1 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "24px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              borderRadius: "999px",
                              background: "#09090b",
                              padding: "4px 14px",
                              width: "fit-content",
                            }}
                          >
                            <User size={13} color="#bef264" />
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 800,
                                color: "#bef264",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                              }}
                            >
                              Step 1 — Personal Identification
                            </span>
                          </div>
                          <h2
                            style={{
                              fontSize: "clamp(26px, 4.5vw, 42px)",
                              fontWeight: 900,
                              textTransform: "uppercase",
                              color: "#09090b",
                              letterSpacing: "-0.02em",
                              lineHeight: 1.1,
                              margin: 0,
                            }}
                          >
                            What Should We{" "}
                            <span style={{ color: "#65a30d" }}>Call You?</span>
                          </h2>
                          <p
                            style={{
                              color: "#475569",
                              fontSize: "14px",
                              margin: 0,
                              fontWeight: 600,
                            }}
                          >
                            Your name kicks off your personalized transformation
                            roadmap.
                          </p>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                          }}
                        >
                          <div>
                            <label
                              style={{
                                display: "block",
                                fontSize: "11px",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.12em",
                                color: "#334155",
                                marginBottom: "8px",
                              }}
                            >
                              Full Name *
                            </label>
                            <input
                              autoFocus
                              type="text"
                              placeholder="e.g. Alex Turner"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              style={{
                                width: "100%",
                                background: "#ffffff",
                                border: "2px solid #cbd5e1",
                                borderRadius: "16px",
                                padding: "16px 20px",
                                fontSize: "20px",
                                fontWeight: 700,
                                color: "#09090b",
                                outline: "none",
                                boxSizing: "border-box",
                                transition: "border-color 0.2s",
                              }}
                              onFocus={(e) =>
                                (e.target.style.borderColor = "#84cc16")
                              }
                              onBlur={(e) =>
                                (e.target.style.borderColor = "#cbd5e1")
                              }
                            />
                          </div>
                          <div>
                            <label
                              style={{
                                display: "block",
                                fontSize: "11px",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.12em",
                                color: "#334155",
                                marginBottom: "8px",
                              }}
                            >
                              Email (For Roadmap Delivery) *
                            </label>
                            <input
                              type="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              style={{
                                width: "100%",
                                background: "#ffffff",
                                border: "2px solid #cbd5e1",
                                borderRadius: "16px",
                                padding: "14px 20px",
                                fontSize: "16px",
                                fontWeight: 600,
                                color: "#09090b",
                                outline: "none",
                                boxSizing: "border-box",
                                transition: "border-color 0.2s",
                              }}
                              onFocus={(e) =>
                                (e.target.style.borderColor = "#84cc16")
                              }
                              onBlur={(e) =>
                                (e.target.style.borderColor = "#cbd5e1")
                              }
                            />
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "8px",
                          }}
                        >
                          <NavBtn
                            onClick={() => setCurrentStep(2)}
                            disabled={!formData.name.trim()}
                          />
                        </div>
                      </div>
                    )}

                    {/* ─── SLIDE 2 ─── */}
                    {currentStep === 2 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "24px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              borderRadius: "999px",
                              background: "#09090b",
                              padding: "4px 14px",
                              width: "fit-content",
                            }}
                          >
                            <Flame size={13} color="#bef264" />
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 800,
                                color: "#bef264",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                              }}
                            >
                              Step 2 — Physical Baseline
                            </span>
                          </div>
                          <h2
                            style={{
                              fontSize: "clamp(26px, 4.5vw, 42px)",
                              fontWeight: 900,
                              textTransform: "uppercase",
                              color: "#09090b",
                              letterSpacing: "-0.02em",
                              lineHeight: 1.1,
                              margin: 0,
                            }}
                          >
                            Your Starting{" "}
                            <span style={{ color: "#65a30d" }}>Metrics</span>
                          </h2>
                          <p
                            style={{
                              color: "#475569",
                              fontSize: "14px",
                              margin: 0,
                              fontWeight: 600,
                            }}
                          >
                            Select or type your age and target parameters.
                          </p>
                        </div>

                        {/* Wheels layout in blend theme */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "16px",
                          }}
                        >
                          <NumberWheel
                            theme="blend"
                            label="Age"
                            value={parseInt(formData.age) || 26}
                            onChange={(v) =>
                              setFormData({ ...formData, age: String(v) })
                            }
                            min={16}
                            max={80}
                            unit="yrs"
                          />
                          <NumberWheel
                            theme="blend"
                            label="Current Weight"
                            value={parseInt(formData.weightKg) || 75}
                            onChange={(v) =>
                              setFormData({ ...formData, weightKg: String(v) })
                            }
                            min={40}
                            max={180}
                            unit="kg"
                          />
                          <NumberWheel
                            theme="blend"
                            label="Target Weight"
                            value={parseInt(formData.targetWeightKg) || 70}
                            onChange={(v) =>
                              setFormData({
                                ...formData,
                                targetWeightKg: String(v),
                              })
                            }
                            min={40}
                            max={180}
                            unit="kg"
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "8px",
                          }}
                        >
                          <NavBtn
                            onClick={() => setCurrentStep(1)}
                            dir="back"
                          />
                          <NavBtn onClick={() => setCurrentStep(3)} />
                        </div>
                      </div>
                    )}

                    {/* ─── SLIDE 3 (SCROLLABLE STEP WITH GOALS & DAYS) ─── */}
                    {currentStep === 3 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "24px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              borderRadius: "999px",
                              background: "#09090b",
                              padding: "4px 14px",
                              width: "fit-content",
                            }}
                          >
                            <Award size={13} color="#bef264" />
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 800,
                                color: "#bef264",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                              }}
                            >
                              Step 3 — Transformation Objective
                            </span>
                          </div>
                          <h2
                            style={{
                              fontSize: "clamp(26px, 4.5vw, 42px)",
                              fontWeight: 900,
                              textTransform: "uppercase",
                              color: "#09090b",
                              letterSpacing: "-0.02em",
                              lineHeight: 1.1,
                              margin: 0,
                            }}
                          >
                            Pick Your{" "}
                            <span style={{ color: "#65a30d" }}>
                              Primary Goal
                            </span>
                          </h2>
                          <p
                            style={{
                              color: "#475569",
                              fontSize: "14px",
                              margin: 0,
                              fontWeight: 600,
                            }}
                          >
                            This defines your entire training and nutrition
                            protocol.
                          </p>
                        </div>

                        {/* Goal selection cards (Text Left, Image Right) */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px",
                          }}
                        >
                          {[
                            {
                              title: "Fat Loss & Shredding",
                              desc: "Deficit protocol, lean-out strategy",
                              image: "/body-shape/fat-loss-shredding.jfif",
                            },
                            {
                              title: "Hypertrophy Muscle Gain",
                              desc: "Progressive overload, muscle size",
                              image: "/body-shape/muscle-gain.webp",
                            },
                            {
                              title: "Body Recomposition",
                              desc: "Simultaneous fat cut & muscle build",
                              image: "/body-shape/recomposition.png",
                            },
                          ].map((goal, idx) => {
                            const sel = formData.fitnessGoal === goal.title;
                            return (
                              <motion.div
                                key={idx}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    fitnessGoal: goal.title,
                                  })
                                }
                                style={{
                                  cursor: "pointer",
                                  padding: "16px 20px",
                                  borderRadius: "20px",
                                  border: sel
                                    ? "2px solid #84cc16"
                                    : "2px solid #cbd5e1",
                                  background: sel ? "#f7fee7" : "#ffffff",
                                  boxShadow: sel
                                    ? "0 4px 20px rgba(132, 204, 22, 0.25)"
                                    : "0 2px 10px rgba(0,0,0,0.03)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: "16px",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                {/* Left Side: Text Details */}
                                <div
                                  style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        fontFamily: "monospace",
                                        fontWeight: 800,
                                        color: "#4d7c0f",
                                        background: "#ecfccb",
                                        padding: "2px 8px",
                                        borderRadius: "6px",
                                        border: "1px solid #a3e635",
                                      }}
                                    >
                                      0{idx + 1}
                                    </span>
                                    {sel && (
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          fontWeight: 900,
                                          color: "#4d7c0f",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.08em",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "4px",
                                        }}
                                      >
                                        <Check size={14} color="#65a30d" />{" "}
                                        Selected
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <h4
                                      style={{
                                        fontWeight: 900,
                                        fontSize: "15px",
                                        color: "#09090b",
                                        margin: 0,
                                      }}
                                    >
                                      {goal.title}
                                    </h4>
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        color: "#64748b",
                                        margin: "4px 0 0",
                                        lineHeight: 1.3,
                                        fontWeight: 500,
                                      }}
                                    >
                                      {goal.desc}
                                    </p>
                                  </div>
                                </div>

                                {/* Right Side: Body Shape Image */}
                                <div
                                  style={{
                                    width: "120px",
                                    height: "80px",
                                    borderRadius: "14px",
                                    overflow: "hidden",
                                    border: "1px solid #cbd5e1",
                                    background: "#09090b",
                                    flexShrink: 0,
                                    position: "relative",
                                  }}
                                >
                                  <img
                                    src={goal.image}
                                    alt={goal.title}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      objectPosition: "center",
                                    }}
                                  />
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Workout Days selection */}
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "11px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.12em",
                              color: "#334155",
                              marginBottom: "10px",
                            }}
                          >
                            Workout Availability (Days / Week)
                          </label>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr",
                              gap: "10px",
                            }}
                          >
                            {[
                              "2-3 Days / Week",
                              "4-5 Days / Week",
                              "6 Days / Week",
                            ].map((freq) => {
                              const active = formData.workoutDays === freq;
                              return (
                                <button
                                  key={freq}
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      workoutDays: freq,
                                    })
                                  }
                                  style={{
                                    padding: "12px 8px",
                                    borderRadius: "14px",
                                    fontSize: "12px",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    border: active
                                      ? "2px solid #84cc16"
                                      : "2px solid #cbd5e1",
                                    background: active ? "#84cc16" : "#ffffff",
                                    color: active ? "#ffffff" : "#334155",
                                    boxShadow: active
                                      ? "0 4px 15px rgba(132, 204, 22, 0.3)"
                                      : "none",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  {freq}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Step 3 Navigation Buttons - Fully Scrollable & Accessible */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "12px",
                            paddingTop: "16px",
                            borderTop: "1px solid #e2e8f0",
                          }}
                        >
                          <NavBtn
                            onClick={() => setCurrentStep(2)}
                            dir="back"
                          />
                          <NavBtn
                            onClick={() => setCurrentStep(4)}
                            label="Generate Protocol"
                            icon={<Sparkles size={15} />}
                          />
                        </div>
                      </div>
                    )}

                    {/* ─── SLIDE 4 ─── */}
                    {currentStep === 4 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "24px",
                          textAlign: "center",
                        }}
                      >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            borderRadius: "999px",
                            background: "#09090b",
                            padding: "6px 18px",
                          }}
                        >
                          <Sparkles size={14} color="#bef264" />
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 900,
                              color: "#bef264",
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                            }}
                          >
                            Profile Generated! — You&apos;re Unstoppable
                          </span>
                        </motion.div>

                        <h2
                          style={{
                            fontSize: "clamp(30px, 5vw, 52px)",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            color: "#09090b",
                            letterSpacing: "-0.02em",
                            lineHeight: 1,
                            margin: 0,
                          }}
                        >
                          Let&apos;s Go,{" "}
                          <span style={{ color: "#65a30d" }}>
                            {formData.name}!
                          </span>
                        </h2>

                        <div
                          style={{
                            background: "#ffffff",
                            border: "2px solid #84cc16",
                            borderRadius: "20px",
                            padding: "24px",
                            maxWidth: "520px",
                            width: "100%",
                            textAlign: "left",
                            boxShadow: "0 10px 30px rgba(132, 204, 22, 0.2)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderBottom: "1px solid #e2e8f0",
                              paddingBottom: "12px",
                              marginBottom: "16px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "#475569",
                              }}
                            >
                              Your Profile
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 900,
                                color: "#4d7c0f",
                                background: "#ecfccb",
                                padding: "2px 8px",
                                borderRadius: "999px",
                              }}
                            >
                              VERIFIED
                            </span>
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "14px",
                              fontSize: "13px",
                            }}
                          >
                            <div>
                              <span
                                style={{
                                  display: "block",
                                  fontSize: "10px",
                                  fontWeight: 800,
                                  color: "#64748b",
                                  textTransform: "uppercase",
                                }}
                              >
                                Target Goal
                              </span>
                              <strong style={{ color: "#09090b" }}>
                                {formData.fitnessGoal}
                              </strong>
                            </div>
                            <div>
                              <span
                                style={{
                                  display: "block",
                                  fontSize: "10px",
                                  fontWeight: 800,
                                  color: "#64748b",
                                  textTransform: "uppercase",
                                }}
                              >
                                Current Baseline
                              </span>
                              <strong style={{ color: "#09090b" }}>
                                {formData.weightKg} kg ({formData.age} yrs)
                              </strong>
                            </div>
                            <div>
                              <span
                                style={{
                                  display: "block",
                                  fontSize: "10px",
                                  fontWeight: 800,
                                  color: "#64748b",
                                  textTransform: "uppercase",
                                }}
                              >
                                Target Weight
                              </span>
                              <strong style={{ color: "#4d7c0f" }}>
                                {formData.targetWeightKg} kg
                              </strong>
                            </div>
                            <div>
                              <span
                                style={{
                                  display: "block",
                                  fontSize: "10px",
                                  fontWeight: 800,
                                  color: "#64748b",
                                  textTransform: "uppercase",
                                }}
                              >
                                Frequency
                              </span>
                              <strong style={{ color: "#09090b" }}>
                                {formData.workoutDays}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* ── Phone number ask ── */}
                        <div
                          style={{
                            width: "100%",
                            maxWidth: "520px",
                            textAlign: "left",
                          }}
                        >
                          <label
                            style={{
                              display: "block",
                              fontSize: "11px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.12em",
                              color: "#334155",
                              marginBottom: "8px",
                            }}
                          >
                            Please leave your contact no. so that we can reach to you
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            style={{
                              width: "100%",
                              background: "#ffffff",
                              border: "2px solid #cbd5e1",
                              borderRadius: "14px",
                              padding: "14px 18px",
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#09090b",
                              outline: "none",
                              boxSizing: "border-box",
                              transition: "border-color 0.2s",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#84cc16")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "#cbd5e1")
                            }
                          />
                        </div>

                        {/* ── CTA buttons ── */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            width: "100%",
                            maxWidth: "520px",
                          }}
                        >
                          <motion.button
                            type="button"
                            whileHover={{ scale: submitting ? 1 : 1.03 }}
                            whileTap={{ scale: submitting ? 1 : 0.97 }}
                            disabled={submitting}
                            onClick={handleSubmit}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "10px",
                              borderRadius: "999px",
                              padding: "16px 32px",
                              fontSize: "14px",
                              fontWeight: 900,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              background: submitting
                                ? "#cbd5e1"
                                : "linear-gradient(90deg, #bef264 0%, #84cc16 100%)",
                              color: "#09090b",
                              boxShadow: submitting
                                ? "none"
                                : "0 6px 25px rgba(132, 204, 22, 0.4)",
                              border: "none",
                              cursor: submitting ? "not-allowed" : "pointer",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {submitting ? (
                              <>
                                <motion.span
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                  style={{ display: "inline-flex" }}
                                >
                                  <RefreshCw size={16} />
                                </motion.span>
                                <span>Locking In Your Spot…</span>
                              </>
                            ) : (
                              <>
                                <span>Lock In My Consultation</span>
                                <Trophy size={16} />
                              </>
                            )}
                          </motion.button>

                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#475569",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            ← Adjust My Parameters
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                )} {/* end !bookingId */}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return createPortal(portalContent, document.body);
}
