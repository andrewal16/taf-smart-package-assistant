export type AppRole =
  | "DEALER_SALESMAN"
  | "SALES_OFFICER"
  | "SALES_HEAD"
  | "PRODUCT_ADMIN"
  | "CREDIT_ADMIN"
  | "RISK_ADMIN"
  | "COMPLIANCE_ADMIN"
  | "IT_ADMIN";

const ADMIN_ROLES: AppRole[] = ["PRODUCT_ADMIN", "CREDIT_ADMIN", "RISK_ADMIN", "COMPLIANCE_ADMIN", "IT_ADMIN"];

export function canAccessAdmin(role: AppRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function canApprovePackage(role: AppRole): boolean {
  return ["CREDIT_ADMIN", "RISK_ADMIN", "COMPLIANCE_ADMIN", "IT_ADMIN"].includes(role);
}

export function canViewRawReason(role: AppRole): boolean {
  return role !== "DEALER_SALESMAN";
}

export function canViewBureauRisk(role: AppRole): boolean {
  return role !== "DEALER_SALESMAN";
}

export function canManageRules(role: AppRole): boolean {
  return ["RISK_ADMIN", "COMPLIANCE_ADMIN", "IT_ADMIN"].includes(role);
}

export function canCreateLead(role: AppRole): boolean {
  return ["DEALER_SALESMAN", "SALES_OFFICER", "SALES_HEAD"].includes(role);
}
