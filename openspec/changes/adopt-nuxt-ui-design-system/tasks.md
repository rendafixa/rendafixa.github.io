## 1. Install and Configure Nuxt UI

- [ ] 1.1 Run `pnpm add @nuxt/ui` to install the package (retains `tailwindcss` which is a peer dep)
- [ ] 1.2 Add `@nuxt/ui` to the `modules` array in `nuxt.config.ts`
- [ ] 1.3 Add `css: ['~/assets/css/main.css']` to `nuxt.config.ts`
- [ ] 1.4 Remove the `import tailwindcss from '@tailwindcss/vite'` import from `nuxt.config.ts`
- [ ] 1.5 Remove the `vite: { plugins: [tailwindcss()] }` block from `nuxt.config.ts`
- [ ] 1.6 Run `pnpm remove @tailwindcss/vite` to uninstall the Vite plugin (do NOT remove `tailwindcss`)
- [ ] 1.7 Add `@import "tailwindcss";` and `@import "@nuxt/ui";` at the top of `app/assets/css/main.css`
- [ ] 1.8 Run `pnpm dev` and verify no build errors and Nuxt UI components are auto-imported

## 2. Remove Custom Theme System

- [ ] 2.1 Delete `app/composables/useTheme.ts`
- [ ] 2.2 Delete `app/components/ThemeToggle.vue`
- [ ] 2.3 Remove the `import '~/assets/css/main.css'` reference and `useTheme` import from `app/layouts/default.vue`
- [ ] 2.4 Remove the `initTheme()` call and `onMounted` block from `app/layouts/default.vue`

## 3. Migrate Default Layout

- [ ] 3.1 Wrap the entire layout template in `<UApp>` as the outermost element
- [ ] 3.2 Replace the manual sticky header `<div>` with `<UHeader>` — put the logo/title in the `#title` slot, the `<NavigationBar />` and color-mode toggle in the `#right` slot, and a vertical nav copy in the `#body` slot for mobile
- [ ] 3.3 Replace the `<main class="…">` element with `<UMain>` to wrap `<NuxtPage />`
- [ ] 3.4 Verify the logo image, site title ("Calculadora Renda Fixa"), and navigation still render correctly inside the header
- [ ] 3.5 Verify page content is properly contained within UMain

## 4. Migrate Navigation Bar

- [ ] 4.1 Replace each `<NuxtLink class="inline-flex …">` icon button in `NavigationBar.vue` with `<UButton variant="ghost" :to="…">` containing the `<ion-icon>` in the default slot
- [ ] 4.2 Replace the `<ThemeToggle />` usage in `NavigationBar.vue` (or layout) with `<UColorModeButton />` or a `<UButton>` that toggles `useColorMode().preference` between `'light'` and `'dark'`
- [ ] 4.3 Verify all four navigation routes still work and the color-mode toggle switches themes correctly

## 5. Migrate Investment Input Form Fields

- [ ] 5.1 Migrate `app/components/investment/AmountInput.vue` — replace `<label>`, `<input>`, and error `<p>` with `<UFormField :error="…">` and `<UInput v-model="…">` with `<ion-icon>` in the `#leading` slot
- [ ] 5.2 Migrate `app/components/investment/IndexCdbInput.vue` using the same pattern
- [ ] 5.3 Migrate `app/components/investment/IndexDiInput.vue` using the same pattern
- [ ] 5.4 Migrate `app/components/investment/IndexLcxInput.vue` using the same pattern
- [ ] 5.5 Migrate `app/components/investment/IndexSelicInput.vue` using the same pattern
- [ ] 5.6 Migrate `app/components/investment/PeriodInput.vue` using the same pattern
- [ ] 5.7 Migrate `app/components/investment/PeriodTypeInput.vue` using the same pattern (select or appropriate UInput variant)
- [ ] 5.8 Verify each input still reads from and writes to the Pinia store correctly

## 6. Migrate InvestmentInput Container

- [ ] 6.1 In `app/components/InvestmentInput.vue`, replace the outer `<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md …">` and header border `<div>` with `<UCard>`, placing the "Investimento" heading in the card's header slot and the form in the default slot
- [ ] 6.2 Remove the `<style scoped>` block if its only rule (`.period-container`) can be replaced with a `<div class="flex gap-4 items-center">` inline

## 7. Migrate InvestmentResult Card

- [ ] 7.1 Replace the root `<div data-testid="result-card" class="…">` in `InvestmentResult.vue` with `<UCard data-testid="result-card">`, placing the name heading with gradient in the card's header slot
- [ ] 7.2 Replace the manual progress bar `<div>` with `<UProgress :model-value="Math.min(totalProfitPercentage, 100)" />`
- [ ] 7.3 Replace the tax-percentage `<span class="… rounded-full …">` pill with `<UBadge :label="taxPercentageDisplay" color="red" />`
- [ ] 7.4 Verify `data-testid="result-total-amount"` attribute is preserved on the total amount element
- [ ] 7.5 Verify the deductions section still conditionally renders for IOF and tax amounts

## 8. Migrate ContentGradientBox

- [ ] 8.1 Simplify `app/components/ContentGradientBox.vue` — retain the gradient bg utility classes but remove any shadow/rounding that Nuxt UI already provides in its surrounding card context, or keep as-is if it is used standalone

## 9. Verify and Clean Up

- [ ] 9.1 Run `pnpm lint:fix` and resolve any remaining ESLint issues
- [ ] 9.2 Run `pnpm test` and confirm all unit and Nuxt tests pass (especially `InvestmentResult` tests relying on `data-testid`)
- [ ] 9.3 Run `pnpm generate` and confirm static site generation completes without errors
- [ ] 9.4 Manually review light mode and dark mode rendering in the browser for all four pages
- [ ] 9.5 Remove any unused CSS from `app/assets/css/main.css` that is now redundant due to Nuxt UI

## 10. Update AmountInput Tests

- [ ] 10.1 Remove assertions on raw Tailwind class names (`.text-red-600`, `input.border-red-500`) — they are implementation details of the old markup and will no longer match
- [ ] 10.2 Replace `wrapper.find('label[for="amount-input"]')` selector with a label text content assertion (e.g., `wrapper.find('label').text()` contains `'Valor da Aplicação'`)
- [ ] 10.3 Assert leading icon is in the UInput slot: `wrapper.find('ion-icon[name="cash-outline"]').exists()` is true
- [ ] 10.4 Assert error state by checking error text content rather than a CSS class (e.g., `wrapper.text()` contains the validation message)
- [ ] 10.5 Run `pnpm test test/nuxt/AmountInput.test.ts` and confirm all cases pass

## 11. Create Input Component Tests (6 new files)

- [ ] 11.1 Create `test/nuxt/IndexCdbInput.test.ts` — label text, `id="cdb-input"` on input (required by CalculatorPage tests), leading icon, valid value → `store.cdb` updated, invalid value (≤ 0) → store unchanged and error text shown
- [ ] 11.2 Create `test/nuxt/IndexDiInput.test.ts` — same pattern: label text, leading icon, valid value → `store.di` updated, invalid → store unchanged and error shown
- [ ] 11.3 Create `test/nuxt/IndexLcxInput.test.ts` — label text, `id="lcx-input"` on input (required by CalculatorPage tests), leading icon, valid → `store.lcx` updated, invalid → store unchanged and error shown
- [ ] 11.4 Create `test/nuxt/IndexSelicInput.test.ts` — label text, leading icon, valid → `store.selic` updated, invalid → store unchanged and error shown
- [ ] 11.5 Create `test/nuxt/PeriodInput.test.ts` — label text, `type="number"` input, leading icon, valid period → `store.period` updated, invalid (≤ 0) → store unchanged and error shown
- [ ] 11.6 Create `test/nuxt/PeriodTypeInput.test.ts` — component renders a selector, selecting a different type updates `store.periodType`, current value is reflected in the component state
- [ ] 11.7 Run `pnpm test --project nuxt` and confirm all 6 new test files pass

## 12. Create InvestmentResult Tests

- [ ] 12.1 Create `test/nuxt/InvestmentResult.test.ts` with a `defaultProps` fixture: `{ name: 'CDB / RDB', totalAmount: 1105, liquidProfit: 80, investedAmount: 1000, grossInterest: 100, totalProfitPercentage: 8, taxPercentage: 15, taxAmount: 15, iofAmount: null }`
- [ ] 12.2 Assert `data-testid="result-card"` element is present (critical — CalculatorPage tests depend on it)
- [ ] 12.3 Assert `data-testid="result-total-amount"` element is present and contains `'R$'`
- [ ] 12.4 Assert investment name `'CDB / RDB'` appears in `wrapper.text()`
- [ ] 12.5 Assert `wrapper.find('progress').exists()` is true (UProgress renders a `<progress>` element)
- [ ] 12.6 Assert progress caps at 100: mount with `totalProfitPercentage: 150`, assert `progress` element's value attribute ≤ `'100'`
- [ ] 12.7 Assert tax badge shows percentage: `wrapper.text()` contains `'15%'`
- [ ] 12.8 Assert tax badge absent when `taxPercentage: null`: no `%` in the badge area
- [ ] 12.9 Assert deductions section hidden when `taxAmount: null, iofAmount: null`: wrapper does not contain `'IR'` or `'IOF'` labels
- [ ] 12.10 Assert IOF line renders when `iofAmount: 5`: `wrapper.text()` contains `'IOF'`
- [ ] 12.11 Run `pnpm test test/nuxt/InvestmentResult.test.ts` and confirm all cases pass

## 13. Create Layout and Navigation Tests

- [ ] 13.1 Create `test/nuxt/DefaultLayout.test.ts` — mount the default layout (use `mountSuspended` with a page route or stub `<NuxtPage>`); assert `wrapper.find('header').exists()`, `wrapper.find('main').exists()`, header contains the logo img src, header text contains `'Calculadora Renda Fixa'`
- [ ] 13.2 Create `test/nuxt/NavigationBar.test.ts` — mount `NavigationBar.vue`; assert at least 4 navigable elements (buttons/links) are rendered; assert `ion-icon` elements are present; assert color mode toggle button exists; trigger click on toggle and assert `useColorMode().preference` changes
- [ ] 13.3 Run `pnpm test --project nuxt` and confirm both new test files pass

## 14. Update ContentGradientBox Tests

- [ ] 14.1 In `test/nuxt/ContentGradientBox.test.ts`, loosen gradient class assertions: replace exact substring checks (`from-orange-`, `to-amber-`) with a general check that the element has classes starting with `from-` and `to-` (gradient intent preserved regardless of color tokens)
- [ ] 14.2 Retain the `rounded-lg` and `p-4` class assertions (layout contract)
- [ ] 14.3 Run `pnpm test test/nuxt/ContentGradientBox.test.ts` and confirm all cases pass
