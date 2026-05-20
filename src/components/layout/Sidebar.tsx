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
  { to: "/", label: "لوحة التحكم", icon: LayoutGrid, ready: true },
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
    <aside className="sidebar-panel flex h-full flex-col rounded-2xl p-4">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-3">
        <div className="rounded-lg bg-white/12 p-2.5 text-blue-100">
          <Gauge className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-blue-100/80">نسخة العرض</p>
          <h1 className="truncate text-base font-semibold text-white">نظام الإدارة والمحاسبة</h1>
        </div>
      </div>

      <nav className="mt-5 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (!item.ready) {
            return (
              <div
                key={item.to}
                aria-disabled="true"
                className="flex items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm font-medium text-slate-400"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                <span className="mr-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-amber-200">
                  قريباً
                </span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-white text-[#172554] shadow-sm"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.08] p-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/12 p-2 text-blue-100">
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
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300/30 bg-rose-500/12 px-3 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-500/20"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
