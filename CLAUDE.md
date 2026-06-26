# Highland Review Site — Claude Code Instructions

## Overview

Static Vite + React 18 + TypeScript SPA for browsing, filtering, sorting, and comparing independent reviews of Highland single malt Scotch whiskies. All data is a curated static dataset baked into the bundle at build time. No backend, no API keys, no secrets in this repo.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | `tsc && vite build` — typecheck then produce production bundle |
| `npm run preview` | Serve the production build locally |
| `npm test` | `vitest run` — run the full test suite |
| `npm run lint` | `eslint .` via mikey-pro flat config |
| `npm run format` | `prettier --write .` via mikey-pro Prettier config |

Always run `npm run lint` and `npm run format` after editing any source file. Run `npm run build` before claiming a change is done — it catches type errors the dev server does not surface.

## Architecture / structure

```text
src/
  types.ts          Central data contract — Whisky, TastingNotes, FlavourTag, PriceBand
  data/whiskies.ts  Static curated dataset (array of Whisky)
  lib/              Pure filter + sort logic, each with colocated *.test.ts
  components/       Presentational React components (FilterBar, WhiskyCard, WhiskyDetail)
  main.tsx          React entry point
  App.tsx           Top-level shell — wires filter bar, list, detail
  index.css         Global styles
  test/setup.ts     vitest + Testing Library global setup
```

`src/types.ts` is the single authoritative data contract. Every layer — the dataset, the library functions, and the components — is typed against the shapes defined there. If you change a type, trace the impact through all three layers before committing.

`src/data/whiskies.ts` is the only place data is defined. Adding or editing whiskies means editing this file. The dataset imports types from `src/types.ts`; this is the one documented exception to the `import-x/no-relative-parent-imports` lint rule (the import goes up one level from `data/` to `src/`).

`src/lib/` contains pure functions with no React dependencies. Filter and sort logic lives here, not in components. Tests are colocated: `filter.test.ts` next to `filter.ts`, `sort.test.ts` next to `sort.ts`.

`src/components/` are presentational. They receive props typed against `src/types.ts` and render UI. No data fetching, no side effects beyond event handlers.

## Conventions

- **Lint and format:** mikey-pro is the canonical stack (`@mikey-pro/eslint-config-react`, `mikey-pro/prettier`, `mikey-pro/stylelint`). Run both tools after every edit — CI will catch violations if you do not.
- **TypeScript:** strict mode. No `any`, no type assertions without a comment explaining why.
- **Imports:** `import-x/no-relative-parent-imports` is enforced. The only permitted exception is `data/whiskies.ts` importing from `../types.ts`. Keep all other imports sibling-level or absolute.
- **Tests:** colocated `*.test.ts` files, not a separate `__tests__` directory. Tests for lib logic live in `src/lib/`. Component tests use Testing Library via `src/test/setup.ts`.
- **No backend, no secrets:** this repo contains only static data and UI code. Never add API keys, tokens, or backend endpoints.

## Testing

Run `npm test` (vitest). When you change `lib/filter.ts` or `lib/sort.ts`, extend or add tests in the colocated test file. Verify the full build with `npm run build` — it runs the TypeScript compiler before bundling, so type errors that pass `tsc --noEmit` are still caught here.

## Git / remote

The intended authoritative remote is `git@git.wolfe.tools` (self-hosted Gitea). `github.com/chiefmikey/highland-review-site` is a read-only public mirror auto-synced by a Gitea Actions workflow — never push to GitHub directly, push once to wolfe.tools. See `docs/cicd-github-mirror.md` for the full topology and workflow details.

Current state: local-only. Neither the Gitea remote nor the GitHub mirror is wired yet.

Commit conventions: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`. Atomic commits — one logical change per commit. No AI attribution in commit messages.
