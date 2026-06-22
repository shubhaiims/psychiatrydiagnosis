# Psychiatry Diagnosis

An original DSM-5-TR educational diagnosis guessing game inspired by daily word games. Each case is fictional and progressively reveals clinical clues.

## What Is New

- Classic Mode: six guesses, with a new clue after each miss.
- Tough Mode: players click to reveal only the clues they want, then get one final diagnosis guess.
- Backend case engine: the frontend requests cases, clue reveals, and guess validation from `server.mjs`.
- More than 1000 generated fictional training cases stored in backend data.
- Plus-only breakdowns: criteria guide, differential diagnoses, and how to distinguish them are returned only after a backend token check.
- Static fallback data for GitHub Pages demos.

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
- `data/static-cases.json`: static demo fallback, including answers, for GitHub Pages.
- `backend/private/cases.json`: backend case bank used by `server.mjs`.
- `backend/private/premium-diagnoses.json`: Plus-only educational diagnosis guides.
- `backend/generate-cases.mjs`: deterministic case generator. Increase `--count` to create more cases.

The Node server blocks direct static access to `backend/private/*` and to `data/static-cases.json`. For production paid access, deploy the backend with `PLUS_ACCESS_TOKEN` set and keep private data in a private server, private repo, or database.

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
