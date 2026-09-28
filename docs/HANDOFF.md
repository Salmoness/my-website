---
type: handoff
status: approved
owner: Saymon Rivas
updated: 2026-09-28
tags:
  - website
  - handoff
---

# Website handoff

The Astro website is in `apps/site/`. The website documentation vault was separated from the company vault on 2026-09-28. The earlier combined vault and its historical specifications are preserved in the private `Azul` workspace. Use [[website/Public Content Contract]] for approved public facts and [[website/Implementation]] for the current code map.

## Current site

- Main pages: Home, Services, How We Work, About, and Privacy.
- The Home hero uses a puzzle cube. The site has interactive service and process elements, with non-JavaScript fallbacks.
- The production domain and branded email are configured as planned values in `apps/site/src/config/site.ts`; confirm they are live before a public release.
- The enquiry form endpoint is empty. The legacy `/work` route and portfolio compatibility data remain in source.
- The repository's default build copies the static site into root `dist/` for hosting.

## Working rules

- Check the implementation before assuming older design notes still match the site.
- Keep business-private material in the separate company vault.
- Preserve unrelated local changes, including the currently untracked `Claude outputs/` and `scratch/` directories.
- Run the narrowest relevant checks after changes and report what actually ran.

See [[website/Release Checklist]] for technical release work still open.
