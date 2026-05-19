import { BadgeCheck, Building2, Globe2, PhoneCall } from "lucide-react";

import { ResourceModulePage } from "../components/modules/ResourceModulePage";
import { StatusBadge } from "../components/ui/StatusBadge";
import { createSupplier, getSuppliers, updateSupplier } from "../services/modules";
import type { Supplier } from "../types/api";

export function SuppliersPage() {
  const palestinianMobilePattern = /^(059|056)\d{7}$/;
  const paymentMethodOptions = [
    { label: "نقداً", value: "نقداً" },
    { label: "شيك", value: "شيك" },
    { label: "تحويل بنكي", value: "تحويل بنكي" },
    { label: "آجل", value: "آجل" },
  ];
  const currencyOptions = [
    { label: "شيكل", value: "ILS" },
    { label: "USD", value: "USD" },
  ];

  return (
    <ResourceModulePage<Supplier>
      eyebrow="إدارة المورّدين"
      title="المورّدون"
      description="نظّم بيانات الجهات التي تشتري منها البضاعة أو الخدمات."
      createLabel="مورد جديد"
      fetchList={getSuppliers}
      createItem={(payload) => createSupplier(payload as Partial<Supplier>)}
      updateItem={(id, payload) => updateSupplier(id, payload as Partial<Supplier>)}
      buildInitialValues={(item) => ({
        name: item?.name ?? "",
        contact_person: item?.contact_person ?? "",
        phone: item?.phone ?? "",
        email: item?.email ?? "",
        address: item?.address ?? "",
        payment_terms: item?.payment_terms ?? "",
        currency: item?.currency ?? "ILS",
        tax_number: item?.tax_number ?? "",
        status: item?.status ?? "active",
        notes: item?.notes ?? "",
        is_active: item ? String(item.is_active) : "true",
      })}
      buildPayload={(values) => ({
        name: values.name,
        contact_person: values.contact_person,
        phone: values.phone,
        email: values.email,
        address: values.address,
        payment_terms: values.payment_terms,
        currency: values.currency || "ILS",
        tax_number: values.tax_number,
        status: values.status,
        notes: values.notes,
        is_active: values.is_active === "true",
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
          ],
        },
        {
          key: "is_active",
          label: "تصفية حسب الإتاحة",
          options: [
            { label: "متاح", value: "true" },
            { label: "غير متاح", value: "false" },
          ],
        },
      ]}
      formFields={[
        { name: "name", label: "اسم المورد", required: true, placeholder: "شركة التوريد العالمية" },
        { name: "contact_person", label: "اسم جهة الاتصال", placeholder: "علاء حسن" },
        {
          name: "phone",
          label: "رقم الجوال / واتساب",
          placeholder: "مثال: 0591234567",
          description: "مثال: 0591234567 أو 0561234567",
          inputDir: "ltr",
          inputMode: "numeric",
          maxLength: 10,
          sanitize: "digits",
        },
        { name: "email", label: "البريد الإلكتروني", type: "email", placeholder: "supplier@example.com", inputDir: "ltr" },
        { name: "address", label: "العنوان", type: "textarea", placeholder: "عنوان المكتب أو المستودع أو جهة الفوترة." },
        {
          name: "payment_terms",
          label: "طريقة الدفع",
          type: "select",
          options: paymentMethodOptions,
        },
        {
          name: "currency",
          label: "عملة التعامل",
          type: "select",
          options: currencyOptions,
        },
        { name: "tax_number", label: "الرقم الضريبي", placeholder: "TAX-0021", inputDir: "ltr" },
        {
          name: "status",
          label: "الحالة",
          type: "select",
          required: true,
          options: [
            { label: "نشط", value: "active" },
            { label: "غير نشط", value: "inactive" },
          ],
        },
        {
          name: "is_active",
          label: "الإتاحة",
          type: "select",
          required: true,
          options: [
            { label: "متاح", value: "true" },
            { label: "غير متاح", value: "false" },
          ],
        },
        { name: "notes", label: "ملاحظات", type: "textarea", placeholder: "أي ملاحظات مهمة بخصوص التعامل مع المورد." },
      ]}
      summaries={[
        {
          label: "المورّدون المعروضون",
          value: 0,
          hint: "عدد المورّدين الظاهرين حالياً.",
          icon: <Building2 className="h-5 w-5" />,
          derive: (rows) => rows.length,
        },
        {
          label: "المتاحون",
          value: 0,
          hint: "مورّدون متاحون للاستخدام عند الحاجة.",
          icon: <BadgeCheck className="h-5 w-5" />,
          derive: (rows) => rows.filter((row) => row.is_active).length,
        },
        {
          label: "لديهم تواصل",
          value: 0,
          hint: "مورّدون لديهم رقم جوال أو واتساب أو بريد إلكتروني.",
          icon: <PhoneCall className="h-5 w-5" />,
          derive: (rows) => rows.filter((row) => Boolean(row.phone || row.email)).length,
        },
        {
          label: "العملات",
          value: 0,
          hint: "عدد العملات المختلفة المستخدمة مع المورّدين.",
          icon: <Globe2 className="h-5 w-5" />,
          derive: (rows) => new Set(rows.map((row) => row.currency).filter(Boolean)).size,
        },
      ]}
      columns={[
        {
          key: "name",
          header: "المورد",
          render: (row) => (
            <div>
              <p className="font-medium text-slate-900">{row.name}</p>
              <p className="ltr-content mt-1 text-xs text-slate-500">{row.supplier_code}</p>
            </div>
          ),
        },
        {
          key: "contact",
          header: "جهة التواصل",
          render: (row) => (
            <div className="space-y-1 text-sm text-slate-600">
              <p>{row.contact_person || "لا يوجد اسم لجهة الاتصال"}</p>
              <p className={row.phone ? "ltr-content" : row.email ? "ltr-content" : ""}>
                {row.phone || row.email || "لا توجد وسيلة تواصل مباشرة"}
              </p>
            </div>
          ),
        },
        {
          key: "terms",
          header: "طريقة الدفع",
          render: (row) => (
            <div className="space-y-1">
              <p>{row.payment_terms || "لم يتم تحديد طريقة الدفع"}</p>
              {row.payment_terms && row.currency ? (
                <p className="text-xs text-slate-500">{row.currency === "ILS" ? "شيكل" : row.currency}</p>
              ) : null}
            </div>
          ),
        },
        {
          key: "status",
          header: "الحالة",
          render: (row) => (
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>الحالة:</span>
                <StatusBadge value={row.status} />
              </div>
              <div className="flex items-center gap-2">
                <span>الإتاحة:</span>
                <StatusBadge value={row.is_active} />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
