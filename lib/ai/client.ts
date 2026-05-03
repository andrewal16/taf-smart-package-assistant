export async function callOpenAIJson(systemPrompt: string, userMessage: string): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      text: { format: { type: "json_object" } },
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const outputText = data?.output_text;
  if (!outputText) return null;

  try {
    return JSON.parse(outputText);
  } catch {
    return null;
  }
}
