import { Clock3, Hammer } from "lucide-react";

import { PageHeader } from "../components/ui/PageHeader";
import { StatePanel } from "../components/ui/StatePanel";
import { SummaryCard } from "../components/ui/SummaryCard";

export function PlaceholderPage({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description="هذا القسم غير متاح في نسخة العرض الحالية."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard
          label="الحالة"
          value="غير متاح حالياً"
          hint="هذا القسم ليس ضمن الأقسام الجاهزة للاستخدام في العرض."
          icon={<Clock3 className="h-5 w-5" />}
        />
        <SummaryCard
          label="المرحلة القادمة"
          value="قريباً"
          hint="سيتم استكماله في مرحلة لاحقة."
          icon={<Hammer className="h-5 w-5" />}
        />
      </div>
      <StatePanel
        title="هذا القسم غير متاح في نسخة العرض الحالية."
        description="سيتم استكماله في مرحلة لاحقة."
      />
    </div>
  );
}
