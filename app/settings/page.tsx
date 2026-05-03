export default function SettingsPage() {
  const envHealth = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
    APP_BASE_URL: Boolean(process.env.APP_BASE_URL),
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <section><h2 className="font-semibold">Demo User Profile</h2><p>Role: SALES_OFFICER (demo)</p></section>
      <section><h2 className="font-semibold">Feature Flags</h2><ul><li>DEMO_MODE: {String(process.env.DEMO_MODE)}</li><li>AI_FALLBACK_ENABLED: true</li></ul></section>
      <section><h2 className="font-semibold">Environment Health</h2><pre className="border rounded p-2">{JSON.stringify(envHealth, null, 2)}</pre></section>
    </main>
  );
}
