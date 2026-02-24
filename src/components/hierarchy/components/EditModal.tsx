import React from "react";
import { motion } from "framer-motion";
import { Save, Search, Loader2, User, Briefcase, X, CheckCircle2 } from "lucide-react";
import { Employee, ExternalUser } from "../types";

interface ModalProps {
  node: Employee;
  availableUsers: ExternalUser[];
  isLoading: boolean;
  onSearch: (query: string) => void;
  onSave: (updated: Employee) => void;
  onCancel: () => void;
  onUpdateField: (node: Employee) => void;
}

export const EditModal = ({ node, availableUsers, isLoading, onSearch, onSave, onCancel, onUpdateField }: ModalProps) => {
  const handleUserSelect = (user: ExternalUser) => {
    onUpdateField({ 
      ...node, 
      id: user.id, // Store the actual User ID for the backend POST
      name: `${user.firstName} ${user.lastName}`, 
      title: user.desingation || "Team Member" 
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-110 flex items-center justify-center p-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
        <div className="p-6 pb-4 flex justify-between items-center border-b">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Hierarchy Management</h2>
          <button onClick={onCancel} className="p-2 hover:bg-red-50 rounded-full transition-colors"><X size={18}/></button>
        </div>

        <div className="p-6 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-slate-400" size={18} />
            <input autoFocus className="w-full bg-white p-4 pl-12 rounded-2xl border-2 border-transparent focus:border-indigo-500 text-sm font-bold outline-none shadow-sm" placeholder="Search directory..." onChange={(e) => onSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-y-auto max-h-62.5 px-6 py-2 min-h-25">
          {isLoading ? (
            <div className="py-10 text-center flex flex-col items-center gap-2"><Loader2 className="animate-spin text-indigo-600"/><span className="text-[10px] font-bold text-slate-400 uppercase">Searching...</span></div>
          ) : availableUsers.length > 0 ? (
            availableUsers.map(u => (
              <button key={u.id} onClick={() => handleUserSelect(u)} className={`w-full flex items-center justify-between p-3 my-1 rounded-xl transition-all ${node.id === u.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black">{u.firstName[0]}</div>
                  <div className="text-left"><p className="text-sm font-bold leading-none">{u.firstName} {u.lastName}</p><p className="text-[10px] opacity-60 mt-1">{u.email}</p></div>
                </div>
              </button>
            ))
          ) : (
             <div className="py-10 text-center text-slate-300 text-[10px] font-bold uppercase italic tracking-widest">No users found</div>
          )}
        </div>

        <div className="p-6 bg-white border-t space-y-3">
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 p-4 bg-white text-slate-400 font-bold rounded-2xl border">Cancel</button>
            <button disabled={!node.name || isLoading} onClick={() => onSave(node)} className="flex-2 p-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all uppercase text-[10px] tracking-widest">Apply Change</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};