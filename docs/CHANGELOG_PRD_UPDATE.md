# Dealer-Assisted KTP Upload + OCR + Bureau Prescreen Prototype

## Why change was made
Prototype flow needs faster assisted verification by dealer/SO using KTP upload, while keeping chatbot as sales assistant only.

## Simulation vs Verified Mode
- Simulation Mode: budget-to-package recommendation without KTP/NIK.
- Verified Check Mode: KTP OCR extraction + consent + bureau prescreen (mock/live adapter).

## Consent requirement
KTP upload requires dealer consent attestation from customer.

## No raw PEFINDO exposure
Dealer only sees safe status and next action. Raw bureau response is not returned.

## Server-side bureau call
Bureau adapter runs server-side only with env credentials.

## Production recommendation
Self-consent verification link is still safer than dealer-assisted upload for production rollout.
