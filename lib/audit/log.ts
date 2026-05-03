import { db } from "../db";

export async function logAudit(action: string, entityType: string, afterJson: unknown, actorId?: string, entityId?: string) {
  try {
    await db.auditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId,
        afterJson: afterJson as object,
      },
    });
  } catch {
    // no-op in fallback mode
  }
}
