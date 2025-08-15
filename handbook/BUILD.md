# Build & Deploy

## Prerequisites
- Node.js 20+

## Install & Dev
```bash
npm install --prefix web
npm run dev --prefix web
```

## Build
```bash
npm run build --prefix web
```
Outputs: `web/dist/`

## Deploy (CI)
- GitHub Actions: `.github/workflows/deploy.yml`
  - checkout → setup node → npm ci (web) → build → configure pages → upload → deploy
- `.nojekyll` recommended to disable Jekyll on Pages (we add it automatically in CI)

## Troubleshooting
- 404 on Pages: Ensure `base: '/AI_MindMap/'` in `web/vite.config.ts`
- Assets not loading: clean cache or verify `dist` contains hashed assets
- API errors: see in-app alerts (status + message). 429 usually means quota exceeded.
