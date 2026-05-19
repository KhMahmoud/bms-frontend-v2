import { Link } from "react-router-dom";

import { StatePanel } from "../components/ui/StatePanel";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-2xl">
        <StatePanel
          title="الصفحة غير موجودة"
          description="المسار المطلوب غير متوفر حالياً. يمكنك العودة إلى لوحة التحكم من القائمة الجانبية."
          action={
            <Link
              to="/"
              className="btn-primary inline-flex rounded-lg px-4 py-2.5 text-sm font-semibold transition"
            >
              العودة إلى لوحة التحكم
            </Link>
          }
        />
      </div>
    </div>
  );
}
