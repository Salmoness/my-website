---
type: website-checklist
status: approved
owner: Saymon Rivas
updated: 2026-09-28
tags:
  - website
  - release
---

# Website release checklist

These are website checks; company account, legal, and operational decisions are managed outside this repository.

- [ ] Complete owner review of all five public pages on desktop and mobile.
- [ ] Connect and test the hosted enquiry form endpoint, including success and failure states.
- [ ] Confirm the branded email and production domain are live before using production mode.
- [ ] Remove the legacy `/work` route, portfolio compatibility data, and unused public assets.
- [ ] Add and verify the branded 404 page and sitemap.
- [ ] Check titles, descriptions, canonical URLs, social previews, and robots behavior.
- [ ] Verify keyboard navigation, visible focus, contrast, reduced motion, no-JavaScript access, and missing decorative media fallbacks.
- [ ] Run build, type check, lint, format check, unit tests, and browser tests.
- [ ] Review the generated `dist/` output for private material before deployment.

The form endpoint and release account values are currently incomplete. Do not mark them done until verified in the deployed environment.
