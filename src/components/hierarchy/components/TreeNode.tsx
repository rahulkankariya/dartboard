"use client";

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
  layout: "vertical" | "horizontal";
  expandedIds: Set<string>;
  onEdit: (node: Employee) => void;
  onAdd: (mgrId: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function TreeNode({
  node,
  layout,
  expandedIds,
  onEdit,
  onAdd,
  onDelete,
  onToggle,
}: TreeNodeProps) {
  const isExpanded = expandedIds.has(node.id);
  const children = node.children ?? [];
  const hasChildren = children.length > 0;

  return (
    <div className={`flex items-center ${layout === "vertical" ? "flex-col" : "flex-row"}`}>
      
      {/* CARD AND CONNECTOR CONTAINER */}
      <div className="relative flex items-center group">
        
        {/* Incoming Line (Parent to this Node) */}
        {node.managerId && (
          <div 
            className={`absolute bg-slate-300 transition-all duration-300 ${
              layout === "vertical" 
                ? "h-12 w-0.5 -top-12 left-1/2 -translate-x-1/2" 
                : "w-10 h-0.5 -left-10 top-1/2 -translate-y-1/2"
            }`} 
          />
        )}

        {/* User Card - Styled with your Old UI logic */}
        <div className="z-10 bg-white border border-slate-200 p-5 rounded-3xl shadow-md w-80 hover:border-indigo-500 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              {/* Gradient Icon Wrapper */}
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shrink-0">
                <User size={20} strokeWidth={2.5} />
              </div>
              <div className="max-w-30">
                <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">
                  {node.name}
                </h3>
                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-0.5 truncate">
                  {node.title || "Team Member"}
                </p>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onAdd(node.id)}
                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                title="Add Report"
              >
                <Plus size={15} />
              </button>
              <button
                onClick={() => onEdit(node)}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                title="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(node.id)}
                className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Bottom Info Row */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                Team Size
              </span>
              <span className="text-[11px] font-bold text-slate-700">
                {hasChildren ? `${children.length} Reports` : "Individual"}
              </span>
            </div>
            
            {hasChildren && (
              <button
                onClick={() => onToggle(node.id)}
                className={`p-1.5 rounded-full transition-all ${
                  isExpanded ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Outgoing Line (This Node to Children) */}
        {isExpanded && hasChildren && (
          <div 
            className={`absolute bg-slate-300 transition-all duration-300 ${
              layout === "vertical" 
                ? "h-12 w-0.5 -bottom-12 left-1/2 -translate-x-1/2" 
                : "w-10 h-0.5 -right-10 top-1/2 -translate-y-1/2"
            }`} 
          />
        )}
      </div>

      {/* RENDER CHILDREN RECURSIVELY */}
      {isExpanded && hasChildren && (
        <div 
          className={`flex relative ${
            layout === "vertical" 
              ? "flex-row pt-12" 
              : "flex-col pl-10"
          } gap-10 animate-in fade-in slide-in-from-top-4 duration-500`}
        >
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              layout={layout}
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
}