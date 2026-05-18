# Vue 2 → Vue 3 migration

A walkthrough of every change that was needed to take this codebase from Vue 2.6 / Vuetify 2 / Vue CLI to Vue 3.4 / Vuetify 3 / Vite. Roughly ordered from "lowest level" (toolchain) to "highest level" (component templates).

## 1. Dependencies (`package.json`)

| Package              | Before          | After       | Notes                                       |
| -------------------- | --------------- | ----------- | ------------------------------------------- |
| `vue`                | `^2.6.11`       | `^3.4.38`   | Drop `vue-template-compiler` (gone in v3).  |
| `vue-router`         | `^3.2.0`        | `^4.4.5`    | New factory-style API.                      |
| `vuex`               | `^3.4.0`        | `^4.1.0`    | New `createStore` API. Pinia is a follow-up. |
| `vuetify`            | `^2.4.0`        | `^3.7.3`    | Big component API changes — see §6.         |
| `@vue/composition-api` | `^1.1.5`      | —           | Removed; Composition API is built in.       |
| `axios`              | `^0.21.4`       | `^1.7.7`    | Major bump; API unchanged for our usage.    |

**Removed entirely** (Vue CLI + its plugins):
- `@vue/cli-service`, `@vue/cli-plugin-babel`, `@vue/cli-plugin-eslint`, `@vue/cli-plugin-router`, `@vue/cli-plugin-vuex`
- `vue-cli-plugin-vuetify`, `vuetify-loader`
- `babel-eslint`, `vue-template-compiler`
- `babel.config.js`, `vue.config.js`

**Added** (Vite toolchain):
- `vite`, `@vitejs/plugin-vue`, `vite-plugin-vuetify`
- `sass-embedded` (replaces `sass` + `sass-loader`)

**Scripts:**

```diff
- "serve": "vue-cli-service serve",
- "build": "vue-cli-service build",
- "lint": "vue-cli-service lint",
+ "serve": "vite",
+ "dev": "vite",
+ "build": "vite build",
+ "preview": "vite preview",
+ "lint": "eslint --ext .js,.vue --fix src",
```

## 2. Build tool: Vue CLI → Vite

**New `vite.config.js`:**

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import path from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: {
        // Vite only rewrites asset paths inside native tags by default.
        // Tell it to also rewrite `src` on <v-img>.
        transformAssetUrls: { 'v-img': ['src'] }
      }
    }),
    vuetify({ autoImport: true })
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  server: { port: 8080 },
  build: { outDir: 'dist' }
});
```

**`index.html` moves to the repo root** (Vite convention) and must explicitly load the entry script as a module:

```html
<div id="app"></div>
<script type="module" src="/src/main.js"></script>
```

**Env vars:** Vite only exposes vars prefixed with `VITE_` (not `VUE_APP_`) and accesses them via `import.meta.env`, not `process.env`:

```diff
- baseURL: process.env.VUE_APP_AXIOS_BASE_URL,
+ baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
```

Add a `VITE_AXIOS_BASE_URL=...` line to `.env`.

**Output dir stays `dist/`,** so the Heroku static buildpack files (`static.json`, `Procfile`, `nginx.conf.erb`) need no changes.

## 3. App bootstrap (`src/main.js`)

```diff
- import Vue from 'vue';
- import VueCompositionAPI from '@vue/composition-api';
+ import { createApp } from 'vue';
  import App from './App.vue';
  import router from './router/router';
  import store from './store/store';
  import vuetify from './plugins/vuetify';

- Vue.config.productionTip = false;
- Vue.use(VueCompositionAPI);
-
- new Vue({ router, store, vuetify, render: h => h(App) }).$mount('#app');
+ createApp(App).use(router).use(store).use(vuetify).mount('#app');
```

Every `Vue.use(...)` call in the codebase disappears — plugins now register on the app instance via `.use()`.

## 4. Plugins

### Vuetify (`src/plugins/vuetify.js`)

```diff
- import Vue from 'vue';
- import Vuetify from 'vuetify/lib/framework';
- Vue.use(Vuetify);
- export default new Vuetify({
-   theme: { themes: { dark: CustomTheme }, dark: true }
- });
+ import 'vuetify/styles';
+ import { createVuetify } from 'vuetify';
+ export default createVuetify({
+   theme: {
+     defaultTheme: 'dark',
+     themes: {
+       dark: { dark: true, colors: { ...CustomColors } }
+     }
+   }
+ });
```

Two structural differences:
- Theme colors live under `themes.<name>.colors`, not as a flat object.
- `dark: true` moved from top level to the individual theme.

### Vue Router (`src/router/router.js`)

```diff
- import Vue from 'vue';
- import VueRouter from 'vue-router';
- Vue.use(VueRouter);
- const router = new VueRouter({
-   mode: 'history',
-   base: process.env.BASE_URL,
-   routes
- });
+ import { createRouter, createWebHistory } from 'vue-router';
+ const router = createRouter({
+   history: createWebHistory(import.meta.env.BASE_URL),
+   routes
+ });
```

Route definitions themselves (`path`, `name`, `component`, `props`) are unchanged.

### Vuex (`src/store/store.js`)

```diff
- import Vue from 'vue';
- import Vuex from 'vuex';
- Vue.use(Vuex);
- export default new Vuex.Store({ ... });
+ import { createStore } from 'vuex';
+ export default createStore({ ... });
```

State/mutations/actions bodies unchanged.

## 5. Composition API imports

Every file that imported `ref`/`reactive`/`computed`/`watch`/`toRefs` from `@vue/composition-api` now imports from `vue` directly:

```diff
- import { computed, reactive, toRefs, watch } from '@vue/composition-api';
+ import { computed, reactive, toRefs, watch } from 'vue';
```

That's it — the API surface is the same.

## 6. Vuetify 2 → 3 component changes

This was the bulk of the migration. Each subsection below maps a v2 pattern to its v3 equivalent, with the file(s) that needed changing.

### Theme color CSS classes

Vuetify 2 generated class names from the color name directly. Vuetify 3 prefixes them.

| Purpose            | v2                | v3                  |
| ------------------ | ----------------- | ------------------- |
| background color   | `.softball_red`   | `.bg-softball_red`  |
| text color         | `.softball_red--text` | `.text-softball_red` |
| CSS custom prop    | —                 | `rgb(var(--v-theme-softball_red))` |

Every `class: 'softball_red'` in our data-table header configs became `class: 'bg-softball_red'`. (Note that v-data-table in v3 doesn't actually auto-apply the `class` field to `<th>` — see "Table headers" below.)

### `useDisplay()` replaces `$vuetify.breakpoint`

```diff
- :width="$vuetify.breakpoint.smAndUp ? 250 : 175"
+ :width="display.smAndUp.value ? 250 : 175"
```

```diff
+ import { useDisplay } from 'vuetify';
  setup() {
+   const display = useDisplay();
    // ...
+   return { display };
  }
```

### `v-app-bar` — `app` prop removed

```diff
- <v-app-bar app color="black" dark>
+ <v-app-bar color="black">
```

The `app` prop is gone — Vuetify 3's layout system handles bar positioning automatically through `v-layout`/`v-main`. The `dark` prop is also gone (the active theme determines this).

### `v-menu` activator slot

The slot scope shape changed.

```diff
- <template v-slot:activator="{ on, attrs }">
-   <v-chip v-bind="attrs" v-on="on">...</v-chip>
+ <template v-slot:activator="{ props: menuProps }">
+   <v-chip v-bind="menuProps">...</v-chip>
  </template>
```

One `v-bind` covers both the props and listeners.

### `v-list-item-group` removed

In v2 the group component held `v-model` for selection. In v3 there's no equivalent — either use `v-list` selection (`v-model:selected` with `value` per item) or just use `@click` directly. We just used `@click`.

### `v-list-item` flattening

```diff
- <v-list-item @click="...">
-   <v-list-item-content>
-     <v-list-item-title>{{ team.name }}</v-list-item-title>
-   </v-list-item-content>
- </v-list-item>
+ <v-list-item :title="team.name" @click="..." />
```

`v-list-item` now has built-in `title`/`subtitle` props. The `*-content`, `*-title`, `*-subtitle` subcomponents are gone.

### `v-list` props

- `dense` → `density="compact"`
- `shaped` → `rounded` (or omit)

### `v-avatar` inside `v-chip`

Vuetify 3 no longer auto-styles `v-avatar` based on its slot position in a chip. You need to opt in with `start` (or `end`) and set the color explicitly.

```diff
- <v-avatar>
-   <v-icon>mdi-baseball</v-icon>
- </v-avatar>
+ <v-avatar start color="white">
+   <v-icon color="black">mdi-baseball</v-icon>
+ </v-avatar>
```

### `v-chip` API

```diff
- <v-chip color="red" outlined dark medium>
+ <v-chip color="red" variant="outlined" size="default">
```

| v2                 | v3                       |
| ------------------ | ------------------------ |
| `outlined`         | `variant="outlined"`     |
| (default = solid)  | `variant="flat"`         |
| `medium`           | `size="default"`         |
| `small`            | `size="small"`           |
| `dark`             | removed (theme controls) |

Vuetify 3's default `variant` for `v-chip` is `tonal` (faded background), so chips that previously rendered solid need an explicit `variant="flat"`.

### `v-progress-linear` — `:active` prop removed

```diff
- <v-progress-linear :active="isLoading" indeterminate />
+ <v-progress-linear v-if="isLoading" indeterminate />
```

### `v-select` — `item-text` renamed

```diff
- <v-select :items="seasons" item-text="league" item-value="id" outlined />
+ <v-select :items="seasons" item-title="league" item-value="id" variant="outlined" />
```

### `v-tabs-items` → `v-window`

The tab content container was renamed.

```diff
- <v-tabs-items v-model="selectedTab" touchless>
-   <v-tab-item key="season">...</v-tab-item>
-   <v-tab-item key="games">...</v-tab-item>
- </v-tabs-items>
+ <v-window v-model="selectedTab" :touch="false">
+   <v-window-item value="season">...</v-window-item>
+   <v-window-item value="games">...</v-window-item>
+ </v-window>
```

Also: tabs now sync by `value` (matched against `v-window-item value`), not by `key`. Both `<v-tab value="...">` and `<v-window-item value="...">` need matching strings.

### `v-card-title` is no longer flex by default

In v2 the title block was `display: flex`, so an inline vertical divider rendered correctly. In v3 it's a regular block:

```diff
- <v-card-title>
+ <v-card-title class="d-flex align-center">
    {{ title }}
    <v-divider class="mx-4" vertical></v-divider>
    <v-chip>...</v-chip>
  </v-card-title>
```

### `v-data-table` — the biggest single change

**Header object schema:**

| v2          | v3            |
| ----------- | ------------- |
| `text`      | `title`       |
| `value`     | `key`         |
| `class`     | Use `headerProps: { class: '...' }` and/or `cellProps: { class: '...' }`. The top-level `class` field is no longer auto-applied to `<th>`. |

**Sort model shape:**

```diff
- :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
- sortBy: 'playerName',
- sortDesc: false
+ v-model:sort-by="sortBy"
+ sortBy: [{ key: 'playerName', order: 'asc' }]
```

There is no longer a separate `sort-desc` model — the order lives inside each `{key, order}` entry, and the model is an array (even with `:multi-sort="false"`). Any code that read/wrote `sortDesc` needed to be adjusted.

**Slot scope rename:**

```diff
- <template v-slot:body.append="{ headers }">
-   <div v-if="header.text === 'PA'">...</div>
+ <template v-slot:body.append="{ columns }">
+   <div v-if="column.title === 'PA'">...</div>
```

`item.<key>` slots still work the same way.

**Props:**

| v2                    | v3                       |
| --------------------- | ------------------------ |
| `dense`               | `density="compact"`      |
| `disable-pagination`  | `:items-per-page="-1"`   |
| `multi-sort="false"`  | unchanged (default is single-sort) |
| `must-sort`           | unchanged                |
| `hide-default-footer` | unchanged                |
| `fixed-header`        | unchanged                |
| `mobile-breakpoint="0"` | unchanged              |

**Header background color:** because `class` on the header config no longer applies to `<th>`, we used a small unscoped CSS rule in `App.vue` referencing the theme CSS var:

```css
.v-data-table thead th {
  background-color: rgb(var(--v-theme-softball_red)) !important;
}
```

**Body cell classes:** to keep player names on a single row we used `cellProps` on the column:

```js
{ title: 'Player', key: 'playerName', cellProps: { class: 'text-no-wrap' }, ... }
```

### Router guards in components

Component-level `beforeRouteLeave` / `beforeRouteEnter` options work but don't compose well with `setup()`. Use the composables from `vue-router`:

```diff
- export default {
-   setup() { ... },
-   beforeRouteLeave(to, from, next) {
-     from.query.teamLeague = this.currTeamLeague.league;
-     next();
-   }
- };
+ import { onBeforeRouteLeave } from 'vue-router';
+
+ export default {
+   setup() {
+     // ...
+     onBeforeRouteLeave((to, from) => {
+       if (state.currTeamLeague) {
+         from.query.teamLeague = state.currTeamLeague.league;
+       }
+     });
+   }
+ };
```

(Note: the original `beforeRouteLeave` mutated `from.query` directly, which doesn't actually update the URL. Latent bug, ported as-is.)

## 7. Gotchas we hit

A short list of things that bit us during the migration and what they looked like:

- **Missing logo image.** Vite doesn't rewrite asset URLs inside non-native tags (`<v-img src="@/assets/...">`) by default. Fix: add `'v-img': ['src']` to `transformAssetUrls` in the `@vitejs/plugin-vue` config.
- **z-index wars.** We had table sticky cells at 9998/9999 and an inline `z-index: 10001` on `v-app-bar` — both originally needed to outrank each other in v2. In v3, menu/dropdown overlays render at z-index ~2400, so anything above 2400 ends up covering the dropdown. Fix: lower the sticky cells to 2/3 and drop the inline app-bar z-index.
- **Dropdown variant.** Vuetify 3's default `v-chip` variant is `tonal`, not solid. Filled chips from v2 need an explicit `variant="flat"`.
- **Theme color classes don't auto-apply to `<th>`.** The header config's `class` field in v-data-table is ignored for the actual `<th>` element. Use a CSS rule or `headerProps: { class: '...' }` per column.
- **The box-shadow trick for a "card divider" stopped working.** In v2 we faked a horizontal divider with `box-shadow: 0px 3px 0px <color>` on `v-card-subtitle`. In v3 it stopped showing — replaced with an actual `<v-divider>` element below the subtitle.
- **Stale `.eslintrc.js` survived the migration.** The config still extended `@vue/prettier` (gone with the Vue CLI presets) and `plugin:vue/essential` (Vue 2 ruleset), and set `parserOptions.parser: 'babel-eslint'` (package no longer in `devDependencies`). `npm run lint` errored with "couldn't find the config '@vue/prettier'". Fix: extend `plugin:vue/vue3-essential` + `plugin:prettier/recommended` (which uses `eslint-config-prettier` + `eslint-plugin-prettier`, both already installed), drop the `babel-eslint` parser line, and set `parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }` so ESLint accepts modern JS (it defaults to ES5). Two rule overrides were also needed once the Vue 3 ruleset started firing: `vue/valid-v-slot` with `{ allowModifiers: true }` for Vuetify 3's dotted slot names (`body.append`, `item.<column>`), and `vue/multi-word-component-names` with `{ ignores: ['Home'] }` for the single-word view name.

## 8. Files touched

| File                                       | What changed                                       |
| ------------------------------------------ | -------------------------------------------------- |
| `package.json`                             | Deps + scripts                                     |
| `vite.config.js` (new)                     | Replaces `vue.config.js`                           |
| `index.html` (moved to repo root)          | Vite entry convention                              |
| `babel.config.js`, `vue.config.js`         | Deleted                                            |
| `.env`                                     | Added `VITE_AXIOS_BASE_URL`                        |
| `src/main.js`                              | `createApp`                                        |
| `src/plugins/vuetify.js`                   | `createVuetify`, new theme shape                   |
| `src/router/router.js`                     | `createRouter` + `createWebHistory`                |
| `src/store/store.js`                       | `createStore`                                      |
| `src/services/ApiService.js`               | `import.meta.env`                                  |
| `src/App.vue`                              | App bar, menu, list, avatar, progress bar, display composable, header CSS rule |
| `src/views/Home.vue`                       | Composition-api import only                        |
| `src/views/TeamLeagueSummary.vue`          | `v-window`, `v-select` item-title, `onBeforeRouteLeave` |
| `src/views/GameSummary.vue`                | Composition-api import; dropped unused route guard |
| `src/components/StatLineTable.vue`         | Data-table v3 schema + slot + sort model           |
| `src/components/GameSummaryTable.vue`      | Data-table v3 schema + sort model                  |
| `src/components/TitleCard.vue`             | Flex title, chip variant/size, real `<v-divider>`  |
| `src/components/SectionHeader.vue`         | Chip variant                                       |
| `src/utils/constants.js`                   | Header schema (`text`→`title`, `value`→`key`)      |
| `.eslintrc.js`                             | Vue-CLI-era extends + `babel-eslint` swapped for Vue 3 / Prettier equivalents; added `v-slot` + component-name rule overrides |

## 9. Suggested follow-ups

These are not blockers, but worth doing when there's appetite:

- **Replace Vuex with Pinia.** The current store holds a single boolean; the migration is trivial and Vuex 4 is in maintenance mode in favor of Pinia.
- **Convert `setup()` functions to `<script setup>`.** Less boilerplate, no `return` block, better TS support if you ever add types.
- **Address two latent bugs found during migration:**
  - `TeamLeagueSummary.vue`: `tL.league = props.teamLeague` is an assignment, not a comparison (probably meant `===`).
  - `TeamLeagueSummary.vue`: the `beforeRouteLeave` hook mutates `from.query` directly, which has no effect on the URL.
- **Bundle MDI icons via npm** (`@mdi/font`) instead of the jsdelivr CDN in `index.html` — removes a third-party runtime dependency.
