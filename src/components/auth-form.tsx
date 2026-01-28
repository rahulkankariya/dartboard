"use client";

import { useActionState, useEffect } from "react";
import { authenticate } from "@/actions/auth";
import Link from "next/link";
import { FormState } from "@/lib/definitions";
import { toast } from "sonner";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    authenticate,
    { message: "", errors: {} },
  );

  useEffect(() => {
    // 1. Handle Notifications
    if (state?.message) {
      const hasErrors = state.errors && Object.keys(state.errors).length > 0;
      if (hasErrors) {
        toast.error(state.message);
      } else if (state.message === "Success") {
        toast.success(`Welcome back, Operator.`);
      }
    }

    // 2. Save User Data to LocalStorage
    if (state?.user) {
      const fullName = `${state.user.firstName} ${state.user.lastName}`;
      localStorage.setItem("user_name", fullName);
      console.log("Tactical Identity Saved:", fullName);
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center p-6 transition-colors duration-500">
      <div className="w-full  border border-stone-800 bg-[#09090b] p-8 shadow-2xl relative overflow-hidden">
        {/* Aesthetic scanline effect */}
        <div className="absolute inset-0 pointer-events-none  from-transparent via-amber-600/5 to-transparent opacity-20 animate-pulse" />
        
        <header className="mb-10 text-center relative z-10">
          <h1 className="text-4xl font-serif italic text-amber-600 mb-2">
            {mode === "login" ? "Login" : "Signup"}
          </h1>
          <p className="text-[10px] text-stone-500 uppercase tracking-[0.4em]">
            Dart Master Pro // System Access
          </p>
        </header>

        <form action={action} className="space-y-6 relative z-10">
          <input type="hidden" name="mode" value={mode} />

          {mode === "signup" && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[10px] uppercase text-stone-500 font-bold block mb-2">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="w-full bg-stone-900 border border-stone-800 p-3 text-stone-200 focus:border-amber-600 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-stone-500 font-bold block mb-2">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="w-full bg-stone-900 border border-stone-800 p-3 text-stone-200 focus:border-amber-600 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase text-stone-500 font-bold block mb-2">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-stone-900 border border-stone-800 p-3 text-stone-200 focus:border-amber-600 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-stone-500 font-bold block mb-2">Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full bg-stone-900 border border-stone-800 p-3 text-stone-200 focus:border-amber-600 outline-none transition-all"
            />
          </div>

          <button
            disabled={pending}
            type="submit"
            className="w-full py-4 border border-amber-600 text-amber-600 font-bold uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-black transition-all disabled:opacity-30 flex items-center justify-center gap-3"
          >
            {pending ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-amber-600 rounded-full animate-spin" />
                <span>Processing</span>
              </>
            ) : mode === "login" ? "Login" : "Create Profile"}
          </button>
        </form>

        <footer className="mt-8 text-center border-t border-stone-800 pt-6 relative z-10">
          <Link
            href={mode === "login" ? "/signup" : "/login"}
            className="text-[11px] text-stone-500 hover:text-amber-600 uppercase tracking-widest transition-colors"
          >
            {mode === "login" ? "Unauthorized? Create Profile" : "Authenticated? Identify Self"}
          </Link>
        </footer>
      </div>
    </div>
  );
}