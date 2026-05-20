import { AlertTriangle, Boxes, CircleCheckBig, Package2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ResourceModulePage } from "../components/modules/ResourceModulePage";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { getModuleWriteAccess } from "../lib/access";
import { createProduct, getProductCategories, getProducts, updateProduct } from "../services/modules";
import type { Product, ProductCategory } from "../types/api";
import { formatCurrency } from "../lib/utils";

const categoryLabelMap: Record<string, string> = {
  Electronics: "إلكترونيات",
  "Test Cat": "تصنيف تجريبي",
};

function getCategoryLabel(name: string) {
  return categoryLabelMap[name] ?? name;
}

export function ProductsPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const { canWrite, reason } = getModuleWriteAccess(user);

  useEffect(() => {
    let isMounted = true;
    void getProductCategories()
      .then((response) => {
        if (isMounted) {
          setCategories(response.results);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategories([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ label: getCategoryLabel(category.name), value: category.id })),
    [categories]
  );

  return (
    <ResourceModulePage<Product>
      eyebrow="إدارة المنتجات"
      title="المنتجات"
      description="أضف المنتجات وتابع أسعارها وكمياتها وحالتها من شاشة واحدة واضحة وسهلة."
      createLabel="منتج جديد"
      canCreate={canWrite}
      canEdit={canWrite}
      readOnlyNotice={reason}
      fetchList={getProducts}
      createItem={(payload) => createProduct(payload as Partial<Product>)}
      updateItem={(id, payload) => updateProduct(id, payload as Partial<Product>)}
      buildInitialValues={(item) => ({
        name: item?.name ?? "",
        sku: item?.sku ?? "",
        category: item?.category ?? "",
        sell_price: item?.sell_price ?? "",
        opening_stock: item ? String(item.opening_stock) : "",
        reorder_level: item ? String(item.reorder_level) : "",
        is_active: item ? String(item.is_active) : "true",
      })}
      buildPayload={(values) => ({
        name: values.name,
        sku: values.sku,
        category: values.category,
        sell_price: values.sell_price,
        opening_stock: Number(values.opening_stock || 0),
        reorder_level: Number(values.reorder_level || 0),
        is_active: values.is_active === "true",
      })}
      validateForm={(values) => {
        if (!values.category) {
          return {
            category: "اختر تصنيف المنتج.",
          };
        }

        return null;
      }}
      onFieldChange={(fieldName, value, values, editingItem) => {
        if (editingItem || fieldName !== "opening_stock" || values.reorder_level) {
          return values;
        }

        const initialStock = Number(value);
        if (!Number.isFinite(initialStock) || initialStock <= 0) {
          return values;
        }

        return {
          ...values,
          reorder_level: String(Math.max(1, Math.floor(initialStock * 0.2))),
        };
      }}
      filterFields={[
        {
          key: "category",
          label: "تصفية حسب التصنيف",
          options: categoryOptions,
        },
        {
          key: "stock_status",
          label: "تصفية حسب المخزون",
          options: [
            { label: "متوفر", value: "in_stock" },
            { label: "مخزون منخفض", value: "low_stock" },
            { label: "نافد", value: "out_of_stock" },
          ],
        },
      ]}
      formFields={[
        { name: "name", label: "اسم المنتج", required: true, placeholder: "حاسوب محمول" },
        {
          name: "sku",
          label: "مرجع اختياري",
          placeholder: "مرجع داخلي للمتجر إن وجد",
          description: "استخدمه فقط إذا كان لديك مرجع داخلي خاص بك. الرقم الداخلي للمنتج يتم إنشاؤه تلقائياً.",
          inputDir: "ltr",
        },
        {
          name: "category",
          label: "التصنيف",
          type: "select",
          required: true,
          description: "تُدار التصنيفات من بيانات النظام الحالية.",
          options: categoryOptions,
        },
        {
          name: "sell_price",
          label: "سعر البيع",
          type: "number",
          required: true,
          placeholder: "1200",
          inputDir: "ltr",
          inputMode: "decimal",
        },
        {
          name: "opening_stock",
          label: "الكمية الأولية في المخزون",
          type: "number",
          placeholder: "0",
          description: "هي الكمية المتوفرة عند إضافة المنتج لأول مرة.",
          inputDir: "ltr",
          inputMode: "numeric",
        },
        {
          name: "reorder_level",
          label: "حد التنبيه عند انخفاض المخزون",
          type: "number",
          placeholder: "0",
          description: "يتم اقتراحه تلقائياً ويمكنك تعديله.",
          inputDir: "ltr",
          inputMode: "numeric",
        },
        {
          name: "is_active",
          label: "متاح للبيع",
          type: "select",
          required: true,
          description: "أوقف هذا الخيار فقط إذا كان المنتج لن يُستخدم في الفواتير الجديدة.",
          options: [
            { label: "نعم", value: "true" },
            { label: "لا", value: "false" },
          ],
        },
      ]}
      rowSelectionHint="اضغط تعديل لتحديث بيانات المنتج."
      summaries={[
        {
          label: "المنتجات المعروضة",
          value: 0,
          hint: "عدد المنتجات الظاهر بعد تطبيق البحث والتصفية.",
          icon: <Boxes className="h-5 w-5" />,
          derive: (rows) => rows.length,
        },
        {
          label: "مخزون منخفض",
          value: 0,
          hint: "منتجات تحتاج إلى متابعة قريبة في المخزون.",
          icon: <AlertTriangle className="h-5 w-5" />,
          derive: (rows) => rows.filter((row) => row.stock_status === "low_stock").length,
        },
        {
          label: "متوفر",
          value: 0,
          hint: "منتجات جاهزة للبيع وإصدار الفواتير.",
          icon: <CircleCheckBig className="h-5 w-5" />,
          derive: (rows) => rows.filter((row) => row.stock_status === "in_stock").length,
        },
        {
          label: "التصنيفات المتاحة",
          value: 0,
          hint: "عدد التصنيفات الظاهرة داخل النموذج حالياً.",
          icon: <Package2 className="h-5 w-5" />,
          derive: () => categories.length,
        },
      ]}
      columns={[
        {
          key: "name",
          header: "المنتج",
          render: (row) => (
            <div>
              <p className="font-medium text-slate-900">{row.name}</p>
              <p className="ltr-content mt-1 text-xs text-slate-500">الرقم الداخلي: {row.product_code}</p>
              <p className="ltr-content mt-1 text-xs text-slate-400">
                {row.sku ? `المرجع: ${row.sku}` : "لا يوجد مرجع إضافي"}
              </p>
            </div>
          ),
        },
        {
          key: "category",
          header: "التصنيف",
          render: (row) => getCategoryLabel(row.category_name),
        },
        {
          key: "price",
          header: "السعر",
          render: (row) => formatCurrency(row.sell_price),
        },
        {
          key: "stock",
          header: "المخزون",
          render: (row) => (
            <div>
              <p className="ltr-content font-medium text-slate-900">{row.available_stock}</p>
              <div className="mt-2">
                <StatusBadge value={row.stock_status} />
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
