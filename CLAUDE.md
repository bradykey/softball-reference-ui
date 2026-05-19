# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run serve      # Dev server (Vite, port 8080); `npm run dev` is an alias
npm run build      # Production build → dist/
npm run preview    # Serve the built dist/ locally
npm run lint       # eslint --fix over src/**/*.{js,vue}
npm run heroku-deploy  # git push heroku master
```

No test framework is configured.

## Architecture

A read-only softball statistics dashboard. The frontend calls a backend API at `VITE_AXIOS_BASE_URL` (defaults to `https://softball-reference-api.herokuapp.com`) to display team/player stats and game summaries.

**Stack:** Vue 3.4 + Vuex 4 + Vue Router 4 + Vuetify 3 + Axios, built with Vite 5 (`@vitejs/plugin-vue`, `vite-plugin-vuetify`).

### Env vars

Env vars use the `VITE_` prefix and are read via `import.meta.env` (not `process.env` / `VUE_APP_`). The API base URL is `VITE_AXIOS_BASE_URL`, consumed in `src/services/ApiService.js`.

### Key files

- `vite.config.js` — `@` alias to `src/`, dev port 8080, and a `transformAssetUrls` rule for `v-img` so Vite rewrites `@/assets/...` paths inside that non-native tag
- `src/services/ApiService.js` — singleton Axios wrapper; all API calls go through here
- `src/store/store.js` — minimal Vuex store with a single `isLoading` boolean (`createStore`)
- `src/composables/useLoadingBar.js` — composable that toggles `isLoading` via Vuex; used in both views and the router
- `src/router/router.js` — `createRouter` + `createWebHistory`; three routes (Home → redirect, `/teams/:teamName`, `/games/:gameId`); route key bound to `$route.fullPath` to force re-render on param changes; global guards show loading bar
- `src/plugins/vuetify.js` — `createVuetify` factory; theme colors under `themes.dark.colors`
- `src/utils/constants.js` — column definitions for the stats tables
- `src/utils/utils.js` — data-flattening and validation helpers used by views

### Data flow

1. `App.vue` fetches all teams on mount and renders a top-nav team dropdown.
2. `TeamLeagueSummary.vue` (view) watches the selected season, then fetches stat lines and games via `ApiService`.
3. `GameSummary.vue` (view) fetches a single game by ID.
4. Views pass data down to dumb display components (`StatLineTable`, `GameSummaryTable`, `TitleCard`, `SectionHeader`).

### Patterns

- Views use the Composition API via `setup()` with `reactive`/`computed`/`watch`/`toRefs` imported from `vue` directly. `<script setup>` is not used yet.
- In-view route guards use the `onBeforeRouteLeave` composable from `vue-router`, not the component option.
- Import alias `@` maps to `src/`.
- Vuetify theme colors live under `themes.<name>.colors` in `src/plugins/vuetify.js`. Generated CSS classes are prefixed: `bg-softball_red` for background, `text-softball_red` for text. Header `class` strings (e.g. in `src/utils/constants.js` and `src/components/GameSummaryTable.vue`) already follow this convention.
- `v-data-table` header schema is `{ title, key }` (not `{ text, value }`). The top-level `class` on a header object is **not** applied to `<th>` — header background color is set by an unscoped CSS rule in `App.vue` against `rgb(var(--v-theme-softball_red))`. The sort model is an array of `{ key, order }` objects (see `src/components/GameSummaryTable.vue:106`).
- ESLint + Prettier enforce style; configs are `.eslintrc.js` and `.prettierrc.js` (single quotes, 2-space indent, no trailing commas).

## CI / Deploy

CI lives in `.github/workflows/ci.yml`: `npm ci` → `npm run lint` → `npm run build`, run on every PR targeting `main` *and* on every push to `main`. The PR run is what branch protection gates merges on; the push-to-`main` run is what Heroku's "Wait for GitHub checks to pass" gates the deploy on.

Deploys themselves are handled by **Heroku's native GitHub integration** (Heroku Dashboard → app → Deploy tab → "App connected to GitHub" + "Automatic deploys" enabled on `main` with "Wait for GitHub checks to pass" checked). On push to `main`, Heroku pulls the source tarball from GitHub, waits for the `verify` check, then runs the Node + nginx buildpacks server-side.

Why not a GitHub Actions deploy workflow: Heroku's new `HRKU-`-prefixed tokens (Identity Service format) don't authenticate to `git.heroku.com` at all via username/password — Heroku explicitly returns "Do not authenticate with username and password using git." The only supported auth for `git.heroku.com` is what `heroku login` sets up locally via a browser OAuth flow, which can't be replicated in CI. The remaining CI-friendly option is Heroku's Platform API (`/sources` + `/apps/<app>/builds` via Bearer auth) — works, but it's substantially more YAML for the same outcome Heroku's built-in GitHub integration already provides.

`npm run heroku-deploy` (`git push heroku main:master`) still works locally because `heroku login` sets up the OAuth credentials git needs — useful as an out-of-band manual deploy.

## Migration reference

See `vue2-to-vue3-migration.md` for the full Vue 2 → 3 / Vuetify 2 → 3 / Vue CLI → Vite delta, including gotchas (asset URLs in `v-img`, z-index changes for overlays, default `v-chip` variant, table header classes) and two latent bugs noted but not fixed (`tL.league = props.teamLeague` should be a comparison; `onBeforeRouteLeave` mutating `from.query` has no effect on the URL).
