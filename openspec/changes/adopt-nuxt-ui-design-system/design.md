## Context

The project is a static Nuxt 4 SPA (SSR disabled) that calculates fixed-income investment returns. It currently uses raw Tailwind CSS v4 applied via the `@tailwindcss/vite` Vite plugin, with all styling written inline as Tailwind utility classes. There is no component library; every interactive UI element — inputs, labels, error messages, cards, navigation buttons, the dark-mode toggle — is hand-crafted.

The custom `useTheme` composable manually persists a preference to `localStorage`, patches `document.documentElement`, and listens to `prefers-color-scheme` media queries. This logic duplicates what Nuxt UI's color-mode system provides out of the box.

**Current dependencies:** `nuxt ^4`, `tailwindcss ^4`, `@pinia/nuxt`, `nuxt-schema-org`, `@nuxt/eslint`.

## Goals / Non-Goals

**Goals:**
- Install `@nuxt/ui` (v4.7.1) as the Nuxt module and manage Tailwind CSS via its CSS layer
- Remove the standalone `@tailwindcss/vite` vite plugin (retain `tailwindcss` as a peer dependency)
- Add CSS imports `@import "tailwindcss"; @import "@nuxt/ui";` to `main.css` and register it via `css` in `nuxt.config.ts`
- Replace the custom `useTheme` composable and `ThemeToggle.vue` with Nuxt UI's color mode primitives
- Migrate every hand-crafted form field to `UFormField` + `UInput`
- Migrate card containers (`InvestmentInput`, `InvestmentResult`) to `UCard`
- Migrate the navigation icon-buttons to `UButton` with icon support
- Migrate the progress bar in `InvestmentResult` to `UProgress` and the tax-rate badge to `UBadge`
- Migrate the default layout header to Nuxt UI layout primitives (`UApp` / `UHeader` / `UMain`)
- Retain all existing behavior, accessibility attributes, and visual structure

**Non-Goals:**
- Changing any financial calculation logic in `app/src/`
- Changing Pinia store shapes or API
- Adding new features or pages
- Redesigning the visual aesthetic (colors, spacing intent stays the same)
- Replacing `ion-icon` web components (they remain as decorative icons within `UButton` slots)

## Decisions

### D1 — Use `@nuxt/ui` v4.7.1 (latest stable)

**Decision:** Install `@nuxt/ui` at the latest stable version (`4.7.1`), which supports Nuxt 4 and manages Tailwind CSS v4 via a CSS layer import.

**Rationale:** v4.7.1 is the latest published release of `@nuxt/ui`. It targets Nuxt 4 compatibility, ships Tailwind CSS v4 integration via `@import "@nuxt/ui"` in the project's CSS file, and lists `tailwindcss ^4.0.0` as a peer dependency. This means `tailwindcss` remains in `package.json` but the `@tailwindcss/vite` Vite plugin is no longer needed (Nuxt UI handles the processing pipeline).

**Alternative considered:** Pin to the v3 series (v3.3.0) — rejected because the project should adopt the current latest to avoid a second migration and because v4 is what the docs recommend for new installations.

---

### D2 — Delete `useTheme` composable; delegate color mode to Nuxt UI

**Decision:** Remove `app/composables/useTheme.ts` and `app/components/ThemeToggle.vue`. Replace usages with `useColorMode()` (Nuxt UI re-exports this) and `UColorModeButton`.

**Rationale:** The existing composable manually toggles `.dark` on `<html>` and persists to localStorage. Nuxt UI's `@nuxt/color-mode` module, which is a peer dependency of Nuxt UI, does exactly the same with SSR-safe hydration and a richer API. Keeping both causes race conditions on class application.

**Migration impact:** `app/layouts/default.vue` calls `initTheme()` in `onMounted` — this call and the import are deleted. The `UApp` wrapper handles the initial class application.

---

### D3 — Migrate form inputs to `UFormField` + `UInput`; keep Pinia store bindings unchanged

**Decision:** Each of the 7 investment input components swaps its `<label>`, `<input>`, and error `<p>` for `<UFormField :error="...">` + `<UInput v-model="...">`. The computed `store` bindings (`get/set`) remain identical.

**Rationale:** `UFormField` renders the label and inline error automatically from props, eliminating 15–20 lines of boilerplate per component. `UInput` accepts a `leading-icon` prop to replace the absolute-positioned `ion-icon` workaround.

**Trade-off:** `UInput` does not natively render Ionicons web components as leading icons (it expects a Heroicons name string or a component). For icons, we either (a) use the `#leading` slot with `<ion-icon>` or (b) switch to a Heroicons equivalent. Decision: use the `#leading` slot to preserve Ionicons; no icon library change needed.

---

### D4 — Migrate `InvestmentResult` to `UCard` + `UProgress` + `UBadge`

**Decision:** Replace the fully custom card markup in `InvestmentResult.vue` with Nuxt UI primitives. The gradient header becomes a `UCard` header slot with a Tailwind gradient utility. `UProgress` replaces the custom `div` progress bar. `UBadge` replaces the tax-percentage pill.

**Rationale:** Reduces ~150 lines of custom markup to ~60 lines. `UProgress` and `UBadge` handle dark-mode color tokens automatically.

**Trade-off:** `UCard` has an opinionated padding structure; slight padding adjustments via the `class`/`ui` override prop may be needed to match current spacing.

---

### D5 — Migrate layout to `UApp` + `UHeader` + `UMain`

**Decision:** Restructure `app/layouts/default.vue` to use `<UApp>` as the root, `<UHeader>` for the sticky site header, and `<UMain>` for the page content wrapper. The logo, title, and `<NavigationBar />` map to `UHeader`'s `#title`, `#left`, and `#right` slots respectively. `<NuxtPage />` lives inside `<UMain>`.

**Rationale:** `UApp` is the required root wrapper for Nuxt UI's color-mode system (D2). `UHeader` provides sticky behavior, shadow, and responsive mobile menu via its `#body` slot. `UMain` applies appropriate padding and max-width constraints, replacing the manual `<main class="max-w-7xl mx-auto px-4 …">` wrapper.

**Non-goal:** Keep `UHeader`'s named slots for the logo + title + nav bar to avoid breaking the existing mobile responsive behavior.

---

### D6 — Retain `tailwindcss` as explicit dependency; remove only `@tailwindcss/vite`

**Decision:** Keep `tailwindcss` in `package.json` (it is a required peer dep of `@nuxt/ui`). Remove `@tailwindcss/vite` and its import from `nuxt.config.ts`. Activate Tailwind by adding `@import "tailwindcss"; @import "@nuxt/ui";` at the top of `app/assets/css/main.css`, and register that file via `css: ['~/assets/css/main.css']` in `nuxt.config.ts`.

**Rationale:** Nuxt UI v4 explicitly requires `tailwindcss ^4.0.0` as a peer dependency and uses the CSS `@import` mechanism (not a Vite plugin) to inject Tailwind utilities. Removing `tailwindcss` entirely would break the Nuxt UI installation.

## Risks / Trade-offs

- **[Risk] Nuxt UI v4 breaking changes** — v4 is a major version with API changes from v3; since the project has no existing v3 usage, this is not a migration concern but peer dep compatibility should be verified (`nuxt ^4.4.4` must satisfy `@nuxt/ui` v4 requirements). → Mitigation: run `pnpm add @nuxt/ui` and confirm no peer dep errors before proceeding.

- **[Risk] Visual regressions in `UCard` padding** — Nuxt UI components apply their own spacing; the resulting layout may differ slightly from the current 6-unit padding. → Mitigation: review visually after migration; use the `ui` override prop to restore spacing if needed.

- **[Risk] `UColorModeButton` uses system-mode cycling** (light → dark → system) vs current two-state toggle (light ↔ dark). → Mitigation: replace with a simple `UButton` that calls `colorMode.preference = isDark ? 'light' : 'dark'` to preserve two-state behavior if cycling is undesirable.

- **[Risk] `UHeader` opinionated structure may conflict with existing logo + nav layout** → Mitigation: use `UHeader`'s named slots; fall back to a plain `<div class="sticky top-0 …">` wrapper with `<UApp>` only if layout conflicts arise.

- **[Risk] `ion-icon` in `UButton` slot** — web component rendering inside a button slot should work, but slot hydration order could cause a flash. → Mitigation: add a fixed `width`/`height` on the `ion-icon` to prevent layout shift.

## Migration Plan

1. Install `@nuxt/ui` (`pnpm add @nuxt/ui`); verify peer dep resolution; remove `@tailwindcss/vite` (`pnpm remove @tailwindcss/vite`)
2. Register `@nuxt/ui` module in `nuxt.config.ts`; add `css: ['~/assets/css/main.css']`; remove vite tailwind plugin import and block
3. Add `@import "tailwindcss"; @import "@nuxt/ui";` at the top of `app/assets/css/main.css`
4. Wrap layout in `<UApp>`, replace header markup with `<UHeader>`, replace `<main>` with `<UMain>`
5. Delete `app/composables/useTheme.ts`, delete `app/components/ThemeToggle.vue`, remove all imports
6. Migrate `NavigationBar.vue` to `UButton`
7. Migrate all 7 input components to `UFormField` + `UInput`
8. Migrate `InvestmentInput.vue` wrapper card to `UCard`
9. Migrate `InvestmentResult.vue` to `UCard` + `UProgress` (`:model-value`) + `UBadge`
10. Simplify `ContentGradientBox.vue` (retain gradient utility, remove manual shadow/rounding that UCard already provides in context)
11. Run `pnpm lint:fix`, then `pnpm test`, then `pnpm generate` to verify CI passes

**Rollback strategy:** All changes are in a single branch. Reverting the branch restores the original state. No data migrations or backend changes are involved.
