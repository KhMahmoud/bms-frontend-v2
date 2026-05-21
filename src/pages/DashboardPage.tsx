import { AlertTriangle, BadgeDollarSign, Box, CircleDollarSign, ReceiptText, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

import { StatePanel } from "../components/ui/StatePanel";
import { formatCurrency } from "../lib/utils";
import { getDashboardOverview, getDashboardSummary } from "../services/modules";
import type { DashboardOverview, DashboardSummary } from "../types/api";

function parseNumericValue(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [overviewData, summaryData] = await Promise.all([getDashboardOverview(), getDashboardSummary()]);
        if (!isMounted) {
          return;
        }

        setOverview(overviewData);
        setSummary(summaryData);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError instanceof Error ? requestError.message : "تعذر تحميل لوحة التحكم.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <StatePanel
        title="جارٍ تحميل لوحة التحكم"
        description="يتم الآن تجهيز الملخص العام والمؤشرات الرئيسية."
      />
    );
  }

  if (error || !overview || !summary) {
    return (
      <StatePanel
        title="تعذر تحميل لوحة التحكم"
        description={error ?? "بيانات لوحة التحكم غير متاحة حالياً."}
      />
    );
  }

  const totalSales = parseNumericValue(summary.total_sales);
  const totalCollected = parseNumericValue(summary.total_collected);
  const totalReceivables = parseNumericValue(summary.total_receivables);
  const collectionRate = totalSales > 0 ? clampPercentage((totalCollected / totalSales) * 100) : 0;
  const receivablesRate = totalSales > 0 ? clampPercentage((totalReceivables / totalSales) * 100) : 0;
  const customerBase = Math.max(overview.customer_count, 1);
  const activeCustomersRate = clampPercentage((summary.active_customers / customerBase) * 100);

  const kpis = [
    {
      label: "نسبة التحصيل",
      value: `${collectionRate}%`,
      helper: "من إجمالي المبيعات",
      icon: CircleDollarSign,
      tone: "bg-[#E8F7EF] text-[#166534]",
    },
    {
      label: "الذمم المستحقة",
      value: formatCurrency(summary.total_receivables),
      helper: `${receivablesRate}% مفتوح`,
      icon: Wallet,
      tone: "bg-[#FBF4D7] text-[#946200]",
    },
    {
      label: "المحصّل",
      value: formatCurrency(summary.total_collected),
      helper: "المبالغ المستلمة",
      icon: BadgeDollarSign,
      tone: "bg-[#E8F7EF] text-[#166534]",
    },
    {
      label: "العملاء النشطون",
      value: summary.active_customers,
      helper: `${activeCustomersRate}% من العملاء`,
      icon: Users,
      tone: "bg-slate-100 text-slate-700",
    },
    {
      label: "مخزون منخفض",
      value: overview.low_stock_count,
      helper: "منتجات تحتاج متابعة",
      icon: AlertTriangle,
      tone: "bg-[#FBF4D7] text-[#946200]",
    },
  ];

  const todaySignals = [
    {
      label: "إجمالي المبيعات",
      value: formatCurrency(summary.total_sales),
      note: "قيمة الفواتير المسجلة",
    },
    {
      label: "الفواتير الحالية",
      value: overview.invoice_count,
      note: "عدد الفواتير داخل النظام",
    },
    {
      label: "الدفعات الحالية",
      value: overview.payment_count,
      note: "دفعات مرتبطة بالحركة",
    },
  ];

  const unitActivity = [
    ["العملاء", overview.customer_count],
    ["المنتجات", overview.product_count],
    ["الفواتير", overview.invoice_count],
    ["الدفعات", overview.payment_count],
  ];
  const maxFinancialValue = Math.max(totalSales, totalCollected, totalReceivables, 1);
  const financialBars = [
    {
      label: "إجمالي المبيعات",
      value: formatCurrency(summary.total_sales),
      percent: clampPercentage((totalSales / maxFinancialValue) * 100),
      tone: "bg-[#2C2F7A]",
    },
    {
      label: "المحصّل",
      value: formatCurrency(summary.total_collected),
      percent: clampPercentage((totalCollected / maxFinancialValue) * 100),
      tone: "bg-[#67C89A]",
    },
    {
      label: "المستحق",
      value: formatCurrency(summary.total_receivables),
      percent: clampPercentage((totalReceivables / maxFinancialValue) * 100),
      tone: "bg-[#E6B325]",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="dashboard-card rounded-[24px] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">لوحة التحكم</h1>
            <span className="rounded-full bg-[#E8F7EF] px-3 py-1 text-xs font-semibold text-[#166534]">
              Financial Overview
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">نظرة مالية مركزة على التحصيل والذمم والمخزون</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px_260px]">
          <div className="min-w-0">
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
              {kpis.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className="dashboard-interactive rounded-[14px] border border-slate-200 bg-slate-50/80 px-3.5 py-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`rounded-[12px] p-2 ${item.tone}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="truncate text-sm font-semibold text-slate-600">{item.label}</p>
                    </div>
                    <p className="mt-2 text-[1.55rem] font-semibold leading-tight text-slate-950">{item.value}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{item.helper}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[18px] bg-[linear-gradient(180deg,#2C2F7A_0%,#23265F_100%)] p-4 text-white shadow-[0_14px_30px_rgba(35,38,95,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-white/60">COLLECTION</p>
                <p className="mt-1 text-sm text-white/72">نسبة التحصيل</p>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-[#67C89A]" />
            </div>

            <div className="mt-4 flex justify-center">
              <div
                className="flex h-[136px] w-[136px] items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#67C89A 0 ${collectionRate}%, rgba(255,255,255,0.16) ${collectionRate}% 100%)`,
                }}
              >
                <div className="flex h-[96px] w-[96px] flex-col items-center justify-center rounded-full bg-[#23265F]">
                  <span className="text-[1.75rem] font-semibold leading-none">{collectionRate}%</span>
                  <span className="mt-1.5 text-xs text-white/65">محصّل</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[12px] border border-white/10 bg-white/8 px-3 py-2.5">
                <p className="text-xs text-white/58">العملاء</p>
                <p className="mt-1 text-lg font-semibold">{summary.active_customers}</p>
              </div>
              <div className="rounded-[12px] border border-white/10 bg-white/8 px-3 py-2.5">
                <p className="text-xs text-white/58">الدفعات</p>
                <p className="mt-1 text-lg font-semibold">{overview.payment_count}</p>
              </div>
            </div>
          </aside>

          <aside className="rounded-[18px] border border-slate-200 bg-slate-50/85 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-950">ملخص مالي</h2>
                <p className="mt-1 text-xs text-slate-500">مقارنة سريعة حسب القيمة</p>
              </div>
              <div className="rounded-[12px] bg-white p-2 text-[#2C2F7A] ring-1 ring-slate-200">
                <BadgeDollarSign className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {financialBars.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                    <span className="ltr-content text-sm font-semibold text-slate-950">{item.value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                    <div className={`h-full rounded-full ${item.tone}`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="dashboard-card dashboard-interactive rounded-[22px] p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">متابعة اليوم</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                قراءة سريعة للمؤشرات اليومية الأهم قبل الانتقال إلى تفاصيل الوحدات.
              </p>
            </div>
            <div className="rounded-[14px] bg-[#E8F7EF] p-3 text-[#166534]">
              <ReceiptText className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {todaySignals.map((item) => (
              <div key={item.label} className="dashboard-interactive rounded-[18px] border border-slate-200 bg-white px-4 py-5">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-3 text-[1.8rem] font-semibold tracking-tight text-slate-950">{item.value}</p>
                <p className="mt-2 text-xs text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card dashboard-interactive rounded-[22px] p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">تنبيه المخزون</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                هذه البطاقة تساعد على تحديد المنتجات التي تتطلب إعادة تزويد أو مراجعة.
              </p>
            </div>
            <div className="rounded-[14px] bg-[#FBF4D7] p-3 text-[#946200]">
              <Box className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 rounded-[18px] border border-[#F0DE9A] bg-[#FBF4D7] px-5 py-5">
            <p className="text-sm font-semibold text-[#946200]">عدد المنتجات منخفضة المخزون</p>
            <p className="mt-3 text-5xl font-semibold text-slate-950">{overview.low_stock_count}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              كلما ارتفع هذا الرقم زادت الحاجة لمراجعة الأصناف الحساسة قبل حدوث نقص فعلي.
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-card dashboard-interactive rounded-[22px] p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">نشاط الوحدات</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              عرض مختصر لحجم البيانات الحالية في الوحدات الأساسية الجاهزة ضمن نسخة العرض.
            </p>
          </div>
          <div className="rounded-[14px] bg-slate-100 p-3 text-slate-700">
            <BadgeDollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {unitActivity.map(([label, value]) => (
            <div key={label} className="dashboard-interactive rounded-[18px] border border-slate-200 bg-white px-4 py-5">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
