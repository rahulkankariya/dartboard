import React from "react";
import { Employee } from "../types";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, User } from "lucide-react";

interface TreeNodeProps {
  node: Employee;
  expandedIds: Set<string>;
  onEdit: (node: Employee) => void;
  onAdd: (managerId: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, expandedIds, onEdit, onAdd, onDelete, onToggle 
}) => {
  const isExpanded = expandedIds.has(node.id);
  const hasChildren = !!(node.children && node.children.length > 0);

  return (
    <div className="flex flex-col items-center relative">
      {/* Node Card */}
      <div className="z-10 bg-white border-2 border-slate-200 p-4 rounded-2xl shadow-sm w-64 hover:border-indigo-400 transition-all group">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600">
              <User size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm leading-tight">{node.name}</h3>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{node.title || "Position TBD"}</p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(node)} className="p-1 hover:text-indigo-600"><Pencil size={14}/></button>
            <button onClick={() => onDelete(node.id)} className="p-1 hover:text-red-500"><Trash2 size={14}/></button>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
          <button onClick={() => onAdd(node.id)} className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 hover:text-indigo-600">
            <Plus size={12}/> Add Report
          </button>
          {hasChildren && (
            <button onClick={() => onToggle(node.id)} className="text-slate-400 hover:text-slate-600">
              {isExpanded ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
            </button>
          )}
        </div>
      </div>

      {/* Connection lines and recursive children */}
      {isExpanded && hasChildren && (
        <div className="flex gap-8 mt-12 relative pt-8">
          {/* Vertical line from parent to the horizontal bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-300" />
          
          {node.children!.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              expandedIds={expandedIds}
              onEdit={onEdit}
              onAdd={onAdd}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};