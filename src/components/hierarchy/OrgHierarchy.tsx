"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Pencil, Trash2, X, Network, Briefcase, ChevronRight, Save, Trash
} from "lucide-react";

// --- Types ---
export type Employee = {
  id: string;
  name: string;
  title: string;
  department: string;
  managerId: string | null;
};

export type OrgNode = Employee & { children: OrgNode[] };

// --- Initial Static Data ---
const INITIAL_DATA: Employee[] = [
  { id: "1", name: "Alex Rivera", title: "CEO", department: "Executive", managerId: null },
  { id: "2", name: "Jordan Smith", title: "CTO", department: "Tech", managerId: "1" },
  { id: "3", name: "Taylor Wong", title: "VP Product", department: "Product", managerId: "1" },
];

// --- Utility: Build Tree ---
function buildTree(employees: Employee[]): OrgNode[] {
  const map = new Map<string, OrgNode>();
  employees.forEach((e) => map.set(e.id, { ...e, children: [] }));
  const roots: OrgNode[] = [];
  for (const node of map.values()) {
    if (node.managerId && map.has(node.managerId)) {
      map.get(node.managerId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export default function OrgHierarchy({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_DATA);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["1", "2"]));
  const [editingNode, setEditingNode] = useState<Employee | null>(null);

  const roots = useMemo(() => buildTree(employees), [employees]);

  // --- HANDLER: Add (The Jordan Smith Flow) ---
  const handleAddNewReport = (parentId: string) => {
    const newMember: Employee = {
      id: Date.now().toString(),
      name: "New Recruit",
      title: "Staff",
      department: "General",
      managerId: parentId 
    };
    setEmployees(prev => [...prev, newMember]);
    setExpandedIds(prev => new Set(prev).add(parentId));
    setEditingNode(newMember); // Open edit immediately
  };

  // --- HANDLER: Delete ---
  const handleDelete = (id: string) => {
    const target = employees.find(e => e.id === id);
    if (!target) return;

    if (confirm(`Remove ${target.name}? Their team will now report to their manager.`)) {
      setEmployees(prev => {
        const deletedManagerId = target.managerId;
        return prev
          .filter(e => e.id !== id) // Remove the person
          .map(e => e.managerId === id ? { ...e, managerId: deletedManagerId } : e); // Re-assign kids
      });
    }
  };

  const handleUpdate = (updated: Employee) => {
    setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
    setEditingNode(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex flex-col bg-slate-50 overflow-hidden">
          
          <header className="p-4 bg-white border-b flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200"><Network size={20} /></div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">Org Management</h1>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setOrientation("vertical")} className={`px-4 py-1.5 text-xs font-bold rounded-lg ${orientation === "vertical" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}>Vertical</button>
              <button onClick={() => setOrientation("horizontal")} className={`px-4 py-1.5 text-xs font-bold rounded-lg ${orientation === "horizontal" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}>Horizontal</button>
              <button onClick={onClose} className="ml-2 p-1.5 hover:bg-red-50 text-slate-400 rounded-lg"><X size={18}/></button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-12 bg-slate-50">
            <div className={`flex ${orientation === "vertical" ? "flex-col items-center" : "flex-row items-start"} justify-center min-w-max gap-8`}>
              {roots.map(root => (
                <TreeNode 
                  key={root.id} node={root} orientation={orientation} expandedIds={expandedIds} 
                  onEdit={setEditingNode} 
                  onAdd={handleAddNewReport}
                  onDelete={handleDelete}
                  onToggle={(id: string) => {
                    const next = new Set(expandedIds);
                    next.has(id) ? next.delete(id) : next.add(id);
                    setExpandedIds(next);
                  }}
                />
              ))}
            </div>
          </main>

          {/* Edit Modal */}
          {editingNode && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-110 flex items-center justify-center p-6">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-4xl shadow-2xl w-full max-w-sm">
                <h2 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-widest">Update Profile</h2>
                <div className="space-y-4">
                  <input className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold" value={editingNode.name} onChange={e => setEditingNode({...editingNode, name: e.target.value})} placeholder="Full Name" />
                  <input className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold" value={editingNode.title} onChange={e => setEditingNode({...editingNode, title: e.target.value})} placeholder="Designation" />
                  <input className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold" value={editingNode.department} onChange={e => setEditingNode({...editingNode, department: e.target.value})} placeholder="Department" />
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setEditingNode(null)} className="flex-1 p-4 bg-slate-100 text-slate-500 font-bold rounded-2xl">Cancel</button>
                    <button onClick={() => handleUpdate(editingNode)} className="flex-1 p-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2"><Save size={16}/> Save</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Card UI Component ---
function TreeNode({ node, expandedIds, onToggle, orientation, onEdit, onAdd, onDelete }: any) {
  const isExpanded = expandedIds.has(node.id);
  
  return (
    <div className={`flex ${orientation === "vertical" ? "flex-col items-center" : "flex-row items-center"} relative`}>
      <div className="p-5 bg-white border-2 border-slate-100 rounded-3xl w-60 shadow-lg m-4 hover:border-indigo-400 transition-all group relative">
        
        {/* Floating Action Buttons */}
        <div className="absolute -top-3 -right-2 flex gap-1">
          <button onClick={() => onAdd(node.id)} className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <Plus size={14} strokeWidth={3} />
          </button>
          {node.managerId !== null && ( // Prevent deleting the CEO/Root easily
            <button onClick={() => onDelete(node.id)} className="w-8 h-8 bg-white border-2 border-red-100 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors">
              <Trash2 size={12} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg">
            {node.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-slate-800 text-sm truncate">{node.name}</h3>
            <p className="text-[9px] text-indigo-600 font-black uppercase tracking-widest truncate">{node.title}</p>
          </div>
        </div>

        <button onClick={() => onEdit(node)} className="mt-4 w-full py-2 bg-slate-50 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-indigo-600 hover:text-white transition-all border border-slate-100">
          <Pencil size={12} className="inline mr-1" /> Edit
        </button>

        {node.children.length > 0 && (
          <button onClick={() => onToggle(node.id)} className="w-full mt-2 flex items-center justify-between text-[9px] font-black text-slate-400 group-hover:text-indigo-500">
            <span>{isExpanded ? "Hide" : `${node.children.length} Reports`}</span>
            <ChevronRight size={12} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </button>
        )}
      </div>

      {isExpanded && node.children.length > 0 && (
        <div className={`flex ${orientation === "vertical" ? "flex-row" : "flex-col"}`}>
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} expandedIds={expandedIds} onToggle={onToggle} orientation={orientation} onEdit={onEdit} onAdd={onAdd} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}