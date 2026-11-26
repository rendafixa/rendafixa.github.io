# AGENTS.md

## Package manager

Node 26 is required (`engines.node: ^26.0.0`). `.nvmrc` is the single source of truth: developer machines read it, and every workflow passes it to `actions/setup-node` via `node-version-file`. Bump the file to move local and CI together.

```sh
pnpm install --frozen-lockfile   # after cloning
```

pnpm enforces `minimumReleaseAge`; a release newer than the window resolves to an older version. Pin it exactly and add a `minimumReleaseAgeExclude` entry in `pnpm-workspace.yaml`.

## Key commands

```sh
pnpm dev            # dev server
pnpm generate       # static site generation (what CI deploys)
pnpm verify:seo     # assert generated SEO output in .output/public (run after generate)
pnpm lint           # ESLint check
pnpm lint:fix       # ESLint auto-fix
pnpm typecheck      # scoped tsc over app/src and app/lib
pnpm test           # all tests (both unit and nuxt projects)
pnpm update-indexes # fetch live market rates → app/assets/indicadores.json
```

CI order: `lint → typecheck → test → generate → verify:seo` (not `build`).

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

Canvas-based components (Chart.js, etc.) gate rendering on `canvas.getContext('2d')` after mount; happy-dom has no canvas and the chart library throws unhandled rejections that fail `pnpm test`.

`pnpm typecheck` covers `app/src` and `app/lib` only; full-project `tsc --noEmit` still reports pre-existing errors in `test/nuxt/*`.

The `nuxt` project loads Nuxt with `ssr: false` (hardcoded in `@nuxt/test-utils`), which means:

- `document.title` is unreliable (unhead does not resolve string `titleTemplate`s client-side there) and JSON-LD from `useSchemaOrg()` never reaches the head. Both are asserted by `pnpm verify:seo`, which checks the generated `.output/public` — always run it after `pnpm generate` (CI does, right after the generate step).
- unhead applies DOM side effects on a timer: mount pages via `mountPageAndSettleHead` from `test/nuxt/seo-head.ts` before asserting head contents.

## Architecture

- `app/src/` — pure TS financial logic (CDB, LCI/LCA, Poupança, taxes, IOF). No Nuxt dependency; unit-testable in node env.
- `app/store/` — Pinia stores (investment state, loads `indicadores.json` at runtime).
- `app/components/` — Vue components.
- `app/pages/` — Nuxt pages (prerendered: `ssr: true`, HTML rendered at build time, hydrated into an SPA feel client-side).
- `app/components/OgImage/` — og:image templates (`*.satori.vue`) rendered to PNG by nuxt-og-image at `pnpm generate` time.
- `app/assets/indicadores.json` — live market rates (CDI, SELIC, Poupança). Auto-updated by CI workflow; do not hand-edit for persistent changes—use `pnpm update-indexes`.

## SEO (`@nuxtjs/seo`)

`sitemap.xml`, `robots.txt`, og:image PNGs (under `/_og/s/`), JSON-LD graphs and `llms.txt` are all **generated at build time** by the bundled modules — never hand-edit or commit `public/sitemap.xml` / `public/robots.txt` (a static `robots.txt` gets renamed to `_robots.txt` and treated as config source).

- Per-page og:image is wired via `routeRules` (`ogImage` key) in `nuxt.config.ts`, **not** `defineOgImage()` — the vitest nuxt environment loads Nuxt with `ssr: false`, where nuxt-og-image bails out and its composables don't exist (see Testing).
- Internal links use trailing slashes (`/sobre/`); the site convention is `trailingSlash: true` and the link checker fails the build report otherwise.

## Nuxt 4 conventions

`future.compatibilityVersion: 4` is set. This activates Nuxt 4 directory conventions (e.g., `app/` directory layout instead of root-level `pages/`/`components/`).

## ESLint / style

Stylistic rules are enabled via `@nuxt/eslint` (`stylistic: true`). The formatter is ESLint itself—no separate Prettier config. Always run `pnpm lint:fix` before committing formatting changes.

## `ion-*` elements

`ion-*` tags (Ionicons web components) are registered as custom elements in the Vue compiler config. Do not treat lint warnings about unknown elements for `ion-*` as bugs.

## PR titles

PR titles must follow **Conventional Commits** (enforced by CI workflow `pr-title.yml`).

## Deployment

The site is prerendered static HTML deployed to GitHub Pages via `pnpm generate`. SSR runs at build time only; after hydration the app behaves as an SPA. Skew protection keeps previous build assets alive for clients with cached HTML — its build history lives in `node_modules/.cache/nuxt-seo/skew-protection`, preserved by the cache step in `publish.yml`.
