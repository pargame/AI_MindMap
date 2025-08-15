# Contributing / Workflow

This summarizes how to contribute to AI MindMap.

## Quick start
- Prereq: Node 20+
- Install: `npm install --prefix web`
- Dev: `npm run dev --prefix web`
- Build: `npm run build --prefix web`

## Workflow
1) Make changes under `web/src/**` or docs under `handbook/**`.
2) Optional local build to verify.
3) Stage/commit/push to `main`:
   - `git add -A && git commit -m "feat: ..." && git push`
4) GitHub Pages auto-deploys via `.github/workflows/deploy.yml`.

## Code guide
- UI logic: `web/src/App.tsx`
- Entry/HTML: `web/index.html`
- Vite base path: `web/vite.config.ts` (GitHub Pages subpath)
- Keep changes small and focused; prefer TypeScript safety and simple state.

## AI providers
- OpenAI: default model `gpt-4o-mini`; Org/Project headers optional.
- Gemini: default model `gemini-1.5-flash`; tokens mapped via `generationConfig.maxOutputTokens`.
- Keys are never stored server-side; only in sessionStorage.

## Security
- Never commit API keys or secrets.
- Client-only app: remind users to avoid sharing personal keys publicly.

## Deployment
- CI writes `meta.json` and `.nojekyll` into `web/dist/` and deploys to Pages.
- Footer shows `version` and short commit.

## Issues / enhancements
- Ideas welcome: UI polish, export formats, better parsing of AI output, tests.
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.
