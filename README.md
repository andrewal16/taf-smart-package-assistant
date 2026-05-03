# TAF Smart Package Assistant

TAF Smart Package Assistant is a sales assistant for Dealer and Sales Officer users to find feasible financing schemes based on package rules and policy guardrails.

## Non-Approval Disclaimer

This application is **not** an automated credit approval system. All outputs are recommendations only and final approval remains under TAF credit processes.

## Local Setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Environment Variables

- `DATABASE_URL` (required)
- `OPENAI_API_KEY` (optional for fallback mode, server-side only)
- `OPENAI_MODEL` (optional)
- `APP_BASE_URL` (prod required)
- `AUTH_SECRET` (prod required)
- `DEMO_MODE` (optional)
- `NEXT_PUBLIC_APP_NAME` (optional)

## Security/Hardening (Sprint 5)

- Deterministic fallback works without `OPENAI_API_KEY` (`parseIntent` falls back to regex parser).
- `OPENAI_API_KEY` is never exposed through `NEXT_PUBLIC_*` variables.
- Dealer role is blocked from admin endpoints via middleware RBAC and does not receive raw reason details from `/api/chat`.
- Every recommendation includes internal reason codes and writes audit logs (`CHAT_RECOMMENDATION`).
- `.env` file must never be committed; only `.env.example` is tracked.

## Testing

```bash
npm run lint
npm run test
```

Includes unit tests and integration test placeholders for:
- calculator
- package search
- rules engine
- intent parser
- chat API integration
- admin workflow integration

## Vercel Deployment Check

- `next.config.ts` is present and Next.js app is Vercel-ready.
- Ensure Vercel Project Environment Variables are set from `.env.example`.
- Do not set `OPENAI_API_KEY` as public env var.
