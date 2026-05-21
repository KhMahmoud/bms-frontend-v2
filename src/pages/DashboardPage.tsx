import { ArrowUpLeft, BadgeDollarSign, Box, CircleDollarSign, ReceiptText, Users, Wallet } from "lucide-react";
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

  const financialCards = [
    {
      label: "إجمالي المبيعات",
      value: formatCurrency(summary.total_sales),
      hint: "قيمة الفواتير المسجلة",
      icon: CircleDollarSign,
    },
    {
      label: "المبالغ المحصلة",
      value: formatCurrency(summary.total_collected),
      hint: `${collectionRate}% من إجمالي المبيعات`,
      icon: BadgeDollarSign,
    },
    {
      label: "الذمم المستحقة",
      value: formatCurrency(summary.total_receivables),
      hint: `${receivablesRate}% تحتاج متابعة`,
      icon: Wallet,
    },
  ];

  const quickNotes = [
    {
      label: "العملاء النشطون",
      value: summary.active_customers,
      helper: `${activeCustomersRate}% من قاعدة العملاء`,
    },
    {
      label: "الفواتير الحالية",
      value: overview.invoice_count,
      helper: "حركة فواتير نشطة",
    },
    {
      label: "الدفعات الحالية",
      value: overview.payment_count,
      helper: "مدفوعات مسجلة",
    },
    {
      label: "منخفض المخزون",
      value: overview.low_stock_count,
      helper: "يحتاج متابعة قريبة",
    },
  ];

  const progressItems = [
    {
      label: "معدل التحصيل",
      value: collectionRate,
      tone: "from-emerald-400 to-emerald-500",
    },
    {
      label: "الذمم المفتوحة",
      value: receivablesRate,
      tone: "from-amber-400 to-orange-400",
    },
    {
      label: "نشاط العملاء",
      value: activeCustomersRate,
      tone: "from-sky-400 to-blue-500",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_320px]">
        <div className="glass-panel overflow-hidden rounded-[26px] border-slate-200/90 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.07)]">
          <div className="border-b border-slate-200 bg-[linear-gradient(90deg,#172554_0%,#1d4ed8_60%,#5b21b6_100%)] px-6 py-5 text-white">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-white/70">FINANCIAL OVERVIEW</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">لوحة التحكم</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/78">
                  متابعة مالية سريعة لقراءة التحصيل والذمم والنشاط العام من شاشة واحدة واضحة وهادئة.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/12 px-3 py-2 text-sm text-white/88 backdrop-blur-sm">
                <ArrowUpLeft className="h-4 w-4" />
                متابعة مالية يومية
              </div>
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            <div className="grid gap-4 md:grid-cols-3">
              {financialCards.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.label}
                    className="rounded-[18px] border border-slate-200 bg-slate-50/80 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-600">{item.label}</p>
                        <p className="mt-2 text-[1.75rem] font-semibold leading-tight text-slate-950">{item.value}</p>
                      </div>
                      <div className="rounded-[14px] bg-white p-2.5 text-[#2563EB] ring-1 ring-slate-200">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{item.hint}</p>
                  </article>
                );
              })}
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#fbfcff_0%,#f4f8ff_100%)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">مؤشرات الأداء</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      قراءة سريعة لنسب التحصيل والذمم ونشاط العملاء ضمن نفس الفترة الحالية.
                    </p>
                  </div>
                  <div className="rounded-[14px] bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                    {overview.payment_count} دفعة
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {progressItems.map((item) => (
                    <div key={item.label} className="rounded-[16px] bg-white px-4 py-4 ring-1 ring-slate-200/80">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-slate-700">{item.label}</p>
                        <span className="text-sm font-semibold text-slate-950">{item.value}%</span>
                      </div>
                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.tone}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-[20px] bg-[linear-gradient(180deg,#172554_0%,#1e3a8a_100%)] p-5 text-white shadow-[0_14px_34px_rgba(30,58,138,0.18)]">
                <p className="text-xs font-semibold tracking-[0.2em] text-white/65">COLLECTION</p>
                <div className="mt-5 flex justify-center">
                  <div
                    className="flex h-[160px] w-[160px] items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#ffffff 0 ${collectionRate}%, rgba(255,255,255,0.16) ${collectionRate}% 100%)`,
                    }}
                  >
                    <div className="flex h-[112px] w-[112px] flex-col items-center justify-center rounded-full bg-[#10224d] text-center">
                      <span className="text-[2rem] font-semibold leading-none">{collectionRate}%</span>
                      <span className="mt-2 text-xs text-white/68">نسبة التحصيل</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[16px] border border-white/10 bg-white/8 px-4 py-4">
                  <p className="text-sm text-white/68">العملاء النشطون</p>
                  <p className="mt-2 text-2xl font-semibold">{summary.active_customers}</p>
                  <p className="mt-2 text-sm text-white/68">من أصل {overview.customer_count} عميل مسجل</p>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-panel rounded-[22px] border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#f2f7ff_100%)] p-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">حالة الحسابات</p>
                <h2 className="mt-2 text-[2rem] font-semibold text-slate-950">{summary.active_customers}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  نسبة النشاط الحالية تبلغ {activeCustomersRate}% من إجمالي العملاء ضمن النظام.
                </p>
              </div>
              <div className="rounded-[16px] bg-white p-3 text-[#2563EB] ring-1 ring-blue-100">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#2563eb_0%,#60a5fa_100%)]"
                style={{ width: `${activeCustomersRate}%` }}
              />
            </div>
          </div>

          <div className="glass-panel rounded-[22px] border-slate-200 bg-[linear-gradient(180deg,#fbfbfe_0%,#f5f2ff_100%)] p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">ملخص سريع</h2>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  بطاقات تشغيلية خفيفة لقراءة حركة اليوم بدون ازدحام بصري.
                </p>
              </div>
              <div className="rounded-[16px] bg-white p-3 text-violet-600 ring-1 ring-violet-100">
                <ReceiptText className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {quickNotes.map((item) => (
                <div key={item.label} className="rounded-[16px] bg-white px-4 py-4 ring-1 ring-slate-200/80">
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="glass-panel rounded-[22px] border-slate-200 bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)] p-6 shadow-[0_12px_26px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">تنبيه المخزون</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                هذه القيمة توضّح عدد المنتجات التي تحتاج إلى متابعة أو إعادة تزويد قريباً.
              </p>
            </div>
            <div className="rounded-[16px] bg-amber-50 p-3 text-amber-600 ring-1 ring-amber-100">
              <Box className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 rounded-[18px] border border-amber-200 bg-amber-50/85 p-5">
            <p className="text-sm font-semibold tracking-[0.08em] text-amber-700">عدد المنتجات منخفضة المخزون</p>
            <p className="mt-3 text-5xl font-semibold text-slate-950">{overview.low_stock_count}</p>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              يساعدك هذا الرقم على معرفة المنتجات التي قد تحتاج إلى إعادة تزويد قريباً.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-[22px] border-slate-200 bg-[linear-gradient(180deg,#fafcff_0%,#f5f8fc_100%)] p-6 shadow-[0_12px_26px_rgba(15,23,42,0.035)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">حركة الوحدات</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                توزيع سريع للنشاط الحالي بين أهم الوحدات والكيانات المستخدمة داخل النظام.
              </p>
            </div>
            <div className="rounded-[16px] bg-white p-3 text-slate-700 ring-1 ring-slate-200">
              <BadgeDollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["العملاء", overview.customer_count],
              ["المنتجات", overview.product_count],
              ["الفواتير", overview.invoice_count],
              ["الدفعات", overview.payment_count],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] bg-white px-4 py-5 ring-1 ring-slate-200/80">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-3 text-[1.9rem] font-semibold tracking-tight text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
