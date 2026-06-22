# Backend Editing Guide

Use this file when you want to edit the server, generated cases, API routes, or Plus-only material.

## Main Files

- `server.mjs`: Node backend server and API routes.
- `backend/generate-cases.mjs`: deterministic training case generator.
- `backend/private/cases.json`: generated private backend case bank.
- `backend/private/premium-diagnoses.json`: Plus-only diagnosis guides.
- `data/diagnoses.json`: public diagnosis label list.
- `data/static-cases.json`: static fallback demo data.
- `package.json`: scripts for generation, checking, and running the server.

## API Routes

- `GET /api/health`: server status and data counts.
- `GET /api/diagnoses`: public diagnosis labels.
- `GET /api/cases/today?mode=easy|classic|tough&date=YYYY-MM-DD`: public case payload with no answer.
- `POST /api/reveal`: returns the next clue for a case.
- `POST /api/guess`: validates a guess and returns answer details only after completion.
- `GET /api/premium/diagnosis/:id`: returns Plus-only criteria and differential guide after token validation.

## Private Data Rules

- `backend/private/*` is blocked from static serving by `server.mjs`.
- `data/static-cases.json` is also blocked by `server.mjs` because it includes answer IDs for static fallback.
- For production, keep paid and answer-containing data in a private server, private repo, or database.

## Common Edits

- Add or improve case patterns: edit `profiles` in `backend/generate-cases.mjs`.
- Add diagnosis labels: edit `profiles` or `extraDiagnoses` in `backend/generate-cases.mjs`.
- Regenerate 1200 cases: run `npm.cmd run train:cases`.
- Generate a different amount: run `node backend/generate-cases.mjs --count 2000`.
- Change API behavior: edit route handling in `server.mjs`.
- Change starting clue counts: edit `MODE_CONFIG` in `server.mjs` and `app.js`.
- Change Plus token behavior: edit the `/api/premium/diagnosis/:id` route in `server.mjs`.

## Local Backend Commands

```powershell
npm.cmd run train:cases
npm.cmd run check
$env:PLUS_ACCESS_TOKEN="test-plus"
npm.cmd start
```

Open the app at:

```text
http://127.0.0.1:4173/
```

## Clinical Content Note

The generated criteria guides are original DSM-5-TR-aligned educational summaries. They are not verbatim DSM-5-TR manual text, not clinically validated, and not medical advice.
