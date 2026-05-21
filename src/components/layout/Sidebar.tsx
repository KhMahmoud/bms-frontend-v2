import {
  Boxes,
  Gauge,
  LayoutGrid,
  LogOut,
  ReceiptText,
  Settings,
  ShieldHalf,
  ShoppingCart,
  Truck,
  Users,
  WalletCards,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

const primaryNavItems = [
  { to: "/", label: "التحكم المالي", icon: LayoutGrid, end: true },
  { to: "/customers", label: "العملاء", icon: Users },
  { to: "/products", label: "المنتجات", icon: Boxes },
  { to: "/suppliers", label: "المورّدون", icon: Truck },
];

const upcomingModules = [
  { label: "المشتريات", icon: ShoppingCart },
  { label: "الفواتير", icon: ReceiptText },
  { label: "الدفعات", icon: WalletCards },
  { label: "الموظفون", icon: ShieldHalf },
  { label: "الإعدادات", icon: Settings },
  { label: "الخزنة", icon: WalletCards },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar-panel flex flex-col rounded-[26px] p-4">
      <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3">
          <div className="rounded-[16px] bg-[linear-gradient(135deg,#172554_0%,#2563eb_100%)] p-3 text-white">
            <Gauge className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#2563EB]">نسخة العرض</p>
            <h1 className="mt-1 truncate text-base font-semibold text-slate-950">نظام الإدارة والمحاسبة</h1>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="px-2 text-[11px] font-semibold tracking-[0.18em] text-slate-400">الرئيسية</p>
        <nav className="mt-3 space-y-2">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "sidebar-main-link flex items-center gap-3 rounded-[16px] px-3.5 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-[linear-gradient(90deg,#eef4ff_0%,#f7f4ff_100%)] text-slate-950 ring-1 ring-blue-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  )
                }
              >
                <div className="rounded-[12px] bg-white p-2 text-[#2563EB] ring-1 ring-slate-200">
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 rounded-[20px] border border-slate-200 bg-slate-50/90 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">الوحدات القادمة</p>
            <p className="mt-1 text-xs leading-6 text-slate-500">محفوظة ضمن الهيكل الحالي لكن غير مفعلة في هذه النسخة.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {upcomingModules.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-2.5 rounded-[14px] bg-white px-3 py-2.5 text-sm text-slate-400 ring-1 ring-slate-200/80"
              >
                <Icon className="h-3.5 w-3.5 opacity-60" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{user?.full_name ?? "المحاسب"}</p>
            <p className="ltr-content mt-1 truncate text-xs text-slate-500">{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={() => void logout()}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </aside>
  );
}
