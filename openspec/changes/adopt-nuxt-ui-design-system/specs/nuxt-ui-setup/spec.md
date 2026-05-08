## ADDED Requirements

### Requirement: Nuxt UI module is installed and registered
The project SHALL depend on `@nuxt/ui` v4 (latest stable, currently `4.7.1`) listed in `package.json` dependencies. The `tailwindcss` package SHALL remain in `package.json` as a required peer dependency. The `@nuxt/ui` module SHALL be registered in `nuxt.config.ts` modules array. The `@tailwindcss/vite` vite plugin SHALL be removed from `nuxt.config.ts` and from `package.json`. The `nuxt.config.ts` SHALL include a `css: ['~/assets/css/main.css']` entry to register the CSS file with Nuxt.

#### Scenario: Module resolves at dev and build time
- **WHEN** `pnpm dev` or `pnpm generate` is executed
- **THEN** the Nuxt build completes without missing-module errors and Nuxt UI components are auto-imported

#### Scenario: Tailwind utilities remain available
- **WHEN** a template uses a Tailwind utility class (e.g., `text-gray-900`, `rounded-lg`)
- **THEN** the class is present in the generated CSS with no manual Tailwind configuration required

### Requirement: CSS file includes Nuxt UI and Tailwind imports
The `app/assets/css/main.css` file SHALL begin with `@import "tailwindcss";` followed by `@import "@nuxt/ui";` before any project-specific CSS. These imports activate Tailwind utility classes and Nuxt UI's component styles globally.

#### Scenario: Tailwind and Nuxt UI styles are loaded
- **WHEN** the application CSS bundle is generated
- **THEN** Tailwind's base and utility layers are present and Nuxt UI component tokens are injected

#### Scenario: Project-specific overrides still apply
- **WHEN** custom CSS rules follow the Nuxt UI import in main.css
- **THEN** those rules take precedence over the Nuxt UI defaults where applicable

### Requirement: Color mode is managed by Nuxt UI
The custom `useTheme` composable (`app/composables/useTheme.ts`) SHALL be deleted. The custom `ThemeToggle.vue` component SHALL be deleted. All usages of `useTheme()` and `initTheme()` throughout the codebase SHALL be removed.

#### Scenario: Color mode persists across page reloads
- **WHEN** a user switches to dark mode and reloads the page
- **THEN** the page renders in dark mode without a flash of the wrong theme

#### Scenario: Dark mode class is applied to the HTML root
- **WHEN** the active color mode is dark
- **THEN** the `<html>` element has the `dark` class applied

### Requirement: No duplicate Tailwind CSS instances
The build pipeline SHALL contain exactly one Tailwind CSS processing chain, driven by the `@import "tailwindcss"` in `main.css`. The `@tailwindcss/vite` plugin SHALL NOT be present.

#### Scenario: Build produces no duplicate CSS layers
- **WHEN** `pnpm generate` completes
- **THEN** there is no duplicate `@layer base`, `@layer utilities`, or `@tailwind` directive in the output CSS bundle
