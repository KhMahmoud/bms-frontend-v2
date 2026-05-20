import type { User } from "../types/api";

const managementRoles = new Set(["admin", "manager"]);
const demoWriteOverrideEnabled = import.meta.env.VITE_ENABLE_DEMO_WRITES === "true";
const exactDemoIdentifiers = new Set([
  "demo",
  "demo_user",
  "demo-user",
  "test",
  "test_user",
  "test-user",
  "عرض",
  "حساب عرض",
  "نسخة عرض",
]);

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function isBoundedDemoValue(value?: string | null) {
  const normalized = normalize(value);
  if (!normalized) {
    return false;
  }

  if (exactDemoIdentifiers.has(normalized)) {
    return true;
  }

  return /^(demo|test)([_-\s][a-z0-9]+)?$/i.test(normalized);
}

export function hasManagementAccess(user: User | null) {
  return user?.role ? managementRoles.has(normalize(user.role)) : false;
}

export function isDemoUser(user: User | null) {
  if (!user) {
    return false;
  }

  return [user.username, user.full_name].some(isBoundedDemoValue);
}

export function getModuleWriteAccess(user: User | null) {
  if (!hasManagementAccess(user)) {
    return {
      canWrite: false,
      reason: "الإنشاء والتعديل متاحان فقط لحسابات الإدارة أو المدراء.",
    };
  }

  if (isDemoUser(user) && !demoWriteOverrideEnabled) {
    return {
      canWrite: false,
      reason: "تم تعطيل الإنشاء والتعديل لحسابات العرض لحماية البيانات التجريبية.",
    };
  }

  return {
    canWrite: true,
    reason: "",
  };
}
