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
    <aside className="sidebar-panel flex flex-col rounded-[18px] p-4 text-white">
      <div className="rounded-[14px] border border-white/10 bg-[#263445]/55 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-[12px] bg-white/10 p-3 text-white">
            <Gauge className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-white/60">نسخة العرض</p>
            <h1 className="mt-1 truncate text-base font-semibold text-white">نظام الإدارة والمحاسبة</h1>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="px-2 text-[11px] font-semibold tracking-[0.18em] text-white/45">الوحدات الأساسية</p>
        <nav className="mt-3 space-y-1.5">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium transition duration-200 hover:-translate-y-0.5",
                    isActive
                      ? "bg-white text-[#263445] shadow-[0_10px_20px_rgba(15,23,42,0.18)]"
                      : "text-white/78 hover:bg-white/8 hover:text-white hover:shadow-[0_10px_20px_rgba(15,23,42,0.14)]"
                  )
                }
              >
                <div
                  className={cn(
                    "rounded-[10px] p-2",
                    item.to === "/" ? "bg-[#E8F7EF] text-[#166534]" : "bg-white/10 text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-5 rounded-[14px] border border-white/8 bg-[#263445]/45 px-4 py-4">
        <p className="text-sm font-semibold text-white">الوحدات القادمة</p>
        <p className="mt-1 text-xs leading-6 text-white/55">موجودة ضمن الهيكل العام لكنها غير مفعلة في نسخة العرض الحالية.</p>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 lg:grid-cols-1">
          {upcomingModules.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-2 rounded-[10px] px-2 py-1.5 text-sm text-white/38"
              >
                <Icon className="h-3.5 w-3.5 opacity-60" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <div className="rounded-[14px] border border-white/10 bg-[#263445]/55 px-4 py-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.full_name ?? "المحاسب"}</p>
            <p className="ltr-content mt-1 truncate text-xs text-white/55">{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={() => void logout()}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-white/10 bg-white/8 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-white/12"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </aside>
  );
}
