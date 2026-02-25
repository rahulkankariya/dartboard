import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, X, UserCheck } from "lucide-react";
import { Employee, ExternalUser } from "../types";

interface ModalProps {
  node: Employee;
  availableUsers: ExternalUser[];
  isLoading: boolean; // For searching
  isSaving: boolean; // NEW: For the confirm button
  hasMore: boolean;
  searchTerm: string;
  onSearch: (query: string) => void;
  onLoadMore: () => void;
  onSave: (updated: Employee) => void;
  onCancel: () => void;
  onUpdateField: (node: Employee) => void;
}

export const EditModal = ({
  node,
  availableUsers,
  isLoading,
  isSaving,
  hasMore,
  searchTerm,
  onSearch,
  onLoadMore,
  onSave,
  onCancel,
  onUpdateField,
}: ModalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || isLoading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = container;

    if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 5) {
      onLoadMore();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-110 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-4xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Assign Member
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 bg-slate-50">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              autoFocus
              className="w-full bg-white p-4 pl-12 rounded-2xl border-2 border-transparent focus:border-indigo-500 text-sm font-bold outline-none shadow-sm"
              placeholder="Search directory..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto flex-1 px-4 py-2 bg-white"
        >
          {availableUsers.length > 0 ? (
            <>
              {availableUsers.map((u) => (
                <button
                  key={u.id}
                  disabled={isSaving}
                  onClick={() =>
                    onUpdateField({
                      ...node,
                      userId: u.id,
                      name: `${u.firstName} ${u.lastName}`,
                      title: "Team Member",
                    })
                  }
                  className={`w-full flex items-center justify-between p-4 my-1 rounded-2xl transition-all ${node.userId === u.id ? "bg-indigo-600 text-white shadow-lg" : "hover:bg-slate-50 text-slate-600"}`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${node.userId === u.id ? "bg-white/20" : "bg-indigo-100 text-indigo-600"}`}
                    >
                      {u.firstName?.[0]}
                      {u.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate">
                        {u.firstName} {u.lastName}
                      </p>
                      <p
                        className={`text-[10px] ${node.userId === u.id ? "text-white/60" : "text-slate-400"}`}
                      >
                        {u.email}
                      </p>
                    </div>
                  </div>
                  {node.userId === u.id && (
                    <UserCheck size={18} className="shrink-0" />
                  )}
                </button>
              ))}
              {isLoading && (
                <div className="p-4 flex justify-center">
                  <Loader2 className="animate-spin text-indigo-600" size={20} />
                </div>
              )}
            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2 opacity-60">
              {isLoading ? (
                <Loader2 className="animate-spin text-indigo-600" />
              ) : (
                <p className="text-xs font-bold uppercase tracking-wider">
                  No results found
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t flex gap-3">
          <button
            disabled={isSaving}
            onClick={onCancel}
            className="flex-1 p-4 bg-slate-100 text-slate-500 font-bold rounded-2xl disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={!node.userId || isSaving}
            onClick={() => onSave(node)}
            className="flex-2 p-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all uppercase text-[11px] tracking-widest flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Saving...</span>
              </>
            ) : (
              "Confirm Assignment"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
