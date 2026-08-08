"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Clock, CheckCircle2, AlertCircle, User } from "lucide-react";
import { ConsultationSlot, ConsultationBooking } from "@/lib/types";
import { MOCK_CONSULTATION_SLOTS } from "@/lib/data";

function ConsultationForm() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service");

  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>("2026-08-10");
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [age, setAge] = useState<string>("28");
  const [gender, setGender] = useState<string>("Male");
  const [fitnessGoal, setFitnessGoal] = useState<string>("Fat Loss & Muscle Recomposition");
  const [activityLevel, setActivityLevel] = useState<string>("3-4 Workouts / Week");
  const [medicalConditions, setMedicalConditions] = useState<string>("");
  const [notes, setNotes] = useState<string>(
    preselectedService ? `Interested in ${preselectedService} program.` : ""
  );

  // Submission State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState<ConsultationBooking | null>(null);

  // Dates for selector (next 5 days)
  const availableDates = [
    { date: "2026-08-10", label: "Mon, Aug 10" },
    { date: "2026-08-11", label: "Tue, Aug 11" },
    { date: "2026-08-12", label: "Wed, Aug 12" },
    { date: "2026-08-13", label: "Thu, Aug 13" },
    { date: "2026-08-14", label: "Fri, Aug 14" },
  ];

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate]);

  const fetchSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/consultation?date=${date}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSlots(json.data);
      } else {
        setSlots(MOCK_CONSULTATION_SLOTS.filter((s) => s.date === date));
      }
    } catch {
      setSlots(MOCK_CONSULTATION_SLOTS.filter((s) => s.date === date));
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !phone || !selectedDate || !selectedTime) {
      setErrorMsg("Please fill out all required fields and pick a time slot.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          age,
          gender,
          fitnessGoal,
          activityLevel,
          medicalConditions,
          preferredDate: selectedDate,
          preferredTime: selectedTime,
          notes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setBookingSuccess(json.data);
      } else {
        setErrorMsg(json.error || "Failed to book consultation.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-28 sm:pt-32 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Direct 1-on-1 Virtual Consultation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            BOOK YOUR <span className="text-amber-400">STRATEGY SESSION</span>
          </h1>
          <p className="text-zinc-400 text-sm">
            Discuss your physical goals, diet history, and daily schedule with Coach Vikrant. We will map out your exact execution plan.
          </p>
        </div>

        {/* Success Dialog */}
        {bookingSuccess ? (
          <div className="rounded-3xl border border-amber-500/40 bg-zinc-900 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <div className="h-16 w-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Consultation Confirmed!</h2>
              <p className="text-sm text-zinc-300">
                Thank you, <span className="font-bold text-amber-400">{bookingSuccess.name}</span>. Your 1-on-1 session is scheduled for:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Booking Reference:</span>
                <span className="font-mono text-amber-400 font-bold">{bookingSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Date & Time:</span>
                <span className="font-bold text-white">
                  {bookingSuccess.preferredDate} @ {bookingSuccess.preferredTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Goal:</span>
                <span className="text-zinc-200">{bookingSuccess.fitnessGoal}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400">
              A calendar invite and Zoom link have been sent to <span className="text-white font-medium">{bookingSuccess.email}</span>.
            </p>

            <div>
              <button
                onClick={() => {
                  setBookingSuccess(null);
                  setSelectedTime("");
                }}
                className="rounded-xl bg-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-amber-300 transition"
              >
                Book Another Session
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Date & Slot Selection */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> 1. Select Date
                </h3>

                <div className="grid grid-cols-1 gap-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d.date);
                        setSelectedTime("");
                      }}
                      className={`w-full p-3 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                        selectedDate === d.date
                          ? "bg-amber-400/10 border-amber-400 text-amber-400"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <span>{d.label}</span>
                      {selectedDate === d.date && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                  ))}
                </div>

                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 pt-4 border-t border-zinc-800">
                  <Clock className="h-4 w-4" /> 2. Available Time Slots
                </h3>

                {loadingSlots ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">Loading live slot availability...</p>
                ) : slots.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-4 text-center">No slots available on this date.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-3 rounded-xl text-xs font-bold transition border text-center ${
                          !slot.available
                            ? "bg-zinc-950/40 border-zinc-900 text-zinc-600 cursor-not-allowed line-through"
                            : selectedTime === slot.time
                            ? "bg-amber-400 text-zinc-950 border-amber-400 shadow-md"
                            : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-amber-400/50"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Goal Assessment Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <User className="h-4 w-4" /> 3. Personal & Fitness Assessment
                </h3>

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">Age</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Primary Fitness Goal *</label>
                  <select
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Fat Loss & Physique Conditioning">Fat Loss & Physique Conditioning</option>
                    <option value="Muscle Building & Hypertrophy">Muscle Building & Hypertrophy</option>
                    <option value="Recomp (Fat Loss + Muscle Gain)">Recomp (Fat Loss + Muscle Gain)</option>
                    <option value="Strength & Athletic Performance">Strength & Athletic Performance</option>
                    <option value="Nutrition & Health Habits">Nutrition & Health Habits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Activity Level</label>
                  <input
                    type="text"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    placeholder="e.g. Desk job, 3 workouts per week"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Medical Conditions or Injuries (Optional)</label>
                  <input
                    type="text"
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    placeholder="e.g. Lower back pain, knee discomfort"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Notes for Coach Vikrant</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share any specific questions or details..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedTime}
                  className={`w-full rounded-xl py-4 text-xs font-black uppercase tracking-wider transition shadow-lg ${
                    submitting || !selectedTime
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 hover:from-amber-400 hover:to-amber-300 active:scale-98"
                  }`}
                >
                  {submitting ? "Booking Your Consultation..." : "Confirm 1-on-1 Consultation"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">
          Loading 1-on-1 Consultation Calendar...
        </div>
      }
    >
      <ConsultationForm />
    </Suspense>
  );
}
