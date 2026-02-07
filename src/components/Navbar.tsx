"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
  Menu, 
  X, 
  LogOut, 
  Sun, 
  Moon, 
  MessageSquare 
} from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import { logout } from "@/actions/auth";

interface NavbarProps {
  user?: {
    firstName: string;
    lastName: string;
    image?: string;
  };
  activeSession?: string | null;
  isChatOpen?: boolean;
  onToggleChat?: () => void;
}

export function Navbar({ user, activeSession, isChatOpen, onToggleChat }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { socket } = useSocket();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-20 border-b border-app-border bg-app-bg" />;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "??";

  const handleLogout = async () => {
    if (socket) {
      socket.disconnect();
    }
    await logout();
  };

  return (
    <nav className="border-b border-app-border bg-app-bg sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-serif italic text-app-accent leading-tight">DART PRO</h1>
          {activeSession && (
            <div className="hidden md:flex items-center gap-1.5 animate-pulse">
              <div className="h-1.5 w-1.5 rounded-full bg-app-accent" />
              <span className="text-[8px] uppercase tracking-[0.2em] font-black text-app-accent">
                {activeSession} Active
              </span>
            </div>
          )}
        </div>

        {/* DESKTOP NAV (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={onToggleChat}
            className={`p-2 transition-colors relative ${isChatOpen ? 'text-app-accent' : 'text-app-text/60 hover:text-app-accent'}`}
          >
            <MessageSquare size={20} />
            {isChatOpen && <span className="absolute bottom-1 right-1 h-2 w-2 bg-app-accent rounded-full border-2 border-app-bg" />}
          </button>

          {user && (
            <div className="flex items-center gap-3 pr-4 border-r border-app-border">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-tighter text-app-text/40">Operator</p>
                <p className="text-sm font-medium text-app-text">{user.firstName} {user.lastName}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent font-bold overflow-hidden">
                {user.image ? <img src={user.image} alt="Profile" className="object-cover w-full h-full" /> : initials}
              </div>
            </div>
          )}

          <button onClick={toggleTheme} className="p-2 text-app-text/60 hover:text-app-accent transition-colors">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span className="hidden lg:block uppercase tracking-wider">Logout</span>
          </button>
        </div>

        {/* MOBILE ACTION BAR */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick Chat Toggle for Mobile */}
          <button 
            onClick={onToggleChat}
            className={`p-2 relative ${isChatOpen ? 'text-app-accent' : 'text-app-text/60'}`}
          >
            <MessageSquare size={22} />
            {isChatOpen && <span className="absolute top-1 right-1 h-2 w-2 bg-app-accent rounded-full border border-app-bg" />}
          </button>

          <button onClick={toggleTheme} className="p-2 text-app-text/60">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="text-app-accent p-2 ml-1" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden p-6 bg-app-bg border-b border-app-border flex flex-col gap-4 animate-in slide-in-from-top-4">
          {user && (
            <div className="flex items-center gap-4 mb-2 p-2">
               <div className="h-12 w-12 rounded-full bg-app-accent/10 border border-app-accent/20 flex items-center justify-center text-app-accent font-bold">
                {user.image ? <img src={user.image} alt="Profile" className="rounded-full" /> : initials}
              </div>
              <div>
                <p className="text-xs uppercase text-app-text/40">Operator</p>
                <p className="font-bold text-app-text">{user.firstName} {user.lastName}</p>
              </div>
            </div>
          )}

          <button 
            onClick={() => { onToggleChat?.(); setIsOpen(false); }}
            className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl font-bold border transition-colors ${
              isChatOpen 
                ? "bg-app-accent/10 border-app-accent text-app-accent" 
                : "border-app-border text-app-text"
            }`}
          >
            <MessageSquare size={20} /> {isChatOpen ? "Close Chat" : "Open Chat"}
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold border border-red-500/20 rounded-xl hover:bg-red-500/5"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}