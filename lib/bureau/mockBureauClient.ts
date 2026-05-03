export async function mockBureauClient() {
  return { requestId: `mock-${Date.now()}`, signal: "MEDIUM" as const };
}
