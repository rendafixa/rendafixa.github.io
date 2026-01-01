# AI Coding Instructions for Renda Fixa

## Project Overview
**Renda Fixa** is a Brazilian fixed-income investment calculator. It simulates returns for CDB/RDB, LCI/LCA, and savings accounts based on real Central Bank (BCB) indices. The project is a Nuxt 4 + Vue 3 frontend with TypeScript calculations and Pinia state management.

## Architecture

### Core Components
- **Calculation Engine** (`app/src/`): Pure TypeScript functions handling investment math
  - `finance.ts`: Compound interest, IR tax brackets, IOF penalty tables
  - `cdb.ts`, `lcx.ts`, `poupanca.ts`: Investment-specific formulas
- **State Management** (`app/store/investment.ts`): Pinia store holds user inputs (amount, rates, period)
- **UI** (`app/components/`): Vue components for input (`investment/`) and results display
- **Data** (`app/assets/indicadores.json`): Real-time Brazilian indices (DI, SELIC, savings rate)

### Data Flow
User adjusts inputs → Pinia store updates → Computed properties in `InvestmentSimulation.vue` recalculate results → Display updates

## Critical Developer Workflows

### Development
```bash
pnpm dev  # Start dev server with HMR on localhost:3000
```

### Testing
```bash
pnpm test                # Run all tests (Vitest)
pnpm test src/           # Test specific directory
```

### Building
```bash
pnpm generate            # Static site generation (for GitHub Pages)
pnpm build && pnpm preview  # Test production build locally
```

### Updating Market Indices
```bash
pnpm update-indexes      # Fetch latest DI/SELIC/savings rates from BCB API
```
This runs `update-indexes.mjs`, which calls `https://api.bcb.gov.br/` endpoints and updates `app/assets/indicadores.json`. Critical for production accuracy.

## Project-Specific Conventions

### Investment Type Pattern
Each investment has a module following this structure:
- **Calculation function**: `get<Type>Result()` returns `{ interestAmount, taxAmount, taxPercentage, iofAmount }`
- **CDB/RDB**: Uses IR tax brackets (days-based) + IOF penalty for redemption < 30 days
- **LCI/LCA**: Tax-exempt (no IR/IOF calculations)
- **Savings**: Simple monthly rates, no taxes

### Tax Calculation (Brazil-Specific)
- **IR (Income Tax)**: Brackets depend on investment period:
  - ≤180 days: 22.5%
  - 181-360 days: 20%
  - 361-720 days: 17.5%
  - >720 days: 15%
- **IOF (Insurance Ops Tax)**: Only for redemption < 30 days, uses lookup table `iofTable[]` in `finance.ts`
- Formula: `finalReturn = amount + interest - IOF - (interest - IOF) * IR%`

### Period Flexibility
Store supports Days/Months/Years input; components use `periodMultiplier` to convert to days internally:
```typescript
const periodMultiplier = {
  [PeriodTypes.Days]: 1,
  [PeriodTypes.Months]: 365 / 12,
  [PeriodTypes.Years]: 365
}
```

### Nuxt/Vue-Specific
- Uses `app/layouts/default.vue` for consistent header/footer
- Indexing: `~` alias points to `app/` directory
- Pinia: Store initialized in `index.vue` page via `store.initializeStore()`
- Tailwind CSS + Vite integration (check `@tailwindcss/vite` in config)

### Linting & Formatting (Nuxt 4/Vue 3 Best Practice)
- Project uses **ESLint flat config** with official `@nuxt/eslint` module. See `eslint.config.mjs` (auto-generated).
- Formatting rules are enforced by the **ESLint Stylistic** plugin—no `.editorconfig` file is needed or used.
- No Prettier: all stylistic and layout concerns handled via ESLint rules.
- **Lint scripts:**
  - `pnpm lint` — Check entire codebase for lint and style violations
  - `pnpm lint:fix` — Auto-fix fixable issues (recommended before commit)
- **CI/CD:** Lint runs automatically in GitHub Actions (`.github/workflows/ci.yml` and `publish.yml`). Commits/PRs failing lint will cause the pipeline to fail.
- TypeScript and Vue SFCs are deeply integrated in lint setup. Prefer explicit, non-`any` types.

## Testing Patterns
- Unit tests in `test/unit/src/` use **Vitest** with `describe`/`it` blocks
- Example: `finance.spec.ts` tests IR brackets and compound interest edge cases
- Test critical financial calculations exhaustively (tax tables, compound formulas)

## External Dependencies & Integration Points
- **BCB API** (`https://api.bcb.gov.br/`): Fetches DI, SELIC, savings rates
  - Series IDs: `4391` (DI), `1 month avg`, others in `update-indexes.mjs`
- **Nuxt Schema Org**: SEO metadata (Portuguese pt-BR)
- **Axios**: HTTP calls for index updates
- **SonarCloud**: CI/CD quality gates (see badges in README)

## Key Files Reference
- `package.json`: Build/test/lint scripts and dependencies
- `nuxt.config.ts`: Tailwind, SEO meta, static generation and lint config
- `eslint.config.mjs`: ESLint flat config entry point (auto-generated)
- `.github/workflows/pr-title.yml`: PR title conventional commit validation
- `vitest.config.ts`: Test runner configuration
- `tsconfig.json`: TypeScript strict mode (recommended)
- `app/assets/indicadores.json`: Runtime market data (do not commit hardcoded values)

## Common Pitfalls
1. **Index Updates**: Always run `pnpm update-indexes` before commits to keep `indicadores.json` current
2. **Tax Precision**: Use `.toFixed(2)` for currency calculations (see `finance.ts`)
3. **Period Conversion**: Remember 1 month = 365/12 days (not 30), 1 year = 365 days (not 360)
4. **IOF Edge Case**: IOF is 0 after day 30; verify lookup table bounds in tests
5. **Portuguese Localization**: App uses Portuguese terminology (e.g., `PeriodTypes.Dias`, `meses`, `anos`)
