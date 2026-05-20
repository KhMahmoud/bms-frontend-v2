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

  const totalSales = parseNumericValue(summary?.total_sales ?? "0");
  const totalCollected = parseNumericValue(summary?.total_collected ?? "0");
  const totalReceivables = parseNumericValue(summary?.total_receivables ?? "0");
  const collectionRate = totalSales > 0 ? clampPercentage((totalCollected / totalSales) * 100) : 0;
  const receivablesRate = totalSales > 0 ? clampPercentage((totalReceivables / totalSales) * 100) : 0;
  const customerBase = Math.max(overview?.customer_count ?? 0, 1);
  const activeCustomersRate = summary ? clampPercentage((summary.active_customers / customerBase) * 100) : 0;

  return (
    <div className="space-y-6">
      {loading ? (
        <StatePanel
          title="جارٍ تحميل لوحة التحكم"
          description="يتم الآن تجهيز الملخص العام والمؤشرات الرئيسية."
        />
      ) : error || !overview || !summary ? (
        <StatePanel title="تعذر تحميل لوحة التحكم" description={error ?? "بيانات لوحة التحكم غير متاحة حالياً."} />
      ) : (
        <>
          {(() => {
            const quickNotes = [
              {
                label: "التحصيل الحالي",
                value: formatCurrency(summary.total_collected),
                hint: `${collectionRate}% من إجمالي المبيعات`,
              },
              {
                label: "الذمم المفتوحة",
                value: formatCurrency(summary.total_receivables),
                hint: `${receivablesRate}% تحتاج متابعة`,
              },
              {
                label: "تنبيه المخزون",
                value: overview.low_stock_count,
                hint: "منتجات منخفضة المخزون",
              },
            ];
            const heroInsights = [
              {
                label: "العملاء النشطون",
                value: summary.active_customers,
                tone: "bg-sky-400/14 text-sky-100 ring-sky-300/18",
              },
              {
                label: "الفواتير الحالية",
                value: overview.invoice_count,
                tone: "bg-violet-400/14 text-violet-100 ring-violet-300/18",
              },
              {
                label: "منخفض المخزون",
                value: overview.low_stock_count,
                tone: "bg-amber-400/14 text-amber-100 ring-amber-300/18",
              },
              {
                label: "الدفعات الحالية",
                value: overview.payment_count,
                tone: "bg-emerald-400/14 text-emerald-100 ring-emerald-300/18",
              },
            ];

            return (
              <>
          <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="relative isolate order-2 overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_58%,#6d28d9_100%)] p-6 text-white shadow-[0_22px_54px_rgba(15,23,42,0.16)]">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[radial-gradient(circle_at_20%_110%,rgba(255,255,255,0.14),transparent_42%),radial-gradient(circle_at_78%_118%,rgba(255,255,255,0.12),transparent_34%)]" />
              <div className="pointer-events-none absolute -bottom-10 left-12 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute bottom-6 right-1/3 h-px w-40 bg-gradient-to-l from-transparent via-white/40 to-transparent" />
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-[0.18em] text-white/65">FINANCIAL OVERVIEW</p>
                  <h1 className="mt-2 text-[2rem] font-semibold">لوحة التحكم</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/76">
                    ملخص سريع لأهم الأرقام الحالية لمساعدتك على متابعة المبيعات والتحصيل والمخزون بدون تكرار بطاقات الملخص.
                  </p>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {[
                      {
                        label: "إجمالي المبيعات",
                        value: formatCurrency(summary.total_sales),
                        icon: CircleDollarSign,
                      },
                      {
                        label: "المبالغ المحصلة",
                        value: formatCurrency(summary.total_collected),
                        icon: BadgeDollarSign,
                      },
                      {
                        label: "الذمم المستحقة",
                        value: formatCurrency(summary.total_receivables),
                        icon: Wallet,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="rounded-[18px] border border-white/12 bg-white/[0.09] px-4 py-4 backdrop-blur-sm"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-white/74">{item.label}</p>
                            <div className="rounded-[14px] bg-white/12 p-2 text-white">
                              <Icon className="h-4 w-4" />
                            </div>
                          </div>
                          <p className="mt-4 text-2xl font-semibold leading-tight text-white">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mx-auto flex w-full max-w-[244px] shrink-0 flex-col items-center self-center rounded-[22px] border border-white/12 bg-white/[0.1] px-5 py-5 backdrop-blur-sm lg:mx-0">
                  <div
                    className="flex h-[152px] w-[152px] items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#ffffff 0 ${collectionRate}%, rgba(255,255,255,0.18) ${collectionRate}% 100%)`,
                    }}
                  >
                    <div className="flex h-[106px] w-[106px] flex-col items-center justify-center rounded-full bg-[#123066] text-center shadow-inner shadow-slate-950/30">
                      <span className="text-[2rem] font-semibold leading-none">{collectionRate}%</span>
                      <span className="mt-1.5 text-xs text-white/72">نسبة التحصيل</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-400/18 px-3 py-1.5 text-sm text-emerald-100">
                    <ArrowUpLeft className="h-4 w-4" />
                    تحصيل مستقر هذا الشهر
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-6 rounded-[20px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
                <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                    {heroInsights.map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-[16px] px-3.5 py-3 text-sm ring-1 backdrop-blur-sm ${item.tone}`}
                      >
                        <p className="text-white/70">{item.label}</p>
                        <p className="mt-1 text-base font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {[
                    {
                      label: "معدل التحصيل من إجمالي المبيعات",
                      value: collectionRate,
                      tone: "from-emerald-300 via-emerald-400 to-emerald-500",
                    },
                    {
                      label: "الذمم المفتوحة من إجمالي المبيعات",
                      value: receivablesRate,
                      tone: "from-amber-300 via-amber-400 to-orange-400",
                    },
                    {
                      label: "نسبة العملاء النشطين",
                      value: activeCustomersRate,
                      tone: "from-sky-300 via-sky-400 to-blue-400",
                    },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[16px] border border-white/8 bg-black/10 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white/76">{item.label}</p>
                        <span className="text-sm font-semibold text-white">{item.value}%</span>
                      </div>
                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/14">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.tone}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 space-y-4">
              <div className="glass-panel rounded-[20px] border-blue-100/70 bg-[linear-gradient(180deg,rgba(244,248,255,0.94)_0%,rgba(235,242,255,0.84)_100%)] p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">حالة الحسابات</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">{summary.active_customers}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      عدد العملاء المفعّلين حالياً داخل النظام مع نسبة نشاط تبلغ {activeCustomersRate}% من قاعدة العملاء الحالية.
                    </p>
                  </div>
                  <div className="rounded-[16px] bg-blue-50 p-3 text-[#2563EB] ring-1 ring-blue-100">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#2563eb_0%,#60a5fa_100%)]"
                    style={{ width: `${activeCustomersRate}%` }}
                  />
                </div>
              </div>

              <div className="glass-panel rounded-[20px] border-violet-100/70 bg-[linear-gradient(180deg,rgba(247,245,255,0.94)_0%,rgba(239,236,255,0.84)_100%)] p-5 shadow-none">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-950">متابعة سريعة</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      إشارات مختصرة للحسابات والمخزون بدون تكرار أقسام الملخص.
                    </p>
                  </div>
                  <div className="rounded-[16px] bg-violet-50 p-3 text-violet-600 ring-1 ring-violet-100">
                    <ReceiptText className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {quickNotes.map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-[16px] bg-white/72 px-4 py-3 ring-1 ring-white/70 backdrop-blur-sm">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{item.label}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
                      </div>
                      <p className="text-base font-semibold text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel rounded-[20px] bg-[linear-gradient(180deg,rgba(255,252,245,0.96)_0%,rgba(255,255,255,0.92)_100%)] p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">تنبيه المخزون</h2>
                  <p className="mt-2 text-sm text-slate-500">هذه القيمة توضّح عدد المنتجات التي تحتاج إلى متابعة.</p>
                </div>
                <div className="rounded-[16px] bg-amber-50 p-3 text-amber-600 ring-1 ring-amber-100">
                  <Box className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5 rounded-[18px] border border-amber-200 bg-amber-50/85 p-5">
                <p className="text-sm font-semibold tracking-[0.06em] text-amber-700">عدد المنتجات منخفضة المخزون</p>
                <p className="mt-3 text-4xl font-semibold text-slate-950">{overview.low_stock_count}</p>
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  يساعدك هذا الرقم على معرفة المنتجات التي قد تحتاج إلى إعادة تزويد قريباً.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-[20px] border-slate-200/70 bg-[linear-gradient(180deg,rgba(247,249,253,0.92)_0%,rgba(241,245,251,0.86)_100%)] p-5 shadow-none">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">حركة الوحدات</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    توزيع سريع للنشاط الحالي بين أهم الوحدات والكيانات المستخدمة داخل النظام.
                  </p>
                </div>
                <div className="rounded-[16px] bg-slate-100 p-3 text-slate-700 ring-1 ring-slate-200">
                  <BadgeDollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {[
                  ["العملاء", overview.customer_count],
                  ["المنتجات", overview.product_count],
                  ["الفواتير", overview.invoice_count],
                  ["الدفعات", overview.payment_count],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[16px] bg-white px-4 py-4 ring-1 ring-slate-100">
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-3 text-[1.7rem] font-semibold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
              </>
            );
          })()}
        </>
      )}
    </div>
  );
}
