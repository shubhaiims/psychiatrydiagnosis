# Psychiatry Diagnosis

A static, GitHub Pages-ready DSM-5-TR diagnosis guessing game inspired by daily word games.

Each day the site shows a fictional patient presentation. Players guess the most likely DSM-5-TR diagnostic label from progressively revealed clues. A wrong guess reveals another clue. The player has 6 clues and 6 guesses.

## Features

- Daily case selection in the browser.
- DSM-5-TR diagnostic label autocomplete.
- Six progressive case clues.
- Same-category feedback after wrong guesses.
- Local stats, streaks, and guess distribution.
- Shareable result text.
- Original fictional cases and explanations.
- Fully static: no backend required.

## Local Preview

The app is fully static and can be opened directly:

```text
index.html
```

You can also serve the folder with any static file server if you prefer a local URL.

## Deployment

The included GitHub Actions workflow deploys this static site to GitHub Pages on every push to `main`.

Expected public URL after Pages is enabled:

```text
https://shubhaiims.github.io/psychiatrydiagnosis/
```

## Clinical And Legal Notes

This is for learning and play only. It is not a clinical tool, diagnostic instrument, medical advice, or a substitute for professional evaluation.

DSM-5-TR is a trademarked publication of the American Psychiatric Association. This repository does not copy DSM-5-TR criteria text or proprietary manual content. It uses diagnostic labels, broad categories, and original fictional educational cases.
