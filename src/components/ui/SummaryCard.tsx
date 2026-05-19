import type { ReactNode } from "react";

export function SummaryCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <div className="glass-panel rounded-xl p-4 transition hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold leading-tight text-slate-950">{value}</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-2.5 text-[#2563EB] ring-1 ring-blue-100">{icon}</div>
      </div>
      <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-500">{hint}</p>
    </div>
  );
}
