import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../../lib/utils";

export function Drawer({
  open,
  title,
  description,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className={cn("fixed inset-0 z-40 transition", open ? "pointer-events-auto" : "pointer-events-none")}>
      <button
        type="button"
        aria-label="إغلاق"
        onClick={onClose}
        className={cn(
          "absolute inset-0 transition",
          open ? "bg-slate-900/16" : "bg-transparent"
        )}
      />
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-full max-w-[520px] transform border-r border-slate-200 bg-white shadow-2xl shadow-slate-900/10 transition duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary rounded-lg p-2 text-slate-500 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[calc(100%-81px)] overflow-hidden bg-[#F8FAFC]">{children}</div>
      </div>
    </div>
  );
}
