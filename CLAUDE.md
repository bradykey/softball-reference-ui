# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run serve      # Dev server with HMR
npm run build      # Production build
npm run lint       # Lint and auto-fix
npm run heroku-deploy  # Deploy (git push heroku master)
```

No test framework is configured.

## Architecture

A read-only softball statistics dashboard. The frontend calls a backend API at `VUE_APP_AXIOS_BASE_URL` (defaults to `https://softball-reference-api.herokuapp.com`) to display team/player stats and game summaries.

**Stack:** Vue 2 + Vuex 3 + Vue Router 3 + Vuetify 2 + Composition API plugin + Axios

### Key files

- `src/services/ApiService.js` — singleton Axios wrapper; all API calls go through here
- `src/store/store.js` — minimal Vuex store with a single `isLoading` boolean
- `src/composables/useLoadingBar.js` — composable that toggles `isLoading` via Vuex; used in both views and the router
- `src/router/router.js` — three routes (Home → redirect, `/teams/:teamName`, `/games/:gameId`); route key bound to `$route.fullPath` to force re-render on param changes; global guards show loading bar
- `src/utils/constants.js` — column definitions for the stats tables
- `src/utils/utils.js` — data-flattening and validation helpers used by views

### Data flow

1. `App.vue` fetches all teams on mount and renders a top-nav team dropdown.
2. `TeamLeagueSummary.vue` (view) watches the selected season, then fetches stat lines and games via `ApiService`.
3. `GameSummary.vue` (view) fetches a single game by ID.
4. Views pass data down to dumb display components (`StatLineTable`, `GameSummaryTable`, `TitleCard`, `SectionHeader`).

### Patterns

- Views use Vue Composition API (`setup()` with `reactive`/`computed`/`watch`).
- Import alias `@` maps to `src/`.
- Vuetify theme colors are defined in `src/plugins/vuetify/theme.js` (e.g. `softball_red`, `softball_yellow`).
- ESLint + Prettier enforce style; Prettier config is in `.prettierrc.js` (single quotes, 2-space indent, no trailing commas).
