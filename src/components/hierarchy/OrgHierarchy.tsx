"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, X, Loader2 } from "lucide-react";

// Types
import { Employee, ExternalUser } from "./types";

// Components
import { TreeNode } from "./components/TreeNode";
import { EditModal } from "./components/EditModal";
import { ConfirmDialog } from "./components/ConfirmDialog";

// API
import { orgService } from "./api/org-service";

export default function OrgHierarchyContainer({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) {
  // --- STATE ---
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
  
  // State for managed delete dialog
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // THE LOCK: Prevents race conditions and duplicate page jumps
  const isFetchingRef = useRef(false);

  // --- ACTIONS ---
  const loadChart = async () => {
    setIsInitialLoading(true);
    try {
      const response = await orgService.getInitialChart();
      setRoots(response || []);
      if (response?.length > 0) setExpandedIds(new Set([response[0].id]));
    } catch (e) { 
      console.error("Failed to load chart:", e); 
    } finally { 
      setIsInitialLoading(false); 
    }
  };

  const handleCancel = () => {
    setEditingNode(null);
    setIsAddingNew(false);
    setSearch("");
    setAvailableUsers([]);
    setPage(1);
    setHasMore(true);
    isFetchingRef.current = false;
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await orgService.deleteMember(deleteConfirmId);
      await loadChart();
    } catch (e) {
      console.error("Delete error:", e);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // --- EFFECTS ---
  useEffect(() => { 
    if (isOpen) loadChart(); 
  }, [isOpen]);

  // Search & Pagination Logic
  useEffect(() => {
    if (!editingNode) return;

    const timer = setTimeout(async () => {
      setIsSearchLoading(true);
      try {
        const limit = 10;
        const currentPage = Number(page);
        
        // Pass page to service
        const results = await orgService.searchUsers(search, currentPage);
        
        setAvailableUsers((prev) => {
          if (currentPage === 1) return results;
          
          // PREVENT DUPLICATE KEYS: Filter out items already in the list
          const existingIds = new Set(prev.map(u => u.id));
          const uniqueNewResults = results.filter((u: ExternalUser) => !existingIds.has(u.id));
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-100 flex flex-col bg-slate-50"
      >
        {/* Header */}
        <header className="p-6 bg-white border-b flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Network size={20} />
            </div>
            <h1 className="font-black uppercase tracking-tight text-slate-800 text-lg">Org Hierarchy</h1>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* Hierarchy Tree */}
        <main className="flex-1 overflow-auto p-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[length:32px_32px]">
          {isInitialLoading ? (
            <div className="flex flex-col items-center mt-20 gap-4">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
              <p className="text-slate-400 font-medium">Mapping organization...</p>
            </div>
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
                  onDelete={(id) => setDeleteConfirmId(id)}
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

        {/* 1. Add/Edit Member Modal */}
        {editingNode && (
          <EditModal
            node={editingNode}
            availableUsers={availableUsers}
            isLoading={isSearchLoading}
            hasMore={hasMore}
            searchTerm={search}
            onLoadMore={() => {
              // LOCK CHECK: Prevent duplicate page increments
              if (!isFetchingRef.current && !isSearchLoading && hasMore) {
                isFetchingRef.current = true; // SET LOCK
                setPage(prev => Number(prev) + 1);
              }
            }}
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
              setAvailableUsers([]);
              isFetchingRef.current = true; // Lock for search trigger
            }}
            onUpdateField={setEditingNode}
            onSave={async (updated) => {
              if (!updated.userId || !updated.managerId) return;
              setIsSearchLoading(true); // Trigger button loader
              try {
                if (isAddingNew) await orgService.addMember(updated.userId, updated.managerId);
                else await orgService.editMember(updated.id, updated.managerId, updated.userId);
                await loadChart();
                handleCancel(); // Close modal only on success
              } catch (e) {
                console.error(e);
              } finally {
                setIsSearchLoading(false);
              }
            }}
            onCancel={handleCancel}
          />
        )}

        {/* 2. Confirm Delete Dialog */}
        <ConfirmDialog 
          isOpen={!!deleteConfirmId}
          title="Remove Member?"
          description="Are you sure you want to delete this member? Their direct reports will be moved up the hierarchy."
          confirmLabel="Delete Member"
          cancelLabel="Keep Member"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          variant="danger"
        />

      </motion.div>
    </AnimatePresence>
  );
}