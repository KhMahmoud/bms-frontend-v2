import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CircleDollarSign,
  CreditCard,
  PackageSearch,
  ReceiptText,
  Search,
  Users,
  Wallet,
} from "lucide-react";
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
  const maxFinancialValue = Math.max(totalSales, totalCollected, totalReceivables, 1);
  const maxUnitValue = Math.max(
    overview.customer_count,
    overview.product_count,
    overview.invoice_count,
    overview.payment_count,
    1
  );

  const overviewCards = [
    {
      label: "إجمالي المبيعات",
      value: formatCurrency(summary.total_sales),
      helper: "قيمة الفواتير",
      icon: CircleDollarSign,
      tone: "bg-slate-100 text-slate-700",
    },
    {
      label: "المحصّل",
      value: formatCurrency(summary.total_collected),
      helper: `${collectionRate}% محصّل`,
      icon: CreditCard,
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
      label: "العملاء",
      value: overview.customer_count,
      helper: `${summary.active_customers} نشط`,
      icon: Users,
      tone: "bg-blue-50 text-slate-700",
    },
    {
      label: "مخزون منخفض",
      value: overview.low_stock_count,
      helper: "يحتاج متابعة",
      icon: AlertTriangle,
      tone: "bg-[#FBF4D7] text-[#946200]",
    },
  ];

  const financialBars = [
    {
      label: "إجمالي المبيعات",
      value: formatCurrency(summary.total_sales),
      percent: clampPercentage((totalSales / maxFinancialValue) * 100),
      tone: "bg-[#334155]",
    },
    {
      label: "المحصّل",
      value: formatCurrency(summary.total_collected),
      percent: clampPercentage((totalCollected / maxFinancialValue) * 100),
      tone: "bg-[#8FD3A5]",
    },
    {
      label: "المستحق",
      value: formatCurrency(summary.total_receivables),
      percent: clampPercentage((totalReceivables / maxFinancialValue) * 100),
      tone: "bg-[#E8D8B8]",
    },
  ];

  const unitActivity = [
    ["العملاء", overview.customer_count, "bg-[#8FD3A5]"],
    ["المنتجات", overview.product_count, "bg-[#334155]"],
    ["الفواتير", overview.invoice_count, "bg-[#E8D8B8]"],
    ["الدفعات", overview.payment_count, "bg-slate-400"],
  ] as const;

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 rounded-[18px] border border-slate-300/70 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">مرحباً، Demo Administrator</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">لوحة التحكم</h1>
        </div>

        <div className="flex h-10 w-full max-w-sm items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 text-sm text-slate-500">
          <Search className="h-4 w-4 text-slate-400" />
          <span>بحث سريع في المؤشرات...</span>
        </div>
      </header>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">نظرة عامة</h2>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-300">
            Dashboard Summary
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {overviewCards.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="dashboard-interactive rounded-[16px] border border-slate-300/80 bg-white px-4 py-4 shadow-[0_10px_22px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className={`rounded-[12px] p-2.5 ${item.tone}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="truncate text-sm font-semibold text-slate-500">{item.label}</p>
                </div>
                <p className="mt-4 text-[1.7rem] font-semibold leading-tight text-slate-950">{item.value}</p>
                <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr_1.1fr]">
        <article className="dashboard-card dashboard-interactive rounded-[18px] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">بطاقة العملاء</h2>
              <p className="mt-1 text-sm text-slate-500">العملاء النشطون مقارنة بإجمالي العملاء.</p>
            </div>
            <div className="rounded-[12px] bg-slate-100 p-2.5 text-slate-700">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-semibold text-slate-950">{summary.active_customers}</p>
              <p className="mt-1 text-sm text-slate-500">من أصل {overview.customer_count} عميل</p>
            </div>
            <div className="rounded-[14px] bg-[#E8F7EF] px-3 py-2 text-sm font-semibold text-[#166534]">
              {activeCustomersRate}%
            </div>
          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[#8FD3A5]" style={{ width: `${activeCustomersRate}%` }} />
          </div>
        </article>

        <article className="dashboard-card dashboard-interactive rounded-[18px] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">بطاقة التحصيل</h2>
              <p className="mt-1 text-sm text-slate-500">نسبة المحصّل من إجمالي المبيعات.</p>
            </div>
            <div className="rounded-[12px] bg-[#E8F7EF] p-2.5 text-[#166534]">
              <CircleDollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center">
            <div
              className="flex h-[150px] w-[150px] items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#8FD3A5 0 ${collectionRate}%, #E2E8F0 ${collectionRate}% 100%)`,
              }}
            >
              <div className="flex h-[106px] w-[106px] flex-col items-center justify-center rounded-full bg-white text-center shadow-inner">
                <span className="text-3xl font-semibold text-slate-950">{collectionRate}%</span>
                <span className="mt-1 text-xs text-slate-500">محصّل</span>
              </div>
            </div>
          </div>
        </article>

        <article className="dashboard-card dashboard-interactive rounded-[18px] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">المؤشرات المالية</h2>
              <p className="mt-1 text-sm text-slate-500">مقارنة مختصرة حسب القيمة الحالية.</p>
            </div>
            <div className="rounded-[12px] bg-slate-100 p-2.5 text-slate-700">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {financialBars.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">{item.label}</span>
                  <span className="ltr-content text-sm font-semibold text-slate-950">{item.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${item.tone}`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="dashboard-card dashboard-interactive rounded-[18px] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">نشاط الوحدات</h2>
              <p className="mt-1 text-sm text-slate-500">حجم البيانات الحالية في الوحدات الأساسية.</p>
            </div>
            <div className="rounded-[12px] bg-slate-100 p-2.5 text-slate-700">
              <ReceiptText className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {unitActivity.map(([label, value, tone]) => (
              <div key={label} className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className={`h-full rounded-full ${tone}`}
                    style={{ width: `${clampPercentage((Number(value) / maxUnitValue) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card dashboard-interactive rounded-[18px] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">تنبيه المخزون</h2>
              <p className="mt-1 text-sm text-slate-500">منتجات تحتاج إلى متابعة قبل نفاد المخزون.</p>
            </div>
            <div className="rounded-[12px] bg-[#FBF4D7] p-2.5 text-[#946200]">
              <PackageSearch className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 rounded-[16px] border border-[#E8D8B8] bg-[#FBF4D7] px-5 py-5">
            <p className="text-sm font-semibold text-[#946200]">عدد المنتجات منخفضة المخزون</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-5xl font-semibold text-slate-950">{overview.low_stock_count}</p>
              <Boxes className="h-10 w-10 text-[#946200]/45" />
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
