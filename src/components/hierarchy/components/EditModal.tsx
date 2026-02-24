import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, X, UserCheck } from "lucide-react";
import { Employee, ExternalUser } from "../types";

interface ModalProps {
  node: Employee;
  availableUsers: ExternalUser[];
  isLoading: boolean;
  hasMore: boolean;
  onSearch: (query: string) => void;
  onLoadMore: () => void;
  onSave: (updated: Employee) => void;
  onCancel: () => void;
  onUpdateField: (node: Employee) => void;
}

export const EditModal = ({ node, availableUsers, isLoading, hasMore, onSearch, onLoadMore, onSave, onCancel, onUpdateField }: ModalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current || isLoading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      onLoadMore();
    }
  };

  const handleUserSelect = (user: ExternalUser) => {
    onUpdateField({ 
      ...node, 
      id: user.id, 
      name: `${user.firstName} ${user.lastName}`.trim(), 
      title: user?.desingation || "Team Member" // Using typo-correct property
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-110 flex items-center justify-center p-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Assign Member</h2>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={18}/></button>
        </div>

        <div className="p-6 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input autoFocus className="w-full bg-white p-4 pl-12 rounded-2xl border-2 border-transparent focus:border-indigo-500 text-sm font-bold outline-none shadow-sm" placeholder="Search directory..." onChange={(e) => onSearch(e.target.value)} />
          </div>
        </div>

        <div ref={scrollRef} onScroll={handleScroll} className="overflow-y-auto h-72 px-6 py-2">
          {availableUsers.map(u => (
            <button key={u.id} onClick={() => handleUserSelect(u)} className={`w-full flex items-center justify-between p-3 my-1 rounded-xl transition-all ${node.id === u.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black ${node.id === u.id ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'}`}>
                  {u.firstName[0]}{u.lastName[0]}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold leading-none">{u.firstName} {u.lastName}</p>
                  <p className={`text-[10px] mt-1 ${node.id === u.id ? 'text-white/60' : 'text-slate-400'}`}>{u.email}</p>
                </div>
              </div>
              {node.id === u.id && <UserCheck size={16} />}
            </button>
          ))}
          {isLoading && <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={20}/></div>}
        </div>

        <div className="p-6 bg-white border-t flex gap-3">
          <button onClick={onCancel} className="flex-1 p-4 bg-slate-50 text-slate-400 font-bold rounded-2xl">Cancel</button>
          <button disabled={!node.id || isLoading} onClick={() => onSave(node)} className="flex-2 p-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all uppercase text-[10px] tracking-widest">
            {node.managerId ? "Apply Changes" : "Save Member"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};