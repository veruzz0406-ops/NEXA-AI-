import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-purple-400 shrink-0" />,
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-up flex items-center gap-3 px-4 py-3 rounded-xl bg-[#13142e]/95 dark:bg-[#13142e]/95 border border-purple-500/30 text-white shadow-2xl backdrop-blur-xl max-w-md">
      {icons[toast.type] || icons.info}
      <p className="text-sm font-medium text-slate-100">{toast.message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors ml-auto"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
