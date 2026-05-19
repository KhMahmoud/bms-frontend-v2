import { ChevronDown, Plus, RotateCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ApiError, isValidationErrors } from "../../services/api";
import type { PaginatedResponse, ValidationErrors } from "../../types/api";
import { DataTable } from "../ui/DataTable";
import { Drawer } from "../ui/Drawer";
import { PageHeader } from "../ui/PageHeader";
import { SearchToolbar } from "../ui/SearchToolbar";
import { StatePanel } from "../ui/StatePanel";
import { SummaryCard } from "../ui/SummaryCard";

type FormField<T> = {
  name: keyof T & string;
  label: string;
  type?: "text" | "email" | "number" | "textarea" | "select";
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  showOnCreate?: boolean;
  showOnEdit?: boolean;
  inputDir?: "rtl" | "ltr" | "auto";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  sanitize?: "digits";
};

type FilterField = {
  key: string;
  label: string;
  options: Array<{ label: string; value: string }>;
};

type Summary<T> = {
  label: string;
  value: string | number;
  hint: string;
  icon: React.ReactNode;
  derive: (rows: T[]) => string | number;
};

const backendValidationMessages: Record<string, string> = {
  "Request failed": "تعذر الاتصال بالخادم. تأكد من تشغيل الواجهة الخلفية ثم حاول مرة أخرى.",
  "This field may not be null.": "هذا الحقل مطلوب.",
  "This field may not be blank.": "هذا الحقل مطلوب.",
  "This field is required.": "هذا الحقل مطلوب.",
  "A valid number is required.": "أدخل رقماً صحيحاً.",
  "A valid integer is required.": "أدخل رقماً صحيحاً.",
  "A valid boolean is required.": "اختر قيمة صحيحة.",
  "Enter a valid email address.": "أدخل بريداً إلكترونياً صحيحاً.",
};

function translateValidationMessage(message: string) {
  const trimmed = message.trim();
  if (backendValidationMessages[trimmed]) {
    return backendValidationMessages[trimmed];
  }

  const maxLengthMatch = trimmed.match(/^Ensure this field has no more than (\d+) characters\.$/);
  if (maxLengthMatch) {
    return `يجب ألا يتجاوز هذا الحقل ${maxLengthMatch[1]} حرفاً.`;
  }

  const minValueMatch = trimmed.match(/^Ensure this value is greater than or equal to (.+)\.$/);
  if (minValueMatch) {
    return `يجب أن تكون القيمة أكبر من أو تساوي ${minValueMatch[1]}.`;
  }

  return trimmed;
}

export function ResourceModulePage<T extends { id: string }>({
  eyebrow,
  title,
  description,
  createLabel,
  columns,
  formFields,
  filterFields = [],
  fetchList,
  createItem,
  updateItem,
  buildPayload,
  buildInitialValues,
  summaries,
  defaultSearchPlaceholder,
  rowSelectionHint = "اضغط تعديل لتحديث البيانات.",
  validateForm,
  onFieldChange,
}: {
  eyebrow: string;
  title: string;
  description: string;
  createLabel: string;
  columns: Array<{
    key: string;
    header: string;
    width?: string;
    render: (item: T) => React.ReactNode;
  }>;
  formFields: FormField<Record<string, unknown>>[];
  filterFields?: FilterField[];
  fetchList: (params: URLSearchParams) => Promise<PaginatedResponse<T>>;
  createItem: (payload: Record<string, unknown>) => Promise<T>;
  updateItem: (id: string, payload: Record<string, unknown>) => Promise<T>;
  buildPayload: (formValues: Record<string, string>, editingItem: T | null) => Record<string, unknown>;
  buildInitialValues: (item: T | null) => Record<string, string>;
  summaries: Summary<T>[];
  defaultSearchPlaceholder?: string;
  rowSelectionHint?: string;
  validateForm?: (
    formValues: Record<string, string>,
    editingItem: T | null
  ) => ValidationErrors | null;
  onFieldChange?: (
    fieldName: string,
    value: string,
    formValues: Record<string, string>,
    editingItem: T | null
  ) => Record<string, string>;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [initialFormValues, setInitialFormValues] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page_size: "100" });
      if (search.trim()) {
        params.set("search", search.trim());
      }
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      const response = await fetchList(params);
      setRows(response.results);
      setCount(response.count);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "تعذر تحميل البيانات.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, JSON.stringify(filters)]);

  const summaryData = useMemo(
    () =>
      summaries.map((summary) => ({
        ...summary,
        value: summary.derive(rows),
      })),
    [rows, summaries]
  );

  const openCreateDrawer = () => {
    const initialValues = buildInitialValues(null);
    setEditingItem(null);
    setValidationErrors({});
    setInitialFormValues(initialValues);
    setFormValues(initialValues);
    setDrawerOpen(true);
  };

  const openEditDrawer = (item: T) => {
    const initialValues = buildInitialValues(item);
    setEditingItem(item);
    setValidationErrors({});
    setInitialFormValues(initialValues);
    setFormValues(initialValues);
    setDrawerOpen(true);
  };

  const hasUnsavedChanges = drawerOpen && JSON.stringify(formValues) !== JSON.stringify(initialFormValues);

  const closeDrawer = (force = false) => {
    if (!force && hasUnsavedChanges && !window.confirm("لديك تغييرات غير محفوظة. هل تريد الإغلاق؟")) {
      return;
    }

    setDrawerOpen(false);
    setEditingItem(null);
    setSubmitting(false);
    setValidationErrors({});
    setInitialFormValues({});
  };

  const updateFormValue = (field: FormField<Record<string, unknown>>, rawValue: string) => {
    let value = field.sanitize === "digits" ? rawValue.replace(/\D/g, "") : rawValue;
    if (field.maxLength) {
      value = value.slice(0, field.maxLength);
    }

    setFormValues((current) => {
      const nextValues = {
        ...current,
        [field.name]: value,
      };

      return onFieldChange?.(field.name, value, nextValues, editingItem) ?? nextValues;
    });
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setValidationErrors({});

    try {
      const clientValidationErrors = validateForm?.(formValues, editingItem) ?? null;
      if (clientValidationErrors) {
        setValidationErrors(clientValidationErrors);
        setSubmitting(false);
        return;
      }

      const payload = buildPayload(formValues, editingItem);
      if (editingItem) {
        await updateItem(editingItem.id, payload);
      } else {
        await createItem(payload);
      }
      closeDrawer(true);
      await loadData();
    } catch (requestError) {
      if (requestError instanceof ApiError && isValidationErrors(requestError.payload)) {
        setValidationErrors(requestError.payload);
      } else {
        setValidationErrors({
          detail: requestError instanceof Error ? requestError.message : "تعذر حفظ البيانات.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const visibleFormFields = formFields.filter((field) =>
    editingItem ? field.showOnEdit !== false : field.showOnCreate !== false
  );

  const sharedInputClassName =
    "form-input mt-2 rounded-lg px-3.5 py-2.5 text-sm";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <button
            type="button"
            onClick={openCreateDrawer}
            className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition"
          >
            <Plus className="h-4 w-4" />
            {createLabel}
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryData.map((summary) => (
          <SummaryCard
            key={summary.label}
            label={summary.label}
            value={summary.value}
            hint={summary.hint}
            icon={summary.icon}
          />
        ))}
      </div>

      <SearchToolbar
        search={search}
        onSearchChange={setSearch}
        actions={
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilters({});
              }}
            className="btn-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition"
            >
            <RotateCcw className="h-4 w-4" />
            إعادة ضبط
          </button>
        }
        filters={filterFields.map((filterField) => (
          <label key={filterField.key} className="block">
            <span className="sr-only">{filterField.label}</span>
            <select
              value={filters[filterField.key] ?? ""}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  [filterField.key]: event.target.value,
                }))
              }
              className="form-input h-10 min-w-[150px] rounded-lg px-3.5 text-sm"
            >
              <option value="">{filterField.label}</option>
              {filterField.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      />

      {loading ? (
        <StatePanel
          title={`جارٍ تحميل ${defaultSearchPlaceholder ?? title}`}
          description={`نقوم الآن بتجهيز بيانات ${defaultSearchPlaceholder ?? title} لعرضها.`}
        />
      ) : error ? (
        <StatePanel
          title="تعذر تحميل البيانات"
          description={error}
          action={
            <button
              type="button"
              onClick={() => void loadData()}
              className="btn-primary rounded-lg px-4 py-2.5 text-sm font-semibold transition"
            >
              إعادة المحاولة
            </button>
          }
        />
      ) : rows.length === 0 ? (
        <StatePanel
          title="لا توجد نتائج"
          description="لا توجد عناصر مطابقة للبحث أو عوامل التصفية الحالية. يمكنك إعادة الضبط أو إضافة عنصر جديد."
          action={
            <button
              type="button"
              onClick={openCreateDrawer}
              className="btn-primary rounded-lg px-4 py-2.5 text-sm font-semibold transition"
            >
              حفظ
            </button>
          }
        />
      ) : (
        <>
          <div className="flex items-center justify-between px-1 text-sm text-slate-500">
            <p className="text-slate-500">إجمالي العناصر: {count}</p>
            <p className="text-slate-500">{rowSelectionHint}</p>
          </div>
          <DataTable columns={columns} rows={rows} onRowClick={openEditDrawer} />
        </>
      )}

      <Drawer
        open={drawerOpen}
        title={editingItem ? "تعديل البيانات" : createLabel}
        description="أدخل البيانات المطلوبة ثم احفظ التغييرات. ستظهر لك رسائل التحقق مباشرة عند الحاجة."
        onClose={() => closeDrawer()}
      >
        <form className="flex h-full flex-col" onSubmit={(event) => void submitForm(event)}>
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {visibleFormFields.map((field) => {
              const error = validationErrors[field.name];

              return (
                <label key={field.name} className="block">
                  <span className="text-sm font-medium text-slate-800">
                    {field.label}
                    {field.required ? <span className="ml-1 text-rose-500">*</span> : null}
                  </span>
                  {field.description ? <p className="mt-1 text-xs leading-5 text-slate-500">{field.description}</p> : null}
                  {field.type === "textarea" ? (
                    <textarea
                      value={formValues[field.name] ?? ""}
                      onChange={(event) => updateFormValue(field, event.target.value)}
                      rows={4}
                      placeholder={field.placeholder}
                      className={sharedInputClassName}
                      dir={field.inputDir ?? "auto"}
                      maxLength={field.maxLength}
                    />
                  ) : field.type === "select" ? (
                    <div className="relative mt-2">
                      <select
                        value={formValues[field.name] ?? ""}
                        onChange={(event) => updateFormValue(field, event.target.value)}
                        className={`${sharedInputClassName} mt-0 appearance-none pr-11`}
                        dir={field.inputDir ?? "rtl"}
                      >
                        <option value="">اختر {field.label}</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500">
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </div>
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      value={formValues[field.name] ?? ""}
                      onChange={(event) => updateFormValue(field, event.target.value)}
                      placeholder={field.placeholder}
                      className={sharedInputClassName}
                      dir={field.inputDir ?? "auto"}
                      inputMode={field.inputMode}
                      maxLength={field.maxLength}
                    />
                  )}
                  {error ? (
                    <p className="mt-2 text-sm text-rose-600">
                      {Array.isArray(error)
                        ? error.map((item) => translateValidationMessage(String(item))).join("، ")
                        : translateValidationMessage(String(error))}
                    </p>
                  ) : null}
                </label>
              );
            })}

            {validationErrors.detail ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {Array.isArray(validationErrors.detail)
                  ? validationErrors.detail.map((item) => translateValidationMessage(String(item))).join("، ")
                  : translateValidationMessage(String(validationErrors.detail))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => closeDrawer()}
              className="btn-secondary rounded-lg px-4 py-2.5 text-sm font-medium transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {submitting ? "جارٍ الحفظ..." : editingItem ? "حفظ التعديلات" : "حفظ"}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
