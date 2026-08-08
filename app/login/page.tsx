"use client";

import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Dumbbell, ShieldCheck, User, LogOut, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { MOCK_USER } from "@/lib/data";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoSignIn = async () => {
    setDemoLoading(true);
    await signIn("google-demo", {
      email: MOCK_USER.email,
      name: MOCK_USER.name,
      callbackUrl: "/",
    });
    setDemoLoading(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">
        Checking session status...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-28 sm:pt-32 pb-20 flex items-center justify-center">
      <div className="mx-auto max-w-md px-4 w-full">
        {session?.user ? (
          /* LOGGED IN PORTAL VIEW */
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 space-y-6 shadow-2xl text-center">
            <div className="relative mx-auto w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400">
              <img
                src={session.user.image || MOCK_USER.image}
                alt={session.user.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-[11px] font-bold text-amber-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified Client</span>
              </div>
              <h1 className="text-2xl font-black text-white">{session.user.name}</h1>
              <p className="text-xs text-zinc-400">{session.user.email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs text-left">
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-400">Active Coaching Track:</span>
                <span className="font-bold text-amber-400">{MOCK_USER.activePlan}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-2">
                <span className="text-zinc-400">Current Weight:</span>
                <span className="font-bold text-white">{MOCK_USER.currentWeightKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Target Goal:</span>
                <span className="font-bold text-white">{MOCK_USER.targetWeightKg} kg ({MOCK_USER.fitnessGoal})</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/consultation"
                className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-md"
              >
                Schedule Next Consultation
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 py-3 text-xs font-bold text-red-400 hover:bg-zinc-800 transition"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN / SIGN UP FORM */
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 space-y-8 shadow-2xl backdrop-blur-md">
            <div className="text-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mx-auto border border-amber-500/20">
                <Dumbbell className="h-6 w-6 stroke-[2.5]" />
              </div>
              <h1 className="text-2xl font-black text-white">Client Portal Login</h1>
              <p className="text-xs text-zinc-400">
                Sign in to manage your 1-on-1 consultations, view your workout plans, and track your body recomposition progress.
              </p>
            </div>

            <div className="space-y-4">
              {/* GOOGLE SIGN IN BUTTON */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-950 hover:bg-zinc-800 px-4 py-3.5 text-xs font-bold text-white transition shadow-md group"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-4 text-[11px] text-zinc-500 uppercase tracking-widest my-2">
                <div className="flex-1 h-[1px] bg-zinc-800" />
                <span>Or Demo Mode</span>
                <div className="flex-1 h-[1px] bg-zinc-800" />
              </div>

              {/* MOCK GOOGLE LOGIN FOR DEV TESTING */}
              <button
                onClick={handleDemoSignIn}
                disabled={demoLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 py-3.5 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-lg hover:from-amber-400 hover:to-amber-300 transition"
              >
                <Sparkles className="h-4 w-4" />
                {demoLoading ? "Signing In..." : "Instant Demo Google Sign-In"}
              </button>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 text-center text-[11px] text-zinc-400 space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                Secure 256-bit encrypted authentication
              </p>
              <p>By logging in, you agree to our Terms & Privacy Policy.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
