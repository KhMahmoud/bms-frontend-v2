import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { ApiError } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError("تعذر تسجيل الدخول بالبيانات المدخلة.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-5 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="sidebar-panel flex flex-col justify-between rounded-2xl p-7 md:p-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-blue-100/80">نسخة العرض</p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight text-white">
              واجهة عربية واضحة لإدارة الحسابات والمبيعات اليومية.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              هذه الواجهة مخصّصة لعرض النظام بشكل بسيط وواضح، مع ربط حقيقي بالبيانات الأساسية المتوفرة داخل المشروع.
            </p>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {[
              {
                icon: <ShieldCheck className="h-5 w-5" />,
                title: "دخول آمن",
                text: "يتم فتح الصفحات الداخلية فقط بعد تسجيل الدخول بشكل صحيح.",
              },
              {
                icon: <LockKeyhole className="h-5 w-5" />,
                title: "تنبيهات واضحة",
                text: "تظهر رسائل التحقق مباشرة داخل النماذج عند وجود أي خطأ.",
              },
              {
                icon: <LogIn className="h-5 w-5" />,
                title: "جاهز للعرض",
                text: "العملاء والمنتجات والمورّدون ولوحة التحكم جاهزة للاستخدام في العرض.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/8 p-4">
                <div className="w-fit rounded-lg bg-white/12 p-2.5 text-blue-100">{item.icon}</div>
                <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel flex items-center rounded-2xl p-6 md:p-8">
          <div className="w-full">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#2563EB]">تسجيل الدخول</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">الدخول إلى النظام</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              أدخل اسم المستخدم وكلمة المرور للوصول إلى واجهة النظام وعرض الأقسام المتاحة.
            </p>

            <form className="mt-8 space-y-5" onSubmit={(event) => void handleSubmit(event)}>
              <label className="block">
                <span className="text-sm font-medium text-slate-800">اسم المستخدم</span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="demo_user"
                  dir="ltr"
                  className="form-input mt-2 h-11 rounded-lg px-3.5"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-800">كلمة المرور</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="أدخل كلمة المرور"
                  dir="ltr"
                  className="form-input mt-2 h-11 rounded-lg px-3.5"
                />
              </label>

              {error ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" />
                {submitting ? "جارٍ تسجيل الدخول..." : "دخول"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
