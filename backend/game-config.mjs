export const GAME_CONFIG = {
  appName: "DIAGNOSIS DASH",
  baseDate: "2026-06-22",
  maxClues: 6,
  defaultMode: "easy",
  modes: [
    {
      id: "easy",
      label: "Easy",
      description: "One cue at a time. Easier cases selected by backend.",
      startingClues: 1,
      maxGuesses: 6,
      difficulty: "easy",
      offset: 191
    },
    {
      id: "difficult",
      label: "Difficult",
      description: "One cue at a time. Harder cases selected by backend.",
      startingClues: 1,
      maxGuesses: 6,
      difficulty: "difficult",
      offset: 397
    }
  ],
  howToPlay: [
    "Choose Easy or Difficult; the backend selects the case difficulty.",
    "Each case starts with one cue.",
    "Submit a diagnosis after each cue.",
    "If the guess is wrong, the backend reveals one more cue.",
    "A maximum of 6 cues and 6 guesses are available.",
    "Cases, cue counts, guess validation, and answers come from the backend.",
    "Clinical details, criteria guides, and differentials load only in the paid Plus version."
  ]
};
