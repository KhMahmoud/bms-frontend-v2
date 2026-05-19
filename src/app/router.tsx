import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { CustomersPage } from "../pages/CustomersPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { ProductsPage } from "../pages/ProductsPage";
import { SuppliersPage } from "../pages/SuppliersPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
          {
            path: "/customers",
            element: <CustomersPage />,
          },
          {
            path: "/products",
            element: <ProductsPage />,
          },
          {
            path: "/suppliers",
            element: <SuppliersPage />,
          },
          {
            path: "/purchases",
            element: (
              <PlaceholderPage
                eyebrow="المشتريات"
                title="المشتريات"
                description="هذا القسم ظاهر للعرض فقط، وسيتم استكمال تفاصيله في مرحلة لاحقة."
              />
            ),
          },
          {
            path: "/invoices",
            element: (
              <PlaceholderPage
                eyebrow="الفواتير"
                title="الفواتير"
                description="هذا القسم محفوظ ضمن هيكل النظام، وسيتم تطوير واجهته بشكل كامل لاحقاً."
              />
            ),
          },
          {
            path: "/payments",
            element: (
              <PlaceholderPage
                eyebrow="الدفعات"
                title="الدفعات"
                description="واجهة هذا القسم مؤجلة حالياً، وسيتم استكمالها بعد إنهاء الأقسام الأساسية."
              />
            ),
          },
          {
            path: "/employees",
            element: (
              <PlaceholderPage
                eyebrow="الموظفون"
                title="الموظفون"
                description="هذا القسم ضمن الخطة، لكنه ليس جزءاً من نطاق العرض الحالي."
              />
            ),
          },
          {
            path: "/settings",
            element: (
              <PlaceholderPage
                eyebrow="الإعدادات"
                title="الإعدادات"
                description="الإعدادات محفوظة ضمن مسارات النظام، وسيتم تقديم واجهتها بشكل أوسع لاحقاً."
              />
            ),
          },
          {
            path: "/treasury",
            element: (
              <PlaceholderPage
                eyebrow="الخزنة"
                title="الخزنة"
                description="هذا القسم مؤجل حالياً، وسيتم ربطه بشكل كامل عندما تجهز مرحلته التالية."
              />
            ),
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);
