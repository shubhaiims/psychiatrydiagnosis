export const GAME_CONFIG = {
  appName: "DIAGNOSIS DASH",
  baseDate: "2026-06-22",
  maxClues: 6,
  questionsPerRound: 5,
  defaultMode: "easy",
  modes: [
    {
      id: "easy",
      label: "Easy",
      description: "Five cases. Easier backend-selected questions.",
      startingClues: 1,
      maxGuesses: 6,
      difficultyMin: 1,
      difficultyMax: 3,
      offset: 191,
      step: 29
    },
    {
      id: "difficult",
      label: "Difficult",
      description: "Five cases from the hardest backend question bank.",
      startingClues: 1,
      maxGuesses: 6,
      difficultyMin: 5,
      difficultyMax: 5,
      offset: 397,
      step: 37
    }
  ],
  howToPlay: [
    "Choose Easy or Difficult; the backend selects the case difficulty.",
    "Each round has 5 questions, shown one at a time.",
    "Each question starts with one cue.",
    "Submit a diagnosis after each cue.",
    "If the guess is wrong, the backend reveals one more cue.",
    "A maximum of 6 cues and 6 guesses are available per question.",
    "After a question is solved or missed, move to the next question.",
    "Cases, cue counts, guess validation, and answers come from the backend.",
    "Clinical details, criteria guides, and differentials load only in the paid Plus version."
  ]
};
