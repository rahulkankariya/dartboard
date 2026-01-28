"use client";

import { logout } from "@/actions/auth";

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="px-6 py-2 border border-stone-700 text-stone-500 text-[10px] uppercase tracking-[0.2em] hover:border-red-600 hover:text-red-600 transition-all duration-300"
    >
      Log out
    </button>
  );
}