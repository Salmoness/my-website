---
type: website-technical
status: approved
owner: Saymon Rivas
updated: 2026-09-28
tags:
  - website
  - implementation
---

# Website implementation

The site is a static-first Astro application with strict TypeScript in a pnpm workspace. Use small client scripts for interactions and keep essential content available without JavaScript.

## Code map

- `apps/site/src/pages/`: public routes. The legacy `work.astro` is still present and scheduled for cleanup.
- `apps/site/src/config/site.ts`: public identity, contact, form endpoint, maintenance price, and metadata.
- `apps/site/src/components/shell/`: shared header, navigation, footer, and loader.
- `apps/site/src/components/services/` and `components/contact/`: service guide and enquiry form.
- `apps/site/src/scripts/`: small interaction modules.
- `apps/site/src/styles/azul.css` and `pages.css`: shared/Home and inner-page styling.
- `packages/ui/`: shared visual foundation.
- `apps/site/tests/` and `apps/site/e2e/`: unit and browser tests.

## Engineering rules

- Keep Astro static rendering by default. Hydrate only the interaction that needs client state.
- Use semantic HTML, visible focus, keyboard-operable controls, readable contrast, and intentional reduced-motion behavior.
- Keep navigation, prices, contact details, and the ordinary form usable without JavaScript.
- Use shared design tokens and existing patterns before adding new dependencies or animation systems.
- Keep environment files and credentials out of source control. Use `apps/site/.env.example` for documented configuration.

Run the relevant root scripts from `README.md` after changes. For visual work, inspect desktop and mobile layouts and reduced-motion behavior.
