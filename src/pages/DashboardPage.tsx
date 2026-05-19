import { Activity, BadgeDollarSign, Box, CircleDollarSign, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { getDashboardOverview, getDashboardSummary } from "../services/modules";
import type { DashboardOverview, DashboardSummary } from "../types/api";
import { formatCurrency } from "../lib/utils";
import { PageHeader } from "../components/ui/PageHeader";
import { StatePanel } from "../components/ui/StatePanel";
import { SummaryCard } from "../components/ui/SummaryCard";

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

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="نظرة عامة"
        title="لوحة التحكم"
        description="ملخص سريع لأهم الأرقام الحالية لمساعدتك على متابعة المبيعات والتحصيل والمخزون."
      />

      {loading ? (
        <StatePanel
          title="جارٍ تحميل لوحة التحكم"
          description="يتم الآن تجهيز الملخص العام والمؤشرات الرئيسية."
        />
      ) : error || !overview || !summary ? (
        <StatePanel title="تعذر تحميل لوحة التحكم" description={error ?? "بيانات لوحة التحكم غير متاحة حالياً."} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="إجمالي المبيعات"
              value={formatCurrency(summary.total_sales)}
              hint="إجمالي قيمة الفواتير المسجلة باستثناء الفواتير الملغاة."
              icon={<CircleDollarSign className="h-5 w-5" />}
            />
            <SummaryCard
              label="المبالغ المحصلة"
              value={formatCurrency(summary.total_collected)}
              hint="إجمالي الدفعات المحصّلة من الفواتير النشطة."
              icon={<BadgeDollarSign className="h-5 w-5" />}
            />
            <SummaryCard
              label="الذمم المستحقة"
              value={formatCurrency(summary.total_receivables)}
              hint="المبالغ المتبقية على العملاء ولم يتم تحصيلها بعد."
              icon={<Activity className="h-5 w-5" />}
            />
            <SummaryCard
              label="العملاء النشطون"
              value={summary.active_customers}
              hint="عدد العملاء المفعّلين حالياً داخل النظام."
              icon={<Users className="h-5 w-5" />}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="glass-panel rounded-xl p-5">
              <h2 className="text-lg font-semibold text-slate-950">ملخص سريع</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                يعرض هذا القسم أعداد العناصر الحالية في أهم الأقسام داخل النظام.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {[
                  ["العملاء", overview.customer_count],
                  ["المنتجات", overview.product_count],
                  ["الفواتير", overview.invoice_count],
                  ["الدفعات", overview.payment_count],
                ].map(([label, value]) => (
                  <div key={label} className="muted-surface rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">تنبيه المخزون</h2>
                  <p className="mt-2 text-sm text-slate-500">هذه القيمة توضّح عدد المنتجات التي تحتاج إلى متابعة.</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600 ring-1 ring-amber-100">
                  <Box className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm font-semibold tracking-[0.06em] text-amber-700">عدد المنتجات منخفضة المخزون</p>
                <p className="mt-3 text-4xl font-semibold text-slate-950">{overview.low_stock_count}</p>
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  يساعدك هذا الرقم على معرفة المنتجات التي قد تحتاج إلى إعادة تزويد قريباً.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
