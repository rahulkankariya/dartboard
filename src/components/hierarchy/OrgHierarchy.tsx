"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, X, Loader2 } from "lucide-react";
import { Employee, ExternalUser } from "./types";
import { TreeNode } from "./components/TreeNode";
import { EditModal } from "./components/EditModal";
import { orgService } from "./api/org-service";
import { findNodeById } from "./utils/tree-builder";
import { da } from "zod/locales";


export default function OrgHierarchyContainer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [roots, setRoots] = useState<Employee[]>([]);
  const [availableUsers, setAvailableUsers] = useState<ExternalUser[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editingNode, setEditingNode] = useState<Employee | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const loadChart = async () => {
    setIsInitialLoading(true);
    try {
      const response = await orgService.getInitialChart();
      const data = response || [];
      
      setRoots(data);
      if (data.length > 0) setExpandedIds(new Set([data[0].id]));
    } catch (e) { console.error(e); } 
    finally { setIsInitialLoading(false); }
  };

  useEffect(() => { if (isOpen) loadChart(); }, [isOpen]);

  useEffect(() => {
    if (!search.trim()) { setAvailableUsers([]); return; }
    const timer = setTimeout(async () => {
      setIsSearchLoading(true);
      try {
        const results = await orgService.searchUsers(search);
        setAvailableUsers(results);
      } catch (e) { console.error(e); }
      finally { setIsSearchLoading(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSave = async (updated: Employee) => {
    try {
      // THE FIX: Check if node exists in the NESTED tree
      const exists = findNodeById(roots, updated.id);
      
      if (!exists) {
        await orgService.addMember(updated.id, updated.managerId!);
      } else {
        await orgService.editMember(updated.id, updated.managerId!);
      }

      await loadChart(); // Full sync
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
          <div className="flex items-center gap-3"><Network className="text-indigo-600" /><h1 className="font-black uppercase text-slate-800 text-lg">Org Chart</h1></div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20}/></button>
        </header>

        <main className="flex-1 overflow-auto p-20 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px]">
          {isInitialLoading ? (
             <div className="flex flex-col items-center mt-20 gap-4"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
          ) : (
            <div className="flex flex-col items-center min-w-max">
              {roots.map(root => (
                <TreeNode 
                  key={root.id} 
                  node={root} 
                  expandedIds={expandedIds} 
                  onEdit={(n) => { setSearch(""); setEditingNode(n); }} 
                  onAdd={(mgrId) => { setSearch(""); setAvailableUsers([]); setEditingNode({ id: "", name: "", title: "", managerId: mgrId } as Employee); }} 
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
          <EditModal node={editingNode} availableUsers={availableUsers} isLoading={isSearchLoading} onSearch={setSearch} onUpdateField={setEditingNode} onSave={handleSave} onCancel={() => setEditingNode(null)} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}