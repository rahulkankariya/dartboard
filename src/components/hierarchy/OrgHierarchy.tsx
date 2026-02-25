"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, X, Loader2, Columns, Rows } from "lucide-react";
import { toast } from "sonner";

// Types
import { Employee, ExternalUser } from "./types";

// Components
import { TreeNode } from "./components/TreeNode";
import { EditModal } from "./components/EditModal";
import { ConfirmDialog } from "./components/ConfirmDialog";

// API
import { orgService } from "./api/org-service";

// Helper to get all IDs for "Expand All"
const getAllNodeIds = (nodes: Employee[]): string[] => {
  let ids: string[] = [];
  nodes.forEach((node) => {
    ids.push(node.id);
    if (node.children && node.children.length > 0) {
      ids = [...ids, ...getAllNodeIds(node.children)];
    }
  });
  return ids;
};

export default function OrgHierarchyContainer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // --- STATE: Data & Loading ---
  const [roots, setRoots] = useState<Employee[]>([]);
  const [availableUsers, setAvailableUsers] = useState<ExternalUser[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- STATE: UI & Layout ---
  const [layout, setLayout] = useState<"vertical" | "horizontal">("vertical");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // --- STATE: Editing & Search ---
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingNode, setEditingNode] = useState<Employee | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const isFetchingRef = useRef(false);

  // --- ACTIONS ---
  const loadChart = async () => {
    setIsInitialLoading(true);
    try {
      const response = await orgService.getInitialChart();
      const data = response || [];
      setRoots(data);
      // Default: Expand everything on first load
      if (data.length > 0) {
        setExpandedIds(new Set(getAllNodeIds(data)));
      }
    } catch (e) {
      console.error("Failed to load chart:", e);
      toast.error("Failed to sync organization chart");
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
    setIsSaving(false);
    isFetchingRef.current = false;
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await orgService.deleteMember(deleteConfirmId);
      toast.success("Member successfully removed");
      await loadChart();
    } catch (e: any) {
      const apiErrorMessage = e.response?.data?.message || "This member cannot be removed";
      toast.error("Delete Failed", { description: apiErrorMessage });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    if (isOpen) loadChart();
  }, [isOpen]);

  // Search Logic (Debounced)
  useEffect(() => {
    if (!editingNode) return;

    const timer = setTimeout(async () => {
      setIsSearchLoading(true);
      try {
        const results = await orgService.searchUsers(search, page);
        setAvailableUsers((prev) => {
          if (page === 1) return results;
          const existingIds = new Set(prev.map((u) => u.id));
          return [...prev, ...results.filter((u: any) => !existingIds.has(u.id))];
        });
        setHasMore(results.length === 10);
      } catch (e) {
        setHasMore(false);
      } finally {
        setIsSearchLoading(false);
        isFetchingRef.current = false;
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
        {/* Header with New Controls */}
        <header className="p-4 bg-white border-b flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded text-white">
                <Network size={18} />
              </div>
              <h1 className="font-bold text-slate-800">Org Hierarchy</h1>
            </div>

            {/* Expand/Collapse Controls */}
            <div className="flex bg-slate-100 p-1 rounded-md border text-[10px] font-bold">
              <button 
                onClick={() => setExpandedIds(new Set(getAllNodeIds(roots)))} 
                className="px-2 py-1 hover:bg-white rounded transition-all uppercase"
              >
                Expand All
              </button>
              <button 
                onClick={() => setExpandedIds(new Set())} 
                className="px-2 py-1 hover:bg-white rounded transition-all uppercase"
              >
                Collapse
              </button>
            </div>

            {/* Layout Toggle */}
            <div className="flex bg-indigo-50 p-1 rounded-md border border-indigo-100 gap-1">
              <button 
                onClick={() => setLayout("vertical")}
                className={`flex items-center gap-1 px-3 py-1 rounded text-[10px] font-bold transition-all ${layout === 'vertical' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
              >
                <Rows size={14} /> VERTICAL
              </button>
              <button 
                onClick={() => setLayout("horizontal")}
                className={`flex items-center gap-1 px-3 py-1 rounded text-[10px] font-bold transition-all ${layout === 'horizontal' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
              >
                <Columns size={14} /> HORIZONTAL
              </button>
            </div>
          </div>
          
          <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </header>

        {/* Tree Container */}
        <main className="flex-1 overflow-auto p-12 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[24px_24px]">
          {isInitialLoading ? (
            <div className="flex flex-col items-center mt-20 gap-3 text-slate-400">
              <Loader2 className="animate-spin" />
              <p>Building hierarchy...</p>
            </div>
          ) : (
            <div className={`flex ${layout === "vertical" ? "flex-col items-center" : "flex-row items-start"} min-w-max justify-center`}>
              {roots.map((root) => (
                <TreeNode
                  key={root.id}
                  node={root}
                  layout={layout}
                  expandedIds={expandedIds}
                  onEdit={(n) => {
                    handleCancel();
                    setEditingNode(n);
                  }}
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

        {/* Edit Modal Logic (Restored) */}
        {editingNode && (
          <EditModal
            node={editingNode}
            availableUsers={availableUsers}
            isLoading={isSearchLoading}
            isSaving={isSaving}
            hasMore={hasMore}
            searchTerm={search}
            onLoadMore={() => {
              if (!isFetchingRef.current && !isSearchLoading && hasMore) {
                isFetchingRef.current = true;
                setPage((prev) => prev + 1);
              }
            }}
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
              setAvailableUsers([]);
              isFetchingRef.current = true;
            }}
            onUpdateField={setEditingNode}
            onSave={async (updated) => {
              if (!updated.userId || !updated.managerId) return;
              setIsSaving(true);
              try {
                if (isAddingNew) {
                  await orgService.addMember(updated.userId, updated.managerId);
                  toast.success("User assigned to hierarchy");
                } else {
                  await orgService.editMember(updated.id, updated.managerId, updated.userId);
                  toast.success("Hierarchy updated");
                }
                await loadChart();
                handleCancel();
              } catch (e: any) {
                const errorMsg = e.response?.data?.message || "Failed to update hierarchy";
                toast.error(errorMsg);
              } finally {
                setIsSaving(false);
              }
            }}
            onCancel={handleCancel}
          />
        )}

        <ConfirmDialog
          isOpen={!!deleteConfirmId}
          title="Remove Member?"
          description="Confirming will remove this member. Their direct reports will be reassigned to the manager above."
          confirmLabel="Delete Member"
          cancelLabel="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          variant="danger"
        />
      </motion.div>
    </AnimatePresence>
  );
}