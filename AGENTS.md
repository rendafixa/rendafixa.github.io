# AI Coding Agent Guidelines for Renda Fixa

A Brazilian fixed-income investment calculator (Nuxt 4 + Vue 3 + TypeScript) simulating returns for CDB/RDB, LCI/LCA, and savings accounts based on Central Bank (BCB) indices.

## Architecture Overview

```
app/
├── src/               # Pure TypeScript calculation engine
│   ├── finance.ts     # Core: compound interest, IR brackets, IOF tables
│   ├── cdb.ts         # CDB/RDB formulas (with IR + IOF)
│   ├── lcx.ts         # LCI/LCA (tax-exempt)
│   └── poupanca.ts    # Savings account math
├── store/investment.ts # Pinia state: user inputs (amount, rates, period)
├── components/        # Vue 3 SFCs
│   └── investment/    # Specialized input components
└── assets/indicadores.json  # Runtime market data (DI, SELIC, savings rate)
```

**Data Flow**: User adjusts input → Pinia store updates → Computed properties in `InvestmentSimulation.vue` recalculate → Results render.

## Critical Patterns

### Investment Type Structure
Each investment module exports `get<Type>Result()` returning `{ interestAmount, taxAmount, taxPercentage, iofAmount }`. Example flow in `InvestmentSimulation.vue:52-58`:
- CDB uses IR brackets (day-dependent) + IOF penalty for redemption < 30 days
- LCI/LCA are tax-exempt (no IR/IOF)
- Savings use simple monthly rates

### Brazilian Tax Calculations (Finance-Critical)
**IR (Income Tax)** brackets in `finance.ts:6-18` depend on investment days:
- ≤180 days: 22.5% | 181-360: 20% | 361-720: 17.5% | >720: 15%

**IOF (Insurance Operations Tax)** only applies if redemption < 30 days:
- Uses lookup table `iofTable[]` in `finance.ts:22-25` (96% down to 0% across 30 days)
- Formula: `finalReturn = amount + interest - IOF - (interest - IOF) × IR%`

**Period Conversion** (`InvestmentSimulation.vue:46-50`):
- Days: multiply by 1
- Months: multiply by 365/12 (not 30!)
- Years: multiply by 365 (not 360!)
- Always floor() to integer days before calculations

### Precision & Rounding
All currency calculations use `.toFixed(2)` before `Number.parseFloat()` (see `finance.ts:3`). This prevents floating-point errors in tax/interest math.

## Essential Developer Workflows

```bash
pnpm dev              # Dev server + HMR on localhost:3000
pnpm test             # Vitest unit tests
pnpm lint:fix         # Auto-fix ESLint + Stylistic rules
pnpm update-indexes   # Fetch latest BCB indices → indicadores.json
pnpm generate         # Static site generation (GitHub Pages)
```

**Index Updates Critical**: `update-indexes.mjs` calls BCB API endpoints and updates `indicadores.json`. Must run before production releases to keep market data current. Series IDs: `4391` (DI), `1` (SELIC), `195` (Savings).

## Code Style & Linting

- **ESLint flat config** (`eslint.config.mjs`, auto-generated) with `@nuxt/eslint` + Stylistic rules
- **No Prettier**: All formatting handled via ESLint
- Run `pnpm lint` in CI automatically
- **TypeScript strict mode enabled** in `tsconfig.json` — prefer explicit types over `any`

## Testing Approach

- **Vitest** with `describe`/`it` blocks in `test/unit/src/`
- **Tax tables critical**: See `finance.spec.ts` tests for IR bracket boundaries and IOF edge cases (days 1, 30, 31)
- Test compound interest with real BCB index values (e.g., `1.0003105377556554`)

## Nuxt/Vue Conventions

- **Alias**: `~` points to `app/` directory
- **Store initialization**: Called in `index.vue` via `store.initializeStore()` to load indices
- **Pinia store** (`app/store/investment.ts`): Portuguese enum names (`PeriodTypes.Dias`, `meses`, `anos`)
- **Layout**: `app/layouts/default.vue` wraps pages with header/footer
- **Computed properties** in components auto-recalculate when store updates

## CI/CD Pipeline

- **Lint check** → **Generate static site** → **Deploy to GitHub Pages** (`.github/workflows/publish.yml`)
- PR title validation via conventional commits (`.github/workflows/pr-title.yml`)
- SonarCloud quality gates active (see README badges)

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/src/finance.ts` | IR/IOF tax logic, compound interest |
| `app/store/investment.ts` | Pinia store + index loading |
| `app/components/InvestmentSimulation.vue` | Main calculation orchestration |
| `app/assets/indicadores.json` | Real BCB market data (auto-updated) |
| `update-indexes.mjs` | BCB API client (Node.js) |
| `nuxt.config.ts` | Tailwind, SEO (pt-BR), ESLint config |
| `vitest.config.ts` | Test runner setup |

## Common Gotchas

1. **Period conversion**: Months = 365/12 (not 30), Years = 365 (not 360) — matches BCB official practices
2. **IOF bounds**: Day 30 returns 0% IOF; day 31+ returns 0%; verify lookup table indexing in tests
3. **Floating-point errors**: Always `.toFixed(2)` before storing/calculating currency
4. **Index nulls**: Check for `null` values before calculations (e.g., `investment.di`, `investment.poupanca`)
5. **Portuguese terminology**: UI uses `Dias`/`Meses`/`Anos`; internal code uses `PeriodTypes.Days/Months/Years`
6. **indicadores.json**: Do NOT hardcode index values; always fetch via `update-indexes`

## External Dependencies

- **BCB API** (`https://api.bcb.gov.br/dados/serie/bcdata.sgs.*`): DI, SELIC, savings rates
- **Axios**: HTTP client for index fetching
- **Pinia**: State management
- **Tailwind CSS 4** + Vite plugin
- **Nuxt Schema Org**: SEO metadata generation

