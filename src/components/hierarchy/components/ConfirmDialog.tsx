import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "primary";
}

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-lg ${variant === "danger" ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"}`}
            >
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          </div>
          <p className="text-slate-500 mb-6">{description}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-600"
            >
              {" "}
              {cancelLabel}{" "}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-xl font-semibold text-white ${variant === "danger" ? "bg-red-500" : "bg-indigo-600"}`}
            >
              {" "}
              {confirmLabel}{" "}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
