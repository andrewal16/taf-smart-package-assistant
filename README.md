# TAF Smart Package Assistant

TAF Smart Package Assistant is a sales assistant for Dealer and Sales Officer users to find feasible financing schemes based on package rules and policy guardrails.

## Non-Approval Disclaimer

This application is **not** an automated credit approval system. All outputs are recommendations only and final approval remains under TAF credit processes.

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (via `DATABASE_URL`)
- Vercel deployment target

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy and update environment values:
   ```bash
   cp .env.example .env
   ```
3. Run Prisma migration:
   ```bash
   npx prisma migrate dev
   ```
4. Seed demo data:
   ```bash
   npx prisma db seed
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Defined in `.env.example`:

- `DATABASE_URL` (required): PostgreSQL connection string.
- `OPENAI_API_KEY` (optional for MVP fallback): server-side only. Never expose to browser and never use `NEXT_PUBLIC_` prefix.
- `OPENAI_MODEL` (optional): preferred LLM model name.
- `APP_BASE_URL` (required for production): base URL for callbacks and links.
- `AUTH_SECRET` (required for production): session signing secret.
- `DEMO_MODE` (optional): enables seeded demo users and mock flows.
- `NEXT_PUBLIC_APP_NAME` (optional): non-sensitive app display name.

## Demo Users and Roles

All demo accounts use password: `demo1234`.

- `dealer@example.com` — DEALER_SALESMAN
- `so@example.com` — SALES_OFFICER
- `head@example.com` — SALES_HEAD
- `product@example.com` — PRODUCT_ADMIN
- `credit@example.com` — CREDIT_ADMIN
- `risk@example.com` — RISK_ADMIN
- `compliance@example.com` — COMPLIANCE_ADMIN

## Package Workflow (Draft to Active)

1. Create package draft via admin package flow.
2. Submit package for approval workflow.
3. Complete approval by authorized approver roles.
4. Activate package so it becomes eligible in recommendation logic.

## Run Tests

```bash
npm run lint
npm run test
```

## Deploy on Vercel

1. Push repository to Git provider.
2. Import the project in Vercel.
3. Configure environment variables from `.env.example`.
4. Use default Next.js build settings.
5. Run deployment.

## Known Limitations (Sprint 0)

- Sprint 0 currently provides scaffolding only.
- Business logic, rule engine, and chat orchestration are not yet implemented.
- Demo authentication is not production-ready.

## Production Hardening Checklist

- Replace demo auth with enterprise SSO.
- Apply strict RBAC middleware and endpoint authorization.
- Add rate limiting, CSRF/session protection, and stronger validation.
- Enforce consent management and data retention policy.
- Implement monitoring for errors, audit trails, and recommendation outcomes.
- Ensure AI governance: prompt versioning, usage logging, and no personal-data fine-tuning.
