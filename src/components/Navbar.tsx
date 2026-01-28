"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { logout } from "@/actions/auth";
import { Menu, X, LogOut, Sun, Moon, Target } from "lucide-react";

interface NavbarProps {
  user?: {
    firstName: string;
    lastName: string;
    image?: string;
  };
  activeSession?: string | null; // Track game state
}

export function Navbar({ user, activeSession }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "??";

  return (
    <nav className="border-b border-app-border bg-app-bg sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* LOGO & MOBILE STATUS */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-serif italic text-app-accent leading-tight">DART PRO</h1>
          {activeSession && (
            <div className="md:hidden flex items-center gap-1.5 animate-pulse">
              <div className="h-1.5 w-1.5 rounded-full bg-app-accent" />
              <span className="text-[8px] uppercase tracking-[0.2em] font-black text-app-accent">
                {activeSession} Active
              </span>
            </div>
          )}
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">
          {user && (
            <div className="flex items-center gap-3 pr-4 border-r border-app-border">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-tighter text-app-text/40">Operator</p>
                <p className="text-sm font-medium text-app-text">{user.firstName} {user.lastName}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent font-bold overflow-hidden">
                {user.image ? <img src={user.image} alt="Profile" /> : initials}
              </div>
            </div>
          )}

          <button onClick={toggleTheme} className="p-2 text-app-text/60 hover:text-app-accent transition-colors">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button onClick={() => logout()} className="text-[10px] uppercase tracking-widest text-red-600 font-bold hover:opacity-70">
            Logout
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden text-app-accent" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-app-bg border-b border-app-border p-6 flex flex-col gap-4 shadow-xl z-50">
          {/* MOBILE SESSION INFO */}
          {activeSession && (
            <div className="flex items-center justify-between p-4 bg-app-accent/5 border border-app-accent/20 rounded">
              <div className="flex items-center gap-3">
                <Target size={16} className="text-app-accent" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-app-text">Current Protocol</span>
              </div>
              <span className="text-[10px] font-black text-app-accent uppercase">{activeSession}</span>
            </div>
          )}

          {user && (
             <div className="flex items-center gap-4 p-4 border-b border-app-border">
                <div className="h-12 w-12 rounded-full bg-app-accent flex items-center justify-center text-white font-bold">
                  {initials}
                </div>
                <div>
                  <p className="text-lg font-bold">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-app-text/50">Active Session</p>
                </div>
             </div>
          )}
          
          <button onClick={toggleTheme} className="flex items-center justify-between p-4 border border-app-border rounded bg-app-text/5">
            <span className="text-xs uppercase tracking-widest text-app-text">Switch Theme</span>
            {theme === "dark" ? <Sun size={18} className="text-app-accent" /> : <Moon size={18} />}
          </button>
          
          <button onClick={() => logout()} className="flex items-center gap-4 p-4 bg-red-500/10 text-red-600 uppercase text-[10px] font-bold tracking-widest rounded">
            <LogOut size={18} /> Log Out
          </button>
        </div>
      )}
    </nav>
  );
}