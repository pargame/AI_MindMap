# AI MindMap — Architecture

A client-only React + Vite SPA that renders an SVG mindmap and calls OpenAI APIs directly from the browser (with a user-provided key). Deployed as a static site via GitHub Pages.

## Overview
- Frontend: React 18 + TypeScript + Vite
- Data: In-memory mindmap nodes/edges, persisted to localStorage; API key in sessionStorage
- AI: OpenAI Chat Completions API (model configurable; default gpt-4o-mini)
- Hosting: GitHub Pages via Actions (static export from `web/dist`)

## Key files
- `web/src/App.tsx` — UI, OpenAI calls, mindmap graph state
- `web/vite.config.ts` — base path for GitHub Pages
- `.github/workflows/deploy.yml` — build and deploy pipeline
- `README.md` — local dev and usage
- `handbook/*` — project docs (this folder)

## Data flow
1) User enters topic/template → clicks Generate
2) If no API key: demo/fake nodes are generated
3) If API key present: request to OpenAI → parse response → add nodes/edges
4) State persisted to localStorage; API key kept in sessionStorage

## Deploy
- Push to `main` → GitHub Actions builds `web` and deploys `web/dist` to Pages
- Vite `base` is `/AI_MindMap/` so assets resolve correctly under the repo subpath
