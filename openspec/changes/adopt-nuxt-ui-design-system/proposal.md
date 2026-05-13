## Why

The project currently uses raw Tailwind CSS classes duplicated across every component, with hand-crafted form inputs, cards, navigation, and dark-mode toggle. Adopting Nuxt UI as the design system replaces this bespoke layer with a cohesive, accessible component library that ships with dark mode, color mode management, and Tailwind v4 integration out of the box — reducing maintenance surface and improving consistency.

## What Changes

- Install `@nuxt/ui` (v4.7.1) and register it in `nuxt.config.ts`; remove the `@tailwindcss/vite` vite plugin (Tailwind CSS itself is retained as a peer dependency but managed via the CSS layer)
- Replace the custom `ThemeToggle.vue` component with Nuxt UI's built-in `UColorModeButton`
- Replace the manual dark-mode `useTheme` composable and `initTheme()` call with Nuxt UI's color mode system
- Migrate `NavigationBar.vue` icon-link buttons to `UButton` with icon support
- Migrate the default layout header to use Nuxt UI layout primitives (`UApp` / `UHeader` / `UMain`)
- Migrate all 7 investment input components (`AmountInput`, `IndexCdbInput`, `IndexDiInput`, `IndexLcxInput`, `IndexSelicInput`, `PeriodInput`, `PeriodTypeInput`) from bare `<input>` + manual label/error markup to `UFormField` + `UInput`
- Migrate the `InvestmentInput` container card from manual `bg-white dark:bg-gray-800 rounded-lg shadow-md` markup to `UCard`
- Migrate `InvestmentResult.vue` to use `UCard` for structure, `UProgress` for the profitability bar, and `UBadge` for the percentage pill
- Migrate `ContentGradientBox.vue` to a minimal wrapper (or `UAlert`) that preserves its gradient highlight role
- Update `app/assets/css/main.css` to add `@import "tailwindcss"; @import "@nuxt/ui";` at the top; add `css: ['~/assets/css/main.css']` to `nuxt.config.ts`

## Capabilities

### New Capabilities

- `nuxt-ui-setup`: Install and configure `@nuxt/ui` v4.7.1; remove `@tailwindcss/vite` plugin; set up CSS imports; establish color mode strategy
- `layout-ui`: Migrate the default layout header, site navigation links, and color-mode toggle to Nuxt UI components
- `form-ui`: Migrate all investment input form fields to `UFormField` + `UInput`, eliminating duplicated label/error/icon markup
- `result-card-ui`: Migrate `InvestmentResult.vue` to `UCard` + `UProgress` + `UBadge`, and `InvestmentInput` container to `UCard`

### Modified Capabilities

## Impact

- `nuxt.config.ts` — add `@nuxt/ui` module, add `css` array entry, remove `@tailwindcss/vite` vite plugin import
- `package.json` — add `@nuxt/ui` (v4.7.1); retain `tailwindcss` as a peer dependency
- `app/layouts/default.vue` — simplified header markup using Nuxt UI layout components
- `app/components/ThemeToggle.vue` — deleted; replaced by `UColorModeButton`
- `app/components/NavigationBar.vue` — refactored to use `UButton`
- `app/components/investment/*.vue` (7 files) — migrated to `UFormField` + `UInput`
- `app/components/InvestmentInput.vue` — migrated container card to `UCard`
- `app/components/InvestmentResult.vue` — migrated to `UCard`, `UProgress`, `UBadge`
- `app/components/ContentGradientBox.vue` — simplified or migrated
- `app/composables/useTheme.ts` (if exists) — deleted; color mode delegated to Nuxt UI
- `app/assets/css/main.css` — prepend `@import "tailwindcss"; @import "@nuxt/ui";`; trim project-specific overrides
