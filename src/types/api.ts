export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ValidationErrors = Record<string, string[] | string>;

export type User = {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role?: string | null;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: User;
};

export type DashboardOverview = {
  customer_count: number;
  product_count: number;
  invoice_count: number;
  payment_count: number;
  low_stock_count: number;
};

export type DashboardSummary = {
  total_sales: string;
  total_collected: string;
  total_receivables: string;
  active_customers: number;
};

export type Customer = {
  id: string;
  customer_code: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "active" | "inactive" | "blocked";
  notes: string;
  created_at: string;
  updated_at: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  product_code: string;
  name: string;
  sku: string;
  category: string;
  category_name: string;
  sell_price: string;
  opening_stock: number;
  reorder_level: number;
  is_active: boolean;
  available_stock: number;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
  created_at: string;
  updated_at: string;
};

export type Supplier = {
  id: string;
  supplier_code: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  payment_terms: string;
  currency: string;
  tax_number: string;
  status: "active" | "inactive";
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
