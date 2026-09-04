# Saymon Rivas — Portfolio Platform Foundation

This monorepo hosts the public software-development portfolio and agency platform for Saymon Rivas, with architectural boundaries reserved for a future authenticated CRM application (`apps/crm/`) and shared packages (`packages/`).

The public site is a static-first web application built with **Astro 7**, **TypeScript 6**, **React 19**, and **Tailwind CSS 4**, managed within a strict **pnpm 11** workspace.

---

## 1. Prerequisites & Environment

This repository enforces deterministic runtime and toolchain versions:

- **Node.js**: `24.20.0` (Engine specification: `>=24.20.0 <25.0.0`, pinned in `.node-version`)
- **pnpm**: `11.25.0` (Pinned via `packageManager` in `package.json`)
- **Corepack**: Used to activate and manage the exact pnpm binary.

### Corepack Activation

Enable and activate the pinned pnpm version:

```bash
corepack enable
corepack prepare pnpm@11.25.0 --activate
```

Verify your active environment:

```bash
node -v   # v24.20.0
pnpm -v   # 11.25.0
```

---

## 2. Installation

Install all workspace dependencies using the deterministic frozen lockfile:

```bash
pnpm install --frozen-lockfile
```

---

## 3. Local Development

Start the local Astro development server for the public site:

```bash
pnpm dev:site
```

The site will be served locally at `http://localhost:4321`.

---

## 4. Root Quality Gates

All verification commands are orchestrated from the monorepo root, run non-interactively, and exit with actionable non-zero codes on failure:

| Command             | Tool / Action               | Purpose                                                                                                        |
| :------------------ | :-------------------------- | :------------------------------------------------------------------------------------------------------------- |
| `pnpm build`        | `astro build`               | Compiles static production output to `apps/site/dist/`.                                                        |
| `pnpm typecheck`    | `astro check`               | Strictly typechecks TypeScript files and `.astro` frontmatter.                                                 |
| `pnpm lint`         | `eslint . --max-warnings 0` | Enforces ESLint rules across `.astro`, `.ts`, and `.tsx` files.                                                |
| `pnpm format:check` | `prettier --check .`        | Verifies formatting with `prettier-plugin-astro`.                                                              |
| `pnpm test`         | `astro build && vitest run` | Runs automated smoke tests for zero-JS static contract, React island container rendering, and Tailwind styles. |

---

## 5. Build Output & Static Delivery

Building the application creates static assets under `apps/site/dist/`:

```bash
pnpm build
```

The static build output (`apps/site/dist/index.html` and assets) delivers:

- Zero client-side JavaScript hydration by default for static pages.
- Accessible semantic HTML5 structure (`<html lang="en">`, skip link, `<main id="main-content">`, `<h1>`).
- Compiled utility styling generated via Tailwind CSS 4 (`@tailwindcss/vite`).
