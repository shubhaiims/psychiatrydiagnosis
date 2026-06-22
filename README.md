# DIAGNOSIS DASH

An original DSM-5-TR educational diagnosis guessing game inspired by daily word games. Each case is fictional and progressively reveals clinical clues.

## What Is New

- Backend-only editing: app name, mode rules, cue counts, cases, answers, and Plus guides live in backend files.
- Easy Mode: starts with one cue, backend selects easier cases, and allows up to six guesses.
- Difficult Mode: starts with one cue, backend selects harder cases, and allows up to six guesses.
- One cue at a time: a wrong guess reveals exactly one additional cue until the six-cue limit.
- Backend case engine: the frontend requests cases and guess validation from `server.mjs`.
- More than 1000 generated fictional training cases stored in backend data.
- Plus-only breakdowns: criteria guide, differential diagnoses, and how to distinguish them are returned only after a backend token check.

## Run Locally

Generate the case bank:

```bash
npm run train:cases
```

Start the backend:

```bash
npm start
```

Open:

```text
http://127.0.0.1:4173/
```

To test Plus content locally, set a token before starting the server:

```powershell
$env:PLUS_ACCESS_TOKEN="test-plus"
npm start
```

Then enter `test-plus` in the Plus token field after finishing a case.

## Data Layout

- `data/diagnoses.json`: public DSM-5-TR diagnostic label list.
- `backend/game-config.mjs`: editable backend source for app name, mode rules, cue counts, and how-to-play copy.
- `data/static-cases.json`: generated answer-containing data for reference only; direct browser access is blocked by the backend.
- `backend/private/cases.json`: backend case bank used by `server.mjs`.
- `backend/private/premium-diagnoses.json`: Plus-only educational diagnosis guides.
- `backend/generate-cases.mjs`: deterministic case generator. Increase `--count` to create more cases.

The Node server blocks direct static access to `backend/private/*` and to `data/static-cases.json`. For production paid access, deploy the backend with `PLUS_ACCESS_TOKEN` set and keep private data in a private server, private repo, or database.

## Editing Policy

Edit game behavior and content only in backend files, especially `backend/game-config.mjs`, `backend/generate-cases.mjs`, and `backend/private/*`. Frontend files should stay as a display client that consumes backend config and API responses.

## Editing Guides

- `FRONTEND.md`: read-only frontend map for understanding the display client.
- `BACKEND.md`: where to edit API routes, generated cases, private data, and Plus token behavior.
- `DEPLOYMENT.md`: where to deploy the backend and frontend together so it runs when your laptop is off.

## Scripts

```bash
npm run generate
npm run train:cases
npm run check
npm start
```

## Clinical And Legal Notes

This is for learning and play only. It is not a clinical tool, diagnostic instrument, medical advice, or a substitute for professional evaluation.

DSM-5-TR is a trademarked publication of the American Psychiatric Association. This repository does not copy DSM-5-TR criteria text or proprietary manual content. It uses diagnostic labels, broad categories, fictional cases, and original non-verbatim educational summaries aligned with DSM-5-TR concepts.
