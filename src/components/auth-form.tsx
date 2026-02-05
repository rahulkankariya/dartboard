"use client";

import { useActionState, useEffect, useRef } from "react";
import { authenticate } from "@/actions/auth";
import Link from "next/link";
import { FormState } from "@/lib/definitions";
import { toast } from "sonner";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    authenticate,
    { message: "", errors: {} },
  );

  // track the last processed message to prevent double-toasting
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!state?.message || state.message === lastMessageRef.current) return;

    const hasErrors = state.errors && Object.keys(state.errors).length > 0;

    if (hasErrors) {
      toast.error(state.message);
    } else {
      // Case-insensitive check for success
      if (state.message.toLowerCase().includes("success")) {
        toast.success(`Welcome back, Operator.`);
        
        // Save data only on success
        if (state.user) {
          const fullName = `${state.user.firstName} ${state.user.lastName}`;
          localStorage.setItem("user_name", fullName);
        }
      } else {
        // Fallback for neutral system messages
        toast.info(state.message);
      }
    }

    lastMessageRef.current = state.message;
  }, [state]);

  return (
    <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center p-6">
      <div className="w-full max-w-md border border-stone-800 bg-[#09090b] p-8 shadow-2xl relative overflow-hidden">
        {/* Scanline fix: Added bg-gradient-to-b */}
        <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-amber-600/5 to-transparent opacity-20 animate-pulse" />
        
        <header className="mb-10 text-center relative z-10">
          <h1 className="text-4xl font-serif italic text-amber-600 mb-2 uppercase tracking-tight">
            {mode === "login" ? "Identity" : "Enlist"}
          </h1>
          <p className="text-[10px] text-stone-500 uppercase tracking-[0.4em]">
            Dart Pro // Secure Access
          </p>
        </header>

        <form action={action} className="space-y-6 relative z-10">
          <input type="hidden" name="mode" value={mode} />

          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-stone-500 font-bold">First Name</label>
                <input
                  name="firstName"
                  required
                  className="w-full bg-stone-900 border border-stone-800 p-3 text-stone-200 focus:border-amber-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-stone-500 font-bold">Last Name</label>
                <input
                  name="lastName"
                  required
                  className="w-full bg-stone-900 border border-stone-800 p-3 text-stone-200 focus:border-amber-600 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase text-stone-500 font-bold">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-stone-900 border border-stone-800 p-3 text-stone-200 focus:border-amber-600 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase text-stone-500 font-bold">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-stone-900 border border-stone-800 p-3 text-stone-200 focus:border-amber-600 outline-none transition-all"
            />
          </div>

          <button
            disabled={pending}
            className="w-full py-4 border border-amber-600 text-amber-600 font-bold uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-black transition-all disabled:opacity-30 active:scale-95"
          >
            {pending ? "Verifying..." : mode === "login" ? "Login" : "Create Profile"}
          </button>
        </form>

        <footer className="mt-8 text-center border-t border-stone-800 pt-6 relative z-10">
          <Link
            href={mode === "login" ? "/signup" : "/login"}
            className="text-[11px] text-stone-500 hover:text-amber-600 uppercase tracking-widest transition-colors"
          >
            {mode === "login" ? "New Operator? Sign Up" : "Already Registered? Login"}
          </Link>
        </footer>
      </div>
    </div>
  );
}