# Azul Online Projects — Website

The public website for **Azul Online Projects**, a founder-led company in Orlando that helps small businesses build a credible online presence. Azul serves Central Florida and remote clients across the United States. It combines websites and systems with social content: **Grow your online identity.**

The site has five routes: `/`, `/services`, `/how-we-work`, `/about`, and `/privacy`. Its main action is **Let's hop on a call**, which leads to an enquiry and a free consultation that is scheduled by hand.

## Where to start

The website's public-safe Obsidian vault is in [`docs/`](docs/Home.md):

1. [`docs/Home.md`](docs/Home.md): map of the vault and reading recipe.
2. [`docs/AGENTS.md`](docs/AGENTS.md): working rules for agents and contributors.
3. [`docs/website/Public Content Contract.md`](docs/website/Public%20Content%20Contract.md): approved public facts.
4. [`docs/website/Release Checklist.md`](docs/website/Release%20Checklist.md): current website launch checks.

The separate private Azul company vault holds business decisions and historical specifications. This repository must not contain private company notes.

## Status

- Home, Services, How We Work, About, and Privacy are built with the Azul visual system (Deep Azul, Slate Current, Cloud Gray, and Coral Signal, set in Epilogue and Manrope). The Home hero shows a static, window-lit satin block stack on a polished navy tabletop, with a focused crop below the headline on smaller screens.
- The owner's final visual review is in progress.
- Before launch: connect the enquiry form, add the 404 page and sitemap, remove the leftover portfolio route and content, buy the domain, set up email, and deploy. See the release plan for details.

## Repository layout

| Path                                | Purpose                                                      |
| :---------------------------------- | :----------------------------------------------------------- |
| `apps/site/`                        | Public Astro website (pages, components, styles, tests)      |
| `apps/site/src/config/site.ts`      | Central identity, contact, form-endpoint, and release values |
| `apps/site/DESIGN.md`, `PRODUCT.md` | Shipped design system and product brief for the site         |
| `packages/ui/`                      | Shared design tokens and foundation CSS                      |
| `docs/`                             | Public-safe website vault and implementation notes           |

## Stack

Astro 7, strict TypeScript 6, Tailwind CSS 4, Vitest, and Playwright, in a pnpm 11 workspace. Pages are static-first. Interactive pieces (the service guide and form enhancement) are small framework-free TypeScript modules. React is installed but only used where client state needs it.

## Prerequisites

- **Node.js** `24.20.0` locally (pinned in `.node-version`); engines allow `>=24.6.0 <25.0.0` so the host's Node 24 can build
- **pnpm** `11.25.0` (pinned via `packageManager`), activated with Corepack:

```bash
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
```

## Commands

Run from the repository root:

| Command             | Purpose                                                          |
| :------------------ | :--------------------------------------------------------------- |
| `pnpm dev:site`     | Local dev server at `http://localhost:4321`                      |
| `pnpm build`        | Static production build to `apps/site/dist/` (copied to `dist/`) |
| `pnpm typecheck`    | `astro check` across TypeScript and `.astro` files               |
| `pnpm lint`         | ESLint with zero warnings allowed                                |
| `pnpm format:check` | Prettier check (with the Astro plugin)                           |
| `pnpm test`         | Build, then run Vitest unit tests                                |
| `pnpm test:e2e`     | Playwright browser tests                                         |

## Deploying (Hostinger or any static host)

- Build command: `pnpm build` (or `npm run build`). It runs the site's `astro build` through `npm --prefix apps/site` rather than calling pnpm a second time, so hosts whose nested `pnpm` points at a missing corepack version still build.
- Output directory: `dist` (a copy of `apps/site/dist`, made by `scripts/copy-dist.mjs`). `apps/site/dist` works too.
- Node: any 24.x from 24.6.0 up.
- Set `SITE_MODE=production` in the host's environment only when the site should be indexed; the default `staging` marks every page no-index.

## Environment

Copy `apps/site/.env.example` to `apps/site/.env` when needed. `SITE_MODE` defaults to `staging`, which marks pages no-index. Switch to `production` only for the public release. Keep secrets and provider keys out of the repository.
