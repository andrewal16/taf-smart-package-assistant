# TAF Smart Package Assistant (Prototype)

## Core principle
This app is **not** a credit approval engine. It is a sales assistant for simulation, KTP extraction prototype, risk routing, and next-action recommendations.

## New prototype flows
- **Simulation Mode**: package simulation without KTP/NIK.
- **Verified Check Mode**: KTP upload -> OCR extraction -> review -> bureau prescreen (mock/live).

## Security
- OPENAI and PEFINDO credentials are server-side only.
- Dealer UI never shows raw bureau details, score, or credit history.
- Dealer sees safe output status only: GREEN / YELLOW / MANUAL_REVIEW / NOT_RECOMMENDED.

## Setup
```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Required env
- DATABASE_URL
- AUTH_SECRET
- OPENAI_API_KEY (optional for OCR live)
- OPENAI_MODEL (optional)
- OCR_MODE=mock|live
- BUREAU_MODE=mock|live
- PEFINDO_API_BASE_URL
- PEFINDO_CLIENT_ID
- PEFINDO_CLIENT_SECRET
- PEFINDO_API_KEY
- PEFINDO_TIMEOUT_MS

## Prototype limitations
- PEFINDO live adapter is TODO placeholder.
- OCR live can fallback to mock automatically.
- No final approval/rejection decision is made by chatbot.

## Vercel notes
Set all secrets as server environment variables only.
