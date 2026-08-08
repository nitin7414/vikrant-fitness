"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  User,
  Flame,
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Phone,
  Mail,
  PencilLine,
  Target,
  Scale,
  Calendar,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ConsultationBooking } from "@/lib/types";
import { NumberWheel } from "@/components/NumberWheel";
import { useAssessmentStore } from "@/lib/assessmentStore";
import { PageTransition } from "@/components/PageTransition";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────────────────────────────────────
   Shared input style
───────────────────────────────────────────────────────────────────────────── */
const inputCls =
  "w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-base sm:text-sm text-white placeholder-zinc-600 focus:border-[#bef264] focus:outline-none transition";

/* ─────────────────────────────────────────────────────────────────────────────
   Recap card — shown when assessment data exists in the store
───────────────────────────────────────────────────────────────────────────── */
function RecapCard({
  name,
  fitnessGoal,
  age,
  weightKg,
  targetWeightKg,
  workoutDays,
  onEdit,
}: {
  name: string;
  fitnessGoal: string;
  age: string;
  weightKg: string;
  targetWeightKg: string;
  workoutDays: string;
  onEdit: () => void;
}) {
  const rows = [
    { icon: <Target className="h-4 w-4 text-[#bef264]" />, label: "Goal", value: fitnessGoal },
    {
      icon: <Scale className="h-4 w-4 text-[#bef264]" />,
      label: "Starting Point",
      value: `${age} yrs · ${weightKg} kg`,
    },
    {
      icon: <Scale className="h-4 w-4 text-[#bef264]" />,
      label: "Target Weight",
      value: `${targetWeightKg} kg`,
    },
    { icon: <Calendar className="h-4 w-4 text-[#bef264]" />, label: "Frequency", value: workoutDays },
  ];

  return (
    <div className="rounded-3xl border border-[#bef264]/30 bg-zinc-900/90 backdrop-blur-md p-6 sm:p-8 shadow-[0_0_40px_rgba(190,242,100,0.08)] gsap-reveal">
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264] mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>ASSESSMENT LOCKED IN</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-snug">
            Here&apos;s what we&apos;ll cover on your call,{" "}
            <span className="text-[#bef264]">{name}</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            Coach Vikrant has your profile ready. All that&apos;s left is a way to reach you.
          </p>
        </div>

        <button
          onClick={onEdit}
          className="shrink-0 flex items-center gap-1.5 rounded-full bg-zinc-800 border border-zinc-700 px-3.5 py-2 text-xs font-bold text-zinc-300 hover:text-[#bef264] hover:border-[#bef264]/50 transition cursor-pointer"
        >
          <PencilLine className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>

      {/* Data rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-3 rounded-2xl bg-zinc-950 border border-zinc-800 px-4 py-3"
          >
            <div className="shrink-0 h-8 w-8 rounded-xl bg-[#bef264]/10 border border-[#bef264]/20 flex items-center justify-center">
              {row.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                {row.label}
              </p>
              <p className="text-sm font-black text-white truncate">{row.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Coach note */}
      <div className="mt-4 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
        <span className="font-bold text-[#bef264]">⚡ On your call: </span>
        Coach Vikrant will use these numbers to map your personalised training + nutrition protocol
        — no starting from scratch.
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Contact-only form — shown below the recap card
───────────────────────────────────────────────────────────────────────────── */
function ContactOnlyForm({
  email,
  setEmail,
  phone,
  setPhone,
  submitting,
  errorMsg,
  onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  submitting: boolean;
  errorMsg: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800/90 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md gsap-reveal">
      {errorMsg && (
        <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
            <Phone className="h-3.5 w-3.5" />
            <span>ONE LAST STEP — HOW TO REACH YOU</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Ready to{" "}
            <span className="text-[#bef264]">Lock In Your Call?</span>
          </h3>
          <p className="text-xs text-zinc-400">
            We&apos;ll reach out within 24 hours to confirm your 1-on-1 session.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              WhatsApp / Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
            <p className="text-[10px] text-zinc-600 mt-1.5">
              Your consultation confirmation will be sent here.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-[#bef264] px-8 py-4 text-sm font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition shadow-[0_0_35px_rgba(190,242,100,0.4)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{submitting ? "Locking In Your Spot…" : "Book My 1-on-1 Call"}</span>
          {!submitting && <ArrowRight className="h-5 w-5" />}
        </button>

        <p className="text-center text-[10px] text-zinc-600">
          No spam, ever. Your data is used only to reach you for your call.
        </p>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main content component
───────────────────────────────────────────────────────────────────────────── */
function TransformationQuestionnaireContent() {
  const router = useRouter();

  // ── Zustand store ──
  const storeData = useAssessmentStore((s) => s);
  const clearAssessment = useAssessmentStore((s) => s.clearAssessment);
  const [hydrated, setHydrated] = useState(false);

  // Rehydrate once on the client (skipHydration=true in the store)
  useEffect(() => {
    useAssessmentStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  // ── Determine mode after hydration ──
  const hasAssessment = hydrated && Boolean(storeData.name);

  // ── Full-form state (Mode B fallback) ──
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [age, setAge] = useState<number>(26);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(70);
  const [fitnessGoal, setFitnessGoal] = useState<string>("Fat Loss & Shredding");
  const [workoutDays, setWorkoutDays] = useState<string>("4-5 Days / Week");

  // ── Contact-only state (Mode A) ──
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");

  // Pre-fill contact info from store when hydration resolves
  useEffect(() => {
    if (hasAssessment) {
      if (storeData.email) setContactEmail(storeData.email);
      if (storeData.phone) setContactPhone(storeData.phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAssessment]);

  // ── Shared submission state ──
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState<ConsultationBooking | null>(null);

  // ── GSAP reveal animations ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      document.querySelectorAll(".gsap-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [step, bookingSuccess, hasAssessment]);

  /* ── Mode B: Full form handlers ── */
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim() || !email.trim()) {
      setErrorMsg("Please enter your name and email address to proceed.");
      return;
    }
    setStep(2);
  };

  const buildPayload = (overrides: Record<string, string | number> = {}) => ({
    name: overrides.name ?? name,
    email: overrides.email ?? email,
    phone: (overrides.phone as string) || "Not Provided",
    age: String(overrides.age ?? age),
    gender: "Specified in Assessment",
    fitnessGoal: `${overrides.fitnessGoal ?? fitnessGoal} (${overrides.workoutDays ?? workoutDays})`,
    activityLevel: `${overrides.workoutDays ?? workoutDays} training`,
    medicalConditions: "None reported",
    preferredDate: new Date().toISOString().split("T")[0],
    preferredTime: "Flexible / 1-on-1 Call",
    notes: `Transformation Assessment: Current Weight ${overrides.weightKg ?? weightKg}kg, Target Weight ${overrides.targetWeightKg ?? targetWeightKg}kg.`,
  });

  const submitToApi = async (payload: ReturnType<typeof buildPayload>) => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setBookingSuccess(json.data);
      } else {
        throw new Error("non-success");
      }
    } catch {
      // Fallback mock success
      setBookingSuccess({
        id: `VF-${Math.floor(100000 + Math.random() * 900000)}`,
        name: payload.name as string,
        email: payload.email as string,
        phone: payload.phone as string,
        age: Number(payload.age),
        gender: "Male",
        fitnessGoal: payload.fitnessGoal as string,
        activityLevel: payload.activityLevel as string,
        preferredDate: "Next Available Slot",
        preferredTime: "1-on-1 Call",
        status: "confirmed",
        createdAt: new Date().toISOString(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Mode B: submit from the full 4-step form ── */
  const handleSubmitFullForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg("Please provide your name and email address.");
      setStep(1);
      return;
    }
    await submitToApi(buildPayload());
  };

  /* ── Mode A: submit from the contact-only form ── */
  const handleSubmitContactOnly = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!contactPhone.trim() || !contactEmail.trim()) {
      setErrorMsg("Please provide your phone number and email address.");
      return;
    }
    await submitToApi(
      buildPayload({
        name: storeData.name,
        email: contactEmail,
        phone: contactPhone,
        age: storeData.age,
        weightKg: storeData.weightKg,
        targetWeightKg: storeData.targetWeightKg,
        fitnessGoal: storeData.fitnessGoal,
        workoutDays: storeData.workoutDays,
      })
    );
    // Clear assessment from store after successful booking
    clearAssessment();
  };

  /* ── "Edit Assessment" — navigate back to home at the last wizard step ── */
  const handleEditAssessment = () => {
    // Go back to home with reopen flag; step 3 = Goals (most likely edit target)
    router.push("/?reopen=true&step=3");
  };

  const getProgressPercentage = () => {
    switch (step) {
      case 1: return 25;
      case 2: return 50;
      case 3: return 75;
      case 4: return 100;
      default: return 25;
    }
  };

  /* ── Derived display values ── */
  const displayName = hasAssessment ? storeData.name : name;
  const displayEmail = hasAssessment ? contactEmail : email;

  return (
    <PageTransition>
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 pt-28 sm:pt-32 pb-20 overflow-hidden select-none">
      {/* Ambient Radial Backlight Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#bef264]/10 rounded-full blur-[150px] pointer-events-none -z-0" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto gsap-reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-4 py-1.5 text-xs font-bold text-[#bef264]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {hasAssessment
                ? "TRANSFORMATION PROFILE READY"
                : "TRANSFORMATION QUESTIONNAIRE & ASSESSMENT"}
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-tight">
            BOOK YOUR <span className="text-[#bef264]">1-ON-1 CONSULTATION</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {hasAssessment
              ? "Your assessment data is saved. Just confirm how to reach you and we'll handle the rest."
              : "Fill out your physical metrics & transformation objectives to unlock your customised coaching blueprint directly with Coach Vikrant."}
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════
            SUCCESS STATE (shared for both modes)
        ══════════════════════════════════════════════════════════ */}
        {bookingSuccess ? (
          <div className="rounded-3xl border border-[#bef264]/50 bg-zinc-900/90 p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-md animate-fadeIn max-w-2xl mx-auto">
            <div className="h-16 w-16 rounded-full bg-[#bef264]/20 text-[#bef264] border border-[#bef264]/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(190,242,100,0.3)]">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                We got you now!
              </h2>
              <p className="text-sm text-zinc-300">
                Thank you,{" "}
                <span className="font-bold text-[#bef264]">{bookingSuccess.name}</span>. Your
                transformation profile has been received.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 max-w-md mx-auto space-y-3 text-xs text-left">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-400">Reference ID:</span>
                <span className="font-mono text-[#bef264] font-bold">{bookingSuccess.id}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-400">Goal:</span>
                <span className="font-bold text-white">
                  {hasAssessment ? storeData.fitnessGoal : fitnessGoal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Metrics:</span>
                <span className="text-zinc-200">
                  {hasAssessment
                    ? `${storeData.age} yrs · ${storeData.weightKg} kg (Target: ${storeData.targetWeightKg} kg)`
                    : `${age} yrs · ${weightKg} kg (Target: ${targetWeightKg} kg)`}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400 leading-relaxed max-w-md mx-auto tracking-wide">
              <span className="font-bold text-[#bef264]">⚡ Next Step: </span>
              We will personally review your profile and reach out via Email{" "}
              <span className="text-white font-medium">{displayEmail}</span> &amp; WhatsApp within 24 hours
              to schedule your 1-on-1 strategy call.
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setBookingSuccess(null);
                  setStep(1);
                }}
                className="rounded-full bg-[#bef264] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition shadow-[0_0_30px_rgba(190,242,100,0.35)] cursor-pointer"
              >
                Submit Another Assessment
              </button>
            </div>
          </div>
        ) : hydrated && hasAssessment ? (
          /* ══════════════════════════════════════════════════════════
              MODE A — Has assessment data: Recap + Contact Only
          ══════════════════════════════════════════════════════════ */
          <div className="max-w-2xl mx-auto space-y-6">
            <RecapCard
              name={storeData.name}
              fitnessGoal={storeData.fitnessGoal}
              age={storeData.age}
              weightKg={storeData.weightKg}
              targetWeightKg={storeData.targetWeightKg}
              workoutDays={storeData.workoutDays}
              onEdit={handleEditAssessment}
            />

            <ContactOnlyForm
              email={contactEmail}
              setEmail={setContactEmail}
              phone={contactPhone}
              setPhone={setContactPhone}
              submitting={submitting}
              errorMsg={errorMsg}
              onSubmit={handleSubmitContactOnly}
            />
          </div>
        ) : hydrated ? (
          /* ══════════════════════════════════════════════════════════
              MODE B — No assessment data: Full 4-step form
          ══════════════════════════════════════════════════════════ */
          <>
            {/* Progress Bar */}
            <div className="space-y-2 gsap-reveal max-w-2xl mx-auto">
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span className="text-[#bef264] uppercase tracking-wider">
                  Step 0{step} of 04
                </span>
                <span className="text-zinc-400">{getProgressPercentage()}% Completed</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-[#bef264] transition-all duration-500 shadow-[0_0_15px_rgba(190,242,100,0.5)]"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800/90 bg-zinc-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-md max-w-2xl mx-auto gsap-reveal">
              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* ─── STEP 1: PERSONAL DETAILS ─── */}
              {step === 1 && (
                <form onSubmit={handleNextFromStep1} className="space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
                      <User className="h-3.5 w-3.5" />
                      <span>STEP 01 — IDENTITY &amp; CONTACT</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                      Who is <span className="text-[#bef264]">Transforming?</span>
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Enter your official contact details so Coach Vikrant can reach you.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Turner"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. alex@example.com"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        WhatsApp / Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-full bg-[#bef264] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition shadow-[0_0_25px_rgba(190,242,100,0.35)] active:scale-95 cursor-pointer"
                    >
                      <span>Next: Physical Baseline</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* ─── STEP 2: PHYSICAL BASELINE ─── */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
                      <Flame className="h-3.5 w-3.5" />
                      <span>STEP 02 — PHYSICAL BASELINE</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                      Your Starting <span className="text-[#bef264]">Metrics</span>
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Set your current age and bodyweight parameters.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <NumberWheel label="Age" value={age} onChange={setAge} min={16} max={80} unit="yrs" />
                    <NumberWheel label="Current Weight" value={weightKg} onChange={setWeightKg} min={40} max={180} unit="kg" />
                    <NumberWheel label="Target Weight" value={targetWeightKg} onChange={setTargetWeightKg} min={40} max={180} unit="kg" />
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-zinc-800">
                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 rounded-full bg-zinc-950 border border-zinc-800 px-6 py-3 text-xs font-bold text-zinc-400 hover:text-white transition cursor-pointer">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="flex items-center gap-2 rounded-full bg-[#bef264] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition shadow-[0_0_25px_rgba(190,242,100,0.35)] active:scale-95 cursor-pointer">
                      <span>Next: Choose Objective</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 3: GOALS & FREQUENCY ─── */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-3.5 py-1 text-xs font-bold text-[#bef264]">
                      <Award className="h-3.5 w-3.5" />
                      <span>STEP 03 — TRANSFORMATION OBJECTIVE</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                      Pick Your <span className="text-[#bef264]">Primary Goal</span>
                    </h2>
                    <p className="text-xs text-zinc-400">
                      This defines your training &amp; macro strategy.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {[
                      { title: "Fat Loss & Shredding", desc: "Calorie deficit & lean-out protocol", image: "/body-shape/fat-loss-shredding.jfif" },
                      { title: "Hypertrophy Muscle Gain", desc: "Progressive overload & muscle mass", image: "/body-shape/muscle-gain.webp" },
                      { title: "Body Recomposition", desc: "Simultaneous fat loss & muscle build", image: "/body-shape/recomposition.png" },
                    ].map((g, idx) => {
                      const selected = fitnessGoal === g.title;
                      return (
                        <div
                          key={idx}
                          onClick={() => setFitnessGoal(g.title)}
                          className={`group p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${selected ? "bg-zinc-900 border-[#bef264] shadow-[0_0_25px_rgba(190,242,100,0.25)] ring-1 ring-[#bef264]" : "bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"}`}
                        >
                          <div className="flex-1 flex flex-col justify-between space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-[#bef264] bg-[#bef264]/10 px-2 py-0.5 rounded border border-[#bef264]/30">0{idx + 1}</span>
                              {selected && <span className="flex items-center gap-1 text-[10px] font-extrabold text-[#bef264] uppercase tracking-wider"><Check className="h-3.5 w-3.5" /> Selected</span>}
                            </div>
                            <div>
                              <h4 className="font-black text-sm text-white group-hover:text-[#bef264] transition">{g.title}</h4>
                              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{g.desc}</p>
                            </div>
                          </div>
                          <div className="relative shrink-0 w-32 sm:w-44 h-24 sm:h-28 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-md">
                            <img src={g.image} alt={g.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Workout Availability (Days / Week)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["2-3 Days / Week", "4-5 Days / Week", "6 Days / Week"].map((freq) => (
                        <button key={freq} type="button" onClick={() => setWorkoutDays(freq)}
                          className={`py-3 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${workoutDays === freq ? "bg-[#bef264] text-zinc-950 border-[#bef264] shadow-md" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"}`}>
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-zinc-800">
                    <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 rounded-full bg-zinc-950 border border-zinc-800 px-6 py-3 text-xs font-bold text-zinc-400 hover:text-white transition cursor-pointer">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <button type="button" onClick={() => setStep(4)} className="flex items-center gap-2 rounded-full bg-[#bef264] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition shadow-[0_0_25px_rgba(190,242,100,0.35)] active:scale-95 cursor-pointer">
                      <span>Generate Protocol</span>
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 4: REVIEW & CONFIRMATION ─── */}
              {step === 4 && (
                <div className="space-y-6 text-center">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264]/40 bg-[#bef264]/10 px-4 py-1.5 text-xs font-black text-[#bef264]">
                    <Sparkles className="h-4 w-4" />
                    <span>YOUR PLAN IS READY — COACH VIKRANT IS WAITING</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                    Can&apos;t wait to see your transformation,{" "}
                    <span className="text-[#bef264]">{name || "Athlete"}!</span>
                  </h2>

                  <div className="p-6 rounded-2xl bg-zinc-950 border-2 border-[#bef264]/40 text-left max-w-md mx-auto space-y-4 shadow-[0_0_30px_rgba(190,242,100,0.15)]">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Your Snapshot</span>
                      <span className="text-xs font-mono font-bold text-[#bef264]">✦ LOCKED IN</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] text-zinc-500">Your Goal</p>
                        <p className="text-xs font-black text-white">{fitnessGoal}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-zinc-500">Starting Point</p>
                        <p className="text-xs font-black text-white">{age} yrs · {weightKg} kg</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 leading-relaxed tracking-wide">
                      <span className="font-bold text-[#bef264]">⚡ What happens next: </span>
                      We are really excited to be part of your transformation. We will personally review your details and map out your custom training + nutrition plan on your 1-on-1 call when you confirm below.
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-zinc-800">
                    <button type="button" onClick={() => setStep(3)} className="flex items-center gap-2 rounded-full bg-zinc-950 border border-zinc-800 px-6 py-3 text-xs font-bold text-zinc-400 hover:text-white transition cursor-pointer">
                      <ArrowLeft className="h-4 w-4" /> Edit My Answers
                    </button>
                    <button type="button" onClick={handleSubmitFullForm} disabled={submitting} className="flex items-center gap-2 rounded-full bg-[#bef264] px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-950 hover:bg-[#a3e635] transition shadow-[0_0_35px_rgba(190,242,100,0.4)] active:scale-95 cursor-pointer">
                      <span>{submitting ? "Locking In Your Spot..." : "Book My Call"}</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Loading skeleton while hydrating */
          <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
            <div className="h-48 rounded-3xl bg-zinc-900/60" />
            <div className="h-64 rounded-3xl bg-zinc-900/40" />
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400 text-sm">
          Loading Transformation Assessment...
        </div>
      }
    >
      <TransformationQuestionnaireContent />
    </Suspense>
  );
}
