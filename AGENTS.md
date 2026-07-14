# AGENTS.md

## Package manager

Use **pnpm** exclusively (`packageManager: "pnpm@10.33.0"`). Do not use npm or yarn.

```sh
pnpm install --frozen-lockfile   # after cloning
```

## Key commands

```sh
pnpm dev            # dev server
pnpm generate       # static site generation (what CI deploys)
pnpm lint           # ESLint check
pnpm lint:fix       # ESLint auto-fix
pnpm test           # all tests (both unit and nuxt projects)
pnpm update-indexes # fetch live market rates → app/assets/indicadores.json
```

CI order: `lint → test → generate` (not `build`).

## TypeScript setup

TypeScript 7.0.2 is installed side-by-side with TypeScript 6.0.x via npm aliases because TS 7 has no programmatic API (coming in 7.1), which breaks `typescript-eslint` and Vue/Volar editor tooling:

```json
"@typescript/native": "npm:typescript@^7.0.2",
"typescript": "npm:@typescript/typescript6@^6.0.2"
```

- `npx tsc` — runs **TypeScript 7** CLI (native Go port, ~10x faster)
- `npx tsc6` — runs **TypeScript 6** for tools that need the API
- ESLint, Volar, etc. resolve `typescript` to TS 6 via the alias

`tsconfig.json` only extends `.nuxt/tsconfig.json`, which is generated. After a fresh clone, run `pnpm install` (postinstall runs `nuxt prepare` automatically) before TypeScript will resolve types.

## Testing

Two Vitest projects with different environments:

| Project | Environment | Path pattern |
|---------|-------------|--------------|
| `unit`  | node        | `test/{e2e,unit}/**/*.{test,spec}.ts` |
| `nuxt`  | nuxt        | `test/nuxt/*.{test,spec}.ts` |

Run a single project:
```sh
pnpm test --project unit
pnpm test --project nuxt
```

Run a single file:
```sh
pnpm test test/unit/src/cdb.spec.ts
```

## Architecture

- `app/src/` — pure TS financial logic (CDB, LCI/LCA, Poupança, taxes, IOF). No Nuxt dependency; unit-testable in node env.
- `app/store/` — Pinia stores (investment state, loads `indicadores.json` at runtime).
- `app/components/` — Vue components.
- `app/pages/` — Nuxt pages (SPA, SSR is disabled).
- `app/assets/indicadores.json` — live market rates (CDI, SELIC, Poupança). Auto-updated by CI workflow; do not hand-edit for persistent changes—use `pnpm update-indexes`.

## Nuxt 4 conventions

`future.compatibilityVersion: 4` is set. This activates Nuxt 4 directory conventions (e.g., `app/` directory layout instead of root-level `pages/`/`components/`).

## ESLint / style

Stylistic rules are enabled via `@nuxt/eslint` (`stylistic: true`). The formatter is ESLint itself—no separate Prettier config. Always run `pnpm lint:fix` before committing formatting changes.

## `ion-*` elements

`ion-*` tags (Ionicons web components) are registered as custom elements in the Vue compiler config. Do not treat lint warnings about unknown elements for `ion-*` as bugs.

## PR titles

PR titles must follow **Conventional Commits** (enforced by CI workflow `pr-title.yml`).

## Deployment

The site is a static SPA deployed to GitHub Pages via `pnpm generate`. There is no server-side rendering.
