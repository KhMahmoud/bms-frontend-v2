import { cn, toTitleCase } from "../../lib/utils";

const toneMap: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  blocked: "bg-rose-50 text-rose-700 ring-rose-200",
  in_stock: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  low_stock: "bg-amber-50 text-amber-700 ring-amber-200",
  out_of_stock: "bg-rose-50 text-rose-700 ring-rose-200",
  true: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  false: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function StatusBadge({ value }: { value: string | boolean }) {
  const normalized = String(value);
  const labelMap: Record<string, string> = {
    active: "نشط",
    inactive: "غير نشط",
    blocked: "موقوف",
    in_stock: "متوفر",
    low_stock: "مخزون منخفض",
    out_of_stock: "نافد",
    true: "متاح",
    false: "غير متاح",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset",
        toneMap[normalized] ?? "bg-blue-50 text-blue-700 ring-blue-200"
      )}
    >
      {labelMap[normalized] ?? (typeof value === "boolean" ? (value ? "متاح" : "غير متاح") : toTitleCase(normalized))}
    </span>
  );
}
