# Maintenance Policy

## Language
- UI: Korean
- Code/identifiers: English
- Internal docs (handbook): English

## Git rules
- Stage-all → commit → push (`git add -A && git commit -m "..." && git push`)
- Ignore build artifacts and local files (`web/dist/`, `node_modules/`, `.DS_Store`, logs)

## Quality gates
- Build: `npm run build --prefix web` should succeed
- Pages: deployment green in Actions; site loads under `/AI_MindMap/`
- Lint/Type: TypeScript errors are zero in `web/src/*`

## Version/meta
- CI writes `dist/meta.json` with `{ version, commit }` and drops `.nojekyll`
- Footer can show version/commit (optional)

## OpenAI usage
- Default model: `gpt-4o-mini`
- For 429 quota errors: reduce `max_tokens`, or set Organization/Project headers to route to a funded workspace
- Never embed secrets in the repo; key is entered by the user and stored in sessionStorage only
