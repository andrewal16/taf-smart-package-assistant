# TAF Smart Package Assistant — Codex Build Instructions
# PRD Version: 0.1 | Date: 2026-05-03 | Status: MVP Build Draft

---

## Project Overview

TAF Smart Package Assistant is a sales assistant for Dealer and Sales Officer users.
It helps users find feasible financing schemes based on customer budget, selected unit,
package rules, TAF policy guardrails, and preliminary risk routing.

**CRITICAL:** This system must NOT become an automated credit approval system.
It must NOT expose raw credit bureau or PEFINDO details to dealer users.

**Product principle:** LLM is only the conversational layer. All installment calculation,
package eligibility, policy checks, risk routing, reason codes, and audit logging must be
deterministic and traceable.

---

## Tech Stack

| Area         | Decision                                                                 |
|--------------|--------------------------------------------------------------------------|
| Framework    | Next.js App Router with TypeScript                                        |
| Deployment   | Vercel                                                                    |
| Database     | PostgreSQL via DATABASE_URL; local dev may use SQLite only if Prisma schema remains portable |
| ORM          | Prisma preferred for MVP                                                 |
| UI           | Tailwind CSS and component-based React UI                                |
| AI API       | Server-side abstraction only. Do NOT expose API key to browser.          |
| Auth         | MVP may implement seeded role-based demo auth; production must replace with company SSO. |
| Compliance   | No final credit approval, no raw PEFINDO display, reason code required, audit log required. |

---

## Repository Structure

Codex must follow this exact folder structure:

```
taf-smart-package-assistant/
  app/
    page.tsx
    chat/page.tsx
    admin/packages/page.tsx
    admin/packages/[id]/page.tsx
    admin/rules/page.tsx
    dashboard/page.tsx
    api/chat/route.ts
    api/packages/route.ts
    api/packages/[id]/route.ts
    api/packages/[id]/submit/route.ts
    api/packages/[id]/approve/route.ts
    api/rules/route.ts
    api/simulations/route.ts
    api/leads/route.ts
    api/dashboard/route.ts
  components/
    chat/
    package/
    admin/
    dashboard/
    shared/
  lib/
    ai/
      client.ts
      intent-parser.ts
      prompts.ts
    simulation/
      calculator.ts
      types.ts
    package/
      search.ts
      validation.ts
    rules/
      engine.ts
      reason-codes.ts
    recommendation/
      ranker.ts
      formatter.ts
    auth/
      session.ts
      rbac.ts
    audit/
      log.ts
    db.ts
  prisma/
    schema.prisma
    seed.ts
  docs/
    README.md
    TESTING.md
  .env.example
  package.json
  README.md
```

---

## Environment Variables

Create `.env.example` only. Do NOT commit real secrets.

| Variable           | Required                        | Purpose                                                    |
|--------------------|---------------------------------|------------------------------------------------------------|
| DATABASE_URL       | Yes                             | PostgreSQL connection string.                              |
| OPENAI_API_KEY     | No for MVP fallback; Yes for AI | Provided later by project owner. Server-side ONLY.         |
| OPENAI_MODEL       | No                              | Model name. Default configured later.                      |
| APP_BASE_URL       | Yes for production              | Base URL for links and callbacks.                          |
| AUTH_SECRET        | Yes for production              | Session signing secret.                                    |
| DEMO_MODE          | No                              | If true, enables seeded demo users and mock risk signals.  |
| NEXT_PUBLIC_APP_NAME | No                            | Non-sensitive display name only.                           |

**STRICT RULE:** `OPENAI_API_KEY` must NEVER use `NEXT_PUBLIC_` prefix.
The app must run without AI key using deterministic fallback mode.

---

## Current Phase

> ⚠️ **SPRINT 0 — SETUP ONLY**
> Do NOT implement features from Sprint 1, 2, 3, 4, or 5 yet.

### Sprint 0 Checklist (Kerjakan ini saja):
- [ ] Inisialisasi Next.js App Router + TypeScript
- [ ] Setup Prisma dengan schema sesuai section Database Schema di bawah
- [ ] Setup Tailwind CSS
- [ ] Buat `.env.example` dengan semua variable di atas
- [ ] Buat folder structure sesuai Repository Structure di atas
- [ ] Buat `prisma/seed.ts` dengan seed data sesuai section Seed Data di bawah
- [ ] Buat `README.md` sesuai section README Requirements di bawah
- [ ] Vercel-ready configuration

---

## Roadmap Bertahap

| Sprint   | Scope                                          | Status        |
|----------|------------------------------------------------|---------------|
| Sprint 0 | Setup, Prisma, Tailwind, Seed Data, Vercel env | ← KERJAKAN INI |
| Sprint 1 | Simulation engine, package search, tests        | Belum mulai   |
| Sprint 2 | Chat UI, intent parser, /api/chat, lead, audit  | Belum mulai   |
| Sprint 3 | Admin CMS, approval workflow, versioning        | Belum mulai   |
| Sprint 4 | Sales Head dashboard, rule management, RBAC     | Belum mulai   |
| Sprint 5 | Hardening, tests, Vercel deploy, UAT fixes      | Belum mulai   |

---

## Database Schema — MVP (Prisma)

Implement exactly as follows in `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      UserRole
  dealerId  String?
  branchId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  DEALER_SALESMAN
  SALES_OFFICER
  SALES_HEAD
  PRODUCT_ADMIN
  CREDIT_ADMIN
  RISK_ADMIN
  COMPLIANCE_ADMIN
  IT_ADMIN
}

model Branch {
  id       String  @id @default(cuid())
  name     String
  city     String
  isActive Boolean @default(true)
}

model Dealer {
  id       String  @id @default(cuid())
  name     String
  branchId String
  isActive Boolean @default(true)
}

model VehicleModel {
  id       String   @id @default(cuid())
  brand    String
  model    String
  variant  String?
  fuelType String?  // ICE, Hybrid, EV
  otr      Decimal
  isActive Boolean  @default(true)
}

model Package {
  id               String        @id @default(cuid())
  code             String        @unique
  name             String
  productType      String        // New Car, Used Car, Siap Dana
  brand            String?
  model            String?
  branchId         String?
  dealerId         String?
  customerSegment  String?
  otrMin           Decimal?
  otrMax           Decimal?
  dpMinPct         Decimal
  dpMaxPct         Decimal?
  tenorMin         Int
  tenorMax         Int
  annualRatePct    Decimal
  addmAllowed      Boolean       @default(true)
  addbAllowed      Boolean       @default(true)
  insuranceMode    String        @default("ON_LOAN")
  adminFee         Decimal       @default(0)
  tacpAllowed      Boolean       @default(false)
  effectiveFrom    DateTime
  effectiveTo      DateTime
  status           PackageStatus @default(DRAFT)
  approvalStatus   ApprovalStatus @default(DRAFT)
  version          Int           @default(1)
  createdById      String
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

enum PackageStatus {
  DRAFT
  PENDING
  ACTIVE
  SUSPENDED
  EXPIRED
  ARCHIVED
}

enum ApprovalStatus {
  DRAFT
  SUBMITTED
  CREDIT_APPROVED
  RISK_APPROVED
  COMPLIANCE_APPROVED
  APPROVED
  REJECTED
}

model Rule {
  id              String               @id @default(cuid())
  code            String               @unique
  name            String
  description     String
  conditionJson   Json
  actionJson      Json
  priority        Int                  @default(100)
  outputStatus    RecommendationStatus
  reasonCode      String
  dealerWording   String
  internalWording String
  isActive        Boolean              @default(true)
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
}

enum RecommendationStatus {
  GREEN
  YELLOW
  MANUAL_REVIEW
  NOT_RECOMMENDED
}

model Lead {
  id                 String                @id @default(cuid())
  dealerId           String?
  branchId           String?
  createdById        String
  customerAlias      String?
  productType        String
  desiredInstallment Decimal?
  desiredTdp         Decimal?
  selectedModel      String?
  status             RecommendationStatus?
  finalOutcome       String?
  lostReason         String?
  createdAt          DateTime              @default(now())
  updatedAt          DateTime              @updatedAt
}

model Recommendation {
  id          String               @id @default(cuid())
  leadId      String?
  userId      String
  inputJson   Json
  outputJson  Json
  status      RecommendationStatus
  reasonCodes String[]
  packageIds  String[]
  createdAt   DateTime             @default(now())
}

model AuditLog {
  id         String   @id @default(cuid())
  actorId    String?
  action     String
  entityType String
  entityId   String?
  beforeJson Json?
  afterJson  Json?
  createdAt  DateTime @default(now())
}
```

---

## Seed Data (prisma/seed.ts)

Seed exactly the following data:

### Users
| Email                  | Role               | Password (demo) |
|------------------------|--------------------|-----------------|
| dealer@example.com     | DEALER_SALESMAN    | demo1234        |
| so@example.com         | SALES_OFFICER      | demo1234        |
| head@example.com       | SALES_HEAD         | demo1234        |
| product@example.com    | PRODUCT_ADMIN      | demo1234        |
| credit@example.com     | CREDIT_ADMIN       | demo1234        |
| risk@example.com       | RISK_ADMIN         | demo1234        |
| compliance@example.com | COMPLIANCE_ADMIN   | demo1234        |

### Branch
- Kelapa Gading (city: Jakarta)

### Dealers
- Dealer Demo Kelapa Gading 1 (branchId: Kelapa Gading)
- Dealer Demo Kelapa Gading 2 (branchId: Kelapa Gading)

### Vehicle Models
| Brand  | Model   | OTR (IDR)      | Fuel |
|--------|---------|----------------|------|
| Toyota | Avanza  | 260,000,000    | ICE  |
| Toyota | Raize   | 255,000,000    | ICE  |
| Toyota | Innova  | 420,000,000    | ICE  |
| Toyota | bZ4X    | 1,200,000,000  | EV   |

### Packages
| Package Name                    | DP Min-Max | Tenor    | Rate  | ADDM | ADDB |
|---------------------------------|------------|----------|-------|------|------|
| Avanza Regular Package          | 20%-40%    | 36-60 mo | 6.5%  | Yes  | Yes  |
| Raize Low Installment Package   | 20%-45%    | 48-60 mo | 6.3%  | Yes  | No   |
| Innova 50-50 Inspired Package   | 30%-50%    | 12 mo    | 5.9%  | Yes  | No   |
| EV Review Package (bZ4X)        | 30%-50%    | 36-60 mo | 7.0%  | Yes  | No   |

> Note: EV Review Package must have a Manual Review rule enabled by default.

---

## Business Logic — Simulation Formula

Implement in `lib/simulation/calculator.ts`. Do NOT use LLM for calculation.

```
amountDp         = otr * dpPct
principal        = otr - amountDp + financedInsurance
interest         = principal * (annualRatePct / 100) * (tenorMonths / 12)
totalReceivable  = principal + interest
installment      = roundToNearestThousand(totalReceivable / tenorMonths)
tdp              = amountDp + adminFee + cashInsurance + (ADDM ? installment : 0)
```

---

## Business Logic — Package Search Algorithm

Implement in `lib/package/search.ts`. Do NOT use LLM for package matching.

```
function findPackageOptions(input):
  1. Normalize input: productType, model, otr, desiredInstallment,
     desiredTdp, dp, tenor, paymentType.
  2. Query active packages where:
     - status = ACTIVE
     - effectiveFrom <= today <= effectiveTo
     - productType matches
     - branch/dealer/model eligibility matches or is null/open
     - OTR within range if range exists
  3. Generate candidate schemes by varying allowed tenor and DP within package bounds.
  4. Calculate installment and TDP for each candidate.
  5. Exclude candidates that violate hard policy rules.
  6. Score candidate fit:
     - installmentFit = distance from desiredInstallment
     - tdpFit         = distance from desiredTdp
     - riskPenalty    = output from rule engine
     - salesPriority  = optional package priority
  7. Return top 3 candidates with status and reason codes.
```

---

## Recommendation Status Rules

| Status           | Meaning                                             | Dealer-Facing Wording                                                    |
|------------------|-----------------------------------------------------|--------------------------------------------------------------------------|
| GREEN            | Budget and policy look feasible; no fast-lane blocker | Lanjut fast track. Kirim link verifikasi dan lengkapi data.             |
| YELLOW           | Feasible only after adjustment                      | Skema awal perlu penyesuaian. Rekomendasi naikkan DP atau ubah tenor.   |
| MANUAL_REVIEW    | Needs SO/Credit review                              | Perlu review TAF Officer. Jangan menjanjikan approval.                  |
| NOT_RECOMMENDED  | Not suitable for fast lane based on hard rule       | Belum direkomendasikan untuk jalur cepat. Bisa review manual jika ada data pendukung. |

---

## Reason Codes

| Code | Internal Meaning                        | Dealer Wording                         |
|------|-----------------------------------------|----------------------------------------|
| RC01 | Installment exceeds affordability target | Angsuran perlu disesuaikan.           |
| RC02 | DP below package or policy recommendation | Rekomendasi DP dinaikkan.            |
| RC03 | Tenor outside optimal/allowed range     | Rekomendasi ubah tenor.               |
| RC04 | Required data incomplete                | Lengkapi data customer.               |
| RC05 | Risk signal requires review             | Perlu review TAF Officer.             |
| RC06 | e-KYC or consent incomplete             | Lanjutkan verifikasi customer.        |
| RC07 | Rate/package deviation trigger          | Perlu approval lanjutan.              |
| RC08 | Positive internal history signal        | Eligible untuk prioritas proses.      |
| RC09 | Package expired or inactive             | Paket tidak tersedia untuk periode ini. |
| RC10 | Dealer/branch not eligible for package  | Paket tidak tersedia untuk dealer/cabang ini. |

---

## AI Usage Rules

| AI Task                          | Allowed?              | Rule                                                                 |
|----------------------------------|-----------------------|----------------------------------------------------------------------|
| Intent parsing                   | ✅ Allowed            | Extract intent and entities. Validate with schema before business logic. |
| Natural language response        | ✅ Allowed            | Use deterministic output as source of truth. LLM only formats response. |
| Installment calculation          | ❌ Not allowed        | Use calculator.ts only.                                              |
| Package eligibility              | ❌ Not allowed        | Use package database and rule engine.                                |
| Risk routing final decision      | ❌ Not as sole source | Use deterministic rules and internal risk signal.                    |
| Credit approval/rejection        | ❌ Not allowed        | Out of scope. TAF credit process owns final decision.                |
| Learning from customer data      | ❌ Not allowed in MVP | No fine-tuning on personal data.                                     |

---

## API Endpoints

| Endpoint                        | Method     | Purpose                                            |
|---------------------------------|------------|----------------------------------------------------|
| /api/chat                       | POST       | Accept chat input; parse intent; run package search; return recommendation. |
| /api/simulations                | POST       | Run deterministic simulation from structured input. |
| /api/packages                   | GET/POST   | List and create package draft.                     |
| /api/packages/[id]              | GET/PATCH  | Read or update package draft.                      |
| /api/packages/[id]/submit       | POST       | Submit package for approval workflow.              |
| /api/packages/[id]/approve      | POST       | Approve package by authorized role.                |
| /api/packages/[id]/suspend      | POST       | Suspend active package.                            |
| /api/rules                      | GET/POST   | List and create rules.                             |
| /api/leads                      | GET/POST   | Create and list leads.                             |
| /api/dashboard                  | GET        | Return metrics for Sales Head dashboard.           |
| /api/audit                      | GET        | Return audit logs for authorized roles.            |

### /api/chat — Request & Response Example

**Request:**
```json
{
  "message": "Customer maunya cicilan maksimal 4 juta, Avanza, DP 50 juta, tenor fleksibel",
  "context": {
    "dealerId": "dealer_demo_1",
    "branchId": "kelapa_gading",
    "userRole": "SALES_OFFICER"
  }
}
```

**Response 200:**
```json
{
  "intent": "find_package_by_installment",
  "entities": {
    "desiredInstallment": 4000000,
    "model": "Avanza",
    "dpAmount": 50000000
  },
  "status": "YELLOW",
  "summary": "Skema awal perlu penyesuaian agar mendekati cicilan Rp4 juta.",
  "options": [
    {
      "packageId": "pkg_001",
      "packageName": "Avanza Regular Package",
      "dpAmount": 60000000,
      "tenorMonths": 60,
      "paymentType": "ADDM",
      "estimatedInstallment": 3980000,
      "estimatedTdp": 65000000,
      "reasonCodes": ["RC02"]
    }
  ],
  "dealerVisibleReasons": ["Rekomendasi DP dinaikkan."],
  "disclaimer": "Rekomendasi awal, bukan keputusan approval final."
}
```

---

## UI Pages Required

| Page                  | Required Elements                                                                 |
|-----------------------|-----------------------------------------------------------------------------------|
| /chat                 | Chat input, structured field panel, recommendation cards, disclaimer, save lead button. |
| /dashboard            | Lead volume, status mix, funnel, lost reason, SLA, dealer ranking.               |
| /admin/packages       | Package table, filters, create button, status chips, effective date, approval status. |
| /admin/packages/[id]  | Package detail/edit form, validation, preview simulation, version history, approval buttons. |
| /admin/rules          | Rule list, reason code table, active status, role-restricted edit.               |
| /leads                | Lead list, status, dealer, assigned SO, outcome, lost reason update.             |
| /settings             | Demo user/profile, feature flags, environment health indicator.                  |

### Recommendation Card Rules
- Display: package name, product type, unit/model, DP, tenor, payment type, estimated installment, estimated TDP, status, next action.
- **NEVER** display raw bureau score, exact risk score, or negative reason to dealer role.
- **ALWAYS** include disclaimer: "Rekomendasi awal dan tetap mengikuti proses approval TAF."
- Internal reason code details: only for authorized internal roles.

---

## Governance & Compliance Guardrails (NON-NEGOTIABLE)

| Guardrail                    | Requirement                                                                                   |
|------------------------------|-----------------------------------------------------------------------------------------------|
| No final approval            | Never say customer is approved or rejected. Use: fast track / counteroffer / manual review / not recommended. |
| No raw PEFINDO/bureau         | Dealer role must never see bureau score, credit history, lender names, overdue history.       |
| Explainability               | Every recommendation must include internal reason codes. Dealer sees safe operational wording. |
| Human-in-the-loop            | Manual review path must exist for Yellow, Manual Review, Not Recommended.                    |
| Consent                      | MVP may mock consent; production must require explicit customer consent before e-KYC/bureau.  |
| Audit trail                  | Log every package change, rule change, simulation, recommendation, and approval action.       |
| Data minimization            | Ask only data required for simulation first. NIK/no HP only when user proceeds to verified workflow. |
| No customer-data fine-tuning | Must not fine-tune LLM with personal data, raw chat logs, or bureau outputs.                 |
| Fallback behavior            | If AI fails, deterministic form-based simulation must still work.                            |

---

## Personas & Permissions

| Persona           | Permissions                                                                              |
|-------------------|------------------------------------------------------------------------------------------|
| Dealer Salesman   | Read eligible active packages; create lead; cannot view risk detail; cannot approve package. |
| Sales Officer     | Create/edit assigned leads; view recommendation details excluding raw bureau; route to Sales Head/Credit. |
| Sales Head        | Dashboard access; dealer comparison; no raw bureau details unless separately authorized. |
| Product/Sales Admin | Create/edit draft packages; submit for approval.                                       |
| Credit Admin      | Approve/reject credit policy elements.                                                   |
| Risk Admin        | Approve/reject risk rules; view monitoring dashboard.                                    |
| Compliance/Legal  | Approve/reject wording and data usage setup.                                             |
| IT/Admin          | System administration; no unauthorized data export.                                     |

---

## Testing Requirements

### Unit Tests (required)
- `calculator.test.ts` — ADDM/ADDB, DP amount, installment rounding, TDP calculation.
- `package-search.test.ts` — active date filter, dealer eligibility, model eligibility, package ranking.
- `rules-engine.test.ts` — DP below minimum → YELLOW RC02; data incomplete → MANUAL_REVIEW RC04; expired package excluded.
- `intent-parser.test.ts` — Indonesian budget phrasing extraction, fallback parser, invalid input handling.

### Integration Tests (required)
- POST /api/chat returns recommendation with options and reason codes.
- Admin package activation requires approval workflow.
- Dealer role cannot access raw reason details or admin endpoints.
- Audit log record is created for package changes and chat recommendations.

---

## README Requirements

README.md must include:
- Project overview and non-approval disclaimer.
- Local setup: `npm install`, env setup, `prisma migrate`, `prisma seed`, `npm run dev`.
- Environment variables explanation (OPENAI_API_KEY is server-side only).
- Demo users and roles.
- How to create and activate a package.
- How to run tests.
- How to deploy on Vercel.
- Known limitations and production hardening checklist.

---

## Production Hardening Checklist (Future — Do Not Implement in MVP)

| Area             | Required Before Production                                                    |
|------------------|-------------------------------------------------------------------------------|
| Authentication   | Replace demo auth with approved SSO or production-grade auth.                |
| Database         | Use managed PostgreSQL with backups and access controls.                     |
| Secrets          | Store keys only in Vercel environment variables or approved secret manager.  |
| Security         | RBAC middleware, rate limiting, CSRF/session protection, input validation.   |
| Privacy          | Consent management, data retention policy, masking, export controls.         |
| Compliance       | Approved disclaimers and customer-facing wording.                            |
| Credit governance | Formal signoff that chatbot does not override Decision Engine/Credit authority. |
| Monitoring       | Error logs, audit logs, recommendation drift, outcome tracking.              |
| Bureau integration | Only after Legal/Compliance/PEFINDO contract review and explicit consent.  |
| AI governance    | Model usage logs, prompt versioning, no personal-data fine-tuning without approval. |

---

*End of AGENTS.md — TAF Smart Package Assistant v0.1*
