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

GitHub Actions workflows live in `.github/workflows/`:

- `ci.yml` — runs `npm ci`, `npm run lint`, `npm run build` on every PR targeting `main`. Pure gate; no deploy.
- `deploy.yml` — runs on push to `main` and manual `workflow_dispatch`. First job re-runs lint+build; second job enters the `production` GitHub environment (required-reviewer approval gate) and `git push`es to the Heroku remote at `git.heroku.com/softball-reference.git`. Note that the push target on Heroku is still `master` — Heroku's deploy branch is independent of GitHub's branch name.

Requires:
- Repo secret `HEROKU_API_KEY` — generate with `heroku authorizations:create --description "GitHub Actions deploy" --scope write` and use the printed `Token` value. Do **not** use `heroku auth:token`; that returns the CLI session token, which rotates on every `heroku login` and will silently break deploys. Authorizations are independent of your local session and can be listed/revoked with `heroku authorizations` / `heroku authorizations:revoke <id>`. Ideally scope the secret to the `production` environment so PR-triggered workflows can't read it.
- Repo variable `HEROKU_EMAIL` (under Settings → Secrets and variables → Actions → **Variables** tab, not Secrets) — the email of the Heroku account that owns the app. Heroku's git endpoint authenticates via HTTP Basic where the username **must be a real account email**; literal usernames like `heroku` or `apikey` are rejected with "Couldn't find that user."
- `production` environment configured under repo Settings → Environments with required reviewers.

`npm run heroku-deploy` (`git push heroku main:master`) is still the manual escape hatch — run it from an up-to-date local `main` to deploy out-of-band.

## Migration reference

See `vue2-to-vue3-migration.md` for the full Vue 2 → 3 / Vuetify 2 → 3 / Vue CLI → Vite delta, including gotchas (asset URLs in `v-img`, z-index changes for overlays, default `v-chip` variant, table header classes) and two latent bugs noted but not fixed (`tL.league = props.teamLeague` should be a comparison; `onBeforeRouteLeave` mutating `from.query` has no effect on the URL).
