import {
  BadgeDollarSign,
  Boxes,
  Gauge,
  LayoutGrid,
  LogOut,
  ReceiptText,
  Settings,
  ShieldHalf,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
  WalletCards,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

const navItems = [
  { to: "/customers", label: "العملاء", icon: Users, ready: true },
  { to: "/products", label: "المنتجات", icon: Boxes, ready: true },
  { to: "/suppliers", label: "المورّدون", icon: Truck, ready: true },
  { to: "/purchases", label: "المشتريات", icon: ShoppingCart, ready: false },
  { to: "/invoices", label: "الفواتير", icon: ReceiptText, ready: false },
  { to: "/payments", label: "الدفعات", icon: BadgeDollarSign, ready: false },
  { to: "/employees", label: "الموظفون", icon: ShieldHalf, ready: false },
  { to: "/settings", label: "الإعدادات", icon: Settings, ready: false },
  { to: "/treasury", label: "الخزنة", icon: WalletCards, ready: false },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar-panel flex flex-col rounded-[24px] p-4">
      <div className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.08] px-3 py-3">
        <div className="rounded-[14px] bg-white/12 p-2.5 text-blue-100">
          <Gauge className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-blue-100/80">نسخة العرض</p>
          <h1 className="truncate text-base font-semibold text-white">نظام الإدارة والمحاسبة</h1>
        </div>
      </div>

      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            "mt-4 flex items-center gap-3 rounded-[18px] border px-3.5 py-2.5 transition",
            isActive
              ? "border-white/16 bg-white text-[#172554] shadow-[0_12px_24px_rgba(15,23,42,0.1)]"
              : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
          )
        }
      >
        <div className="rounded-[14px] bg-[#EEF4FF] p-2.5 text-[#1D4ED8]">
          <LayoutGrid className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-current/60">الوحدة النشطة</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm font-semibold">التحكم المالي</p>
            <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              نشط
            </span>
          </div>
        </div>
      </NavLink>

      <nav className="mt-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (!item.ready) {
            return (
              <div
                key={item.to}
                aria-disabled="true"
                className="flex items-center gap-3 rounded-[14px] border border-dashed border-white/8 bg-white/[0.025] px-3 py-2.5 text-sm font-medium text-slate-400/80"
              >
                <Icon className="h-4 w-4 opacity-70" />
                <span>{item.label}</span>
                <span className="mr-auto rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-slate-300/80">
                  قريباً
                </span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-white text-[#172554] shadow-sm"
                    : "text-slate-200 hover:bg-white/8 hover:text-white"
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.07] p-3">
        <div className="flex items-center gap-3">
          <div className="rounded-[14px] bg-white/12 p-2 text-blue-100">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.full_name ?? "المحاسب"}</p>
            <p className="ltr-content truncate text-xs text-slate-300">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[14px] border border-rose-300/25 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-500/18"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
