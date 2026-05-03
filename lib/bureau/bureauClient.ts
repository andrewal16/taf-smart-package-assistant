import { mockBureauClient } from "./mockBureauClient";
import { pefindoClient } from "./pefindoClient";

export async function runBureauPrescreen() {
  const mode = process.env.BUREAU_MODE === "live" ? "live" : "mock";
  if (mode === "live") {
    try {
      return { mode, ...(await pefindoClient()) };
    } catch {
      return { mode: "mock" as const, ...(await mockBureauClient()) };
    }
  }
  return { mode, ...(await mockBureauClient()) };
}
