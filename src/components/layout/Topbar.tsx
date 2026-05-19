export function Topbar() {
  return (
    <header className="glass-panel flex items-center justify-between rounded-xl px-4 py-3">
      <div>
        <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">لوحة العمل</p>
        <h2 className="mt-1 text-base font-semibold text-slate-950">نظام الإدارة والمحاسبة</h2>
      </div>

      <div className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">
        <span className="text-sm font-medium text-[#1D4ED8]">نسخة عرض جاهزة</span>
      </div>
    </header>
  );
}
