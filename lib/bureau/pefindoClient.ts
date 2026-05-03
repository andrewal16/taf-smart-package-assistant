// TODO: replace with real PEFINDO endpoint spec and auth flow.
export async function pefindoClient() {
  const baseUrl = process.env.PEFINDO_API_BASE_URL;
  const apiKey = process.env.PEFINDO_API_KEY;
  if (!baseUrl || !apiKey) throw new Error("PEFINDO config missing");
  return { requestId: `live-${Date.now()}`, signal: "MEDIUM" as const };
}
