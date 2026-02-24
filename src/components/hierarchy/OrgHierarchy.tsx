"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, X, Loader2 } from "lucide-react";
import { Employee, ExternalUser } from "./types";
import { TreeNode } from "./components/TreeNode";
import { EditModal } from "./components/EditModal";
import { orgService } from "./api/org-service";
import { findNodeById } from "./utils/tree-builder";

export default function OrgHierarchyContainer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [roots, setRoots] = useState<Employee[]>([]);
  const [availableUsers, setAvailableUsers] = useState<ExternalUser[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [editingNode, setEditingNode] = useState<Employee | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const loadChart = async () => {
    setIsInitialLoading(true);
    try {
      const response = await orgService.getInitialChart();
      setRoots(response || []);
      if (response?.length > 0) setExpandedIds(new Set([response[0].id]));
    } catch (e) { console.error(e); } 
    finally { setIsInitialLoading(false); }
  };

  useEffect(() => { if (isOpen) loadChart(); }, [isOpen]);

  // Search & Pagination Effect
  useEffect(() => {
    if (!search.trim()) { 
      setAvailableUsers([]); 
      return; 
    }

    const timer = setTimeout(async () => {
      setIsSearchLoading(true);
      try {
        // Pass page to your search API
        const results = await orgService.searchUsers(search, page);
        
        // If results are less than 10 (or your limit), no more pages
        if (results.length < 10) setHasMore(false);

        setAvailableUsers(prev => (page === 1 ? results : [...prev, ...results]));
      } catch (e) { console.error(e); }
      finally { setIsSearchLoading(false); }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, page]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);      // Reset pagination on new search
    setHasMore(true);
    setAvailableUsers([]);
  };

  const handleLoadMore = () => {
    if (!isSearchLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleSave = async (updated: Employee) => {
    try {
      const exists = findNodeById(roots, updated.id);
      if (!exists) {
        await orgService.addMember(updated.id, updated.managerId!);
      } else {
        await orgService.editMember(updated.id, updated.managerId!);
      }
      await loadChart();
      setEditingNode(null);
    } catch (e) { console.error("Save failed", e); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove member? Subordinates will move up.")) return;
    try {
      await orgService.deleteMember(id);
      await loadChart();
    } catch (e) { console.error(e); }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-100 flex flex-col bg-slate-50 overflow-hidden">
        <header className="p-6 bg-white border-b flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3"><Network className="text-indigo-600" /><h1 className="font-black uppercase text-slate-800 text-lg leading-none">Org Hierarchy</h1></div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"><X size={20}/></button>
        </header>

        <main className="flex-1 overflow-auto p-20 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px]">
          {isInitialLoading ? (
             <div className="flex flex-col items-center mt-20 gap-4">
               <Loader2 className="animate-spin text-indigo-600" size={32} />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Architecting Tree...</p>
             </div>
          ) : (
            <div className="flex flex-col items-center min-w-max">
              {roots.map(root => (
                <TreeNode 
                  key={root.id} 
                  node={root} 
                  expandedIds={expandedIds} 
                  onEdit={(n) => { handleSearchChange(""); setEditingNode(n); }} 
                  onAdd={(mgrId) => { handleSearchChange(""); setEditingNode({ id: "", name: "", title: "", managerId: mgrId } as Employee); }} 
                  onDelete={handleDelete} 
                  onToggle={(id) => setExpandedIds(prev => {
                    const next = new Set(prev);
                    next.has(id) ? next.delete(id) : next.add(id);
                    return next;
                  })} 
                />
              ))}
            </div>
          )}
        </main>

        {editingNode && (
          <EditModal 
            node={editingNode} 
            availableUsers={availableUsers} 
            isLoading={isSearchLoading} 
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onSearch={handleSearchChange} 
            onUpdateField={setEditingNode} 
            onSave={handleSave} 
            onCancel={() => setEditingNode(null)} 
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}