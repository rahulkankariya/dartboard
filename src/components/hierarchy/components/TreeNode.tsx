import React from "react";
import { Employee } from "../types";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  User,
} from "lucide-react";

interface TreeNodeProps {
  node: Employee;
  expandedIds: Set<string>;
  onEdit: (node: Employee) => void;
  onAdd: (managerId: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  expandedIds,
  onEdit,
  onAdd,
  onDelete,
  onToggle,
}) => {
  const isExpanded = expandedIds.has(node.id);
  const hasChildren = !!(node.children && node.children.length > 0);

  return (
    <div className="flex flex-col items-center relative">
      <div className="z-10 bg-white border border-slate-200 p-5 rounded-3xl shadow-md w-80 hover:border-indigo-500 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg">
              <User size={20} strokeWidth={2.5} />
            </div>
            <div className="max-w-30">
              <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">
                {node.name}
              </h3>
              <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-0.5">
                {node.title || "Team Member"}
              </p>
            </div>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => onAdd(node.id)}
              className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
            >
              <Plus size={15} />
            </button>
            <button
              onClick={() => onEdit(node)}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(node.id)}
              className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase">
              Team Size
            </span>
            <span className="text-[11px] font-bold text-slate-700">
              {hasChildren ? `${node.children?.length} Reports` : "Individual"}
            </span>
          </div>
          {hasChildren && (
            <button
              onClick={() => onToggle(node.id)}
              className={`p-1.5 rounded-full transition-all ${isExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="flex gap-10 mt-12 relative pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-linear-to-b from-indigo-500 to-slate-200" />
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
