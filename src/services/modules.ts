import type {
  Customer,
  DashboardOverview,
  DashboardSummary,
  PaginatedResponse,
  Product,
  ProductCategory,
  Supplier,
} from "../types/api";
import { apiRequest, fetchPaginated } from "./api";

export function getDashboardOverview() {
  return apiRequest<DashboardOverview>("/dashboard/overview/");
}

export function getDashboardSummary() {
  return apiRequest<DashboardSummary>("/dashboard/summary/");
}

export function getCustomers(params: URLSearchParams) {
  return fetchPaginated<Customer>("/customers/", params);
}

export function createCustomer(payload: Partial<Customer>) {
  return apiRequest<Customer>("/customers/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCustomer(id: string, payload: Partial<Customer>) {
  return apiRequest<Customer>(`/customers/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getProductCategories() {
  const params = new URLSearchParams({ page_size: "100" });
  return fetchPaginated<ProductCategory>("/product-categories/", params);
}

export function getProducts(params: URLSearchParams) {
  return fetchPaginated<Product>("/products/", params);
}

export function createProduct(payload: Partial<Product>) {
  return apiRequest<Product>("/products/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id: string, payload: Partial<Product>) {
  return apiRequest<Product>(`/products/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getSuppliers(params: URLSearchParams) {
  return fetchPaginated<Supplier>("/suppliers/", params);
}

export function createSupplier(payload: Partial<Supplier>) {
  return apiRequest<Supplier>("/suppliers/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSupplier(id: string, payload: Partial<Supplier>) {
  return apiRequest<Supplier>(`/suppliers/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export type PaginatedFetcher<T> = (params: URLSearchParams) => Promise<PaginatedResponse<T>>;
