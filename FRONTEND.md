# Frontend Read-Only Map

The frontend is a display client for DIAGNOSIS DASH. Do not edit game content, mode rules, cue counts, answers, Plus guides, or app branding here. Those are backend-owned.

## Display Files

- `index.html`: static page shell, placeholders, forms, modals, and panels.
- `app.js`: browser client that fetches backend config, cases, cue reveals, guess validation, stats, and Plus unlock responses.
- `styles.css`: visual design and responsive layout.
- `assets/diagnostic-flow.svg`: header mark.

## Backend-Owned Settings

Edit these in `backend/game-config.mjs`:

- App name
- Mode labels and descriptions
- Starting cue counts
- Guess limits
- Whether a mode can reveal extra cues
- How-to-play copy

Edit generated case patterns in `backend/generate-cases.mjs`, then run `npm.cmd run train:cases`.

## Frontend Data Flow

1. `app.js` loads `/api/config`.
2. The mode buttons and how-to-play list are rendered from backend config.
3. Diagnoses are loaded from `/api/diagnoses`.
4. The current case is loaded from `/api/cases/today`.
5. Cue reveals are requested from `/api/reveal`.
6. Guesses are validated by `/api/guess`.
7. Plus content is requested from `/api/premium/diagnosis/:id` after token entry.

## Safety Rule

Anything in frontend files can be viewed by users. Keep protected content and editable game rules in backend files only.
