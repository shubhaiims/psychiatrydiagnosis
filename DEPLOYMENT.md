# Deployment Guide

DIAGNOSIS DASH should be deployed as one Node web service. The backend serves both the frontend files and the API, so do not use GitHub Pages alone for production.

## Recommended Host

Use Render as the easiest deployment path:

1. Push this repo to GitHub.
2. In Render, create a new Web Service from the GitHub repo.
3. Runtime: Node.
4. Build command:

```bash
npm run train:cases
```

5. Start command:

```bash
npm start
```

6. Add environment variable:

```text
PLUS_ACCESS_TOKEN=your-secret-plus-token
```

7. Choose a paid web service instance for production so the backend does not sleep after inactivity.

## Why Not GitHub Pages Alone

GitHub Pages can host static frontend files, but DIAGNOSIS DASH now requires backend routes such as `/api/config`, `/api/cases/today`, `/api/guess`, and `/api/premium/diagnosis/:id`.

## Always-On Options

- Render paid Web Service: easiest for this repo. Avoid the free tier for production because free web services can sleep when idle.
- Fly.io: good if you are comfortable with CLI deployment. Configure at least one Machine to stay running, or disable autostop.
- Railway: also works for a Node web service, but watch usage and billing settings carefully.

## Production Notes

- Keep `PLUS_ACCESS_TOKEN` secret in the hosting dashboard.
- Keep private answer data and Plus guides on the backend only.
- Do not deploy only `index.html`, `app.js`, and `styles.css`.
- Use the cloud URL from your host as the public website URL.
