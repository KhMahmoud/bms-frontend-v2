import { Ban, CircleCheckBig, MapPin, Users } from "lucide-react";

import { ResourceModulePage } from "../components/modules/ResourceModulePage";
import { StatusBadge } from "../components/ui/StatusBadge";
import { createCustomer, getCustomers, updateCustomer } from "../services/modules";
import type { Customer } from "../types/api";

export function CustomersPage() {
  const palestinianMobilePattern = /^(059|056)\d{7}$/;

  return (
    <ResourceModulePage<Customer>
      eyebrow="إدارة العملاء"
      title="العملاء"
      description="تابع بيانات الزبائن الذين تبيع لهم أو تصدر لهم فواتير."
      createLabel="عميل جديد"
      fetchList={getCustomers}
      createItem={(payload) => createCustomer(payload as Partial<Customer>)}
      updateItem={(id, payload) => updateCustomer(id, payload as Partial<Customer>)}
      buildInitialValues={(item) => ({
        name: item?.name ?? "",
        email: item?.email ?? "",
        phone: item?.phone ?? "",
        location: item?.location ?? "",
        status: item?.status ?? "active",
        notes: item?.notes ?? "",
      })}
      buildPayload={(values, editingItem) => ({
        name: values.name,
        email: values.email,
        phone: values.phone,
        location: values.location,
        status: editingItem ? values.status : "active",
        notes: values.notes,
      })}
      validateForm={(values) => {
        const phone = values.phone.trim();

        if (!phone) {
          return null;
        }

        if (!palestinianMobilePattern.test(phone)) {
          return {
            phone: "الرقم يجب أن يكون 10 خانات ويبدأ بـ 059 أو 056.",
          };
        }

        return null;
      }}
      filterFields={[
        {
          key: "status",
          label: "تصفية حسب الحالة",
          options: [
            { label: "نشط", value: "active" },
            { label: "غير نشط", value: "inactive" },
            { label: "موقوف", value: "blocked" },
          ],
        },
      ]}
      formFields={[
        { name: "name", label: "اسم العميل", required: true, placeholder: "شركة الأمل التجارية" },
        {
          name: "email",
          label: "البريد الإلكتروني (اختياري)",
          type: "email",
          placeholder: "client@example.com",
          inputDir: "ltr",
        },
        {
          name: "phone",
          label: "رقم الجوال",
          placeholder: "مثال: 0591234567",
          description: "مثال: 0591234567 أو 0561234567",
          inputDir: "ltr",
          inputMode: "numeric",
          maxLength: 10,
          sanitize: "digits",
        },
        {
          name: "location",
          label: "المدينة / البلدة",
          placeholder: "رام الله، نابلس، بيرزيت...",
        },
        {
          name: "status",
          label: "إتاحة العميل",
          type: "select",
          required: true,
          description: "استخدم هذا الخيار فقط عند الحاجة لإيقاف التعاملات الجديدة مع هذا العميل.",
          showOnCreate: false,
          options: [
            { label: "نشط", value: "active" },
            { label: "غير نشط", value: "inactive" },
            { label: "موقوف", value: "blocked" },
          ],
        },
        { name: "notes", label: "ملاحظات", type: "textarea", placeholder: "أضف أي ملاحظات أو تعليمات تخص هذا العميل." },
      ]}
      summaries={[
        {
          label: "العملاء المعروضون",
          value: 0,
          hint: "عدد العملاء الظاهرين حالياً بعد البحث والتصفية.",
          icon: <Users className="h-5 w-5" />,
          derive: (rows) => rows.length,
        },
        {
          label: "العملاء النشطون",
          value: 0,
          hint: "جاهزون للاستخدام في الفواتير والتحصيل.",
          icon: <CircleCheckBig className="h-5 w-5" />,
          derive: (rows) => rows.filter((row) => row.status === "active").length,
        },
        {
          label: "العملاء الموقوفون",
          value: 0,
          hint: "حسابات موقوفة عن التعاملات الجديدة.",
          icon: <Ban className="h-5 w-5" />,
          derive: (rows) => rows.filter((row) => row.status === "blocked").length,
        },
        {
          label: "مع مدينة محددة",
          value: 0,
          hint: "عملاء لديهم مدينة أو موقع مسجل.",
          icon: <MapPin className="h-5 w-5" />,
          derive: (rows) => rows.filter((row) => Boolean(row.location)).length,
        },
      ]}
      columns={[
        {
          key: "name",
          header: "العميل",
          render: (row) => (
            <div>
              <p className="font-medium text-slate-900">{row.name}</p>
              <p className="ltr-content mt-1 text-xs text-slate-500">{row.customer_code}</p>
            </div>
          ),
        },
        {
          key: "contact",
          header: "بيانات التواصل",
          render: (row) => (
            <div className="space-y-1 text-sm text-slate-600">
              <p className={row.email ? "ltr-content" : ""}>{row.email || "لا يوجد بريد إلكتروني"}</p>
              <p className={row.phone ? "ltr-content" : ""}>{row.phone || "لا يوجد رقم جوال"}</p>
            </div>
          ),
        },
        {
          key: "location",
          header: "المدينة / البلدة",
          render: (row) => row.location || <span className="text-slate-500">غير محددة</span>,
        },
        {
          key: "status",
          header: "الحالة",
          render: (row) => <StatusBadge value={row.status} />,
        },
      ]}
    />
  );
}
