---
type: handoff
status: approved
owner: Saymon Rivas
updated: 2026-10-01
tags:
  - website
  - handoff
---

# Website handoff

The Astro website is in `apps/site/`. The website documentation vault was separated from the company vault on 2026-09-28. The earlier combined vault and its historical specifications are preserved in the private `Azul` workspace. Use [[website/Public Content Contract]] for approved public facts and [[website/Implementation]] for the current code map.

## Current site

- Main pages: Home, Services, How We Work, About, and Privacy.
- The Home hero uses a static Higgsfield tabletop scene supplied by Saymon: a clean satin black/deep-navy 3×3×3 block stack on a polished stone counter, a light beam, a laptop corner, and a window with ocean and palm trees. Above `58rem` it fills the hero behind live content; at `58rem` and below, a focused crop sits between the headline and information card. Approved hero copy and actions are unchanged. The site has interactive service and process elements, with non-JavaScript fallbacks.
- On 2026-10-01 Saymon confirmed domain ownership and Hostinger hosting at `https://azulonlineprojects.com`. The approved public email is `saymonrivas@azulonlineprojects.com`. `apps/site/src/config/site.ts` still uses the earlier email and needs correction. Test sending/receiving and deployed contact behavior before marking them verified.
- The enquiry form endpoint is empty. The legacy `/work` route and portfolio compatibility data remain in source.
- The repository's default build copies the static site into root `dist/` for hosting.

## Home hero refinement — 2026-09-30

Revision 3 (the image Saymon supplied on 2026-09-30) replaced revision 2's generated scene; the implementation is unchanged apart from the assets and `object-position` (`40% 70%` above 76rem, `22% 70%` from 58–76rem). The finish review had cleared revision 2 of the hero refinement to ship within its scope. The selected Higgsfield GPT Image 2.5 scene and crop provenance are recorded in `apps/site/src/assets/images/azul/hero-cinematic/README.md`, with exact prompt sidecars beside both WebP assets. Current desktop, mobile, and ultrawide captures are in `.impeccable/hero-cinematic/revision-2-desktop-hero.png`, `revision-2-mobile-hero.png`, and `revision-2-ultrawide-hero.png`. The old cube cutout left `SiteLoader` on 2026-10-01 (see the logo section below) and is now unused; the old shadow plate is no longer used on Home.

The production build and all eight existing Home Playwright tests passed, including desktop/mobile, keyboard, reduced-motion, no-JavaScript, and ultrawide checks. ESLint passed with an explicit configuration workaround. Type checking remains blocked by an installed language-server package export issue. An existing 2px tablet overflow in the lower ProcessJourney remains outside this hero refinement.

## Logo — 2026-10-01

The approved logo (brand kit version 1) is on the site. `apps/site/src/components/brand/logo-paths.ts` holds the logo as vector paths generated from the brand kit; do not edit it by hand. `AzulLogo.astro` draws the full logo (`horizontal` in the header, `stacked` on the Home loading screen) and `SignalMark.astro` draws the mark alone (About hero). Both are sized by height in `azul.css` and are colored for dark surfaces; on a light surface set `--logo-main` and `--logo-sub`.

- Header: the horizontal logo replaces the earlier wave mark and the "Azul Online / Projects" text. It is 48px tall, 57.6px on wide screens, and 42.4px (120px wide, the kit's minimum) once the header stacks.
- Home loading screen: the stacked logo replaces the cube. Only the mark drifts; the motion-off and reduced-motion rules still stop it. `hero-cube.png` is no longer referenced.
- Tab icon: `public/favicon.svg`, `favicon.ico`, and `apple-touch-icon.png`.
- Link preview: `public/images/azul/azul-social-card.png` (1200×630), set in `src/config/portfolio.json` as `socialImageUrl`. Pages now output `og:image` and `twitter:card`.
- The footer's large "Azul Online Projects" line is still live text, not the logo.

## Working rules

- Check the implementation before assuming older design notes still match the site.
- Keep business-private material in the separate company vault.
- The brand kit masters (logo, colors, type, social assets) live in the private company repository under `brand/`. Copy in only the files the site displays.
- Preserve unrelated local changes, including the currently untracked `Claude outputs/` and `scratch/` directories.
- Run the narrowest relevant checks after changes and report what actually ran.

See [[website/Release Checklist]] for technical release work still open.
