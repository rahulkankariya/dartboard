"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, X, Loader2 } from "lucide-react";
import { Employee, ExternalUser } from "./types";
import { TreeNode } from "./components/TreeNode";
import { EditModal } from "./components/EditModal";
import { orgService } from "./api/org-service";

export default function OrgHierarchyContainer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [roots, setRoots] = useState<Employee[]>([]);
  const [availableUsers, setAvailableUsers] = useState<ExternalUser[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingNode, setEditingNode] = useState<Employee | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // THE LOCK: This prevents duplicate page increments
  const isFetchingRef = useRef(false);

  const loadChart = async () => {
    setIsInitialLoading(true);
    try {
      const response = await orgService.getInitialChart();
      setRoots(response || []);
      if (response?.length > 0) setExpandedIds(new Set([response[0].id]));
    } catch (e) { console.error(e); } finally { setIsInitialLoading(false); }
  };

  useEffect(() => { if (isOpen) loadChart(); }, [isOpen]);

  useEffect(() => {
    if (!editingNode) return;

    const timer = setTimeout(async () => {
      setIsSearchLoading(true);
      try {
        const limit = 10;
        const currentPage = Number(page);
        const startIndex = (currentPage - 1) * limit + 1;
        
        const results = await orgService.searchUsers(search, currentPage);
        
        setAvailableUsers((prev) => {
          if (currentPage === 1) return results;
          // Filter out any duplicates just in case the API returns overlapping data
          const existingIds = new Set(prev.map(u => u.id));
          const uniqueNewResults = results.filter((u: { id: string; }) => !existingIds.has(u.id));
          return [...prev, ...uniqueNewResults];
        });
        
        setHasMore(results.length === limit);
      } catch (e) {
        console.error("Search Error:", e);
        setHasMore(false);
      } finally {
        setIsSearchLoading(false);
        isFetchingRef.current = false; // RELEASE LOCK
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, page, editingNode]);

  const handleCancel = () => {
    setEditingNode(null);
    setIsAddingNew(false);
    setSearch("");
    setAvailableUsers([]);
    setPage(1);
    setHasMore(true);
    isFetchingRef.current = false;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-100 flex flex-col bg-slate-50">
        <header className="p-6 bg-white border-b flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Network className="text-indigo-600" />
            <h1 className="font-black uppercase text-slate-800 text-lg">Org Hierarchy</h1>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"><X size={20} /></button>
        </header>

        <main className="flex-1 overflow-auto p-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px]">
          {isInitialLoading ? (
            <div className="flex flex-col items-center mt-20 gap-4"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
          ) : (
            <div className="flex flex-col items-center min-w-max">
              {roots.map((root) => (
                <TreeNode
                  key={root.id}
                  node={root}
                  expandedIds={expandedIds}
                  onEdit={(n) => { handleCancel(); setEditingNode(n); }}
                  onAdd={(mgrId) => {
                    handleCancel();
                    setIsAddingNew(true);
                    setEditingNode({ id: "", userId: "", name: "", title: "", managerId: mgrId, children: [] });
                  }}
                  onDelete={async (id) => { if (window.confirm("Delete?")) { await orgService.deleteMember(id); loadChart(); } }}
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
            searchTerm={search}
            onLoadMore={() => {
              // STRICT LOCK CHECK: Prevents the jump to page 3/4
              if (!isFetchingRef.current && !isSearchLoading && hasMore) {
                isFetchingRef.current = true; // LOCK IMMEDIATELY
                setPage(prev => Number(prev) + 1);
              }
            }}
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
              setAvailableUsers([]);
              isFetchingRef.current = true; // Lock for the initial search
            }}
            onUpdateField={setEditingNode}
            onSave={async (updated) => {
              if (!updated.userId || !updated.managerId) return;
              if (isAddingNew) await orgService.addMember(updated.userId, updated.managerId);
              else await orgService.editMember(updated.id, updated.managerId, updated.userId);
              await loadChart();
              handleCancel();
            }}
            onCancel={handleCancel}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}