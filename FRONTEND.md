# Frontend Editing Guide

Use this file when you want to edit the player-facing game experience.

## Main Files

- `index.html`: page layout, modal markup, buttons, forms, and panels.
- `app.js`: frontend game logic, API calls, mode switching, stats, guesses, Plus unlock UI.
- `styles.css`: visual design, responsive layout, modal styling, Tough Mode and Plus panel styling.
- `assets/diagnostic-flow.svg`: brand mark shown in the header.

## Important UI Sections

- Game mode buttons: `classicMode`, `toughMode`
- Clues area: `clueStack`
- Tough reveal button: `revealClueButton`
- Guess form: `guessForm`, `guessInput`, `diagnosisOptions`
- Result modal: `resultModal`, `answerLine`, `explanationBlock`
- Plus panel: `premiumPanel`, `plusTokenInput`, `unlockPremium`, `premiumContent`
- Diagnosis library: `diagnosisLibrary`, `librarySearch`

## Frontend Data Flow

1. `app.js` first tries to load the backend API.
2. It requests diagnoses from `/api/diagnoses`.
3. It requests today's case from `/api/cases/today`.
4. In Classic Mode, wrong guesses request the next clue from `/api/guess`.
5. In Tough Mode, the player clicks `Reveal next clue`, which calls `/api/reveal`.
6. After the case is complete, Plus content is requested from `/api/premium/diagnosis/:id`.
7. If the backend is unavailable, the frontend falls back to `data/static-cases.json` for demo use.

## Common Edits

- Change wording in the app: edit visible text in `index.html` or messages in `app.js`.
- Change the look: edit colors, spacing, cards, and mobile behavior in `styles.css`.
- Add a new UI control: add markup in `index.html`, bind it in `app.js`, then style it in `styles.css`.
- Change Classic or Tough behavior: edit `submitGuess`, `revealNextClue`, and `maxGuessesForMode` in `app.js`.
- Change Plus display: edit `renderPremiumContent` in `app.js`.

## Safety Note

Do not put paid criteria guides, answers, or private case-bank logic directly into `app.js` for production. Anything in frontend files can be viewed by users. Keep protected material behind the backend API.
