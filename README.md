# Highland Review Site

Browse, filter, sort, and compare independent reviews of Highland single malt Scotch whiskies.

## What it is

A static single-page application built to explore a curated dataset of Highland whisky tasting notes and scores. All data is baked in at build time — there is no backend, no API, and no authentication. The app lets you filter by flavour profile and price band, sort by score, price, or age, and drill into individual whisky detail views.

## Tech stack

- Vite + React 18 + TypeScript (strict)
- vitest + Testing Library for unit and component tests
- mikey-pro — canonical ESLint flat config, Prettier, Stylelint

## Getting started

```bash
npm install
```

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck then produce a production build |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the vitest test suite |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |

## Project structure

```text
src/
  main.tsx              React entry point
  App.tsx               Top-level app shell
  types.ts              Shared domain types (Whisky, TastingNotes, FlavourTag, PriceBand)
  data/
    whiskies.ts         Static curated dataset
  lib/
    filter.ts           Filter logic
    filter.test.ts      Filter tests
    sort.ts             Sort logic
    sort.test.ts        Sort tests
  components/
    FilterBar.tsx       Flavour and price-band filter controls
    WhiskyCard.tsx      Card view for a single whisky
    WhiskyDetail.tsx    Expanded detail view
  index.css             Global styles
  test/
    setup.ts            vitest / Testing Library setup
docs/
  cicd-github-mirror.md Remote topology and CI/CD documentation
```

## Data model

The dataset in `src/data/whiskies.ts` is a static array of `Whisky` objects typed against `src/types.ts`. There is no backend and no API keys required. The core domain types — `Whisky`, `TastingNotes`, `FlavourTag`, and `PriceBand` — define the stable contract that the dataset, library logic, and components all build against.

## Repository / remote

The intended topology: `git@git.wolfe.tools` (self-hosted Gitea) is the authoritative remote; `github.com/chiefmikey/highland-review-site` is a read-only public mirror auto-synced by a Gitea Actions workflow. Pushes go once to wolfe.tools — never directly to GitHub. See `docs/cicd-github-mirror.md` for details.

Current state: the repo is local-only. Neither the Gitea remote nor the GitHub mirror has been wired yet.
