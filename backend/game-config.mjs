export const GAME_CONFIG = {
  appName: "DIAGNOSIS DASH",
  baseDate: "2026-06-22",
  maxClues: 6,
  defaultMode: "classic",
  modes: [
    {
      id: "easy",
      label: "Easy",
      description: "Starts with 4 cues and allows six guesses.",
      startingClues: 4,
      maxGuesses: 6,
      canReveal: false,
      finalGuessOnly: false,
      difficulty: "easy",
      offset: 191
    },
    {
      id: "classic",
      label: "Classic",
      description: "Starts with 3 cues. Misses reveal more.",
      startingClues: 3,
      maxGuesses: 6,
      canReveal: false,
      finalGuessOnly: false,
      difficulty: "all",
      offset: 0
    },
    {
      id: "tough",
      label: "Tough",
      description: "Starts with 5 cues. One final answer.",
      startingClues: 5,
      maxGuesses: 1,
      canReveal: true,
      finalGuessOnly: true,
      difficulty: "tough",
      offset: 397
    }
  ],
  howToPlay: [
    "Easy mode starts with 4 cues and gives 6 guesses.",
    "Classic mode starts with 3 cues and reveals a new cue after each miss.",
    "Tough mode starts with 5 cues, lets you reveal the final cue, and your first diagnosis is final.",
    "Cases, cue counts, guess validation, and answers come from the backend.",
    "Plus-only clinical breakdowns load only after paid access is verified."
  ]
};
