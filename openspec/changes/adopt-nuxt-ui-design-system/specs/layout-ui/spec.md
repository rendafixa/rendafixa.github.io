## ADDED Requirements

### Requirement: Application root uses UApp wrapper
The default layout (`app/layouts/default.vue`) SHALL wrap all content in `<UApp>` so that Nuxt UI's color mode class injection is active.

#### Scenario: UApp is the outermost element in the layout
- **WHEN** the default layout renders
- **THEN** the rendered HTML tree has `<div data-ui-app>` (or equivalent UApp root) as the outermost wrapper containing the header and main content

### Requirement: Main content uses UMain wrapper
The default layout SHALL wrap the `<NuxtPage />` slot in `<UMain>` instead of a manually styled `<main>` element. `<UMain>` provides Nuxt UI's standard page content padding and max-width constraints.

#### Scenario: UMain wraps page content
- **WHEN** the default layout renders
- **THEN** the rendered HTML tree contains a `<main>` element (rendered by UMain) as a sibling of the UHeader inside UApp, and `<NuxtPage />` content renders inside it

#### Scenario: Layout structure is UApp → UHeader + UMain
- **WHEN** the layout renders
- **THEN** the DOM structure is: `UApp` root > `UHeader` (sticky header) + `UMain` (page slot)


### Requirement: Header uses UHeader component
The sticky site header in the default layout SHALL be implemented with `<UHeader>` instead of a manually styled `<div>`. The header SHALL remain sticky, include a shadow, and adapt to dark mode automatically. The logo/title SHALL map to `UHeader`'s `#title` slot; navigation and color-mode toggle SHALL be in the `#right` slot; mobile navigation SHALL be provided via the `#body` slot.

#### Scenario: Header is visible and sticky on scroll
- **WHEN** the page content overflows the viewport and the user scrolls down
- **THEN** the header remains fixed at the top of the viewport

#### Scenario: Header renders the logo, site title, and navigation
- **WHEN** the default layout is rendered
- **THEN** the header contains the site logo image, the "Calculadora Renda Fixa" title (hidden on mobile), and the navigation bar component

### Requirement: Navigation buttons use UButton
The `NavigationBar.vue` component's icon-link elements SHALL be implemented using `<UButton>` with `variant="ghost"` and the existing `<ion-icon>` rendered in the button's `#leading` or default slot.

#### Scenario: Navigation button activates the correct route
- **WHEN** a navigation button is clicked
- **THEN** the app navigates to the corresponding route (`/`, `/como-calcular-juros-da-poupanca`, `/como-calcular-imposto-de-renda`, `/sobre`)

#### Scenario: Navigation buttons display correctly in dark mode
- **WHEN** dark mode is active
- **THEN** navigation buttons display with appropriate contrast without any custom dark-mode class overrides

### Requirement: Color mode toggle uses UColorModeButton or UButton with color mode hook
The color-mode toggle in the navigation bar SHALL use either `<UColorModeButton>` or a `<UButton>` that calls `colorMode.preference` to toggle between `'light'` and `'dark'`. The `ThemeToggle.vue` file SHALL NOT exist in the codebase.

#### Scenario: Toggle switches from light to dark
- **WHEN** the color mode is light and the user activates the toggle
- **THEN** the color mode switches to dark and the page re-renders in dark mode

#### Scenario: Toggle switches from dark to light
- **WHEN** the color mode is dark and the user activates the toggle
- **THEN** the color mode switches to light and the page re-renders in light mode

## Tests

### Test file: `test/nuxt/DefaultLayout.test.ts` (new)

Mounts the default layout via `mountSuspended` using `NuxtPage` stub. Covers:

- **UApp wrapper present** — the root DOM element has an attribute that identifies it as a UApp host (e.g., `[data-ui-app]` or verify a `<div>` is the outermost wrapper)
- **UHeader renders a `<header>` element** — `wrapper.find('header').exists()` is true
- **UMain renders a `<main>` element** — `wrapper.find('main').exists()` is true
- **Logo image is inside the header** — `wrapper.find('header img')` exists and its `src` contains the logo filename
- **Site title text inside header** — `wrapper.find('header').text()` contains `'Calculadora Renda Fixa'`
- **`<nav>` or navigation links are inside the header** — header contains at least one `<a>` or `<button>` element pointing to known routes

### Test file: `test/nuxt/NavigationBar.test.ts` (new)

Mounts `NavigationBar.vue` in isolation via `mountSuspended`. Covers:

- **Four navigation buttons render** — finds 4 elements that act as links/buttons, one for each route (`/`, `/como-calcular-juros-da-poupanca`, `/como-calcular-imposto-de-renda`, `/sobre`)
- **Buttons are UButton-based** — no raw `<a class="inline-flex …">` element; instead each link is a `<button>` or an anchor rendered by UButton
- **Ion-icons are present** — `wrapper.findAll('ion-icon')` returns at least one icon per navigation button
- **Color mode toggle is present** — a button for toggling theme exists (either `UColorModeButton` or a `<button>` with an aria-label referencing mode)
- **`ThemeToggle.vue` is not used** — `wrapper.html()` does not contain a reference that implies the old component still exists
- **Color mode toggle changes preference** — after clicking the toggle, `useColorMode().preference` is `'dark'` (from default `'light'`); clicking again returns it to `'light'`
